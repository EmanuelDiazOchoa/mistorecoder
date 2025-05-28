// src/redux/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase/firebase';
import { ref, onValue } from 'firebase/database';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  return new Promise((resolve) => {
    const productsRef = ref(db, 'products/');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const loaded = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
      resolve(loaded);
    });
  });
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { products: [], loading: false },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      });
  }
});

export default productsSlice.reducer;
