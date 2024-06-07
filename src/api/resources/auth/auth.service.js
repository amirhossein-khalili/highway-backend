import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
  encryptPassword(plainText) {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(plainText, salt);
    return hashed;
  }

  compatePassword(plainText, encrypedPassword) {
    return bcrypt.compareSync(plainText, encrypedPassword);
  }

  generateToken(user) {
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
  }
}

export default new AuthService();
