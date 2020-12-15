const AuthController = require("./controller");
const express = require("express");

const routes = new express.Router();

routes.post('/login', AuthController.login)
routes.post('/register', AuthController.register)

module.exports = routes