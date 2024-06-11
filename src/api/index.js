import express from 'express';
import AuthRouter from './resources/auth/auth.router.js';
import UserRouter from './resources/user/user.router.js';
import CarRouter from './resources/car/car.router.js';
import CartrackerRouter from './resources/cartracker/cartracker.router.js';
import RoadRouter from './resources/road/road.router.js';
import StationRouter from './resources/station/station.router.js';

export const restRouter = express.Router();
restRouter.use('/auth', AuthRouter);
restRouter.use('/cars', CarRouter);
restRouter.use('/cartrackers', CartrackerRouter);
restRouter.use('/roads', RoadRouter);
restRouter.use('/stations', StationRouter);
restRouter.use('/users', UserRouter);
