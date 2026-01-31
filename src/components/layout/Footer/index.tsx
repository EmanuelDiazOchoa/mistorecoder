import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.text}>© MyStore</Text>
  </View>
);

const styles = StyleSheet.create({ container: { padding: 12 }, text: { textAlign: 'center', color: '#666' } });

export default Footer;
