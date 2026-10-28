import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import EmptyState from '../components/EmptyState';
import HeaderToolbar from '../components/HeaderToolbar';
import SessionCard from '../components/SessionCard';
import { useDecks } from '../state/DecksContext';
import { LearnStackParamList, RootTabParamList } from '../navigation/types';
import { Deck, Session } from '../types';
import {
  clearableSessionCount,
  formatDate,
  getMissedOrUnsureCardIds,
  getSessionTally,
  isSessionActive,
  listedSessions,
  resolvableCardIds,
  sessionProgressShares,
  sortSessions,
} from '../utils/stats';
import { colors, spacing } from '../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<LearnStackParamList, 'LearnList'>,
  BottomTabScreenProps<RootTabParamList>
>;

const showSearchStub = () => Alert.alert('Search', 'Searching sessions is not available yet.');
const showFilterStub = () => Alert.alert('Filter', 'Filtering sessions is not available yet.');

export default function LearnScreen({ navigation }: Props) {
  const { sessions, getDeck, startSession, deleteSession, clearSession, clearCompletedSessions } =
    useDecks();
  const ordered = useMemo(() => sortSessions(listedSessions(sessions)), [sessions]);
  const clearableCount = useMemo(() => clearableSessionCount(sessions), [sessions]);

  const confirmClearCompleted = useCallback(() => {
    if (clearableCount === 0) {
      Alert.alert('Clear completed sessions', 'No completed sessions to clear.');
      return;
    }
    Alert.alert(
      'Clear completed sessions',
      `Remove ${clearableCount} completed session${
        clearableCount === 1 ? '' : 's'
      } from this list? Their results stay in Statistics.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCompletedSessions },
      ],
    );
  }, [clearableCount, clearCompletedSessions]);

  const toolbar = useMemo(
    () => (
      <HeaderToolbar
        onSearch={showSearchStub}
        onFilter={showFilterStub}
        searchLabel="Search sessions"
        filterLabel="Filter sessions"
        menuItems={[
          {
            label: 'Clear completed sessions',
            icon: 'delete',
            destructive: true,
            onPress: confirmClearCompleted,
          },
        ]}
      />
    ),
    [confirmClearCompleted],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.background },
      headerTitleStyle: { color: colors.text, fontSize: 24, fontWeight: '700' },
      headerRight: () => toolbar,
    });
  }, [navigation, toolbar]);

  const confirmDelete = useCallback(
    (session: Session) => {
      if (isSessionActive(session)) {
        Alert.alert('Discard session', `Discard the unfinished session for "${session.deckName}"?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => deleteSession(session.id) },
        ]);
        return;
      }
      Alert.alert(
        'Clear session',
        `Remove the completed session for "${session.deckName}" from this list? Its results stay in Statistics.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: () => clearSession(session.id) },
        ],
      );
    },
    [clearSession, deleteSession],
  );

  // Always starts a new session; the original is never cleared or deleted.
  const startFrom = useCallback(
    (session: Session, pickCardIds: (deck: Deck) => string[]) => {
      const deck = getDeck(session.deckId);
      const cardIds = deck ? resolvableCardIds(pickCardIds(deck), deck) : [];
      if (!deck || cardIds.length === 0) {
        Alert.alert('Deck unavailable', 'This deck no longer exists or has no cards.');
        return;
      }
      const next = startSession(deck, cardIds);
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
        ListEmptyComponent={
          <EmptyState
            title={sessions.length === 0 ? 'No sessions yet' : 'No sessions to show'}
            message={
              sessions.length === 0
                ? 'Pick a deck and start a learning session; it will show up here until you finish it.'
                : 'Cleared sessions still count in Statistics. Start a new session from a deck to see it here.'
            }
            actionLabel="Go to decks"
            onAction={() => navigation.navigate('DecksTab', { screen: 'DecksList' })}
          />
        }
        renderItem={({ item }) => {
          const isActive = isSessionActive(item);
          const tally = getSessionTally(item);
          const cardCount = item.cardIds.length;
          const missedCount = isActive ? 0 : getMissedOrUnsureCardIds(item).length;
          return (
            <SessionCard
              deckName={item.deckName}
              isActive={isActive}
              answeredCount={item.results.length}
              cardCount={cardCount}
              tally={tally}
              shares={sessionProgressShares(tally, cardCount)}
              startedLabel={formatDate(item.startedAt)}
              missedCount={missedCount}
              menuItems={[
                {
                  label: 'Start a new session',
                  icon: 'play',
                  onPress: () => startFrom(item, deck => deck.cards.map(card => card.id)),
                },
                {
                  label: isActive ? 'Discard session' : 'Clear session',
                  icon: 'delete',
                  destructive: true,
                  onPress: () => confirmDelete(item),
                },
              ]}
              onResume={
                isActive ? () => navigation.navigate('Study', { sessionId: item.id }) : undefined
              }
              onReplay={isActive ? undefined : () => startFrom(item, () => item.cardIds)}
              onReplayMissed={
                missedCount > 0
                  ? () => startFrom(item, () => getMissedOrUnsureCardIds(item))
                  : undefined
              }
            />
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
});
