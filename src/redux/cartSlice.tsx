import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';

const CART_STORAGE_KEY = 'cartItems';

export const loadCartFromStorage = createAsyncThunk(
  'cart/loadCartFromStorage',
  async () => {
    const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
  },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((_, index) => index !== action.payload);
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      AsyncStorage.removeItem(CART_STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCartFromStorage.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
