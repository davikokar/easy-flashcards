import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnswerShares, AnswerTally, Category } from '../types';
import { colors, radius, spacing } from '../theme';
import { AnswerIcon } from './AnswerIcons';
import Button from './Button';
import CategorySquare from './CategorySquare';
import KebabMenu from './KebabMenu';
import MenuIcon from './MenuIcons';
import { MenuItem } from './MenuSheet';
import ReviewErrorsButton from './ReviewErrorsButton';
import SessionResultsBar from './SessionResultsBar';

const renderResumeIcon = (color: string) => <MenuIcon name="resume" color={color} />;
const renderReplayIcon = (color: string) => <MenuIcon name="replay" color={color} />;

type Review = {
  /** Missed or unsure cards still outstanding. */
  count: number;
  /** Everything that needed review is fixed: the button is disabled and shows a tick. */
  done: boolean;
  onPress: () => void;
};

type Props = {
  deckName: string;
  /** Drawn at the top left, before the deck name. Nothing, and no gap, when absent. */
  category?: Category | null;
  isActive: boolean;
  /** Shows the Inverted pill beside the status pill. */
  inverted?: boolean;
  answeredCount: number;
  cardCount: number;
  tally: AnswerTally;
  shares: AnswerShares;
  /** Already formatted, e.g. by `formatDate`. */
  startedLabel: string;
  menuItems: MenuItem[];
  onResume?: () => void;
  onReplay?: () => void;
  /** The error review button is shown only when this is provided. */
  review?: Review;
};

export default function SessionCard({
  deckName,
  category,
  isActive,
  inverted = false,
  answeredCount,
  cardCount,
  tally,
  shares,
  startedLabel,
  menuItems,
  onResume,
  onReplay,
  review,
}: Props) {
  const cards = `card${cardCount === 1 ? '' : 's'}`;
  const status = isActive
    ? `In progress \u2014 ${answeredCount}/${cardCount} ${cards}`
    : `Completed \u2014 ${cardCount} ${cards}`;
  const reviewLabel = review
    ? review.done
      ? `All missed or unsure cards fixed for ${deckName}`
      : `Review the ${review.count} missed or unsure card${
          review.count === 1 ? '' : 's'
        } for ${deckName}`
    : '';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {category ? <CategorySquare category={category} /> : null}
        <View style={styles.title}>
          <Text style={styles.name} numberOfLines={1}>
            {deckName}
          </Text>
          <View style={styles.pills}>
            <View style={[styles.pill, isActive ? styles.pillActive : styles.pillDone]}>
              {isActive ? (
                <View style={styles.pillDot} />
              ) : (
                <AnswerIcon name="tick" color={colors.success} size={12} />
              )}
              <Text
                style={[styles.pillText, isActive ? styles.pillTextActive : styles.pillTextDone]}
                numberOfLines={1}>
                {status}
              </Text>
            </View>
            {inverted ? (
              <View
                accessible
                accessibilityLabel="Inverted session"
                style={[styles.pill, styles.pillInverted]}>
                <Text style={[styles.pillText, styles.pillTextInverted]} numberOfLines={1}>
                  Inverted
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <KebabMenu
          title={deckName}
          category={category}
          accessibilityLabel={`Options for the ${deckName} session`}
          items={menuItems}
        />
      </View>

      <SessionResultsBar shares={shares} tally={tally} cardCount={cardCount} />

      <View style={styles.footer}>
        <View style={styles.started}>
          <MenuIcon name="clock" color={colors.textDim} size={14} />
          <Text style={styles.startedText} numberOfLines={1}>
            Started {startedLabel}
          </Text>
        </View>
        <View style={styles.actions}>
          {isActive && onResume ? (
            <Button
              variant="primary"
              accessibilityLabel={`Resume session for ${deckName}`}
              icon={renderResumeIcon}
              onPress={onResume}
            />
          ) : null}
          {!isActive && review ? (
            <ReviewErrorsButton
              count={review.count}
              done={review.done}
              accessibilityLabel={reviewLabel}
              onPress={review.onPress}
            />
          ) : null}
          {!isActive && onReplay ? (
            <Button
              variant="secondary"
              accessibilityLabel={`Replay session for ${deckName}`}
              icon={renderReplayIcon}
              onPress={onReplay}
            />
          ) : null}
        </View>
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
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  // Wraps, so the Inverted pill drops under the status pill rather than squeezing it.
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    gap: spacing.xs,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  // Translucent tints built from the tokens so they follow them.
  pillActive: {
    borderColor: `${colors.primary}4d`,
    backgroundColor: `${colors.primary}26`,
  },
  pillDone: {
    borderColor: `${colors.success}4d`,
    backgroundColor: `${colors.success}26`,
  },
  // Neutral on purpose: direction is not a state, so it must not read as one.
  pillInverted: {
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  pillText: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextActive: {
    color: colors.primary,
  },
  pillTextDone: {
    color: colors.success,
  },
  pillTextInverted: {
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  started: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  startedText: {
    flexShrink: 1,
    color: colors.textMuted,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
