import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, Pressable,
  Alert, Switch, StatusBar, ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../service/firebase';
import { clearUser } from '../features/auth/authSlice';
import { toggleDarkMode } from '../redux/uiSlice';
import { useTheme } from '../hooks/useTheme';

export default function ProfileScreen() {
  const user = useSelector((state) => state.auth.user);
  const isDark = useSelector((state) => state.ui.isDark);
  const orders = useSelector((state) => state.orders.orders);
  const cartCount = useSelector((state) => state.cart.items.length);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();
  const [location, setLocation] = useState(null);

  useEffect(() => {
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
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          dispatch(clearUser());
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const StatCard = ({ label, value, icon }) => (
    <View style={[styles.stat, { backgroundColor: theme.colors.surfaceAlt }]}>
      <MaterialIcons name={icon} size={22} color={theme.primary} />
      <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{label}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <Image source={require('../../assets/avatar.jpg')} style={styles.avatar} />
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {user?.email?.split('@')[0] || 'Usuario'}
          </Text>
          <Text style={[styles.email, { color: theme.colors.textMuted }]}>{user?.email}</Text>
          {location && (
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={14} color={theme.primary} />
              <Text style={[styles.locationText, { color: theme.colors.textMuted }]}>
                {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Pedidos" value={orders.length} icon="receipt-long" />
          <StatCard label="En carrito" value={cartCount} icon="shopping-cart" />
          <StatCard label="Miembro" value="⭐" icon="star" />
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            PREFERENCIAS
          </Text>
          <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
            <MaterialIcons name="dark-mode" size={22} color={theme.colors.textSecondary} />
            <Text style={[styles.rowLabel, { color: theme.colors.text }]}>Modo oscuro</Text>
            <Switch
              value={isDark}
              onValueChange={() => dispatch(toggleDarkMode())}
              trackColor={{ false: '#ccc', true: theme.primary }}
              thumbColor="#fff"
            />
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <MaterialIcons name="info-outline" size={22} color={theme.colors.textSecondary} />
            <Text style={[styles.rowLabel, { color: theme.colors.text }]}>Versión 1.0.0</Text>
            <Text style={[styles.rowValue, { color: theme.colors.textMuted }]}>Roma Store</Text>
          </View>
        </View>

        <Pressable
          style={[styles.logoutBtn, { borderColor: theme.danger }]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color={theme.danger} />
          <Text style={[styles.logoutText, { color: theme.danger }]}>Cerrar sesión</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 64, paddingBottom: 28, paddingHorizontal: 20 },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  email: { fontSize: 14, marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12 },
  statsRow: { flexDirection: 'row', gap: 12, padding: 20 },
  stat: { flex: 1, alignItems: 'center', padding: 14, borderRadius: 14, gap: 4 },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '500' },
  section: { marginHorizontal: 20, borderRadius: 14, paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1, paddingTop: 14, paddingBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  rowValue: { fontSize: 14 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 20,
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  logoutText: { fontSize: 16, fontWeight: '700' },
});