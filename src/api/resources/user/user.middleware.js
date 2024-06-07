import User from './user.model.js';

class UserMiddleware {
  static async checkUnique(req, res, next) {
    try {
      const email = req.body.email;
      const user = await User.findById({ email: email });
      if (user)
        return res.status(403).send({ error: 'you have already signup , please use sign in ' });
      else return next();
    } catch (error) {
      console.error(error);
      res.status(500).json('an error occurred please try again later');
    }
  }
}

export default UserMiddleware;
