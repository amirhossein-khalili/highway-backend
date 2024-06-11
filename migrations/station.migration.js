import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Station from '../src/api/resources/station/station.model.js';
import dotenv from 'dotenv';
dotenv.config();
// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read data from JSON file
const stationsDataFilePath = join(__dirname, '../data/tollStations.json');
const stationsRawData = readFileSync(stationsDataFilePath, 'utf8');
const stationsData = JSON.parse(stationsRawData);

const convertLocation = (location) => {
  // Remove the 'SRID=4326;' part

  const [_, coordinates] = location.replace('SRID=4326;', '').trim().split('POINT ');

  // Remove the parentheses and split the coordinates
  const coords = coordinates.replace('(', '').replace(')', '').trim().split(' ').map(Number);

  // Check for NaN values and return the correct result
  if (coords.some(isNaN)) {
    throw new Error('Invalid coordinates');
  }

  // Return the coordinates as an array
  return coords;
};

const migrateData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB);

    // Check if connection was successful
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Failed to connect to MongoDB');
    }

    // console.log('Connected to MongoDB successfully');

    // Insert Stations
    for (const stationData of stationsData) {
      // Transform location coordinates
      const transformedLocation = convertLocation(stationData.location);
      await Station.create({
        name: stationData.name,
        tollPerCross: stationData.toll_per_cross,
        location: { type: 'point', coordinates: transformedLocation },
      });
      // console.log(`Station ${stationData.name} inserted successfully`);
    }
  } catch (error) {
    console.error('Error migrating data:', error);
  } finally {
    // Ensure the connection is closed after all operations
    await mongoose.connection.close();
    // console.log('Connection to MongoDB closed');
  }
};

migrateData();
