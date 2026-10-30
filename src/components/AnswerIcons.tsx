import React from 'react';
import { StyleSheet, View } from 'react-native';

type AnswerIconName = 'tick' | 'cross' | 'question';

type Props = {
  name: AnswerIconName;
  color: string;
  size?: number;
};

type Point = [number, number];

// Round-capped line between two points, given in fractions of the icon box.
function Stroke({
  from,
  to,
  size,
  thickness,
  color,
}: {
  from: Point;
  to: Point;
  size: number;
  thickness: number;
  color: string;
}) {
  const x1 = from[0] * size;
  const y1 = from[1] * size;
  const x2 = to[0] * size;
  const y2 = to[1] * size;
  const length = Math.hypot(x2 - x1, y2 - y1) + thickness;
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

  return (
    <View
      style={[
        styles.absolute,
        {
          width: length,
          height: thickness,
          left: (x1 + x2) / 2 - length / 2,
          top: (y1 + y2) / 2 - thickness / 2,
          borderRadius: thickness / 2,
          backgroundColor: color,
          transform: [{ rotate: `${angle}deg` }],
        },
      ]}
    />
  );
}

function Tick({ size, thickness, color }: { size: number; thickness: number; color: string }) {
  return (
    <>
      <Stroke from={[0.17, 0.54]} to={[0.4, 0.76]} size={size} thickness={thickness} color={color} />
      <Stroke from={[0.4, 0.76]} to={[0.85, 0.26]} size={size} thickness={thickness} color={color} />
    </>
  );
}

function Cross({ size, thickness, color }: { size: number; thickness: number; color: string }) {
  return (
    <>
      <Stroke from={[0.25, 0.25]} to={[0.75, 0.75]} size={size} thickness={thickness} color={color} />
      <Stroke from={[0.75, 0.25]} to={[0.25, 0.75]} size={size} thickness={thickness} color={color} />
    </>
  );
}

function Question({ size, thickness, color }: { size: number; thickness: number; color: string }) {
  const diameter = size * 0.56;
  const centreX = size / 2;
  const hookTop = size * 0.03;
  const hookBottom = hookTop + diameter;
  const stemBottom = size * 0.7;
  const dot = thickness * 1.2;

  return (
    <>
      {/* A ring with its bottom side cleared, turned 45deg so the opening faces bottom-left. */}
      <View
        style={[
          styles.absolute,
          {
            width: diameter,
            height: diameter,
            left: centreX - diameter / 2,
            top: hookTop,
            borderRadius: diameter / 2,
            borderWidth: thickness,
            borderColor: color,
            borderBottomColor: 'transparent',
            transform: [{ rotate: '45deg' }],
          },
        ]}
      />
      <View
        style={[
          styles.absolute,
          {
            width: thickness,
            height: stemBottom - (hookBottom - thickness),
            left: centreX - thickness / 2,
            top: hookBottom - thickness,
            borderRadius: thickness / 2,
            backgroundColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.absolute,
          {
            width: dot,
            height: dot,
            left: centreX - dot / 2,
            top: size * 0.97 - dot,
            borderRadius: dot / 2,
            backgroundColor: color,
          },
        ]}
      />
    </>
  );
}

export function AnswerIcon({ name, color, size = 28 }: Props) {
  const thickness = Math.max(2, Math.round(size * 0.14));

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: size }}>
      {name === 'tick' ? <Tick size={size} thickness={thickness} color={color} /> : null}
      {name === 'cross' ? <Cross size={size} thickness={thickness} color={color} /> : null}
      {name === 'question' ? <Question size={size} thickness={thickness} color={color} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
});
