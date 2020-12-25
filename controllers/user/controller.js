const User = require("../../models/User");
const sendMail = require("../../lib/sendMail");
const crypto = require("crypto");

require("dotenv").config();

const UserController = {
  async forgotPassword(req, res, next) {
    try {
      const account = await User.findOne({ email: req.body.email });
      if (!account) throw ErrorCode.USER_NOT_EXIST;
      account.resetToken = {
        token: randomTokenString(),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
      await account.save();
      await sendResetPasswordEmail(account);
      return Utils.handleSuccess(res);
    } catch (error) {
      next(error)
    }
  },
  async resetPassword(req, res, next) {
    try {
      const account = await User.findOne({
        "resetToken.token": req.body.token,
        "resetToken.expires": { $gt: Date.now() },
      });
      if (!account) throw ErrorCode.INVALID_TOKEN;
      account.password = req.body.password;
      account.passwordReset = Date.now();
      account.resetToken = undefined;
      return Utils.handleSuccess(res)
    } catch (error) {
      next(error);
    }
  },
  async updateProfile(req, res, next) {
    try {
      let account = await User.findOne({ _id: req.user.id })
      console.log(account)
      if(!account) throw ErrorCode.USER_NOT_EXIST
      Object.assign(account, req.body)
      await account.save()
      return Utils.handleSuccess(res)
    } catch (error) {
      if(Utils.checkMongoDuplicate(error)){
        next(ErrorCode.EMAIL_EXISTED)
      }
      next(error)
    }
  }
};

function randomTokenString() {
  return crypto.randomBytes(40).toString("hex");
}

async function sendResetPasswordEmail(account) {
  const message = `
    <p>Please use the below token to reset your password with the <code>/auth/reset-password</code> api route:</p>
    <p><code>${account.resetToken.token}</code></p>
  `;
  await sendMail({
    to: account.email,
    subject: "Reset Password API - Reset Password Email",
    html: `
      <h4>Reset Password</h4>
      ${message}
    `,
  });
}

module.exports = UserController;
