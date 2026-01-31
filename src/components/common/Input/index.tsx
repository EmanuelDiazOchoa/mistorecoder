import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

const Input: React.FC<TextInputProps> = (props) => (
  <TextInput style={[styles.input, props.style]} {...props} />
);

const styles = StyleSheet.create({
  input: { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 6 },
});

export default Input;
