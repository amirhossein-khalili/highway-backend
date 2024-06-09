import { Router } from 'express';
import StationController from './station.controller.js';
import validateSchema from '../../../utils/validateSchema.utils.js';
import newStationSchema from './station.validation.js';

class StationRouter {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router
      .route('/')
      .get(StationController.findAll)
      .post(validateSchema(newStationSchema), StationController.create);

    this.router
      .route('/:id')
      .get(StationController.findOne)
      .patch(validateSchema(newStationSchema), StationController.edit)
      .delete(StationController.destroy);
  }
}

export default new StationRouter().router;
