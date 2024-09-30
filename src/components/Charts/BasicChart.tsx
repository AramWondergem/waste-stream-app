"use client";

import ChartThree from "@/components/Charts/ChartThree";
import React, {useEffect, useState} from "react";
import ChartFive from "@/components/Charts/ChartFive";
import BarChart from "@/components/Charts/BarChart";
import NivoChart from "@/components/Charts/NivoChart";
import Select from 'react-select';
import {MultiValue, ActionMeta} from 'react-select';

import ChartOne from "./ChartOne";
import {parseCSV} from "@/utils/csvUtils";
import {
    OptionType,
    getBusinessGroupOptions,
    getMaterialCategoryOptions,
    getValidMaterialTypes,
    validateMaterialTypes
} from "@/utils/filterUtils";
import {FilterBody} from "@/interfaces/body/filterBody";

const BasicChart: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [cleanData, setCleanData] = useState<any[]>([]);
    const [jurisdictions, setJurisdction] = useState<string[]>([]);
    const [businessGroupFilter, setBusinessGroupFilter] = useState<MultiValue<OptionType>>([]);
    const [materialCategoryFilter, setMaterialCategoryFilter] = useState<MultiValue<OptionType>>([]);
    const [selectedMaterialTypes, setSelectedMaterialTypes] = useState<MultiValue<OptionType>>([]);
    const [materialTypeOptions, setMaterialTypeOptions] = useState<OptionType[]>([]);
    const [loading, setLoading] = useState(true);
    const [indexKey, setIndexKey] = useState<string>("MaterialCategory");

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
        const fetchData = async () => {
            try {
                console.log('fetchData called');

                // Define the request body
                const body: FilterBody = {
                    materialCategories: ['hallo', 'boe'],
                    materialTypes: ['hallo', 'boe'],
                    counties: [],
                    businessTypes: ['hi'],
                };

                // Send POST request with appropriate options
                const response = await fetch('/api/material-types', {
                    method: 'POST', // Set method to POST
                    headers: { 'Content-Type': 'application/json' }, // Set headers to specify JSON
                    body: JSON.stringify(body), // Include the body in the request
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const result = await response.text();
                console.log("Result: ", result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);


    /* Load csv data to object only once */
    useEffect(() => {
        // Fetch the CSV file from the public folder
        fetch('/data/materialsforabusinessgroup_allcounties.csv')
            .then(response => response.text())
            .then(csvData => parseCSV(csvData))
            .then((parsedData: any[]) => {
                // Transform data to match Nivo's expected format
                const transformedData = parsedData.map(row => ({
                    MaterialCategory: row['Material Category'],
                    MaterialTonsDisposed: row['Material Tons Disposed'],
                    MaterialTonsInCurbsideOrganics: row['Material Tons in Curbside Organics'] || 1,
                    MaterialTonsInCurbsideRecycle: row['Material Tons in Curbside Recycle'] || 1,
                    MaterialTonsInOtherDiversion: row['Material Tons in Other Diversion'] || 1,
                    BusinessGroup: row['Business Group'],
                    Jurisdiction: row['Jurisdiction(s)'],
                    MaterialType: row['Material Type'],
                }));
                setData(transformedData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading CSV data:', error);
                setLoading(false);
            });
    }, []);

    const businessGroupOptions = getBusinessGroupOptions();
    const materialCategoryOptions = getMaterialCategoryOptions();

    /* Listen for material category filter changes and updated valid material
     * type options.
     *
     * Valid material type options are the intersection of selected categories
     * and all material type's category.
    */
    useEffect(() => {
        const validMaterialTypeOptions = getValidMaterialTypes(materialCategoryFilter)
        setMaterialTypeOptions(validMaterialTypeOptions);
    }, [materialCategoryFilter]);

    /* Listen for material type options changes and validate selected material
     * types.
     *
     * Validated material types are the difference of the selected material
     * types and valid material type options.
    */
    useEffect(() => {
        const validMaterialTypes = validateMaterialTypes(selectedMaterialTypes, materialTypeOptions);

        setSelectedMaterialTypes(validMaterialTypes);
    }, [materialTypeOptions]);

    /* Filter data based on filter selections
     *
     */
    useEffect(() => {
        // TODO: These could be sets from the get go...
        const businessGroups = businessGroupFilter.length === 0
            ? new Set(businessGroupOptions.map(item => item.value))
            : new Set(businessGroupFilter.map(item => item.value));
        // If no category selected, all are so we use options as a filter
        const materialCategories = materialCategoryFilter.length === 0
            ? new Set(materialCategoryOptions.map(item => item.value))
            : new Set(materialCategoryFilter.map(item => item.value));
        // If no type selected, use category to filter else use selected
        const materialTypes = selectedMaterialTypes.length === 0
            ? new Set(materialTypeOptions.map(item => item.value))
            : new Set(selectedMaterialTypes.map(item => item.value));
        // console.log(materialCategories, materialTypes)
        const filteredData = data.filter(row =>
            businessGroups.has(row.BusinessGroup) &&
            materialCategories.has(row.MaterialCategory) &&
            materialTypes.has(row.MaterialType)
        )

        // console.log("Filtered: ", filteredData)

        const filteredAggData = filteredData.reduce<Data[]>((acc, curr) => {
                let existingData = null;
                if (selectedMaterialTypes.length === 0) {
                    setIndexKey("MaterialCategory")
                    existingData = acc.find(
                        (row: Data) => row.MaterialCategory === curr.MaterialCategory
                    );
                } else {
                    setIndexKey("MaterialType")
                    existingData = acc.find(
                        (row: Data) => row.MaterialType === curr.MaterialType
                    );
                }

                if (existingData) {
                    existingData.MaterialTonsDisposed += curr.MaterialTonsDisposed;
                    existingData.MaterialTonsInCurbsideOrganics += curr.MaterialTonsInCurbsideOrganics;
                    existingData.MaterialTonsInCurbsideRecycle += curr.MaterialTonsInCurbsideRecycle;
                    existingData.MaterialTonsInOtherDiversion += curr.MaterialTonsInOtherDiversion;
                } else {
                    acc.push({...curr});
                }
                return acc;
            }, []
        );
        setCleanData(filteredAggData);

    }, [data, businessGroupFilter, selectedMaterialTypes]);

    // useEffect(() => console.log(cleanData), [cleanData]);

    const handleBusinessGroupChange = (selectedOptions: MultiValue<OptionType>) => {
        setBusinessGroupFilter(selectedOptions)
    }

    const handleCategoryChange = (selectedOptions: MultiValue<OptionType>) => {
        setMaterialCategoryFilter(selectedOptions);
    }

    const handleMaterialTypeChange = (selectedOptions: MultiValue<OptionType>) => {
        setSelectedMaterialTypes(selectedOptions);
    }

    return (
        <>
            <div className="dropdown-container" style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{flex: '1', margin: '0 10px'}}>
                    <label>Business Groups</label>
                    <Select isMulti
                            options={businessGroupOptions}
                            value={businessGroupFilter}
                            onChange={handleBusinessGroupChange}
                    />
                </div>
                <div style={{flex: '1', margin: '0 10px'}}>
                    <label>Material Categories</label>
                    <Select isMulti
                            options={materialCategoryOptions}
                            value={materialCategoryFilter}
                            onChange={handleCategoryChange}
                    />
                </div>
                <div style={{flex: '1', margin: '0 10px'}}>
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
                        <h2 className="text-xl font-bold mb-4">Data visualized</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : cleanData.length === 0 ? (
                            <p>No data available for the selected filters.</p>
                        ) : (
                            <NivoChart data={cleanData} index={indexKey}/>
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
