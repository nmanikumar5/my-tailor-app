export const colors = {
  // TailorApp Brand Colors
  primary: '#6366F1', // Indigo
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  
  secondary: '#EC4899', // Pink
  secondaryDark: '#DB2777',
  secondaryLight: '#F472B6',

  accent: '#10B981', // Emerald
  accentDark: '#059669',
  accentLight: '#34D399',

  // Neutral Colors
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Background Colors
  background: {
    light: '#FFFFFF',
    dark: '#111827',
    paper: {
      light: '#F9FAFB',
      dark: '#1F2937',
    },
  },

  // Text Colors
  text: {
    primary: {
      light: '#111827',
      dark: '#F9FAFB',
    },
    secondary: {
      light: '#6B7280',
      dark: '#9CA3AF',
    },
    disabled: {
      light: '#D1D5DB',
      dark: '#4B5563',
    },
  },

  // Border Colors
  border: {
    light: '#E5E7EB',
    dark: '#374151',
  },
};

export const lightTheme = {
  colors: {
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    primaryLight: colors.primaryLight,
    secondary: colors.secondary,
    accent: colors.accent,
    background: colors.background.light,
    backgroundPaper: colors.background.paper.light,
    textPrimary: colors.text.primary.light,
    textSecondary: colors.text.secondary.light,
    textDisabled: colors.text.disabled.light,
    border: colors.border.light,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    white: colors.white,
    black: colors.black,
    gray: colors.gray,
  },
};

export const darkTheme = {
  colors: {
    primary: colors.primaryLight,
    primaryDark: colors.primary,
    primaryLight: colors.primaryDark,
    secondary: colors.secondaryLight,
    accent: colors.accentLight,
    background: colors.background.dark,
    backgroundPaper: colors.background.paper.dark,
    textPrimary: colors.text.primary.dark,
    textSecondary: colors.text.secondary.dark,
    textDisabled: colors.text.disabled.dark,
    border: colors.border.dark,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    white: colors.white,
    black: colors.black,
    gray: colors.gray,
  },
};

export type Theme = typeof lightTheme;