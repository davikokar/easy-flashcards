import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import MenuIcon, { MenuIconName } from './MenuIcons';
import { colors, spacing } from '../theme';

type Props = {
  label: string;
  icon: MenuIconName;
  onPress: () => void;
  /** Shown after the label, muted: the row's current setting. */
  value?: string;
  /** Shows a spinner at the end of the row and ignores presses. */
  loading?: boolean;
};

export default function SettingsRow({ label, icon, onPress, value, loading = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: loading }}
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <MenuIcon name={icon} color={colors.textMuted} />
      <Text style={styles.label}>{label}</Text>
      {value === undefined ? null : (
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      )}
      {loading ? <ActivityIndicator color={colors.textMuted} size="small" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 56,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    backgroundColor: colors.surfaceAlt,
  },
  label: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  value: {
    flexShrink: 1,
    color: colors.textMuted,
    fontSize: 14,
  },
});
