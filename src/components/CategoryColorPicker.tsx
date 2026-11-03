import React, { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { AnswerIcon } from './AnswerIcons';
import { linearGradient } from './ColorSlider';
import { colors, radius, spacing } from '../theme';
import { hueSpectrumStops, isPaletteColor } from '../utils/color';

type Props = {
  palette: readonly string[];
  value: string;
  onChange: (color: string) => void;
  /** The Custom colour swatch was pressed. The caller owns opening the Custom colour dialog. */
  onCustomPress: () => void;
};

const COLUMNS = 6;
// One gap, used between boxes and between rows, so the two can never differ.
const GAP = spacing.sm;
const MIN_SWATCH = 48;
const MAX_SWATCH = 56;
const CUSTOM_BACKGROUND = linearGradient('to bottom right', hueSpectrumStops());

export default function CategoryColorPicker({ palette, value, onChange, onCustomPress }: Props) {
  const [width, setWidth] = useState<number | null>(null);

  // Boxes share the measured width exactly, so the gap does not depend on the screen.
  const size =
    width === null
      ? MIN_SWATCH
      : Math.min(MAX_SWATCH, Math.max(0, (width - GAP * (COLUMNS - 1)) / COLUMNS));
  const boxStyle = { width: size, height: size };

  const wanted = value.toLowerCase();
  const customSelected = !isPaletteColor(value, palette);

  const cells = palette.map((color, index) => {
    const selected = color.toLowerCase() === wanted;
    return (
      <Pressable
        key={color}
        accessibilityRole="radio"
        accessibilityLabel={`Colour ${index + 1} of ${palette.length}`}
        accessibilityState={{ selected }}
        onPress={() => onChange(color)}
        style={({ pressed }) => [
          styles.swatch,
          boxStyle,
          { backgroundColor: color },
          selected && styles.swatchSelected,
          pressed && styles.pressed,
        ]}>
        {selected ? <AnswerIcon name="tick" color={colors.background} size={22} /> : null}
      </Pressable>
    );
  });

  cells.push(
    <Pressable
      key="custom"
      accessibilityRole="radio"
      accessibilityLabel="Custom colour"
      accessibilityHint="Opens the colour chooser"
      accessibilityState={{ selected: customSelected }}
      onPress={onCustomPress}
      style={({ pressed }) => [
        styles.swatch,
        boxStyle,
        { backgroundImage: CUSTOM_BACKGROUND },
        customSelected && styles.swatchSelected,
        pressed && styles.pressed,
      ]}>
      {/* A rainbow is no ground for the tick the palette swatches use, so it sits on a disc. */}
      {customSelected ? (
        <View style={styles.disc}>
          <AnswerIcon name="tick" color={colors.background} size={16} />
        </View>
      ) : null}
    </Pressable>,
  );

  const rows: React.ReactNode[][] = [];
  for (let i = 0; i < cells.length; i += COLUMNS) {
    rows.push(cells.slice(i, i + COLUMNS));
  }

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Colour picker"
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      style={styles.grid}>
      {rows.map((row, index) => (
        <View key={index} style={styles.row}>
          {row}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: GAP,
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
  },
  // Always bordered, so selecting one does not move it.
  swatch: {
    borderRadius: radius.md,
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    borderColor: colors.text,
  },
  disc: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
