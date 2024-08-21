import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';

// Determine the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
    "MaterialTypes",
    "BusinessGroups"
]

const convertedFilePaths = files.map((file) => {
    return {
        csvFilePath: path.join(__dirname, "../public/data", `${file}.csv`),
        jsonFilePath: path.join(__dirname, "../public/data", `${file}.json`)
    }
});

const csv2json = (csvFilePath, jsonFilePath) => {
    fs.readFile(csvFilePath, 'utf8', (err, csvData) => {
        if (err) {
            console.error('Error reading CSV file:', err);
            return;
        }

        const parsedData = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
        }).data;

        fs.writeFile(jsonFilePath, JSON.stringify(parsedData, null, 2), (err) => {
            if (err) {
            console.error('Error writing JSON file:', err);
            return;
            }
            console.log('CSV successfully converted to JSON!');
        });
    });
}

convertedFilePaths.forEach(({csvFilePath, jsonFilePath}) =>
    csv2json(csvFilePath, jsonFilePath)
)