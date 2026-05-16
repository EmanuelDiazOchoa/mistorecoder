import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import BottomTabNavigator      from './BottomTabNavigator';
import LoginScreen             from '../screens/LoginScreen';
import RegisterScreen          from '../screens/RegisterScreen';
import DetailsScreen           from '../screens/DetailsScreen';
import CategoryProductsScreen  from '../screens/CategoryProductsScreen';
import OrderSuccessScreen      from '../screens/OrderSuccessScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator({ initialRoute = 'Login' }: { initialRoute?: keyof RootStackParamList }) {
  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"            component={LoginScreen} />
      <Stack.Screen name="Register"         component={RegisterScreen} />
      <Stack.Screen name="Main"             component={BottomTabNavigator} />
      <Stack.Screen name="Details"          component={DetailsScreen} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}