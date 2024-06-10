import { model, mongoose } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';
import mongooseSequence from 'mongoose-sequence';
const AutoIncrement = mongooseSequence(mongoose);

const carSchema = new mongoose.Schema(
  {
    _id: Number,
    type: {
      type: String,
      enum: ['small', 'big'],
      default: 'small',
    },
    color: String,
    length: Number,
    loadVolume: Number,
    owner: {
      type: Number,
      ref: 'User',
    },
    softDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, _id: false }
);

carSchema.plugin(AutoIncrement, {
  id: 'car_seq',
  inc_field: '_id',
});
carSchema.plugin(mongoosePagination);

export default model('Car', carSchema);
