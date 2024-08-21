"use client";

import ChartThree from "@/components/Charts/ChartThree";
import React, { useEffect, useState } from "react";
import { GetStaticProps } from 'next';
import ChartFive from "@/components/Charts/ChartFive";
import BarChart from "@/components/Charts/BarChart";
import NivoChart from "@/components/Charts/NivoChart";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";
import SelectGroupTwo from "@/components/FormElements/SelectGroup/SelectGroupTwo";
import SelectGroupThree from "@/components/FormElements/SelectGroup/SelectGroupThree";
import Select from 'react-select';
import { MultiValue, ActionMeta } from 'react-select';



import MultiSelect from "@/components/FormElements/MultiSelect";
import ChartOne from "./ChartOne";
import MaterialTypes from "../../../public/data/MaterialTypes.json"
import BusinessGroups from "../../../public/data/BusinessGroups.json"
import path from 'path';
import { parseCSV } from "@/utils/csvUtils";
import fs from 'fs';

interface DataProps {
    materials: any[];
    businesses: any[];
}

// export const getStaticProps: GetStaticProps = async () => {
//     // Define paths to JSON files
//     const materialsPath = path.join(process.cwd(), 'public/data/materials.json');
//     const businessesPath = path.join(process.cwd(), 'public/data/businesses.json');

//     // Read and parse JSON files
//     const materials = JSON.parse(MaterialTypes);
//     const businesses = JSON.parse(BusinessGroups);

//     return {
//         props: {
//             materials,
//             businesses,
//         },
//     };
// };

