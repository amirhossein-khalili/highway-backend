import { model, mongoose } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';

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

carSchema.plugin(mongoosePagination);
export default model('Car', carSchema);
