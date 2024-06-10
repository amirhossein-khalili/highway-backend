import { Router } from 'express';
import CarController from './car.controller.js';
import validateSchema from '../../../utils/validateSchema.utils.js';
import newCarSchema from './car.validation.js';
import CarMiddleware from './car.middleware.js';

class CarRouter {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router
      .route('/')
      .get(CarMiddleware.proccessQueries, CarController.findAll)
      .post(validateSchema(newCarSchema), CarController.create);

    this.router
      .route('/:id')
      .get(CarController.findOne)
      .patch(validateSchema(newCarSchema), CarController.edit)
      .delete(CarController.destroy);
  }
}

export default new CarRouter().router;
