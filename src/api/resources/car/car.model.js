import { model, mongoose, ObjectId } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';
import mongooseSequence from 'mongoose-sequence';
const AutoIncrement = mongooseSequence(mongoose);

const carSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['small', 'big'],
      default: 'small',
    },
    color: String,
    length: Number,
    loadVolume: Number,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    softDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// carSchema.plugin(AutoIncrement, {
//   id: 'car_seq',
//   inc_field: '_id',
// });
carSchema.plugin(mongoosePagination);

export default model('Car', carSchema);
