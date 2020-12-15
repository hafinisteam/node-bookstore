const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("../models/User");

require("dotenv").config();

function initialize(app) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.SESSION_SECRET;
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      User.findOne(
        {
          _id: jwt_payload._id,
        },
        (err, user) => {
          if (err) done(err, false);
          if (user) done(null, user);
        }
      );
    })
  );

  app.use(passport.initialize());
}

module.exports = initialize;
