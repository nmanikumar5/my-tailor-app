import express from 'express';
import {
  sendOTP,
  verifyOTP,
  completeOnboarding,
  googleCallback,
  getProfile,
  updateProfile,
  logout,
} from '../controllers/authController.js';
import {
  validateSendOTP,
  validateVerifyOTP,
  validateOnboarding,
  validateProfileUpdate,
} from '../utils/validators.js';
import { handleValidationErrors } from '../middleware/errorHandler.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/send-otp', otpLimiter, validateSendOTP, handleValidationErrors, sendOTP);
router.post('/verify-otp', authLimiter, validateVerifyOTP, handleValidationErrors, verifyOTP);

// Google OAuth routes (placeholder)
router.get('/google', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Google OAuth not implemented yet',
  });
});

router.get('/google/callback', googleCallback);

// Protected routes
router.post('/onboarding', authenticate, validateOnboarding, handleValidationErrors, completeOnboarding);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validateProfileUpdate, handleValidationErrors, updateProfile);
router.post('/logout', authenticate, logout);

// Health check
router.get('/health', optionalAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth service is running',
    data: {
      authenticated: Boolean(req.user),
      user: req.user ? {
        id: req.user._id,
        role: req.user.role,
        phoneNumber: req.user.phoneNumber,
      } : null,
    },
  });
});

export default router;