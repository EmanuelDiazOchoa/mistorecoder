import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
} from 'react-native';


const getProductImage = (name) => {
  switch (name.toLowerCase()) {
    case 'pan':
      return require('../../assets/Pan.webp');
    case 'torta':
      return require('../../assets/Torta.webp');
    case 'budin':
      return require('../../assets/Budin.webp');
  }
};

export default function DetailsScreen({ route }) {
  const { product } = route.params;

  const handleAddToCart = () => {
    Alert.alert('¡Agregado!', `${product.name} fue agregado al carrito.`);
  };

  return (
    <View style={styles.container}>
      
      <Image
        source={getProductImage(product.name)}
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.description}>
          Producto artesanal de calidad premium, perfecto para tu día. Elaborado con ingredientes frescos y mucho amor.
        </Text>

        <Pressable style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Agregar al carrito</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    color: '#2f80ed',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2f80ed',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#2f80ed',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
