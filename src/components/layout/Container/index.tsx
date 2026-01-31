import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

const Container: React.FC = ({ children }) => <SafeAreaView style={styles.container}>{children}</SafeAreaView>;

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });

export default Container;
