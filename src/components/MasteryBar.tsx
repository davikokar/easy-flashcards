import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useT } from '../i18n/I18nProvider';
import { AnswerShares } from '../types';
import { describeAnswerShares, formatRate } from '../utils/stats';
import { colors, radius, spacing } from '../theme';
import { AnswerIcon } from './AnswerIcons';
import MasteryTrack, { ANSWER_SEGMENTS } from './MasteryTrack';

type Props = {
  /** Percentages of all reviews (0-100), or null when nothing has been reviewed. */
  shares: AnswerShares | null;
};

const LEGEND_ICON_SIZE = 16;

export default function MasteryBar({ shares }: Props) {
  const t = useT();
  return (
    <View
      accessible
      accessibilityLabel={t('decks.masteryBar.a11yLabel', {
        summary: describeAnswerShares(shares, t),
      })}
      style={styles.panel}>
      <MasteryTrack shares={shares} />
      <View style={styles.legend}>
        {ANSWER_SEGMENTS.map(s => (
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
