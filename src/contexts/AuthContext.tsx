import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService, { UserProfile, VerifyOTPResponse } from '../services/authService';

interface AuthContextType {
  // State
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  sendOTP: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<VerifyOTPResponse>;
  completeOnboarding: (data: any) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = '@tailorapp_token';
const USER_KEY = '@tailorapp_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user && token);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (storedToken && storedUser) {
          // Set token in auth service
          authService.setToken(storedToken);
          
          // Verify token is still valid
          try {
            const response = await authService.checkAuth();
            if (response.success) {
              setToken(storedToken);
              setUser(response.data.user);
            } else {
              // Token invalid, clear storage
              await clearAuthData();
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            await clearAuthData();
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        await clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const storeAuthData = async (authToken: string, userData: UserProfile) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, authToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(userData)),
      ]);
    } catch (error) {
      console.error('Failed to store auth data:', error);
    }
  };

  const clearAuthData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
      
      authService.clearToken();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  };

  const sendOTP = async (phoneNumber: string) => {
    try {
      const response = await authService.sendOTP(phoneNumber);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to send OTP',
      };
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    try {
      const response = await authService.verifyOTP(phoneNumber, otp);
      
      if (response.success) {
        const { token: newToken, user: userData } = response.data;
        
        setToken(newToken);
        setUser(userData as UserProfile);
        
        // Store in AsyncStorage
        await storeAuthData(newToken, userData as UserProfile);
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'OTP verification failed',
        data: null,
      };
    }
  };

  const completeOnboarding = async (data: any) => {
    try {
      const response = await authService.completeOnboarding(data);
      
      if (response.success) {
        // Update user state
        const updatedUser = { ...user, ...response.data.user } as UserProfile;
        setUser(updatedUser);
        
        // Update stored user data
        if (token) {
          await storeAuthData(token, updatedUser);
        }
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Onboarding failed',
      };
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const response = await authService.updateProfile(data);
      
      if (response.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        
        // Update stored user data
        if (token) {
          await storeAuthData(token, updatedUser);
        }
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Profile update failed',
      };
    }
  };

  const refreshProfile = async () => {
    if (!token) return;
    
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUser(response.data.user);
        await storeAuthData(token, response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      await clearAuthData();
    }
  };

  const value = {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    
    // Actions
    sendOTP,
    verifyOTP,
    completeOnboarding,
    updateProfile,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};