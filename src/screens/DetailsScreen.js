import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert, StatusBar, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { addToCart } from '../redux/cartSlice';
import { getProductImage } from '../utils/productImages';
import { useTheme } from '../hooks/useTheme';

export default function DetailsScreen({ route }) {
  const { product } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    Alert.alert('✅ Agregado', `${product.name} fue agregado al carrito.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={getProductImage(product.name)} style={styles.image} />
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.handle} />
          <Text style={[styles.name, { color: theme.colors.text }]}>{product.name}</Text>
          <Text style={[styles.price, { color: theme.primary }]}>
            ${product.price?.toFixed(2)}
          </Text>

          <View style={[styles.infoRow, { backgroundColor: theme.colors.surfaceAlt }]}>
            <View style={styles.infoItem}>
              <MaterialIcons name="verified" size={20} color={theme.primary} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>Artesanal</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.infoItem}>
              <MaterialIcons name="local-shipping" size={20} color={theme.primary} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>Envío gratis</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.infoItem}>
              <MaterialIcons name="star" size={20} color={theme.primary} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>Premium</Text>
            </View>
          </View>

          <Text style={[styles.descTitle, { color: theme.colors.text }]}>Descripción</Text>
          <Text style={[styles.desc, { color: theme.colors.textSecondary }]}>
            Producto artesanal elaborado con ingredientes frescos y seleccionados. 
            Preparado diariamente en nuestra panadería con recetas tradicionales y mucho amor. 
            Sin conservantes ni aditivos artificiales.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.surface }, theme.shadows.lg]}>
        <View>
          <Text style={[styles.footerLabel, { color: theme.colors.textMuted }]}>Precio</Text>
          <Text style={[styles.footerPrice, { color: theme.primary }]}>
            ${product.price?.toFixed(2)}
          </Text>
        </View>
        <Pressable style={[styles.addBtn, { backgroundColor: theme.primary }]} onPress={handleAddToCart}>
          <MaterialIcons name="add-shopping-cart" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Agregar al carrito</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: 280, resizeMode: 'cover' },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    padding: 24,
    paddingBottom: 120,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#ddd', alignSelf: 'center', marginBottom: 20,
  },
  name: { fontSize: 26, fontWeight: '800', marginBottom: 6 },
  price: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  infoRow: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoItem: { flex: 1, alignItems: 'center', gap: 6 },
  infoText: { fontSize: 12, fontWeight: '600' },
  divider: { width: 1, height: 32 },
  descTitle: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  desc: { fontSize: 15, lineHeight: 24 },
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 36,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  footerLabel: { fontSize: 13, marginBottom: 2 },
  footerPrice: { fontSize: 22, fontWeight: '800' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});