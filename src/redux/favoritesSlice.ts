import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, FavoritesState } from '../types';

const initialState: FavoritesState = { items: [] };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(i => i.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      AsyncStorage.setItem('favorites', JSON.stringify(state.items));
    },
    loadFavorites: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
  },
});

export const { toggleFavorite, loadFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;