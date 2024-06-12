import Road from './road.model.js';

class RoadMiddleware {
  static async narrowRoads(req, res, next) {
    try {
      const roads = await Road.find({ width: { $lt: 20 } }).select('_id name width location');
      req.narrowRoads = roads;
      return next();
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }
}

export default RoadMiddleware;
