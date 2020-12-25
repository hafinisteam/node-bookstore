"use strict";
const Author = require("../../models/Author");

const AuthorController = {
  async getAllAuthor(req, res, next) {
    try {
      const authors = await Author.find({});
      return Utils.handleSuccess(res, {
        authors,
      });
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  async createAuthor(req, res, next) {
    try {
      const author = new Author(req.body);
      const newAuthor = await author.save();
      return Utils.handleSuccess(res, {
        author: newAuthor,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthorController;
