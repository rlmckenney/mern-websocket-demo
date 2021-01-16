const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  body: String,
  senderId: String
})
const Model = mongoose.model('Message', schema)

module.exports = Model
