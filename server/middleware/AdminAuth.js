const JWT = require('jsonwebtoken');
const User = require('../models/User.model');

// Middleware to check if user is authenticated and is admin/superadmin
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = JWT.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded._id || decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }

    if (!user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token.'
    });
  }
};

// Middleware to check if user is superadmin
const requireSuperAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = JWT.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded._id || decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }

    if (!user.isSuperAdmin()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Superadmin privileges required.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Superadmin auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token.'
    });
  }
};

// Middleware to check specific permission
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
      }

      const decoded = JWT.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(decoded._id || decoded.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Invalid token.'
        });
      }

      if (!user.hasPermission(permission)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. ${permission} permission required.`
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Permission auth error:', error);
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }
  };
};

module.exports = {
  requireAdmin,
  requireSuperAdmin,
  requirePermission
};