const BasicChart: React.FC = () => {
    interface OptionType {
        label: string;
        value: string;
    }

    const [data, setData] = useState<any[]>([]);
    const [jurisdictions, setJurisdction] = useState<string[]>([]);
    const [businessGroupFilter, setBusinessGroupFilter] = useState<MultiValue<OptionType>>([]);
    const [materialCategoryFilter, setMaterialCategoryFilter] = useState<MultiValue<OptionType>>([]);
    const [selectedMaterialTypes, setSelectedMaterialTypes] = useState<MultiValue<OptionType>>([]);
    const [materialTypeOptions, setMaterialTypeOptions] = useState<OptionType[]>([]);
    const [loading, setLoading] = useState(true);

    interface Data {
        MaterialCategory: string;
        MaterialTonsDisposed: number;
        MaterialTonsInCurbsideOrganics: number;
        MaterialTonsInCurbsideRecycle: number;
        MaterialTonsInOtherDiversion: number;
        BusinessGroup: string;
        Jurisdiction: string;
        MaterialType: string;
    }

    useEffect(() => {
        // Fetch the CSV file from the public folder
        fetch('/data/materialsforabusinessgroup_allcounties.csv')
            .then(response => response.text())
            .then(csvData => parseCSV(csvData))
            .then((parsedData: any[]) => {
                // Transform data to match Nivo's expected format
                const transformedData = parsedData.map(row => ({
                    MaterialCategory: row['Material Category'],
                    MaterialTonsDisposed : row['Material Tons Disposed'],
                    MaterialTonsInCurbsideOrganics : row['Material Tons in Curbside Organics'] || 1,
                    MaterialTonsInCurbsideRecycle : row['Material Tons in Curbside Recycle'] || 1,
                    MaterialTonsInOtherDiversion : row['Material Tons in Other Diversion'] || 1,
                    BusinessGroup : row['Business Group'],
                    Jurisdiction : row['Jurisdiction(s)'],
                    MaterialType : row['Material Type'],
                }));
                // console.log("Transformed Data: ", transformedData);
                setData(transformedData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading CSV data:', error);
                setLoading(false);
            });
    }, []);

    console.log(data);

    const aggregatedData = data.reduce<Data[]>((acc, curr) => {
        const existingCategory = acc.find(
            (row: Data) => row.MaterialCategory === curr.MaterialCategory
        );

        if (existingCategory) {
            existingCategory.MaterialTonsDisposed += curr.MaterialTonsDisposed;
            existingCategory.MaterialTonsInCurbsideOrganics += curr.MaterialTonsInCurbsideOrganics;
            existingCategory.MaterialTonsInCurbsideRecycle += curr.MaterialTonsInCurbsideRecycle;
            existingCategory.MaterialTonsInOtherDiversion += curr.MaterialTonsInOtherDiversion;
        } else {
            acc.push({ ...curr });
        }
      return acc;
    }, []);

    console.log("MaterialTypes: ", MaterialTypes)
    console.log("BusinessGroups: ", BusinessGroups)

    const businessGroupOptions = BusinessGroups.map( (item, index) => {
        return {
            label : item['Business Group'],
            value : item['Business Group'],
        };
    });

    const materialCategoryOptions: OptionType[] = Array.from(new Set(MaterialTypes.map(item => item.Category))).map( (item) => {
        return {
            label : item,
            value : item
        }
    })

    // const materialTypeOptions: OptionType[] = MaterialTypes.filter(item => {
    //     return materialCategoryFilter.length === 0 ||
    //            materialCategoryFilter.some(categ => categ.value === item.Category)
    //     }
    // ).map( (item) => {
    //     return {
    //         label : item['Material Type'],
    //         value : item['Material Type'],
    //     }
    // })

    const handleBusinessGroupChange = (selectedOptions: MultiValue<OptionType>) => {
        setBusinessGroupFilter(selectedOptions)
    }

    useEffect(() => {
            const filteredMaterialTypeOptions = MaterialTypes.filter(item => {
                return materialCategoryFilter.length === 0 ||
                       materialCategoryFilter.some(categ => categ.value === item.Category)
            }).map(item => ({
                label: item['Material Type'],
                value: item['Material Type'],
            }));

            setMaterialTypeOptions(filteredMaterialTypeOptions);

            const validMaterialTypes = materialTypeOptions.filter(opt => {
                return selectedMaterialTypes.length === 0 ||
                        selectedMaterialTypes.some(item => {return item.value == opt.value;}
                    )
                }
            );
            console.log("UE: Selected Material Types: ", selectedMaterialTypes);
            console.log("UE: Material Type Options: ", materialTypeOptions);
            console.log("UE: Valid Material Types: ", validMaterialTypes);
            setSelectedMaterialTypes(validMaterialTypes);
        }, [materialCategoryFilter]
    );
    console.log("MT Options: ", materialTypeOptions)

    /* TODO:
     * The selectedMaterialTypes doesn't get invalidated correctly.
    */
    const handleCategoryChange = (selectedOptions: MultiValue<OptionType>) => {
        setMaterialCategoryFilter(selectedOptions || []);
        // console.log("Selected types: ", selectedMaterialTypes);
        // console.log("Eligible types: ", materialTypeOptions);
        // const validMaterialTypes = selectedMaterialTypes.filter(item => {
        //         return materialTypeOptions.some(opt => opt.value == item.value)
        //     })
        // console.log("HDL: Selected Material Types: ", selectedMaterialTypes);
        // console.log("HDL: Material Type Options: ", materialTypeOptions);
        // console.log("HDL: Valid Material Types: ", validMaterialTypes);
        // setSelectedMaterialTypes(validMaterialTypes)
    }

    const handleMaterialTypeChange = (selectedOptions: MultiValue<OptionType>) => {
        setSelectedMaterialTypes(selectedOptions);
    }

    console.log("BGs: ", businessGroupFilter)
    console.log("MCs: ", materialCategoryFilter)
    console.log("MTs: ", selectedMaterialTypes)

    return (
    <>
    <div>
        <div>
            <label>Business Groups</label>
            <Select isMulti
                options={businessGroupOptions}
                value={businessGroupFilter}
                onChange={handleBusinessGroupChange}
            />
        </div>
        <div>
            <label>Material Categories</label>
            <Select isMulti
                options={materialCategoryOptions}
                value={materialCategoryFilter}
                onChange={handleCategoryChange}
            />
        </div>
        <div>
            <label>Material Types</label>
            <Select isMulti
                options={materialTypeOptions}
                value={selectedMaterialTypes}
                onChange={handleMaterialTypeChange}
            />
        </div>
    </div>
    <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-bold mb-4"> My Chart </h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <NivoChart data={aggregatedData} />
                    )}
            </div>
        </div>
    </div>
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Bar Chart</h2>
            <BarChart/>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Chart 3</h2>
            <ChartThree/>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Chart 5</h2>
            <ChartFive/>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Chart 1</h2>
            <ChartOne/>
        </div>
      </div>
    </div>
    </>
    );
};

export default BasicChart;
