import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';

// Generate JWT Token
export const generateToken = (userId, role) => {
  const payload = {
    userId,
    role,
    iat: Math.floor(Date.now() / 1000),
  };
  
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
    issuer: 'tailorapp-api',
    audience: 'tailorapp-client',
  });
};

// Verify JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET, {
      issuer: 'tailorapp-api',
      audience: 'tailorapp-client',
    });
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Authentication Middleware
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }
    
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password -otp');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }
    
    // Attach user to request object
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token has expired',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

// Authorization Middleware - Check user role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }
    
    next();
  };
};

// Check subscription status for tailors
export const checkSubscription = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    
    // Skip subscription check for customers
    if (req.user.role === 'customer') {
      return next();
    }
    
    // Check if tailor has active subscription
    if (!req.user.isSubscriptionActive()) {
      const remainingDays = req.user.getRemainingTrialDays();
      
      return res.status(402).json({
        success: false,
        message: 'Subscription required',
        data: {
          subscriptionExpired: true,
          remainingTrialDays: remainingDays,
          currentPlan: req.user.subscription.plan,
        },
      });
    }
    
    next();
  } catch (error) {
    console.error('Subscription check error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Subscription validation failed',
    });
  }
};

// Optional authentication - doesn't throw error if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }
    
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;
    
    if (!token) {
      return next();
    }
    
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password -otp');
    
    if (user && user.isActive) {
      req.user = user;
      req.userId = user._id;
      req.userRole = user.role;
    }
    
    next();
  } catch (error) {
    // Ignore authentication errors for optional auth
    next();
  }
};