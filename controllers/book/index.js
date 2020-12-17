const express = require('express')
const BookController = require('./controller')

const routes = express.Router()

routes.get('/', BookController.getList)
routes.get('/:bookID', BookController.getByID)
routes.post('/', BookController.createBook)
routes.post('/review/:bookID', BookController.addReview)

module.exports = routes