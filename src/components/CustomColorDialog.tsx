import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import ColorSlider from './ColorSlider';
import { colors, radius, spacing } from '../theme';
import {
  brightnessStops,
  hexToHsv,
  hsvToHex,
  hueSpectrumStops,
  meetsCategoryContrast,
  saturationStops,
} from '../utils/color';

type Props = {
  visible: boolean;
  /** The colour the dialog opens at, as `#rrggbb`. Read each time the dialog opens. */
  color: string;
  /** Called with a lowercase opaque `#rrggbb` that clears the contrast rule. The caller closes. */
  onUse: (color: string) => void;
  /** Cancel, the backdrop and the Back button. The caller closes. */
  onCancel: () => void;
};

const HUE_STOPS = hueSpectrumStops();
const PREVIEW_SIZE = 64;

export default function CustomColorDialog({ visible, color, onUse, onCancel }: Props) {
  const [hsv, setHsv] = useState(() => hexToHsv(color));
  const [wasVisible, setWasVisible] = useState(visible);
  // While a slider is held the scroll view must not scroll under the finger.
  const [sliding, setSliding] = useState(false);

  // Each opening starts again from the current colour, not from where the last one ended.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setHsv(hexToHsv(color));
      // A slider unmounted mid-drag never calls its end callback.
      setSliding(false);
    }
  }

  const draft = hsvToHex(hsv);
  const readable = meetsCategoryContrast(draft, colors.background);
  const saturationTrack = useMemo(() => saturationStops(hsv), [hsv]);
  const brightnessTrack = useMemo(() => brightnessStops(hsv), [hsv]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        {/* A Pressable of its own, so a press inside the dialog does not reach the backdrop. */}
        <Pressable style={styles.dialog} accessibilityViewIsModal>
          <Text style={styles.title} accessibilityRole="header">
            Custom colour
          </Text>
          <ScrollView scrollEnabled={!sliding} keyboardShouldPersistTaps="handled">
            <View style={styles.body}>
              <ColorSlider
                label="Hue"
                valueLabel={`${Math.round(hsv.h)}°`}
                value={hsv.h}
                min={0}
                max={360}
                step={15}
                stops={HUE_STOPS}
                onChange={h => setHsv(current => ({ ...current, h }))}
                onSlidingChange={setSliding}
              />
              <ColorSlider
                label="Saturation"
                valueLabel={`${Math.round(hsv.s * 100)}%`}
                value={hsv.s * 100}
                min={0}
                max={100}
                step={5}
                stops={saturationTrack}
                onChange={s => setHsv(current => ({ ...current, s: s / 100 }))}
                onSlidingChange={setSliding}
              />
              <ColorSlider
                label="Brightness"
                valueLabel={`${Math.round(hsv.v * 100)}%`}
                value={hsv.v * 100}
                min={0}
                max={100}
                step={5}
                stops={brightnessTrack}
                onChange={v => setHsv(current => ({ ...current, v: v / 100 }))}
                onSlidingChange={setSliding}
              />
              <View style={styles.previewRow}>
                <View
                  accessible
                  accessibilityRole="image"
                  accessibilityLabel={`Colour preview ${draft}`}
                  style={[styles.preview, { backgroundColor: draft }]}
                />
                <Text
                  accessibilityLiveRegion="polite"
                  style={[styles.status, !readable && styles.statusError]}>
                  {readable ? draft : 'Too dark for the icon. Try a lighter colour.'}
                </Text>
              </View>
            </View>
          </ScrollView>
          <Button label="Use colour" disabled={!readable} onPress={() => onUse(draft)} />
          <Button label="Cancel" variant="secondary" onPress={onCancel} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000000aa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  body: {
    gap: spacing.sm,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: PREVIEW_SIZE,
  },
  preview: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  status: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
  },
  statusError: {
    color: colors.danger,
  },
});
