import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import Car from '../src/api/resources/car/car.model.js';

// Load environment variables from .env file
dotenv.config();

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read data from JSON file
const dataFilePath = join(__dirname, '../data/cars.json');
const rawData = readFileSync(dataFilePath, 'utf8');
const data = JSON.parse(rawData);

const migrateData = async () => {
  try {
    await mongoose.connect('mongodb://127.o.0.1:27017/highwayDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const formattedData = data.map((item) => ({
      _id: item.id,
      type: item.type,
      color: item.color,
      length: item.length,
      loadVolume: item.load_valume,
    }));

    await Car.insertMany(formattedData);
    console.log('Data migration successful');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error migrating data:', error);
    mongoose.connection.close();
  }
};

migrateData();
