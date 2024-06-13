import CartrackerHelper from './cartracker.helper.js';
import Cartracker from './cartracker.model.js';
import Car from '../car/car.model.js';
import { point, multiLineString, booleanPointInPolygon } from '@turf/turf';
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
}

export default CartrackerController;
