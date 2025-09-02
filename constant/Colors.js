const tintColorLight = '#003DA5'; // Cal State LA Blue
const tintColorDark = '#FFB81C'; // Golden Eagle Gold

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  
  // Brand Colors - Cal State LA Official
  PRIMARY: '#003DA5', // Cal State LA Blue
  SECONDARY: '#FFB81C', // Golden Eagle Gold
  
  // Primary Color Variants
  PRIMARY_50: '#eff6ff',
  PRIMARY_100: '#dbeafe',
  PRIMARY_200: '#bfdbfe',
  PRIMARY_300: '#93c5fd',
  PRIMARY_400: '#60a5fa',
  PRIMARY_500: '#3b82f6',
  PRIMARY_600: '#003DA5', // Main brand color
  PRIMARY_700: '#1d4ed8',
  PRIMARY_800: '#1e40af',
  PRIMARY_900: '#1e3a8a',
  
  // Secondary Color Variants
  SECONDARY_50: '#fffbeb',
  SECONDARY_100: '#fef3c7',
  SECONDARY_200: '#fde68a',
  SECONDARY_300: '#fcd34d',
  SECONDARY_400: '#fbbf24',
  SECONDARY_500: '#FFB81C', // Main secondary color
  SECONDARY_600: '#d97706',
  SECONDARY_700: '#b45309',
  SECONDARY_800: '#92400e',
  SECONDARY_900: '#78350f',
  
  // Neutral Colors - Modern Gray Scale
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#f9fafb',
  GRAY_100: '#f3f4f6',
  GRAY_200: '#e5e7eb',
  GRAY_300: '#d1d5db',
  GRAY_400: '#9ca3af',
  GRAY_500: '#6b7280',
  GRAY_600: '#4b5563',
  GRAY_700: '#374151',
  GRAY_800: '#1f2937',
  GRAY_900: '#111827',
  
  // Semantic Colors
  TEXT: '#111827',
  TEXT_SECONDARY: '#6b7280',
  TEXT_MUTED: '#9ca3af',
  BACKGROUND: '#ffffff',
  BACKGROUND_SECONDARY: '#f9fafb',
  BORDER: '#e5e7eb',
  BORDER_LIGHT: '#f3f4f6',
  
  // Legacy Colors (for backward compatibility)
  LIGHT_BLUE: '#60a5fa',
  DARK_BLUE: '#1e40af',
  LIGHT_GOLD: '#fcd34d',
  DARK_GOLD: '#d97706',
  LIGHT_GRAY: '#f3f4f6',
  GRAY: '#6b7280',
  DARK_GRAY: '#374151',
  
  // Status Colors - Modern
  SUCCESS: '#10b981',
  SUCCESS_LIGHT: '#d1fae5',
  WARNING: '#f59e0b',
  WARNING_LIGHT: '#fef3c7',
  ERROR: '#ef4444',
  ERROR_LIGHT: '#fee2e2',
  INFO: '#3b82f6',
  INFO_LIGHT: '#dbeafe',
  
  // Mood colors (keep for daily check-in)
  RED: '#ef4444',
  ORANGE: '#f59e0b',
  GREEN: '#10b981',
  
  // Interactive Colors
  HOVER: '#f3f4f6',
  ACTIVE: '#e5e7eb',
  FOCUS: '#dbeafe',
  
  // Opacity Variants
  WHITE_OPACITY_80: 'rgba(255, 255, 255, 0.8)',
  BLACK_OPACITY_10: 'rgba(0, 0, 0, 0.1)',
  BLACK_OPACITY_20: 'rgba(0, 0, 0, 0.2)',
  PRIMARY_OPACITY_10: 'rgba(0, 61, 165, 0.1)',
  PRIMARY_OPACITY_20: 'rgba(0, 61, 165, 0.2)',
};

export default Colors;