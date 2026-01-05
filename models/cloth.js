const mongoose= require('mongoose')

//schema
const clothSchema = new mongoose.Schema({

  userId: { 
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", 
          required: true },
          
  name: { type: String, required: true },       
  sizes: [{ type: String, required: true }],        
  description: { type: String, required: true }, 
  images: [{ type: String, required: true }],                           
  isAvailable: { type: Boolean, default: true },  
  price: {type: Number,required: true,},

  category: { type: String, enum: ['abaya', 'jalabiya', 'dress', 'set', 'other'], default: 'other'},

  stockQty: { type: Number, default: 0, min: 0},

  salePrice: { type: Number, min: 0, default: null},

})

// model
const Cloth = mongoose.model('Cloth', clothSchema)

module.exports = Cloth