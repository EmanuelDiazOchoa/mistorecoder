import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Animated } from 'react-native';
import { getProductImage } from '../utils/productImages';

export default function ProductCard({ product, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 60 }),
      Animated.timing(glow, { toValue: 1, duration: 150, useNativeDriver: false }),
    ]).start();
  };
  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60 }),
      Animated.timing(glow, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const borderColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.07)', 'rgba(232,93,38,0.5)'],
  });

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[
        styles.card,
        { transform: [{ scale }], borderColor },
      ]}>
        {/* Subtle glow behind image */}
        <View style={styles.imageWrap}>
          <Image source={getProductImage(product.name)} style={styles.image} />
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.category}>Artesanal • Fresco</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.addBtn}>
          <Text style={styles.addBtnText}>+</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  imageWrap: {
    width: 76, height: 76,
    borderRadius: 16,
    backgroundColor: 'rgba(232,93,38,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  image: { width: 76, height: 76, borderRadius: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginBottom: 3, letterSpacing: -0.2 },
  category: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontWeight: '500' },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: '900', color: '#E85D26' },
  addBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#E85D26',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#E85D26',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  addBtnText: { color: '#fff', fontSize: 24, fontWeight: '300', lineHeight: 26 },
});