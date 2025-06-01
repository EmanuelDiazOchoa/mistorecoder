import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CategoriesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías</Text>
      <Text style={styles.item}>🥖 Panadería</Text>
      <Text style={styles.item}>🎂 Tortas</Text>
      <Text style={styles.item}>🍪 Galletitas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  item: { fontSize: 18, marginBottom: 10 },
});
