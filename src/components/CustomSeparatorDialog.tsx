import React from 'react';
import { KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import FormField from './FormField';
import { colors, radius, spacing } from '../theme';
import type { SeparatorError } from '../utils/deckExport';

type Props = {
  visible: boolean;
  deckName: string;
  value: string;
  onChangeText: (text: string) => void;
  /** Why `value` cannot be used, or null when it can. The caller validates; this only displays. */
  error: SeparatorError | null;
  /** True while the file is being written: Export shows its spinner and ignores presses. */
  exporting: boolean;
  onExport: () => void;
  /** Cancel, the backdrop and the Back button. The caller closes. */
  onCancel: () => void;
};

const MESSAGES: Record<SeparatorError, string> = {
  empty: 'Enter one character.',
  tooLong: 'Use a single character.',
  reserved: 'Quotes, # and line breaks cannot be used.',
  whitespace: 'Spaces are not allowed. Use the Tab option for a tab.',
  alphanumeric: 'Letters and digits are not allowed.',
};

export default function CustomSeparatorDialog({
  visible,
  deckName,
  value,
  onChangeText,
  error,
  exporting,
  onExport,
  onCancel,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      {/* The keyboard overlays the window rather than resizing it, so padding lifts the dialog clear. */}
      <KeyboardAvoidingView behavior="padding" style={styles.scrim}>
        <Pressable style={styles.backdrop} onPress={onCancel}>
          {/* A Pressable of its own, so a press inside the dialog does not reach the backdrop. */}
          <Pressable style={styles.dialog} accessibilityViewIsModal>
            <View style={styles.header}>
              <Text style={styles.title}>Custom separator</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {deckName}
              </Text>
            </View>
            <View style={styles.fieldGroup}>
              <FormField
                label="Separator"
                value={value}
                onChangeText={onChangeText}
                placeholder="For example |"
                autoFocus
              />
              {/* Always rendered, so the buttons do not jump when the message appears. An empty field
                  is a prompt, not a mistake, so it is not red. */}
              <Text
                accessibilityLiveRegion="polite"
                style={[styles.message, error !== null && error !== 'empty' && styles.messageError]}>
                {error === null ? ' ' : MESSAGES[error]}
              </Text>
            </View>
            <Button
              label="Export"
              onPress={onExport}
              disabled={error !== null}
              loading={exporting}
            />
            <Button label="Cancel" variant="secondary" onPress={onCancel} />
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: '#000000aa',
  },
  backdrop: {
    flex: 1,
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
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  message: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    minHeight: 36,
  },
  messageError: {
    color: colors.danger,
  },
});
