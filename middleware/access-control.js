const Cloth = require("../models/cloth");

function isAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
}

function isVendorOrAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const role = req.user.role;
  if (role === "vendor" || role === "admin") return next();

  return res.status(403).json({ message: "Vendor or Admin only" });
}

async function ownsClothOrAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const cloth = await Cloth.findById(req.params.id);
  if (!cloth) return res.status(404).json({ message: "Cloth not found" });

  if (req.user.role === "admin") return next();
  if (req.user.role === "vendor" && cloth.userId?.toString() === req.user._id?.toString())
  return next();

  return res.status(403).json({ message: "Not allowed" });
}

module.exports = {isAdmin, isVendorOrAdmin, ownsClothOrAdmin };