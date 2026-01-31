import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card: React.FC = ({ children }) => <View style={styles.card}>{children}</View>;

const styles = StyleSheet.create({ card: { padding: 12, backgroundColor: '#fff', borderRadius: 8, elevation: 1 } });

export default Card;
