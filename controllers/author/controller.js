"use strict";
const mongoose = require("mongoose");
const Author = require("../../models/Author");
const Joi = require("joi");

const AuthorController = {
  async getAllAuthor(req, res) {
    const authors = await Author.find({});
    return Utils.handleSuccess(res, {
      authors,
    });
  },
  /**
   *
   * @param {Object} req Express request object
   * @param {String} req.firstName First name
   * @param {String} req.lastName Last name
   * @param {Object} res  Express response object
   */
  async createAuthor(req, res) {
    let schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    });
    let result = schema.validate(req.body);
    if (result.error) {
      return Utils.handleError(res, result.error);
    }
    try {
      const author = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
      const newAuthor = await author.save();
      return Utils.handleSuccess(res, {
        author: newAuthor,
      });
    } catch (error) {
      return Utils.handleError(res, error);
    }
  },
};

module.exports = AuthorController;
