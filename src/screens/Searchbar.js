import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SearchBar({ value, onChangeText, placeholder = 'Buscar productos...' }) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={20} color="rgba(255,255,255,0.35)" style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.25)"
        style={styles.input}
      />
      {value?.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <MaterialIcons name="close" size={18} color="rgba(255,255,255,0.35)" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14, height: 50, marginBottom: 16,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#FFFFFF', fontWeight: '500' },
});