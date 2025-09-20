import { validationResult } from 'express-validator';

// Validation Error Handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
  
  next();
};

// Global Error Handler
export const globalErrorHandler = (err, req, res, next) => {
  console.error('Global Error:', err);
  
  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message,
      value: error.value,
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
  
  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    
    return res.status(400).json({
      success: false,
      message: `${field} '${value}' is already registered`,
      errors: [{
        field,
        message: `${field} must be unique`,
        value,
      }],
    });
  }
  
  // Mongoose Cast Error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }
  
  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid access token',
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Access token has expired',
    });
  }
  
  // Default Error
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 Not Found Handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

// Async Error Wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};