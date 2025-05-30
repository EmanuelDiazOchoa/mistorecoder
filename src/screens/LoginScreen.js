import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLoginMutation } from '../features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setUser(result));
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.data?.message || 'Credenciales incorrectas');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Iniciar sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>
            ¿No tenés cuenta? <Text style={styles.registerBold}>Registrate</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2f80ed',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#2f80ed',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
  },
  registerBold: {
    fontWeight: '700',
    color: '#2f80ed',
  },
});
