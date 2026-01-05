const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  }
  age: Number,
  height: Number,
  weight: Number,
  currentJob: {
    type: String,
    enum: ['job seeker', 'employed'],
    default: 'job seeker'
  },
  image: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Profile', profileSchema)