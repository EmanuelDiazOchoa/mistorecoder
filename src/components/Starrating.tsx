import React, { useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface StarIconProps { filled: boolean; color: string; size?: number; }
function StarIcon({ filled, color, size = 16 }: StarIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={filled ? color : 'transparent'}
        stroke={filled ? color : 'rgba(255,255,255,0.2)'}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function StarDisplay({ rating, count, color, size = 14 }: {
  rating: number; count: number; color: string; size?: number;
}) {
  return (
    <View style={styles.displayRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} filled={s <= Math.round(rating)} color={color} size={size} />
      ))}
      <Text style={[styles.ratingNum, { color }]}>{rating.toFixed(1)}</Text>
      {count > 0 && <Text style={styles.ratingCount}>({count})</Text>}
    </View>
  );
}

interface StarRatingProps {
  productId:   string;
  rating:      number;
  count:       number;
  userRating:  number | null;
  accentColor: string;
  onRate:      (rating: number) => void;
}

export default function StarRating({ rating, count, userRating, accentColor, onRate }: StarRatingProps) {
  const scales = [1, 2, 3, 4, 5].map(() => useRef(new Animated.Value(1)).current);

  const handlePress = (star: number) => {
    scales.slice(0, star).forEach((scale, i) => {
      Animated.sequence([
        Animated.delay(i * 40),
        Animated.spring(scale, { toValue: 1.4, tension: 120, friction: 5, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1,   tension: 60,  friction: 8, useNativeDriver: true }),
      ]).start();
    });
    onRate(star);
  };

  const displayRating = userRating ?? Math.floor(rating);

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => handlePress(star)} hitSlop={8}>
            <Animated.View style={{ transform: [{ scale: scales[star - 1] }] }}>
              <StarIcon
                filled={star <= displayRating}
                color={star <= displayRating ? accentColor : 'rgba(255,255,255,0.15)'}
                size={30}
              />
            </Animated.View>
          </Pressable>
        ))}
      </View>

      <View style={styles.infoRow}>
        {userRating !== null
          ? <Text style={[styles.yourRating, { color: accentColor }]}>Tu valoración: {userRating} ★</Text>
          : <Text style={styles.tapHint}>Tocá para valorar</Text>
        }
        {count > 0 && (
          <Text style={styles.avgText}>
            Promedio: {rating.toFixed(1)} ({count} {count === 1 ? 'voto' : 'votos'})
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { width: '100%' },
  starsRow:    { flexDirection: 'row', gap: 10, marginBottom: 10 },
  infoRow:     { gap: 3 },
  yourRating:  { fontSize: 13, fontWeight: '700' },
  tapHint:     { fontSize: 13, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' },
  avgText:     { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  displayRow:  { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingNum:   { fontSize: 13, fontWeight: '800', marginLeft: 4 },
  ratingCount: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
});