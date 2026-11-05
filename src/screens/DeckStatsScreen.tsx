import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import CardSearchField from '../components/CardSearchField';
import CardStatsRow from '../components/CardStatsRow';
import CardStatusChips, {
  CARD_STATUS_LABELS,
  type CardStatusFilter,
} from '../components/CardStatusChips';
import DeckIdentityRow from '../components/DeckIdentityRow';
import DeckMasteryCard from '../components/DeckMasteryCard';
import EmptyState from '../components/EmptyState';
import KebabMenu from '../components/KebabMenu';
import MenuIcon from '../components/MenuIcons';
import MenuSheet from '../components/MenuSheet';
import SessionHistoryChart, { SESSION_HISTORY_LIMIT } from '../components/SessionHistoryChart';
import { useDecks } from '../state/DecksContext';
import { StatsStackParamList } from '../navigation/types';
import type { CardSortOrder, CardStatus } from '../types';
import { findCategory } from '../utils/categories';
import { cardSearchText, filterByTitle } from '../utils/search';
import {
  answerShares,
  cardStatus,
  countCardStatuses,
  getDeckStats,
  getSessionHistory,
  lastAnsweredAtByCard,
  rateChangeSinceLastSession,
  sortCards,
  summarizeSessions,
} from '../utils/stats';
import { colors, spacing } from '../theme';

type Props = NativeStackScreenProps<StatsStackParamList, 'DeckStats'>;

const renderSortIcon = (color: string) => <MenuIcon name="sort" color={color} />;

const SORT_OPTIONS: { value: CardSortOrder; label: string }[] = [
  { value: 'hardest', label: 'Hardest first' },
  { value: 'deck', label: 'Deck order' },
  { value: 'recent', label: 'Recently reviewed' },
];

const STATUS_EMPTY: Record<CardStatus, { title: string; message: string }> = {
  needsReview: { title: 'No cards need review', message: 'No card is below 40% success.' },
  learning: { title: 'No cards are learning', message: 'No card is between 40% and 70% success.' },
  mastered: { title: 'No mastered cards yet', message: 'A card is mastered at 70% success or more.' },
  new: { title: 'No new cards', message: 'Every card has been reviewed at least once.' },
};

