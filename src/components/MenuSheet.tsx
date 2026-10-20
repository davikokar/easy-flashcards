import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MenuIcon, { MenuIconName } from './MenuIcons';
import { colors, radius, spacing } from '../theme';

export type MenuItem = {
  label: string;
  onPress: () => void;
  icon?: MenuIconName;
  destructive?: boolean;
};

type Props = {
  visible: boolean;
  items: MenuItem[];
  onClose: () => void;
  title?: string;
};

export default function MenuSheet({ visible, items, onClose, title }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.sm }]}
          onStartShouldSetResponder={() => true}>
          {title ? (
            <>
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
              <View style={styles.separator} />
            </>
          ) : null}
          {items.map((item, index) => (
            <React.Fragment key={item.label}>
              {index > 0 ? <View style={styles.separator} /> : null}
              <Pressable
                accessibilityRole="button"
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
                <Text style={[styles.itemLabel, item.destructive && styles.itemDestructive]}>
                  {item.label}
                </Text>
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
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
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
  itemDestructive: {
    color: colors.danger,
  },
});
