const express = require('express');
const router = express.Router();
const Cloth =require("../models/cloth")
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middleware/verify-token');

// mutler
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('public', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  }
});
const upload = multer({ storage });
const multiUpload = upload.fields([
  { name: "images", maxCount: 3}
])



// index
router.get('/',verifyToken,async(req,res)=>{

    try{

      const currentUser = req.user || null;
      const allCloth= await Cloth.find().sort({createdAt: -1})

      let myCloth=[];
      if(currentUser && (currentUser.role === "vendor" || currentUser.role === "admin"))
        myCloth = await Cloth.find({ userId: currentUser._id }).sort({ createdAt: -1 });


      res.status(200).json({ allCloth, myCloth, currentUser });}

  catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to load clothes' });
    }
})

// create
router.post('/', verifyToken, multiUpload,async(req,res)=>{

    try{ 
        const currentUser = req.user;
         if (req.body.isAvailable){
            req.body.isAvailable=true}
         else{ req.body.isAvailable=false}

        req.body.images = [];
        if (req.files && req.files["images"]) {
          req.files["images"].forEach((file) => {
            req.body.images.push('/uploads/' + file.filename);
        });
        }

        const createdcloth = await Cloth.create({
              userId: currentUser._id,
              name: req.body.name,
              sizes: req.body.sizes,
              description: req.body.description,
              images: req.body.images,
              isAvailable: req.body.isAvailable,
              price: Number(req.body.price),
              category: req.body.category || 'other',
              stockQty: Number(req.body.stockQty) || 0,
              salePrice: req.body.salePrice ? Number(req.body.salePrice) : null,
            });

       res.status(201).json({ createdcloth });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create cloth' });
      }

})