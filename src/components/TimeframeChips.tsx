import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useT } from '../i18n/I18nProvider';
import { TIMEFRAMES, type Timeframe } from '../utils/timeframe';
import { colors, radius, spacing } from '../theme';

type Props = {
  value: Timeframe;
  onChange: (timeframe: Timeframe) => void;
};

export default function TimeframeChips({ value, onChange }: Props) {
  const t = useT();
  return (
    // importantForAccessibility keeps the label's node in the tree; a bare container can be pruned.
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={t('stats.timeframeChips.groupA11yLabel')}
      importantForAccessibility="yes"
      style={styles.row}>
      {TIMEFRAMES.map(option => {
        const selected = option === value;
        const label = t(`answers.timeframes.${option}`);
        return (
          // The Pressable is the 48-point touch target; the pill inside it is the visible chip.
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityState={{ checked: selected, selected }}
            onPress={() => onChange(option)}
            style={styles.target}>
            {({ pressed }) => (
              <View
                style={[
                  styles.chip,
                  selected && styles.chipSelected,
                  pressed && styles.pressed,
                ]}>
                <Text
                  maxFontSizeMultiplier={1.3}
                  style={[styles.label, selected && styles.labelSelected]}>
                  {label}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Wraps rather than scrolls, so every option stays visible at a large font scale.
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.sm,
  },
  target: {
    minHeight: 48,
    justifyContent: 'center',
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.background,
  },
});
