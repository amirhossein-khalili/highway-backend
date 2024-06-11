import Station from './station.model.js';

class StationController {
  static selectionStation = 'name tollPerCross location';
  static selectionStations = 'name tollPerCross location';

  static async create(req, res, next) {
    try {
      const newStation = new Station(req.body);
      await newStation.save();
      res.status(201).json(newStation);
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
        select: StationController.selectionStations,
      };

      const stations = await Station.paginate({}, options);

      return res.json(stations);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async findOne(req, res, next) {
    try {
      const station = await Station.findById(req.params.id).select(
        StationController.selectionStations
      );
      if (!station) return res.status(404).json({ message: 'station not found ' });
      return res.json(station);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async edit(req, res, next) {
    try {
      const stationUpdated = await Station.findByIdAndUpdate(req.params.id, req.body, {
        new: false,
      });
      if (!stationUpdated) return res.status(404).json({ message: 'station not found ' });

      res.json(stationUpdated);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async destroy(req, res, next) {
    try {
      const stationRemoved = await Station.findByIdAndDelete(req.params.id);
      if (!stationRemoved) return res.status(404).json({ message: 'station not found ' });
      res.json(stationRemoved);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }
}

export default StationController;
