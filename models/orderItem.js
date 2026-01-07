const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
  clothId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cloth",
    required: true
  },

  price:{
    type: Number,
    required: true
  },

  quantity:{
    type: Number,
    min: 1,
    required: true,
    default: 1
  }
}, {
    timestamps: true
});



module.exports = orderItemSchema;
