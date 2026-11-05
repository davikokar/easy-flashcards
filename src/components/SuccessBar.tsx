import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';
import { rateBand } from '../utils/stats';

const BAND_COLORS = {
  none: colors.border,
  low: colors.danger,
  mid: colors.warning,
  high: colors.success,
};

type Props = {
  /** 0-100, or null when the card/deck has never been reviewed. */
  rate: number | null;
  height?: number;
  /** Fixed fill colour for a bar that is not a success rate (the Study screen's session progress). */
  color?: string;
};

export default function SuccessBar({ rate, height = 8, color: fixedColor }: Props) {
  const value = rate === null ? 0 : Math.max(0, Math.min(100, rate));
  const color = fixedColor ?? BAND_COLORS[rateBand(rate)];

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[styles.fill, { width: `${value}%`, backgroundColor: color, borderRadius: height / 2 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.border,
    overflow: 'hidden',
    borderRadius: radius.sm,
  },
  fill: {
    height: '100%',
  },
});
