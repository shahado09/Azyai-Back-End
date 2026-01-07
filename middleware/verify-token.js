const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded.payload;
    console.log("AUTH USER:", req.user);
    next();
  } catch (err) {
    console.log(err);

    res.status(401).json({ err: 'Invalid Token' });
  }
};

module.exports = verifyToken;

