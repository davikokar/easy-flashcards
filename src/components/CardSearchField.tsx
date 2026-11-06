import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import MenuIcon from './MenuIcons';
import { useT } from '../i18n/I18nProvider';
import { colors, radius, spacing } from '../theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  /** Empties the query; the field stays where it is. */
  onClear: () => void;
};

export default function CardSearchField({ value, onChangeText, onClear }: Props) {
  const t = useT();
  return (
    <View style={styles.field}>
      <MenuIcon name="search" color={colors.textMuted} />
      <TextInput
        accessibilityLabel={t('deckStats.cardSearchField.searchA11yLabel')}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        value={value}
        onChangeText={onChangeText}
        placeholder={t('deckStats.cardSearchField.searchPlaceholder')}
        placeholderTextColor={colors.textDim}
        selectionColor={colors.primary}
        style={styles.input}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('deckStats.cardSearchField.clearA11yLabel')}
          hitSlop={4}
          onPress={onClear}
          style={({ pressed }) => [styles.clear, pressed && styles.pressed]}>
          <MenuIcon name="close" color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
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
  clear: {
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
