import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnswerIcon } from './AnswerIcons';
import Button from './Button';
import { colors, radius, spacing } from '../theme';

export type LanguageOption = {
  /** A language code, or null for following the device. */
  code: string | null;
  label: string;
};

type Props = {
  visible: boolean;
  title: string;
  options: LanguageOption[];
  selectedCode: string | null;
  closeLabel: string;
  onSelect: (code: string | null) => void;
  onClose: () => void;
};

const SELECTED_TICK_SIZE = 20;

export default function LanguageDialog({
  visible,
  title,
  options,
  selectedCode,
  closeLabel,
  onSelect,
  onClose,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView style={styles.list} accessibilityRole="radiogroup">
            {options.map(option => {
              const selected = option.code === selectedCode;
              return (
                <Pressable
                  key={option.code ?? 'system'}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected, selected }}
                  onPress={() => onSelect(option.code)}
                  style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}>
                  <Text style={[styles.optionLabel, selected && styles.optionSelected]}>
                    {option.label}
                  </Text>
                  {selected ? (
                    <View>
                      <AnswerIcon name="tick" color={colors.primary} size={SELECTED_TICK_SIZE} />
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
          <Button label={closeLabel} variant="secondary" onPress={onClose} />
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
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  list: {
    flexGrow: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 48,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  optionPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  optionLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  optionSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
