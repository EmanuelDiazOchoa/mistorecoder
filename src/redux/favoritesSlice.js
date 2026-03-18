import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [] },
  reducers: {
    toggleFavorite: (state, action) => {
      const index = state.items.findIndex(i => i.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      AsyncStorage.setItem('favorites', JSON.stringify(state.items));
    },
    loadFavorites: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { toggleFavorite, loadFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;