import User from '../user/user.model.js';

class CarMiddleware {
  static async proccessQueries(req, res, next) {
    try {
      let itemQueries = {};

      if (req.query.age) {
        const users = await User.find({ age: { $gt: req.query.age } }).select('_id');
        const userIds = users.map((user) => user._id.toString());

        itemQueries.owner = { $in: userIds };
      }
      if (req.query.color) itemQueries.color = { $eq: req.query.color };

      req.itemQueries = itemQueries;
      return next();
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }
}

export default CarMiddleware;
