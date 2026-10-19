import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import SuccessBar from '../components/SuccessBar';
import { useDecks } from '../state/DecksContext';
import { DecksStackParamList } from '../navigation/types';
import { Deck } from '../types';
import { formatDate, formatRate, getDeckStats } from '../utils/stats';
import { CsvImportError } from '../utils/csv';
import { ImportCancelledError, pickAndParseCsv } from '../services/importDeck';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<DecksStackParamList, 'DecksList'>;

export default function DecksScreen({ navigation }: Props) {
  const { decks, isLoading, error, addDeck, deleteDeck } = useDecks();
  const [isImporting, setIsImporting] = useState(false);

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
      Alert.alert('Delete deck', `Delete "${deck.name}" and all of its statistics?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteDeck(deck.id) },
      ]);
    },
    [deleteDeck],
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

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
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.deckName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.cardCount}>
                  {stats.cardCount} card{stats.cardCount === 1 ? '' : 's'}
                </Text>
              </View>

              <SuccessBar rate={stats.successRate} />

              <View style={styles.metaRow}>
                <Text style={styles.meta}>Success {formatRate(stats.successRate)}</Text>
                <Text style={styles.meta}>Reviews {stats.reviewCount}</Text>
                <Text style={styles.meta}>Last studied {formatDate(item.lastStudiedAt)}</Text>
              </View>

              <View style={styles.actions}>
                <Button
                  label="Study"
                  onPress={() => navigation.navigate('Study', { deckId: item.id })}
                  style={styles.flexAction}
                />
                <Button
                  label="Delete"
                  variant="secondary"
                  onPress={() => confirmDelete(item)}
                  style={styles.flexAction}
                />
              </View>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  deckName: {
    flex: 1,
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
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  flexAction: {
    flex: 1,
  },
});
