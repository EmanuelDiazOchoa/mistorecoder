import { useSelector } from 'react-redux';
import { getTheme } from '../theme';

export const useTheme = () => {
  const isDark = useSelector((state) => state.ui?.isDark ?? false);
  return getTheme(isDark);
};