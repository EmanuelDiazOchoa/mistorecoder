
// src/screens/DetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsScreen({ route }) {
  const { product } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del Producto</Text>
      <Text style={styles.detail}>Nombre: {product.name}</Text>
      <Text style={styles.detail}>Precio: ${product.price}</Text>
      {/* Agregá más campos si querés (descripción, imagen, etc.) */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  detail: { fontSize: 20, marginBottom: 10 }
});
