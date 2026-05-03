import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCENT_COLORS = ['#E85D26', '#7C3AED', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

const uiSlice = createSlice({
  name: 'ui',
  initialState: { isDark: true, accentColor: '#E85D26' },
  reducers: {
    toggleDarkMode: (state) => {
      state.isDark = !state.isDark;
      AsyncStorage.setItem('darkMode', JSON.stringify(state.isDark));
    },
    setDarkMode: (state, action) => {
      state.isDark = action.payload;
    },
    setAccentColor: (state, action) => {
      state.accentColor = action.payload;
      AsyncStorage.setItem('accentColor', action.payload);
    },
  },
});

export const { toggleDarkMode, setDarkMode, setAccentColor } = uiSlice.actions;
export { ACCENT_COLORS };
export default uiSlice.reducer;