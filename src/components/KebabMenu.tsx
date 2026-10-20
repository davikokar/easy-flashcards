import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MenuSheet, { MenuItem } from './MenuSheet';
import { colors } from '../theme';

type Props = {
  items: MenuItem[];
  title?: string;
  accessibilityLabel?: string;
};

export default function KebabMenu({ items, title, accessibilityLabel = 'More options' }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={10}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </Pressable>

      <MenuSheet visible={isOpen} items={items} title={title} onClose={() => setIsOpen(false)} />
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
