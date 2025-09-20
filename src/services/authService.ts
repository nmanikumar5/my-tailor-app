import apiClient from './apiClient';

export interface SendOTPRequest {
  phoneNumber: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  data: {
    phoneNumber: string;
    expiresAt: string;
  };
}

export interface VerifyOTPRequest {
  phoneNumber: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      phoneNumber: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      role: 'customer' | 'tailor';
      isPhoneVerified: boolean;
      isEmailVerified: boolean;
      profileImage?: string;
      needsOnboarding: boolean;
    };
  };
}

export interface OnboardingRequest {
  firstName: string;
  lastName: string;
  role: 'customer' | 'tailor';
  email?: string;
  businessName?: string;
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      phoneNumber: string;
      email?: string;
      firstName: string;
      lastName: string;
      role: 'customer' | 'tailor';
      businessName?: string;
      subscription?: {
        plan: string;
        isActive: boolean;
        startDate: string;
        endDate: string;
        trialUsed: boolean;
      };
    };
  };
}

export interface UserProfile {
  id: string;
  phoneNumber: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: 'customer' | 'tailor';
  businessName?: string;
  businessDescription?: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  profileImage?: string;
  location?: {
    coordinates: [number, number];
    address: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  subscription?: {
    plan: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
    trialUsed: boolean;
  };
  measurements?: {
    gender?: 'male' | 'female';
    data?: Record<string, number>;
    lastUpdated?: string;
  };
  specializations?: string[];
  experience?: number;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetProfileResponse {
  success: boolean;
  data: {
    user: UserProfile;
  };
}

class AuthService {
  // Send OTP to phone number
  async sendOTP(phoneNumber: string): Promise<SendOTPResponse> {
    return apiClient.post('/auth/send-otp', { phoneNumber });
  }

  // Verify OTP and login
  async verifyOTP(phoneNumber: string, otp: string): Promise<VerifyOTPResponse> {
    const response = await apiClient.post('/auth/verify-otp', { phoneNumber, otp });
    
    // Store token in API client
    if (response.success && response.data.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  // Complete user onboarding
  async completeOnboarding(data: OnboardingRequest): Promise<OnboardingResponse> {
    return apiClient.post('/auth/onboarding', data);
  }

  // Get current user profile
  async getProfile(): Promise<GetProfileResponse> {
    return apiClient.get('/auth/profile');
  }

  // Update user profile
  async updateProfile(data: Partial<UserProfile>): Promise<GetProfileResponse> {
    return apiClient.put('/auth/profile', data);
  }

  // Logout user
  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/auth/logout');
    
    // Clear token from API client
    apiClient.clearToken();
    
    return response;
  }

  // Check authentication status
  async checkAuth(): Promise<GetProfileResponse> {
    return apiClient.get('/auth/profile');
  }

  // Set authentication token
  setToken(token: string): void {
    apiClient.setToken(token);
  }

  // Clear authentication token
  clearToken(): void {
    apiClient.clearToken();
  }
}

export default new AuthService();