import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppMenu from './AppMenu';
import MenuIcon from './MenuIcons';
import { colors, radius, spacing } from '../theme';

type Props = {
  onSearch: () => void;
  onFilter: () => void;
};

export default function DecksToolbar({ onSearch, onFilter }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Search decks"
        hitSlop={6}
        onPress={onSearch}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <MenuIcon name="search" color={colors.textMuted} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Filter decks"
        hitSlop={6}
        onPress={onFilter}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <MenuIcon name="filter" color={colors.textMuted} />
      </Pressable>
      <AppMenu variant="boxed" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  button: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.5,
  },
});
