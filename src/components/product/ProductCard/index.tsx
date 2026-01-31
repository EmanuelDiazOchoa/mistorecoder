import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { Product } from '../../../types/models';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <View style={styles.container}>
    {product.image ? <Image source={{ uri: product.image }} style={styles.image} /> : null}
    <Text style={styles.title}>{product.title}</Text>
    <Text>${product.price}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 8 },
  image: { width: 120, height: 120, borderRadius: 8 },
  title: { fontWeight: '600' },
});

export default ProductCard;
