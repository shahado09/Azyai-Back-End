// const mongoose = require('mongoose');

// // we need mongoose schema
// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     enum: ["customer", "vendor", "admin"],
//     default: "customer",
//   },
//   profile: profileSchema,   
// }, { timestamps: true });   

// userSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     delete returnedObject.password;
//   },
// });

// // then we register the model with mongoose
// const User = mongoose.model('User', userSchema);

// // export the model
// module.exports = User;


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "vendor", "admin"],
    default: "customer",
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'   
  }
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password;
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
