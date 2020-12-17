const express = require('express')
const authorRoutes = require('./author')
const mediaRoutes = require('./media')
const bookRoutes = require('./book')

let routes = new express.Router()

routes.use('/author', authorRoutes)
routes.use('/media', mediaRoutes)
routes.use('/book', bookRoutes)

module.exports = routes