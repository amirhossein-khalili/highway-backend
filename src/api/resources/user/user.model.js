import { Schema, model } from 'mongoose';
import mongoosePagination from 'mongoose-paginate-v2';

const userSchema = new Schema({
  firstName: {
    type: String,
    require: [true, 'user must have a firstName'],
  },
  lastName: String,
  email: { type: String, require: [true, 'user must have a email'], unique: true },
  password: { type: String, require: [true, 'user must have passwrod'] },
});

userSchema.plugin(mongoosePagination);

export default model('User', userSchema);
