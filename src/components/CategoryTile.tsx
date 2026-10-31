import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnswerIcon } from './AnswerIcons';
import CategoryIcon from './CategoryIcon';
import MenuIcon from './MenuIcons';
import type { CategoryIcon as CategoryIconKey } from '../types';
import { colors, radius, spacing } from '../theme';

type Look =
  | { color: string; icon: CategoryIconKey; none?: false }
  // The empty choice of the Category picker: a dashed square with no category colour or icon.
  | { none: true; color?: undefined; icon?: undefined };

type Props = Look & {
  name: string;
  /** Makes the tile a button. Without it the tile is not pressable. */
  onPress?: () => void;
  /** Overrides the accessible name, which is `name`. Required in practice for a pressable tile. */
  accessibilityLabel?: string;
  /** Dims the name, for a placeholder. */
  nameDimmed?: boolean;
  /**
   * Makes a pressable tile a radio of a group; `true` marks it with a ring and a tick.
   * Leave it undefined for an ordinary button tile.
   */
  selected?: boolean;
};

const GLYPH_SIZE = 44;
const NONE_GLYPH_SIZE = 28;
const TICK_BADGE = 22;

// Fills the width its parent gives it; the grid decides how wide that is.
export default function CategoryTile({
  name,
  color,
  icon,
  none = false,
  onPress,
  accessibilityLabel,
  nameDimmed = false,
  selected,
}: Props) {
  const content = (
    <>
      <View style={[styles.square, none ? styles.squareNone : { backgroundColor: color }]}>
        {none ? (
          <MenuIcon name="close" color={colors.textMuted} size={NONE_GLYPH_SIZE} />
        ) : icon ? (
          <CategoryIcon name={icon} color={colors.background} size={GLYPH_SIZE} />
        ) : null}
        {selected ? (
          // Overlays, so selecting a tile moves nothing. The tick keeps it from being colour alone.
          <View pointerEvents="none" style={styles.ring}>
            <View style={styles.tick}>
              <AnswerIcon name="tick" color={colors.background} size={14} />
            </View>
          </View>
        ) : null}
      </View>
      <Text style={[styles.name, nameDimmed && styles.nameDimmed]} numberOfLines={2}>
        {name}
      </Text>
    </>
  );

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={accessibilityLabel ?? name} style={styles.tile}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole={selected === undefined ? 'button' : 'radio'}
      accessibilityLabel={accessibilityLabel ?? name}
      accessibilityState={selected === undefined ? undefined : { selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    gap: spacing.xs,
  },
  square: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareNone: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.textDim,
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.text,
  },
  tick: {
    position: 'absolute',
    right: spacing.xs,
    bottom: spacing.xs,
    width: TICK_BADGE,
    height: TICK_BADGE,
    borderRadius: TICK_BADGE / 2,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  nameDimmed: {
    color: colors.textDim,
  },
  pressed: {
    opacity: 0.75,
  },
});
