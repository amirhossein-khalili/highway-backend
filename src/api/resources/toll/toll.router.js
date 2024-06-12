import { Router } from 'express';
import TollController from './toll.controller.js';

class TollRouter {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.route('/').get(TollController.findAll);
  }
}

export default new TollRouter().router;
