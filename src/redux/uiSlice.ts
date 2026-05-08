import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UIState } from '../types';

export const ACCENT_COLORS = ['#E85D26', '#7C3AED', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

const initialState: UIState = { isDark: true, accentColor: '#E85D26' };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDark = !state.isDark;
      AsyncStorage.setItem('darkMode', JSON.stringify(state.isDark));
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
      AsyncStorage.setItem('accentColor', action.payload);
    },
  },
});

export const { toggleDarkMode, setDarkMode, setAccentColor } = uiSlice.actions;
export default uiSlice.reducer;