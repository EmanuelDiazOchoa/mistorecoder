import React, { useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, StatusBar, Animated } from 'react-native';
import { useAppSelector } from '../hooks/useRedux';
import Svg, { Path } from 'react-native-svg';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../utils/productImages';
import { useTheme } from '../hooks/useTheme';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  pan:        '#E85D26',
  torta:      '#EC4899',
  galletitas: '#F59E0B',
  donas:      '#8B5CF6',
  budin:      '#10B981',
  chocolate:  '#92400E',
};

function IconChevronLeft({ color = '#FFFFFF', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

interface AnimatedProductItemProps {
  item: Product;
  index: number;
  onPress: () => void;
}

function AnimatedProductItem({ item, index, onPress }: AnimatedProductItemProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, tension: 55, friction: 10, delay: index * 70, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
    }}>
      <ProductCard product={item} onPress={onPress} />
    </Animated.View>
  );
}

interface CategoryProductsScreenProps {
  route: RouteProp<RootStackParamList, 'CategoryProducts'>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export default function CategoryProductsScreen({ route, navigation }: CategoryProductsScreenProps) {
  const { category } = route.params;
  const products = useAppSelector((state) => state.products.products);

  const filtered = products.filter((item: Product) =>
    item.category?.toLowerCase() === category.toLowerCase()
  );

  const catInfo = CATEGORIES.find((c) => c.key === category);
  const color = CATEGORY_COLORS[category] ?? '#E85D26';
  const theme = useTheme();

  const headerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(headerAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.bgTint, pointerEvents: 'none' }]} />
      <StatusBar barStyle="light-content" />
      <View style={[styles.bgGlow, { backgroundColor: color }]} />

      <Animated.View style={[styles.header, {
        opacity: headerAnim,
        transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
      }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
          <IconChevronLeft color="#FFFFFF" size={20} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerEmoji}>{catInfo?.emoji ?? '🛒'}</Text>
          <View>
            <Text style={styles.headerTitle}>{catInfo?.label ?? category}</Text>
            <Text style={[styles.headerSub, { color }]}>
              {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </Animated.View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item, index }) => (
          <AnimatedProductItem
            item={item}
            index={index}
            onPress={() => navigation.navigate('Details', { product: item })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>Sin productos</Text>
            <Text style={styles.emptySub}>No hay productos en esta categoría todavía</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgGlow: { position: 'absolute', width: 260, height: 260, borderRadius: 130, opacity: 0.07, top: -60, right: -60 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerEmoji: { fontSize: 32 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.3 },
  headerSub: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  list: { paddingHorizontal: 20, paddingBottom: 120 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  emptySub: { fontSize: 14, color: 'rgba(255,255,255,0.35)', textAlign: 'center' },
});