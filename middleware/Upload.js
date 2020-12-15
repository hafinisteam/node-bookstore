const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
  const acceptExt = Constants.regex.UPLOAD_FORMAT;
  if (!acceptExt.test(file.originalname)) {
    cb(ErrorCode.UPLOAD_FILE_EXTENSION);
  } else {
    cb(null, true);
  }
};

let uploadFile = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter,
}).array("files", 5);

module.exports = util.promisify(uploadFile);
