import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Image, Pressable,
  Alert, Switch, StatusBar, ScrollView, Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../service/firebase';
import { clearUser } from '../features/auth/authSlice';
import { toggleDarkMode } from '../redux/uiSlice';
import { clearSession } from '../service/sessionStorage';

function StatCard({ label, value, icon, color, delay }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, tension: 60, friction: 10, delay, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={[styles.stat, {
      opacity: anim,
      transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
    }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}18` }]}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const user = useSelector((state) => state.auth.user);
  const isDark = useSelector((state) => state.ui.isDark);
  const orders = useSelector((state) => state.orders.orders);
  const cartCount = useSelector((state) => state.cart.items.length);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(headerAnim, { toValue: 1, tension: 55, friction: 10, useNativeDriver: true }),
      Animated.spring(contentAnim, { toValue: 1, tension: 55, friction: 10, useNativeDriver: true }),
    ]).start();

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
    })();
  }, []);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir', style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          await clearSession();                                
          dispatch(clearUser());
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const username = user?.email?.split('@')[0] || 'Usuario';
  const initial = username.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgGlow1} />
      <View style={styles.bgGlow2} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <Animated.View style={[styles.profileHeader, {
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }]}>
          {/* Avatar with ring */}
          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          </View>

          <Text style={styles.profileName}>{username}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>

          {location && (
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={13} color="#E85D26" />
              <Text style={styles.locationText}>
                {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
              </Text>
            </View>
          )}

          {/* Member badge */}
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>⭐ Miembro Premium</Text>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsRow, {
          opacity: contentAnim,
          transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        }]}>
          <StatCard label="Pedidos" value={orders.length} icon="receipt-long" color="#E85D26" delay={200} />
          <StatCard label="En carrito" value={cartCount} icon="shopping-cart" color="#7C3AED" delay={300} />
          <StatCard label="Puntos" value="320" icon="star" color="#F59E0B" delay={400} />
        </Animated.View>

        {/* Settings section */}
        <Animated.View style={[styles.section, {
          opacity: contentAnim,
          transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
        }]}>
          <Text style={styles.sectionLabel}>PREFERENCIAS</Text>

          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(124,58,237,0.15)' }]}>
              <MaterialIcons name="dark-mode" size={18} color="#7C3AED" />
            </View>
            <Text style={styles.settingText}>Modo oscuro</Text>
            <Switch
              value={isDark}
              onValueChange={() => dispatch(toggleDarkMode())}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#E85D26' }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(232,93,38,0.15)' }]}>
              <MaterialIcons name="info-outline" size={18} color="#E85D26" />
            </View>
            <Text style={styles.settingText}>Versión</Text>
            <Text style={styles.settingValue}>Roma Store 1.0</Text>
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View style={{ opacity: contentAnim }}>
          <Pressable
            style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={18} color="#FF4D4D" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </Pressable>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  bgGlow1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: '#E85D26', opacity: 0.06, top: -60, left: -80,
  },
  bgGlow2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#7C3AED', opacity: 0.06, top: 200, right: -60,
  },

  profileHeader: {
    alignItems: 'center',
    paddingTop: 64, paddingBottom: 32, paddingHorizontal: 24,
  },
  avatarRing: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 2, borderColor: '#E85D26',
    padding: 3, marginBottom: 16,
    shadowColor: '#E85D26', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
  },
  avatarInner: {
    flex: 1, borderRadius: 44,
    backgroundColor: 'rgba(232,93,38,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 38, fontWeight: '900', color: '#E85D26' },
  profileName: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', marginBottom: 4, letterSpacing: -0.3 },
  profileEmail: { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  locationText: { fontSize: 12, color: 'rgba(255,255,255,0.35)' },
  memberBadge: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.35)',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6,
  },
  memberBadgeText: { fontSize: 13, fontWeight: '700', color: '#F59E0B' },

  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 24 },
  stat: {
    flex: 1, alignItems: 'center', padding: 16, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    gap: 6,
  },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  statLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.35)' },

  section: {
    marginHorizontal: 20, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 18, marginBottom: 16, overflow: 'hidden',
  },
  sectionLabel: {
    fontSize: 10, fontWeight: '800', letterSpacing: 1.8,
    color: 'rgba(255,255,255,0.25)', paddingTop: 16, paddingBottom: 10,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  settingValue: { fontSize: 13, color: 'rgba(255,255,255,0.35)' },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginHorizontal: 20, paddingVertical: 16, borderRadius: 18,
    backgroundColor: 'rgba(255,77,77,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,77,77,0.25)',
  },
  logoutText: { fontSize: 16, fontWeight: '800', color: '#FF4D4D' },
});