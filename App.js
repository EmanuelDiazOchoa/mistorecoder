import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { store } from './src/redux/store';
import StackNavigator from './src/navigation/StackNavigator';
import { loadCartFromStorage } from './src/redux/cartSlice';
import { setDarkMode } from './src/redux/uiSlice';
import { loadOrders } from './src/redux/ordersSlice';

WebBrowser.maybeCompleteAuthSession();

function Root() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      dispatch(loadCartFromStorage());
      const [darkPref, ordersData] = await Promise.all([
        AsyncStorage.getItem('darkMode'),
        AsyncStorage.getItem('orders'),
      ]);
      if (darkPref !== null) dispatch(setDarkMode(JSON.parse(darkPref)));
      if (ordersData) dispatch(loadOrders(JSON.parse(ordersData)));
    })();
  }, []);

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}