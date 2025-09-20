import { body, param, query } from 'express-validator';

// Phone number validation
export const validatePhoneNumber = body('phoneNumber')
  .isString()
  .notEmpty()
  .withMessage('Phone number is required')
  .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
  .withMessage('Please provide a valid phone number');

// OTP validation
export const validateOTP = body('otp')
  .isString()
  .isLength({ min: 6, max: 6 })
  .withMessage('OTP must be 6 digits')
  .isNumeric()
  .withMessage('OTP must contain only numbers');

// Send OTP validation
export const validateSendOTP = [
  validatePhoneNumber,
];

// Verify OTP validation
export const validateVerifyOTP = [
  validatePhoneNumber,
  validateOTP,
];

// Onboarding validation
export const validateOnboarding = [
  body('firstName')
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('role')
    .isIn(['customer', 'tailor'])
    .withMessage('Role must be either customer or tailor'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('businessName')
    .if(body('role').equals('tailor'))
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name is required for tailors and must be between 2 and 100 characters'),
];

// Profile update validation
export const validateProfileUpdate = [
  body('firstName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('businessName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2 and 100 characters'),
  
  body('businessDescription')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Business description must not exceed 500 characters'),
  
  body('specializations')
    .optional()
    .isArray()
    .withMessage('Specializations must be an array')
    .custom((specializations) => {
      const validSpecializations = ['suits', 'dresses', 'alterations', 'traditional', 'western', 'ethnic'];
      const invalidItems = specializations.filter(item => !validSpecializations.includes(item));
      if (invalidItems.length > 0) {
        throw new Error(`Invalid specializations: ${invalidItems.join(', ')}`);
      }
      return true;
    }),
  
  body('experience')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be a number between 0 and 50 years'),
  
  body('location.address.street')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Street address must not exceed 200 characters'),
  
  body('location.address.city')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),
  
  body('location.address.state')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters'),
  
  body('location.address.zipCode')
    .optional()
    .isString()
    .trim()
    .matches(/^[\w\s\-]{3,10}$/)
    .withMessage('Please provide a valid zip code'),
  
  body('location.address.country')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
  
  body('location.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of [longitude, latitude]')
    .custom((coordinates) => {
      const [lng, lat] = coordinates;
      if (typeof lng !== 'number' || typeof lat !== 'number') {
        throw new Error('Coordinates must be numbers');
      }
      if (lng < -180 || lng > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }
      if (lat < -90 || lat > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }
      return true;
    }),
];

// MongoDB ObjectID validation
export const validateObjectId = (fieldName) => 
  param(fieldName)
    .isMongoId()
    .withMessage(`Invalid ${fieldName} format`);

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  
  query('sort')
    .optional()
    .isString()
    .matches(/^[\w\-]+$/)
    .withMessage('Sort field must be a valid field name'),
  
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc'),
];