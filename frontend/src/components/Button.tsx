import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts, radii } from '../constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  testID?: string;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<Props> = ({
  label, onPress, variant = 'primary', disabled, loading, icon, testID, style, fullWidth,
}) => {
  const bg = variant === 'primary'
    ? colors.accent.gold
    : variant === 'secondary'
      ? colors.bg.secondary
      : 'transparent';
  const color = variant === 'primary' ? colors.text.inverse : variant === 'ghost' ? colors.accent.gold : colors.text.primary;
  const border = variant === 'secondary' ? colors.border.default : 'transparent';

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, borderColor: border, borderWidth: variant === 'secondary' ? 1 : 0 },
        fullWidth && { alignSelf: 'stretch' },
        pressed && !disabled && { opacity: 0.85 },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator color={color} />
        ) : (
          <>
            {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
            <Text style={[styles.label, { color }]}>{label}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: { flexDirection: 'row', alignItems: 'center' },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
