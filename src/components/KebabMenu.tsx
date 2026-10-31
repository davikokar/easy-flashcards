import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MenuSheet, { MenuItem } from './MenuSheet';
import type { Category } from '../types';
import { colors, radius } from '../theme';

type Props = {
  items: MenuItem[];
  title?: string;
  /** Shown before the Menu sheet's title. */
  category?: Category | null;
  accessibilityLabel?: string;
  /** `boxed` is the rounded-square trigger used in the Header toolbar. */
  variant?: 'plain' | 'boxed';
};

export default function KebabMenu({
  items,
  title,
  category,
  accessibilityLabel = 'More options',
  variant = 'plain',
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={variant === 'boxed' ? 6 : 10}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          variant === 'boxed' && styles.boxed,
          pressed && styles.pressed,
        ]}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </Pressable>

      <MenuSheet
        visible={isOpen}
        items={items}
        title={title}
        category={category}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  boxed: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
  },
});
