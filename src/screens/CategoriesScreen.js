import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, StatusBar } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { CATEGORIES } from '../utils/productImages';

export default function CategoriesScreen({ navigation }) {
  const theme = useTheme();

  const renderItem = ({ item }) => (
    <Pressable
      style={[styles.card, { backgroundColor: theme.colors.card }, theme.shadows.sm]}
      onPress={() => navigation.navigate('CategoryProducts', { category: item.key })}
    >
      <View style={[styles.emojiWrap, { backgroundColor: theme.colors.surfaceAlt }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{item.label}</Text>
        <Text style={[styles.sublabel, { color: theme.colors.textMuted }]}>Ver productos</Text>
      </View>
      <Text style={[styles.arrow, { color: theme.colors.textMuted }]}>›</Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Categorías</Text>
      </View>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: '800' },
  list: { padding: 20, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  emojiWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  emoji: { fontSize: 26 },
  cardInfo: { flex: 1 },
  label: { fontSize: 17, fontWeight: '700', marginBottom: 2 },
  sublabel: { fontSize: 13 },
  arrow: { fontSize: 24, fontWeight: '300' },
});