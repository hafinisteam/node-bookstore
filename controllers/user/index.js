const UserController = require("./controller");
const express = require("express");
const validateRequest = require('../../lib/validateRequest')
const Joi = require('joi')
const { regex } = require('../../config/constant')

const routes = new express.Router();

const forgotPasswordSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().required().regex(regex.EMAIL_REGEX),
  });
  validateRequest(req, next, schema)
}

const resetPasswordSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().required
  });
  validateRequest(req, next, schema)
}
routes.post('/forgot-password', forgotPasswordSchema, UserController.forgotPassword)
routes.post('/reset-password', resetPasswordSchema, UserController.resetPassword)


module.exports = routes