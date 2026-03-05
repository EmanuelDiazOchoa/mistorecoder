import React from 'react';
import {
  View, Text, FlatList, StyleSheet,
  Pressable, Alert, StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { removeFromCart, clearCart } from '../redux/cartSlice';
import { addOrder } from '../redux/ordersSlice';
import { useTheme } from '../hooks/useTheme';
import EmptyState from '../components/EmptyState';

export default function CartScreen() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const cartItems = useSelector((state) => state.cart.items);
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

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
            Alert.alert('🎉 ¡Pedido realizado!', 'Podés verlo en tu historial de pedidos.');
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.item, { backgroundColor: theme.colors.card }, theme.shadows.sm]}>
      <View style={[styles.itemIcon, { backgroundColor: theme.colors.surfaceAlt }]}>
        <Text style={styles.itemEmoji}>🛍️</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.colors.text }]}>{item.name}</Text>
        <Text style={[styles.itemPrice, { color: theme.primary }]}>
          ${item.price?.toFixed(2)}
        </Text>
      </View>
      <Pressable
        onPress={() => dispatch(removeFromCart(index))}
        style={styles.removeBtn}
        hitSlop={8}
      >
        <MaterialIcons name="delete-outline" size={22} color={theme.danger} />
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Carrito</Text>
        {cartItems.length > 0 && (
          <Pressable onPress={() => Alert.alert(
            'Vaciar carrito',
            '¿Eliminás todos los productos?',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Vaciar', style: 'destructive', onPress: () => dispatch(clearCart()) },
            ]
          )}>
            <Text style={[styles.clearText, { color: theme.danger }]}>Vaciar</Text>
          </Pressable>
        )}
      </View>

      {cartItems.length === 0 ? (
        <EmptyState
          icon="shopping-cart"
          title="Tu carrito está vacío"
          subtitle="Explorá los productos y agregá tus favoritos"
        />
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          <View style={[styles.footer, { backgroundColor: theme.colors.surface }, theme.shadows.lg]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>Total</Text>
              <Text style={[styles.totalAmount, { color: theme.colors.text }]}>
                ${total.toFixed(2)}
              </Text>
            </View>
            <Pressable
              style={[styles.buyBtn, { backgroundColor: theme.primary }]}
              onPress={handlePurchase}
            >
              <Text style={styles.buyBtnText}>Finalizar pedido</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  title: { fontSize: 28, fontWeight: '800' },
  clearText: { fontSize: 15, fontWeight: '600' },
  list: { padding: 20, paddingBottom: 200 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemEmoji: { fontSize: 22 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  itemPrice: { fontSize: 16, fontWeight: '700' },
  removeBtn: { padding: 6 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: { fontSize: 16 },
  totalAmount: { fontSize: 28, fontWeight: '800' },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  buyBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});