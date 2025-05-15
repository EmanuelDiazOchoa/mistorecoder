// Este archivo configura el store de Redux y registra el API y el slice
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import authSlice from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
