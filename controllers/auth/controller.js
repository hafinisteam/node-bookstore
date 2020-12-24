const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

require("dotenv").config();

const AuthController = {
  async login(req, res, next) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user || !bcrypt.compareSync(req.body.password, user.password))
        throw ErrorCode.LOGIN_FAIL;

      let token = jwt.sign({ _id: user._id }, process.env.SESSION_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

      user.lastActivity = new Date();
      const userInfor = await user.save();
      if (userInfor && token) {
        token = `${token}`;
      } else {
        token = "";
      }
      return Utils.handleSuccess(res, { user, token });
    } catch (error) {
      next(error);
    }
  },
  async register(req, res, next) {
    try {
      const user = new User(req.body);
      user.lastActivity = new Date();
      const token = jwt.sign({ _id: user._id }, process.env.SESSION_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });
      const newUser = await user.save();
      return Utils.handleSuccess(res, {
        user: newUser,
        token: `${token}`,
      });
    } catch (err) {
      if (
        err.name === "MongoError" &&
        (err.code === 11000 || err.code === 11001)
      ) {
        next(ErrorCode.EMAIL_EXISTED);
      }
      next(err)
    }
  },
};

module.exports = AuthController;
