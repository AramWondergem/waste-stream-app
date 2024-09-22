import BusinessGroups from '@/data/BusinessGroups.json';
import MaterialTypes from '@/data/MaterialTypes.json';
import { MultiValue } from 'react-select'; // Import MultiValue from react-select


export interface OptionType {
    label: string;
    value: string;
}

// Function to get business group options
export const getBusinessGroupOptions = (): OptionType[] => {
    return BusinessGroups.map((item: any) => ({
        label: item['Business Group'],
        value: item['Business Group'],
    }));
};

// Function to get material category options
export const getMaterialCategoryOptions = (): OptionType[] => {
    return Array.from(new Set(MaterialTypes.map((item: any) => item.Category))).map((item: string) => ({
        label: item,
        value: item
    }));
};

// Function to get valid material types based on categories
export const getValidMaterialTypes = (categories: MultiValue<OptionType>): OptionType[] => {
    return MaterialTypes.filter((item: any) => {
        return categories.length === 0 ||
               categories.some(category => category.value === item.Category)
    }).map((item: any) => ({
        label: item['Material Type'],
        value: item['Material Type']
    }));
};

// Find the intersection between two lists
export function intersection(arrayA: MultiValue<OptionType>, arrayB: MultiValue<OptionType>): any[] {
    const setB = new Set(arrayB.map(item => item.value));
    return arrayA.filter(item => { return setB.has(item.value); })
}

/* Valid material types are the difference of the selected material
 * types and valid material type options.
 */
export const validateMaterialTypes = (selected: MultiValue<OptionType>, options: MultiValue<OptionType>): OptionType[] => {
    return intersection(selected, options);

};
