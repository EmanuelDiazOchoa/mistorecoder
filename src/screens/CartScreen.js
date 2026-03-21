import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, Image,
  Pressable, StatusBar, Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import {
  incrementQuantity, decrementQuantity,
  removeFromCart, clearCart,
} from '../redux/cartSlice';
import { addOrder } from '../redux/ordersSlice';
import { getProductImage } from '../utils/productImages';
import { useTheme } from '../hooks/useTheme';
import ConfirmModal from '../components/ConfirmModal';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function CartItem({ item, index, accentColor, onIncrement, onDecrement, onRemove }) {
  const anim  = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1, tension: 60, friction: 10,
      delay: index * 60, useNativeDriver: true,
    }).start();
  }, []);

  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(anim,  { toValue: 0, duration: 250, useNativeDriver: true }),
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
      <Image source={getProductImage(item.category, item.image)} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </Text>
        <Text style={[styles.itemPrice, { color: accentColor }]}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
        <View style={styles.qtyRow}>
          <Pressable onPress={onDecrement} style={styles.qtyBtn} hitSlop={8}>
            <Text style={styles.qtyBtnText}>−</Text>
          </Pressable>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <Pressable onPress={onIncrement} style={styles.qtyBtn} hitSlop={8}>
            <Text style={styles.qtyBtnText}>+</Text>
          </Pressable>
        </View>
      </View>
      <Pressable onPress={handleRemove} style={styles.removeBtn} hitSlop={10}>
        <MaterialIcons name="delete-outline" size={22} color="#FF4D4D" />
      </Pressable>
    </Animated.View>
  );
}

export default function CartScreen() {
  const dispatch    = useDispatch();
  const theme       = useTheme();
  const cartItems   = useSelector((state) => state.cart.items);
  const accentColor = useSelector((state) => state.ui.accentColor ?? '#E85D26');
  const total       = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalUnits  = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const [modal, setModal] = useState({ type: null });

  const footerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(footerAnim, {
      toValue: 1, tension: 50, friction: 10, delay: 300, useNativeDriver: true,
    }).start();
  }, []);

  const handlePurchase = () => setModal({ type: 'purchase' });

  const confirmPurchase = async () => {
    setModal({ type: null });
    dispatch(addOrder({ items: cartItems, total }));
    dispatch(clearCart());
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 ¡Pedido confirmado!',
        body: `Tu pedido por $${total.toFixed(2)} está siendo preparado.`,
        sound: true,
      },
      trigger: null,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />
      {/* Un solo tinte — sin duplicado */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.bgTint, pointerEvents: 'none' }]} />
      <View style={[styles.bgGlow, { backgroundColor: accentColor }]} />

      <ConfirmModal
        visible={modal.type === 'purchase'}
        title="Confirmar pedido"
        subtitle={`$${total.toFixed(2)}`}
        body={`${totalUnits} producto${totalUnits !== 1 ? 's' : ''} · Entrega estimada 30 min`}
        confirmText="Confirmar pedido"
        cancelText="Cancelar"
        accentColor={accentColor}
        onConfirm={confirmPurchase}
        onCancel={() => setModal({ type: null })}
      />

      <ConfirmModal
        visible={modal.type === 'clear'}
        title="Vaciar carrito"
        body="Se eliminarán todos los productos. ¿Estás seguro?"
        confirmText="Vaciar todo"
        cancelText="Cancelar"
        accentColor={accentColor}
        confirmDestructive
        onConfirm={() => { dispatch(clearCart()); setModal({ type: null }); }}
        onCancel={() => setModal({ type: null })}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Carrito</Text>
        {cartItems.length > 0 && (
          <Pressable onPress={() => setModal({ type: 'clear' })}>
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
            keyExtractor={(item) => item.id?.toString()}
            renderItem={({ item, index }) => (
              <CartItem
                item={item}
                index={index}
                accentColor={accentColor}
                onIncrement={() => dispatch(incrementQuantity(item.id))}
                onDecrement={() => dispatch(decrementQuantity(item.id))}
                onRemove={()    => dispatch(removeFromCart(item.id))}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          <Animated.View style={[styles.footer, {
            opacity: footerAnim,
            transform: [{ translateY: footerAnim.interpolate({ inputRange: [0, 1], outputRange: [80, 0] }) }],
          }]}>
            <View style={[styles.footerGlow, { backgroundColor: accentColor }]} />
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>{totalUnits} unidad{totalUnits !== 1 ? 'es' : ''}</Text>
                <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.buyBtn,
                  { backgroundColor: accentColor, shadowColor: accentColor },
                  pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
                ]}
                onPress={handlePurchase}
              >
                <Text style={[styles.buyBtnText, { color: theme.onPrimary }]}>Finalizar pedido</Text>
                <MaterialIcons name="arrow-forward-ios" size={14} color={theme.onPrimary} />
              </Pressable>
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgGlow: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    opacity: 0.05, top: -100, right: -80,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 56, paddingBottom: 20, paddingHorizontal: 24,
  },
  title:    { fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  clearBtn: { fontSize: 14, fontWeight: '700', color: '#FF4D4D' },
  list:     { paddingHorizontal: 20, paddingBottom: 200 },
  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20, padding: 14, marginBottom: 12,
  },
  itemImage: { width: 64, height: 64, borderRadius: 14, marginRight: 14 },
  itemInfo:  { flex: 1 },
  itemName:  { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  itemPrice: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', lineHeight: 20 },
  qtyValue:   { color: '#FFFFFF', fontSize: 15, fontWeight: '800', minWidth: 20, textAlign: 'center' },
  removeBtn:  { padding: 8 },
  empty:      { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 72, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
  emptySub:   { fontSize: 14, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 20 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(15,10,30,0.95)',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    padding: 24, paddingBottom: 96, overflow: 'hidden',
  },
  footerGlow: {
    position: 'absolute', width: 200, height: 100, borderRadius: 100,
    opacity: 0.08, top: -20, left: 20,
  },
  totalRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel:  { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 2 },
  totalAmount: { fontSize: 30, fontWeight: '900', color: '#FFFFFF' },
  buyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 16, paddingHorizontal: 24, borderRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
  },
  buyBtnText: { fontSize: 16, fontWeight: '800' },
});