const mongoose = require('mongoose');

//mongoose schema
const vendorRequestSchema = new mongoose.Schema({


    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true },

    instagram: { 
        type: String,
        required: true,
        trim: true },

    vendorName: {
        type: String, 
        required: true,
        trim: true },

    aboutVendor: {
         type: String, 
         required: true, 
         trim: true },
    
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

     adminNote: { type: String, default: "" }},

 { timestamps: true } );

// for faster search
vendorRequestSchema.index({ userId: 1, status: 1 });

//the model with mongoose
const VendorRequest=mongoose.model('VendorRequest',vendorRequestSchema)

// export the model
module.exports = VendorRequest;