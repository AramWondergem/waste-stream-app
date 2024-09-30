// src/utils/csvUtils.ts
import Papa from 'papaparse';

export const parseCSV = (csvData: string) => {
    return new Promise<any[]>((resolve, reject) => {
        Papa.parse(csvData, {
            header: true,
            dynamicTyping: true,
            complete: (result) => {
                console.log('Parsed data:', result.data); // Debugging line
                resolve(result.data);
            },
            error: (error: Error) => {
                console.error('CSV Parsing Error:', error); // Debugging line
                reject(error);
            }
        });
    });
};
