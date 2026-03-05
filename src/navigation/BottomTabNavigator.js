import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator();

const iconMap = {
  Home: 'home',
  Categories: 'category',
  Cart: 'shopping-cart',
  Orders: 'receipt-long',
  Profile: 'person',
};

export default function BottomTabNavigator() {
  const theme = useTheme();
  const cartCount = useSelector((state) => state.cart.items.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 72,
          position: 'absolute',
          borderTopWidth: 0,
          ...theme.shadows.lg,
        },
        tabBarIcon: ({ color }) => {
          const isCart = route.name === 'Cart';
          return (
            <View>
              <MaterialIcons name={iconMap[route.name]} size={26} color={color} />
              {isCart && cartCount > 0 && (
                <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.badgeText}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </Text>
                </View>
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categorías' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Carrito' }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'Pedidos' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
});