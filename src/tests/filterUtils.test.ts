// __tests__/filterUtils.test.ts
import { OptionType, getBusinessGroupOptions, getMaterialCategoryOptions, getValidMaterialTypes, validateMaterialTypes, difference, intersection, interdifference } from '@/utils/filterUtils';
import BusinessGroups from '@/data/BusinessGroups.json';
import MaterialTypes from '@/data/MaterialTypes.json';
import { MultiValue } from 'react-select';

describe('filterUtils', () => {
    beforeEach(() => {
        jest.resetModules(); // Clear module cache
    });

    test('difference operator where A is a partial subset of B', () => {
        const A: Array<number> = [1, 4, 5, 6, 7]
        const B: Array<number> = [1, 2, 3, 4, 5]
        const expected: Array<number> = [6, 7]

        expect(difference(A, B)).toEqual(expected)
    });

    test('difference operator where A is a complete subset of B', () => {
        const A: Array<number> = [1, 4, 5]
        const B: Array<number> = [1, 2, 3, 4, 5]
        const expected: Array<number> = []

        expect(difference(A, B)).toEqual(expected)
    });

    test('difference operator where B is a partial subset of A', () => {
        const A: Array<number> = [1, 2, 3, 4, 5]
        const B: Array<number> = [1, 4, 5, 7, 8, 9]
        const expected: Array<number> = [2, 3]

        expect(difference(A, B)).toEqual(expected)
    });

    test('difference operator where B is a complete subset of A', () => {
        const A: Array<number> = [1, 2, 3, 4, 5]
        const B: Array<number> = [1, 4, 5]
        const expected: Array<number> = [2, 3]

        expect(difference(A, B)).toEqual(expected)
    });

    test('difference operator where A and B do not overlap', () => {
        const A: Array<number> = [6, 7, 8]
        const B: Array<number> = [1, 2, 3, 4, 5]
        const expected: Array<number> = [6, 7, 8]

        expect(difference(A, B)).toEqual(expected)
    });

    test('difference operator where A and B completely overlap', () => {
        const A: Array<number> = [6, 7, 8]
        const B: Array<number> = [6, 7, 8]
        const expected: Array<number> = []

        expect(difference(A, B)).toEqual(expected)
    });

    test('intersection operator where A is a partial subset of B', () => {
        const A: Array<number> = [1, 4, 5, 6, 7]
        const B: Array<number> = [1, 2, 3, 4, 5]
        const expected: Array<number> = [1, 4, 5]

        expect(intersection(A, B)).toEqual(expected)
    });

    test('intersection operator where A is a complete subset of B', () => {
        const A: Array<number> = [1, 4, 5]
        const B: Array<number> = [1, 2, 3, 4, 5]
        const expected: Array<number> = [1, 4, 5]

        expect(intersection(A, B)).toEqual(expected)
    });

    test('intersection operator where B is a partial subset of A', () => {
        const A: Array<number> = [1, 2, 3, 4, 5]
        const B: Array<number> = [1, 4, 5, 7, 8, 9]
        const expected: Array<number> = [1, 4, 5]

        expect(intersection(A, B)).toEqual(expected)
    });

    test('intersection operator where B is a complete subset of A', () => {
        const A: Array<number> = [1, 2, 3, 4, 5]
        const B: Array<number> = [1, 4, 5]
        const expected: Array<number> = [1, 4, 5]

        expect(intersection(A, B)).toEqual(expected)
    });

    test('intersection operator where A and B do not overlap', () => {
        const A: Array<number> = [6, 7, 8]
        const B: Array<number> = [1, 2, 3, 4, 5]
        const expected: Array<number> = []

        expect(intersection(A, B)).toEqual(expected)
    });

    test('intersection operator where A and B completely overlap', () => {
        const A: Array<number> = [6, 7, 8]
        const B: Array<number> = [6, 7, 8]
        const expected: Array<number> = [6, 7, 8]

        expect(intersection(A, B)).toEqual(expected)
    });

    test('interdifference operator where A is a partial subset of B', () => {
        const A: Array<number> = [1, 4, 5, 6, 7]
        const B: Array<number> = [1, 2, 3, 4, 5]
        const expected: Array<number> = [1, 4, 5, 6, 7]

        expect(interdifference(A, B)).toEqual(expected)
    });

    test('interdifference operator where A is a complete subset of B', () => {
        const A: Array<number> = [1, 4, 5]
        const B: Array<number> = [1, 2, 3, 4, 5]
        const expected: Array<number> = [1, 4, 5]

        expect(interdifference(A, B)).toEqual(expected)
    });

    test('interdifference operator where B is a partial subset of A', () => {
        const A: Array<number> = [1, 2, 3, 4, 5]
        const B: Array<number> = [1, 4, 5, 7, 8, 9]
        const expected: Array<number> = [1, 4, 5, 2, 3]

        expect(interdifference(A, B)).toEqual(expected)
    });

    test('interdifference operator where B is a complete subset of A', () => {
        const A: Array<number> = [1, 2, 3, 4, 5]
        const B: Array<number> = [1, 4, 5]
        const expected: Array<number> = [1, 4, 5, 2, 3]

        expect(interdifference(A, B)).toEqual(expected)
    });

    test('interdifference operator where A and B do not overlap', () => {
        const A: Array<number> = [6, 7, 8]
        const B: Array<number> = [1, 2, 3, 4, 5]
        const expected: Array<number> = [6, 7, 8]

        expect(interdifference(A, B)).toEqual(expected)
    });

    test('interdifference operator where A and B completely overlap', () => {
        const A: Array<number> = [6, 7, 8]
        const B: Array<number> = [6, 7, 8]
        const expected: Array<number> = [6, 7, 8]

        expect(interdifference(A, B)).toEqual(expected)
    });

    test('getValidMaterialTypes should return correct options based on categories', () => {
        const categories: MultiValue<OptionType> = [
            { label: "Household Hazardous Waste (HHW)", value: "Household Hazardous Waste (HHW)"}
        ];

        const expected: OptionType[] = [
            {label : "Paint", value: "Paint"},
            {label : "Vehicle and Equipment Fluids", value: "Vehicle and Equipment Fluids"},
            {label : "Used Oil", value: "Used Oil"},
            {label : "Batteries", value: "Batteries"},
            {label : "Remainder / Composite Household Hazardous", value: "Remainder / Composite Household Hazardous"},
        ];

        expect(getValidMaterialTypes(categories)).toEqual(expected);
    });

    test('validateMaterialTypes when there are invalid selected', () => {
        const selected: OptionType[] = [
            {label : "Paint", value: "Paint"},
            {label : "Vehicle and Equipment Fluids", value: "Vehicle and Equipment Fluids"},
            {label : "Used Oil", value: "Used Oil"},
            {label : "Batteries", value: "Batteries"},
            {label : "Remainder / Composite Household Hazardous", value: "Remainder / Composite Household Hazardous"},
        ];

        const options: OptionType[] = [
            {label : "Paint", value: "Paint"},
            {label : "Vehicle and Equipment Fluids", value: "Vehicle and Equipment Fluids"},
        ];

        const expected: OptionType[] = [
            {label : "Paint", value: "Paint"},
            {label : "Vehicle and Equipment Fluids", value: "Vehicle and Equipment Fluids"},
        ];

        expect(validateMaterialTypes(selected, options)).toEqual(expected);
    });

    test('validateMaterialTypes when there are no invalid selected', () => {
        const selected: OptionType[] = [
            {label : "Paint", value: "Paint"},
            {label : "Vehicle and Equipment Fluids", value: "Vehicle and Equipment Fluids"},
        ];

        const options: OptionType[] = [
            {label : "Paint", value: "Paint"},
            {label : "Vehicle and Equipment Fluids", value: "Vehicle and Equipment Fluids"},
            {label : "Used Oil", value: "Used Oil"},
            {label : "Batteries", value: "Batteries"},
            {label : "Remainder / Composite Household Hazardous", value: "Remainder / Composite Household Hazardous"},
        ];

        const expected: OptionType[] = [
            {label : "Paint", value: "Paint"},
            {label : "Vehicle and Equipment Fluids", value: "Vehicle and Equipment Fluids"},
            {label : "Used Oil", value: "Used Oil"},
            {label : "Batteries", value: "Batteries"},
            {label : "Remainder / Composite Household Hazardous", value: "Remainder / Composite Household Hazardous"},
        ];

        expect(validateMaterialTypes(selected, options)).toEqual(expected);
    });

    test('validateMaterialTypes when all selected are invalid', () => {
        const selected: OptionType[] = [
            {label : "Paint", value: "Paint"},
            {label : "Vehicle and Equipment Fluids", value: "Vehicle and Equipment Fluids"},
            {label : "Used Oil", value: "Used Oil"},
            {label : "Batteries", value: "Batteries"},
            {label : "Remainder / Composite Household Hazardous", value: "Remainder / Composite Household Hazardous"},
        ];

        const options: OptionType[] = [];

        const expected: OptionType[] = [];

        expect(validateMaterialTypes(selected, options)).toEqual(expected);
    });

    test('validateMaterialTypes when there are no selected', () => {
        const selected: OptionType[] = [];

        const options: OptionType[] = [
            {label : "Paint", value: "Paint"},
            {label : "Vehicle and Equipment Fluids", value: "Vehicle and Equipment Fluids"},
            {label : "Used Oil", value: "Used Oil"},
            {label : "Batteries", value: "Batteries"},
            {label : "Remainder / Composite Household Hazardous", value: "Remainder / Composite Household Hazardous"},
        ];

        const expected: OptionType[] = [
            {label : "Paint", value: "Paint"},
            {label : "Vehicle and Equipment Fluids", value: "Vehicle and Equipment Fluids"},
            {label : "Used Oil", value: "Used Oil"},
            {label : "Batteries", value: "Batteries"},
            {label : "Remainder / Composite Household Hazardous", value: "Remainder / Composite Household Hazardous"},
        ];;

        expect(validateMaterialTypes(selected, options)).toEqual(expected);
    });
});
