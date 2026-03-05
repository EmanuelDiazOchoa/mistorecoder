import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable,
  Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, StatusBar, ScrollView,
} from 'react-native';
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../service/firebase';
import { setUser } from '../features/auth/authSlice';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mode, setMode] = useState('options');

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '392409110606-2cbo8nheu4tn9p5gvj7l5h27iq67on93.apps.googleusercontent.com',
    webClientId: '392409110606-j7dnu8jeiihkshh5eect131lgo6mm8s7.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      setGoogleLoading(true);
      signInWithCredential(auth, credential)
        .then(({ user }) => {
          dispatch(setUser({ email: user.email, uid: user.uid }));
          navigation.replace('Main');
        })
        .catch((e) => Alert.alert('Error', e.message))
        .finally(() => setGoogleLoading(false));
    }
  }, [response]);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUser({ uid: user.uid, email: user.email }));
      navigation.replace('Main');
    } catch {
      Alert.alert('Error', 'Email o contraseña incorrectos');
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
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🍞</Text>
          <Text style={styles.heroTitle}>Roma Store</Text>
          <Text style={styles.heroSubtitle}>Tu panadería artesanal favorita</Text>
        </View>

        {mode === 'options' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ingresar</Text>

            <Pressable
              style={({ pressed }) => [styles.googleBtn, pressed && styles.pressed]}
              onPress={() => promptAsync()}
              disabled={!request || googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.googleBtnText}>Continuar con Google</Text>
                </>
              )}
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={({ pressed }) => [styles.emailBtn, pressed && styles.pressed]}
              onPress={() => setMode('email')}
            >
              <Text style={styles.emailBtnText}>Ingresar con email</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>
                ¿No tenés cuenta? <Text style={styles.registerLinkBold}>Registrate</Text>
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <Pressable onPress={() => setMode('options')} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← Volver</Text>
            </Pressable>

            <Text style={styles.cardTitle}>Con tu email</Text>

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#A8998E"
            />
            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#A8998E"
            />

            <Pressable
              style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
              onPress={handleEmailLogin}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.submitBtnText}>Iniciar sesión</Text>
              }
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>
                ¿No tenés cuenta? <Text style={styles.registerLinkBold}>Registrate</Text>
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  hero: { alignItems: 'center', marginBottom: 32 },
  heroEmoji: { fontSize: 64, marginBottom: 12 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#1A1208', marginBottom: 4 },
  heroSubtitle: { fontSize: 15, color: '#A8998E' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#1A1208', marginBottom: 20, textAlign: 'center' },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#E85D26',
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
  },
  googleBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E8E0D8' },
  dividerText: { color: '#A8998E', fontSize: 14 },
  emailBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8E0D8',
    alignItems: 'center',
    marginBottom: 20,
  },
  emailBtnText: { fontSize: 15, fontWeight: '600', color: '#6B5E52' },
  backBtn: { marginBottom: 16 },
  backBtnText: { color: '#E85D26', fontSize: 15, fontWeight: '600' },
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
  submitBtn: {
    backgroundColor: '#E85D26',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  registerLink: { textAlign: 'center', color: '#A8998E', fontSize: 14 },
  registerLinkBold: { color: '#E85D26', fontWeight: '700' },
  pressed: { opacity: 0.85 },
});