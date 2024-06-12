import Toll from './toll.model.js';

class TollController {
  static selectionToll = 'name tollPerCross location';
  static selectionTolls = 'name tollPerCross location';

  static async create(req, res, next) {
    try {
      const newToll = new Toll(req.body);
      await newToll.save();
      res.status(201).json(newToll);
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
        select: TollController.selectionTolls,
      };

      const tolls = await Toll.paginate({}, options);

      return res.json(tolls);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async findOne(req, res, next) {
    try {
      const toll = await Toll.findById(req.params.id).select(TollController.selectionTolls);
      if (!toll) return res.status(404).json({ message: 'toll not found' });
      return res.json(toll);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async edit(req, res, next) {
    try {
      const tollUpdated = await Toll.findByIdAndUpdate(req.params.id, req.body, {
        new: false,
      });
      if (!tollUpdated) return res.status(404).json({ message: 'toll not found ' });

      res.json(tollUpdated);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async destroy(req, res, next) {
    try {
      const tollRemoved = await Toll.findByIdAndDelete(req.params.id);
      if (!tollRemoved) return res.status(404).json({ message: 'toll not found ' });
      res.json(tollRemoved);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }
}

export default TollController;
