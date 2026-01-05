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
    required: true
  }
}, {
    timestamps: true
});



module.exports = orderItemSchema;
