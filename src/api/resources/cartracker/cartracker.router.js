import { Router } from 'express';
import CartrackerController from './cartracker.controller.js';
import validateSchema from '../../../utils/validateSchema.utils.js';
import { newCartrackerSchema, nearStationSchema } from './cartracker.validation.js';
import RoadMiddleware from '../road/road.middleware.js';
import CarMiddleware from '../car/car.middleware.js';
import CartrackerMiddleware from './cartracker.middleware.js';

class CartrackerRouter {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router
      .route('/nearstation')
      .post(validateSchema(nearStationSchema), CartrackerController.nearStation);

    this.router
      .route('/')
      .get(CartrackerController.findAll)
      .post(validateSchema(newCartrackerSchema), CartrackerController.create);

    this.router
      .route('/illegalTrafficHeavyVehicles')
      .get(
        RoadMiddleware.narrowRoads,
        CarMiddleware.heavyCars,
        CartrackerMiddleware.processQueries,
        CartrackerController.illegalTrafficHeavyVehicles
      );

    this.router
      .route('/:id')
      .get(CartrackerController.findOne)
      .patch(validateSchema(newCartrackerSchema), CartrackerController.edit)
      .delete(CartrackerController.destroy);
  }
}

export default new CartrackerRouter().router;
