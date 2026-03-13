import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import HomeScreen from './HomeScreen';
import CategoriesScreen from './CategoriesScreen';
import CartScreen from './CartScreen';
import OrdersScreen from './OrdersScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home', label: 'Inicio', icon: 'home' },
  { name: 'Categories', label: 'Categorías', icon: 'category' },
  { name: 'Cart', label: 'Carrito', icon: 'shopping-cart' },
  { name: 'Orders', label: 'Pedidos', icon: 'receipt-long' },
  { name: 'Profile', label: 'Perfil', icon: 'person' },
];

function TabBarButton({ isFocused, label, icon, isCart, cartCount, onPress, onLongPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFocused) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1.15, tension: 80, friction: 6, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
      ]).start();
    }
  }, [isFocused]);

  const color = isFocused ? '#E85D26' : 'rgba(255,255,255,0.35)';

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBtn}
    >
      <Animated.View style={[styles.tabIconWrap, { transform: [{ scale: scaleAnim }] }]}>
        {isFocused && <View style={styles.activeGlow} />}
        <MaterialIcons name={icon} size={24} color={color} />
        {isCart && cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
          </View>
        )}
      </Animated.View>
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  const cartCount = useSelector((s) => s.cart.items.length);

  return (
    <View style={styles.tabBar}>
      <View style={styles.tabBarInner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const tab = TABS.find(t => t.name === route.name);

          return (
            <TabBarButton
              key={route.key}
              isFocused={isFocused}
              label={tab?.label || ''}
              icon={tab?.icon || 'home'}
              isCart={route.name === 'Cart'}
              cartCount={cartCount}
              onPress={() => {
                if (!isFocused) navigation.navigate(route.name);
              }}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingBottom: 20, paddingTop: 0,
    backgroundColor: 'transparent',
  },
  tabBarInner: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: 'rgba(20,15,35,0.97)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  tabBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 4,
  },
  tabIconWrap: {
    position: 'relative',
    alignItems: 'center', justifyContent: 'center',
    width: 40, height: 32,
  },
  activeGlow: {
    position: 'absolute',
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E85D26', opacity: 0.15,
  },
  tabLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.2 },
  badge: {
    position: 'absolute', top: -4, right: -4,
    minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: '#E85D26',
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: '#0A0A0F',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
});