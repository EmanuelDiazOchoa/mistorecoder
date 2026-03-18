import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { getProductImage } from '../utils/productImages';
import { useTheme } from '../hooks/useTheme';
import { toggleFavorite } from '../redux/favoritesSlice';

export default function ProductCard({ product, onPress }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const scale = useRef(new Animated.Value(1)).current;

  const isFavorite = useSelector((state) =>
    state.favorites.items.some(i => i.id === product.id)
  );

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[
        styles.card,
        { backgroundColor: theme.colors.card, transform: [{ scale }] },
        theme.shadows.sm,
      ]}>
        <Image source={getProductImage(product.category, product.image)} style={styles.image} />
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{product.name}</Text>
          <Text style={[styles.category, { color: theme.colors.textMuted }]}>
            Artesanal
          </Text>
          <Text style={[styles.price, { color: theme.primary }]}>
            ${product.price?.toFixed(2)}
          </Text>
        </View>

        {/* Botón favorito */}
        <Pressable
          onPress={() => dispatch(toggleFavorite(product))}
          hitSlop={8}
          style={styles.favBtn}
        >
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={20}
            color={isFavorite ? '#FF4D6D' : 'rgba(255,255,255,0.3)'}
          />
        </Pressable>

        <View style={[styles.addBtn, { backgroundColor: theme.primary }]}>
          <Text style={styles.addBtnText}>+</Text>
        </View>
      </Animated.View>
    </Pressable>
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
  favBtn: { marginRight: 10 },
  addBtn: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 22, fontWeight: '300', lineHeight: 24 },
});