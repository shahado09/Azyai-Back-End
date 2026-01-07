const express = require('express');
const router = express.Router();
const Cloth =require("../models/cloth")
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middleware/verify-token');
const optionalVerifyToken = require("../middleware/optional-verify-token");
const { isVendorOrAdmin, ownsClothOrAdmin } = require("../middleware/access-control");


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

// SUK
function generateSku() {
  return `AZY-${Date.now().toString(36).toUpperCase()}`; 
}



// index
router.get('/my',verifyToken, isVendorOrAdmin,async(req,res)=>{

    try{

      const currentUser = req.user;
      let myCloth=[];
      if(currentUser && (currentUser.role === "vendor" || currentUser.role === "admin"))
        myCloth = await Cloth.find({ userId: currentUser._id }).sort({ createdAt: -1 });
      res.status(200).json({ myCloth, currentUser });}
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
        const sku = generateSku();
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
              sku,
            });

       res.status(201).json({ createdcloth });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create cloth' });
      }

})

// show
router.get('/:id', optionalVerifyToken, async (req, res) => {
  try {
    const foundCloth = await Cloth.findById(req.params.id);
    if (!foundCloth) return res.status(404).json({ message: "Cloth not found" });

    const currentUser = req.user; 
    const isSignedIn = !!currentUser;
    const isAdmin = isSignedIn && currentUser.role === "admin";
    const isOwner =isSignedIn &&currentUser.role === "vendor" &&foundCloth.userId?.toString() === currentUser._id;

    return res.status(200).json({ foundCloth, currentUser, isOwner, isAdmin });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to load cloth" });
  }
});



// update
router.put('/:id',verifyToken,multiUpload, async (req,res)=>{
  
  try{
    const currentUser = req.user;
    const foundCloth = await Cloth.findById(req.params.id);
    if (!foundCloth)
      {return res.status(404).json({ error: 'Cloth not found' });} 

    if (!foundCloth.userId.equals(currentUser._id)) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    if (req.body.isAvailable){req.body.isAvailable=true}
    else{ req.body.isAvailable=false}
    const updateData = {
        name: req.body.name,
        description: req.body.description,
        sizes: req.body.sizes,
        isAvailable:req.body.isAvailable,
        price: Number(req.body.price),
        category: req.body.category || 'other',
        stockQty: Number(req.body.stockQty) || 0,
        salePrice: req.body.salePrice ? Number(req.body.salePrice) : null,};
    if (req.files && req.files["images"] && req.files["images"].length > 0) {
      updateData.images = req.files["images"].map(file => '/uploads/' + file.filename);}

    const updated = await Cloth.findByIdAndUpdate( req.params.id,updateData,{ new: true });
    res.status(200).json({ updated });
    }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update cloth' });
  }
})

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const currentUser = req.user;

    const foundCloth = await Cloth.findById(req.params.id);
    if (!foundCloth) {
      return res.status(404).json({ error: 'Cloth not found' });
    }

    const isAdmin = currentUser.role === "admin";
    const isOwner = foundCloth.userId.equals(currentUser._id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    await Cloth.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Cloth deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete cloth' });
  }
});



module.exports = router;