import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, StatusBar, Animated,
} from 'react-native';
import { useAppDispatch } from '../hooks/useRedux';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { auth } from '../service/firebase';
import { setUser } from '../features/auth/authSlice';
import { saveSession } from '../service/sessionStorage';
import { RootStackParamList } from '../types';

function Blob({ style, delay = 0 }: { style: any; delay?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 3200 + delay, useNativeDriver: true, delay }),
        Animated.timing(anim, { toValue: 0, duration: 3200 + delay, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const scale      = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] });
  return <Animated.View style={[style, { transform: [{ translateY }, { scale }] }]} />;
}

export default function RegisterScreen() {
  const dispatch   = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading,         setLoading]         = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

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
      await saveSession(user.email!, user.uid);
      dispatch(setUser({ email: user.email!, uid: user.uid }));
      navigation.replace('Main');
    } catch (error: any) {
      const msg = error.code === 'auth/email-already-in-use'
        ? 'Ese email ya está registrado'
        : error.message;
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bg} />
      <Blob style={styles.blob1} delay={400} />
      <Blob style={styles.blob2} delay={0} />
      <Blob style={styles.blob3} delay={900} />

      <Animated.ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        style={{ opacity: fadeAnim }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Animated.View style={[styles.hero, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoRing}>
            <Text style={styles.logoEmoji}>🍞</Text>
          </View>
          <Text style={styles.heroTitle}>Roma Store</Text>
          <Text style={styles.heroSub}>Creá tu cuenta gratis</Text>
        </Animated.View>

        {/* Card */}
        <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.cardTitle}>Crear cuenta</Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña (mín. 6 caracteres)"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            secureTextEntry
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholderTextColor="#9CA3AF"
          />

          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.submitBtnText}>Crear cuenta</Text>
            }
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Login')} style={styles.loginRow}>
            <Text style={styles.loginText}>
              ¿Ya tenés cuenta?{'  '}
              <Text style={styles.loginLink}>Iniciá sesión</Text>
            </Text>
          </Pressable>
        </Animated.View>

        <Text style={styles.footer}>Al continuar, aceptás nuestros términos de uso</Text>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bg:   { ...StyleSheet.absoluteFillObject, backgroundColor: '#0F0A1E' },
  blob1: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: '#7C3AED', opacity: 0.22, top: -40,    right: -70 },
  blob2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: '#E85D26', opacity: 0.20, top: 200,    left: -60  },
  blob3: { position: 'absolute', width: 160, height: 160, borderRadius: 80,  backgroundColor: '#10B981', opacity: 0.15, bottom: 180, right: 10  },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 40 },

  hero:      { alignItems: 'center', marginBottom: 32 },
  logoRing:  { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(124,58,237,0.18)', borderWidth: 2, borderColor: 'rgba(124,58,237,0.45)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  logoEmoji: { fontSize: 44 },
  heroTitle: { fontSize: 34, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 5 },
  heroSub:   { fontSize: 14, color: 'rgba(255,255,255,0.5)' },

  card:      { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 28, padding: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 22, textAlign: 'center' },

  input:         { height: 52, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingHorizontal: 16, color: '#FFFFFF', marginBottom: 16, fontSize: 15 },
  submitBtn:     { paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 18, backgroundColor: '#7C3AED' },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  loginRow:  { marginTop: 12, alignItems: 'center' },
  loginText: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  loginLink: { color: '#FFFFFF', fontWeight: '800' },

  footer: { marginTop: 28, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12 },
});