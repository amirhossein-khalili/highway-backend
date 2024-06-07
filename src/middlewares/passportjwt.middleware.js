import passport from 'passport';
import PassportJwt from 'passport-jwt';
import User from '../api/resources/user/user.model.js';

class PassportMiddleware {
  static async configJWTStrategy() {
    const opts = {
      jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    };

    passport.use(
      new PassportJwt.Strategy(opts, async (payload, done) => {
        try {
          const user = await User.findOne({ _id: payload.id });
          if (user) return done(null, user);
          else return done(null, false);
        } catch (err) {
          return done(err, null);
        }
      })
    );
  }
}

export default PassportMiddleware;
