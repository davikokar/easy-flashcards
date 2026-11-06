import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import CardEditor from '../components/CardEditor';
import CategoryField from '../components/CategoryField';
import CategoryPicker from '../components/CategoryPicker';
import EmptyState from '../components/EmptyState';
import FormField from '../components/FormField';
import { useT } from '../i18n/I18nProvider';
import { useDecks } from '../state/DecksContext';
import { DecksStackParamList } from '../navigation/types';
import { Deck } from '../types';
import {
  CardDraft,
  DeckEdit,
  draftsOf,
  firstIncompleteCard,
  isDeckEditChanged,
  isNewDeckDraftBlank,
  newDeckInputOf,
  removedCardIds,
} from '../utils/deckEdit';
import { findCategory, getAllCategories } from '../utils/categories';
import { colors, spacing } from '../theme';

// One component serves both routes: EditDeck edits a stored deck, NewDeck creates one by hand.
type Props =
  | NativeStackScreenProps<DecksStackParamList, 'EditDeck'>
  | NativeStackScreenProps<DecksStackParamList, 'NewDeck'>;

// A draft card plus a key that is stable while the user edits, whether or not the card is saved yet.
type KeyedDraft = CardDraft & { key: string };

export default function EditDeckScreen({ navigation, route }: Props) {
  const { getDeck } = useDecks();
  const t = useT();

  if (route.name === 'NewDeck') {
    return <DeckEditor deck={null} navigation={navigation} />;
  }

  const deck = getDeck(route.params.deckId);

  if (!deck) {
    return (
      <View style={styles.container}>
        <EmptyState
          title={t('editDeck.deckNotFound.title')}
          message={t('editDeck.deckNotFound.message')}
          actionLabel={t('editDeck.deckNotFound.backButton')}
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }
  return <DeckEditor deck={deck} navigation={navigation} />;
}

// `deck` is null in new-deck mode: the form starts blank and Save creates the deck.
function DeckEditor({
  deck,
  navigation,
}: {
  deck: Deck | null;
  navigation: NativeStackNavigationProp<DecksStackParamList, 'EditDeck' | 'NewDeck'>;
}) {
  const { addDeck, updateDeck, categories } = useDecks();
  const t = useT();
  const [name, setName] = useState(deck ? deck.name : '');
  const [description, setDescription] = useState(deck ? deck.description : '');
  const [draftCategoryId, setDraftCategoryId] = useState<string | null>(
    deck ? deck.categoryId : null,
  );
  const [pickerVisible, setPickerVisible] = useState(false);
  const [cards, setCards] = useState<KeyedDraft[]>(() =>
    deck ? draftsOf(deck).map(draft => ({ ...draft, key: draft.id as string })) : [],
  );
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const scrollToEndOnResize = useRef(false);
  const newCardCount = useRef(0);
  const listRef = useRef<FlatList<KeyedDraft>>(null);
  // Set once the edit is saved, so leaving the screen afterwards is not treated as discarding it.
  const saved = useRef(false);

  // A category deleted elsewhere mid-edit resolves to null, for the draft and for the deck's own id alike.
  const category = useMemo(
    () => findCategory(draftCategoryId, categories),
    [draftCategoryId, categories],
  );
  const categoryId = category ? category.id : null;
  const storedCategoryId = useMemo(() => {
    const stored = findCategory(deck ? deck.categoryId : null, categories);
    return stored ? stored.id : null;
  }, [deck, categories]);
  const allCategories = useMemo(() => getAllCategories(categories, t), [categories, t]);

  const edit = useMemo<DeckEdit>(
    () => ({
      name: name.trim(),
      description: description.trim(),
      categoryId,
      cards: cards.map(({ id, question, answer }) => ({ id, question, answer })),
    }),
    [name, description, categoryId, cards],
  );
  const isChanged = useMemo(
    () =>
      deck
        ? isDeckEditChanged({ ...deck, categoryId: storedCategoryId }, edit)
        : !isNewDeckDraftBlank(edit),
    [deck, storedCategoryId, edit],
  );

  const save = useCallback(() => {
    if (edit.name === '') {
      Alert.alert(t('editDeck.titleNeededAlert.title'), t('editDeck.titleNeededAlert.message'));
      return;
    }
    const incomplete = firstIncompleteCard(edit.cards);
    if (incomplete !== null) {
      Alert.alert(
        t('editDeck.cardIncompleteAlert.title'),
        t('editDeck.cardIncompleteAlert.message', { number: incomplete }),
      );
      return;
    }
    if (!deck) {
      // addDeck mints new ids on every call, so a repeated press must not reach it.
      if (saved.current) {
        return;
      }
      saved.current = true;
      addDeck(newDeckInputOf(edit));
      navigation.goBack();
      return;
    }
    const commit = () => {
      saved.current = true;
      updateDeck(deck.id, edit);
      navigation.goBack();
    };
    const removed = removedCardIds(deck, edit.cards).length;
    if (removed === 0) {
      commit();
      return;
    }
    Alert.alert(
      t('editDeck.removeCardsAlert.title'),
      t('editDeck.removeCardsAlert.message', { count: removed }),
      [
        { text: t('common.actions.cancel'), style: 'cancel' },
        { text: t('common.actions.save'), style: 'destructive', onPress: commit },
      ],
    );
  }, [deck, edit, navigation, addDeck, updateDeck, t]);

  const saveButton = useMemo(
    () => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('editDeck.editDeckScreen.saveButtonA11yLabel')}
        accessibilityState={{ disabled: !isChanged }}
        disabled={!isChanged}
        hitSlop={8}
        onPress={save}
        style={({ pressed }) => [pressed && styles.pressed]}>
        <Text style={[styles.save, !isChanged && styles.saveDisabled]}>
          {t('common.actions.save')}
        </Text>
      </Pressable>
    ),
    [isChanged, save, t],
  );

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => saveButton });
  }, [navigation, saveButton]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', event => {
        if (!isChanged || saved.current) {
          return;
        }
        event.preventDefault();
        Alert.alert(
          t('editDeck.discardChangesAlert.title'),
          deck
            ? t('editDeck.discardChangesAlert.messageEdit')
            : t('editDeck.discardChangesAlert.messageNew'),
          [
            { text: t('common.actions.keepEditing'), style: 'cancel' },
            {
              text: t('common.actions.discard'),
              style: 'destructive',
              onPress: () => navigation.dispatch(event.data.action),
            },
          ],
        );
      }),
    [navigation, isChanged, deck, t],
  );

  const changeCard = useCallback(
    (cardKey: string, field: 'question' | 'answer', text: string) =>
      setCards(previous =>
        previous.map(card => (card.key === cardKey ? { ...card, [field]: text } : card)),
      ),
    [],
  );

  const removeCard = useCallback(
    (cardKey: string) => setCards(previous => previous.filter(card => card.key !== cardKey)),
    [],
  );

  const addCard = useCallback(() => {
    newCardCount.current += 1;
    const key = `new-${newCardCount.current}`;
    setCards(previous => [...previous, { key, id: null, question: '', answer: '' }]);
    setFocusKey(key);
    // Waits for the keyboard's padding to be laid out before scrolling.
    scrollToEndOnResize.current = true;
    setTimeout(() => {
      scrollToEndOnResize.current = false;
    }, 2000);
  }, []);

  const header = (
    <View style={styles.header}>
      <FormField
        label={t('editDeck.editDeckScreen.titleLabel')}
        value={name}
        onChangeText={setName}
        autoFocus={!deck}
      />
      <FormField
        label={t('editDeck.editDeckScreen.descriptionLabel')}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder={t('editDeck.editDeckScreen.descriptionPlaceholder')}
      />
      <CategoryField
        category={category}
        onPress={() => {
          Keyboard.dismiss();
          setPickerVisible(true);
        }}
      />
      <Text style={styles.sectionTitle}>
        {t('common.counts.cards', { count: cards.length })}
      </Text>
    </View>
  );

  const scrollToNewCard = () => {
    if (scrollToEndOnResize.current && Keyboard.isVisible()) {
      scrollToEndOnResize.current = false;
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    // The keyboard overlays the window on this device instead of resizing it.
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <FlatList
        ref={listRef}
        data={cards}
        keyExtractor={card => card.key}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        onContentSizeChange={scrollToNewCard}
        onLayout={scrollToNewCard}
        ListHeaderComponent={header}
        ListFooterComponent={
          <Button
            variant="secondary"
            label={t('editDeck.editDeckScreen.addCardButton')}
            onPress={addCard}
          />
        }
        renderItem={({ item, index }) => (
          <CardEditor
            cardKey={item.key}
            index={index + 1}
            question={item.question}
            answer={item.answer}
            autoFocus={item.key === focusKey}
            onChange={changeCard}
            onRemove={removeCard}
          />
        )}
      />
      <CategoryPicker
        visible={pickerVisible}
        categories={allCategories}
        selectedId={categoryId}
        onSelect={setDraftCategoryId}
        onClose={() => setPickerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  header: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  save: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  saveDisabled: {
    color: colors.textDim,
  },
  pressed: {
    opacity: 0.5,
  },
});
