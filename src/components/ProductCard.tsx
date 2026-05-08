import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

const getProductImage = (name) => {
  switch (name.toLowerCase()) {
    case 'pan':
      return require('../../assets/Pan.webp');
    case 'torta':
      return require('../../assets/Torta.webp');
    case 'budin':
      return require('../../assets/Budin.webp');
      case 'galletitas':
      return require('../../assets/Galletitas.jpg');
      case 'donas':
      return require('../../assets/dona.png');
      case 'chocolate':
      return require('../../assets/chocolate.webp');
    
  }
};

export default function ProductCard({ product, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={getProductImage(product.name)} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
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
  info: {
    flex: 1,
  },
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
