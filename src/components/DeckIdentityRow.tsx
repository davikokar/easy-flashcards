import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CategorySquare from './CategorySquare';
import type { Category } from '../types';
import { colors, radius, spacing } from '../theme';

type Props = {
  cardCount: number;
  /** Already resolved by the screen. No pill, and no gap, when null. */
  category: Category | null;
};

const CATEGORY_SQUARE_SIZE = 24;

export default function DeckIdentityRow({ cardCount, category }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.pill}>
        <Text maxFontSizeMultiplier={1.3} style={styles.text}>
          {cardCount} {cardCount === 1 ? 'card' : 'cards'}
        </Text>
      </View>
      {category ? (
        <View
          accessible
          accessibilityLabel={`Category: ${category.name}`}
          style={[styles.pill, styles.categoryPill]}>
          <CategorySquare category={category} size={CATEGORY_SQUARE_SIZE} />
          <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={[styles.text, styles.name]}>
            {category.name}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pill: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
    paddingHorizontal: spacing.sm + spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  // The square sits flush to the pill's left edge, inside its border.
  categoryPill: {
    gap: spacing.sm,
    paddingLeft: spacing.xs,
  },
  text: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    flexShrink: 1,
  },
});
