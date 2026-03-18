import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, Pressable,
  Alert, StatusBar, ScrollView, Animated,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Svg, { Path, Circle } from 'react-native-svg';
import { addToCart } from '../redux/cartSlice';
import { getProductImage } from '../utils/productImages';

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

function IconVerified({ color = '#E85D26', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function IconShipping({ color = '#E85D26', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M1 3H15V16H1V3Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
      <Path d="M15 8H19L23 12V16H15V8Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
      <Circle cx="5.5" cy="18.5" r="2.5" stroke={color} strokeWidth={1.8} fill="none" />
      <Circle cx="18.5" cy="18.5" r="2.5" stroke={color} strokeWidth={1.8} fill="none" />
    </Svg>
  );
}

function IconStar({ color = '#E85D26', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export default function DetailsScreen({ route }) {
  const { product } = route.params;
  const dispatch = useDispatch();

  const sheetAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(imageAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
      Animated.spring(sheetAnim, { toValue: 1, tension: 55, friction: 10, useNativeDriver: true }),
      Animated.spring(footerAnim, { toValue: 1, tension: 55, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    Alert.alert('✅ Agregado', `${product.name} fue agregado al carrito.`);
  };

  const INFO = [
    { Icon: IconVerified, label: 'Artesanal' },
    { Icon: IconShipping, label: 'Envío gratis' },
    { Icon: IconStar,     label: 'Premium' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background glows */}
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product image */}
        <Animated.View style={[styles.imageWrap, {
          opacity: imageAnim,
          transform: [{ scale: imageAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
        }]}>
          <Image source={getProductImage(product.category, product.image)} style={styles.image} />
          <View style={styles.imageFade} />
        </Animated.View>

        {/* Sheet */}
        <Animated.View style={[styles.sheet, {
          opacity: sheetAnim,
          transform: [{ translateY: sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
        }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Name + price */}
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ 4.9</Text>
            </View>
          </View>

          {/* Info pills */}
          <View style={styles.infoRow}>
            {INFO.map(({ Icon, label }, i) => (
              <View key={i} style={styles.infoPill}>
                <Icon />
                <Text style={styles.infoLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.descTitle}>Sobre este producto</Text>
          <Text style={styles.desc}>
            Elaborado diariamente con ingredientes frescos y seleccionados. 
            Recetas tradicionales preparadas con amor y sin conservantes ni 
            aditivos artificiales. Directo del horno a tu mesa. 🍞
          </Text>

          {/* Tags */}
          <View style={styles.tags}>
            {['Sin TACC', 'Sin conservantes', 'Hecho hoy'].map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <Animated.View style={[styles.footer, {
        opacity: footerAnim,
        transform: [{ translateY: footerAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }],
      }]}>
        <View style={styles.footerGlow} />
        <View>
          <Text style={styles.footerLabel}>Precio</Text>
          <Text style={styles.footerPrice}>${product.price?.toFixed(2)}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.addBtn,
            pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
          ]}
          onPress={handleAddToCart}
        >
          <IconCart color="#fff" size={18} />
          <Text style={styles.addBtnText}>Agregar al carrito</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },

  glow1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: '#E85D26', opacity: 0.07, top: -80, right: -80,
  },
  glow2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#7C3AED', opacity: 0.05, bottom: 200, left: -60,
  },

  imageWrap: { width: '100%', height: 300, position: 'relative' },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  imageFade: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
    backgroundColor: 'transparent',
  },

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
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  price: { fontSize: 28, fontWeight: '900', color: '#E85D26' },
  ratingBadge: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5,
  },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#F59E0B' },

  infoRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  infoPill: {
    flex: 1, alignItems: 'center', gap: 8, paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
  },
  infoLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },

  descTitle: { fontSize: 17, fontWeight: '800', color: '#FFFFFF', marginBottom: 10 },
  desc: { fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 24, marginBottom: 20 },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: 'rgba(232,93,38,0.1)',
    borderWidth: 1, borderColor: 'rgba(232,93,38,0.25)',
    borderRadius: 20,
  },
  tagText: { fontSize: 12, fontWeight: '700', color: '#E85D26' },

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
    backgroundColor: '#E85D26', opacity: 0.07, top: -20, left: 20,
  },
  footerLabel: { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 2 },
  footerPrice: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#E85D26',
    paddingVertical: 16, paddingHorizontal: 22,
    borderRadius: 18,
    shadowColor: '#E85D26',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
  },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});