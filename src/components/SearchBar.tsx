import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Animated, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  resultCount?: number;
}

function IconSearch({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
      <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function IconX({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M6 6L18 18" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

export default function SearchBar({
  value, onChangeText, placeholder = 'Buscar productos...', resultCount,
}: SearchBarProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const borderAnim = useRef(new Animated.Value(0)).current;
  const clearScale = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(borderAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(borderAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: false }).start();
  };

  const handleChangeText = (text: string) => {
    onChangeText(text);
    if (text.length > 0) {
      Animated.spring(clearScale, { toValue: 1, tension: 100, friction: 7, useNativeDriver: true }).start();
    } else {
      Animated.spring(clearScale, { toValue: 0, tension: 100, friction: 7, useNativeDriver: true }).start();
    }
  };

  const handleClear = () => {
    onChangeText('');
    Animated.spring(clearScale, { toValue: 0, tension: 100, friction: 7, useNativeDriver: true }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.08)', theme.primary],
  });

  const iconColor = isFocused ? theme.primary : theme.colors.textMuted;

  return (
    <View>
      <Animated.View style={[
        styles.container,
        { backgroundColor: theme.colors.input, borderColor },
      ]}>
        <View style={styles.iconWrap}>
          <IconSearch color={iconColor} size={18} />
        </View>

        <TextInput
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.input, { color: theme.colors.text }]}
          selectionColor={theme.primary}
          returnKeyType="search"
        />

        <Animated.View style={{ transform: [{ scale: clearScale }] }}>
          <Pressable onPress={handleClear} hitSlop={10} style={styles.clearBtn}>
            <View style={[styles.clearCircle, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
              <IconX color="rgba(255,255,255,0.6)" size={10} />
            </View>
          </Pressable>
        </Animated.View>
      </Animated.View>

      {value.length > 0 && resultCount !== undefined && (
        <Text style={[styles.resultCount, { color: theme.primary }]}>
          {resultCount === 0
            ? 'Sin resultados'
            : `${resultCount} resultado${resultCount !== 1 ? 's' : ''}`
          }
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, borderWidth: 1.5,
    paddingHorizontal: 14, height: 50,
    marginBottom: 4,
  },
  iconWrap:  { marginRight: 10 },
  input:     { flex: 1, fontSize: 15 },
  clearBtn:  { padding: 4 },
  clearCircle: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  resultCount: {
    fontSize: 12, fontWeight: '600',
    paddingHorizontal: 4, marginBottom: 8, marginTop: 2,
  },
});