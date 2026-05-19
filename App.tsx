import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from './src/redux/store';
import StackNavigator from './src/navigation/StackNavigator';
import { loadCartFromStorage } from './src/redux/cartSlice';
import { setDarkMode, setAccentColor, ACCENT_COLORS } from './src/redux/uiSlice';
import { loadOrders } from './src/redux/ordersSlice';
import { setUser } from './src/features/auth/authSlice';
import { getSession } from './src/service/sessionStorage';
import { loadFavorites } from './src/redux/favoritesSlice';
import { loadRatings } from './src/redux/ratingsSlice';
import { setDisplayName } from './src/redux/uiSlice';
import { useAppDispatch } from './src/hooks/useRedux';


function Root() {
  const dispatch = useAppDispatch();
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Main' | null>(null);

  useEffect(() => {
    (async () => {
      const [darkPref, ordersData, session, favoritesData, accentPref, ratingsData, savedName] =
        await Promise.all([
          AsyncStorage.getItem('darkMode'),
          AsyncStorage.getItem('orders'),
          getSession(),
          AsyncStorage.getItem('favorites'),
          AsyncStorage.getItem('accentColor'),
          AsyncStorage.getItem('ratings'),
          AsyncStorage.getItem('profileDisplayName'),
        ]);

      dispatch(loadCartFromStorage());
      if (darkPref !== null) dispatch(setDarkMode(JSON.parse(darkPref)));
      if (ordersData)        dispatch(loadOrders(JSON.parse(ordersData)));
      if (favoritesData)     dispatch(loadFavorites(JSON.parse(favoritesData)));
      if (ratingsData)       dispatch(loadRatings(JSON.parse(ratingsData)));
      if (savedName)         dispatch(setDisplayName(savedName));
      if (accentPref && ACCENT_COLORS.includes(accentPref)) {
        dispatch(setAccentColor(accentPref));
      }

      if (session?.email && session?.uid) {
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