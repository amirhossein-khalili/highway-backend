import mongoose, { Schema, model } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';

const userSchema = new Schema(
  {
    _id: Number,
    firstName: {
      type: String,
      require: [true, 'user must have a firstName'],
    },
    lastName: String,
    nationalCode: String,
    age: Number,
    totalTollPaid: Number,
    role: ['admin', 'client', 'superadmin'],
    ownerCar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
    },
    softDelete: {
      type: Boolean,
      default: false,
    },
    email: { type: String, unique: true },
    phoneNumber: { type: String, unique: true },
    password: { type: String },
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePagination);

export default model('User', userSchema);
