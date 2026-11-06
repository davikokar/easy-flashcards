import React from 'react';
import { StyleSheet, View } from 'react-native';
import CategoryIcon from './CategoryIcon';
import { useT } from '../i18n/I18nProvider';
import type { Category } from '../types';
import { categoryDisplayName } from '../utils/categories';
import { colors, radius } from '../theme';

type Props = {
  category: Category;
  size?: number;
};

const DEFAULT_SIZE = 32;

// The glyph is ~5/8 of the square, as on the Category tile's larger one.
export default function CategorySquare({ category, size = DEFAULT_SIZE }: Props) {
  const t = useT();
  const glyph = Math.round(size * 0.625);
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={t('categories.categorySquare.a11yLabel', {
        name: categoryDisplayName(category, t),
      })}
      style={[styles.square, { width: size, height: size, backgroundColor: category.color }]}>
      <CategoryIcon name={category.icon} color={colors.background} size={glyph} />
    </View>
  );
}

const styles = StyleSheet.create({
  square: {
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
