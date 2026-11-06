import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import CategorySquare from './CategorySquare';
import { useT } from '../i18n/I18nProvider';
import type { Category } from '../types';
import { categoryDisplayName } from '../utils/categories';
import { colors, radius, spacing } from '../theme';

type Props = {
  category: Category | null;
  /** Opens the Category picker. */
  onPress: () => void;
};

export default function CategoryField({ category, onPress }: Props) {
  const t = useT();
  const categoryName = category ? categoryDisplayName(category, t) : null;
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{t('editDeck.categoryField.label')}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          categoryName !== null
            ? t('editDeck.categoryField.a11yLabel', { name: categoryName })
            : t('editDeck.categoryField.a11yLabelNone')
        }
        accessibilityHint={t('editDeck.categoryField.a11yHint')}
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        {category ? <CategorySquare category={category} /> : null}
        <Text style={[styles.value, !category && styles.valueNone]} numberOfLines={1}>
          {categoryName ?? t('editDeck.categoryField.noneValue')}
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
