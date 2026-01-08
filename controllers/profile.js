const express = require('express');
const router = express.Router();
const Profile = require('../models/profile');
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');

// Route to create a new profile
router.post('/', verifyToken, async (req, res) => {
  try {
    const exists = await Profile.findOne({ user: req.user._id });
    if (exists) return res.status(400).json({ message: 'Profile exists' });

    const profile = await Profile.create({ ...req.body, user: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { profile: profile._id });

    res.status(201).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create failed' });
  }
});

// Route to get a profile by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Not found' });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// Route to update an existing profile by ID
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Not found' });

    console.log("req.user:", req.user);
    console.log("profile.user:", profile.user);
    console.log("profile.userId:", profile.userId);
    console.log("req.body:", req.body);

    // ✅ Check if user is authorized (accepts both user and userId for old data)
    if (
      profile.user?.toString() !== req.user._id.toString() &&
      profile.userId?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updated = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
});

// Route to delete a profile by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Profile.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user._id, { profile: null });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
