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

type Props = {
  deckName: string;
  isActive: boolean;
  answeredCount: number;
  cardCount: number;
  tally: AnswerTally;
  shares: AnswerShares;
  /** Already formatted, e.g. by `formatDate`. */
  startedLabel: string;
  /** Not ok plus okeish answers: what the replay-missed button would study. */
  missedCount: number;
  menuItems: MenuItem[];
  onResume?: () => void;
  onReplay?: () => void;
  /** The replay-missed button is shown only when this is provided. */
  onReplayMissed?: () => void;
};

export default function SessionCard({
  deckName,
  isActive,
  answeredCount,
  cardCount,
  tally,
  shares,
  startedLabel,
  missedCount,
  menuItems,
  onResume,
  onReplay,
  onReplayMissed,
}: Props) {
  const cards = `card${cardCount === 1 ? '' : 's'}`;
  const status = isActive
    ? `In progress \u2014 ${answeredCount}/${cardCount} ${cards}`
    : `Completed \u2014 ${cardCount} ${cards}`;

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
          {!isActive && onReplayMissed ? (
            <Button
              variant="warning"
              accessibilityLabel={`Replay the ${missedCount} missed or unsure card${
                missedCount === 1 ? '' : 's'
              } for ${deckName}`}
              icon={renderReplayIcon}
              onPress={onReplayMissed}
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
});
