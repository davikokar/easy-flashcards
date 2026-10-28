import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnswerShares, AnswerTally } from '../types';
import { colors, spacing } from '../theme';
import { AnswerIcon } from './AnswerIcons';

type Props = {
  /** Each answer's percentage of the session's cards (0-100), from `sessionProgressShares`. */
  shares: AnswerShares;
  tally: AnswerTally;
  cardCount: number;
};

const SEGMENTS = [
  { key: 'ok', count: 'okCount', label: 'ok', icon: 'tick', color: colors.success },
  { key: 'okeish', count: 'okeishCount', label: 'okeish', icon: 'question', color: colors.warning },
  { key: 'notOk', count: 'notOkCount', label: 'not ok', icon: 'cross', color: colors.danger },
] as const;

const LEGEND_ICON_SIZE = 16;

export default function SessionResultsBar({ shares, tally, cardCount }: Props) {
  const answered = tally.okCount + tally.okeishCount + tally.notOkCount;
  const summary = SEGMENTS.map(s => `${tally[s.count]} ${s.label}`).join(', ');

  return (
    <View
      accessible
      accessibilityLabel={`Progress: ${answered} of ${cardCount} answered \u2014 ${summary}`}
      style={styles.container}>
      <View style={styles.track}>
        {SEGMENTS.filter(s => shares[s.key] > 0).map(s => (
          <View
            key={s.key}
            style={[styles.segment, { width: `${shares[s.key]}%`, backgroundColor: s.color }]}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {SEGMENTS.map(s => (
          <View key={s.key} style={styles.legendItem}>
            <AnswerIcon
              name={s.icon}
              color={answered > 0 ? s.color : colors.textDim}
              size={LEGEND_ICON_SIZE}
            />
            <Text style={styles.count}>{tally[s.count]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  // The unfilled remainder of the track is the unanswered part of the session.
  track: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  // Percent widths shrink together if the minimum widths push the row past 100%.
  segment: {
    height: '100%',
    minWidth: 4,
    flexShrink: 1,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  count: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
});
