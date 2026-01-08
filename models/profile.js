const mongoose = require('mongoose');

// Define the schema for a user's profile
const profileSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
}

  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
