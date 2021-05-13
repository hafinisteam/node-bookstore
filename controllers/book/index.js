const express = require('express')
const Joi = require('joi')
const BookController = require('./controller')
const validateRequest = require('../../lib/validateRequest')
const AuthenticateRequest = require('../../middleware/AuthenticateRequest')
const VerifyToken = require('../../middleware/VerifyToken')
const { regex } = require('../../config/constant')

const routes = express.Router()

const createBookSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    authors: Joi.array().required().items(Joi.string().required()),
    thumbnails: Joi.array().required().items(Joi.string().required()),
    prices: Joi.array()
      .required()
      .items(
        Joi.object({
          price: Joi.number().required(),
          format: Joi.string().required(),
        })
      ),
    quantity: Joi.number().required(),
  });
  validateRequest(req, next, schema)
}

const addReviewSchema = (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      book_id: Joi.string().required(),
      star: Joi.number().max(5).required(),
      detail: Joi.string().required(),
      name: Joi.string().min(6).max(30),
      email: Joi.string().regex(regex.EMAIL_REGEX)
    });
    validateRequest(req, next, schema)
  } catch (error) {
    console.log(error)
  }
}

routes.get('/', BookController.getList)
routes.get('/:bookID', BookController.getByID)
routes.post('/', AuthenticateRequest, createBookSchema, BookController.createBook)
routes.post('/review', addReviewSchema, VerifyToken, BookController.addReview)
routes.delete('/review/:reviewID', BookController.removeReview)

module.exports = routes