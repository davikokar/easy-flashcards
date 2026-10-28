import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppMenu from './AppMenu';
import MenuIcon from './MenuIcons';
import type { MenuItem } from './MenuSheet';
import { colors, radius, spacing } from '../theme';

type Props = {
  onSearch: () => void;
  onFilter: () => void;
  searchLabel: string;
  filterLabel: string;
  /** Passed to the App menu as its extra items. */
  menuItems?: MenuItem[];
};

export default function HeaderToolbar({
  onSearch,
  onFilter,
  searchLabel,
  filterLabel,
  menuItems,
}: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={searchLabel}
        hitSlop={6}
        onPress={onSearch}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <MenuIcon name="search" color={colors.textMuted} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={filterLabel}
        hitSlop={6}
        onPress={onFilter}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <MenuIcon name="filter" color={colors.textMuted} />
      </Pressable>
      <AppMenu variant="boxed" extraItems={menuItems} />
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
