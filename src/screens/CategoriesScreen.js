import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function CategoriesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Categorías</Text>
      <View style={styles.card}>
        <Text style={styles.emoji}>🥖</Text>
        <Text style={styles.label}>Panadería</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.emoji}>🎂</Text>
        <Text style={styles.label}>Tortas</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.emoji}>🍪</Text>
        <Text style={styles.label}>Galletitas</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.emoji}>🍩</Text>
        <Text style={styles.label}>Donas</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.emoji}>🍰</Text>
        <Text style={styles.label}>Postres</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.emoji}>🍫</Text>
        <Text style={styles.label}>Chocolates</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2f80ed',
    marginBottom: 30,
  },
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
  emoji: {
    fontSize: 28,
    marginRight: 15,
  },
  label: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
});
