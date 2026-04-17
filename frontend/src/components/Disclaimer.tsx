import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Shield } from 'lucide-react-native';
import { colors, fonts, radii, spacing } from '../constants/theme';

export const Disclaimer: React.FC<{ compact?: boolean }> = ({ compact }) => {
  return (
    <View style={[styles.wrap, compact && styles.compact]} testID="legal-disclaimer">
      <Shield size={14} color={colors.accent.gold} strokeWidth={1.6} />
      <Text style={styles.text}>
        This app provides general document assistance and is not legal advice.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: colors.accent.goldSoft,
    borderWidth: 1,
    borderColor: 'rgba(197, 168, 128, 0.25)',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  compact: {
    padding: 10,
  },
  text: {
    flex: 1,
    color: colors.text.secondary,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
  },
});
