import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import { SessionResult } from '../types';
import { useT } from '../i18n/I18nProvider';
import { colors, spacing } from '../theme';

type Props = {
  results: SessionResult[];
  currentIndex: number;
};

const TILE_WIDTH = 12;
const TILE_GAP = 4;

export default function HistoryStrip({ results, currentIndex }: Props) {
  const t = useT();
  const scrollRef = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    const offset = Math.max(0, (currentIndex + 1) * (TILE_WIDTH + TILE_GAP) - 140);
    scrollRef.current?.scrollTo({ x: offset, animated: true });
  }, [currentIndex, results.length]);

  return (
    <View style={styles.container} accessibilityLabel={t('study.historyStrip.a11yLabel')}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {results.map((result, position) => (
          <View
            key={position}
            style={[
              styles.tile,
              result.answer === 'ok'
                ? styles.ok
                : result.answer === 'okeish'
                ? styles.okeish
                : styles.notOk,
              position === currentIndex && styles.current,
            ]}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 22,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: TILE_GAP,
  },
  tile: {
    width: TILE_WIDTH,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  ok: {
    backgroundColor: colors.success,
  },
  okeish: {
    backgroundColor: colors.warning,
  },
  notOk: {
    backgroundColor: colors.danger,
  },
  current: {
    height: 22,
    borderColor: colors.text,
    marginHorizontal: spacing.xs / 2,
  },
});
