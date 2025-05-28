// src/redux/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [
    { id: '1', name: 'Producto A', price: 100 },
    { id: '2', name: 'Producto B', price: 200 },
  ],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct(state, action) {
      state.products.push(action.payload);
    },
    removeProduct(state, action) {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
  },
});

export const { addProduct, removeProduct } = productsSlice.actions;
export default productsSlice.reducer;
