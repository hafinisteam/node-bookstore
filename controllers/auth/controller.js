"use strict";
const Joi = require("joi");
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}/i;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const errorMessages = nconf.get("errorMessages");

require("dotenv").config();

const AuthController = {
  /**
   *
   * @param {Object} req            Express request object
   * @param {String} req.email      Email
   * @param {String} req.password   Password
   * @param {Object} res            Express response object
   */
  async login(req, res) {
    let schema = Joi.object().keys({
      email: Joi.string().required().regex(EMAIL_REGEX),
      password: Joi.string().required().min(6).max(30),
    });
    let result = schema.validate(req.body);
    if (result.error) {
      return Utils.handleError(res, result.error);
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      
      if (!user) return Utils.handleError(res, ErrorCode.LOGIN_FAIL);
      let passwordMatched = await bcrypt.compare(
        req.body.password,
        user.password
      );
      
      if (!passwordMatched) {
        return Utils.handleError(res, ErrorCode.LOGIN_FAIL);
      }
      let token = jwt.sign({ _id: user._id }, process.env.SESSION_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });
      user.lastActivity = new Date();
      const userInfor = await user.save();
      if (userInfor && token) {
        token = `${token}`;
      } else {
        token = "";
      }
      return Utils.handleSuccess(res, {
        user,
        token,
      });
    } catch (error) {
      return Utils.handleError(res, ErrorCode.LOGIN_FAIL);
    }
  },
  /**
   *
   * @param {Object} req            Express request object
   * @param {String} res.email      Email
   * @param {String} res.password   Password
   * @param {Object} res            Express response object
   */
  async register(req, res) {
    try {
      let schema = Joi.object().keys({
        email: Joi.string().required().regex(EMAIL_REGEX),
        password: Joi.string().required().min(6).max(30),
      });
      let result = schema.validate(req.body);
      if (result.error) {
        return Utils.handleError(res, result.error);
      }

      let user = new User(result.value);
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
        return Utils.handleError(res, ErrorCode.EMAIL_EXISTED);
      }
    }
  },
};

module.exports = AuthController;
