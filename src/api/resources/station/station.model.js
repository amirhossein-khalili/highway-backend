import { Schema, model } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';

const stationSchema = new Schema(
  {
    _id: Number,
    name: String,
    tollPerCross: Number,
    location: [
      {
        type: {
          type: String,
          enum: ['point'],
          default: 'point',
        },
        coordinates: {
          type: [Number],
          index: '2dsphere',
        },
      },
    ],
  },
  { timestamps: true }
);

stationSchema.plugin(mongoosePagination);
export default model('Station', stationSchema);
