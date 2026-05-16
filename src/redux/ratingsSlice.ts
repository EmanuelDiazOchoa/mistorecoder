import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ProductRating {
  productId: string;
  rating: number;
  count: number;
  userRating: number | null;
}

export interface RatingsState {
  ratings: Record<string, ProductRating>;
}

const persist = (ratings: Record<string, ProductRating>) =>
  AsyncStorage.setItem('ratings', JSON.stringify(ratings));

const ratingsSlice = createSlice({
  name: 'ratings',
  initialState: { ratings: {} } as RatingsState,
  reducers: {
    loadRatings: (state, action: PayloadAction<Record<string, ProductRating>>) => {
      state.ratings = action.payload;
    },
    rateProduct: (state, action: PayloadAction<{ productId: string; rating: number }>) => {
      const { productId, rating } = action.payload;
      const existing = state.ratings[productId];
      if (existing) {
        if (existing.userRating !== null) {
          const oldTotal = existing.rating * existing.count;
          existing.rating     = Math.round(((oldTotal - existing.userRating + rating) / existing.count) * 10) / 10;
          existing.userRating = rating;
        } else {
          const oldTotal      = existing.rating * existing.count;
          existing.count     += 1;
          existing.rating     = Math.round(((oldTotal + rating) / existing.count) * 10) / 10;
          existing.userRating = rating;
        }
      } else {
        state.ratings[productId] = { productId, rating, count: 1, userRating: rating };
      }
      persist(state.ratings);
    },
  },
});

export const { loadRatings, rateProduct } = ratingsSlice.actions;
export default ratingsSlice.reducer;