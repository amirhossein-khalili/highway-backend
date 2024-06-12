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
const roadData = JSON.parse(rawData);

function extractCoordinates(data) {
  const geom = data.geom;
  const coordinatesString = geom.match(/MULTILINESTRING\s*\(\(([^)]+)\)\)/)[1];
  const coordinates = coordinatesString.split(',').map((coord) => {
    const [longitude, latitude] = coord.trim().split(' ').map(Number);
    return [longitude, latitude];
  });

  return coordinates;
}

function groupCoordinates(coordinates) {
  const groupedCoordinates = [];
  for (let i = 0; i < coordinates.length - 1; i += 2) {
    groupedCoordinates.push([coordinates[i], coordinates[i + 1]]);
  }
  return groupedCoordinates;
}

const migrateData = async () => {
  try {
    await mongoose.connect(process.env.DB);

    for (const data of roadData) {
      const geom = extractCoordinates(data);
      if (typeof geom[0][0] !== 'number') {
      } else {
        const coordinates = groupCoordinates(geom);
        const multiLineString = { type: 'MultiLineString', coordinates: coordinates };

        await Road.create({
          name: data.name,
          width: data.width,
          location: multiLineString,
        });
      }
    }

    // console.log('Migration completed.');
  } catch (error) {
    console.error('Error migrating data:', error);
  } finally {
    mongoose.disconnect();
  }
};

migrateData();
