const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  items: 
    {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Cloth",
    required: true
  },

  totalPrice:{
    type: Number,
    required:true,
  },

  status: {
    type: String,
    default: "Pending"
  },
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
