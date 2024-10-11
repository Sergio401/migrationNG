import { createWriteStream } from 'fs';
import csvParser from 'csv-parser';
import { writeToStream } from 'fast-csv';
import { convertToUpdatedObj } from './helpers.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = path.join(__dirname, 'ngComplete.csv');
const outputFilePath = path.join(__dirname, 'ngComplete_modified.csv');

const records = [];

const readCSV = async () => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(inputFilePath);
    readStream
      .pipe(csvParser({ separator: ';' })) // Cambiar el separador a punto y coma
      .on('data', (row) => {
        const rawFilterColumn = row['raw_filter'];
        try {
          const updatedObj = convertToUpdatedObj(JSON.parse(rawFilterColumn));
          row['equipment_filter_updated'] = JSON.stringify(updatedObj);
        } catch (error) {
          // Si hay un error, establecer el registro en cero
          row['equipment_filter_updated'] = '0';
        }      
        records.push(row);
      })
      .on('end', () => {
        resolve(records);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

const writeCSV = async (records) => {
  return new Promise((resolve, reject) => {
    const ws = createWriteStream(outputFilePath);
    writeToStream(ws, records, { headers: true, delimiter: ';' })
      .on('finish', () => {
        resolve('CSV processed successfully');
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

(async () => {
  try {
    await readCSV();
    const message = await writeCSV(records);
    console.log(message);
  } catch (error) {
    console.error('Error processing the CSV file:', error);
  }
})();