// ============================================================
// THEME SYSTEM — src/theme/index.ts
// Dominio: Productora de Eventos
// ============================================================

export const COLORS = {
  background: '#0d1117',
  surface: '#161b22',
  surfaceLight: '#21262d',
  border: '#30363d',
  borderLight: '#484f58',
  
  primary: '#1f6feb',
  primaryLight: '#58a6ff',
  primaryBg: '#1f6feb22',
  
  success: '#238636',
  successLight: '#3fb950',
  successBg: '#23863622',
  
  warning: '#d29922',
  warningLight: '#e3b341',
  warningBg: '#d2992222',
  
  textPrimary: '#ffffff',
  textSecondary: '#8b949e',
  textMuted: '#6e7681',
  textValue: '#c9d1d9',
  
  danger: '#da3633',
  dangerBg: '#da363322',
  white: '#ffffff',
} as const;

export const TYPOGRAPHY = {
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold' as const,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  body: {
    fontSize: 13,
    color: COLORS.textValue,
  },
  caption: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;
