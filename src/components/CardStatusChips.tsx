import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CardStatus } from '../types';
import { colors, radius, spacing } from '../theme';

export type CardStatusFilter = 'all' | CardStatus;

export const CARD_STATUS_LABELS: Record<CardStatus, string> = {
  needsReview: 'Needs review',
  learning: 'Learning',
  mastered: 'Mastered',
  new: 'New',
};

const OPTIONS: { value: CardStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'needsReview', label: CARD_STATUS_LABELS.needsReview },
  { value: 'learning', label: CARD_STATUS_LABELS.learning },
  { value: 'mastered', label: CARD_STATUS_LABELS.mastered },
  { value: 'new', label: CARD_STATUS_LABELS.new },
];

type Props = {
  value: CardStatusFilter;
  /** Cards per status across the whole deck; the search does not narrow them. */
  counts: Record<CardStatus, number>;
  /** Every card in the deck, for the `All` chip. */
  total: number;
  onChange: (value: CardStatusFilter) => void;
};

const plural = (n: number) => `${n} ${n === 1 ? 'card' : 'cards'}`;

export default function CardStatusChips({ value, counts, total, onChange }: Props) {
  return (
    // importantForAccessibility keeps the label's node in the tree; a bare container can be pruned.
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Card status"
      importantForAccessibility="yes"
      style={styles.row}>
      {OPTIONS.map(({ value: option, label }) => {
        const selected = option === value;
        const count = option === 'all' ? total : counts[option];
        return (
          // The Pressable is the 48-point touch target; the pill inside it is the visible chip.
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityLabel={`${label}, ${plural(count)}`}
            accessibilityState={{ checked: selected, selected }}
            onPress={() => onChange(option)}
            style={styles.target}>
            {({ pressed }) => (
              <View
                style={[styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}>
                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  style={[styles.label, selected && styles.labelSelected]}>
                  {`${label} (${count})`}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Wraps rather than scrolls, so every option stays visible at a large font scale.
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.sm,
  },
  target: {
    minHeight: 48,
    justifyContent: 'center',
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.background,
  },
});
