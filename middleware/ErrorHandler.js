const multer = require("multer");
const Joi = require("joi");
const response = require("../config/response");
const messages = require("../config/messages.json");

module.exports = function (error, req, res, next) {
  switch (true) {
    case Joi.isError(error):
      return res.status(400).send({
        status: 200,
        code: response.VALIDATION_ERROR,
        message: error.details.map((x) => x.message).join(", "),
      });
    case response.hasOwnProperty(error):
      return res.send({
        status: 200,
        code: response[error],
        message: messages[error] || "",
      });
    default:
      return res.send({
        status: 200,
        code: response.OTHER_ERROR,
        message: error,
      });
  }
};
