import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import * as Location from 'expo-location';
import { auth } from '../service/firebase';
import { clearUser } from '../features/auth/authSlice';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }, 100);
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo cerrar sesión');
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se pudo obtener la ubicación');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/avatar.jpg')} style={styles.avatar} />
      <Text style={styles.name}>Hola 👋</Text>
      <Text style={styles.email}>{user?.email || 'Sin email'}</Text>
      {location && (
        <Text style={styles.location}>
          Ubicación: {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
        </Text>
      )}
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 16, color: '#666', marginBottom: 10 },
  location: { fontSize: 14, color: '#888', marginBottom: 30 },
  button: { backgroundColor: '#e63946', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
