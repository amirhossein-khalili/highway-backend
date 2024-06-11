import { Schema, model, mongoose } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';

const roadSchema = new mongoose.Schema({
  name: String,
  width: Number,
  location: {
    type: {
      type: String,
      enum: ['MultiLineString', 'point'],
      default: 'MultiLineString',
    },
    coordinates: [
      {
        type: [Number],
        index: '2dsphere',
      },
    ],
  },
});

// roadSchema.index({ location: '2dsphere' });
roadSchema.plugin(mongoosePagination);

export default model('Road', roadSchema);
