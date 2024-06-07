import { Router } from 'express';
import UserController from './user.controller.js';
import UserMiddleware from './user.middleware.js';
import validateSchema from '../../../utils/validateSchema.utils.js';
import passport from 'passport';

class UserRouter {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router
      .route('/')
      .get(passport.authenticate('jwt', { session: false }), UserController.findAll)
      .post(
        passport.authenticate('jwt', { session: false }),
        UserMiddleware.checkUnique,
        UserController.create
      );

    this.router
      .route('/:id')
      .get(passport.authenticate('jwt', { session: false }), UserController.findOne)
      .patch(passport.authenticate('jwt', { session: false }), UserController.edit)
      .delete(passport.authenticate('jwt', { session: false }), UserController.destroy);
  }
}

export default new UserRouter().router;
