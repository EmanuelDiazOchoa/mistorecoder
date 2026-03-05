import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  Image, StatusBar, RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/productsSlice';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { useTheme } from '../hooks/useTheme';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { products, loading } = useSelector((state) => state.products);
  const user = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { dispatch(fetchProducts()); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchProducts());
    setRefreshing(false);
  }, []);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return '🌅 Buenos días';
    if (h < 19) return '☀️ Buenas tardes';
    return '🌙 Buenas noches';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('Details', { product: item })}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
        ListHeaderComponent={
          <View>
            <View style={[styles.header, { backgroundColor: theme.colors.surface }, theme.shadows.sm]}>
              <Image source={require('../../assets/PasteleriaRoma.webp')} style={styles.logo} />
              <View style={styles.headerText}>
                <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
                  {greeting()}
                </Text>
                <Text style={[styles.brand, { color: theme.colors.text }]}>Roma Store</Text>
                <Text style={[styles.userEmail, { color: theme.colors.textMuted }]}>
                  {user?.email?.split('@')[0] || 'Visitante'}
                </Text>
              </View>
            </View>
            <View style={styles.searchWrap}>
              <SearchBar value={search} onChangeText={setSearch} />
            </View>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {search ? `Resultados para "${search}"` : '🎯 Productos destacados'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <EmptyState
              icon="search-off"
              title="Sin resultados"
              subtitle="Intentá con otro nombre de producto"
            />
          )
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  logo: { width: 56, height: 56, borderRadius: 28, marginRight: 14 },
  headerText: { flex: 1 },
  greeting: { fontSize: 12, fontWeight: '500', marginBottom: 2 },
  brand: { fontSize: 22, fontWeight: '800' },
  userEmail: { fontSize: 13 },
  searchWrap: { paddingHorizontal: 20, marginTop: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
});