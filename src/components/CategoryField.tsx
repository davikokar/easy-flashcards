import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import CategorySquare from './CategorySquare';
import type { Category } from '../types';
import { colors, radius, spacing } from '../theme';

type Props = {
  category: Category | null;
  /** Opens the Category picker. */
  onPress: () => void;
};

export default function CategoryField({ category, onPress }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Category</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Category: ${category ? category.name : 'none'}`}
        accessibilityHint="Opens the category picker"
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        {category ? <CategorySquare category={category} /> : null}
        <Text style={[styles.value, !category && styles.valueNone]} numberOfLines={1}>
          {category ? category.name : 'No category'}
        </Text>
        <View style={styles.chevron} />
      </Pressable>
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
  // Sized and coloured like the text inputs of FormField, so the form reads as one set of fields.
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  pressed: {
    opacity: 0.75,
  },
  value: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  valueNone: {
    color: colors.textDim,
  },
  // A right-pointing chevron: two borders of a square, turned 45 degrees.
  chevron: {
    width: 9,
    height: 9,
    marginRight: 3,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.textMuted,
    transform: [{ rotate: '-45deg' }],
  },
});
