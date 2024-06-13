import Cartracker from './cartracker.model.js';
import Station from '../station/station.model.js';
import Car from '../car/car.model.js';
import CartrackerService from './cartracker.service.js';

class CartrackerController {
  static selectionCartracker = 'car location date';
  static selectionCartrackers = 'car location date';
  static selectionIllegalTrafficHeavyVehicles = 'car location date';
  static selectionPopulateCarIllegalTrafficHeavyVehicles = 'type color length owner';

  static async create(req, res, next) {
    try {
      const newCartracker = new Cartracker(req.body);
      await newCartracker.save();
      res.status(201).json(newCartracker);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async findAll(req, res, next) {
    try {
      const { page, perPage } = req.query;
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10,
        select: CartrackerController.selectionCartrackers,
      };

      const cartrackers = await Cartracker.paginate({}, options);

      return res.json(cartrackers);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async findOne(req, res, next) {
    try {
      const cartracker = await Cartracker.findById(req.params.id).select(
        CartrackerController.selectionCartrackers
      );
      if (!cartracker) return res.status(404).json({ message: 'cartracker not found ' });
      return res.json(cartracker);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async edit(req, res, next) {
    try {
      const cartrackerUpdated = await Cartracker.findByIdAndUpdate(req.params.id, req.body, {
        new: false,
      });
      if (!cartrackerUpdated) return res.status(404).json({ message: 'cartracker not found ' });

      res.json(cartrackerUpdated);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async destroy(req, res, next) {
    try {
      const cartrackerRemoved = await Cartracker.findByIdAndDelete(req.params.id);
      if (!cartrackerRemoved) return res.status(404).json({ message: 'cartracker not found ' });
      res.json(cartrackerRemoved);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async illegalTrafficHeavyVehicles(req, res, next) {
    try {
      const heavyCars = req.heavyCars;
      const narrowRoads = req.narrowRoads;
      const query = req.itemQueries || {};
      query.car = { $in: heavyCars };

      const cartrackers = await Cartracker.find(query)
        .populate('car', CartrackerController.selectionPopulateCarIllegalTrafficHeavyVehicles)
        .select(CartrackerController.selectionIllegalTrafficHeavyVehicles);

      let allResults = [];
      for (const cartracker of cartrackers) {
        const point = cartracker.location[0].coordinates;
        for (const road of narrowRoads) {
          const roadCoordinates = road.location.coordinates;
          for (const roadCoordinate of roadCoordinates) {
            const result = CartrackerService.isPointOnLineString(point, roadCoordinate);
            if (result.isOnLine == true) {
              allResults.push(cartracker);
            }
          }
        }
      }
      return res.send({ allResults });
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async nearStation(req, res, next) {
    try {
      // Ensure the date is properly parsed from the request body or default to the current date
      const date = req.body.date ? new Date(req.body.date) : new Date();

      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }

      // Calculate the time range (±2 minutes)
      const startDate = new Date(date.getTime() - 5 * 60 * 1000); // 5 minutes before
      const endDate = new Date(date.getTime() + 5 * 60 * 1000); // 5 minutes after

      const range = req.body.range;
      const carType = req.body.carType;

      // Fetch the station by ID
      const station = await Station.findById(req.body.stationId);
      if (!station) return res.status(404).json({ message: 'Station not found' });

      // Fetch cars by type
      const cars = await Car.find({ type: carType }).select('_id').lean();
      if (!cars.length) return res.status(404).json({ message: 'No cars found' });

      // Fetch car trackers within the time range and for the given cars
      const cartrackers = await Cartracker.find({
        car: { $in: cars.map((car) => car._id) },
        date: { $gte: startDate, $lte: endDate },
      }).populate('car');

      const stationCoordinates = station.location[0].coordinates;
      let nearStationCars = [];
      for (const cartracker of cartrackers) {
        const cartrackerCoordinates = cartracker.location[0].coordinates;
        const kmRange = range / 1000;
        const resp = CartrackerService.calculateDistanceAndCompare(
          stationCoordinates,
          cartrackerCoordinates,
          kmRange
        );
        if (resp.comparisonResult == 'less') nearStationCars.push(cartracker.car);
      }

      const uniqueNearStationCars = Array.from(new Set(nearStationCars.map((car) => car._id))).map(
        (id) => nearStationCars.find((car) => car._id === id)
      );
      return res.json({ nearStationCars: uniqueNearStationCars });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred, please try again later' });
    }
  }
}

export default CartrackerController;
