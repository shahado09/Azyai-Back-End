const express = require('express');
const router = express.Router();
const Profile = require('../models/profile');
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');

// CREATE Profile ================================================================
router.post('/', verifyToken, async (req, res) => {
  try {
    const profileData = { ...req.body, owner: req.user._id }; 
    const profile = await Profile.create(profileData);
    res.status(201).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating profile' });
  }
});

// SHOW Profile by ID ============================================================
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate('owner');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// EDIT Profile (Form Data) ======================================================
router.get('/:id/edit', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (profile.owner.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to edit this profile' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching profile for edit' });
  }
});

// UPDATE Profile ================================================================
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (profile.owner.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// DELETE Account (User + Profile) ================================================
router.delete('/account', verifyToken, async (req, res) => {
  try {
    await Profile.findOneAndDelete({ owner: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: 'Account and profile deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting account' });
  }
});

module.exports = router;
