import User from '../user/user.model.js';
import Car from '../car/car.model.js';

class CarMiddleware {
  static async proccessQueries(req, res, next) {
    try {
      let itemQueries = {};

      if (req.query.owenerAge) {
        const users = await User.find({ age: { $gt: req.query.owenerAge } }).select('_id');
        const userIds = users.map((user) => user._id.toString());

        itemQueries.owner = { $in: userIds };
      }
      if (req.query.color) itemQueries.color = { $eq: req.query.color };
      if (req.query.type) itemQueries.type = { $eq: req.query.type };

      req.itemQueries = itemQueries;
      return next();
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async heavyCars(req, res, next) {
    try {
      const heavyCars = await Car.find({ type: 'big' }).distinct('_id');
      req.heavyCars = heavyCars;
      return next();
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }
}

export default CarMiddleware;
