const express = require("express");
const Joi = require('joi')
const AuthController = require("./controller");
const validateRequest = require('../../lib/validateRequest')
const { regex } = require('../../config/constant')

const routes = new express.Router();

const loginSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().required().regex(regex.EMAIL_REGEX),
    password: Joi.string().required().min(6).max(30),
  });
  validateRequest(req, next, schema)
}
const registerSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().regex(regex.EMAIL_REGEX),
    password: Joi.string().required().min(6).max(30),
  });
  validateRequest(req, next, schema)
}

const verifyEmailSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
  });
  validateRequest(req, next, schema)
}

routes.post('/login', loginSchema, AuthController.login)
routes.post('/register', registerSchema, AuthController.register)
routes.post('/verify-email', verifyEmailSchema, AuthController.verifyEmail)

module.exports = routes