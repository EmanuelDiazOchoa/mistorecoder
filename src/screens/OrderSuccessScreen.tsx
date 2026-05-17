import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, Animated } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { useAppSelector } from '../hooks/useRedux';
import { RootStackParamList } from '../types';

interface Props { route: RouteProp<RootStackParamList, 'OrderSuccess'>; }
interface SvgProps { color: string; size?: number; }

function IconCheck({ color, size = 56 }: SvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconBag({ color, size = 18 }: SvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
      <Path d="M3 6H21" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}
function IconHome({ color, size = 18 }: SvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

const STEPS = [
  { label: 'Confirmado', emoji: '✅' },
  { label: 'Preparando', emoji: '👨‍🍳' },
  { label: 'En camino',  emoji: '🛵' },
  { label: 'Entregado',  emoji: '🏠' },
];

export default function OrderSuccessScreen({ route }: Props) {
  const { orderId, total } = route.params;
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const accentColor = useAppSelector((s) => s.ui.accentColor ?? '#E85D26');

  const ringScale   = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const checkScale  = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const stepsAnim   = useRef(new Animated.Value(0)).current;
  const glowAnim    = useRef(new Animated.Value(0)).current;
  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(ringScale,   { toValue: 1, tension: 60, friction: 8,  useNativeDriver: true }),
        Animated.timing(ringOpacity, { toValue: 1, duration: 300,             useNativeDriver: true }),
        Animated.timing(glowAnim,    { toValue: 1, duration: 600,             useNativeDriver: false }),
      ]),
      Animated.spring(checkScale,  { toValue: 1, tension: 80, friction: 6,  useNativeDriver: true }),
      Animated.spring(contentAnim, { toValue: 1, tension: 55, friction: 10, useNativeDriver: true }),
      Animated.spring(stepsAnim,   { toValue: 1, tension: 55, friction: 10, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    ).start();

    const timers = [
      setTimeout(() => setActiveStep(1), 1200),
      setTimeout(() => setActiveStep(2), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.08] });
  const glowSize    = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 340] });
  const orderNumber = `#${orderId.slice(-5).toUpperCase()}`;

  const goToOrders = () => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: 'Main', state: { routes: [{ name: 'Home' }, { name: 'Categories' }, { name: 'Cart' }, { name: 'Orders' }, { name: 'Profile' }], index: 3 } }],
    }));
  };

  const goToHome = () => {
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.bgGlow, { backgroundColor: accentColor, width: glowSize, height: glowSize, borderRadius: 999, opacity: glowOpacity }]} />
      <View style={[styles.bgGlow2, { backgroundColor: accentColor }]} />

      <Animated.View style={[styles.ringWrap, { transform: [{ scale: Animated.multiply(ringScale, pulseAnim) }], opacity: ringOpacity }]}>
        <View style={[styles.ringOuter, { borderColor: `${accentColor}30`, shadowColor: accentColor }]} />
        <View style={[styles.ring, { borderColor: accentColor, backgroundColor: `${accentColor}15` }]}>
          <Animated.View style={{ transform: [{ scale: checkScale }] }}>
            <IconCheck color={accentColor} size={56} />
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: contentAnim, transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
        <Text style={styles.title}>¡Pedido confirmado!</Text>
        <Text style={styles.subtitle}>Tu pedido está en preparación 🍞</Text>

        <View style={[styles.summaryCard, { borderColor: `${accentColor}25` }]}>
          <View style={[styles.summaryGlow, { backgroundColor: accentColor }]} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>N° de pedido</Text>
            <Text style={[styles.summaryValue, { color: accentColor }]}>{orderNumber}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total pagado</Text>
            <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tiempo estimado</Text>
            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>⏱ 25–35 min</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.stepsWrap, { opacity: stepsAnim, transform: [{ translateY: stepsAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
        {STEPS.map((step, i) => {
          const isDone   = i < activeStep;
          const isActive = i === activeStep;
          return (
            <View key={step.label} style={styles.stepItem}>
              <View style={[
                styles.stepDot,
                isDone   && { backgroundColor: accentColor, borderColor: accentColor },
                isActive && { borderColor: accentColor, backgroundColor: `${accentColor}20` },
                !isDone && !isActive && { borderColor: 'rgba(255,255,255,0.15)' },
              ]}>
                {isDone
                  ? <Text style={styles.stepDotCheck}>✓</Text>
                  : <Text style={[styles.stepEmoji, { opacity: isActive ? 1 : 0.3 }]}>{step.emoji}</Text>
                }
              </View>
              <Text style={[
                styles.stepLabel,
                isDone   && { color: accentColor, fontWeight: '700' },
                isActive && { color: '#FFFFFF',   fontWeight: '800' },
                !isDone && !isActive && { color: 'rgba(255,255,255,0.25)' },
              ]}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </Animated.View>

      <Animated.View style={[styles.btnWrap, { opacity: stepsAnim, transform: [{ translateY: stepsAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
        <Pressable style={({ pressed }) => [styles.btnPrimary, { backgroundColor: accentColor, shadowColor: accentColor }, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]} onPress={goToOrders}>
          <IconBag color="#FFFFFF" size={18} />
          <Text style={styles.btnPrimaryText}>Ver mis pedidos</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.7 }]} onPress={goToHome}>
          <IconHome color="rgba(255,255,255,0.6)" size={16} />
          <Text style={styles.btnSecondaryText}>Seguir comprando</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#0A0A0F', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  bgGlow:          { position: 'absolute', top: -80, alignSelf: 'center' },
  bgGlow2:         { position: 'absolute', width: 200, height: 200, borderRadius: 100, opacity: 0.04, bottom: 80, right: -60 },
  ringWrap:        { alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  ringOuter:       { position: 'absolute', width: 148, height: 148, borderRadius: 74, borderWidth: 1, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 24, elevation: 16 },
  ring:            { width: 120, height: 120, borderRadius: 60, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  content:         { width: '100%', alignItems: 'center', marginBottom: 24 },
  title:           { fontSize: 26, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 6, textAlign: 'center' },
  subtitle:        { fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 20, textAlign: 'center' },
  summaryCard:     { width: '100%', borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, padding: 20, overflow: 'hidden' },
  summaryGlow:     { position: 'absolute', width: 180, height: 100, borderRadius: 90, opacity: 0.06, top: -30, left: -20 },
  summaryRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  summaryDivider:  { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 10 },
  summaryLabel:    { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  summaryValue:    { fontSize: 18, fontWeight: '900' },
  summaryTotal:    { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  timeBadge:       { backgroundColor: 'rgba(16,185,129,0.15)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  timeBadgeText:   { fontSize: 12, fontWeight: '700', color: '#10B981' },
  stepsWrap:       { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  stepItem:        { alignItems: 'center', flex: 1, gap: 6 },
  stepDot:         { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  stepDotCheck:    { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
  stepEmoji:       { fontSize: 16 },
  stepLabel:       { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  btnWrap:         { width: '100%', gap: 12 },
  btnPrimary:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 18, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 14, elevation: 8 },
  btnPrimaryText:  { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  btnSecondary:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  btnSecondaryText:{ color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '600' },
});