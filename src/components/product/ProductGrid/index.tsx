import React from 'react';
import { View, FlatList } from 'react-native';
import ProductCard from '../ProductCard';
import type { Product } from '../../../types/models';

const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => (
  <FlatList data={products} keyExtractor={(p) => p.id} renderItem={({ item }) => <ProductCard product={item} />} numColumns={2} />
);

export default ProductGrid;
