import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useT } from '../i18n/I18nProvider';
import type { CardStatus } from '../types';
import { colors, radius, spacing } from '../theme';

export type CardStatusFilter = 'all' | CardStatus;

const OPTIONS: CardStatusFilter[] = ['all', 'needsReview', 'learning', 'mastered', 'new'];

type Props = {
  value: CardStatusFilter;
  /** Cards per status across the whole deck; the search does not narrow them. */
  counts: Record<CardStatus, number>;
  /** Every card in the deck, for the `All` chip. */
  total: number;
  onChange: (value: CardStatusFilter) => void;
};

export default function CardStatusChips({ value, counts, total, onChange }: Props) {
  const t = useT();
  return (
    // importantForAccessibility keeps the label's node in the tree; a bare container can be pruned.
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={t('deckStats.cardStatusChips.groupA11yLabel')}
      importantForAccessibility="yes"
      style={styles.row}>
      {OPTIONS.map(option => {
        const selected = option === value;
        const count = option === 'all' ? total : counts[option];
        const label =
          option === 'all'
            ? t('deckStats.cardStatusChips.allChip')
            : t(`answers.cardStatus.${option}`);
        return (
          // The Pressable is the 48-point touch target; the pill inside it is the visible chip.
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityLabel={t('deckStats.cardStatusChips.chipA11yLabel', { label, count })}
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
                  {t('deckStats.cardStatusChips.chipLabel', { label, count })}
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
