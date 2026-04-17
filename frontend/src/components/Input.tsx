import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

interface Props {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string | null;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numbers-and-punctuation';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  testID?: string;
}

export const Input: React.FC<Props> = ({
  label, value, onChangeText, placeholder, helper, error, multiline, keyboardType = 'default', autoCapitalize, testID,
}) => {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.status.error : focused ? colors.accent.gold : colors.border.default;
  return (
    <View style={styles.wrap} testID={testID}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          { borderBottomColor: borderColor },
          multiline && { minHeight: 88, textAlignVertical: 'top', paddingTop: 10 },
        ]}
      />
      {error ? (
        <Text style={[styles.helper, { color: colors.status.error }]}>{error}</Text>
      ) : helper ? (
        <Text style={styles.helper}>{helper}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  label: {
    color: colors.text.secondary,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    color: colors.text.primary,
    fontFamily: fonts.body,
    fontSize: 16,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  helper: {
    color: colors.text.tertiary,
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 6,
  },
});
