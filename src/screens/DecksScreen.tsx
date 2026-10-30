import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import DeckCard from '../components/DeckCard';
import EmptyState from '../components/EmptyState';
import HeaderToolbar from '../components/HeaderToolbar';
import MenuSheet from '../components/MenuSheet';
import SearchBar from '../components/SearchBar';
import SessionSetupDialog from '../components/SessionSetupDialog';
import { useDecks } from '../state/DecksContext';
import { DecksStackParamList, RootTabParamList } from '../navigation/types';
import { Deck } from '../types';
import {
  EMPTY_SESSION_SUMMARY,
  answerShares,
  formatDate,
  getDeckStats,
  summarizeSessionsByDeck,
} from '../utils/stats';
import { CsvImportError } from '../utils/csv';
import { filterByTitle } from '../utils/search';
import { shuffle } from '../utils/shuffle';
import { ImportCancelledError, pickAndParseCsv } from '../services/importDeck';
import { colors, radius, spacing } from '../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<DecksStackParamList, 'DecksList'>,
  BottomTabScreenProps<RootTabParamList>
>;

const showFilterStub = () => Alert.alert('Filter', 'Filtering decks is not available yet.');

const START_DEBOUNCE_MS = 1000;

export default function DecksScreen({ navigation }: Props) {
  const { decks, sessions, error, addDeck, deleteDeck, startSession } = useDecks();
  const [isImporting, setIsImporting] = useState(false);
  const lastStartAt = useRef(0);
  const [openMenu, setOpenMenu] = useState<'add' | 'format' | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  // The deck id stays set after the dialog closes so its title does not blank during the fade-out.
  const [setupDeckId, setSetupDeckId] = useState<string | null>(null);
  const [setupVisible, setSetupVisible] = useState(false);
  const [setupInverted, setSetupInverted] = useState(false);
  const [setupShuffled, setSetupShuffled] = useState(false);
  const sessionsByDeck = useMemo(() => summarizeSessionsByDeck(sessions), [sessions]);
  const visibleDecks = useMemo(() => filterByTitle(decks, query, deck => deck.name), [decks, query]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery('');
  }, []);
  const toggleSearch = useCallback(() => {
    if (searchOpen) {
      closeSearch();
    } else {
      setSearchOpen(true);
    }
  }, [searchOpen, closeSearch]);

  const toolbar = useMemo(
    () => (
      <HeaderToolbar
        onSearch={toggleSearch}
        searchActive={searchOpen}
        onFilter={showFilterStub}
        searchLabel="Search decks"
        filterLabel="Filter decks"
      />
    ),
    [toggleSearch, searchOpen],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.background },
      headerTitleStyle: { color: colors.text, fontSize: 24, fontWeight: '700' },
      headerRight: () => toolbar,
    });
  }, [navigation, toolbar]);

  const handleImport = useCallback(async () => {
    setIsImporting(true);
    try {
      const imported = await pickAndParseCsv();
      const deck = addDeck({
        name: imported.deckName,
        sourceFileName: imported.fileName,
        cards: imported.parsed.cards,
      });
      const skipped = imported.parsed.skippedRows;
      Alert.alert(
        'Deck imported',
        `"${deck.name}" now has ${deck.cards.length} card${deck.cards.length === 1 ? '' : 's'}.` +
          (skipped > 0 ? `\n${skipped} incomplete row${skipped === 1 ? '' : 's'} skipped.` : ''),
      );
    } catch (importError) {
      if (importError instanceof ImportCancelledError) {
        return;
      }
      Alert.alert(
        'Import failed',
        importError instanceof CsvImportError
          ? importError.message
          : importError instanceof Error
            ? importError.message
            : 'Unknown error while importing the file.',
      );
    } finally {
      setIsImporting(false);
    }
  }, [addDeck]);

  const confirmDelete = useCallback(
    (deck: Deck) => {
      Alert.alert(
        'Delete deck',
        `Delete "${deck.name}", its sessions and all of its statistics?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteDeck(deck.id) },
        ],
      );
    },
    [deleteDeck],
  );

  const handleStartSession = useCallback(
    (deck: Deck, inverted = false, shuffled = false) => {
      if (deck.cards.length === 0) {
        Alert.alert('Empty deck', 'This deck has no cards to learn.');
        return;
      }
      // A double tap would otherwise start two sessions before the navigation lands.
      if (Date.now() - lastStartAt.current < START_DEBOUNCE_MS) {
        return;
      }
      lastStartAt.current = Date.now();
      const session = startSession(
        deck,
        { inverted },
        shuffled ? shuffle(deck.cards.map(card => card.id)) : undefined,
      );
      navigation.navigate('LearnTab', {
        screen: 'Study',
        params: { sessionId: session.id },
      });
    },
    [navigation, startSession],
  );

  const openSessionSetup = useCallback((deck: Deck) => {
    if (deck.cards.length === 0) {
      Alert.alert('Empty deck', 'This deck has no cards to learn.');
      return;
    }
    setSetupDeckId(deck.id);
    setSetupInverted(false);
    setSetupShuffled(false);
    setSetupVisible(true);
  }, []);

  const closeSessionSetup = useCallback(() => setSetupVisible(false), []);

  const setupDeck = useMemo(
    () => decks.find(deck => deck.id === setupDeckId),
    [decks, setupDeckId],
  );

  const startFromSetup = useCallback(() => {
    setSetupVisible(false);
    if (setupDeck) {
      handleStartSession(setupDeck, setupInverted, setupShuffled);
    }
  }, [setupDeck, setupInverted, setupShuffled, handleStartSession]);

  const notYetAvailable = useCallback((format: string) => {
    Alert.alert(format, 'Only CSV files can be imported for now.');
  }, []);

  const addMenuItems = useMemo(
    () => [
      {
        label: 'Import deck from file',
        icon: 'import' as const,
        onPress: () => setOpenMenu('format'),
      },
      {
        label: 'Add deck manually',
        icon: 'edit' as const,
        onPress: () =>
          Alert.alert('Add deck manually', 'Creating a deck by hand is not available yet.'),
      },
    ],
    [],
  );

  const formatMenuItems = useMemo(
    () => [
      { label: 'CSV', icon: 'file' as const, onPress: handleImport },
      { label: 'XML', icon: 'file' as const, onPress: () => notYetAvailable('XML') },
      { label: 'JSON', icon: 'file' as const, onPress: () => notYetAvailable('JSON') },
      { label: 'JSONL', icon: 'file' as const, onPress: () => notYetAvailable('JSONL') },
    ],
    [handleImport, notYetAvailable],
  );

  return (
    <View style={styles.container}>
      {searchOpen ? (
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClose={closeSearch}
          placeholder="Search decks"
        />
      ) : null}
      <FlatList
        data={visibleDecks}
        keyExtractor={deck => deck.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[
          styles.listContent,
          // No matches stays top-aligned: the keyboard overlays the bottom half of the list.
          visibleDecks.length === 0 && decks.length === 0 && styles.listContentEmpty,
        ]}
        ListHeaderComponent={error ? <Text style={styles.error}>{error}</Text> : undefined}
        ListEmptyComponent={
          decks.length === 0 ? (
            <EmptyState
              title="No decks yet"
              message="Use the + button to import a deck file and create your first deck."
            />
          ) : (
            <EmptyState
              title="No matches"
              message={`Nothing matches "${query.trim()}".`}
              actionLabel="Clear search"
              onAction={() => setQuery('')}
            />
          )
        }
        renderItem={({ item }) => {
          const stats = getDeckStats(item);
          const summary = sessionsByDeck.get(item.id) ?? EMPTY_SESSION_SUMMARY;
          return (
            <DeckCard
              name={item.name}
              description={item.description}
              cardCount={stats.cardCount}
              shares={answerShares(stats)}
              sessionCount={summary.total}
              activeCount={summary.active}
              lastSession={formatDate(summary.lastSessionAt)}
              onStart={() => handleStartSession(item)}
              menuItems={[
                {
                  label: 'Start session with options',
                  icon: 'play',
                  onPress: () => openSessionSetup(item),
                },
                {
                  label: 'Edit deck',
                  icon: 'edit',
                  onPress: () => navigation.navigate('EditDeck', { deckId: item.id }),
                },
                {
                  label: 'Delete deck',
                  icon: 'delete',
                  destructive: true,
                  onPress: () => confirmDelete(item),
                },
              ]}
            />
          );
        }}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add a deck"
        disabled={isImporting}
        onPress={() => setOpenMenu('add')}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}>
        {isImporting ? (
          <ActivityIndicator color="#0c1118" />
        ) : (
          <>
            <View style={[styles.plusBar, styles.plusBarHorizontal]} />
            <View style={[styles.plusBar, styles.plusBarVertical]} />
          </>
        )}
      </Pressable>

      <MenuSheet
        visible={openMenu !== null}
        title={openMenu === 'format' ? 'Import deck from file' : 'Add a deck'}
        items={openMenu === 'format' ? formatMenuItems : addMenuItems}
        onClose={() => setOpenMenu(null)}
      />

      <SessionSetupDialog
        visible={setupVisible}
        deckName={setupDeck?.name ?? ''}
        inverted={setupInverted}
        shuffled={setupShuffled}
        onInvertedChange={setSetupInverted}
        onShuffledChange={setSetupShuffled}
        onStart={startFromSetup}
        onCancel={closeSessionSetup}
      />
    </View>
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
    paddingBottom: spacing.xl * 3,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.8,
  },
  plusBar: {
    position: 'absolute',
    backgroundColor: '#0c1118',
    borderRadius: 2,
  },
  plusBarHorizontal: {
    width: 24,
    height: 3,
  },
  plusBarVertical: {
    width: 3,
    height: 24,
  },
});
