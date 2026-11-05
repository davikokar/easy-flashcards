import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnswerIcon } from './AnswerIcons';
import { CARD_STATUS_LABELS } from './CardStatusChips';
import MasteryTrack, { ANSWER_SEGMENTS } from './MasteryTrack';
import RichText from './RichText';
import type { Card, CardStatus } from '../types';
import { htmlToPlainText } from '../utils/html';
import {
  answerShares,
  cardReviewCount,
  cardStatus,
  formatDate,
  formatRate,
  formatShortDate,
  successRate,
} from '../utils/stats';
import { colors, radius, spacing } from '../theme';

type Props = {
  card: Card;
  /** When the card was last answered, from the answer log; null when it has no recorded answer. */
  lastAnsweredAt: number | null;
};

const BADGE_ICON_SIZE = 12;
const FOOTER_ICON_SIZE = 12;
// Below this much room the badge drops under the question, which then takes the whole line.
const QUESTION_MIN_WIDTH = 160;

const BADGES: Record<CardStatus, { icon: 'tick' | 'question' | 'cross' | null; color: string | null }> = {
  mastered: { icon: 'tick', color: colors.success },
  learning: { icon: 'question', color: colors.warning },
  needsReview: { icon: 'cross', color: colors.danger },
  new: { icon: null, color: null },
};

function CardStatsRow({ card, lastAnsweredAt }: Props) {
  const reviews = cardReviewCount(card);
  const rate = successRate(card.okCount, card.okeishCount, card.notOkCount);
  const shares = answerShares({
    okCount: card.okCount,
    okeishCount: card.okeishCount,
    notOkCount: card.notOkCount,
  });
  const status = cardStatus(card);

  const question = useMemo(() => htmlToPlainText(card.question), [card.question]);
  const answer = useMemo(() => htmlToPlainText(card.answer), [card.answer]);

  const reviewsText = `${reviews} ${reviews === 1 ? 'review' : 'reviews'}`;
  const reviewedShort = lastAnsweredAt === null ? null : formatShortDate(lastAnsweredAt);
  const footerText =
    reviews === 0
      ? 'Never reviewed'
      : reviewedShort === null
      ? reviewsText
      : `${reviewsText} · Reviewed ${reviewedShort}`;

  const statusLabel = CARD_STATUS_LABELS[status];
  const spoken =
    reviews === 0
      ? `${statusLabel}. Never reviewed.`
      : `${statusLabel}, success rate ${formatRate(rate)}. ${reviewsText}: ${card.okCount} ok, ${
          card.okeishCount
        } okeish, ${card.notOkCount} not ok.${
          lastAnsweredAt === null ? '' : ` Reviewed ${formatDate(lastAnsweredAt)}.`
        }`;

  return (
    <View
      accessible
      accessibilityLabel={`Question: ${question}. Answer: ${answer}. ${spoken}`}
      style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.question}>
          <RichText html={card.question} style={styles.questionText} numberOfLines={2} />
        </View>
        <StatusBadge status={status} />
      </View>

      <RichText html={card.answer} style={styles.answerText} numberOfLines={2} />

      <MasteryTrack shares={shares} height={8} />

      <View style={styles.footer}>
        <View style={styles.shares}>
          {ANSWER_SEGMENTS.map(segment => (
            <View key={segment.key} style={styles.share}>
              <AnswerIcon
                name={segment.icon}
                color={shares ? segment.color : colors.textDim}
                size={FOOTER_ICON_SIZE}
              />
              <Text maxFontSizeMultiplier={1.3} style={styles.sharePercent}>
                {formatRate(shares ? shares[segment.key] : null)}
              </Text>
            </View>
          ))}
        </View>
        <Text maxFontSizeMultiplier={1.3} style={styles.footerText}>
          {footerText}
        </Text>
      </View>
    </View>
  );
}

// The row's label says the status, so the badge itself is hidden from accessibility.
function StatusBadge({ status }: { status: CardStatus }) {
  const { icon, color } = BADGES[status];
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.badge,
        color !== null && { backgroundColor: `${color}26`, borderColor: `${color}4d` },
      ]}>
      {icon !== null && color !== null ? (
        <AnswerIcon name={icon} color={color} size={BADGE_ICON_SIZE} />
      ) : null}
      <Text
        maxFontSizeMultiplier={1.3}
        numberOfLines={1}
        style={[styles.badgeText, color !== null && { color }]}>
        {CARD_STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

export default memo(CardStatsRow);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    columnGap: spacing.sm,
    rowGap: spacing.sm,
  },
  // Grows to fill the line; wraps the badge down when less than the basis would remain.
  question: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: QUESTION_MIN_WIDTH,
  },
  questionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  answerText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  badge: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  badgeText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: spacing.md,
    rowGap: spacing.xs,
  },
  shares: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  share: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sharePercent: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  footerText: {
    flexShrink: 1,
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'right',
  },
});
