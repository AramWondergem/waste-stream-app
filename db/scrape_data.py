from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import tqdm as pb # progress bar
import time
import json
import os
import sys
from scrape_utils import initialize_driver, close_driver, BZ_GROUP_MATERIALS_FN

CHROME_DRIVER_PATH = '/Users/josh_swerdlow/Desktop/chromedriver-mac-arm64/chromedriver'

TEST_COUNTY_INFO = {'San Mateo': {'county_id': '41', 'jurisdictions': {'San Mateo County (Unincorporated)': '41', 'Atherton': '79', 'Belmont': '93', 'Brisbane': '107', 'Burlingame': '111', 'Colma': '143', 'Daly City': '162', 'East Palo Alto': '179', 'Foster City': '204', 'Half Moon Bay': '508', 'Hillsborough': '520', 'Menlo Park': '294', 'Millbrae': '298', 'Pacifica': '328', 'Portola Valley': '357', 'Redwood City': '368', 'San Bruno': '389', 'San Carlos': '390', 'San Mateo': '406', 'South San Francisco': '444', 'Woodside': '500'}}}

"""
Given a fn within a dir rename to the desired fn
"""
def rename_file(dir, original_fn, desired_fn):
    old_file_path = os.path.join(dir, original_fn)
    new_file_path = os.path.join(dir, desired_fn)
    os.rename(old_file_path, new_file_path)


def download_xlsx_from_url(driver: webdriver,
                           url: str, dir: str, fn: str) -> None:
    driver.get(url)

    # Click the download button
    WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.ID, "ExportToExcel"))).click()

    # Wait for the file to download (you might need to adjust the time depending on the file size and network speed)
    time.sleep(5)

    """ WARNING: BUG original fn will change depending on the url endpoint """
    rename_file(dir, original_fn=BZ_GROUP_MATERIALS_FN, desired_fn=fn)

def get_payload_from_file(fn: str) -> dict[str:list[tuple]]:
    payloads = {}
    with open(fn, mode="r") as file:
        data = file.readlines()[0]
        payloads = json.loads(data)

    return payloads

def download_xlsx_from_payload(payloads: dict[str:list[str]]):
    options = webdriver.ChromeOptions()

    for dir, payload_list in pb.tqdm(payloads.items(), desc="Endpoints"):
        options.add_argument("download.default_directory={}".format(dir))

        # Suppress download confirmation prompt
        options.add_experimental_option("prefs", {
            "download.default_directory": dir,
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "safebrowsing.enabled": True
        })

        driver = initialize_driver(options)
        for payload in pb.tqdm(payload_list, desc="URLs"):
            url = payload[0]
            fn = payload[1]

            download_xlsx_from_url(driver, url, dir, fn)
        close_driver(driver)

def download_xlsx_from_file(fn: str):
    payload = get_payload_from_file(fn)
    download_xlsx_from_payload(payload)

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Error, expected a paylaod file {}".format(len(sys.argv)))
    else:
        fn = sys.argv[1]
        payloads = get_payload_from_file(fn)
        download_xlsx_from_payload(payloads)