export default function DeckStatsScreen({ route, navigation }: Props) {
  const { deckId } = route.params;
  const { getDeck, sessions, categories, resetDeckStats } = useDecks();
  const deck = getDeck(deckId);
  const deckName = deck?.name;

  // Local to the screen, never stored; they reset when it is left.
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<CardStatusFilter>('all');
  const [sort, setSort] = useState<CardSortOrder>('hardest');
  const [sortOpen, setSortOpen] = useState(false);

  const confirmReset = useCallback(() => {
    Alert.alert(
      'Reset statistics',
      `Clear all recorded results and sessions for "${deckName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetDeckStats(deckId) },
      ],
    );
  }, [deckName, deckId, resetDeckStats]);

  const headerMenu = useMemo(
    () =>
      deckName === undefined ? null : (
        <KebabMenu
          variant="plain"
          accessibilityLabel={`Options for ${deckName} statistics`}
          title={deckName}
          items={[
            { label: 'Reset statistics', icon: 'delete', destructive: true, onPress: confirmReset },
          ]}
        />
      ),
    [deckName, confirmReset],
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: deckName ?? 'Deck statistics', headerRight: () => headerMenu });
  }, [navigation, deckName, headerMenu]);

  const overview = useMemo(() => {
    if (!deck) {
      return null;
    }
    const stats = getDeckStats(deck);
    return {
      stats,
      shares: answerShares(stats),
      sessionSummary: summarizeSessions(sessions.filter(session => session.deckId === deck.id)),
      rateChange: rateChangeSinceLastSession(deck, sessions),
      history: getSessionHistory(sessions, deck.id, SESSION_HISTORY_LIMIT),
      lastAnsweredAt: lastAnsweredAtByCard(deck, sessions),
      statusCounts: countCardStatuses(deck.cards),
    };
  }, [deck, sessions]);

  const visibleCards = useMemo(() => {
    if (!deck || !overview) {
      return [];
    }
    const sorted = sortCards(deck.cards, sort, overview.lastAnsweredAt);
    const byStatus = status === 'all' ? sorted : sorted.filter(card => cardStatus(card) === status);
    return filterByTitle(byStatus, query, cardSearchText);
  }, [deck, overview, sort, status, query]);

  if (!deck || !overview) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Deck not found"
          message="This deck has been deleted."
          actionLabel="Back"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  const { stats, shares, sessionSummary, rateChange, history, lastAnsweredAt, statusCounts } =
    overview;
  const cardCount = deck.cards.length;
  const sortLabel = SORT_OPTIONS.find(option => option.value === sort)?.label ?? '';
  const isNarrowed = visibleCards.length !== cardCount;
  const countText = `${cardCount} ${cardCount === 1 ? 'card' : 'cards'}`;
  const subtitle = `${
    isNarrowed ? `${visibleCards.length} of ${cardCount} cards` : countText
  } · ${sortLabel}`;

  let emptyState: React.ReactElement;
  if (cardCount === 0) {
    emptyState = (
      <EmptyState
        title="No cards yet"
        message="Add cards to this deck to see how each one performs."
      />
    );
  } else if (status !== 'all' && statusCounts[status] === 0) {
    emptyState = (
      <EmptyState
        title={STATUS_EMPTY[status].title}
        message={STATUS_EMPTY[status].message}
        actionLabel="Show all cards"
        onAction={() => setStatus('all')}
      />
    );
  } else {
    const filterNote = status === 'all' ? '' : ` with the ${CARD_STATUS_LABELS[status]} filter`;
    emptyState = (
      <EmptyState
        title="No matches"
        message={`Nothing matches "${query.trim()}"${filterNote}.`}
        actionLabel="Clear search"
        onAction={() => setQuery('')}
      />
    );
  }

  // An element, not a component type, so the search input keeps its identity across keystrokes.
  const header = (
    <View style={styles.header}>
      <DeckIdentityRow
        cardCount={cardCount}
        category={findCategory(deck.categoryId, categories)}
      />
      <DeckMasteryCard
        successRate={stats.successRate}
        rateChange={rateChange}
        shares={shares}
        tally={stats}
        reviewCount={stats.reviewCount}
        sessionCount={sessionSummary.total}
        lastSessionAt={sessionSummary.lastSessionAt}
      />
      <SessionHistoryChart entries={history} sessionCount={sessionSummary.total} />
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitles}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              Card performance
            </Text>
            <Text
              accessibilityLiveRegion={isNarrowed ? 'polite' : 'none'}
              style={styles.sectionSubtitle}>
              {subtitle}
            </Text>
          </View>
          {cardCount === 0 ? null : (
            <Button
              variant="secondary"
              accessibilityLabel={`Sort cards: ${sortLabel}`}
              icon={renderSortIcon}
              onPress={() => setSortOpen(true)}
            />
          )}
        </View>
        {cardCount === 0 ? null : (
          <>
            <CardSearchField value={query} onChangeText={setQuery} onClear={() => setQuery('')} />
            <CardStatusChips
              value={status}
              counts={statusCounts}
              total={cardCount}
              onChange={setStatus}
            />
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleCards}
        keyExtractor={card => card.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={header}
        ListEmptyComponent={emptyState}
        renderItem={({ item }) => (
          <CardStatsRow card={item} lastAnsweredAt={lastAnsweredAt.get(item.id) ?? null} />
        )}
      />
      <MenuSheet
        visible={sortOpen}
        title="Sort cards"
        items={SORT_OPTIONS.map(option => ({
          label: option.label,
          selected: option.value === sort,
          onPress: () => setSort(option.value),
        }))}
        onClose={() => setSortOpen(false)}
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
  header: {
    gap: spacing.md,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sectionTitles: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
