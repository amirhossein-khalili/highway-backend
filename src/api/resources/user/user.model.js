import mongoose, { Schema, model } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';
import mongooseSequence from 'mongoose-sequence';
const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new Schema(
  {
    // _id: Number,
    firstName: String,
    lastName: String,
    nationalCode: String,
    age: Number,
    totalTollPaid: Number,
    role: {
      type: String,
      enum: ['admin', 'client', 'superadmin'],
      default: 'client',
    },
    ownerCar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
    },
    softDelete: {
      type: Boolean,
      default: false,
    },
    email: String,
    phoneNumber: String,
    password: { type: String },
  },
  { timestamps: true }
);

// userSchema.plugin(AutoIncrement, {
//   id: 'user_seq',
//   inc_field: '_id',
// });
userSchema.plugin(mongoosePagination);

export default model('User', userSchema);
