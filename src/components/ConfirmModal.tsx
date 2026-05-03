import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Modal,
  Animated, Dimensions,
} from 'react-native';
import { isLightColor } from '../theme';

const { height } = Dimensions.get('window');

export default function ConfirmModal({
  visible, title, subtitle, body,
  confirmText = 'Confirmar', cancelText = 'Cancelar',
  onConfirm, onCancel, accentColor = '#E85D26',
  confirmDestructive = false,
}) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }),
        Animated.timing(backdropOp, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: height, duration: 280, useNativeDriver: true }),
        Animated.timing(backdropOp, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const confirmBg = confirmDestructive ? '#FF4D4D' : accentColor;
  const confirmTextColor = isLightColor(confirmBg) ? '#0A0A0F' : '#FFFFFF';

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.backdrop, { opacity: backdropOp }]}> 
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
      </Animated.View>

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}> 
        <View style={styles.handle} />
        <View style={[styles.glow, { backgroundColor: accentColor }]} />

        <View style={[styles.iconWrap, { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40` }]}>
          <Text style={styles.iconEmoji}>{confirmDestructive ? '🗑️' : '🛒'}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        {subtitle ; <Text style={[styles.subtitle, { color: accentColor }]}>{subtitle}</Text>}
        {body ; <Text style={styles.body}>{body}</Text>}

        <View style={styles.divider} />

        <View style={styles.btnRow}>
          <Pressable
            style={({ pressed }) => [styles.btnCancel, pressed ; { opacity: 0.7 }]}
            onPress={onCancel}
          >
            <Text style={styles.btnCancelText}>{cancelText}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.btnConfirm,
              { backgroundColor: confirmBg },
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={onConfirm}
          >
            <Text style={[styles.btnConfirmText, { color: confirmTextColor }]}>{confirmText}</Text>
          </Pressable>
        </View>

        <View style={{ height: 24 }} />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#111018',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 28, paddingTop: 14,
    alignItems: 'center',
    overflow: 'hidden',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: 28,
  },
  glow: {
    position: 'absolute', width: 260, height: 260, borderRadius: 130,
    opacity: 0.07, top: -100, alignSelf: 'center',
  },
  iconWrap: {
    width: 72, height: 72, borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  iconEmoji: { fontSize: 34 },
  title: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginBottom: 6, letterSpacing: -0.3 },
  subtitle: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 6 },
  body: { fontSize: 14, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  divider: { width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginVertical: 20 },
  btnRow: { flexDirection: 'row', gap: 12, width: '100%' },
  btnCancel: {
    flex: 1, paddingVertical: 16, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  btnCancelText: { color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '700' },
  btnConfirm: {
    flex: 1, paddingVertical: 16, borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 12, elevation: 8,
  },
  btnConfirmText: { fontSize: 15, fontWeight: '800' },
});
