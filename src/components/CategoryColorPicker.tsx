import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AnswerIcon } from './AnswerIcons';
import { colors, radius } from '../theme';

type Props = {
  palette: readonly string[];
  value: string;
  onChange: (color: string) => void;
};

const COLUMNS = 6;
const CELL_WIDTH = `${100 / COLUMNS}%` as const;

export default function CategoryColorPicker({ palette, value, onChange }: Props) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="Colour picker" style={styles.grid}>
      {palette.map((color, index) => {
        const selected = color === value;
        return (
          <View key={color} style={styles.cell}>
            <Pressable
              accessibilityRole="radio"
              accessibilityLabel={`Colour ${index + 1} of ${palette.length}`}
              accessibilityState={{ selected }}
              onPress={() => onChange(color)}
              style={({ pressed }) => [
                styles.swatch,
                { backgroundColor: color },
                selected && styles.swatchSelected,
                pressed && styles.pressed,
              ]}>
              {selected ? <AnswerIcon name="tick" color={colors.background} size={22} /> : null}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: CELL_WIDTH,
    alignItems: 'center',
  },
  // Always bordered, so selecting one does not move it.
  swatch: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    borderColor: colors.text,
  },
  pressed: {
    opacity: 0.75,
  },
});
