const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
}, {
  collection: 'bookFormat'
})

module.exports = mongoose.model('bookFormat', schema)