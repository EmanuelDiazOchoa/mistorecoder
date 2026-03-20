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
  ...palette,
  colors: isDark ? palette.dark : palette.light,
  shadows,
  isDark,
  primary: accentColor,
  bgTint: `${accentColor}14`,
});