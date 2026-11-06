import React from 'react';
import { StyleSheet, View } from 'react-native';

export type MenuIconName =
  | 'edit'
  | 'delete'
  | 'play'
  | 'resume'
  | 'export'
  | 'import'
  | 'file'
  | 'settings'
  | 'search'
  | 'sort'
  | 'clock'
  | 'shuffle'
  | 'replay'
  | 'tally'
  | 'back'
  | 'close'
  | 'globe'
  | 'share'
  | 'star'
  | 'mail'
  | 'info'
  | 'cup'
  | 'lock';

type Props = { name: MenuIconName; color: string; size?: number };

const BASE_SIZE = 20;

// Glyphs are drawn on a 20-point grid; a different size scales that grid about its centre.
export default function MenuIcon({ name, color, size = BASE_SIZE }: Props) {
  if (size === BASE_SIZE) {
    return <Glyph name={name} color={color} />;
  }
  const offset = (size - BASE_SIZE) / 2;
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.scaled,
          { left: offset, top: offset, transform: [{ scale: size / BASE_SIZE }] },
        ]}>
        <Glyph name={name} color={color} />
      </View>
    </View>
  );
}

function Glyph({ name, color }: { name: MenuIconName; color: string }) {
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
    case 'resume':
      return (
        <View style={styles.container}>
          <View style={[styles.resumeBar, { backgroundColor: color }]} />
          <View style={[styles.resumeTriangle, { borderLeftColor: color }]} />
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
    case 'search':
      return (
        <View style={styles.container}>
          <View style={[styles.searchLens, { borderColor: color }]} />
          <View style={[styles.searchHandle, { backgroundColor: color }]} />
        </View>
      );
    case 'sort':
      return (
        <View style={styles.container}>
          <View style={[styles.sortHeadUp, { borderBottomColor: color }]} />
          <View style={[styles.sortStemUp, { backgroundColor: color }]} />
          <View style={[styles.sortStemDown, { backgroundColor: color }]} />
          <View style={[styles.sortHeadDown, { borderTopColor: color }]} />
        </View>
      );
    case 'clock':
      return (
        <View style={styles.container}>
          <View style={[styles.clockFace, { borderColor: color }]} />
          <View style={[styles.clockHandUp, { backgroundColor: color }]} />
          <View style={[styles.clockHandRight, { backgroundColor: color }]} />
        </View>
      );
    case 'shuffle':
      return (
        <View style={styles.container}>
          <View style={[styles.shuffleLine, styles.shuffleRising, { backgroundColor: color }]} />
          <View style={[styles.shuffleLine, styles.shuffleFalling, { backgroundColor: color }]} />
          <View style={[styles.shuffleHead, styles.shuffleHeadTop, { borderLeftColor: color }]} />
          <View style={[styles.shuffleHead, styles.shuffleHeadBottom, { borderLeftColor: color }]} />
        </View>
      );
    case 'replay':
      return (
        <View style={styles.container}>
          <View
            style={[
              styles.replayRing,
              { borderTopColor: color, borderBottomColor: color },
            ]}
          />
          <View style={[styles.replayHead, styles.replayHeadTop, { borderLeftColor: color }]} />
          <View style={[styles.replayHead, styles.replayHeadBottom, { borderLeftColor: color }]} />
        </View>
      );
    case 'tally':
      return (
        <View style={styles.container}>
          <View style={[styles.tallyBar, styles.tallyBar1, { backgroundColor: color }]} />
          <View style={[styles.tallyBar, styles.tallyBar2, { backgroundColor: color }]} />
          <View style={[styles.tallyBar, styles.tallyBar3, { backgroundColor: color }]} />
          <View style={[styles.tallyBar, styles.tallyBar4, { backgroundColor: color }]} />
          <View style={[styles.tallySlash, { backgroundColor: color }]} />
        </View>
      );
    case 'back':
      return (
        <View style={styles.container}>
          <View style={[styles.backHead, { borderRightColor: color }]} />
          <View style={[styles.backStem, { backgroundColor: color }]} />
        </View>
      );
    case 'close':
      return (
        <View style={styles.container}>
          <View style={[styles.closeBar, styles.closeBarRising, { backgroundColor: color }]} />
          <View style={[styles.closeBar, styles.closeBarFalling, { backgroundColor: color }]} />
        </View>
      );
    case 'globe':
      return (
        <View style={styles.container}>
          <View style={[styles.globeRing, { borderColor: color }]} />
          <View style={[styles.globeMeridian, { borderColor: color }]} />
          <View style={[styles.globeEquator, { backgroundColor: color }]} />
        </View>
      );
    case 'share':
      return (
        <View style={styles.container}>
          <View style={[styles.shareLine, styles.shareLineUp, { backgroundColor: color }]} />
          <View style={[styles.shareLine, styles.shareLineDown, { backgroundColor: color }]} />
          <View style={[styles.shareDot, styles.shareDotLeft, { backgroundColor: color }]} />
          <View style={[styles.shareDot, styles.shareDotTop, { backgroundColor: color }]} />
          <View style={[styles.shareDot, styles.shareDotBottom, { backgroundColor: color }]} />
        </View>
      );
    case 'star':
      return (
        <View style={styles.container}>
          <View style={[styles.starUp, { borderBottomColor: color }]} />
          <View style={[styles.starDown, { borderTopColor: color }]} />
        </View>
      );
    case 'mail':
      return (
        <View style={styles.container}>
          <View style={[styles.mailBody, { borderColor: color }]} />
          <View style={[styles.mailFlap, styles.mailFlapLeft, { backgroundColor: color }]} />
          <View style={[styles.mailFlap, styles.mailFlapRight, { backgroundColor: color }]} />
        </View>
      );
    case 'info':
      return (
        <View style={styles.container}>
          <View style={[styles.infoRing, { borderColor: color }]} />
          <View style={[styles.infoDot, { backgroundColor: color }]} />
          <View style={[styles.infoStem, { backgroundColor: color }]} />
        </View>
      );
    case 'cup':
      return (
        <View style={styles.container}>
          <View style={[styles.cupHandle, { borderColor: color }]} />
          <View style={[styles.cupBody, { borderColor: color }]} />
          <View style={[styles.cupSaucer, { backgroundColor: color }]} />
        </View>
      );
    case 'lock':
      return (
        <View style={styles.container}>
          <View style={[styles.lockShackle, { borderColor: color }]} />
          <View style={[styles.lockBody, { backgroundColor: color }]} />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  scaled: {
    position: 'absolute',
  },
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
  resumeBar: {
    position: 'absolute',
    top: 4,
    left: 3,
    width: 2.5,
    height: 12,
    borderRadius: 1,
  },
  resumeTriangle: {
    position: 'absolute',
    top: 4,
    left: 7.5,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 9,
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
  searchLens: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 11,
    height: 11,
    borderWidth: 2,
    borderRadius: 6,
  },
  searchHandle: {
    position: 'absolute',
    top: 14.5,
    left: 12,
    width: 7,
    height: 2,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  // Two arrows side by side, 14 points tall: the left points up, the right points down.
  sortHeadUp: {
    position: 'absolute',
    top: 3,
    left: 2,
    width: 0,
    height: 0,
    borderBottomWidth: 5,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  sortStemUp: {
    position: 'absolute',
    top: 7,
    left: 5,
    width: 2,
    height: 10,
  },
  sortStemDown: {
    position: 'absolute',
    top: 3,
    left: 13,
    width: 2,
    height: 10,
  },
  sortHeadDown: {
    position: 'absolute',
    top: 12,
    left: 10,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  clockFace: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 8,
  },
  clockHandUp: {
    position: 'absolute',
    top: 5.5,
    left: 9.25,
    width: 1.5,
    height: 5,
  },
  clockHandRight: {
    position: 'absolute',
    top: 9.25,
    left: 10,
    width: 4,
    height: 1.5,
  },
  shuffleLine: {
    position: 'absolute',
    top: 9,
    left: 2,
    width: 13,
    height: 2,
    borderRadius: 1,
  },
  shuffleRising: {
    transform: [{ rotate: '-35deg' }],
  },
  shuffleFalling: {
    transform: [{ rotate: '35deg' }],
  },
  shuffleHead: {
    position: 'absolute',
    right: 1,
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  shuffleHeadTop: {
    top: 2,
  },
  shuffleHeadBottom: {
    bottom: 2,
  },
  // Top and bottom quarter-turn arcs of a ring; the left and right gaps hold the arrowheads.
  replayRing: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 14,
    height: 14,
    borderWidth: 2,
    borderRadius: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  // Each head is a right-pointing triangle rotated onto the clockwise tangent at its arc's end.
  replayHead: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: 3.5,
    borderBottomWidth: 3.5,
    borderLeftWidth: 5,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  replayHeadTop: {
    top: 4,
    left: 13.5,
    transform: [{ rotate: '45deg' }],
  },
  replayHeadBottom: {
    top: 9,
    left: 1.5,
    transform: [{ rotate: '225deg' }],
  },
  // Four strokes struck through by a rising slash: a tally of five.
  tallyBar: {
    position: 'absolute',
    top: 4,
    width: 2,
    height: 12,
    borderRadius: 1,
  },
  tallyBar1: {
    left: 3,
  },
  tallyBar2: {
    left: 7,
  },
  tallyBar3: {
    left: 11,
  },
  tallyBar4: {
    left: 15,
  },
  tallySlash: {
    position: 'absolute',
    top: 9,
    left: 1,
    width: 18,
    height: 2,
    borderRadius: 1,
    transform: [{ rotate: '-35deg' }],
  },
  // A left-pointing arrow: a triangular head with a stem running to the right.
  backHead: {
    position: 'absolute',
    top: 4,
    left: 2,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  backStem: {
    position: 'absolute',
    top: 9,
    left: 8,
    width: 10,
    height: 2,
    borderRadius: 1,
  },
  closeBar: {
    position: 'absolute',
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  closeBarRising: {
    transform: [{ rotate: '45deg' }],
  },
  closeBarFalling: {
    transform: [{ rotate: '-45deg' }],
  },
  globeRing: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 8,
  },
  globeMeridian: {
    position: 'absolute',
    top: 2,
    left: 6.5,
    width: 7,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3.5,
  },
  globeEquator: {
    position: 'absolute',
    top: 9.25,
    left: 2,
    width: 16,
    height: 1.5,
  },
  // Three dots joined by two lines: one on the left, two on the right.
  shareDot: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  shareDotLeft: {
    top: 7.5,
    left: 3,
  },
  shareDotTop: {
    top: 2,
    left: 12,
  },
  shareDotBottom: {
    top: 13,
    left: 12,
  },
  shareLine: {
    position: 'absolute',
    left: 4.75,
    width: 10.5,
    height: 1.5,
  },
  shareLineUp: {
    top: 6.5,
    transform: [{ rotate: '-31deg' }],
  },
  shareLineDown: {
    top: 12,
    transform: [{ rotate: '31deg' }],
  },
  // Two equal triangles, one pointing up and one down, make a six-pointed star.
  starUp: {
    position: 'absolute',
    top: 2,
    left: 3,
    width: 0,
    height: 0,
    borderBottomWidth: 12,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  starDown: {
    position: 'absolute',
    top: 6,
    left: 3,
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  mailBody: {
    position: 'absolute',
    top: 3.5,
    left: 1,
    width: 18,
    height: 13,
    borderWidth: 1.5,
    borderRadius: 2,
  },
  mailFlap: {
    position: 'absolute',
    top: 7.25,
    width: 10,
    height: 1.5,
  },
  mailFlapLeft: {
    left: 1,
    transform: [{ rotate: '37deg' }],
  },
  mailFlapRight: {
    left: 9,
    transform: [{ rotate: '-37deg' }],
  },
  infoRing: {
    position: 'absolute',
    top: 1.5,
    left: 1.5,
    width: 17,
    height: 17,
    borderWidth: 1.5,
    borderRadius: 8.5,
  },
  infoDot: {
    position: 'absolute',
    top: 5.5,
    left: 9,
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  infoStem: {
    position: 'absolute',
    top: 9,
    left: 9,
    width: 2,
    height: 6,
  },
  cupBody: {
    position: 'absolute',
    top: 5,
    left: 2,
    width: 11,
    height: 11,
    borderWidth: 1.5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  cupHandle: {
    position: 'absolute',
    top: 7.5,
    left: 11.5,
    width: 6,
    height: 6,
    borderWidth: 1.5,
    borderRadius: 3,
  },
  cupSaucer: {
    position: 'absolute',
    top: 17,
    left: 1,
    width: 15,
    height: 1.5,
    borderRadius: 1,
  },
  lockShackle: {
    position: 'absolute',
    top: 2,
    left: 6,
    width: 8,
    height: 9,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  lockBody: {
    position: 'absolute',
    top: 9,
    left: 4,
    width: 12,
    height: 9,
    borderRadius: 2,
  },
});
