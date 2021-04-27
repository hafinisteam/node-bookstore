const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const sendMail = require("../../lib/sendMail");
const crypto = require("crypto");

require("dotenv").config();

const AuthController = {
  async login(req, res, next) {
    try {
      // Find if user exist with email
      const user = await User.findOne({ email: req.body.email });
      // If user exists and password comparing match with bcript
      if (!user || !bcrypt.compareSync(req.body.password, user.password))
        throw ErrorCode.LOGIN_FAIL;
      // Check if verified, if not throw error
      if (!user.isVefified) throw ErrorCode.EMAIL_NEED_VERIFY;
      // Create token
      let token = jwt.sign({ _id: user._id }, process.env.SESSION_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });

      user.lastActivity = new Date();
      const userInfor = await user.save();
      // If userInfor save successfully
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
      // Create verification token to send to email
      // user.verificationToken = randomTokenString();
      const account = await user.save();
      // await sendVerificationEmail(account);
      return Utils.handleSuccess(res, {
        user: account,
        token: `${token}`,
      });
    } catch (err) {
      console.log(err);
      if (
        err.name === "MongoError" &&
        (err.code === 11000 || err.code === 11001)
      ) {
        next(ErrorCode.EMAIL_EXISTED);
      }
      next(err);
    }
  },
  async verifyEmail(req, res, next) {
    try {
      // Find user with verification token
      const account = await User.findOne({ verificationToken: req.body.token });
      if (!account) throw ErrorCode.USER_NOT_EXIST;
      // Clear token 
      account.verificationToken = undefined;
      account.verified = Date.now();
      await account.save();
      return Utils.handleSuccess(res);
    } catch (error) {
      next(error);
    }
  },
};

function randomTokenString() {
  return crypto.randomBytes(40).toString("hex");
}

async function sendVerificationEmail(account) {
  const message = `
    <p>Please use the below token to verify your email address with the <code>/auth/verify-email</code> api route:</p>
    <p><code>${account.verificationToken}</code></p>
  `;
  await sendMail({
    to: account.email,
    subject: "Sign-up Verification API - Verify Email",
    html: `
      <h4>Verify Email</h4>
      <p>Thanks for registering!</p>
      ${message}
    `,
  });
}

module.exports = AuthController;
