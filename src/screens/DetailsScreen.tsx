import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, Pressable,
  StatusBar, ScrollView, Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { addToCart } from '../redux/cartSlice';
import { toggleFavorite } from '../redux/favoritesSlice';
import { getProductImage } from '../utils/productImages';
import { useTheme } from '../hooks/useTheme';
import Toast from '../components/Toast';

function IconCart({ color = '#fff', size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z"
        stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
      <Path d="M3 6H21" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function IconVerified({ color, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function IconShipping({ color, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M1 3H15V16H1V3Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
      <Path d="M15 8H19L23 12V16H15V8Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
      <Circle cx="5.5" cy="18.5" r="2.5" stroke={color} strokeWidth={1.8} fill="none" />
      <Circle cx="18.5" cy="18.5" r="2.5" stroke={color} strokeWidth={1.8} fill="none" />
    </Svg>
  );
}

function IconStar({ color, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill={filled ? '#FF4D6D' : 'none'}>
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={filled ? '#FF4D6D' : 'rgba(255,255,255,0.4)'}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function DetailsScreen({ route }) {
  const { product } = route.params;
  const dispatch    = useDispatch();
  const navigation  = useNavigation();
  const theme       = useTheme();

  const [toast, setToast] = useState({ visible: false, message: '', emoji: '✅' });

  const isFavorite = useSelector((state) =>
    state.favorites.items.some(i => i.id === product.id)
  );

  const sheetAnim  = useRef(new Animated.Value(0)).current;
  const imageAnim  = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(imageAnim,  { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
      Animated.spring(sheetAnim,  { toValue: 1, tension: 55, friction: 10, useNativeDriver: true }),
      Animated.spring(footerAnim, { toValue: 1, tension: 55, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setToast({ visible: true, message: `${product.name} agregado al carrito`, emoji: '🛒' });
  };

  const handleFav = () => {
    dispatch(toggleFavorite(product));
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, speed: 80 }),
      Animated.spring(heartScale, { toValue: 1,   useNativeDriver: true, speed: 80 }),
    ]).start();
    setToast({
      visible: true,
      message: !isFavorite ? 'Agregado a favoritos' : 'Quitado de favoritos',
      emoji:   !isFavorite ? '❤️' : '🩶',
    });
  };

  const INFO = [
    { Icon: IconVerified, label: 'Artesanal' },
    { Icon: IconShipping, label: 'Envío gratis' },
    { Icon: IconStar,     label: 'Premium' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />

      <Toast
        visible={toast.visible}
        message={toast.message}
        emoji={toast.emoji}
        onHide={() => setToast(t => ({ ...t, visible: false }))}
      />

      {/* Glows decorativos */}
      <View style={[styles.glow1, { backgroundColor: theme.primary }]} />
      <View style={[styles.glow2, { backgroundColor: theme.primary }]} />

      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
        <MaterialIcons name="arrow-back-ios" size={20} color="#FFFFFF" />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.imageWrap, {
          opacity: imageAnim,
          transform: [{ scale: imageAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
        }]}>
          <Image source={getProductImage(product.category, product.image)} style={styles.image} />
        </Animated.View>

        <Animated.View style={[styles.sheet, {
          opacity: sheetAnim,
          transform: [{ translateY: sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
        }]}>
          <View style={styles.handle} />

          <Text style={styles.name}>
            {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.primary }]}>${product.price?.toFixed(2)}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ 4.9</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            {INFO.map(({ Icon, label }, i) => (
              <View key={i} style={styles.infoPill}>
                <Icon color={theme.primary} />
                <Text style={styles.infoLabel}>{label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.descTitle}>Sobre este producto</Text>
          <Text style={styles.desc}>
            Elaborado diariamente con ingredientes frescos y seleccionados.
            Recetas tradicionales preparadas con amor y sin conservantes ni
            aditivos artificiales. Directo del horno a tu mesa. 🍞
          </Text>

          <View style={styles.tags}>
            {['Sin TACC', 'Sin conservantes', 'Hecho hoy'].map((tag) => (
              <View key={tag} style={[styles.tag, {
                backgroundColor: `${theme.primary}18`,
                borderColor: `${theme.primary}40`,
              }]}>
                <Text style={[styles.tagText, { color: theme.primary }]}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>

      <Animated.View style={[styles.footer, {
        opacity: footerAnim,
        transform: [{ translateY: footerAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }],
      }]}>
        <View style={[styles.footerGlow, { backgroundColor: theme.primary }]} />

        <View style={styles.footerLeft}>
          <Text style={styles.footerLabel}>Precio</Text>
          <Text style={styles.footerPrice}>${product.price?.toFixed(2)}</Text>
        </View>

        <View style={styles.footerActions}>
          <Pressable
            onPress={handleFav}
            style={[styles.favDetailBtn, {
              backgroundColor: isFavorite ? 'rgba(255,77,109,0.15)' : 'rgba(255,255,255,0.06)',
              borderColor: isFavorite ? '#FF4D6D' : 'rgba(255,255,255,0.15)',
            }]}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <HeartIcon filled={isFavorite} />
            </Animated.View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.addBtn,
              { backgroundColor: theme.primary },
              pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleAddToCart}
          >
            <IconCart color={theme.onPrimary} size={18} />
            <Text style={[styles.addBtnText, { color: theme.onPrimary }]}>
              Agregar al carrito
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  glow1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    opacity: 0.07, top: -80, right: -80,
  },
  glow2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    opacity: 0.05, bottom: 200, left: -60,
  },
  backBtn: {
    position: 'absolute', top: 56, left: 20, zIndex: 10,
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  imageWrap: { width: '100%', height: 300 },
  image:     { width: '100%', height: 300, resizeMode: 'cover' },
  sheet: {
    backgroundColor: '#0A0A0F',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    marginTop: -28, padding: 26, paddingTop: 20,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center', marginBottom: 22,
  },
  name: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 10 },
  priceRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 22,
  },
  price: { fontSize: 28, fontWeight: '900' },
  ratingBadge: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5,
  },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#F59E0B' },
  infoRow:  { flexDirection: 'row', gap: 10, marginBottom: 24 },
  infoPill: {
    flex: 1, alignItems: 'center', gap: 8, paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
  },
  infoLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },
  descTitle: { fontSize: 17, fontWeight: '800', color: '#FFFFFF', marginBottom: 10 },
  desc:      { fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 24, marginBottom: 20 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag:  { paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderRadius: 20 },
  tagText: { fontSize: 12, fontWeight: '700' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, paddingBottom: 36,
    backgroundColor: 'rgba(10,10,15,0.97)',
    borderTopLeftRadius: 26, borderTopRightRadius: 26,
    borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  footerGlow: {
    position: 'absolute', width: 180, height: 80, borderRadius: 90,
    opacity: 0.07, top: -20, left: 20,
  },
  footerLeft: {},
  footerLabel: { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 2 },
  footerPrice: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  footerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  favDetailBtn: {
    width: 52, height: 52, borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 16, paddingHorizontal: 22, borderRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
  },
  addBtnText: { fontSize: 15, fontWeight: '800' },
});