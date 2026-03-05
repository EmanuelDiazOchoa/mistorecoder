import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { loadOrders } from '../redux/ordersSlice';
import { useTheme } from '../hooks/useTheme';
import EmptyState from '../components/EmptyState';

export default function OrdersScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    AsyncStorage.getItem('orders').then((data) => {
      if (data) dispatch(loadOrders(JSON.parse(data)));
    });
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const renderOrder = ({ item, index }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.card }, theme.shadows.sm]}>
      <View style={styles.cardHeader}>
        <View style={[styles.orderBadge, { backgroundColor: theme.colors.surfaceAlt }]}>
          <MaterialIcons name="receipt-long" size={16} color={theme.primary} />
          <Text style={[styles.orderId, { color: theme.colors.textSecondary }]}>
            Pedido #{orders.length - index}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: theme.success }]}>✓ Completado</Text>
        </View>
      </View>

      <Text style={[styles.date, { color: theme.colors.textMuted }]}>
        {formatDate(item.date)}
      </Text>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      {item.items.map((prod, i) => (
        <View key={i} style={styles.productRow}>
          <Text style={[styles.productName, { color: theme.colors.textSecondary }]}>
            • {prod.name}
          </Text>
          <Text style={[styles.productPrice, { color: theme.colors.text }]}>
            ${prod.price?.toFixed(2)}
          </Text>
        </View>
      ))}

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.totalRow}>
        <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>
          Total pagado
        </Text>
        <Text style={[styles.total, { color: theme.primary }]}>
          ${item.total?.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Mis pedidos</Text>
      </View>
      {orders.length === 0 ? (
        <EmptyState
          icon="receipt-long"
          title="Sin pedidos aún"
          subtitle="Tus compras aparecerán acá una vez que finalices tu primer pedido"
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: '800' },
  list: { padding: 20, paddingBottom: 100 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  orderId: { fontSize: 13, fontWeight: '600' },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#E8F8EE',
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  date: { fontSize: 12, marginBottom: 12 },
  divider: { height: 1, marginVertical: 10 },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  productName: { fontSize: 14 },
  productPrice: { fontSize: 14, fontWeight: '600' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: { fontSize: 14 },
  total: { fontSize: 18, fontWeight: '800' },
});