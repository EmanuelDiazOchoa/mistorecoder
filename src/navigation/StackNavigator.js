import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen'; // ⬅️ Importamos la nueva pantalla

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
        options={{ 
          headerShown: true,
          title: 'Detalle del producto',
          headerBackTitleVisible: false,
        }} 
      />

      <Stack.Screen 
        name="CategoryProducts" 
        component={CategoryProductsScreen} 
        options={{ 
          headerShown: true,
          title: 'Productos por categoría',
          headerBackTitleVisible: false,
        }} 
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;


