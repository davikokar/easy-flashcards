import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  /** Overrides the visible label as the accessible name, e.g. to say which card a field belongs to. */
  accessibilityLabel?: string;
};

export default function FormField({
  label,
  value,
  onChangeText,
  multiline = false,
  autoFocus = false,
  placeholder,
  accessibilityLabel,
}: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={accessibilityLabel ?? label}
        autoFocus={autoFocus}
        multiline={multiline}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
        selectionColor={colors.primary}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.inputMultiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    fontSize: 16,
  },
  inputMultiline: {
    minHeight: 80,
  },
});
