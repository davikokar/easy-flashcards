import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import KebabMenu from '../components/KebabMenu';
import SuccessBar from '../components/SuccessBar';
import { useDecks } from '../state/DecksContext';
import { DecksStackParamList, RootTabParamList } from '../navigation/types';
import { Deck } from '../types';
import {
  EMPTY_SESSION_SUMMARY,
  formatDate,
  formatRate,
  getDeckStats,
  summarizeSessionsByDeck,
} from '../utils/stats';
import { CsvImportError } from '../utils/csv';
import { ImportCancelledError, pickAndParseCsv } from '../services/importDeck';
import { colors, radius, spacing } from '../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<DecksStackParamList, 'DecksList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export default function DecksScreen({ navigation }: Props) {
  const { decks, sessions, error, addDeck, deleteDeck, startSession } = useDecks();
  const [isImporting, setIsImporting] = useState(false);
  const sessionsByDeck = useMemo(() => summarizeSessionsByDeck(sessions), [sessions]);

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
    (deck: Deck) => {
      if (deck.cards.length === 0) {
        Alert.alert('Empty deck', 'This deck has no cards to learn.');
        return;
      }
      const session = startSession(deck);
      navigation.navigate('LearnTab', {
        screen: 'Study',
        params: { sessionId: session.id },
      });
    },
    [navigation, startSession],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={deck => deck.id}
        contentContainerStyle={[styles.listContent, decks.length === 0 && styles.listContentEmpty]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Button
              label="Import deck from CSV"
              onPress={handleImport}
              loading={isImporting}
              disabled={isImporting}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Text style={styles.helper}>
              CSV columns: Question and Answer, separated by a semicolon or a tab. Basic HTML such
              as {'<b>'}, {'<i>'} and {'<br />'} is rendered on the cards.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No decks yet"
            message="Import a CSV file from your device to create your first deck."
          />
        }
        renderItem={({ item }) => {
          const stats = getDeckStats(item);
          const summary = sessionsByDeck.get(item.id) ?? EMPTY_SESSION_SUMMARY;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitle}>
                  <Text style={styles.deckName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.cardCount}>
                    {stats.cardCount} card{stats.cardCount === 1 ? '' : 's'}
                  </Text>
                </View>
                <KebabMenu
                  accessibilityLabel={`Options for ${item.name}`}
                  items={[
                    {
                      label: 'Edit deck',
                      onPress: () =>
                        Alert.alert('Edit deck', 'Editing decks is not available yet.'),
                    },
                    {
                      label: 'Delete deck',
                      destructive: true,
                      onPress: () => confirmDelete(item),
                    },
                  ]}
                />
              </View>

              <SuccessBar rate={stats.successRate} />

              <View style={styles.metaRow}>
                <Text style={styles.meta}>Success {formatRate(stats.successRate)}</Text>
                <Text style={styles.meta}>Sessions {summary.total}</Text>
                <Text style={[styles.meta, summary.active > 0 && styles.metaActive]}>
                  Active {summary.active}
                </Text>
                <Text style={styles.meta}>Last session {formatDate(summary.lastSessionAt)}</Text>
              </View>

              <Button label="Start session" onPress={() => handleStartSession(item)} />
            </View>
          );
        }}
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
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  header: {
    gap: spacing.sm,
  },
  helper: {
    color: colors.textDim,
    fontSize: 13,
    lineHeight: 19,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardTitle: {
    flex: 1,
    gap: 2,
  },
  deckName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  cardCount: {
    color: colors.textMuted,
    fontSize: 13,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  metaActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
