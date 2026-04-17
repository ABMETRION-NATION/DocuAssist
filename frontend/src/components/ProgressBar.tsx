import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

interface Props {
  current: number; // 1-indexed
  total: number;
  label?: string;
}

export const ProgressBar: React.FC<Props> = ({ current, total, label }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const pct = Math.max(0, Math.min(1, current / total));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: pct,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [pct, progress]);

  const widthInterp = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.step}>Step {current} of {total}</Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: widthInterp }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  step: {
    color: colors.accent.gold,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  label: {
    color: colors.text.tertiary,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  track: {
    height: 3,
    backgroundColor: colors.border.subtle,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: 3,
    backgroundColor: colors.accent.gold,
  },
});
