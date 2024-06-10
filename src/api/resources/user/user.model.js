import mongoose, { Schema, model } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';
import mongooseSequence from 'mongoose-sequence';
const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new Schema(
  {
    _id: Number,
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
    ownerCar: Number,
    softDelete: {
      type: Boolean,
      default: false,
    },
    email: { type: String, unique: true },
    phoneNumber: { type: String, unique: true },
    password: { type: String },
  },
  { timestamps: true, _id: false }
);

userSchema.plugin(AutoIncrement, {
  id: 'user_seq',
  inc_field: '_id',
});
userSchema.plugin(mongoosePagination);

export default model('User', userSchema);
