class CartrackerMiddleware {
  static async processQueries(req, res, next) {
    try {
      let itemQueries = {};

      // Filter by startTime
      if (req.query.startTime) {
        const startTime = new Date(req.query.startTime);
        itemQueries.date = { $gte: startTime };
      }

      // Filter by endTime
      if (req.query.endTime) {
        const endTime = new Date(req.query.endTime);
        itemQueries.date = { $lte: endTime };
      }

      if (req.query.startTime && req.query.endTime) {
        const startTime = new Date(req.query.startTime);
        const endTime = new Date(req.query.endTime);

        itemQueries.date = { $gte: startTime, $lte: endTime };
      }

      req.itemQueries = itemQueries;
      return next();
    } catch (error) {
      console.error(error);
      res.status(500).json('An error occurred, please try again later');
    }
  }
}

export default CartrackerMiddleware;
