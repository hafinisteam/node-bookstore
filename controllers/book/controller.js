const Book = require("../../models/Book");
const Review = require("../../models/Review");
const Joi = require("joi");

module.exports = {
  getList: async (req, res) => {
    try {
      let { page, limit } = req.query
      page = page ? parseInt(page) : 1;
      limit = limit ? parseInt(limit) : 5;
      const offset = (page - 1) * limit
      const books = await Book.find({})
        .skip(offset)
        .limit(limit)
        .select('title thumbnails')
        .populate("authors")
        .populate("prices.format", "name")
        .exec();
      const total = await Book.countDocuments();
      return Utils.handleSuccess(res, { books, total });
    } catch (error) {
      console.log(error);
    }
  },
  getByID: (req, res) => {
    Book.findOne({ _id: req.params.bookID })
      .populate("authors")
      .populate("prices.format")
      .populate("rating")
      .exec(function (err, book) {
        if (err) return Utils.handleError(res, ErrorCode.BOOK_NOT_EXISTED);
        return Utils.handleSuccess(res, { book });
      });
  },
  createBook: async (req, res) => {
    try {
      if (!req.user) {
        return Utils.handleError(res, ErrorCode.PERMISSION);
      }
      const schema = Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        authors: Joi.array().required().items(Joi.string().required()),
        thumbnails: Joi.array().required().items(Joi.string().required()),
        prices: Joi.array()
          .required()
          .items(
            Joi.object({
              price: Joi.number().required(),
              format: Joi.string().required(),
            })
          ),
        quantity: Joi.number().required(),
      });
      let result = schema.validate(req.body);
      if (result.error) {
        return Utils.handleError(res, result.error);
      }
      const newBook = new Book(result.value);
      const bookInfor = await newBook.save();
      return Utils.handleSuccess(res, {
        book: bookInfor,
      });
    } catch (err) {
      if (
        err.name === "MongoError" &&
        (err.code === 11000 || err.code === 11001)
      ) {
        return Utils.handleError(res, ErrorCode.BOOK_TITLE_EXISTED);
      }
      return Utils.handleError(res, err);
    }
  },
  addReview: async (req, res) => {
    try {
      if (!req.params.bookID) {
        return Utils.handleError(res, ErrorCode.BOOK_NOT_EXISTED);
      }
      if (!req.user) {
        return Utils.handleError(res, ErrorCode.PERMISSION);
      }
      const schema = Joi.object().keys({
        owner: Joi.string().required(),
        book_id: Joi.string().required(),
        star: Joi.number().max(5).required(),
        detail: Joi.string().required(),
      });
      const result = schema.validate(req.body);
      if (result.error) {
        return Utils.handleError(res, result.error);
      }
      const book = await Book.findOne({ _id: req.body.book_id });
      if (!book) {
        return Utils.handleError(res, ErrorCode.BOOK_NOT_EXISTED);
      }

      const newReview = new Review(result.value);
      const savedReview = await newReview.save();
      book.rating.push(savedReview._id);
      const savedBook = await book.save();
      return Utils.handleSuccess(res, savedBook);
    } catch (error) {
      console.log(error);
      return Utils.handleError(res, error);
    }
  },
};
