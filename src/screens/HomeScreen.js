import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  StatusBar, RefreshControl, Pressable, Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/productsSlice';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import { useTheme } from '../hooks/useTheme';

function AnimatedCard({ children, index }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1, tension: 60, friction: 10,
      delay: index * 80, useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
    }}>
      {children}
    </Animated.View>
  );
}

const FILTERS = [
  { label: 'Todo',       key: 'Todo'       },
  { label: 'Pan',        key: 'pan'        },
  { label: 'Tortas',     key: 'torta'      },
  { label: 'Galletitas', key: 'galletitas' },
  { label: 'Donas',      key: 'donas'      },
  { label: 'Postres',    key: 'budin'      },
  { label: 'Chocolates', key: 'chocolate'  },
];

function SkeletonList() {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const user = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todo');
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const headerAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchProducts());
    Animated.stagger(120, [
      Animated.spring(headerAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
      Animated.spring(searchAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchProducts());
    setRefreshing(false);
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'Todo' || p.category === activeFilter;
    return matchSearch && matchFilter;
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return '🌅 Buenos días';
    if (h < 19) return '☀️ Buenas tardes';
    return '🌙 Buenas noches';
  };

  const username = user?.email?.split('@')[0] || 'visitante';

  const activeLabel = FILTERS.find(f => f.key === activeFilter)?.label || activeFilter;

  const ListHeader = (
    <View>
      <Animated.View style={[styles.header, {
        opacity: headerAnim,
        transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
      }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting()}</Text>
            <Text style={styles.username}>{username} 👋</Text>
          </View>
          <View style={[styles.logoBadge, {
            backgroundColor: `${theme.primary}20`,
            borderColor: `${theme.primary}40`,
          }]}>
            <Text style={styles.logoBadgeText}>🍞</Text>
          </View>
        </View>

        <View style={[styles.promoBanner, {
              backgroundColor: `${theme.primary}18`,
              borderColor: `${theme.primary}30`,
            }]}>
              <View style={[styles.promoGlow, { backgroundColor: theme.primary }]} />
              <View style={styles.promoContent}>
            <Text style={[styles.promoTag, { color: theme.primary }]}>✨ OFERTA DEL DÍA</Text>
            <Text style={styles.promoTitle}>Panadería{'\n'}Artesanal</Text>
            <Text style={styles.promoSub}>Recetas de siempre,{'\n'}sabor único</Text>
          </View>
          <Text style={styles.promoEmoji}>🥐</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.searchWrap, {
        opacity: searchAnim,
        transform: [{ translateY: searchAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
      }]}>
        <SearchBar value={search} onChangeText={setSearch} />
      </Animated.View>

      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersWrap}
        style={{ opacity: searchAnim }}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            style={[
              styles.chip,
              activeFilter === f.key && {
                backgroundColor: theme.primary,
                borderColor: theme.primary,
              }
            ]}
            onPress={() => setActiveFilter(f.key)}
          >
            <Text style={[
              styles.chipText,
              activeFilter === f.key && { color: theme.onPrimary }
            ]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </Animated.ScrollView>

      <Text style={styles.sectionTitle}>
        {search
          ? `Resultados para "${search}"`
          : activeFilter === 'Todo'
            ? '🔥 Destacados'
            : `🎯 ${activeLabel}`
        }
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.bgTint, pointerEvents: 'none' }]} />
      <StatusBar barStyle="light-content" />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item, index }) => (
          <AnimatedCard index={index}>
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('Details', { product: item })}
            />
          </AnimatedCard>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E85D26" />
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
            loading
              ? <SkeletonList />
              : (
                <EmptyState
                  icon="search-off"
                  title="Sin resultados"
                  subtitle="Intentá con otro nombre o categoría"
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

  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 0 },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: '500', marginBottom: 2 },
  username: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  logoBadge: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: 'rgba(232,93,38,0.15)',
    borderWidth: 1.5, borderColor: 'rgba(232,93,38,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoBadgeText: { fontSize: 24 },

  promoBanner: {
    backgroundColor: 'rgba(232,93,38,0.12)',
    borderRadius: 24, borderWidth: 1,
    borderColor: 'rgba(232,93,38,0.25)',
    padding: 22, flexDirection: 'row',
    alignItems: 'center', marginBottom: 24, overflow: 'hidden',
  },
  promoGlow: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: '#E85D26', opacity: 0.08, top: -60, left: -40,
  },
  promoContent: { flex: 1 },
  promoTag: { fontSize: 10, fontWeight: '800', color: '#E85D26', letterSpacing: 1.5, marginBottom: 6 },
  promoTitle: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', lineHeight: 30, marginBottom: 6 },
  promoSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 18 },
  promoEmoji: { fontSize: 64 },

  searchWrap: { paddingHorizontal: 20, marginBottom: 8 },

  
  filtersWrap: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  
  chipActive: {},  
  chipText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  chipTextActive: { color: '#FFFFFF' },

  sectionTitle: {
    fontSize: 18, fontWeight: '800', color: '#FFFFFF',
    paddingHorizontal: 20, marginBottom: 12,
  },
  list: { paddingHorizontal: 20, paddingBottom: 120 },
});