import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnswerIcon } from './AnswerIcons';
import CategorySquare from './CategorySquare';
import MenuIcon, { MenuIconName } from './MenuIcons';
import type { Category } from '../types';
import { colors, radius, spacing } from '../theme';

export type MenuItem = {
  label: string;
  onPress: () => void;
  icon?: MenuIconName;
  destructive?: boolean;
  /** For a menu that marks a choice: primary label and a trailing tick when true. Leave unset elsewhere. */
  selected?: boolean;
};

type Props = {
  visible: boolean;
  items: MenuItem[];
  onClose: () => void;
  title?: string;
  /** Drawn before the title; ignored without a title. Nothing, and no gap, when absent. */
  category?: Category | null;
};

const TITLE_SQUARE_SIZE = 28;
const SELECTED_TICK_SIZE = 20;

export default function MenuSheet({ visible, items, onClose, title, category }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.sm }]}
          onStartShouldSetResponder={() => true}>
          {title ? (
            <>
              <View style={styles.titleRow}>
                {category ? <CategorySquare category={category} size={TITLE_SQUARE_SIZE} /> : null}
                <Text style={styles.title} numberOfLines={2}>
                  {title}
                </Text>
              </View>
              <View style={styles.separator} />
            </>
          ) : null}
          {items.map((item, index) => (
            <React.Fragment key={item.label}>
              {index > 0 ? <View style={styles.separator} /> : null}
              <Pressable
                accessibilityRole="button"
                accessibilityState={
                  item.selected === undefined ? undefined : { selected: item.selected }
                }
                onPress={() => {
                  onClose();
                  item.onPress();
                }}
                style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
                {item.icon ? (
                  <MenuIcon
                    name={item.icon}
                    color={item.destructive ? colors.danger : colors.textMuted}
                  />
                ) : null}
                <Text
                  style={[
                    styles.itemLabel,
                    item.selected !== undefined && styles.itemLabelFill,
                    item.selected && styles.itemSelected,
                    item.destructive && styles.itemDestructive,
                  ]}>
                  {item.label}
                </Text>
                {item.selected ? (
                  <AnswerIcon name="tick" color={colors.primary} size={SELECTED_TICK_SIZE} />
                ) : null}
              </Pressable>
            </React.Fragment>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  itemPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  itemLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  // Pushes the trailing tick to the row's end; only rows that can be selected use it.
  itemLabelFill: {
    flex: 1,
  },
  itemSelected: {
    color: colors.primary,
  },
  itemDestructive: {
    color: colors.danger,
  },
});
