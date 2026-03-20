import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, StatusBar, Animated } from 'react-native';
import { CATEGORIES } from '../utils/productImages';
import { useTheme } from '../hooks/useTheme';

const CATEGORY_COLORS = {
  pan: { primary: '#E85D26', bg: 'rgba(232,93,38,0.12)', border: 'rgba(232,93,38,0.25)' },
  torta: { primary: '#EC4899', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)' },
  galletitas: { primary: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  donas: { primary: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)' },
  budin: { primary: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
  chocolate: { primary: '#92400E', bg: 'rgba(146,64,14,0.18)', border: 'rgba(146,64,14,0.35)' },
};

function CategoryCard({ item, index, onPress }) {
  const anim = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1, tension: 55, friction: 10,
      delay: index * 90, useNativeDriver: true,
    }).start();
  }, []);

  const colors = CATEGORY_COLORS[item.key] || CATEGORY_COLORS.pan;
  const theme = useTheme();

  return (
    <Animated.View style={{
      opacity: anim,
      transform: [
        { scale: pressScale },
        { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
      ],
      flex: 1, margin: 6,
    }}>
      <Pressable
        onPress={() => onPress(item)}
        onPressIn={() => Animated.spring(pressScale, { toValue: 0.95, useNativeDriver: true, speed: 50 }).start()}
        onPressOut={() => Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, speed: 50 }).start()}
      >
        <View style={[styles.card, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <View style={[styles.emojiWrap, { backgroundColor: `${colors.primary}20` }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
          <Text style={[styles.label, { color: '#FFFFFF' }]}>{item.label}</Text>
          <Text style={[styles.sublabel, { color: colors.primary }]}>Ver →</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function CategoriesScreen({ navigation }) {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const theme = useTheme();   

  useEffect(() => {
    Animated.spring(titleAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }).start();
  }, []);

  const handlePress = (item) => navigation.navigate('CategoryProducts', { category: item.key });

  
  const rows = [];
  for (let i = 0; i < CATEGORIES.length; i += 2) {
    rows.push(CATEGORIES.slice(i, i + 2));
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
  <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.bgTint, pointerEvents: 'none' }]} />
      <StatusBar barStyle="light-content" />
      <View style={styles.bgGlow} />

      <Animated.View style={[styles.header, {
        opacity: titleAnim,
        transform: [{ translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
      }]}>
        <Text style={styles.title}>Categorías</Text>
        <Text style={styles.subtitle}>¿Qué se te antoja hoy?</Text>
      </Animated.View>

      <FlatList
        data={rows}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item: row, index: rowIndex }) => (
          <View style={styles.row}>
            {row.map((cat, colIndex) => (
              <CategoryCard
                key={cat.key}
                item={cat}
                index={rowIndex * 2 + colIndex}
                onPress={handlePress}
              />
            ))}
            {row.length === 1 && <View style={{ flex: 1, margin: 6 }} />}
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgGlow: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    backgroundColor: '#7C3AED', opacity: 0.06, top: -60, right: -60,
  },
  header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 24 },
  title: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.35)', marginTop: 4 },
  list: { paddingHorizontal: 14, paddingBottom: 120 },
  row: { flexDirection: 'row' },
  card: {
    borderRadius: 22, padding: 20, borderWidth: 1,
    alignItems: 'center', minHeight: 150, justifyContent: 'center', gap: 10,
  },
  emojiWrap: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 34 },
  label: { fontSize: 16, fontWeight: '800', textAlign: 'center' },
  sublabel: { fontSize: 13, fontWeight: '700' },
});