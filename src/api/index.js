import express from 'express';
import SongRouter from './resources/song/song.router.js';
import AuthRouter from './resources/auth/auth.router.js';
import UserRouter from './resources/user/user.router.js';

export const restRouter = express.Router();
restRouter.use('/auth', AuthRouter);
restRouter.use('/songs', SongRouter);
restRouter.use('/users', UserRouter);
