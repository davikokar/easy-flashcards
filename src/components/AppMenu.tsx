import React, { useCallback, useRef, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import Button from './Button';
import KebabMenu from './KebabMenu';
import type { MenuItem } from './MenuSheet';
import { useT } from '../i18n/I18nProvider';
import { exportSampleDeck } from '../services/exportSampleDeck';
import { colors, radius, spacing } from '../theme';
import { describeSampleDeckExport } from '../utils/sampleDeck';

type Props = {
  variant?: 'plain' | 'boxed';
  /** Screen-specific items, shown before the common ones. */
  extraItems?: MenuItem[];
};

export default function AppMenu({ variant, extraItems = [] }: Props) {
  const t = useT();
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
      const alert = describeSampleDeckExport(outcomes, t);
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
  }, [t]);

  return (
    <>
      <KebabMenu
        accessibilityLabel={t('shell.appMenu.triggerA11yLabel')}
        variant={variant}
        items={[
          ...extraItems,
          {
            label: t('shell.appMenu.exportSampleDeckItem'),
            icon: 'export',
            onPress: () => setIsExportVisible(true),
          },
          {
            label: t('shell.appMenu.settingsItem'),
            icon: 'settings',
            onPress: () =>
              Alert.alert(t('shell.settingsAlert.title'), t('shell.settingsAlert.message')),
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
            <Text style={styles.title}>{t('shell.exportSampleDeckDialog.title')}</Text>
            <ScrollView>
              <Text style={styles.body}>{t('shell.exportSampleDeckDialog.body')}</Text>
            </ScrollView>
            <Button
              label={t('common.actions.export')}
              onPress={handleExport}
              loading={isExporting}
              disabled={isExporting}
            />
            <Button
              label={t('common.actions.cancel')}
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
