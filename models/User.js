const mongoose = require("mongoose");
const bcript = require("bcryptjs");
const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const schema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    displayName: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
  },
  {
    timestamps: true,
    collation: "user",
    strict: true,
  }
);

schema.virtual("fullName").get(function () {
  return this.firstName + "" + this.lastName;
});

function hasPassword(password, cb) {
  bcript.hash(password, 10, cb);
}

schema.pre("save", function (next) {
  var user = this;
  if (!user.password || !user.isModified("password")) {
    return next();
  }
  hasPassword(user.password, function (err, hashed) {
    if (err) return next(err);
    user.password = hashed;
    next();
  });
});

schema.method.comparePassword = function (password) {
  return new Promise((resolve, reject) => {
    bcript.compare(password, this.password, function (err, isMatch) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

schema.options.toJSON = {
  transform: function (doc, ret, opts) {
    delete ret.password;
    return ret;
  },
};

module.exports = mongoose.model("User", schema);
