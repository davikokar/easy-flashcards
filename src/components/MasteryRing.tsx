import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnswerShares, AnswerTally } from '../types';
import { allocateRingSegments, describeAnswerShares, formatRate } from '../utils/stats';
import { colors, spacing } from '../theme';
import { AnswerIcon } from './AnswerIcons';

type Props = {
  /** Percentages of all reviews (0-100), or null when nothing has been reviewed. */
  shares: AnswerShares | null;
  /** Ok-only success rate (0-100), or null when nothing has been reviewed. */
  rate: number | null;
  tally: AnswerTally;
};

const ROWS = [
  { key: 'ok', count: 'okCount', label: 'Ok', icon: 'tick', color: colors.success },
  { key: 'okeish', count: 'okeishCount', label: 'Okeish', icon: 'question', color: colors.warning },
  { key: 'notOk', count: 'notOkCount', label: 'Not ok', icon: 'cross', color: colors.danger },
] as const;

const RING_SIZE = 144;
const BAR_COUNT = 60;
const BAR_WIDTH = 4;
const BAR_LENGTH = 12;
const LEGEND_ICON_SIZE = 18;

// Each bar starts at the ring's centre, turns, then moves out along its own axis; 0deg is 12 o'clock.
const BAR_TRANSFORMS = Array.from({ length: BAR_COUNT }, (_, i) => [
  { rotate: `${(i * 360) / BAR_COUNT}deg` },
  { translateY: -(RING_SIZE / 2 - BAR_LENGTH / 2) },
]);

function barColors(shares: AnswerShares | null): string[] {
  const segments = allocateRingSegments(shares, BAR_COUNT);
  const result: string[] = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    if (i < segments.okCount) {
      result.push(colors.success);
    } else if (i < segments.okCount + segments.okeishCount) {
      result.push(colors.warning);
    } else if (i < segments.okCount + segments.okeishCount + segments.notOkCount) {
      result.push(colors.danger);
    } else {
      result.push(colors.border);
    }
  }
  return result;
}

export default function MasteryRing({ shares, rate, tally }: Props) {
  const reviewed = shares !== null;
  const bars = barColors(shares);
  const counts = ROWS.map(r => `${tally[r.count]} ${r.label}`).join(', ');

  return (
    <View
      accessible
      accessibilityLabel={`Success rate ${formatRate(rate)}. ${describeAnswerShares(shares)}. Counts: ${counts}`}
      style={styles.panel}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.ring}>
        {bars.map((color, i) => (
          <View
            key={i}
            style={[styles.bar, { backgroundColor: color, transform: BAR_TRANSFORMS[i] }]}
          />
        ))}
        <View style={styles.centre}>
          <Text maxFontSizeMultiplier={1.2} style={styles.rate}>
            {formatRate(rate)}
          </Text>
          <Text maxFontSizeMultiplier={1.2} style={styles.caption}>
            Success rate
          </Text>
        </View>
      </View>
      <View style={styles.legend}>
        {ROWS.map(r => (
          <View key={r.key} style={styles.row}>
            <AnswerIcon
              name={r.icon}
              color={reviewed ? r.color : colors.textDim}
              size={LEGEND_ICON_SIZE}
            />
            <Text style={[styles.percent, { color: reviewed ? r.color : colors.textDim }]}>
              {formatRate(shares ? shares[r.key] : null)}
            </Text>
            <Text style={styles.count}>{tally[r.count]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // No surface of its own: it sits directly in the Aggregated stats card.
  panel: {
    gap: spacing.md,
    alignItems: 'center',
  },
  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
  },
  bar: {
    position: 'absolute',
    left: (RING_SIZE - BAR_WIDTH) / 2,
    top: (RING_SIZE - BAR_LENGTH) / 2,
    width: BAR_WIDTH,
    height: BAR_LENGTH,
    borderRadius: BAR_WIDTH / 2,
  },
  centre: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rate: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  caption: {
    color: colors.textMuted,
    fontSize: 12,
  },
  legend: {
    alignSelf: 'stretch',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  percent: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  count: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
