"use strict";
const Joi = require("joi");
const errorMessages = require('../config/messages.json');

const Util = {
  handleError(res, error){
    if(Joi.isError(error)){
      return res.send({
        status: 200,
        code: "VALIDATION_ERROR",
        message: error.details,
      })
    } 
    if(error) {
      return res.send({
        status: 200,
        code: ErrorCode.OTHER_ERROR,
        message: error.message,
      })
    }
    const resMessage = errorMessages[error]
    const response = {
      code: error,
      message: resMessage ? resMessage : error,
    }
    res.json(response)
  },
  handleSuccess(res, data) {
    const response = {
      status: 200,
      code: "SUCCESS",
      message: '',
      data: data ? data : {}
    }
    return res.json(response)
  }
};

module.exports = Util;
