import Road from './road.model.js';

class RoadController {
  static selectionRoad = 'title url rating';
  static selectionRoads = 'title url rating';

  static async create(req, res, next) {
    try {
      const newRoad = new Road(req.body);
      await newRoad.save();
      res.status(201).json(newRoad);
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
        select: RoadController.selectionRoads,
      };

      const roads = await Road.paginate({}, options);

      return res.json(roads);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async findOne(req, res, next) {
    try {
      const road = await Road.findById(req.params.id).select(RoadController.selectionRoads);
      if (!road) return res.status(404).json({ message: 'road not found ' });
      return res.json(road);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async edit(req, res, next) {
    try {
      const roadUpdated = await Road.findByIdAndUpdate(req.params.id, req.body, {
        new: false,
      });
      if (!roadUpdated) return res.status(404).json({ message: 'road not found ' });

      res.json(roadUpdated);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async destroy(req, res, next) {
    try {
      const roadRemoved = await Road.findByIdAndDelete(req.params.id);
      if (!roadRemoved) return res.status(404).json({ message: 'road not found ' });
      res.json(roadRemoved);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }
}

export default RoadController;
