import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { store } from './src/redux/store';
import StackNavigator from './src/navigation/StackNavigator';
import { loadCartFromStorage } from './src/redux/cartSlice';
import { setDarkMode } from './src/redux/uiSlice';
import { loadOrders } from './src/redux/ordersSlice';
import { setUser } from './src/features/auth/authSlice';
import { getSession } from './src/service/sessionStorage';
import { loadFavorites } from './src/redux/favoritesSlice';
import { setAccentColor } from './src/redux/uiSlice';

WebBrowser.maybeCompleteAuthSession();

function Root() {
  const dispatch = useDispatch();
  const [initialRoute, setInitialRoute] = useState(null); 

  useEffect(() => {
    (async () => {
      
      const [darkPref, ordersData, session, favoritesData, accentPref] = await Promise.all([
        AsyncStorage.getItem('darkMode'),
        AsyncStorage.getItem('orders'),
        getSession(),
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('accentColor'),
      ]);

      dispatch(loadCartFromStorage());
      if (darkPref !== null)  dispatch(setDarkMode(JSON.parse(darkPref)));
      if (ordersData)         dispatch(loadOrders(JSON.parse(ordersData)));
      if (favoritesData)      dispatch(loadFavorites(JSON.parse(favoritesData)));
      if (accentPref)         dispatch(setAccentColor(accentPref));

      if (session?.email && session?.uid) {
        dispatch(setUser({ email: session.email, uid: session.uid }));
        setInitialRoute('Main');
      } else {
        setInitialRoute('Register');
      }
    })();
  }, []);

  
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0F', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#E85D26" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StackNavigator initialRoute={initialRoute} />
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