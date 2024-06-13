import { Router } from 'express';
import TollController from './toll.controller.js';
import TollMiddleware from './toll.middleware.js';
import passport from 'passport';

class TollRouter {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router
      .route('/user')
      .get(passport.authenticate('jwt', { session: false }), TollController.user);

    this.router.route('/car/:carId').get(TollMiddleware.checkCarExist, TollController.car);

    this.router.route('/violetlist').get(TollController.violetlist);
  }
}

export default new TollRouter().router;
