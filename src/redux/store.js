import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
