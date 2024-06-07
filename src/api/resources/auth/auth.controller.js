import User from '../user/user.model.js';
import AuthService from './auth.service.js';

class AuthController {
  static async signup(req, res, next) {
    try {
      const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: AuthService.encryptPassword(req.body.password),
      });

      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }

  static async login(req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await User.findOne({ email: email });
      if (!user) return res.status(401).send({ message: 'please try signup first' });

      const authenticated = AuthService.compatePassword(password, user.password);
      if (!authenticated) return res.status(401).send({ message: 'invalid password' });

      const token = AuthService.generateToken(user);
      res.status(201).json({ success: true, token: token });
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }
}

export default AuthController;
