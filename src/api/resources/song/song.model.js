import { Schema, model } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';

const songSchema = new Schema({
  title: {
    type: String,
    require: [true, 'Song must have a title'],
  },
  url: {
    type: String,
    require: [true, 'Song must have a url'],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
});

songSchema.plugin(mongoosePagination);
export default model('Song', songSchema);
