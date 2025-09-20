import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import smsService from '../services/smsService.js';

// Send OTP for phone number login
export const sendOTP = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  
  // Check if user exists
  let user = await User.findByPhoneNumber(phoneNumber);
  
  if (!user) {
    // Create new user with unverified phone
    user = new User({
      phoneNumber,
      role: 'customer', // Default role, will be updated during onboarding
      isPhoneVerified: false,
    });
  }
  
  // Generate and save OTP
  const otp = await user.generateOTP();
  await user.save();
  
  try {
    // Send OTP via SMS
    await smsService.sendOTP(phoneNumber, otp);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phoneNumber,
        expiresAt: user.otp.expiresAt,
      },
    });
  } catch (error) {
    console.error('SMS sending failed:', error.message);
    
    // Clear OTP if SMS sending fails
    user.otp = undefined;
    await user.save();
    
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.',
    });
  }
});

// Verify OTP and login
export const verifyOTP = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;
  
  // Find user
  const user = await User.findByPhoneNumber(phoneNumber);
  
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number',
    });
  }
  
  // Verify OTP
  const isValidOTP = await user.verifyOTP(otp);
  
  if (!isValidOTP) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired OTP',
      data: {
        attemptsRemaining: Math.max(0, 3 - user.otp?.attempts || 0),
      },
    });
  }
  
  // Generate JWT token
  const token = generateToken(user._id, user.role);
  
  // Update last login
  user.lastLoginAt = new Date();
  await user.save();
  
  // Check if user needs onboarding
  const needsOnboarding = !user.firstName || !user.role || user.role === 'customer';
  
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified,
        profileImage: user.profileImage,
        needsOnboarding,
      },
    },
  });
});

// Complete user onboarding
export const completeOnboarding = asyncHandler(async (req, res) => {
  const { firstName, lastName, role, email, businessName } = req.body;
  const userId = req.userId;
  
  // Get user
  const user = await User.findById(userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  
  // Update user information
  user.firstName = firstName;
  user.lastName = lastName;
  user.role = role;
  
  if (email) {
    user.email = email;
  }
  
  // Tailor-specific fields
  if (role === 'tailor') {
    user.businessName = businessName;
    
    // Initialize trial subscription
    user.subscription = {
      plan: 'trial',
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
      trialUsed: true,
    };
  }
  
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Onboarding completed successfully',
    data: {
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        businessName: user.businessName,
        subscription: user.subscription,
      },
    },
  });
});

// Google OAuth callback (placeholder for now)
export const googleCallback = asyncHandler(async (req, res) => {
  // This will be implemented when Google OAuth is properly configured
  res.status(501).json({
    success: false,
    message: 'Google OAuth not implemented yet',
  });
});

// Get current user profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        businessName: user.businessName,
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified,
        profileImage: user.profileImage,
        location: user.location,
        subscription: user.subscription,
        measurements: user.measurements,
        specializations: user.specializations,
        experience: user.experience,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});

// Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const updates = req.body;
  
  // Remove sensitive fields from updates
  delete updates.phoneNumber;
  delete updates.password;
  delete updates.otp;
  delete updates.isPhoneVerified;
  delete updates.isEmailVerified;
  delete updates.role;
  delete updates.subscription;
  
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password -otp');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
});

// Logout (client-side token invalidation)
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});