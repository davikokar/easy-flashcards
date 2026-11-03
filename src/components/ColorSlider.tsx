import React, { useRef, useState } from 'react';
import {
  AccessibilityActionEvent,
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, spacing } from '../theme';

type Props = {
  /** Shown above the track and read as the slider's name. */
  label: string;
  /** Shown above the track and read as the slider's value. */
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  /** How far one TalkBack increment or decrement moves the value. */
  step: number;
  /** Colour stops of the track, first (min) to last (max). */
  stops: readonly string[];
  onChange: (value: number) => void;
  /** True from the touch down until the finger lifts or the gesture is cancelled. */
  onSlidingChange?: (sliding: boolean) => void;
};

export function linearGradient(direction: string, stops: readonly string[]): string {
  return `linear-gradient(${direction}, ${stops.join(', ')})`;
}

const THUMB = 28;
const TOUCH_HEIGHT = 48;
const TRACK_HEIGHT = 20;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function ColorSlider({
  label,
  valueLabel,
  value,
  min,
  max,
  step,
  stops,
  onChange,
  onSlidingChange,
}: Props) {
  const [width, setWidth] = useState(0);
  // The finger's x in the track at touch down, and its page x then; later moves add the page delta.
  const start = useRef({ x: 0, pageX: 0 });

  const usable = Math.max(0, width - THUMB);
  const fraction = max > min ? clamp((value - min) / (max - min), 0, 1) : 0;

  const setFromX = (x: number) => {
    if (usable === 0) {
      return;
    }
    const next = clamp((x - THUMB / 2) / usable, 0, 1);
    onChange(min + next * (max - min));
  };

  const onGrant = (event: GestureResponderEvent) => {
    const { locationX, pageX } = event.nativeEvent;
    start.current = { x: locationX, pageX };
    onSlidingChange?.(true);
    setFromX(locationX);
  };

  const onMove = (event: GestureResponderEvent) => {
    setFromX(start.current.x + event.nativeEvent.pageX - start.current.pageX);
  };

  const onEnd = () => onSlidingChange?.(false);

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === 'increment') {
      onChange(clamp(value + step, min, max));
    } else if (event.nativeEvent.actionName === 'decrement') {
      onChange(clamp(value - step, min, max));
    }
  };

  return (
    <View style={styles.root}>
      {/* The touch area below carries the name and value, so they are not read twice. */}
      <View
        style={styles.header}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants">
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{valueLabel}</Text>
      </View>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: Math.round(value), text: valueLabel }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={onAccessibilityAction}
        onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={onGrant}
        onResponderMove={onMove}
        onResponderRelease={onEnd}
        onResponderTerminate={onEnd}
        // A drag must not be taken over by the dialog's scroll view.
        onResponderTerminationRequest={() => false}
        style={styles.touch}>
        <View
          pointerEvents="none"
          style={[styles.track, { backgroundImage: linearGradient('to right', stops) }]}
        />
        <View pointerEvents="none" style={[styles.thumb, { left: fraction * usable }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  value: {
    color: colors.textMuted,
    fontSize: 13,
  },
  touch: {
    height: TOUCH_HEIGHT,
  },
  // Inset by half a thumb, so the thumb's centre is over the colour it stands for at both ends.
  track: {
    position: 'absolute',
    left: THUMB / 2,
    right: THUMB / 2,
    top: (TOUCH_HEIGHT - TRACK_HEIGHT) / 2,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  // A light disc with a dark rim stays visible over every track colour, white and black included.
  thumb: {
    position: 'absolute',
    top: (TOUCH_HEIGHT - THUMB) / 2,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    borderWidth: 3,
    borderColor: colors.background,
    backgroundColor: colors.text,
  },
});
