"use strict";

const dotenv = require("dotenv");
const express = require("express");

const nconf = require("nconf");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const passport = require("passport");

let server = (module.exports = {});
const initializePassport = require("./lib/passport");
const ErrorHandler = require('./middleware/ErrorHandler')
const Utils = require("./services/Utils");
const Constants = require('./config/constant')
const ErrorCode = require('./config/response')

// Load ENV config
dotenv.config();

// Load MongooseDB connection
require("./db/mongoose")();

server.start = function (callback) {
  const app = express();
  const PORT = process.env.PORT || 9999;

  // Set global configuration for constant, utils, error code, ...
  global.nconf = nconf;
  global.Utils = Utils;
  global.__basedir = path.resolve()
  global.Constants = Constants
  global.ErrorCode = ErrorCode

  nconf
    .file("commonType", "./config/commonType.json")
    .file("messages", "./config/messages.json");

  // Set static path for media such as images
  app.use('/media', express.static(__dirname + '/media'))

  // Parse in-coming request with JSON payload
  app.use(express.json());

  // Security config with library
  app.use(morgan("combined"));
  app.use(helmet());

  // Init passport hook for token check
  initializePassport(app);

  // Auth route
  const authRoutes = require("./controllers/auth");

  // All other routes for API data
  const apiRoutes = require("./controllers");

  app.use("/auth", authRoutes);

  // Authenticate API route with PassportJS
  app.use(
    "/api",
    passport.authenticate("jwt", {
      session: false,
    }),
    apiRoutes
  );

  // Use error handler middleware
  app.use(ErrorHandler)

  // Server listen on PORT
  app.listen(PORT, (err) => {
    if (err) throw new Error(err);
    console.log(`Listening on ${PORT}`);
  });
};
