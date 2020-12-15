const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: {
      type: String,
      required: true,
    },
    thumbnails: [{ type: String }],
    authors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "author",
      },
    ],
    prices: [
      {
        price: {
          type: Number,
          required: true,
        },
        format: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "bookFormat",
        },
      },
    ],
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
    rating: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    }],
  },
  {
    timestamps: true,
    collection: "book",
  }
);

module.exports = mongoose.model("book", schema);
