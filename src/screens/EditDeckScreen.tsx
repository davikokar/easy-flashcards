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
import EmptyState from '../components/EmptyState';
import FormField from '../components/FormField';
import { useDecks } from '../state/DecksContext';
import { DecksStackParamList } from '../navigation/types';
import { Deck } from '../types';
import {
  CardDraft,
  DeckEdit,
  draftsOf,
  firstIncompleteCard,
  isDeckEditChanged,
  removedCardIds,
} from '../utils/deckEdit';
import { colors, spacing } from '../theme';

type Props = NativeStackScreenProps<DecksStackParamList, 'EditDeck'>;

// A draft card plus a key that is stable while the user edits, whether or not the card is saved yet.
type KeyedDraft = CardDraft & { key: string };

export default function EditDeckScreen({ navigation, route }: Props) {
  const { getDeck } = useDecks();
  const deck = getDeck(route.params.deckId);

  if (!deck) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Deck not found"
          message="This deck no longer exists."
          actionLabel="Back to decks"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }
  return <DeckEditor deck={deck} navigation={navigation} />;
}

function DeckEditor({
  deck,
  navigation,
}: {
  deck: Deck;
  navigation: NativeStackNavigationProp<DecksStackParamList, 'EditDeck'>;
}) {
  const { updateDeck } = useDecks();
  const [name, setName] = useState(deck.name);
  const [description, setDescription] = useState(deck.description);
  const [cards, setCards] = useState<KeyedDraft[]>(() =>
    draftsOf(deck).map(draft => ({ ...draft, key: draft.id as string })),
  );
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const scrollToEndOnResize = useRef(false);
  const newCardCount = useRef(0);
  const listRef = useRef<FlatList<KeyedDraft>>(null);
  // Set once the edit is saved, so leaving the screen afterwards is not treated as discarding it.
  const saved = useRef(false);

  const edit = useMemo<DeckEdit>(
    () => ({
      name: name.trim(),
      description: description.trim(),
      cards: cards.map(({ id, question, answer }) => ({ id, question, answer })),
    }),
    [name, description, cards],
  );
  const isChanged = useMemo(() => isDeckEditChanged(deck, edit), [deck, edit]);

  const save = useCallback(() => {
    if (edit.name === '') {
      Alert.alert('Title needed', 'Give the deck a title.');
      return;
    }
    const incomplete = firstIncompleteCard(edit.cards);
    if (incomplete !== null) {
      Alert.alert('Card incomplete', `Card ${incomplete} needs both a question and an answer.`);
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
      'Remove cards?',
      `${removed} card${removed === 1 ? '' : 's'} will be removed from the deck, together with ` +
        `${removed === 1 ? 'its' : 'their'} statistics.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', style: 'destructive', onPress: commit },
      ],
    );
  }, [deck, edit, navigation, updateDeck]);

  const saveButton = useMemo(
    () => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save deck"
        accessibilityState={{ disabled: !isChanged }}
        disabled={!isChanged}
        hitSlop={8}
        onPress={save}
        style={({ pressed }) => [pressed && styles.pressed]}>
        <Text style={[styles.save, !isChanged && styles.saveDisabled]}>Save</Text>
      </Pressable>
    ),
    [isChanged, save],
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
        Alert.alert('Discard changes?', 'Your edits to this deck have not been saved.', [
          { text: 'Keep editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(event.data.action),
          },
        ]);
      }),
    [navigation, isChanged],
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
      <FormField label="Title" value={name} onChangeText={setName} />
      <FormField
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Optional"
      />
      <Text style={styles.sectionTitle}>
        {cards.length} card{cards.length === 1 ? '' : 's'}
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
        ListFooterComponent={<Button variant="secondary" label="Add card" onPress={addCard} />}
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
