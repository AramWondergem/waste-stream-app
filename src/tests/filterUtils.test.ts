// __tests__/filterUtils.test.ts
import { OptionType, getBusinessGroupOptions, getMaterialCategoryOptions, getValidMaterialTypes, validateMaterialTypes, intersection } from '@/utils/filterUtils';
import BusinessGroups from '@/data/BusinessGroups.json';
import MaterialTypes from '@/data/MaterialTypes.json';
import { MultiValue } from 'react-select';

describe('filterUtils', () => {
    beforeEach(() => {
        jest.resetModules(); // Clear module cache
    });

    test('intersection operator: exact match', () => {
        const A: MultiValue<OptionType> = [
            { label: "A", value: "1" },
            { label: "B", value: "2" },
        ];
        const B: MultiValue<OptionType> = [
            { label: "A", value: "1" },
            { label: "B", value: "2" },
        ];

        const expected: MultiValue<OptionType> = [{ label: "A", value: "1" }, { label: "B", value: "2" }]

        expect(intersection(A, B)).toEqual(expected)
    });

    test('intersection operator: no match', () => {
        const A: MultiValue<OptionType> = [
            { label: "C", value: "3" },
            { label: "D", value: "4" },
        ];
        const B: MultiValue<OptionType> = [
            { label: "A", value: "1" },
            { label: "B", value: "2" },
        ];

        const expected: MultiValue<OptionType> = []

        expect(intersection(A, B)).toEqual(expected)
    });

    test('intersection operator partial match', () => {
        const A: MultiValue<OptionType> = [
            { label: "A", value: "1" },
            { label: "D", value: "4" },
        ];
        const B: MultiValue<OptionType> = [
            { label: "A", value: "1" },
            { label: "B", value: "2" },
        ];
        const expected: MultiValue<OptionType> = [{ label: "A", value: "1" }]

        expect(intersection(A, B)).toEqual(expected)
    });

    test('intersection operator: Empty array', () => {
        const A: MultiValue<OptionType> = [];
        const B: MultiValue<OptionType> = [
            { label: "A", value: "1" },
            { label: "B", value: "2" },
        ];
        const expected: MultiValue<OptionType> = [];

        expect(intersection(A, B)).toEqual(expected)
    });

    test('intersection operator: Empty arrays', () => {
        const A: MultiValue<OptionType> = [];
        const B: MultiValue<OptionType> = [];
        const expected: MultiValue<OptionType> = [];
        expect(intersection(A, B)).toEqual(expected)
    });

    test('intersection operator: duplicate entries', () => {
        const A: MultiValue<OptionType> = [
            { label: "A", value: "1" },
            { label: "A", value: "1" }, // Duplicate in A
        ];
        const B: MultiValue<OptionType> = [
            { label: "A", value: "1" },
            { label: "B", value: "2" },
        ];
        const expected: MultiValue<OptionType> = [
            { label: "A", value: "1" },
            { label: "A", value: "1" }
        ]
        expect(intersection(A, B)).toEqual(expected)
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
        ];;

        expect(validateMaterialTypes(selected, options)).toEqual(expected);
    });
});
