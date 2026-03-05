import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export default function SearchBar({ value, onChangeText, placeholder = 'Buscar productos...' }) {
  const theme = useTheme();
  return (
    <View style={[styles.container, {
      backgroundColor: theme.colors.input,
      borderColor: theme.colors.border,
    }]}>
      <MaterialIcons name="search" size={20} color={theme.colors.textMuted} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        style={[styles.input, { color: theme.colors.text }]}
      />
      {value?.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <MaterialIcons name="close" size={18} color={theme.colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15 },
});