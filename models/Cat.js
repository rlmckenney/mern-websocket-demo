const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: String,
  age: Number,
  colour: String,
  isHungry: Boolean
})
const Model = mongoose.model('Cat', schema)

module.exports = Model
