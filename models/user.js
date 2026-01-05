const mongoose = require('mongoose');

// we need mongoose schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: { 
    type: String,
    default: 'customer', 
  }, 
  profile: profileSchema,
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password;
  },
});

// then we register the model with mongoose
const User = mongoose.model('User', userSchema);

// export the model
module.exports = User;
