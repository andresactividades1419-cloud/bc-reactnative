// ============================================================
// THEME — Tokens de diseño globales
// Dominio: Productora de Eventos (paleta consistente con semanas anteriores)
// ============================================================
export const theme = {
  colors: {
    background: '#0d1117',
    surface: '#161b22',
    surfaceHover: '#21262d',
    border: '#30363d',
    primary: '#1f6feb',
    primaryLight: '#58a6ff',
    success: '#238636',
    danger: '#da3633',
    warning: '#d29922',
    text: '#ffffff',
    textSecondary: '#8b949e',
    textMuted: '#6e7681',
    brand: '#61DAFB',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    full: 9999,
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
} as const;
