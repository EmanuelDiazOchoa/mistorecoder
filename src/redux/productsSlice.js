import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../service/firebase';
import { ref, get } from 'firebase/database';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await get(ref(db, 'products/'));
      const data = snapshot.val();
      return data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: { products: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
