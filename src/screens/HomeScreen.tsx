import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '@redux/productsSlice'; 
import ProductCard from '@components/product/ProductCard'; 
import { RootState, Product, RootStackParamList } from '@types/models';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products);

  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, []);

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('Details', { product: item })}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@assets/PasteleriaRoma.webp')} // ✅ @assets
          style={styles.logo}
        />
        <Text style={styles.brand}>Roma Store</Text>
        <Text style={styles.subtitle}>Lo mejor en panificados</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.featuredTitle}>🎯 Productos destacados</Text>
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#f9f9f9',
    borderBottomColor: '#eaeaea',
    borderBottomWidth: 1,
  },
  logo: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  brand: { fontSize: 28, fontWeight: 'bold', color: '#2f80ed' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 10 },
  section: { paddingHorizontal: 20, marginTop: 10 },
  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#2f80ed',
    paddingBottom: 5,
  },
  list: { paddingBottom: 20 },
});