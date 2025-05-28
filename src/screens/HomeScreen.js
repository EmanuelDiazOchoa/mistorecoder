// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Tienda - Lista de Productos</Text>
      <Button title="Ver producto" onPress={() => navigation.navigate('Details')} />
    </View>
  );
}
