import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useLoginMutation } from '../features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const result = await login({ email, password });
    if (result.data) {
      dispatch(setUser(result.data));
      navigation.navigate('Home');
    } else {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Ir a registro" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
