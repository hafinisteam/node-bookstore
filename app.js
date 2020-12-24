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

  global.nconf = nconf;
  global.Utils = Utils;
  global.__basedir = path.resolve()
  global.Constants = Constants
  global.ErrorCode = ErrorCode

  nconf
    .file("commonType", "./config/commonType.json")
    .file("messages", "./config/messages.json");
  app.use('/media', express.static(__dirname + '/media'))
  app.use(express.json());
  app.use(morgan("combined"));
  app.use(helmet());

  initializePassport(app);

  const authRoutes = require("./controllers/auth");
  const apiRoutes = require("./controllers");

  app.use("/auth", authRoutes);
  app.use(
    "/api",
    passport.authenticate("jwt", {
      session: false,
    }),
    apiRoutes
  );

  app.use(ErrorHandler)

  app.listen(PORT, (err) => {
    if (err) throw new Error(err);

    console.log(`Listening on ${PORT}`);
  });
};
