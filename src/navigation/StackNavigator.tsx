import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = ({ initialRoute = 'Login' }: { initialRoute?: keyof RootStackParamList }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login"            component={LoginScreen} />
      <Stack.Screen name="Register"         component={RegisterScreen} />
      <Stack.Screen name="Main"             component={BottomTabNavigator} />
      <Stack.Screen name="Details"          component={DetailsScreen} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;