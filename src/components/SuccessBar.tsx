import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';

type Props = {
  /** 0-100, or null when the card/deck has never been reviewed. */
  rate: number | null;
  height?: number;
};

export default function SuccessBar({ rate, height = 8 }: Props) {
  const value = rate === null ? 0 : Math.max(0, Math.min(100, rate));
  const color = rate === null ? colors.border : value >= 70 ? colors.success : value >= 40 ? colors.warning : colors.danger;

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
