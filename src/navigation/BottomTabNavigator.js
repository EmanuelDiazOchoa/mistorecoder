import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// ─── SVG Icon set (custom premium icons, no library needed) ──────────────────

function IconHome({ color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
        stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none"
      />
    </Svg>
  );
}

function IconGrid({ color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7" height="7" rx="2" stroke={color} strokeWidth={1.8} fill="none" />
      <Rect x="14" y="3" width="7" height="7" rx="2" stroke={color} strokeWidth={1.8} fill="none" />
      <Rect x="3" y="14" width="7" height="7" rx="2" stroke={color} strokeWidth={1.8} fill="none" />
      <Rect x="14" y="14" width="7" height="7" rx="2" stroke={color} strokeWidth={1.8} fill="none" />
    </Svg>
  );
}

function IconBag({ color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z"
        stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none"
      />
      <Path d="M3 6H21" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path
        d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none"
      />
    </Svg>
  );
}

function IconReceipt({ color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 2H20V22L17 20L14 22L12 20L10 22L7 20L4 22V2Z"
        stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none"
      />
      <Path d="M8 8H16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M8 12H16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M8 16H12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function IconUser({ color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.8} fill="none" />
      <Path
        d="M4 20C4 17 7.58 14 12 14C16.42 14 20 17 20 20"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none"
      />
    </Svg>
  );
}

const TABS = [
  { name: 'Home',       label: 'Inicio',     Icon: IconHome    },
  { name: 'Categories', label: 'Categorías', Icon: IconGrid    },
  { name: 'Cart',       label: 'Carrito',    Icon: IconBag     },
  { name: 'Orders',     label: 'Pedidos',    Icon: IconReceipt },
  { name: 'Profile',    label: 'Perfil',     Icon: IconUser    },
];

// ─── Single tab button ────────────────────────────────────────────────────────

function TabButton({ isFocused, label, Icon, isCart, cartCount, onPress }) {
  const scale  = useRef(new Animated.Value(1)).current;
  const glow   = useRef(new Animated.Value(0)).current;
  const labelO = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: isFocused ? 1.12 : 1,
        tension: 90, friction: 7, useNativeDriver: true,
      }),
      Animated.timing(glow, {
        toValue: isFocused ? 1 : 0,
        duration: 220, useNativeDriver: false,
      }),
      Animated.timing(labelO, {
        toValue: isFocused ? 1 : 0,
        duration: 180, useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  const ACTIVE   = '#E85D26';
  const INACTIVE = 'rgba(255,255,255,0.3)';
  const color    = isFocused ? ACTIVE : INACTIVE;

  const pillWidth = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 48] });
  const pillOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.18] });

  return (
    <Pressable onPress={onPress} style={styles.tabBtn}>
      <Animated.View style={[styles.iconWrap, { transform: [{ scale }] }]}>
        {/* Active pill glow */}
        <Animated.View style={[
          styles.activePill,
          { width: pillWidth, opacity: pillOpacity },
        ]} />

        <Icon color={color} size={22} />

        {/* Cart badge */}
        {isCart && cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
          </View>
        )}
      </Animated.View>

      <Animated.Text style={[styles.tabLabel, { color, opacity: labelO }]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

// ─── Custom tab bar ───────────────────────────────────────────────────────────

function CustomTabBar({ state, navigation }) {
  const cartCount = useSelector((s) => s.cart.items.length);

  return (
    <View style={styles.barOuter}>
      <View style={styles.barInner}>
        {/* Subtle top border highlight */}
        <View style={styles.topLine} />

        {state.routes.map((route, index) => {
          const tab      = TABS.find(t => t.name === route.name);
          const isFocused = state.index === index;

          return (
            <TabButton
              key={route.key}
              isFocused={isFocused}
              label={tab?.label || ''}
              Icon={tab?.Icon || IconHome}
              isCart={route.name === 'Cart'}
              cartCount={cartCount}
              onPress={() => { if (!isFocused) navigation.navigate(route.name); }}
            />
          );
        })}
      </View>
    </View>
  );
}

// ─── Navigator ────────────────────────────────────────────────────────────────

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"       component={HomeScreen}       />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Cart"       component={CartScreen}       />
      <Tab.Screen name="Orders"     component={OrdersScreen}     />
      <Tab.Screen name="Profile"    component={ProfileScreen}    />
    </Tab.Navigator>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  barOuter: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  barInner: {
    flexDirection: 'row',
    backgroundColor: '#111018',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 10,
    paddingHorizontal: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 24,
  },
  topLine: {
    position: 'absolute',
    top: 0, left: 32, right: 32, height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 1,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 32,
  },
  activePill: {
    position: 'absolute',
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E85D26',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  badge: {
    position: 'absolute',
    top: -3, right: -2,
    minWidth: 15, height: 15,
    borderRadius: 8,
    backgroundColor: '#E85D26',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#111018',
  },
  badgeText: { color: '#fff', fontSize: 8, fontWeight: '900' },
});