// store.ts — lightweight placeholder
import { configureStore } from '@reduxjs/toolkit';

// TODO: add real reducers
export const store = configureStore({ reducer: {} as any });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
