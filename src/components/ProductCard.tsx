import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Image,
  Pressable, Animated,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import Svg, { Path } from 'react-native-svg';
import { getProductImage } from '../utils/productImages';
import { useTheme } from '../hooks/useTheme';
import { toggleFavorite } from '../redux/favoritesSlice';
import { addToCart } from '../redux/cartSlice';
import Toast from './Toast';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

function HeartIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={filled ? color : 'rgba(255,255,255,0.35)'}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlusIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5V19" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M5 12H19" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const theme    = useTheme();
  const dispatch = useAppDispatch();

  const cardScale  = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const plusScale  = useRef(new Animated.Value(1)).current;
  const plusRotate = useRef(new Animated.Value(0)).current;

  const [isPressing, setIsPressing] = useState(false);

  const [toast,      setToast]      = useState(false);
  const [toastMsg,   setToastMsg]   = useState('');
  const [toastEmoji, setToastEmoji] = useState('✅');

  const isFavorite = useAppSelector((state) =>
    state.favorites.items.some((i) => i.id === product.id)
  );

  const onPressIn = () => {
    setIsPressing(true);
    Animated.spring(cardScale, {
      toValue: 0.96, tension: 80, friction: 8, useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    setIsPressing(false);
    Animated.spring(cardScale, {
      toValue: 1, tension: 60, friction: 7, useNativeDriver: true,
    }).start();
  };

  const handleFav = () => {
    dispatch(toggleFavorite(product));
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.5, tension: 100, friction: 5, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1,   tension: 60,  friction: 8, useNativeDriver: true }),
    ]).start();
    const adding = !isFavorite;
    setToastEmoji(adding ? '❤️' : '🩶');
    setToastMsg(adding
      ? `${product.name} agregado a favoritos`
      : `${product.name} quitado de favoritos`
    );
    setToast(true);
  };

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    Animated.sequence([
      Animated.parallel([
        Animated.spring(plusScale,  { toValue: 1.35, tension: 120, friction: 5, useNativeDriver: true }),
        Animated.timing(plusRotate, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(plusScale,  { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(plusRotate, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]),
    ]).start();
    setToastEmoji('🛒');
    setToastMsg(`${product.name} agregado al carrito`);
    setToast(true);
  };

  const plusSpin = plusRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] });
  const name     = product.name.charAt(0).toUpperCase() + product.name.slice(1);

  return (
    <>
      <Toast
        visible={toast}
        message={toastMsg}
        emoji={toastEmoji}
        onHide={() => setToast(false)}
      />

      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.pressable}
      >
        <Animated.View style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            transform: [{ scale: cardScale }],
            borderColor: isPressing
              ? 'rgba(255,255,255,0.22)'
              : 'rgba(255,255,255,0.08)',
          },
        ]}>

          <Image
            source={getProductImage(product.category, product.image)}
            style={styles.image}
          />

          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
              {name}
            </Text>
            <Text style={[styles.category, { color: theme.colors.textMuted }]}>
              Artesanal
            </Text>
            <Text style={[styles.price, { color: theme.primary }]}>
              ${product.price?.toFixed(2)}
            </Text>
          </View>

          <Pressable onPress={handleFav} hitSlop={10} style={styles.favBtn}>
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <HeartIcon filled={isFavorite} color="#FF4D6D" />
            </Animated.View>
          </Pressable>

          <Pressable
            onPress={handleAddToCart}
            hitSlop={6}
            style={[styles.addBtn, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
          >
            <Animated.View style={{ transform: [{ scale: plusScale }, { rotate: plusSpin }] }}>
              <PlusIcon color={theme.onPrimary} />
            </Animated.View>
          </Pressable>

        </Animated.View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  pressable: { marginBottom: 12 },
  card: {
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  image:    { width: 72, height: 72, borderRadius: 14, marginRight: 14 },
  info:     { flex: 1 },
  name:     { fontSize: 15, fontWeight: '700', marginBottom: 2, letterSpacing: -0.1 },
  category: { fontSize: 11, marginBottom: 6 },
  price:    { fontSize: 17, fontWeight: '800' },
  favBtn:   { padding: 8, marginRight: 6 },
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
});