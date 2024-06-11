import { Router } from 'express';
import RoadController from './road.controller.js';
import validateSchema from '../../../utils/validateSchema.utils.js';
import newRoadSchema from './road.validation.js';

class RoadRouter {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router
      .route('/')
      .get(RoadController.findAll)
      .post(validateSchema(newRoadSchema), RoadController.create);

    this.router
      .route('/:id')
      .get(RoadController.findOne)
      .patch(validateSchema(newRoadSchema), RoadController.edit)
      .delete(RoadController.destroy);
  }
}

export default new RoadRouter().router;
