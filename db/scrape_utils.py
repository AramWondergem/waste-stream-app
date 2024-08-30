from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
import tqdm as pb # progress bar
import json
import os

# Set the path to the chromedriver executable
CHROME_DRIVER_PATH = '/Users/josh_swerdlow/Desktop/chromedriver-mac-arm64/chromedriver'

""" String formatting syntax
- FirstSecond (paired)
- First_Second (list)
- First-Second (hierarchical)

Examples:
Arts_Entertainment_Recreation => Arts, Entertainment, and Recreation
Manufacturing-Food_NondurableWholesale
    => Manufacturing: Food and Nondurable Wholesale
"""
BUSINESS_GROUP_IDS = {
    "Arts_Entertainment_Recreation" : 101,
    "DurableWholesale_Trucking" : 104,
    "Education" : 105,
    "Hotels_Lodging" : 106,
    "Manufacturing-AllOther" : 109,
    "Manufacturing-ElectronicEquipment" : 107,
    "Manufacturing-Food_NondurableWholesale" : 108,
    "Medical_Health" : 110,
    "Multifamily" : 119,
    "NotElsewhereClassified" : 118,
    "PublicAdministration" : 111,
    "Restaurants" : 112,
    "RetailTrade_AllOther" : 114,
    "RetailTrade-Food_Beverage Stores" : 113,
    "Services-Management_Administrative_Support_Social" : 115,
    "Services-Professional_Technical_Financial" : 116,
    "Services-Repair_Personal" : 117
}

# URL of the page containing the button to download the file
URL = 'https://www2.calrecycle.ca.gov/WasteCharacterization/BusinessGroupStreams'

""" Different Pre-Defined County Lists """
MVP_COUNTIES = ['Alameda', 'San Mateo', 'Los Angeles', 'San Joaquin', 'Santa Cruz', 'San Luis Obispo', 'San Diego', 'El Dorado', 'Nevada', 'Fresno']
SINGLE_COUNTY = ['Alameda']


TEST_COUNTY_INFO = {'San Mateo': {'county_id': '41', 'jurisdictions': {'San Mateo County (Unincorporated)': '41', 'Atherton': '79', 'Belmont': '93', 'Brisbane': '107', 'Burlingame': '111', 'Colma': '143', 'Daly City': '162', 'East Palo Alto': '179', 'Foster City': '204', 'Half Moon Bay': '508', 'Hillsborough': '520', 'Menlo Park': '294', 'Millbrae': '298', 'Pacifica': '328', 'Portola Valley': '357', 'Redwood City': '368', 'San Bruno': '389', 'San Carlos': '390', 'San Mateo': '406', 'South San Francisco': '444', 'Woodside': '500'}}}

# Global debug variable :p
DEBUG = 0

WORKING_DIR = "/Users/josh_swerdlow/Desktop/scrape/"

# Default file names for the two types of files we are downloading
BZ_GROUP_MATERIALS_FN = 'BusinessGroupsForAMaterial'
BZ_GROUP_MATERIALS_URL = 'https://www2.calrecycle.ca.gov/WasteCharacterization/BusinessGroupStreams?cy={}&lg={}'

MATS_FOR_BZ_GROUP_FN = 'MaterialsForABusinessGroup'
MATS_FOR_BZ_GROUP_URL = 'https://www2.calrecycle.ca.gov/WasteCharacterization/MaterialTypeStreams?cy={}&lg={}&bg={}'

""" Make a url conisisting of county id and juris id and/or business group id
Depending on whether bg_id is provided will determine which endpoint we access.
"""
def gen_url(c_id: int, j_id: int, bg_id: int = None) -> str:
    url = ""
    if bg_id is None:
        url = BZ_GROUP_MATERIALS_URL.format(c_id, j_id)
    else:
        url = MATS_FOR_BZ_GROUP_URL.format(c_id, j_id, bg_id)

    return url

""" Make a file conisisting of county name and juris name and/or business group
name.
Depending on whether bg_name is provided will determine which file we make.
Clean name strings to be OK as file names.
1. No Spaces (i.e. El Dorado => ElDorado)
2. No escapable characters (i.e. Alameda (Countywide) => AlemedaCountywide)
3. c_name-j_name-bg_name
4. .xlsx is appending to end
"""
def gen_file(c_name: str, j_name: str, bg_name: str = None) -> str:
    fn = ""
    # bg_name is manually cleaned
    # c_name contains spaces so we remove them to make it camel case
    c_name = "".join(c_name.split()) # Covert to camel case

    # j_name contains spaces and ( ). Remove ( and ). Camel case
    j_name = "".join(j_name.replace('(', '').replace(')','').split())

    if bg_name is None:
        fn = "_".join([c_name, j_name]) + ".xlsx"
    else:
        fn = "_".join([c_name, j_name, bg_name]) + ".xlsx"

    return fn

