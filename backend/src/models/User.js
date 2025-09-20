import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
  // Basic Information
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    sparse: true, // Allows multiple null values
    trim: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  
  // Authentication
  password: {
    type: String,
    minlength: 6,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  
  // Role and Profile
  role: {
    type: String,
    enum: ['customer', 'tailor'],
    required: true,
  },
  profileImage: {
    type: String, // URL to profile image
  },
  
  // Google OAuth
  googleId: {
    type: String,
    sparse: true,
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  },
  
  // OTP for phone verification
  otp: {
    code: String,
    expiresAt: Date,
    attempts: {
      type: Number,
      default: 0,
    },
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLoginAt: {
    type: Date,
  },
  
  // Tailor-specific fields
  businessName: {
    type: String,
    trim: true,
  },
  businessDescription: {
    type: String,
    trim: true,
  },
  specializations: [{
    type: String,
    enum: ['suits', 'dresses', 'alterations', 'traditional', 'western', 'ethnic'],
  }],
  experience: {
    type: Number, // years of experience
  },
  
  // Subscription for tailors
  subscription: {
    plan: {
      type: String,
      enum: ['trial', 'basic', 'premium'],
      default: 'trial',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: function() {
        // 7 days trial by default
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      },
    },
    trialUsed: {
      type: Boolean,
      default: false,
    },
  },
  
  // Customer-specific fields
  measurements: {
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    data: {
      type: Map,
      of: Number, // Store measurements as key-value pairs
    },
    lastUpdated: {
      type: Date,
    },
  },
  
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.otp;
      return ret;
    }
  }
});

// Indexes
// Note: phoneNumber, email, and googleId indexes are automatically created by 'unique' and 'sparse' properties
userSchema.index({ role: 1 });
userSchema.index({ 'location.coordinates': '2dsphere' });

// Instance Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateOTP = async function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: await bcrypt.hash(otp, 10),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    attempts: 0,
  };
  return otp; // Return plain OTP to send via SMS
};

userSchema.methods.verifyOTP = async function(candidateOTP) {
  if (!this.otp || !this.otp.code) {
    return false;
  }
  
  if (new Date() > this.otp.expiresAt) {
    return false;
  }
  
  if (this.otp.attempts >= 3) {
    return false;
  }
  
  const isValid = await bcrypt.compare(candidateOTP, this.otp.code);
  
  if (!isValid) {
    this.otp.attempts += 1;
    await this.save();
    return false;
  }
  
  // Clear OTP after successful verification
  this.otp = undefined;
  this.isPhoneVerified = true;
  await this.save();
  
  return true;
};

userSchema.methods.isSubscriptionActive = function() {
  if (this.role !== 'tailor') {
    return true; // Customers don't need subscriptions
  }
  
  return this.subscription.isActive && new Date() < this.subscription.endDate;
};

userSchema.methods.getRemainingTrialDays = function() {
  if (this.role !== 'tailor' || this.subscription.plan !== 'trial') {
    return 0;
  }
  
  const now = new Date();
  const endDate = new Date(this.subscription.endDate);
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Hash password if modified
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  // Update lastLoginAt on save if not a new document
  if (!this.isNew) {
    this.lastLoginAt = new Date();
  }
  
  next();
});

// Static Methods
userSchema.statics.findByPhoneNumber = function(phoneNumber) {
  return this.findOne({ phoneNumber });
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

userSchema.statics.findByGoogleId = function(googleId) {
  return this.findOne({ googleId });
};

userSchema.statics.findTailorsNearLocation = function(longitude, latitude, maxDistance = 10000) {
  return this.find({
    role: 'tailor',
    isActive: true,
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    }
  });
};

const User = mongoose.model('User', userSchema);

export default User;