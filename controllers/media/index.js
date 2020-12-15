const MediaController = require("./controller");
const express = require("express");
const routes = new express.Router();

routes.post("/upload", MediaController.uploadFile, MediaController.resizeImage);
routes.get("/files", MediaController.getFileList);

module.exports = routes;
