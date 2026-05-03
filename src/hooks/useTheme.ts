import { useAppSelector } from './useRedux';
import { getTheme } from '../theme';

export const useTheme = () => {
  const isDark = useAppSelector((state) => state.ui.isDark ?? true);
  const accentColor = useAppSelector((state) => state.ui.accentColor ?? '#E85D26');
  return getTheme(isDark, accentColor);
};
