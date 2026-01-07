const express = require("express");
const router = express.Router();

const VendorRequest = require("../models/VendorRequest");
const verifyToken = require('../middleware/verify-token');
const { sendVendorRequestToAdmin } = require("../utils/mailer.js");


router.get("/request/latest", verifyToken, async (req, res) => {
  try {
    const latest = await VendorRequest.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json(latest || null);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error loading latest vendor request" });
  }
});


router.post("/request", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id; 
    if (!userId) {
      return res.status(401).json({ message: "User not found in token" });
    }

    const { instagram, vendorName, aboutVendor } = req.body;

    if (!instagram || !vendorName || !aboutVendor) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pending = await VendorRequest.findOne({userId: userId,status: "pending",});

    if (pending) {
      return res.status(400).json({ message: "You already have a pending request" });}

    const createdRequest = await VendorRequest.create({
      userId: userId, 
      instagram: instagram.trim(),
      vendorName: vendorName.trim(),
      aboutVendor: aboutVendor.trim(),
      status: "pending",
    });

    await sendVendorRequestToAdmin({
      userEmail: req.user.email,     
      userName: req.user.username,   
      instagram: createdRequest.instagram,
      vendorName: createdRequest.vendorName,
      aboutVendor: createdRequest.aboutVendor,
    });

    return res.status(201).json({
      message: "Vendor request submitted successfully",
      request: createdRequest,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error submitting vendor request" });
  }
});


module.exports = router;
