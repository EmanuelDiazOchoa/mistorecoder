import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from './cartSlice';
import uiReducer from './uiSlice';
import ordersReducer from './ordersSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});