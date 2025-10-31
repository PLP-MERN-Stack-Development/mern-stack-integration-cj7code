// server/middleware/auth.js
// Protect routes using JWT in Authorization header: "Bearer <token>"

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ success: false, error: 'Not authorized' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to req — omit password
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, error: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token invalid or expired' });
  }
};

// Role based middleware
exports.authorize = (roles = []) => (req, res, next) => {
  if (!Array.isArray(roles)) roles = [roles];
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'Forbidden: insufficient privileges' });
  }
  next();
};
