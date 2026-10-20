import React from 'react';
import { StyleSheet, View } from 'react-native';

export type MenuIconName = 'edit' | 'delete' | 'play' | 'export' | 'import' | 'file' | 'settings';

type Props = { name: MenuIconName; color: string };

export default function MenuIcon({ name, color }: Props) {
  switch (name) {
    case 'edit':
      return (
        <View style={styles.container}>
          <View style={[styles.pencilBody, { backgroundColor: color }]} />
          <View style={[styles.pencilTip, { borderTopColor: color }]} />
        </View>
      );
    case 'delete':
      return (
        <View style={styles.container}>
          <View style={[styles.trashHandle, { backgroundColor: color }]} />
          <View style={[styles.trashLid, { backgroundColor: color }]} />
          <View style={[styles.trashBody, { borderColor: color }]} />
        </View>
      );
    case 'play':
      return (
        <View style={styles.container}>
          <View style={[styles.play, { borderLeftColor: color }]} />
        </View>
      );
    case 'export':
      return (
        <View style={styles.container}>
          <View style={[styles.exportArrow, { borderBottomColor: color }]} />
          <View style={[styles.exportStem, { backgroundColor: color }]} />
          <View style={[styles.exportTray, { borderColor: color }]} />
        </View>
      );
    case 'import':
      return (
        <View style={styles.container}>
          <View style={[styles.importStem, { backgroundColor: color }]} />
          <View style={[styles.importArrow, { borderTopColor: color }]} />
          <View style={[styles.exportTray, { borderColor: color }]} />
        </View>
      );
    case 'file':
      return (
        <View style={styles.container}>
          <View style={[styles.fileSheet, { borderColor: color }]} />
          <View style={[styles.fileLine, styles.fileLineTop, { backgroundColor: color }]} />
          <View style={[styles.fileLine, styles.fileLineBottom, { backgroundColor: color }]} />
        </View>
      );
    case 'settings':
      return (
        <View style={styles.container}>
          <View style={[styles.sliderLine, styles.sliderTop, { backgroundColor: color }]} />
          <View style={[styles.sliderKnob, styles.sliderKnobTop, { backgroundColor: color }]} />
          <View style={[styles.sliderLine, styles.sliderBottom, { backgroundColor: color }]} />
          <View style={[styles.sliderKnob, styles.sliderKnobBottom, { backgroundColor: color }]} />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pencilBody: {
    position: 'absolute',
    width: 14,
    height: 4,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
  pencilTip: {
    position: 'absolute',
    left: 2,
    bottom: 3,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderRightColor: 'transparent',
  },
  trashHandle: {
    position: 'absolute',
    top: 1,
    width: 7,
    height: 2,
    borderRadius: 1,
  },
  trashLid: {
    position: 'absolute',
    top: 4,
    width: 15,
    height: 2,
    borderRadius: 1,
  },
  trashBody: {
    position: 'absolute',
    top: 7,
    width: 12,
    height: 11,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  play: {
    width: 0,
    height: 0,
    marginLeft: 3,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  exportArrow: {
    position: 'absolute',
    top: 1,
    width: 0,
    height: 0,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  exportStem: {
    position: 'absolute',
    top: 5,
    width: 2,
    height: 7,
  },
  exportTray: {
    position: 'absolute',
    bottom: 1,
    width: 16,
    height: 7,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  importStem: {
    position: 'absolute',
    top: 1,
    width: 2,
    height: 7,
  },
  importArrow: {
    position: 'absolute',
    top: 7,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  fileSheet: {
    position: 'absolute',
    width: 13,
    height: 17,
    borderWidth: 1.5,
    borderRadius: 2,
  },
  fileLine: {
    position: 'absolute',
    width: 7,
    height: 1.5,
  },
  fileLineTop: {
    top: 7,
  },
  fileLineBottom: {
    top: 11,
  },
  sliderLine: {
    position: 'absolute',
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  sliderTop: {
    top: 6,
  },
  sliderBottom: {
    bottom: 6,
  },
  sliderKnob: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sliderKnobTop: {
    top: 4,
    right: 3,
  },
  sliderKnobBottom: {
    bottom: 4,
    left: 3,
  },
});
