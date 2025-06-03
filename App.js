import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/redux/store';
import StackNavigator from './src/navigation/StackNavigator';
import { loadCartFromStorage } from './src/redux/cartSlice';


function Root() {
  const dispatch = useDispatch();

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
