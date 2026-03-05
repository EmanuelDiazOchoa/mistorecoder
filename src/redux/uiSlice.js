import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { isDark: false },
  reducers: {
    toggleDarkMode: (state) => {
      state.isDark = !state.isDark;
      AsyncStorage.setItem('darkMode', JSON.stringify(state.isDark));
    },
    setDarkMode: (state, action) => {
      state.isDark = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode } = uiSlice.actions;
export default uiSlice.reducer;