import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable,
  Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, StatusBar, Animated,
} from 'react-native';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../service/firebase';
import { setUser } from '../features/auth/authSlice';
import { saveSession } from '../service/sessionStorage';

GoogleSignin.configure({
  webClientId: '392409110606-j7dnu8jeiihkshh5eect131lgo6mm8s7.apps.googleusercontent.com',
});

function Blob({ style, delay = 0 }) {
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
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] });
  return <Animated.View style={[style, { transform: [{ translateY }, { scale }] }]} />;
}

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken ?? userInfo.idToken;
      if (!idToken) throw new Error('No se recibió token de Google');
      const credential = GoogleAuthProvider.credential(idToken);
      const { user } = await signInWithCredential(auth, credential);
      await saveSession(user.email, user.uid);
      dispatch(setUser({ email: user.email, uid: user.uid }));
      navigation.replace('Main');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (error.code === statusCodes.IN_PROGRESS) return;
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services no disponible');
        return;
      }
      Alert.alert('Error Google', error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Completá todos los campos'); return; }
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await saveSession(user.email, user.uid);
      dispatch(setUser({ uid: user.uid, email: user.email }));
      navigation.replace('Main');
    } catch {
      Alert.alert('Error', 'Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.root}>
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
        <Animated.View style={[styles.hero, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoRing}>
            <Text style={styles.logoEmoji}>🍞</Text>
          </View>
          <Text style={styles.heroTitle}>Roma Store</Text>
          <Text style={styles.heroSub}>Tu panadería artesanal favorita</Text>
        </Animated.View>

        <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
          {!showEmail ? (
            <>
              <Text style={styles.cardTitle}>Bienvenido 👋</Text>
              <Text style={styles.cardSub}>Ingresá con tu cuenta de Google</Text>

              <Pressable
                style={({ pressed }) => [styles.googleBtn, pressed && styles.pressed]}
                onPress={handleGoogleLogin}
                disabled={googleLoading}
              >
                <View style={styles.googleIconWrap}>
                  <Text style={styles.googleG}>G</Text>
                </View>
                {googleLoading
                  ? <ActivityIndicator color="#1A1208" style={{ flex: 1 }} />
                  : <Text style={styles.googleBtnText}>Continuar con Google</Text>
                }
              </Pressable>

              <View style={styles.divRow}>
                <View style={styles.divLine} />
                <Text style={styles.divText}>o</Text>
                <View style={styles.divLine} />
              </View>

              <Pressable
                style={({ pressed }) => [styles.emailBtn, pressed && styles.emailPressed]}
                onPress={() => setShowEmail(true)}
              >
                <Text style={styles.emailBtnText}>Ingresar con email</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate('Register')} style={styles.registerRow}>
                <Text style={styles.registerText}>
                  ¿No tenés cuenta?{'  '}
                  <Text style={styles.registerLink}>Registrate gratis</Text>
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={() => setShowEmail(false)} style={styles.backRow}>
                <Text style={styles.backText}>← Volver</Text>
              </Pressable>
              <Text style={styles.cardTitle}>Con tu email</Text>

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
                style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
                onPress={handleEmailLogin}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.submitBtnText}>Iniciar sesión</Text>
                }
              </Pressable>

              <Pressable onPress={() => navigation.navigate('Register')} style={styles.registerRow}>
                <Text style={styles.registerText}>
                  ¿No tenés cuenta?{'  '}
                  <Text style={styles.registerLink}>Registrate gratis</Text>
                </Text>
              </Pressable>
            </>
          )}
        </Animated.View>

        <Text style={styles.footer}>Al continuar, aceptás nuestros términos de uso</Text>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0F0A1E' },
  blob1: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    backgroundColor: '#E85D26', opacity: 0.25, top: -60, left: -80,
  },
  blob2: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#7C3AED', opacity: 0.20, top: 120, right: -60,
  },
  blob3: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: '#F59E0B', opacity: 0.15, bottom: 200, left: 20,
  },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 40 },
  hero: { alignItems: 'center', marginBottom: 36 },
  logoRing: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(232,93,38,0.18)',
    borderWidth: 2, borderColor: 'rgba(232,93,38,0.5)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  logoEmoji: { fontSize: 48 },
  heroTitle: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 6 },
  heroSub: { fontSize: 15, color: 'rgba(255,255,255,0.55)' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 28, padding: 28,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  cardTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 6, textAlign: 'center' },
  cardSub: { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 28 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, marginBottom: 20,
    shadowColor: '#E85D26', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  googleIconWrap: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#4285F4',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  googleG: { color: '#fff', fontSize: 17, fontWeight: '900' },
  googleBtnText: { flex: 1, fontSize: 16, fontWeight: '700', color: '#1A1208', textAlign: 'center', marginRight: 32 },
  divRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  divLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  divText: { color: 'rgba(255,255,255,0.35)', fontSize: 13 },
  emailBtn: {
    paddingVertical: 15, borderRadius: 16, borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', marginBottom: 24,
  },
  emailPressed: { backgroundColor: 'rgba(255,255,255,0.06)' },
  emailBtnText: { fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  input: {
    height: 54, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14,
    paddingHorizontal: 18, marginBottom: 14, fontSize: 15, color: '#FFFFFF',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  submitBtn: {
    backgroundColor: '#E85D26', paddingVertical: 16, borderRadius: 16,
    alignItems: 'center', marginBottom: 24,
    shadowColor: '#E85D26', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.82 },
  backRow: { marginBottom: 16 },
  backText: { color: '#E85D26', fontSize: 15, fontWeight: '700' },
  registerRow: { alignItems: 'center' },
  registerText: { color: 'rgba(255,255,255,0.45)', fontSize: 14 },
  registerLink: { color: '#E85D26', fontWeight: '800' },
  footer: { textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 24 },
});