def gen_path(payload_name: str, file_name: str) -> str:
    return os.path.join(WORKING_DIR, payload_name, file_name)

def initialize_driver(options=None) -> webdriver:
    service = webdriver.ChromeService(executable_path=CHROME_DRIVER_PATH)
    driver = webdriver.Chrome(service=service)

    return driver

def close_driver(driver: webdriver):
    driver.quit()

""" Get a county's numeric representation (id) via a chrome webdriver.
Access the default URL to find the county id for a given county string.
"""
def get_county_id(driver: webdriver,
                  county: str) -> int:
    # Open the webpage
    driver.get(URL)

    county_dropdown = Select(driver.find_element(By.ID, "CountyID"))

    county_id = -1
    for option in county_dropdown.options:
        if county == option.text:
            county_id = option.get_attribute('value')

    return county_id

""" Get one or more county's jurisdictions's ids via a chrome webdriver.
@param included_counties: a list of county names to include in the search.
@param exclude_county_wide_juris: a boolean flag to exclude the countywide
    jurisdiction that is included in every county's list of jurisdictions.

@return A dictionary mapping a county to a dictionary of jurisdiction ids.
{
    'Alemeda' : {
        'county_id' : 1,
        'Jurisdictions' : {'Alemeda (Countywide)': 1}
    }
}
"""
def get_county_breakdown(driver: webdriver,
                         included_counties: list[str],
                         exclude_county_wide_juris: bool=True) -> dict[str:int|dict[str:int]]:

    url = 'https://www2.calrecycle.ca.gov/WasteCharacterization/BusinessGroupStreams?cy={}'

    counties_info = {}
    for c_name in pb.tqdm(included_counties, desc='Counties'):
        c_id = get_county_id(driver, c_name)

        if c_id == -1:
            print("Warning! No county id found for {}. Skipping.".format(c_name))
            continue

        driver.get(url.format(c_id))

        jurisdiction_element = driver.find_element(By.ID, "LocalGovernmentIDList")
        jurisdiction_dropdown = Select(jurisdiction_element)

        if DEBUG:
            print("County: {}".format(c_name))

        # Iterate through each option in the dropdown with a progress bar
        jurisdiction_dict = {}
        for option in pb.tqdm(jurisdiction_dropdown.options, desc="\t{}\'s Jurisdictions".format(c_name)):
            j_name = option.get_attribute('innerText')
            j_id = option.get_attribute('value')

            # Skip Countywide jurisdiction (i.e 'Alameda (Countywide)') options
            if exclude_county_wide_juris and 'Countywide' in j_name:
                continue

            if DEBUG:
                print("Jurisdiction: {}".format(j_name))

            jurisdiction_dict[j_name] = j_id

    counties_info[c_name] = {'county_id': c_id,
                             'jurisdictions' : jurisdiction_dict}

    if DEBUG:
        print(counties_info)

    return counties_info

def gen_payload(payload_name: str,
                county_info: dict[str: int | dict[str:int]]=None,
                counties: list[str]=None,
                exclude_county_wide_juris: bool=True) -> dict[str: int | dict[str:int]]:

    if not county_info: # We need to fetch the data
        if not counties:
            print("Error: If we don't have jurisdiction ids we need to fetch them using a provided list of counties")
            return payload_name
        else:
            driver = initialize_driver()
            county_info = get_county_breakdown(driver,
                                             counties, exclude_county_wide_juris)
            close_driver(driver)

    # At this point we have all the information we need to generate the payloads
    fp_bzgs = gen_path(payload_name, BZ_GROUP_MATERIALS_FN + "Files")
    fp_mats = gen_path(payload_name, MATS_FOR_BZ_GROUP_FN + "Files")

    payloads = {fp_mats : [], fp_bzgs : []}
    for county_name, info in county_info.items():
        county_id = info['county_id']
        juris_info = info['jurisdictions']
        for juris_name, juris_id in juris_info.items():
            url = gen_url(county_id, juris_id)
            fn = gen_file(county_name, juris_name)
            payloads[fp_bzgs].append((url, fn))
            for bzg_name, bzg_id in BUSINESS_GROUP_IDS.items():
                url = gen_url(county_id, juris_id, bzg_id)
                fn = gen_file(county_name, juris_name, bzg_name)
                payloads[fp_mats].append((url, fn))

    payloads_string = json.dumps(payloads)
    payloads_path = os.path.join(WORKING_DIR, payload_name + ".json")
    with open(payloads_path, "w") as f:
        f.write(payloads_string)

    payload_stats(payloads)

    return payloads

def payload_stats(payload) -> None:
    dirs = 0
    urls = 0
    for k,v in payload.items():
        dirs += 1
        urls += len(v)
    print("Payload will require {} downloads to complete".format(dirs * urls))

if __name__ == '__main__':
    payload = gen_payload("SingleCountyPayload", counties=SINGLE_COUNTY)
