import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Animated } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import Svg, { Path } from 'react-native-svg';
import { getProductImage } from '../utils/productImages';
import { useTheme } from '../hooks/useTheme';
import { toggleFavorite } from '../redux/favoritesSlice';
import Toast from './Toast';

function HeartIcon({ filled, color }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={filled ? color : 'rgba(255,255,255,0.3)'}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function ProductCard({ product, onPress }) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const scale = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const isFavorite = useAppSelector((state) =>
    state.favorites.items.some((i) => i.id === product.id)
  );

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  const handleFav = () => {
    dispatch(toggleFavorite(product));
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, speed: 80 }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, speed: 80 }),
    ]).start();
    const msg = !isFavorite ? `${product.name} agregado a favoritos` : `${product.name} quitado de favoritos`;
    setToastMsg(msg);
    setToast(true);
  };

  return (
    <>
      <Toast
        visible={toast}
        message={toastMsg}
        emoji={isFavorite ? '🩶' : '❤️'}
        onHide={() => setToast(false)}
      />
      <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View style={[
          styles.card,
          { backgroundColor: theme.colors.card, transform: [{ scale }] },
          theme.shadows.sm,
        ]}>
          <Image source={getProductImage(product.category, product.image)} style={styles.image} />
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
              {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
            </Text>
            <Text style={[styles.category, { color: theme.colors.textMuted }]}>Artesanal</Text>
            <Text style={[styles.price, { color: theme.primary }]}>${product.price?.toFixed(2)}</Text>
          </View>

          <Pressable onPress={handleFav} hitSlop={8} style={styles.favBtn}>
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <HeartIcon filled={isFavorite} color="#FF4D6D" />
            </Animated.View>
          </Pressable>

          <Pressable
            onPress={(e) => { e.stopPropagation?.(); onPress?.(); }}
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: { width: 72, height: 72, borderRadius: 12, marginRight: 14 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  category: { fontSize: 12, marginBottom: 6 },
  price: { fontSize: 17, fontWeight: '800' },
  favBtn: { marginRight: 10, padding: 4 },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 22, fontWeight: '300', lineHeight: 24 },
});
