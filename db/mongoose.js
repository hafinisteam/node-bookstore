const mongoose = require("mongoose");
const Models = require("../models");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

module.exports = async function () {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  const db = mongoose.connection;

  db.on("error", (err) => {
    console.log(`MongoDB connection error: ${error}`);
  });

  db.on("connected", (err) => {
    console.log(`MongoDB connection open to: ${MONGO_URI}`);
  });
  global.db = Models;
  return mongoose;
};
