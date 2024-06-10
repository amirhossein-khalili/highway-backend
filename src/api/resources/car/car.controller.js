import Car from './car.model.js';

class CarController {
  static selectionCar = 'type color length owner';
  static selectionCars = 'type color length owner';

  static async create(req, res, next) {
    try {
      const newCar = new Car(req.body);
      await newCar.save();
      res.status(201).json(newCar);
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
        select: CarController.selectionCars,
      };

      const cars = await Car.paginate({}, options);

      return res.json(cars);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async findOne(req, res, next) {
    try {
      const car = await Car.findById(req.params.id)
        .select(CarController.selectionCars)
        .populate('owner', 'id firstName');

      if (!car) return res.status(404).json({ message: 'car not found ' });
      return res.json(car);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async edit(req, res, next) {
    try {
      const carUpdated = await Car.findByIdAndUpdate(req.params.id, req.body, {
        new: false,
      });
      if (!carUpdated) return res.status(404).json({ message: 'car not found ' });

      res.json(carUpdated);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async destroy(req, res, next) {
    try {
      const carRemoved = await Car.findByIdAndDelete(req.params.id);
      if (!carRemoved) return res.status(404).json({ message: 'car not found ' });
      res.json(carRemoved);
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }
}

export default CarController;
