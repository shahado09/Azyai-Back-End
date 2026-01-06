const jwt = require("jsonwebtoken");

function optionalVerifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = null;
    return next();
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.payload;
  } catch (e) {
    req.user = null;
  }

  next();
}

module.exports = optionalVerifyToken;