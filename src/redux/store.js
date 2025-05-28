// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import authReducer from '../features/auth/authSlice';
import { authApi } from '../features/auth/authApi';
 

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware), 
});
