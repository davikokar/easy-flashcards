import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnswerShares, AnswerTally } from '../types';
import { colors, radius, spacing } from '../theme';
import { AnswerIcon } from './AnswerIcons';
import Button from './Button';
import KebabMenu from './KebabMenu';
import MenuIcon from './MenuIcons';
import { MenuItem } from './MenuSheet';
import SessionResultsBar from './SessionResultsBar';

const renderPlayIcon = (color: string) => <MenuIcon name="play" color={color} />;
const renderReplayIcon = (color: string) => <MenuIcon name="replay" color={color} />;

// Badge text is capped so two digits and the plus stay inside the badge.
const BADGE_MAX = 99;

type Review = {
  /** Missed or unsure cards still outstanding. */
  count: number;
  /** Everything that needed review is fixed: the button is disabled and shows a tick. */
  done: boolean;
  onPress: () => void;
};

type Props = {
  deckName: string;
  isActive: boolean;
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
  isActive,
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
        <View style={styles.title}>
          <Text style={styles.name} numberOfLines={1}>
            {deckName}
          </Text>
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
        </View>
        <KebabMenu
          title={deckName}
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
              icon={renderPlayIcon}
              onPress={onResume}
            />
          ) : null}
          {!isActive && review ? (
            <View>
              <Button
                variant="warning"
                accessibilityLabel={reviewLabel}
                icon={renderReplayIcon}
                disabled={review.done}
                onPress={review.onPress}
              />
              {/* A sibling of the button, so its disabled dimming does not fade the badge. */}
              <View
                pointerEvents="none"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={[styles.badge, review.done ? styles.badgeDone : styles.badgeCount]}>
                {review.done ? (
                  <AnswerIcon name="tick" color={colors.success} size={12} />
                ) : (
                  <Text style={styles.badgeText} allowFontScaling={false} numberOfLines={1}>
                    {review.count > BADGE_MAX ? `${BADGE_MAX}+` : review.count}
                  </Text>
                )}
              </View>
            </View>
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
  // Sits on the button's top-right corner, inside the 8-point gap and the footer padding.
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    paddingHorizontal: spacing.xs,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    // Solid card colour so the ring reads against the orange button and the card alike.
    backgroundColor: colors.surface,
  },
  badgeCount: {
    borderColor: colors.warning,
  },
  badgeDone: {
    borderColor: colors.success,
  },
  badgeText: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '700',
  },
});
