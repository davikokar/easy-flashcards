import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppMenu from './AppMenu';
import MenuIcon from './MenuIcons';
import type { MenuItem } from './MenuSheet';
import { colors, radius, spacing } from '../theme';

type Props = {
  onSearch: () => void;
  searchLabel: string;
  /** True while the Search bar is open; tints the Search button and sets it expanded. */
  searchActive?: boolean;
  /** The Filter button is rendered only when both of these are given. */
  onFilter?: () => void;
  filterLabel?: string;
  /** Passed to the App menu as its extra items. */
  menuItems?: MenuItem[];
};

export default function HeaderToolbar({
  onSearch,
  searchLabel,
  searchActive = false,
  onFilter,
  filterLabel,
  menuItems,
}: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={searchLabel}
        accessibilityState={{ expanded: searchActive }}
        hitSlop={6}
        onPress={onSearch}
        style={({ pressed }) => [
          styles.button,
          searchActive && styles.buttonActive,
          pressed && styles.pressed,
        ]}>
        <MenuIcon name="search" color={searchActive ? colors.primary : colors.textMuted} />
      </Pressable>
      {onFilter && filterLabel ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={filterLabel}
          hitSlop={6}
          onPress={onFilter}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <MenuIcon name="filter" color={colors.textMuted} />
        </Pressable>
      ) : null}
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
  buttonActive: {
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.5,
  },
});
