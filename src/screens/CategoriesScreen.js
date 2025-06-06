import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

export default function CategoriesScreen({ navigation }) {
  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryProducts', { category });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Categorías</Text>

      {[
        { label: 'Panadería', emoji: '🥖', key: 'pan' },
        { label: 'Tortas', emoji: '🎂', key: 'torta' },
        { label: 'Galletitas', emoji: '🍪', key: 'galletitas' },
        { label: 'Donas', emoji: '🍩', key: 'donas' },
        { label: 'Postres', emoji: '🍰', key: 'budin' },
        { label: 'Chocolates', emoji: '🍫', key: 'chocolate' },
      ].map((item) => (
        <Pressable key={item.key} style={styles.card} onPress={() => handleCategoryPress(item.key)}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', color: '#2f80ed', marginBottom: 30 },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  emoji: { fontSize: 28, marginRight: 15 },
  label: { fontSize: 20, color: '#333', fontWeight: '600' },
});
