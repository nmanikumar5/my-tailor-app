import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../theme';

type OnboardingScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Onboarding'
>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

const OnboardingScreen: React.FC<Props> = ({ navigation: _ }) => {
  const { theme } = useTheme();
  const { completeOnboarding } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'tailor' | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = (role: 'customer' | 'tailor') => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select your role');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (selectedRole === 'tailor' && !businessName.trim()) {
      Alert.alert('Error', 'Please enter your business name');
      return;
    }

    const onboardingData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: selectedRole,
      email: email.trim() || undefined,
      businessName: selectedRole === 'tailor' ? businessName.trim() : undefined,
    };

    setIsLoading(true);
    try {
      const response = await completeOnboarding(onboardingData);
      
      if (response.success) {
        Alert.alert('Success', `Welcome to TailorApp, ${firstName}!`);
        // Navigation to main app is handled by AppNavigator based on auth state
      } else {
        Alert.alert('Error', response.message || 'Onboarding failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Tell us a bit about yourself to get started
        </Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            placeholderTextColor={theme.colors.textSecondary}
            value={firstName}
            onChangeText={setFirstName}
            editable={!isLoading}
          />

          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            placeholderTextColor={theme.colors.textSecondary}
            value={lastName}
            onChangeText={setLastName}
            editable={!isLoading}
          />

          <Text style={styles.label}>Email (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <Text style={styles.roleLabel}>What describes you best? *</Text>

          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === 'customer' && styles.roleCardSelected,
              ]}
              onPress={() => handleRoleSelection('customer')}
              disabled={isLoading}>
              <View style={styles.roleIcon}>
                <Text style={styles.roleIconText}>👤</Text>
              </View>
              <Text style={styles.roleTitle}>Customer</Text>
              <Text style={styles.roleDescription}>
                Find tailors, get measurements, place orders
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === 'tailor' && styles.roleCardSelected,
              ]}
              onPress={() => handleRoleSelection('tailor')}
              disabled={isLoading}>
              <View style={styles.roleIcon}>
                <Text style={styles.roleIconText}>✂️</Text>
              </View>
              <Text style={styles.roleTitle}>Tailor/Boutique</Text>
              <Text style={styles.roleDescription}>
                Manage customers, showcase fabrics, handle orders
              </Text>
            </TouchableOpacity>
          </View>

          {selectedRole === 'tailor' && (
            <>
              <Text style={styles.label}>Business Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your business name"
                placeholderTextColor={theme.colors.textSecondary}
                value={businessName}
                onChangeText={setBusinessName}
                editable={!isLoading}
              />
            </>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedRole || !firstName.trim() || !lastName.trim() || isLoading) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedRole || !firstName.trim() || !lastName.trim() || isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <Text
              style={[
                styles.continueButtonText,
                (!selectedRole || !firstName.trim() || !lastName.trim()) && styles.continueButtonTextDisabled,
              ]}>
              Complete Profile
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: 8,
      marginTop: 20,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
    },
    formContainer: {
      flex: 1,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: 8,
      marginTop: 16,
    },
    roleLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: 16,
      marginTop: 24,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 16,
      fontSize: 16,
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.backgroundPaper,
    },
    roleContainer: {
      marginBottom: 16,
    },
    roleCard: {
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundPaper,
    },
    roleCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    roleIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    roleIconText: {
      fontSize: 20,
    },
    roleTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    roleDescription: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    continueButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginTop: 20,
    },
    continueButtonDisabled: {
      backgroundColor: theme.colors.textDisabled,
    },
    continueButtonText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
    continueButtonTextDisabled: {
      color: theme.colors.textSecondary,
    },
  });

export default OnboardingScreen;