import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { AnswerShares } from '../types';
import { colors, radius } from '../theme';

type Props = {
  /** Percentages of all reviews (0-100), or null when nothing has been reviewed. */
  shares: AnswerShares | null;
  height?: number;
};

export const ANSWER_SEGMENTS = [
  { key: 'ok', icon: 'tick', color: colors.success },
  { key: 'okeish', icon: 'question', color: colors.warning },
  { key: 'notOk', icon: 'cross', color: colors.danger },
] as const;

// No text and no accessibility label: whatever carries the track says the numbers.
export default function MasteryTrack({ shares, height = 10 }: Props) {
  return (
    <View style={[styles.track, { height }]}>
      {shares
        ? ANSWER_SEGMENTS.filter(s => shares[s.key] > 0).map(s => (
            <View
              key={s.key}
              style={[styles.segment, { flex: shares[s.key], backgroundColor: s.color }]}
            />
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // The 2-point inset and gap are below the spacing scale on purpose.
  track: {
    flexDirection: 'row',
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
});
