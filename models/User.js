const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const schema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    displayName: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
    verified: Date,
    verificationToken: String,
    resetPasswordToken: {
      token: String,
      expires: Date,
    },
    passwordReset: Date,
  },
  {
    timestamps: true,
    collation: "user",
    strict: true,
  }
);

function hashPassword(password, cb) {
  bcrypt.hash(password, 10, cb);
}

schema.virtual("isVefified").get(function (params) {
  return !!(this.verified || this.passwordReset);
});

schema.pre("save", function (next) {
  var user = this;
  if (!user.password || !user.isModified("password")) {
    return next();
  }
  hashPassword(user.password, function (err, hashed) {
    if (err) return next(err);
    user.password = hashed;
    next();
  });
});

schema.method.comparePassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

schema.options.toJSON = {
  transform: function (doc, ret, opts) {
    delete ret.password;
    delete ret.verificationToken;
    return ret;
  },
};

module.exports = mongoose.model("User", schema);
