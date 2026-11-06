import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnswerIcon } from './AnswerIcons';
import MasteryTrack, { ANSWER_SEGMENTS } from './MasteryTrack';
import { useT } from '../i18n/I18nProvider';
import type { AnswerShares, AnswerTally } from '../types';
import { formatRate, formatShortDate } from '../utils/stats';
import { colors, radius, spacing } from '../theme';

type Props = {
  /** Ok-only success rate (0-100), or null when the deck has no reviews. */
  successRate: number | null;
  /** Points the rate moved since the last session; null hides the Mastery change chip. */
  rateChange: number | null;
  /** Percentages of all reviews, or null when nothing has been reviewed. */
  shares: AnswerShares | null;
  tally: AnswerTally;
  reviewCount: number;
  /** Every session of the deck, cleared and active ones included. */
  sessionCount: number;
  /** Start time of the deck's latest session, or null when it has none. */
  lastSessionAt: number | null;
};

const TILE_ICON_SIZE = 20;
const TALLY_KEYS = { ok: 'okCount', okeish: 'okeishCount', notOk: 'notOkCount' } as const;

export default function DeckMasteryCard({
  successRate,
  rateChange,
  shares,
  tally,
  reviewCount,
  sessionCount,
  lastSessionAt,
}: Props) {
  const t = useT();
  const rate = formatRate(successRate);

  return (
    <View style={styles.card}>
      <View style={styles.headlineRow}>
        <View
          accessible
          accessibilityLabel={
            successRate === null
              ? t('deckStats.deckMasteryCard.successRateNoReviewsA11yLabel')
              : t('deckStats.deckMasteryCard.successRateA11yLabel', { rate })
          }
          style={styles.headline}>
          <Text maxFontSizeMultiplier={1.3} style={styles.rate}>
            {rate}
          </Text>
          <Text maxFontSizeMultiplier={1.3} style={styles.caption}>
            {t('deckStats.deckMasteryCard.successRateCaption')}
          </Text>
        </View>
        {rateChange === null ? null : <ChangeChip change={rateChange} />}
      </View>

      <MasteryTrack shares={shares} height={10} />

      <View style={styles.tiles}>
        {ANSWER_SEGMENTS.map(segment => {
          const count = tally[TALLY_KEYS[segment.key]];
          const percent = formatRate(shares ? shares[segment.key] : null);
          return (
            <View
              key={segment.key}
              accessible
              accessibilityLabel={
                shares
                  ? t(`deckStats.deckMasteryCard.answerTile.${segment.key}`, { count, percent })
                  : t(`deckStats.deckMasteryCard.answerTileNoReviews.${segment.key}`, { count })
              }
              style={styles.tile}>
              <AnswerIcon
                name={segment.icon}
                color={shares ? segment.color : colors.textDim}
                size={TILE_ICON_SIZE}
              />
              <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={styles.count}>
                {count}
              </Text>
              <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={styles.percent}>
                {percent}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.ribbon}>
        <Figure label={t('deckStats.deckMasteryCard.reviewsFigure')} value={String(reviewCount)} />
        <Figure label={t('deckStats.deckMasteryCard.sessionsFigure')} value={String(sessionCount)} />
        <Figure
          label={t('deckStats.deckMasteryCard.lastSessionFigure')}
          value={formatShortDate(lastSessionAt, t)}
          wide
        />
      </View>
    </View>
  );
}

function ChangeChip({ change }: { change: number }) {
  const t = useT();
  const points = Math.round(Math.abs(change));
  const direction = points === 0 ? 'none' : change > 0 ? 'up' : 'down';
  const text =
    direction === 'none'
      ? t('deckStats.deckMasteryCard.changeChip.none')
      : t(`deckStats.deckMasteryCard.changeChip.${direction}`, { points });
  const spoken =
    direction === 'none'
      ? t('deckStats.deckMasteryCard.changeChip.noneA11yLabel')
      : t(`deckStats.deckMasteryCard.changeChip.${direction}A11yLabel`, { count: points });
  const tint = direction === 'up' ? colors.success : direction === 'down' ? colors.danger : null;

  return (
    <View
      accessible
      accessibilityLabel={spoken}
      style={[
        styles.chip,
        tint !== null && { backgroundColor: `${tint}26`, borderColor: `${tint}4d` },
      ]}>
      <Text
        maxFontSizeMultiplier={1.3}
        style={[styles.chipText, tint !== null && { color: tint }]}>
        {text}
      </Text>
    </View>
  );
}

function Figure({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  const t = useT();
  return (
    <View
      accessible
      accessibilityLabel={t('deckStats.deckMasteryCard.figureA11yLabel', { label, value })}
      style={[styles.figure, wide && styles.figureWide]}>
      <Text maxFontSizeMultiplier={1.3} style={styles.figureLabel}>
        {label}
      </Text>
      <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={styles.figureValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  headlineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: spacing.md,
    rowGap: spacing.sm,
  },
  headline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    columnGap: spacing.sm,
  },
  rate: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
  },
  caption: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  tiles: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm + spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  count: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  percent: {
    color: colors.textMuted,
    fontSize: 12,
  },
  ribbon: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  // Columns stretch to the tallest label, so space-between keeps every value on one line.
  // A column is as wide as its label on one line and never shrinks below it, so a word cannot
  // break mid-word; only the wide column gives way, wrapping between words.
  figure: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
  },
  figureWide: {
    flexGrow: 1.4,
    flexShrink: 1,
  },
  figureLabel: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  figureValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
