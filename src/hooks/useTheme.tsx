import { useSelector } from 'react-redux';
import { getTheme } from '../theme';

export const useTheme = () => {
  const isDark      = useSelector((state) => state.ui?.isDark ?? true);
  const accentColor = useSelector((state) => state.ui?.accentColor ?? '#E85D26');
  return getTheme(isDark, accentColor);
};