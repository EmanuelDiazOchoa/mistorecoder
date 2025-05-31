// src/components/ProductCard.js
import React from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';

/**
 * Props:
 *  - item  : { id, name, price }
 *  - onPress: función que se ejecuta al tocar la tarjeta
 */
export default function ProductCard({ item, onPress }) {
  // ↓ si en el futuro quieres imágenes por item, cámbialo aquí
  const getProductImage = () => {
    switch (item.name.toLowerCase()) {
      case 'pan':
        return require('../../assets/Pan.webp');
      case 'torta':
        return require('../../assets/Torta.webp');
      case 'budin':
        return require('../../assets/Budin.webp');
    }
  };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={getProductImage()} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  info: { flex: 1 },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
});
