import { Router } from 'express';
import AuthController from './auth.controller.js';
import AuthMiddleware from './auth.middleware.js';
import validateSchema from '../../../utils/validateSchema.utils.js';
import { loginSchema, signupSchema } from './auth.validation.js';

class AuthRouter {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router
      .route('/signup')
      .post(validateSchema(signupSchema), AuthMiddleware.checkUniqueSignup, AuthController.signup);

    this.router.route('/login').post(validateSchema(loginSchema), AuthController.login);
  }
}

export default new AuthRouter().router;
