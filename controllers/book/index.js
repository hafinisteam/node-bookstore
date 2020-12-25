const express = require('express')
const BookController = require('./controller')
const validateRequest = require('../../lib/validateRequest')

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
  if (!req.params.bookID) {
    throw ErrorCode.BOOK_NOT_EXISTED;
  }
  const schema = Joi.object().keys({
    owner: Joi.string().required(),
    book_id: Joi.string().required(),
    star: Joi.number().max(5).required(),
    detail: Joi.string().required(),
  });
  req.body.owner = req.user._id.toString()
  validateRequest(req, next, schema)
}

routes.get('/', BookController.getList)
routes.get('/:bookID', BookController.getByID)
routes.post('/', createBookSchema, BookController.createBook)
routes.post('/review/:bookID', addReviewSchema, BookController.addReview)
routes.delete('/review/:reviewID', BookController.removeReview)

module.exports = routes