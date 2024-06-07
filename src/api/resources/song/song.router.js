import { Router } from 'express';
import SongController from './song.controller.js';
import validateSchema from '../../../utils/validateSchema.utils.js';
import newSongSchema from './song.validation.js';

class SongRouter {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router
      .route('/')
      .get(SongController.findAll)
      .post(validateSchema(newSongSchema), SongController.create);

    this.router
      .route('/:id')
      .get(SongController.findOne)
      .patch(validateSchema(newSongSchema), SongController.edit)
      .delete(SongController.destroy);
  }
}

export default new SongRouter().router;
