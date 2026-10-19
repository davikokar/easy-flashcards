import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = { color: string };

export function DecksIcon({ color }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.deckBack, { borderColor: color }]} />
      <View style={[styles.deckFront, { borderColor: color }]} />
    </View>
  );
}

export function StatsIcon({ color }: Props) {
  return (
    <View style={[styles.container, styles.bars]}>
      <View style={[styles.bar, styles.barShort, { backgroundColor: color }]} />
      <View style={[styles.bar, styles.barTall, { backgroundColor: color }]} />
      <View style={[styles.bar, styles.barMedium, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckBack: {
    position: 'absolute',
    width: 14,
    height: 17,
    borderWidth: 1.5,
    borderRadius: 3,
    top: 2,
    left: 2,
  },
  deckFront: {
    position: 'absolute',
    width: 14,
    height: 17,
    borderWidth: 1.5,
    borderRadius: 3,
    bottom: 2,
    right: 2,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },
  barShort: {
    height: 8,
  },
  barMedium: {
    height: 12,
  },
  barTall: {
    height: 16,
  },
});
