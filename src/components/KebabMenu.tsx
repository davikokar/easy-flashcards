import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export type MenuItem = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

type Props = {
  items: MenuItem[];
  accessibilityLabel?: string;
};

export default function KebabMenu({ items, accessibilityLabel = 'More options' }: Props) {
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

      <Modal
        transparent
        visible={isOpen}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <View style={styles.sheet}>
            {items.map(item => (
              <Pressable
                key={item.label}
                accessibilityRole="button"
                onPress={() => {
                  setIsOpen(false);
                  item.onPress();
                }}
                style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
                <Text style={[styles.itemLabel, item.destructive && styles.itemDestructive]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
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
  backdrop: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
  },
  item: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  itemPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  itemLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  itemDestructive: {
    color: colors.danger,
  },
});
