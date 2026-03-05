export const palette = {
  primary: '#E85D26',
  primaryDark: '#C44A18',
  primaryLight: '#FF7A47',
  success: '#27AE60',
  danger: '#E63946',

  light: {
    background: '#FAF8F5',
    surface: '#FFFFFF',
    surfaceAlt: '#F2EDE8',
    border: '#E8E0D8',
    text: '#1A1208',
    textSecondary: '#6B5E52',
    textMuted: '#A8998E',
    tabBar: '#FFFFFF',
    card: '#FFFFFF',
    input: '#F5F0EB',
  },

  dark: {
    background: '#12100E',
    surface: '#1E1A17',
    surfaceAlt: '#2A2420',
    border: '#3A3028',
    text: '#F5F0EB',
    textSecondary: '#B5A99F',
    textMuted: '#6B5E52',
    tabBar: '#1A1510',
    card: '#1E1A17',
    input: '#2A2420',
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

export const getTheme = (isDark) => ({
  ...palette,
  colors: isDark ? palette.dark : palette.light,
  shadows,
  isDark,
});