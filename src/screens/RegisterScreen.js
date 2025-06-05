import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, Alert,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { createUserWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { auth } from '../service/firebase';
import { setUser } from '../features/auth/authSlice';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '392409110606-j7dnu8jeiihkshh5eect131lgo6mm8s7.apps.googleusercontent.com',
    androidClientId: '392409110606-j7dnu8jeiihkshh5eect131lgo6mm8s7.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(userCredential => {
          const { email, uid } = userCredential.user;
          dispatch(setUser({ email, uid }));
          navigation.replace('Main');
        })
        .catch(error => Alert.alert('Error con Google', error.message));
    }
  }, [response]);

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { email: userEmail, uid } = userCredential.user;
      dispatch(setUser({ email: userEmail, uid }));
      Alert.alert('Registro exitoso', '¡Bienvenido!');
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Crear cuenta</Text>
        <TextInput style={styles.input} placeholder="Correo electrónico" keyboardType="email-address" onChangeText={setEmail} value={email} />
        <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry onChangeText={setPassword} value={password} />
        <TextInput style={styles.input} placeholder="Confirmar contraseña" secureTextEntry onChangeText={setConfirmPassword} value={confirmPassword} />
        <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrarse</Text>}
        </Pressable>
        <Pressable style={styles.googleButton} onPress={() => promptAsync()}>
          <Text style={styles.googleButtonText}>Registrarse con Google</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>¿Ya tenés cuenta? Iniciar sesión</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  innerContainer: { flex: 1, justifyContent: 'center', padding: 25 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 30, textAlign: 'center' },
  input: { height: 50, borderWidth: 1, borderColor: '#ccc', padding: 15, marginBottom: 15, borderRadius: 8, backgroundColor: '#f9f9f9' },
  button: { backgroundColor: '#2f80ed', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  googleButton: { backgroundColor: '#db4437', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  googleButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  loginLink: { textAlign: 'center', marginTop: 15, color: '#2f80ed' },
});
