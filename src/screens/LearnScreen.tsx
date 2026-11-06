import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import EmptyState from '../components/EmptyState';
import HeaderToolbar from '../components/HeaderToolbar';
import SearchBar from '../components/SearchBar';
import SessionCard from '../components/SessionCard';
import { useT } from '../i18n/I18nProvider';
import { useDecks } from '../state/DecksContext';
import { LearnStackParamList, RootTabParamList } from '../navigation/types';
import { useOpenSettings } from '../navigation/useOpenSettings';
import { Category, Session } from '../types';
import {
  clearableSessionCount,
  formatDate,
  getReviewState,
  getSessionTally,
  isSessionActive,
  listedSessions,
  resolvableCardIds,
  sessionProgressShares,
  sortSessions,
} from '../utils/stats';
import { findCategory } from '../utils/categories';
import { filterByTitle } from '../utils/search';
import { colors, spacing } from '../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<LearnStackParamList, 'LearnList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export default function LearnScreen({ navigation }: Props) {
  const {
    sessions,
    categories,
    getDeck,
    replaySession,
    deleteSession,
    clearSession,
    clearCompletedSessions,
  } = useDecks();
  const t = useT();
  const openSettings = useOpenSettings();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ordered = useMemo(() => sortSessions(listedSessions(sessions)), [sessions]);
  const visibleSessions = useMemo(
    () => filterByTitle(ordered, query, session => session.deckName),
    [ordered, query],
  );
  const clearableCount = useMemo(() => clearableSessionCount(sessions), [sessions]);
  const reviewStates = useMemo(() => {
    const states = new Map<string, ReturnType<typeof getReviewState>>();
    for (const session of ordered) {
      states.set(session.id, getReviewState(session, getDeck(session.deckId)));
    }
    return states;
  }, [ordered, getDeck]);
  // A session stores no category: it takes its deck's, and none when the deck is gone.
  const sessionCategories = useMemo(() => {
    const byId = new Map<string, Category | null>();
    for (const session of ordered) {
      const deck = getDeck(session.deckId);
      byId.set(session.id, deck ? findCategory(deck.categoryId, categories) : null);
    }
    return byId;
  }, [ordered, getDeck, categories]);

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

  const confirmClearCompleted = useCallback(() => {
    if (clearableCount === 0) {
      Alert.alert(
        t('learn.clearCompletedSessionsAlert.title'),
        t('learn.clearCompletedSessionsAlert.nothingToClear'),
      );
      return;
    }
    Alert.alert(
      t('learn.clearCompletedSessionsAlert.title'),
      t('learn.clearCompletedSessionsAlert.message', { count: clearableCount }),
      [
        { text: t('common.actions.cancel'), style: 'cancel' },
        {
          text: t('common.actions.clear'),
          style: 'destructive',
          onPress: clearCompletedSessions,
        },
      ],
    );
  }, [clearableCount, clearCompletedSessions, t]);

  const toolbar = useMemo(
    () => (
      <HeaderToolbar
        onSearch={toggleSearch}
        searchActive={searchOpen}
        searchLabel={t('learn.learnScreen.searchA11yLabel')}
        menuItems={[
          {
            label: t('learn.headerToolbar.clearCompletedItem'),
            icon: 'delete',
            destructive: true,
            onPress: confirmClearCompleted,
          },
        ]}
        onOpenSettings={openSettings}
      />
    ),
    [toggleSearch, searchOpen, confirmClearCompleted, t, openSettings],
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
        Alert.alert(
          t('learn.discardSessionAlert.title'),
          t('learn.discardSessionAlert.message', { deckName: session.deckName }),
          [
            { text: t('common.actions.cancel'), style: 'cancel' },
            {
              text: t('common.actions.discard'),
              style: 'destructive',
              onPress: () => deleteSession(session.id),
            },
          ],
        );
        return;
      }
      Alert.alert(
        t('learn.clearSessionAlert.title'),
        t('learn.clearSessionAlert.message', { deckName: session.deckName }),
        [
          { text: t('common.actions.cancel'), style: 'cancel' },
          {
            text: t('common.actions.clear'),
            style: 'destructive',
            onPress: () => clearSession(session.id),
          },
        ],
      );
    },
    [clearSession, deleteSession, t],
  );

  // Starts a counted session over the session's own cards and clears the original, atomically.
  const replay = useCallback(
    (session: Session) => {
      const deck = getDeck(session.deckId);
      const cardIds = deck ? resolvableCardIds(session.cardIds, deck) : [];
      if (!deck || cardIds.length === 0) {
        Alert.alert(t('learn.deckUnavailableAlert.title'), t('learn.deckUnavailableAlert.message'));
        return;
      }
      const next = replaySession(session.id, deck, { inverted: session.inverted }, cardIds);
      navigation.navigate('Study', { sessionId: next.id });
    },
    [getDeck, navigation, replaySession, t],
  );

  return (
    <View style={styles.container}>
      {searchOpen ? (
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClose={closeSearch}
          placeholder={t('learn.learnScreen.searchPlaceholder')}
        />
      ) : null}
      <FlatList
        data={visibleSessions}
        keyExtractor={session => session.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[
          styles.listContent,
          // No matches stays top-aligned: the keyboard overlays the bottom half of the list.
          ordered.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={
          ordered.length === 0 ? (
            <EmptyState
              title={
                sessions.length === 0
                  ? t('learn.emptyState.noSessionsTitle')
                  : t('learn.emptyState.allClearedTitle')
              }
              message={
                sessions.length === 0
                  ? t('learn.emptyState.noSessionsMessage')
                  : t('learn.emptyState.allClearedMessage')
              }
              actionLabel={t('learn.emptyState.goToDecksButton')}
              onAction={() => navigation.navigate('DecksTab', { screen: 'DecksList' })}
            />
          ) : (
            <EmptyState
              title={t('common.search.noMatchesTitle')}
              message={t('common.search.noMatchesMessage', { query: query.trim() })}
              actionLabel={t('common.search.clearSearchButton')}
              onAction={() => setQuery('')}
            />
          )
        }
        renderItem={({ item }) => {
          const isActive = isSessionActive(item);
          const tally = getSessionTally(item);
          const cardCount = item.cardIds.length;
          const reviewState = reviewStates.get(item.id);
          const review =
            !isActive && reviewState && reviewState.kind !== 'none'
              ? {
                  count: reviewState.kind === 'outstanding' ? reviewState.count : 0,
                  done: reviewState.kind === 'done',
                  onPress: () =>
                    navigation.navigate('Study', { sessionId: item.id, mode: 'review' }),
                }
              : undefined;
          return (
            <SessionCard
              deckName={item.deckName}
              category={sessionCategories.get(item.id) ?? null}
              isActive={isActive}
              inverted={item.inverted}
              answeredCount={item.results.length}
              cardCount={cardCount}
              tally={tally}
              shares={sessionProgressShares(tally, cardCount)}
              startedLabel={formatDate(item.startedAt, t)}
              menuItems={[
                {
                  label: isActive
                    ? t('learn.sessionOptionsMenu.discardItem')
                    : t('learn.sessionOptionsMenu.clearItem'),
                  icon: 'delete',
                  destructive: true,
                  onPress: () => confirmDelete(item),
                },
              ]}
              onResume={
                isActive ? () => navigation.navigate('Study', { sessionId: item.id }) : undefined
              }
              onReplay={isActive ? undefined : () => replay(item)}
              review={review}
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
