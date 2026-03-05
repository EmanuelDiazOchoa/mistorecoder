import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'cartItems';

export const loadCartFromStorage = createAsyncThunk(
  'cart/loadCartFromStorage',
  async () => {
    const stored = await AsyncStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  }
);

const persist = (items) =>
  AsyncStorage.setItem(CART_KEY, JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loaded: false },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
      persist(state.items);
    },
    removeFromCart: (state, action) => {
      state.items.splice(action.payload, 1);
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      AsyncStorage.removeItem(CART_KEY);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCartFromStorage.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loaded = true;
    });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;