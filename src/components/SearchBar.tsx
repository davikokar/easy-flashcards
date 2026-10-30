import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import MenuIcon from './MenuIcons';
import { colors, radius, spacing } from '../theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  /** `Search decks` or `Search sessions`. */
  placeholder: string;
  /** Differs from the Search button's label so the two can be told apart. */
  inputLabel?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  onClose,
  placeholder,
  inputLabel = 'Search text',
}: Props) {
  return (
    <View style={styles.bar}>
      <MenuIcon name="search" color={colors.textMuted} />
      <TextInput
        accessibilityLabel={inputLabel}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
        selectionColor={colors.primary}
        style={styles.input}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close search"
        hitSlop={4}
        onPress={onClose}
        style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
        <MenuIcon name="close" color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
    color: colors.text,
  },
  close: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  pressed: {
    opacity: 0.5,
  },
});
