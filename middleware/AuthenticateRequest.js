const passport = require("passport");

const AuthenticateRequest = passport.authenticate("jwt", {
  session: false,
});

module.exports = AuthenticateRequest