import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { AnswerIcon } from './AnswerIcons';
import Button from './Button';
import { colors, radius, spacing } from '../theme';

type Props = {
  visible: boolean;
  deckName: string;
  inverted: boolean;
  shuffled: boolean;
  onInvertedChange: (value: boolean) => void;
  onShuffledChange: (value: boolean) => void;
  onStart: () => void;
  onCancel: () => void;
};

type OptionRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function OptionRow({ label, description, checked, onChange }: OptionRowProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <AnswerIcon name="tick" color={colors.background} size={18} /> : null}
      </View>
      <View style={styles.optionText}>
        <Text style={styles.optionLabel}>{label}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
    </Pressable>
  );
}

export default function SessionSetupDialog({
  visible,
  deckName,
  inverted,
  shuffled,
  onInvertedChange,
  onShuffledChange,
  onStart,
  onCancel,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>Start session</Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {deckName}
            </Text>
          </View>
          <OptionRow
            label="Inverted"
            description="Show the answer first and the question on the back."
            checked={inverted}
            onChange={onInvertedChange}
          />
          <OptionRow
            label="Shuffle"
            description="Study the cards in random order."
            checked={shuffled}
            onChange={onShuffledChange}
          />
          <Button label="Start" onPress={onStart} />
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 48,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  optionPressed: {
    opacity: 0.75,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  optionDescription: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
