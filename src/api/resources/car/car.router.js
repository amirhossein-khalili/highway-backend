import { Router } from 'express';
import CarController from './car.controller.js';
import validateSchema from '../../../utils/validateSchema.utils.js';
import newCarSchema from './car.validation.js';

class CarRouter {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router
      .route('/')
      .get(CarController.findAll)
      .post(validateSchema(newCarSchema), CarController.create);

    this.router
      .route('/:id')
      .get(CarController.findOne)
      .patch(validateSchema(newCarSchema), CarController.edit)
      .delete(CarController.destroy);
  }
}

export default new CarRouter().router;
