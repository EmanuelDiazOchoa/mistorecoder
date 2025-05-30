import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/productsSlice';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  // 🔽 Función que devuelve la imagen correspondiente al producto
  const getProductImage = (name) => {
    switch (name.toLowerCase()) {
      case 'pan':
        return require('../../assets/Pan.webp');
      case 'torta':
        return require('../../assets/Torta.webp');
      case 'budin':
        return require('../../assets/Budin.webp');
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('Details', { product: item })}
      style={styles.card}
    >
      <Image
        source={getProductImage(item.name)} 
        style={styles.productImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* 🏪 Logo de la tienda */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/PasteleriaRoma.webp')}
          style={styles.logo}
        />
        <Text style={styles.brand}>Roma Store</Text>
        <Text style={styles.subtitle}>Lo mejor en panificados</Text>
      </View>

      {/* 🛒 Lista de productos */}
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  brand: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2f80ed',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 20,
  },
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
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
});
