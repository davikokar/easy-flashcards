import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing } from '../theme';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';

// Receives the foreground colour that is legible on the variant's background.
type IconRenderer = (color: string) => React.ReactNode;

type Props = {
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
} & (
  | { label: string; accessibilityLabel?: string; icon?: IconRenderer }
  // Icon-only: no visible text, so the accessible name is mandatory.
  | { label?: undefined; accessibilityLabel: string; icon: IconRenderer }
);

const VARIANT_COLORS: Record<Variant, string> = {
  primary: colors.primary,
  secondary: colors.surfaceAlt,
  success: colors.success,
  danger: colors.danger,
  warning: colors.warning,
};

const FOREGROUND_ON_FILL = '#0c1118';

export default function Button({
  label,
  accessibilityLabel,
  icon,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: Props) {
  const isInactive = disabled || loading;
  const foreground = variant === 'secondary' ? colors.text : FOREGROUND_ON_FILL;
  const isIconOnly = label === undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isInactive }}
      disabled={isInactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isIconOnly && styles.iconOnly,
        { backgroundColor: VARIANT_COLORS[variant] },
        pressed && styles.pressed,
        isInactive && styles.disabled,
        style,
      ]}>
      <View style={styles.content}>
        {loading ? <ActivityIndicator color={colors.text} size="small" /> : null}
        {icon && !(loading && isIconOnly) ? icon(foreground) : null}
        {label !== undefined ? (
          <Text
            style={[styles.label, variant === 'secondary' ? styles.labelSecondary : styles.labelDark]}>
            {label}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOnly: {
    minWidth: 48,
    minHeight: 48,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  labelDark: {
    color: FOREGROUND_ON_FILL,
  },
  labelSecondary: {
    color: colors.text,
  },
});
