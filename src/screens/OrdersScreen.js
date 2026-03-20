import React, { useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { loadOrders } from '../redux/ordersSlice';
import { useTheme } from '../hooks/useTheme';

function OrderCard({ item, index, total }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1, tension: 55, friction: 10,
      delay: index * 100, useNativeDriver: true,
    }).start();
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const orderNum = total - index;

  return (
    <Animated.View style={[styles.card, {
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
    }]}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={styles.orderNumWrap}>
          <Text style={styles.orderNumLabel}>PEDIDO</Text>
          <Text style={styles.orderNum}>#{orderNum}</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Completado</Text>
        </View>
      </View>

      <Text style={styles.date}>{formatDate(item.date)}</Text>

      {/* Items */}
      <View style={styles.divider} />
     {item.items.map((prod, i) => (
        <View key={i} style={styles.productRow}>
          <Text style={styles.productName}>
            • {prod.name}{prod.quantity > 1 ? ` x${prod.quantity}` : ''}
          </Text>
          <Text style={styles.productPrice}>
            ${(prod.price * (prod.quantity || 1)).toFixed(2)}
          </Text>
        </View>
      ))}
      <View style={styles.divider} />

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total pagado</Text>
        <Text style={styles.total}>${item.total?.toFixed(2)}</Text>
      </View>
    </Animated.View>
  );
}

export default function OrdersScreen() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const theme = useTheme();

  const titleAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    AsyncStorage.getItem('orders').then((data) => {
      if (data) dispatch(loadOrders(JSON.parse(data)));
    });
    Animated.spring(titleAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.bgTint, pointerEvents: 'none' }]} />
      <StatusBar barStyle="light-content" />
      <View style={styles.bgGlow} />
      <View style={styles.bgGlow2} />

      <Animated.View style={[styles.header, {
        opacity: titleAnim,
        transform: [{ translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
      }]}>
        <Text style={styles.title}>Mis pedidos</Text>
        {orders.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{orders.length}</Text>
          </View>
        )}
      </Animated.View>

      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>Sin pedidos aún</Text>
          <Text style={styles.emptySub}>Tus compras aparecerán acá cuando finalices tu primer pedido</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <OrderCard item={item} index={index} total={orders.length} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgGlow: {
    position: 'absolute', width: 250, height: 250, borderRadius: 125,
    backgroundColor: '#7C3AED', opacity: 0.06, top: -50, right: -60,
  },
  bgGlow2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#E85D26', opacity: 0.05, bottom: 100, left: -40,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingTop: 56, paddingBottom: 20, paddingHorizontal: 24,
  },
  title: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  countBadge: {
    backgroundColor: 'rgba(232,93,38,0.2)',
    borderWidth: 1, borderColor: 'rgba(232,93,38,0.4)',
    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4,
  },
  countText: { color: '#E85D26', fontSize: 13, fontWeight: '800' },

  list: { paddingHorizontal: 20, paddingBottom: 120 },

  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24, padding: 20, marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  orderNumWrap: {},
  orderNumLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5 },
  orderNum: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(39,174,96,0.15)',
    borderWidth: 1, borderColor: 'rgba(39,174,96,0.3)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#27AE60' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#27AE60' },
  date: { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 14 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginVertical: 12 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  productName: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  productPrice: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.8)' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  total: { fontSize: 22, fontWeight: '900', color: '#E85D26' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 72, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  emptySub: { fontSize: 14, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 20 },
});