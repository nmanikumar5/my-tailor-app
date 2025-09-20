import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
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
  const [selectedRole, setSelectedRole] = useState<'customer' | 'tailor' | null>(null);

  const handleRoleSelection = (role: 'customer' | 'tailor') => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select your role');
      return;
    }
    // TODO: Save user role and navigate to main app
    Alert.alert('Success', `Welcome as ${selectedRole}!`);
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>What describes you best?</Text>
        <Text style={styles.subtitle}>
          Choose your role to personalize your experience
        </Text>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'customer' && styles.roleCardSelected,
            ]}
            onPress={() => handleRoleSelection('customer')}>
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
            onPress={() => handleRoleSelection('tailor')}>
            <View style={styles.roleIcon}>
              <Text style={styles.roleIconText}>✂️</Text>
            </View>
            <Text style={styles.roleTitle}>Tailor/Boutique</Text>
            <Text style={styles.roleDescription}>
              Manage customers, showcase fabrics, handle orders
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedRole && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedRole}>
          <Text
            style={[
              styles.continueButtonText,
              !selectedRole && styles.continueButtonTextDisabled,
            ]}>
            Continue
          </Text>
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
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 48,
    },
    roleContainer: {
      marginBottom: 48,
    },
    roleCard: {
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundPaper,
    },
    roleCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    roleIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    roleIconText: {
      fontSize: 24,
    },
    roleTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      marginBottom: 8,
    },
    roleDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    continueButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
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