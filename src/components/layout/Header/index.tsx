import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header: React.FC<{ title?: string }> = ({ title = 'App' }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({ container: { padding: 12 }, title: { fontSize: 18, fontWeight: '700' } });

export default Header;
