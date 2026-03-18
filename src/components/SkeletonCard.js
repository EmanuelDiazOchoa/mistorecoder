import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function SkeletonCard() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      
      <View style={styles.image} />

      <View style={styles.info}>
        
        <View style={styles.lineWide} />
        
        <View style={styles.lineNarrow} />
    
        <View style={styles.lineMid} />
      </View>

      
      <View style={styles.btn} />
    </Animated.View>
  );
}

const BG = 'rgba(255,255,255,0.08)';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  image: {
    width: 72, height: 72,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: BG,
  },
  info: { flex: 1, gap: 8 },
  lineWide:   { height: 14, borderRadius: 7, backgroundColor: BG, width: '80%' },
  lineNarrow: { height: 10, borderRadius: 5, backgroundColor: BG, width: '40%' },
  lineMid:    { height: 14, borderRadius: 7, backgroundColor: BG, width: '55%' },
  btn: {
    width: 34, height: 34,
    borderRadius: 17,
    backgroundColor: BG,
  },
});