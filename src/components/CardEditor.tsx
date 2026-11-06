import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FormField from './FormField';
import MenuIcon from './MenuIcons';
import { useT } from '../i18n/I18nProvider';
import { colors, radius, spacing } from '../theme';

type Props = {
  cardKey: string;
  /** 1-based position in the deck. */
  index: number;
  question: string;
  answer: string;
  autoFocus: boolean;
  onChange: (cardKey: string, field: 'question' | 'answer', text: string) => void;
  onRemove: (cardKey: string) => void;
};

function CardEditor({ cardKey, index, question, answer, autoFocus, onChange, onRemove }: Props) {
  const t = useT();
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('editDeck.cardEditor.title', { number: index })}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('editDeck.cardEditor.removeButtonA11yLabel', { number: index })}
          hitSlop={4}
          onPress={() => onRemove(cardKey)}
          style={({ pressed }) => [styles.remove, pressed && styles.pressed]}>
          <MenuIcon name="delete" color={colors.danger} />
        </Pressable>
      </View>
      <FormField
        label={t('editDeck.cardEditor.questionLabel')}
        accessibilityLabel={t('editDeck.cardEditor.questionA11yLabel', { number: index })}
        value={question}
        onChangeText={text => onChange(cardKey, 'question', text)}
        autoFocus={autoFocus}
        multiline
      />
      <FormField
        label={t('editDeck.cardEditor.answerLabel')}
        accessibilityLabel={t('editDeck.cardEditor.answerA11yLabel', { number: index })}
        value={answer}
        onChangeText={text => onChange(cardKey, 'answer', text)}
        multiline
      />
    </View>
  );
}

export default React.memo(CardEditor);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  remove: {
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
