const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

// Models
const User = require('./models/user');
const Cloth = require("./models/cloth");

// Controllers
const authCtrl = require('./controllers/auth');
const clothCtrl = require('./controllers/cloth');
const profileCtrl = require('./controllers/profile'); // 
const orderCtrl = require('./controllers/order')
const vendorCtrl = require("./controllers/vendor"); 
const adminCtrl = require("./controllers/admin");  


// Middleware
const verifyToken = require('./middleware/verify-token');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

// Public Routes
app.use('/auth', authCtrl);

// Public cloth route
app.get('/cloth', async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    const allCloth = await Cloth.find().sort({ createdAt: -1 });
    return res.status(200).json({ allCloth });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to load clothes' });
  }
});

// Protected Routes
app.use(verifyToken);
app.use('/cloth', clothCtrl);
app.use('/orders', orderCtrl);
app.use('/profiles', profileCtrl);
app.use("/vendor", vendorCtrl);
app.use("/admin", adminCtrl);


app.get('/test', (req, res) => {
  console.log(req.user);
  res.status(200).json({ message: 'You are logged in!' });
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log('The express app is ready!');
});
