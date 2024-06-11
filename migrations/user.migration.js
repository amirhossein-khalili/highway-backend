import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../src/api/resources/user/user.model.js';
import Car from '../src/api/resources/car/car.model.js';
import Cartracker from '../src/api/resources/cartracker/cartracker.model.js';
import dotenv, { config } from 'dotenv';
import authService from '../src/api/resources/auth/auth.service.js';
dotenv.config();

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read data from JSON file
const usersDataFilePath = join(__dirname, '../data/owners.json');
const usersRawData = readFileSync(usersDataFilePath, 'utf8');
const carsDataFilePath = join(__dirname, '../data/cars.json');
const carsRawData = readFileSync(carsDataFilePath, 'utf8');
const cartrackersDataFilePath = join(__dirname, '../data/all_nodes.json');
const cartrackersRawData = readFileSync(cartrackersDataFilePath, 'utf8');

//data that we have
const usersData = JSON.parse(usersRawData);
const carsData = JSON.parse(carsRawData);
const cartrackersData = JSON.parse(cartrackersRawData);

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
    mongoose.connect(process.env.DB);

    // Insert Users and Cars
    for (const userData of usersData) {
      try {
        const cars = userData.ownerCar;
        const password = userData.national_code.toString() || '1234';
        const user = await User.create({
          firstName: userData.name,
          nationalCode: userData.national_code,
          age: userData.age,
          password: authService.encryptPassword(password),
          totalTollPaid: userData.total_toll_paid,
        });
        const newUserId = user._id;

        for (const car of cars) {
          try {
            const resp = await Car.create({
              // _id: car._id,
              type: car.type,
              color: car.color,
              length: car.length,
              loadVolume: car.load_volume,
              owner: newUserId,
            });
            const pastCarId = car.id;
            const newCarId = resp._id;
            const cartrackers = cartrackersData.filter((item) => item.car === pastCarId);

            for (const cartracker of cartrackers) {
              try {
                const transformedLocation = convertLocation(cartracker.location);
                // console.log(transformedLocation.coordinates);
                const resp2 = Cartracker.create({
                  car: newCarId,
                  date: cartracker.date,
                  location: { type: 'point', coordinates: transformedLocation },
                });
              } catch (err) {
                console.log(err);
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  } catch (error) {
    console.error('Error migrating data:', error);
  }
};

migrateData();
console.log('migrating data completed successfully');
