import React, { useRef, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  Pressable, Alert, StatusBar, Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { removeFromCart, clearCart } from '../redux/cartSlice';
import { addOrder } from '../redux/ordersSlice';

function CartItem({ item, index, onRemove }) {
  const anim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1, tension: 60, friction: 10,
      delay: index * 60, useNativeDriver: true,
    }).start();
  }, []);

  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 0.85, useNativeDriver: true }),
    ]).start(() => onRemove());
  };

  return (
    <Animated.View style={[styles.item, {
      opacity: anim,
      transform: [
        { scale },
        { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
      ],
    }]}>
      <View style={styles.itemIconWrap}>
        <Text style={styles.itemEmoji}>🛍️</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price?.toFixed(2)}</Text>
      </View>
      <Pressable onPress={handleRemove} style={styles.removeBtn} hitSlop={10}>
        <MaterialIcons name="delete-outline" size={22} color="#FF4D4D" />
      </Pressable>
    </Animated.View>
  );
}

export default function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const footerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(footerAnim, { toValue: 1, tension: 50, friction: 10, delay: 300, useNativeDriver: true }).start();
  }, []);

  const handlePurchase = () => {
    Alert.alert(
      '✅ Confirmar pedido',
      `Total: $${total.toFixed(2)}\n¿Confirmás tu pedido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            dispatch(addOrder({ items: cartItems, total }));
            dispatch(clearCart());
            Alert.alert('🎉 ¡Pedido realizado!', 'Podés verlo en tu historial.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Glow decoration */}
      <View style={styles.bgGlow} />

      <View style={styles.header}>
        <Text style={styles.title}>Carrito</Text>
        {cartItems.length > 0 && (
          <Pressable onPress={() => Alert.alert('Vaciar', '¿Eliminás todo?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Vaciar', style: 'destructive', onPress: () => dispatch(clearCart()) },
          ])}>
            <Text style={styles.clearBtn}>Vaciar</Text>
          </Pressable>
        )}
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySub}>Explorá los productos y agregá tus favoritos</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <CartItem
                item={item}
                index={index}
                onRemove={() => dispatch(removeFromCart(index))}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {/* Floating footer */}
          <Animated.View style={[styles.footer, {
            opacity: footerAnim,
            transform: [{ translateY: footerAnim.interpolate({ inputRange: [0, 1], outputRange: [80, 0] }) }],
          }]}>
            <View style={styles.footerGlow} />
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>{cartItems.length} producto{cartItems.length !== 1 ? 's' : ''}</Text>
                <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.buyBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
                onPress={handlePurchase}
              >
                <Text style={styles.buyBtnText}>Finalizar pedido</Text>
                <MaterialIcons name="arrow-forward-ios" size={14} color="#fff" />
              </Pressable>
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  bgGlow: {
    position: 'absolute',
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: '#E85D26', opacity: 0.05,
    top: -100, right: -80,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 56, paddingBottom: 20, paddingHorizontal: 24,
  },
  title: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  clearBtn: { fontSize: 14, fontWeight: '700', color: '#FF4D4D' },
  list: { paddingHorizontal: 20, paddingBottom: 200 },

  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20, padding: 16, marginBottom: 12,
  },
  itemIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(232,93,38,0.12)',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  itemEmoji: { fontSize: 26 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  itemPrice: { fontSize: 15, fontWeight: '800', color: '#E85D26' },
  removeBtn: { padding: 8 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 72, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
  emptySub: { fontSize: 14, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 20 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(15,10,30,0.95)',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    padding: 24, paddingBottom: 40,
    overflow: 'hidden',
  },
  footerGlow: {
    position: 'absolute',
    width: 200, height: 100, borderRadius: 100,
    backgroundColor: '#E85D26', opacity: 0.08,
    top: -20, left: 20,
  },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 2 },
  totalAmount: { fontSize: 30, fontWeight: '900', color: '#FFFFFF' },
  buyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#E85D26',
    paddingVertical: 16, paddingHorizontal: 24,
    borderRadius: 18,
    shadowColor: '#E85D26',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5, shadowRadius: 14,
    elevation: 8,
  },
  buyBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});