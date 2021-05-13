const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user" 
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book",
  },
  star: {
    type: Number,
    required: true,
  },
  detail: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String
  }
});

module.exports = mongoose.model("review", schema);
