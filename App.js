import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // ✅ ESTA ES CLAVE
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import StackNavigator from './src/navigation/StackNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </Provider>
  );
}
