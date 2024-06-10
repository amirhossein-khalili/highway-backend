import mongoose, { Schema, model } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';
import mongooseSequence from 'mongoose-sequence';
const AutoIncrement = mongooseSequence(mongoose);

const cartrackerSchema = new Schema(
  {
    _id: Number,
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
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
    date: Date,
  },
  { timestamps: true }
);

cartrackerSchema.plugin(AutoIncrement, { inc_field: 'cartrackerId' });
cartrackerSchema.plugin(mongoosePagination);

export default model('Cartracker', cartrackerSchema);
