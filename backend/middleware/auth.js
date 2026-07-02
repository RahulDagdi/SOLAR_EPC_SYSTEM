const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT Token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Token is not valid' });
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role ${req.user.role} is not authorized to access this resource` 
      });
    }
    next();
  };
};

// Check if user belongs to same organization
const checkOrganization = (req, res, next) => {
  if (req.user.role === 'super_admin') {
    return next(); // Super admin can access all
  }

  const requestedOrgId = req.params.orgId || req.body.organizationId;
  if (requestedOrgId && requestedOrgId !== req.user.organizationId?.toString()) {
    return res.status(403).json({ 
      success: false, 
      message: `'Not authorized to access this organization's data' `
  });

  }
  next();
};

module.exports = { auth, authorize, checkOrganization };
