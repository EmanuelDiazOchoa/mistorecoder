import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable,
  Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, StatusBar, Animated,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAppDispatch } from '../hooks/useRedux';
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

export default function LoginScreen() {
  const dispatch   = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await saveSession(user.email!, user.uid);
      dispatch(setUser({ uid: user.uid, email: user.email! }));
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
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.bg} />
      <Blob style={styles.blob1} delay={0} />
      <Blob style={styles.blob2} delay={600} />
      <Blob style={styles.blob3} delay={1200} />

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
          <Text style={styles.heroSub}>Tu panadería artesanal favorita</Text>
        </Animated.View>

        {/* Card */}
        <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.cardTitle}>Bienvenido 👋</Text>
          <Text style={styles.cardSub}>Ingresá con tu cuenta</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.submitBtnText}>Iniciar sesión</Text>
            }
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Register')}
            style={styles.registerRow}
          >
            <Text style={styles.registerText}>
              ¿No tenés cuenta?{'  '}
              <Text style={styles.registerLink}>Registrate gratis</Text>
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
  blob1: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: '#E85D26', opacity: 0.25, top: -60,   left: -80  },
  blob2: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: '#7C3AED', opacity: 0.2,  top: 120,   right: -60 },
  blob3: { position: 'absolute', width: 180, height: 180, borderRadius: 90,  backgroundColor: '#F59E0B', opacity: 0.15, bottom: 200, left: 20   },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 40 },

  hero:      { alignItems: 'center', marginBottom: 36 },
  logoRing:  { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(232,93,38,0.18)', borderWidth: 2, borderColor: 'rgba(232,93,38,0.5)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoEmoji: { fontSize: 48 },
  heroTitle: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 6 },
  heroSub:   { fontSize: 15, color: 'rgba(255,255,255,0.55)' },

  card:      { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 28, padding: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  cardTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 6, textAlign: 'center' },
  cardSub:   { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 28 },

  input: {
    height: 52, backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14, paddingHorizontal: 16,
    color: '#FFFFFF', marginBottom: 16, fontSize: 15,
  },
  submitBtn:     { paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 18, backgroundColor: '#E85D26' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  registerRow:  { marginTop: 8, alignItems: 'center' },
  registerText: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  registerLink: { color: '#FFFFFF', fontWeight: '800' },

  footer: { marginTop: 28, color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 12 },
});