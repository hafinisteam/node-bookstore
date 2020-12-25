const Joi = require('joi')
const express = require('express')

const validateRequest = require('../../lib/validateRequest')

const AuthorController = require('./controller')
const authorizRequest = require('../../middleware/AuthorizeRequest')
const routes = new express.Router()

const createAuthorSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  });
  validateRequest(req, next, schema)
}

routes.get('/', AuthorController.getAllAuthor)
routes.post('/', createAuthorSchema, AuthorController.createAuthor)

module.exports = routes