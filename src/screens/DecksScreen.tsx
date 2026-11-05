import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import CustomSeparatorDialog from '../components/CustomSeparatorDialog';
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
import { findCategory } from '../utils/categories';
import { DeckImportFormat } from '../utils/deckImport';
import {
  DeckExportOptions,
  SEPARATOR_PRESETS,
  SeparatorError,
  validateCustomSeparator,
} from '../utils/deckExport';
import { filterByTitle } from '../utils/search';
import { shuffle } from '../utils/shuffle';
import { ExportCancelledError, exportDeck } from '../services/exportDeck';
import { ImportCancelledError, pickAndParseDeck } from '../services/importDeck';
import { colors, radius, spacing } from '../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<DecksStackParamList, 'DecksList'>,
  BottomTabScreenProps<RootTabParamList>
>;

const showFilterStub = () => Alert.alert('Filter', 'Filtering decks is not available yet.');

const START_DEBOUNCE_MS = 1000;

export default function DecksScreen({ navigation }: Props) {
  const { decks, sessions, categories, error, addDeck, deleteDeck, startSession } = useDecks();
  const [isImporting, setIsImporting] = useState(false);
  const lastStartAt = useRef(0);
  const [openMenu, setOpenMenu] = useState<'add' | 'format' | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  // The deck id stays set after the dialog closes so its title does not blank during the fade-out.
  const [setupDeckId, setSetupDeckId] = useState<string | null>(null);
  const [setupVisible, setSetupVisible] = useState(false);
  const [setupInverted, setSetupInverted] = useState(false);
  const [setupShuffled, setSetupShuffled] = useState(true);
  // The deck id stays set after the export menus close so the Custom separator dialog keeps its title.
  const [exportDeckId, setExportDeckId] = useState<string | null>(null);
  const [exportMenu, setExportMenu] = useState<'format' | 'separator' | null>(null);
  const [customVisible, setCustomVisible] = useState(false);
  const [customSeparator, setCustomSeparator] = useState('');
  const [isExportingDeck, setIsExportingDeck] = useState(false);
  const exportInFlight = useRef(false);
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

  const handleImport = useCallback(
    async (format: DeckImportFormat) => {
      setIsImporting(true);
      try {
        const imported = await pickAndParseDeck(format);
        const deck = addDeck({
          name: imported.deckName,
          description: imported.description,
          categoryId: imported.categoryId,
          sourceFileName: imported.fileName,
          cards: imported.cards,
        });
        const skipped = imported.skipped;
        const unit = format === 'csv' ? 'row' : 'card';
        Alert.alert(
          'Deck imported',
          `"${deck.name}" now has ${deck.cards.length} card${deck.cards.length === 1 ? '' : 's'}.` +
            (skipped > 0 ? `\n${skipped} incomplete ${unit}${skipped === 1 ? '' : 's'} skipped.` : ''),
        );
      } catch (importError) {
        if (importError instanceof ImportCancelledError) {
          return;
        }
        Alert.alert(
          'Import failed',
          importError instanceof Error
            ? importError.message
            : 'Unknown error while importing the file.',
        );
      } finally {
        setIsImporting(false);
      }
    },
    [addDeck],
  );

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
    (deck: Deck, inverted = false, shuffled = true) => {
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
    setSetupShuffled(true);
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
        onPress: () => navigation.navigate('NewDeck'),
      },
    ],
    [navigation],
  );

  const formatMenuItems = useMemo(
    () => [
      { label: 'CSV', icon: 'file' as const, onPress: () => handleImport('csv') },
      { label: 'JSON', icon: 'file' as const, onPress: () => handleImport('json') },
    ],
    [handleImport],
  );

  const exportDeckToFile = useMemo(
    () => decks.find(deck => deck.id === exportDeckId),
    [decks, exportDeckId],
  );

  const customSeparatorError = useMemo((): SeparatorError | null => {
    const result = validateCustomSeparator(customSeparator);
    return result.ok ? null : result.reason;
  }, [customSeparator]);

  const startExport = useCallback(
    async (options: DeckExportOptions) => {
      // The ref, not the state, is the guard: state is stale until the next render.
      if (exportInFlight.current) {
        return;
      }
      // Read again by id: the deck may have been deleted since its menu opened.
      const deck = decks.find(candidate => candidate.id === exportDeckId);
      if (!deck) {
        setCustomVisible(false);
        Alert.alert('Export failed', 'This deck no longer exists.');
        return;
      }
      exportInFlight.current = true;
      setIsExportingDeck(true);
      try {
        const name = await exportDeck(deck, findCategory(deck.categoryId, categories), options);
        setCustomVisible(false);
        Alert.alert('Deck exported', name ? `Saved as ${name}.` : 'The deck was saved.');
      } catch (exportError) {
        if (exportError instanceof ExportCancelledError) {
          return;
        }
        Alert.alert(
          'Export failed',
          exportError instanceof Error ? exportError.message : 'Could not export the deck.',
        );
      } finally {
        exportInFlight.current = false;
        setIsExportingDeck(false);
      }
    },
    [decks, categories, exportDeckId],
  );

  const exportFormatItems = useMemo(
    () => [
      { label: 'JSON', icon: 'file' as const, onPress: () => startExport({ format: 'json' }) },
      { label: 'CSV', icon: 'file' as const, onPress: () => setExportMenu('separator') },
    ],
    [startExport],
  );

  const exportSeparatorItems = useMemo(
    () => [
      ...SEPARATOR_PRESETS.map(preset => ({
        label: `${preset.label}${preset.key === 'tab' ? '' : ` (${preset.value})`}`,
        onPress: () => startExport({ format: 'csv', separator: preset.value }),
      })),
      {
        label: 'Custom…',
        onPress: () => {
          setCustomSeparator('');
          setCustomVisible(true);
        },
      },
    ],
    [startExport],
  );

  const exportWithCustomSeparator = useCallback(() => {
    const result = validateCustomSeparator(customSeparator);
    if (result.ok) {
      startExport({ format: 'csv', separator: result.separator });
    }
  }, [customSeparator, startExport]);

  const closeCustomSeparator = useCallback(() => {
    if (!exportInFlight.current) {
      setCustomVisible(false);
    }
  }, []);

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
              category={findCategory(item.categoryId, categories)}
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
                  label: 'Export to file',
                  icon: 'export',
                  onPress: () => {
                    setExportDeckId(item.id);
                    setExportMenu('format');
                  },
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

      <MenuSheet
        visible={exportMenu !== null}
        title={exportMenu === 'separator' ? 'CSV separator' : 'Export deck to file'}
        items={exportMenu === 'separator' ? exportSeparatorItems : exportFormatItems}
        onClose={() => setExportMenu(null)}
      />

      <CustomSeparatorDialog
        visible={customVisible}
        deckName={exportDeckToFile?.name ?? ''}
        value={customSeparator}
        onChangeText={setCustomSeparator}
        error={customSeparatorError}
        exporting={isExportingDeck}
        onExport={exportWithCustomSeparator}
        onCancel={closeCustomSeparator}
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
