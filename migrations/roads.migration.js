import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import Road from '../src/api/resources/road/road.model.js';

// Load environment variables from .env file
dotenv.config();

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read data from JSON file
const dataFilePath = join(__dirname, '../data/roads.json');
const rawData = readFileSync(dataFilePath, 'utf8');

function parseMultiLineString(geom) {
  // Extract coordinates from the MULTILINESTRING string
  const matches = geom.match(/MULTILINESTRING\s*\(\(([^)]+)\)\)/);
  if (matches) {
    const lines = matches[1].split('), (');
    return lines.map((line) => line.split(', ').map((point) => point.split(' ').map(Number)));
  }
  return [];
}

const roadData = JSON.parse(rawData);
const migrateData = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/highwayDB', {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    for (const data of roadData) {
      const geoms = parseMultiLineString(data.geom);
      for (const g of geoms) {
        Road.create({
          name: data.name,
          width: data.width,
          geom: { type: 'MultiLineString', coordinates: g },
        });
      }
    }

    mongoose.disconnect();
    console.log('Migration completed.');
  } catch (error) {
    console.error('Error migrating data:', error);
    mongoose.connection.close();
  }
};

migrateData();
