const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const uploadFile = require("../../middleware/Upload");
const errorMessages = nconf.get("errorMessages");
require("dotenv").config();

const MediaController = {
  async uploadFile(req, res, next) {
    try {
      await uploadFile(req, res);
      if (req.files.length === 0) {
        return Utils.handleError(res, ErrorCode.NO_UPLOAD_FILE);
      }
      next();
    } catch (error) {
      if (
        error instanceof multer.MulterError &&
        error.code === "LIMIT_UNEXPECTED_FILE"
      ) {
        return Utils.handleError(res, ErrorCode.UPLOAD_FILE_LIMIT);
      }
      return Utils.handleError(res, error);
    }
  },
  async resizeImage(req, res, next) {
    if (!req.files) return next();
    const images = req.files.filter((file) =>
      Constants.regex.IMAGE_ONLY.test(file.originalname)
    );
    let fileList = [];
    await Promise.all(
      images.map(async (file) => {
        const fileName = file.originalname.replace(/\..+$/, "");
        const newName = `${fileName}_${Date.now()}.jpeg`;
        await sharp(file.buffer)
          .resize(300, 450)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(__basedir + "/media/static/assets/upload/" + newName);
        fileList.push(newName);
      })
    );
    return Utils.handleSuccess(res, {
      files: fileList,
    });
  },
  async getFileList(req, res) {
    const dirPath = __basedir + "/media/static/assets/upload";
    const hiddenFileRegex = /(^|\/)\.[^\/\.]/g;
    fs.readdir(dirPath, function (err, scanFiles) {
      if (err) {
        return Utils.handleError(res, ErrorCode.ERROR_SCAN_FILES);
      }

      return Utils.handleSuccess(res, {
        files: scanFiles
          .filter((item) => !hiddenFileRegex.test(item))
          .map((file) => ({
            name: file,
          })),
      });
    });
  },
};

module.exports = MediaController;
