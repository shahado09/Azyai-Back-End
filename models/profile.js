const mongoose = require('mongoose')


const profileSchema = new mongoose.Schema({ 
phone: {
    type: String,
    },
address: { 
    type: String, 
    },
avatar: { 
filename: String, 
path: String, 
}, 
});

module.exports = mongoose.model('Profile', profileSchema)