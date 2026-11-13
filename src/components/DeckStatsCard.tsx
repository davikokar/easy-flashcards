import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import CategorySquare from './CategorySquare';
import MasteryBar from './MasteryBar';
import { useTitleToggle } from './useTitleToggle';
import { useT } from '../i18n/I18nProvider';
import type { AnswerShares, Category } from '../types';
import { describeAnswerShares, formatDate } from '../utils/stats';
import { colors, radius, spacing } from '../theme';

type Props = {
  name: string;
  /** `''` when the deck has none: nothing is drawn and no space is taken. */
  description: string;
  /** Already resolved by the screen. Nothing, and no gap, when null. */
  category: Category | null;
  cardCount: number;
  reviewCount: number;
  /** Percentages of all reviews, or null when nothing has been reviewed. */
  shares: AnswerShares | null;
  sessionCount: number;
  /** Start time of the deck's latest session, or null when it has none. */
  lastSessionAt: number | null;
  /** Opens the Deck statistics screen. */
  onPress: () => void;
};

const LABEL_LINE_HEIGHT = 14;
const VALUE_LINE_HEIGHT = 18;

export default function DeckStatsCard({
  name,
  description,
  category,
  cardCount,
  reviewCount,
  shares,
  sessionCount,
  lastSessionAt,
  onPress,
}: Props) {
  const t = useT();
  const title = useTitleToggle();
  const last = formatDate(lastSessionAt, t);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('stats.deckStatsCard.summaryA11yLabel', {
        name,
        shares: describeAnswerShares(shares, t),
        cards: t('common.counts.cards', { count: cardCount }),
        sessions: t('common.counts.sessions', { count: sessionCount }),
        reviews: t('common.counts.reviews', { count: reviewCount }),
        last,
      })}
      accessibilityHint={t('stats.deckStatsCard.openA11yHint')}
      accessibilityActions={title.accessibilityActions}
      onAccessibilityAction={title.onAccessibilityAction}
      onPress={onPress}
      onLongPress={title.onLongPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        {category ? <CategorySquare category={category} /> : null}
        <View style={styles.title}>
          <Text style={styles.name} numberOfLines={title.expanded ? undefined : 1}>
            {name}
          </Text>
          {description !== '' ? (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          ) : null}
        </View>
        <View style={styles.chevron} />
      </View>

      <MasteryBar shares={shares} />

      <View style={styles.grid}>
        <Stat label={t('stats.deckStatsCard.cardsLabel')} value={String(cardCount)} />
        <Stat label={t('stats.deckStatsCard.sessionsLabel')} value={String(sessionCount)} />
        <Stat label={t('stats.deckStatsCard.reviewsLabel')} value={String(reviewCount)} />
        <Stat label={t('stats.deckStatsCard.lastLabel')} value={last} wide />
      </View>
    </Pressable>
  );
}

const MAX_FONT_SCALE = 1.5;

// Text shrinks rather than truncates, so a date or label is never cut at a large font scale.
// Android sizes a shrunk Text to its smaller font, so each line sits in a box of the unshrunk
// height and is centred: every column then lines up whether or not its text shrank.
function Stat({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  const { fontScale } = useWindowDimensions();
  const scale = Math.min(fontScale, MAX_FONT_SCALE);
  return (
    <View style={[styles.stat, wide && styles.statWide]}>
      <View style={[styles.line, { height: Math.ceil(LABEL_LINE_HEIGHT * scale) }]}>
        <Text
          style={styles.statLabel}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {label}
        </Text>
      </View>
      <View style={[styles.line, { height: Math.ceil(VALUE_LINE_HEIGHT * scale) }]}>
        <Text
          style={styles.statValue}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {value}
        </Text>
      </View>
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
  pressed: {
    opacity: 0.75,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
  },
  // A right-pointing chevron: two borders of a square, turned 45 degrees (as in CategoryField).
  chevron: {
    width: 9,
    height: 9,
    marginRight: 3,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.textMuted,
    transform: [{ rotate: '-45deg' }],
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  // The date is the widest figure: about 10 characters against a count's 1-4.
  statWide: {
    flex: 1.4,
  },
  line: {
    justifyContent: 'center',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: LABEL_LINE_HEIGHT,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  statValue: {
    color: colors.text,
    fontSize: 14,
    lineHeight: VALUE_LINE_HEIGHT,
    fontWeight: '600',
    textAlign: 'center',
  },
});
