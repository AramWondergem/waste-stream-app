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
    return MaterialTypes.filter((item: any) =>
        categories.length === 0 ||
        categories.some(category => category.value === item.Category)
    ).map((item: any) => ({
        label: item['Material Type'],
        value: item['Material Type']
    }));
};

// Find the difference between two lists
export function difference(arrayA: any[], arrayB: any[]): any[] {
    // Create a Set from arrayB to optimize lookups
    const setB = new Set(arrayB.map(item => item));

    // Filter arrayA to include only items not in setB
    return arrayA.filter(item => !setB.has(item));
}

// Find the intersection between two lists
export function intersection(arrayA: any[], arrayB: any[]): any[] {
    const setB = new Set(arrayB.map(item => item));

    return arrayA.filter(item => setB.has(item))
}

/* Combine the intersection and difference (called interdifference) between two
 * lists
 */
export function interdifference(arrayA: any[], arrayB: any[]): any[] {
    const intr = intersection(arrayA, arrayB);
    const diff = difference(arrayA, arrayB);

    const comb = new Set([...intr, ...diff])

    return Array.from(comb);
}

/* Valid material types are the difference of the selected material
 * types and valid material type options.
 */
export const validateMaterialTypes = (selected: OptionType[], options: OptionType[]): OptionType[] => {
    return interdifference(options, selected);
};
