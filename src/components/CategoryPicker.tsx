import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import CategoryTile from './CategoryTile';
import type { Category } from '../types';
import { colors, radius, spacing } from '../theme';

type Props = {
  visible: boolean;
  /** Every category to offer, already merged and sorted alphabetically. */
  categories: Category[];
  /** The category the draft holds, or null for none. */
  selectedId: string | null;
  /** Picking also calls `onClose`; it changes nothing but what the caller does with this. */
  onSelect: (id: string | null) => void;
  onClose: () => void;
};

const COLUMNS = 3;

export default function CategoryPicker({
  visible,
  categories,
  selectedId,
  onSelect,
  onClose,
}: Props) {
  const pick = (id: string | null) => {
    onSelect(id);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* A Pressable of its own, so a press inside the dialog does not reach the backdrop. */}
        <Pressable style={styles.dialog} accessibilityViewIsModal>
          <Text style={styles.title} accessibilityRole="header">
            Category
          </Text>
          <ScrollView>
            <View
              accessibilityRole="radiogroup"
              accessibilityLabel="Category picker"
              style={styles.grid}>
              <View style={styles.cell}>
                <CategoryTile
                  none
                  name="No category"
                  accessibilityLabel="No category"
                  selected={selectedId === null}
                  onPress={() => pick(null)}
                />
              </View>
              {categories.map(category => (
                <View key={category.id} style={styles.cell}>
                  <CategoryTile
                    name={category.name}
                    color={category.color}
                    icon={category.icon}
                    selected={category.id === selectedId}
                    onPress={() => pick(category.id)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
          <Button label="Cancel" variant="secondary" onPress={onClose} />
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
  // The negative margin cancels the cells' side padding, so tiles meet the dialog's content edge.
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  cell: {
    width: `${100 / COLUMNS}%`,
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.md,
  },
});
