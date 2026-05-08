import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrdersState, CartItem } from '../types';

const initialState: OrdersState = { orders: [] };

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<{ items: CartItem[]; total: number }>) => {
      const order = {
        id: Date.now().toString(),
        items: action.payload.items,
        total: action.payload.total,
        date: new Date().toISOString(),
        status: 'completed' as const,
      };
      state.orders.unshift(order);
      AsyncStorage.setItem('orders', JSON.stringify(state.orders));
    },
    loadOrders: (state, action: PayloadAction<OrdersState['orders']>) => {
      state.orders = action.payload;
    },
  },
});

export const { addOrder, loadOrders } = ordersSlice.actions;
export default ordersSlice.reducer;