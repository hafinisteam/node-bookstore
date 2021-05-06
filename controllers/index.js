const express = require('express')
const userRoutes = require('./user')
const authorRoutes = require('./author')
const mediaRoutes = require('./media')
const bookRoutes = require('./book')
const AuthenticateRequest = require('../middleware/AuthenticateRequest')

const routes = new express.Router()

routes.use('/user', AuthenticateRequest, userRoutes)
routes.use('/author', authorRoutes)
routes.use('/media', mediaRoutes)
routes.use('/book', bookRoutes)

module.exports = routes