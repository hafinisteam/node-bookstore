const express = require("express");
const UserController = require("./controller");
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
    password: Joi.string().required()
  });
  validateRequest(req, next, schema)
}

const updateProfileSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    lastName: Joi.string(),
    firstName: Joi.string(),
    displayName: Joi.string(),
    email: Joi.string().regex(regex.EMAIL_REGEX)
  })
  validateRequest(req, next, schema)
}

const changePasswordSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmNewPassword: Joi.string().required(),
  })
  console.log(req.user)
  validateRequest(req, next, schema)
}

routes.post('/forgot-password', forgotPasswordSchema, UserController.forgotPassword)
routes.post('/reset-password', resetPasswordSchema, UserController.resetPassword)
routes.post('/update-profile', updateProfileSchema, UserController.updateProfile)
routes.post('/change-password', changePasswordSchema, UserController.changePassword)

module.exports = routes