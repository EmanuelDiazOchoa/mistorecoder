import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/productsSlice';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('Details', { product: item })}
      style={styles.item}
    >
      <Text style={styles.itemText}>{item.name} - ${item.price}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Productos</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  item: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
  },
});

