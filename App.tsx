import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/redux/store';
import type { AppDispatch } from './src/redux/store';
import StackNavigator from './src/navigation/StackNavigator';
import { loadCartFromStorage } from './src/redux/cartSlice';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

function Root() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadCartFromStorage());
  }, []);

  return <StackNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </Provider>
  );
}
