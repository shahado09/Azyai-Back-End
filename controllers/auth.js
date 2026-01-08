const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Profile = require('../models/profile');

router.post('/sign-up', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userInDatabase = await User.findOne({ username });
    if (userInDatabase) {
      return res.status(409).json({ err: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    const profile = await Profile.create({ user: user._id });

    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profileId: profile._id,
      role: user.role, 
    };

    const token = jwt.sign({payload}, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: payload });
  } catch (error) {
    console.error('Sign-up error:', error);
    res.status(500).json({ err: 'Failed to sign up' });
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userInDatabase = await User.findOne({ username });
    if (!userInDatabase) {
      return res.status(401).json({ err: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, userInDatabase.password);
    if (!isMatch) {
      return res.status(401).json({ err: 'Invalid credentials' });
    }

    const profile = await Profile.findOne({ user: userInDatabase._id });

    const payload = {
      _id: userInDatabase._id,
      username: userInDatabase.username,
      email: userInDatabase.email,
      profileId: profile?._id,
      role: userInDatabase.role,
    };

    const token = jwt.sign({payload}, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token, user: payload });
  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ err: 'Failed to sign in' });
  }
});

module.exports = router;
