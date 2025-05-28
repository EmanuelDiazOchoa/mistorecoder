// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import authReducer from './authSlice'; // <-- si estás usando authSlice
import { authApi } from '../services/authApi'; // <-- importar el authApi

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer, // 👈 aquí se agrega el reducer de RTK Query
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware), // 👈 y acá se conecta el middleware
});
