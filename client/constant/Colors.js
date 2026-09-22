const tintColorLight = '#000000';
const tintColorDark = '#FFCE00';

export const Colors = {
  light: {
    text: '#111827',
    background: '#F8FAFC',
    tint: tintColorLight,
    icon: '#334155',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F8FAFC',
    background: '#111827',
    tint: tintColorDark,
    icon: '#FFD700',
    tabIconDefault: '#FFD700',
    tabIconSelected: tintColorDark,
  },

  // Accessible application colors based on the Cal State LA palette.
  // Black carries light text; gold is used as an accent with dark text.
  PRIMARY: '#000000',
  SECONDARY: '#6F5B16',
  BRAND_GOLD: '#FFCE00',
  BRAND_MARIGOLD: '#FCB237',

  // Primary Color Variants (Gold variants)
  PRIMARY_50: '#FFFBEA',
  PRIMARY_100: '#FFF4B3',
  PRIMARY_200: '#FFED80',
  PRIMARY_300: '#FFE64D',
  PRIMARY_400: '#FFDF1A',
  PRIMARY_500: '#FFCE00',
  PRIMARY_600: '#E6C200',
  PRIMARY_700: '#CCAE00',
  PRIMARY_800: '#B39A00',
  PRIMARY_900: '#998600',

  // Secondary Color Variants (Black/Gray variants)
  SECONDARY_50: '#F0F0F0', // Very light gray for subtle contrast
  SECONDARY_100: '#D9D9D9',
  SECONDARY_200: '#A3A3A3',
  SECONDARY_300: '#7A7A7A',
  SECONDARY_400: '#4D4D4D',
  SECONDARY_500: '#262626', // Dark gray
  SECONDARY_600: '#1A1A1A',
  SECONDARY_700: '#121212', // Main dark background
  SECONDARY_800: '#0A0A0A',
  SECONDARY_900: '#000000', // Pure black

  // Conventional light-to-dark neutral scale.
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#F8FAFC',
  GRAY_100: '#F1F5F9',
  GRAY_200: '#E2E8F0',
  GRAY_300: '#CBD5E1',
  GRAY_400: '#94A3B8',
  GRAY_500: '#64748B',
  GRAY_600: '#475569',
  GRAY_700: '#334155',
  GRAY_800: '#1E293B',
  GRAY_900: '#0F172A',

  TEXT: '#111827',
  TEXT_SECONDARY: '#475569',
  TEXT_MUTED: '#64748B',
  BACKGROUND: '#FFFFFF',
  BACKGROUND_SECONDARY: '#F8FAFC',
  BORDER: '#CBD5E1',
  BORDER_LIGHT: '#E2E8F0',

  LIGHT_BLUE: '#4986B8',
  DARK_BLUE: '#252525',
  LIGHT_GOLD: '#FFF2B2',
  DARK_GOLD: '#6F5B16',
  LIGHT_GRAY: '#F1F5F9',
  GRAY: '#64748B',
  DARK_GRAY: '#334155',

  // Status Colors (Keep as is, or adjust if gold/black versions are needed)
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

  // Interactive Colors (Adjusted)
  HOVER: '#F1F5F9',
  ACTIVE: '#E2E8F0',
  FOCUS: '#4986B8',

  // Opacity Variants (Adjusted for new palette)
  WHITE_OPACITY_80: 'rgba(255, 255, 255, 0.8)',
  BLACK_OPACITY_10: 'rgba(0, 0, 0, 0.1)',
  BLACK_OPACITY_20: 'rgba(0, 0, 0, 0.2)',
  PRIMARY_OPACITY_10: 'rgba(255, 215, 0, 0.1)', // Gold opacity
  PRIMARY_OPACITY_20: 'rgba(255, 215, 0, 0.2)', // Gold opacity
};

export default Colors;
