const express = require("express");
const router = express.Router();

const VendorRequest = require("../models/VendorRequest");
const User = require("../models/user");
const { isAdmin } = require("../middleware/access-control");
const { sendDecisionToUser } = require("../utils/mailer");


router.get("/vendor-requests", isAdmin, async (req, res) => {
  try {
    const requests = await VendorRequest.find().populate("userId", "username email role").sort({ createdAt: -1 });
    return res.json(requests);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error loading vendor requests" });
  }
});


router.put("/vendor-requests/:id/approve", isAdmin, async (req, res) => {
  try {
    const request = await VendorRequest.findById(req.params.id).populate("userId","username email");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }


    request.status = "approved";
    request.adminNote = ""; 
    await request.save();

    await User.findByIdAndUpdate(request.userId._id, { role: "vendor" });

    await sendDecisionToUser(request.userId.email, request.userId.username,"approved","");

    return res.json({ message: "Vendor request approved", request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error approving request" });
  }
});


router.put("/vendor-requests/:id/reject", isAdmin, async (req, res) => {
  try {
    const { adminNote } = req.body;

    const request = await VendorRequest.findById(req.params.id).populate("userId","username email");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already decided" });
    }

    request.status = "rejected";
    request.adminNote = (adminNote || "No note provided").trim();
    await request.save();

    await sendDecisionToUser(request.userId.email,request.userId.username,"rejected",request.adminNote);

    return res.json({ message: "Vendor request rejected", request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error rejecting request" });
  }
});

module.exports = router;
