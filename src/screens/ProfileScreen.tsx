import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Alert, StatusBar, ScrollView, Animated,
  TextInput, Modal, Image,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { signOut } from 'firebase/auth';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { auth } from '../service/firebase';
import { clearUser } from '../features/auth/authSlice';
import { setAccentColor, ACCENT_COLORS } from '../redux/uiSlice';
import { clearSession } from '../service/sessionStorage';
import { useTheme } from '../hooks/useTheme';
import { isLightColor } from '../theme';
import { RootStackParamList } from '../types';

interface Coords { latitude: number; longitude: number; }
interface StatCardProps { label: string; value: number; icon: string; color: string; delay: number; }

function IconCamera({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

function IconEdit({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

function StatCard({ label, value, icon, color, delay }: StatCardProps) {
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
        <MaterialIcons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

function EditNameModal({
  visible, currentName, accentColor, onSave, onClose,
}: {
  visible: boolean; currentName: string; accentColor: string;
  onSave: (name: string) => void; onClose: () => void;
}) {
  const [value, setValue] = useState(currentName);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setValue(currentName);
      Animated.parallel([
        Animated.spring(slideAnim,  { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim,    { toValue: 300, duration: 260, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0,   duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.modalBackdrop, { opacity: backdropAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.modalSheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.modalHandle} />
        <View style={[styles.modalGlow, { backgroundColor: accentColor }]} />

        <View style={[styles.modalIconWrap, { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40` }]}>
          <Text style={{ fontSize: 28 }}>✏️</Text>
        </View>

        <Text style={styles.modalTitle}>¿Cómo te llamás?</Text>
        <Text style={styles.modalSubtitle}>Este nombre va a aparecer en tu perfil</Text>

        <TextInput
          style={[styles.modalInput, { borderColor: `${accentColor}60` }]}
          value={value}
          onChangeText={setValue}
          placeholder="Tu nombre"
          placeholderTextColor="rgba(255,255,255,0.3)"
          autoFocus
          maxLength={30}
          selectionColor={accentColor}
        />

        <View style={styles.modalBtnRow}>
          <Pressable style={styles.modalBtnCancel} onPress={onClose}>
            <Text style={styles.modalBtnCancelText}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={[styles.modalBtnSave, { backgroundColor: accentColor }]}
            onPress={() => { if (value.trim()) onSave(value.trim()); }}
          >
            <Text style={[styles.modalBtnSaveText, { color: isLightColor(accentColor) ? '#0A0A0F' : '#FFFFFF' }]}>
              Guardar
            </Text>
          </Pressable>
        </View>
        <View style={{ height: 24 }} />
      </Animated.View>
    </Modal>
  );
}

export default function ProfileScreen() {
  const user        = useAppSelector((state) => state.auth.user);
  const orders      = useAppSelector((state) => state.orders.orders);
  const cartCount   = useAppSelector((state) => state.cart.items.length);
  const favorites   = useAppSelector((state) => state.favorites.items);
  const accentColor = useAppSelector((state) => state.ui.accentColor ?? '#E85D26');
  const theme       = useTheme();
  const dispatch    = useAppDispatch();
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [locationText, setLocationText] = useState<string | null>(null);
  const [photoUri,     setPhotoUri]     = useState<string | null>(null);
  const [displayName,  setDisplayName]  = useState<string>('');
  const [editingName,  setEditingName]  = useState(false);
  const photoScale = useRef(new Animated.Value(1)).current;

  const headerAnim  = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(headerAnim,  { toValue: 1, tension: 55, friction: 10, useNativeDriver: true }),
      Animated.spring(contentAnim, { toValue: 1, tension: 55, friction: 10, useNativeDriver: true }),
    ]).start();

    loadSavedData();
    fetchLocation();
  }, []);

  const loadSavedData = async () => {
    const [savedName, savedPhoto] = await Promise.all([
      AsyncStorage.getItem('profileDisplayName'),
      AsyncStorage.getItem('profilePhotoUri'),
    ]);

    if (savedName) {
      setDisplayName(savedName);
    } else if (auth.currentUser?.displayName) {
      setDisplayName(auth.currentUser.displayName);
    } else {
      const emailName = user?.email?.split('@')[0] ?? 'Usuario';
      // Capitalizar y limpiar: "juan.perez93" → "Juan Perez"
      const cleaned = emailName
        .replace(/[0-9_]/g, ' ')
        .replace(/\./g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
        .trim();
      setDisplayName(cleaned || 'Usuario');
    }

    if (savedPhoto) setPhotoUri(savedPhoto);
  };

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      const [geo] = await Location.reverseGeocodeAsync({
        latitude:  loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geo) {
        const parts = [geo.city, geo.region, geo.country].filter(Boolean);
        setLocationText(parts.join(', '));
      }
    } catch {
    }
  };

  const handleSaveName = async (name: string) => {
    setDisplayName(name);
    setEditingName(false);
    await AsyncStorage.setItem('profileDisplayName', name);
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar la foto');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;

      Animated.sequence([
        Animated.spring(photoScale, { toValue: 0.88, tension: 120, friction: 6, useNativeDriver: true }),
        Animated.spring(photoScale, { toValue: 1,    tension: 70,  friction: 8, useNativeDriver: true }),
      ]).start();

      setPhotoUri(uri);
      await AsyncStorage.setItem('profilePhotoUri', uri);
    }
  };

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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.bgTint, pointerEvents: 'none' }]} />
      <View style={[styles.bgGlow1, { backgroundColor: accentColor }]} />
      <View style={styles.bgGlow2} />

      <EditNameModal
        visible={editingName}
        currentName={displayName}
        accentColor={accentColor}
        onSave={handleSaveName}
        onClose={() => setEditingName(false)}
      />

      <ScrollView showsVerticalScrollIndicator={false}>

        <Animated.View style={[styles.profileHeader, {
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }]}>

          <Text style={[styles.greeting, { color: `${accentColor}CC` }]}>
            {getGreeting()}
          </Text>

          <Pressable onPress={handlePickPhoto} style={styles.avatarWrap}>
            <Animated.View style={[styles.avatarRing, { borderColor: accentColor, shadowColor: accentColor, transform: [{ scale: photoScale }] }]}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatarInner, { backgroundColor: `${accentColor}30` }]}>
                  <Text style={[styles.avatarInitial, { color: accentColor }]}>
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </Animated.View>

            <View style={[styles.cameraBadge, { backgroundColor: accentColor }]}>
              <IconCamera color={isLightColor(accentColor) ? '#0A0A0F' : '#FFFFFF'} size={14} />
            </View>
          </Pressable>

          <Pressable style={styles.nameRow} onPress={() => setEditingName(true)}>
            <Text style={styles.profileName}>{displayName}</Text>
            <View style={[styles.editBadge, { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40` }]}>
              <IconEdit color={accentColor} size={13} />
            </View>
          </Pressable>

          <Text style={styles.profileEmail}>{user?.email}</Text>

          {locationText && (
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={13} color={accentColor} />
              <Text style={styles.locationText}>{locationText}</Text>
            </View>
          )}

          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>⭐ Miembro Premium</Text>
          </View>
        </Animated.View>
        <Animated.View style={[styles.statsRow, {
          opacity: contentAnim,
          transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        }]}>
          <StatCard label="Pedidos"    value={orders.length}    icon="receipt-long"  color={accentColor} delay={200} />
          <StatCard label="En carrito" value={cartCount}        icon="shopping-cart" color="#7C3AED"     delay={300} />
          <StatCard label="Favoritos"  value={favorites.length} icon="favorite"      color="#FF4D6D"     delay={400} />
        </Animated.View>

        {favorites.length > 0 && (
          <Animated.View style={[styles.section, {
            opacity: contentAnim,
            transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
          }]}>
            <Text style={styles.sectionLabel}>MIS FAVORITOS</Text>
            {favorites.map((item) => (
              <View key={item.id} style={styles.favRow}>
                <MaterialIcons name="favorite" size={16} color="#FF4D6D" />
                <Text style={styles.favName}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                <Text style={[styles.favPrice, { color: accentColor }]}>${item.price?.toFixed(2)}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        <Animated.View style={[styles.section, {
          opacity: contentAnim,
          transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
        }]}>
          <Text style={styles.sectionLabel}>COLOR DE ACENTO</Text>
          <View style={styles.colorRow}>
            {ACCENT_COLORS.map((color) => {
              const isSelected = accentColor === color;
              return (
                <Pressable
                  key={color}
                  onPress={() => dispatch(setAccentColor(color))}
                  style={[
                    styles.colorDot,
                    { backgroundColor: color },
                    isSelected && [styles.colorDotActive, { borderColor: '#FFFFFF', shadowColor: color }],
                  ]}
                >
                  {isSelected && (
                    <Text style={[styles.colorCheck, { color: isLightColor(color) ? '#0A0A0F' : '#FFFFFF' }]}>✓</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.settingIcon, { backgroundColor: `${accentColor}20` }]}>
              <MaterialIcons name="info-outline" size={18} color={accentColor} />
            </View>
            <Text style={styles.settingText}>Versión</Text>
            <Text style={styles.settingValue}>Roma Store 1.0</Text>
          </View>
        </Animated.View>

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
  container: { flex: 1 },
  bgGlow1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, opacity: 0.06, top: -60, left: -80 },
  bgGlow2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: '#7C3AED', opacity: 0.06, top: 200, right: -60 },


  profileHeader: { alignItems: 'center', paddingTop: 64, paddingBottom: 32, paddingHorizontal: 24 },
  greeting: { fontSize: 14, fontWeight: '600', letterSpacing: 0.3, marginBottom: 20 },


  avatarWrap: { position: 'relative', marginBottom: 16 },
  avatarRing: {
    width: 104, height: 104, borderRadius: 52,
    borderWidth: 2.5, padding: 3,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
  },
  avatarInner:   { flex: 1, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  avatarImage:   { width: '100%', height: '100%', borderRadius: 44 },
  avatarInitial: { fontSize: 40, fontWeight: '900' },
  cameraBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#0A0A0F',
  },


  nameRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  profileName: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.3 },
  editBadge: {
    paddingHorizontal: 8, paddingVertical: 5,
    borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },

  profileEmail: { fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 10 },
  locationRow:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  locationText: { fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: '500' },
  memberBadge:  { backgroundColor: 'rgba(245,158,11,0.15)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.35)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  memberBadgeText: { fontSize: 13, fontWeight: '700', color: '#F59E0B' },


  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 24 },
  stat: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', gap: 6 },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  statLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.35)' },


  section: { marginHorizontal: 20, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', paddingHorizontal: 18, marginBottom: 16, overflow: 'hidden' },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.8, color: 'rgba(255,255,255,0.25)', paddingTop: 16, paddingBottom: 10 },


  favRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  favName:  { flex: 1, fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  favPrice: { fontSize: 14, fontWeight: '800' },


  colorRow:       { flexDirection: 'row', gap: 12, paddingVertical: 16, flexWrap: 'wrap' },
  colorDot:       { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  colorDotActive: { borderWidth: 3, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4 },
  colorCheck:     { fontSize: 16, fontWeight: '900' },

 
  settingRow:  { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  settingValue: { fontSize: 13, color: 'rgba(255,255,255,0.35)' },


  logoutBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginHorizontal: 20, paddingVertical: 16, borderRadius: 18, backgroundColor: 'rgba(255,77,77,0.1)', borderWidth: 1, borderColor: 'rgba(255,77,77,0.25)' },
  logoutText: { fontSize: 16, fontWeight: '800', color: '#FF4D4D' },


  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },
  modalSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#111018',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 28, paddingTop: 14,
    alignItems: 'center', overflow: 'hidden',
  },
  modalHandle:   { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 24 },
  modalGlow:     { position: 'absolute', width: 260, height: 260, borderRadius: 130, opacity: 0.07, top: -100, alignSelf: 'center' },
  modalIconWrap: { width: 68, height: 68, borderRadius: 20, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  modalTitle:    { fontSize: 20, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24, textAlign: 'center' },
  modalInput: {
    width: '100%', height: 52,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14, borderWidth: 1.5,
    paddingHorizontal: 16, fontSize: 17,
    color: '#FFFFFF', fontWeight: '600', marginBottom: 20,
  },
  modalBtnRow:        { flexDirection: 'row', gap: 12, width: '100%' },
  modalBtnCancel:     { flex: 1, paddingVertical: 15, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center' },
  modalBtnCancelText: { color: 'rgba(255,255,255,0.55)', fontSize: 15, fontWeight: '700' },
  modalBtnSave:       { flex: 1, paddingVertical: 15, borderRadius: 16, alignItems: 'center' },
  modalBtnSaveText:   { fontSize: 15, fontWeight: '800' },
});