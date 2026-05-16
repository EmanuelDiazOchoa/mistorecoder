import { configureStore } from '@reduxjs/toolkit';
import productsReducer  from './productsSlice';
import authReducer      from '../features/auth/authSlice';
import cartReducer      from './cartSlice';
import uiReducer        from './uiSlice';
import ordersReducer    from './ordersSlice';
import favoritesReducer from './favoritesSlice';
import ratingsReducer   from './ratingsSlice';

export const store = configureStore({
  reducer: {
    products:  productsReducer,
    auth:      authReducer,
    cart:      cartReducer,
    ui:        uiReducer,
    orders:    ordersReducer,
    favorites: favoritesReducer,
    ratings:   ratingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;