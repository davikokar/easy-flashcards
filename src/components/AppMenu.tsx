import React, { useCallback, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text } from 'react-native';
import Button from './Button';
import KebabMenu from './KebabMenu';
import { ExportCancelledError, exportSampleDeck } from '../services/exportSampleDeck';
import { colors, radius, spacing } from '../theme';

export default function AppMenu() {
  const [isExportVisible, setIsExportVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleShare = useCallback(async () => {
    setIsExporting(true);
    try {
      const name = await exportSampleDeck();
      setIsExportVisible(false);
      Alert.alert('Sample deck exported', `Saved as ${name ?? 'sample-deck.csv'}.`);
    } catch (error) {
      if (error instanceof ExportCancelledError) {
        return;
      }
      Alert.alert(
        'Export failed',
        error instanceof Error ? error.message : 'Could not export the sample deck.',
      );
    } finally {
      setIsExporting(false);
    }
  }, []);

  return (
    <>
      <KebabMenu
        accessibilityLabel="App menu"
        items={[
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
            <Text style={styles.body}>
              This exports a small sample CSV file so you can see how a deck has to be formatted
              before importing it: one card per row, with the question and the answer separated by a
              semicolon or a tab. Basic HTML such as {'<b>'}, {'<i>'} and {'<br />'} is allowed.
            </Text>
            <Button
              label="Share"
              onPress={handleShare}
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
