import React, { useCallback, useRef, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import Button from './Button';
import KebabMenu from './KebabMenu';
import type { MenuItem } from './MenuSheet';
import { exportSampleDeck } from '../services/exportSampleDeck';
import { colors, radius, spacing } from '../theme';
import { describeSampleDeckExport } from '../utils/sampleDeck';

type Props = {
  variant?: 'plain' | 'boxed';
  /** Screen-specific items, shown before the common ones. */
  extraItems?: MenuItem[];
};

export default function AppMenu({ variant, extraItems = [] }: Props) {
  const [isExportVisible, setIsExportVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportInFlight = useRef(false);

  const handleExport = useCallback(async () => {
    // The ref, not the state, is the guard: state is stale until the next render.
    if (exportInFlight.current) {
      return;
    }
    exportInFlight.current = true;
    setIsExporting(true);
    try {
      const outcomes = await exportSampleDeck();
      const alert = describeSampleDeckExport(outcomes);
      if (alert === null) {
        return;
      }
      if (outcomes.some(outcome => outcome.status === 'saved')) {
        setIsExportVisible(false);
      }
      Alert.alert(alert.title, alert.message);
    } finally {
      exportInFlight.current = false;
      setIsExporting(false);
    }
  }, []);

  return (
    <>
      <KebabMenu
        accessibilityLabel="App menu"
        variant={variant}
        items={[
          ...extraItems,
          {
            label: 'Export sample deck',
            icon: 'export',
            onPress: () => setIsExportVisible(true),
          },
          {
            label: 'Settings',
            icon: 'settings',
            onPress: () => Alert.alert('Settings', 'Settings are not available yet.'),
          },
        ]}
      />

      <Modal
        transparent
        visible={isExportVisible}
        animationType="fade"
        onRequestClose={() => setIsExportVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setIsExportVisible(false)}>
          <Pressable style={styles.dialog}>
            <Text style={styles.title}>Export sample deck</Text>
            <ScrollView>
              <Text style={styles.body}>
                This saves the same sample deck as two files, CSV and JSON. You are asked where to
                save each one and can cancel either to skip it.
                {'\n\n'}
                CSV: lines starting with # (title, description, category) are skipped on import,
                then a {'"question"'} / {'"answer"'} header and one card per row, separated here by
                semicolons (a comma, a tab or another single symbol also works).
                {'\n\n'}
                JSON: also brings back the title, description and category.
                {'\n\n'}
                Basic HTML such as {'<b>'}, {'<i>'} and {'<br />'} is allowed on either side of a
                card.
              </Text>
            </ScrollView>
            <Button
              label="Export"
              onPress={handleExport}
              loading={isExporting}
              disabled={isExporting}
            />
            <Button
              label="Cancel"
              variant="secondary"
              onPress={() => setIsExportVisible(false)}
              disabled={isExporting}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  body: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
