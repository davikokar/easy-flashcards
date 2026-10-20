import React, { useCallback, useMemo } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import KebabMenu from '../components/KebabMenu';
import SuccessBar from '../components/SuccessBar';
import { useDecks } from '../state/DecksContext';
import { LearnStackParamList, RootTabParamList } from '../navigation/types';
import { Session } from '../types';
import { formatDate, formatRate, getSessionStats, sortSessions } from '../utils/stats';
import { colors, radius, spacing } from '../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<LearnStackParamList, 'LearnList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export default function LearnScreen({ navigation }: Props) {
  const { sessions, getDeck, startSession, deleteSession } = useDecks();
  const ordered = useMemo(() => sortSessions(sessions), [sessions]);
  const activeCount = useMemo(
    () => sessions.filter(session => session.completedAt === null).length,
    [sessions],
  );

  const confirmDelete = useCallback(
    (session: Session) => {
      const isActive = session.completedAt === null;
      Alert.alert(
        isActive ? 'Discard session' : 'Delete session',
        isActive
          ? `Discard the unfinished session for "${session.deckName}"?`
          : `Delete the session for "${session.deckName}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: isActive ? 'Discard' : 'Delete',
            style: 'destructive',
            onPress: () => deleteSession(session.id),
          },
        ],
      );
    },
    [deleteSession],
  );

  const restart = useCallback(
    (session: Session) => {
      const deck = getDeck(session.deckId);
      if (!deck || deck.cards.length === 0) {
        Alert.alert('Deck unavailable', 'This deck no longer exists or has no cards.');
        return;
      }
      const next = startSession(deck);
      navigation.navigate('Study', { sessionId: next.id });
    },
    [getDeck, navigation, startSession],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={ordered}
        keyExtractor={session => session.id}
        contentContainerStyle={[
          styles.listContent,
          ordered.length === 0 && styles.listContentEmpty,
        ]}
        ListHeaderComponent={
          ordered.length === 0 ? undefined : (
            <Text style={styles.headerText}>
              {activeCount === 0
                ? 'No session in progress'
                : `${activeCount} session${activeCount === 1 ? '' : 's'} in progress`}
            </Text>
          )
        }
        ListEmptyComponent={
          <EmptyState
            title="No sessions yet"
            message="Pick a deck and start a learning session; it will show up here until you finish it."
            actionLabel="Go to decks"
            onAction={() => navigation.navigate('DecksTab', { screen: 'DecksList' })}
          />
        }
        renderItem={({ item }) => {
          const stats = getSessionStats(item);
          return (
            <View style={[styles.card, stats.isActive && styles.cardActive]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitle}>
                  <Text style={styles.deckName} numberOfLines={2}>
                    {item.deckName}
                  </Text>
                  <Text style={[styles.status, stats.isActive && styles.statusActive]}>
                    {stats.isActive
                      ? `In progress \u2014 ${stats.answered}/${stats.cardCount} cards`
                      : `Completed \u2014 ${stats.cardCount} card${
                          stats.cardCount === 1 ? '' : 's'
                        }`}
                  </Text>
                </View>
                <KebabMenu
                  title={item.deckName}
                  accessibilityLabel={`Options for the ${item.deckName} session`}
                  items={[
                    { label: 'Start a new session', icon: 'play', onPress: () => restart(item) },
                    {
                      label: stats.isActive ? 'Discard session' : 'Delete session',
                      icon: 'delete',
                      destructive: true,
                      onPress: () => confirmDelete(item),
                    },
                  ]}
                />
              </View>

              <SuccessBar rate={stats.successRate} />

              <View style={styles.metaRow}>
                <Text style={styles.meta}>Success {formatRate(stats.successRate)}</Text>
                <Text style={[styles.meta, styles.ok]}>{stats.okCount} ok</Text>
                <Text style={[styles.meta, styles.notOk]}>{stats.notOkCount} not ok</Text>
                <Text style={styles.meta}>Started {formatDate(item.startedAt)}</Text>
              </View>

              <Button
                label={stats.isActive ? 'Resume session' : 'Study this deck again'}
                variant={stats.isActive ? 'primary' : 'secondary'}
                onPress={() =>
                  stats.isActive ? navigation.navigate('Study', { sessionId: item.id }) : restart(item)
                }
              />
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
  headerText: {
    color: colors.textMuted,
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
  cardActive: {
    borderColor: colors.primary,
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
  status: {
    color: colors.textMuted,
    fontSize: 13,
  },
  statusActive: {
    color: colors.primary,
    fontWeight: '600',
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
  ok: {
    color: colors.success,
  },
  notOk: {
    color: colors.danger,
  },
});
