/**
 * ChatIndia Design System Tokens
 * Brand: ChatIndia — Chat. Connect. Share.
 * Primary: Emerald Green (#07C160 / #059648)
 * Secondary: Deep Green (#047857)
 * Accent: Soft Mint (#E8F8F0)
 * Indian Accent: Shagun Red/Gold (#D9383A / #F59E0B), UPI Blue (#0070BA)
 */

export const ChatIndiaBrand = {
  name: 'ChatIndia',
  tagline: 'Chat. Connect. Share.',
  legalName: 'ChatIndia Technologies Pvt. Ltd.',
  version: '2.4.0',
  supportEmail: 'support@chatindia.app',
  defaultRegion: 'Bengaluru, India',
  countryCode: '+91'
};

export const Colors = {
  light: {
    primary: '#07C160',          // Emerald Green
    primaryDark: '#047857',      // Deep Green
    primaryLight: '#E8F8F0',     // Soft Mint Green
    primaryMuted: '#D1FAE5',     // Mint tint
    background: '#F3F4F6',      // Warm neutral off-white
    surface: '#FFFFFF',         // Pure white card
    surfaceSecondary: '#F9FAFB', // Off-white card surface
    surfaceTertiary: '#F3F4F6',
    textPrimary: '#111827',     // Dark Charcoal
    textSecondary: '#4B5563',   // Medium Charcoal
    textMuted: '#9CA3AF',       // Subdued gray
    border: '#E5E7EB',          // Subtle border
    borderSubtle: '#F3F4F6',
    bubbleSent: '#95EC69',      // WeChat-style green bubble
    bubbleSentDark: '#07C160',
    bubbleRecv: '#FFFFFF',      // Clean white bubble
    badgeRed: '#EF4444',        // Notification badge red
    shagunRed: '#DC2626',       // Indian Shagun Envelope Red
    shagunGold: '#F59E0B',      // Shagun Gold accent
    upiBlue: '#0070BA',         // UPI Official Blue
    saffron: '#FF9933',         // Indian Tricolor Saffron
    indiaGreen: '#138808',      // Indian Tricolor Green
    navyAshoka: '#000080',      // Ashoka Chakra Navy
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    overlay: 'rgba(0, 0, 0, 0.55)'
  },
  dark: {
    primary: '#07C160',
    primaryDark: '#059648',
    primaryLight: '#064E3B',
    primaryMuted: '#065F46',
    background: '#0B0F19',
    surface: '#111827',
    surfaceSecondary: '#1F2937',
    surfaceTertiary: '#374151',
    textPrimary: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#6B7280',
    border: '#374151',
    borderSubtle: '#1F2937',
    bubbleSent: '#059648',
    bubbleSentDark: '#047857',
    bubbleRecv: '#1F2937',
    badgeRed: '#EF4444',
    shagunRed: '#DC2626',
    shagunGold: '#F59E0B',
    upiBlue: '#38BDF8',
    saffron: '#FF9933',
    indiaGreen: '#10B981',
    navyAshoka: '#60A5FA',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#60A5FA',
    overlay: 'rgba(0, 0, 0, 0.75)'
  }
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48
};

export const BorderRadius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  full: 9999
};

export const Typography = {
  h1: { fontSize: 24, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 17, fontWeight: '700' as const },
  body1: { fontSize: 15, fontWeight: '400' as const },
  body2: { fontSize: 13.5, fontWeight: '400' as const },
  caption: { fontSize: 11.5, fontWeight: '500' as const },
  micro: { fontSize: 10, fontWeight: '700' as const }
};

export const formatINR = (paiseOrRupees: number, isPaise = true): string => {
  const rupees = isPaise ? paiseOrRupees / 100 : paiseOrRupees;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rupees);
};
