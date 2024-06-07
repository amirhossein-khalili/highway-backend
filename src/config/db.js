import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
export const connect = () => mongoose.connect(process.env.DB);
