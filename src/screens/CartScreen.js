import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../redux/cartSlice';

export default function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const handleRemove = (index) => {
    dispatch(removeFromCart(index));
  };

  const handleClearCart = () => {
    Alert.alert('Vaciar carrito', '¿Estás seguro que deseas eliminar todo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí', onPress: () => dispatch(clearCart()) },
    ]);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍️ Carrito de Compras</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.empty}>Tu carrito está vacío. Agrega productos desde el inicio.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.itemContainer}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                <Pressable onPress={() => handleRemove(index)} style={styles.removeButton}>
                  <Text style={styles.removeText}>Eliminar</Text>
                </Pressable>
              </View>
            )}
          />
          <View style={styles.footer}>
            <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
            <Pressable style={styles.clearButton} onPress={handleClearCart}>
              <Text style={styles.clearButtonText}>Vaciar carrito</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2f80ed',
    marginBottom: 20,
    textAlign: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 60,
    paddingHorizontal: 10,
  },
  itemContainer: {
    backgroundColor: '#f2f6fc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    color: '#2f80ed',
    fontWeight: 'bold',
  },
  removeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ffe5e5',
    borderRadius: 6,
  },
  removeText: {
    color: '#e63946',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#2f80ed',
  },
  clearButton: {
    backgroundColor: '#e63946',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
