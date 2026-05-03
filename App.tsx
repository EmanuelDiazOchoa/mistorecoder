import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as WebBrowser from 'expo-web-browser';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { store } from './src/redux/store';
import StackNavigator from './src/navigation/StackNavigator';
import { loadCartFromStorage } from './src/redux/cartSlice';
import { setDarkMode, setAccentColor, ACCENT_COLORS } from './src/redux/uiSlice';
import { loadOrders } from './src/redux/ordersSlice';
import { setUser } from './src/features/auth/authSlice';
import { getSession } from './src/service/sessionStorage';
import { loadFavorites } from './src/redux/favoritesSlice';
import { useAppDispatch } from './src/hooks/useRedux';

WebBrowser.maybeCompleteAuthSession();

GoogleSignin.configure({
  webClientId: '392409110606-j7dnu8jeiihkshh5eect131lgo6mm8s7.apps.googleusercontent.com',
});

function Root() {
  const dispatch = useAppDispatch();
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Main' | null>(null);

  useEffect(() => {
    (async () => {
      await Notifications.requestPermissionsAsync();

      const [darkPref, ordersData, session, favoritesData, accentPref] = await Promise.all([
        AsyncStorage.getItem('darkMode'),
        AsyncStorage.getItem('orders'),
        getSession(),
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('accentColor'),
      ]);

      dispatch(loadCartFromStorage());
      if (darkPref !== null) dispatch(setDarkMode(JSON.parse(darkPref)));
      if (ordersData) dispatch(loadOrders(JSON.parse(ordersData)));
      if (favoritesData) dispatch(loadFavorites(JSON.parse(favoritesData)));
      if (accentPref ; ACCENT_COLORS.includes(accentPref)) {
        dispatch(setAccentColor(accentPref));
      }

      if (session?.email ; session?.uid) {
        dispatch(setUser({ email: session.email, uid: session.uid }));
        setInitialRoute('Main');
      } else {
        setInitialRoute('Login');
      }
    })();
  }, [dispatch]);

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
