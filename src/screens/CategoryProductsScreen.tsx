import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';

export default function CategoryProductsScreen({ route, navigation }) {
  const { category } = route.params;
  const products = useSelector((state) => state.products.products);

  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(category)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos de {category}</Text>
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('Details', { product: item })}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#2f80ed' },
  list: { paddingBottom: 20 },
});
