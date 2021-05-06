const Book = require("../../models/Book");
const Review = require("../../models/Review");
const Joi = require("joi");

module.exports = {
  getList: async (req, res, next) => {
    try {
      const { offset, limit } = Utils.getPagingConfig(req.query)
      const books = await Book.find({})
        .skip(offset)
        .limit(limit)
        .select("title thumbnails")
        .populate("authors")
        .populate("prices.format", "name")
        .exec();
      const total = await Book.countDocuments();
      return Utils.handleSuccess(res, { books, total });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getByID: (req, res) => {
    Book.findOne({ _id: req.params.bookID })
      .populate("authors")
      .populate("prices.format")
      .populate("rating")
      .exec(function (err, book) {
        if (err) throw ErrorCode.BOOK_NOT_EXISTED;
        return Utils.handleSuccess(res, { book });
      });
  },
  createBook: async (req, res, next) => {
    try {
      const newBook = new Book(req.body);
      const bookInfor = await newBook.save();
      return Utils.handleSuccess(res, {
        book: bookInfor,
      });
    } catch (err) {
      if (Utils.checkMongoDuplicate(err)) {
        next(ErrorCode.BOOK_TITLE_EXISTED);
      }
      next(err);
    }
  },
  addReview: async (req, res) => {
    try {
      const book = await Book.findOne({ _id: req.body.book_id });

      if (!book) {
        throw (res, ErrorCode.BOOK_NOT_EXISTED);
      }

      const newReview = new Review(req.body);
      const savedReview = await newReview.save();
      book.rating.push(savedReview._id);
      const savedBook = await book.save();
      return Utils.handleSuccess(res, savedBook);
    } catch (error) {
      console.log(error);
      return Utils.handleError(res, error);
    }
  },
  removeReview: async (req, res) => {
    try {
      if (!req.params.reviewID) {
        throw ErrorCode.REVIEW_ID_MISSING;
      }
      const review = await Review.findOne({ _id: req.params.reviewID });
      if (!review) throw ErrorCode.REVIEW_NOT_EXISTED;
      if (!review.owner.equals(req.user._id)) throw ErrorCode.PERMISSION;

      await review.deleteOne();
      await Book.findOneAndUpdate(
        {
          _id: review.product,
        },
        {
          $pull: {
            rating: req.params.reviewID,
          },
        },
        function (err, doc) {
          return Utils.handleSuccess(res, doc);
        }
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
