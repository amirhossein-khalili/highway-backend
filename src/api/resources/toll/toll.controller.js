import Station from '../station/station.model.js';
import Car from '../car/car.model.js';
import CartrackerService from '../cartracker/cartracker.service.js';
import TollHelper from './toll.helper.js';
import TollService from './toll.service.js';

class TollController {
  static selectionCartracker = 'type color length';
  static selectionStation = 'name tollPerCross location';

  static async user(req, res, next) {
    try {
      const userId = req.query.userId || String(req.user._id);
      const cars = await Car.find({ owner: userId })
        .select(TollController.selectionCartracker)
        .lean();

      const queryItems = req.itemQueries || {};
      let tolls = [];
      let totalTollUser = 0;
      for (const car of cars) {
        const carId = car._id;
        const query = queryItems;

        query.car = { $eq: carId };
        const resp = await TollService.car(query);
        totalTollUser = totalTollUser + resp.totalToll;

        tolls.push({ car: car, toll: resp });
      }
      // console.log(req.)
      res.status(200).json({ tolls, totalTollUser });
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async car(req, res, next) {
    try {
      const carId = req.params.carId;
      const query = req.itemQueries || {};
      query.car = { $eq: carId };
      const resp = await TollService.car(query);

      res.status(200).json(resp);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }
}

export default TollController;
