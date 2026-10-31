import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import CategoryIcon from './CategoryIcon';
import type { CategoryIcon as CategoryIconKey } from '../types';
import { CATEGORY_ICONS, getCategoryIconLabel } from '../utils/categories';
import { colors, radius, spacing } from '../theme';

type Props = {
  value: CategoryIconKey;
  onChange: (icon: CategoryIconKey) => void;
};

const COLUMNS = 6;
const CELL_WIDTH = `${100 / COLUMNS}%` as const;

export default function CategoryIconPicker({ value, onChange }: Props) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="Icon picker" style={styles.panel}>
      {CATEGORY_ICONS.map(icon => {
        const selected = icon === value;
        return (
          <View key={icon} style={styles.cell}>
            <Pressable
              accessibilityRole="radio"
              accessibilityLabel={getCategoryIconLabel(icon)}
              accessibilityState={{ selected }}
              onPress={() => onChange(icon)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                pressed && styles.pressed,
              ]}>
              <CategoryIcon
                name={icon}
                color={selected ? colors.text : colors.textMuted}
                size={28}
              />
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cell: {
    width: CELL_WIDTH,
    alignItems: 'center',
    paddingVertical: 2,
  },
  // Always bordered, so selecting one does not move it.
  option: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  pressed: {
    opacity: 0.75,
  },
});
