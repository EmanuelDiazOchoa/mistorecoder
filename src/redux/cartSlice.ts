import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartState, CartItem, Product } from '../types';

const CART_KEY = 'cartItems';

export const loadCartFromStorage = createAsyncThunk(
  'cart/loadCartFromStorage',
  async (): Promise<CartItem[]> => {
    const stored = await AsyncStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  }
);

const persist = (items: CartItem[]) =>
  AsyncStorage.setItem(CART_KEY, JSON.stringify(items));

const initialState: CartState = { items: [], loaded: false };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      persist(state.items);
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.quantity += 1;
      persist(state.items);
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(i => i.id === action.payload);
      if (index === -1) return;
      if (state.items[index].quantity <= 1) {
        state.items.splice(index, 1);
      } else {
        state.items[index].quantity -= 1;
      }
      persist(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
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

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;