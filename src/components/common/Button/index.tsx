import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & { title: string };

const Button: React.FC<Props> = ({ title, style, ...rest }) => (
  <TouchableOpacity style={[styles.button, style]} {...rest}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { padding: 12, backgroundColor: '#0f62fe', borderRadius: 6 },
  text: { color: '#fff', textAlign: 'center' },
});

export default Button;
