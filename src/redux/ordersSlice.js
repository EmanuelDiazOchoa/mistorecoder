import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { orders: [] },
  reducers: {
    addOrder: (state, action) => {
      const order = {
        id: Date.now().toString(),
        items: action.payload.items,
        total: action.payload.total,
        date: new Date().toISOString(),
        status: 'completed',
      };
      state.orders.unshift(order);
      AsyncStorage.setItem('orders', JSON.stringify(state.orders));
    },
    loadOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
});

export const { addOrder, loadOrders } = ordersSlice.actions;
export default ordersSlice.reducer;