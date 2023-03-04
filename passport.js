let JWTStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("./models/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

module.exports = (passport) => {
  passport.use(
    new JWTStrategy(opts, async (jwtPayload, done) => {
      if (jwtPayload?.id) {
        let user = await User.findById(jwtPayload.id);
        return done(null, jwtPayload);
      }
      return done(null, jwtPayload);
    })
  );
};
