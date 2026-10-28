import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnswerShares } from '../types';
import { formatRate } from '../utils/stats';
import { colors, radius, spacing } from '../theme';
import { AnswerIcon } from './AnswerIcons';

type Props = {
  /** Percentages of all reviews (0-100), or null when nothing has been reviewed. */
  shares: AnswerShares | null;
};

const SEGMENTS = [
  { key: 'ok', label: 'Ok', icon: 'tick', color: colors.success },
  { key: 'okeish', label: 'Okeish', icon: 'question', color: colors.warning },
  { key: 'notOk', label: 'Not ok', icon: 'cross', color: colors.danger },
] as const;

const LEGEND_ICON_SIZE = 16;

export default function MasteryBar({ shares }: Props) {
  const summary = shares
    ? SEGMENTS.map(s => `${formatRate(shares[s.key])} ${s.label}`).join(', ')
    : 'Not reviewed yet';

  return (
    <View accessible accessibilityLabel={`Mastery: ${summary}`} style={styles.panel}>
      <View style={styles.track}>
        {shares
          ? SEGMENTS.filter(s => shares[s.key] > 0).map(s => (
              <View
                key={s.key}
                style={[styles.segment, { flex: shares[s.key], backgroundColor: s.color }]}
              />
            ))
          : null}
      </View>
      <View style={styles.legend}>
        {SEGMENTS.map(s => (
          <View key={s.key} style={styles.legendItem}>
            <AnswerIcon
              name={s.icon}
              color={shares ? s.color : colors.textDim}
              size={LEGEND_ICON_SIZE}
            />
            <Text style={styles.percent}>{formatRate(shares ? shares[s.key] : null)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  // Fixed 10-point track: the 2-point inset and gap are below the spacing scale on purpose.
  track: {
    flexDirection: 'row',
    height: 10,
    padding: 2,
    gap: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
    minWidth: 4,
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  legendItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  percent: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
});
