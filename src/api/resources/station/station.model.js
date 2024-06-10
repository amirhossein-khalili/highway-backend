import { Schema, model } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';
import mongooseSequence from 'mongoose-sequence';
const AutoIncrement = mongooseSequence(mongoose);

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
  { timestamps: true, _id: false }
);
stationSchema.plugin(AutoIncrement, {
  id: 'station_seq',
  inc_field: '_id',
});
stationSchema.plugin(mongoosePagination);
export default model('Station', stationSchema);
