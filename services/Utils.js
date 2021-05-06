"use strict";
const Joi = require("joi");
const errorMessages = require("../config/messages.json");

const Util = {
  handleError(res, error) {
    if (Joi.isError(error)) {
      return res.send({
        status: 200,
        code: "VALIDATION_ERROR",
        message: error.details,
      });
    }
    if (typeof error === "object") {
      return res.send({
        status: 200,
        code: error.code || "UNDEFINED",
        message: error.message,
      });
    }
    const errorCode = error;
    const resMessage = errorMessages[errorCode];
    const response = {
      code: error,
      message: resMessage ? resMessage : error,
    };
    res.json(response);
  },
  handleSuccess(res, data = {}) {
    const response = {
      status: 200,
      code: "SUCCESS",
      message: "",
      data,
    };
    return res.json(response);
  },
  checkMongoDuplicate(err) {
    if (err.name === "MongoError" && (err.code === 11000 || err.code === 11001))
      return true;
    else false;
  },
  getPagingConfig(query) {
    let { page, limit } = query;
    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 5;
    const offset = (page - 1) * limit;
    return { offset, limit };
  },
};

module.exports = Util;
