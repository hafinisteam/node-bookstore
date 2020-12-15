const AuthorController = require('./controller')
const express = require('express')
const authorizRequest = require('../../middleware/AuthorizeRequest')

const routes = new express.Router()

routes.get('/', AuthorController.getAllAuthor)
routes.post('/', AuthorController.createAuthor)

module.exports = routes