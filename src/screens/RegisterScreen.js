import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { useDispatch } from 'react-redux';
import {
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../service/firebase';
import { setUser } from '../features/auth/authSlice';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId: '392409110606-2cbo8nheu4tn9p5gvj7l5h27iq67on93.apps.googleusercontent.com',
      webClientId: '392409110606-j7dnu8jeiihkshh5eect131lgo6mm8s7.apps.googleusercontent.com',
    });
    
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(({ user }) => {
          dispatch(setUser({ email: user.email, uid: user.uid }));
          navigation.replace('Main');
        })
        .catch((error) => Alert.alert('Error con Google', error.message));
    }
  }, [response]);

  const validate = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      dispatch(setUser({ email: user.email, uid: user.uid }));
      navigation.replace('Main');
    } catch (error) {
      const msg = error.code === 'auth/email-already-in-use'
        ? 'Ese email ya está registrado'
        : error.message;
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.inner}>
        <Text style={styles.logo}>🍞</Text>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Registrate en Roma Store</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          secureTextEntry
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholderTextColor="#aaa"
        />

        <Pressable style={styles.btn} onPress={handleRegister} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Registrarse</Text>
          }
        </Pressable>

        <Pressable
          style={styles.googleBtn}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Text style={styles.googleBtnText}>🔑 Continuar con Google</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>¿Ya tenés cuenta? <Text style={styles.linkBold}>Iniciar sesión</Text></Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5' },
  inner: { flex: 1, justifyContent: 'center', padding: 28 },
  logo: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', color: '#1A1208', marginBottom: 6 },
  subtitle: { fontSize: 15, textAlign: 'center', color: '#A8998E', marginBottom: 28 },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E8E0D8',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 15,
    backgroundColor: '#F5F0EB',
    color: '#1A1208',
  },
  btn: {
    height: 52,
    backgroundColor: '#E85D26',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  googleBtn: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E8E0D8',
    marginBottom: 20,
  },
  googleBtnText: { fontSize: 15, fontWeight: '600', color: '#1A1208' },
  link: { textAlign: 'center', color: '#A8998E', fontSize: 14 },
  linkBold: { color: '#E85D26', fontWeight: '700' },
});