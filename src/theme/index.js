const isLightColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
};

export const palette = {
  dark: {
    background: '#0A0A0F',
    surface: '#111018',
    surfaceAlt: '#1A1A2E',
    border: 'rgba(255,255,255,0.08)',
    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.55)',
    textMuted: 'rgba(255,255,255,0.3)',
    tabBar: '#111018',
    card: 'rgba(255,255,255,0.05)',
    input: 'rgba(255,255,255,0.08)',
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const getTheme = (isDark, accentColor = '#E85D26') => ({
  colors: palette.dark,  
  shadows,
  isDark: true,
  primary: accentColor,
  onPrimary: isLightColor(accentColor) ? '#0A0A0F' : '#FFFFFF',
  
  bgTint: `${accentColor}08`, 
});