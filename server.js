const dotenv = require('dotenv');

dotenv.config();
const express = require('express');

const app = express();
app.set('etag', false);
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

// Controllers
const Cloth = require("./models/cloth");
const authCtrl = require('./controllers/auth');
const clothCtrl = require('./controllers/cloth');

// Middleware
const verifyToken = require('./middleware/verify-token');
const { applyDefaults } = require('./models/user');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

// Public Routes
app.use('/auth', authCtrl);

app.get('/cloth', async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    const allCloth = await Cloth.find().sort({ createdAt: -1 });
    return res.status(200).json({ allCloth });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Failed to load clothes' });
  }
});


// Protected Routes
app.use('/cloth', clothCtrl);
app.use('/profiles', verifyToken, require('./controllers/profile'));


app.get('/test', (req, res) => {
  console.log(req.user);
  res.status(200).json({ message: 'you are logged in!' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('The express app is ready!');
});
