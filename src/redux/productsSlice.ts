import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../service/firebase';
import { ref, get } from 'firebase/database';
import { Product, ProductsState } from '../types';

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await get(ref(db, 'products/'));
      const data = snapshot.val();
      return data
        ? Object.entries(data).map(([id, value]) => ({ id, ...(value as object) } as Product))
        : [];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState: ProductsState = { products: [], loading: false, error: null };

const productsSlice = createSlice({
  name: 'products',
  initialState,
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
        state.error = action.payload ?? 'Error desconocido';
      });
  },
});

export default productsSlice.reducer;