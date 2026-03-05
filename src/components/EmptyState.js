import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export default function EmptyState({ icon = 'inbox', title, subtitle }) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} size={64} color={theme.colors.textMuted} />
      <Text style={[styles.title, { color: theme.colors.textSecondary }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});