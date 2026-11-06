import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import CardSearchField from '../components/CardSearchField';
import CardStatsRow from '../components/CardStatsRow';
import CardStatusChips, { type CardStatusFilter } from '../components/CardStatusChips';
import DeckIdentityRow from '../components/DeckIdentityRow';
import DeckMasteryCard from '../components/DeckMasteryCard';
import EmptyState from '../components/EmptyState';
import KebabMenu from '../components/KebabMenu';
import MenuIcon from '../components/MenuIcons';
import MenuSheet from '../components/MenuSheet';
import SessionHistoryChart, { SESSION_HISTORY_LIMIT } from '../components/SessionHistoryChart';
import { useT } from '../i18n/I18nProvider';
import { useDecks } from '../state/DecksContext';
import { StatsStackParamList } from '../navigation/types';
import type { CardSortOrder } from '../types';
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

const SORT_ORDERS: CardSortOrder[] = ['hardest', 'deck', 'recent'];

export default function DeckStatsScreen({ route, navigation }: Props) {
  const { deckId } = route.params;
  const t = useT();
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
      t('deckStats.deckStatsScreen.resetAlert.title'),
      t('deckStats.deckStatsScreen.resetAlert.message', { deckName: deckName ?? '' }),
      [
        { text: t('common.actions.cancel'), style: 'cancel' },
        {
          text: t('common.actions.reset'),
          style: 'destructive',
          onPress: () => resetDeckStats(deckId),
        },
      ],
    );
  }, [deckName, deckId, resetDeckStats, t]);

  const headerMenu = useMemo(
    () =>
      deckName === undefined ? null : (
        <KebabMenu
          variant="plain"
          accessibilityLabel={t('deckStats.deckStatsScreen.optionsA11yLabel', { deckName })}
          title={deckName}
          items={[
            {
              label: t('deckStats.deckStatsScreen.resetStatisticsMenuItem'),
              icon: 'delete',
              destructive: true,
              onPress: confirmReset,
            },
          ]}
        />
      ),
    [deckName, confirmReset, t],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: deckName ?? t('navigation.headers.deckStats'),
      headerRight: () => headerMenu,
    });
  }, [navigation, deckName, headerMenu, t]);

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
          title={t('deckStats.deckStatsScreen.notFound.title')}
          message={t('deckStats.deckStatsScreen.notFound.message')}
          actionLabel={t('common.actions.back')}
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  const { stats, shares, sessionSummary, rateChange, history, lastAnsweredAt, statusCounts } =
    overview;
  const cardCount = deck.cards.length;
  const sortLabel = t(`answers.sortOrders.${sort}`);
  const isNarrowed = visibleCards.length !== cardCount;
  const subtitle = isNarrowed
    ? t('deckStats.deckStatsScreen.subtitleNarrowed', {
        count: cardCount,
        shown: visibleCards.length,
        sort: sortLabel,
      })
    : t('deckStats.deckStatsScreen.subtitle', { count: cardCount, sort: sortLabel });

  let emptyState: React.ReactElement;
  if (cardCount === 0) {
    emptyState = (
      <EmptyState
        title={t('deckStats.deckStatsScreen.noCards.title')}
        message={t('deckStats.deckStatsScreen.noCards.message')}
      />
    );
  } else if (status !== 'all' && statusCounts[status] === 0) {
    emptyState = (
      <EmptyState
        title={t(`deckStats.deckStatsScreen.statusEmpty.${status}.title`)}
        message={t(`deckStats.deckStatsScreen.statusEmpty.${status}.message`)}
        actionLabel={t('deckStats.deckStatsScreen.showAllCardsButton')}
        onAction={() => setStatus('all')}
      />
    );
  } else {
    const trimmedQuery = query.trim();
    emptyState = (
      <EmptyState
        title={t('common.search.noMatchesTitle')}
        message={
          status === 'all'
            ? t('common.search.noMatchesMessage', { query: trimmedQuery })
            : t('deckStats.deckStatsScreen.noMatches.filteredMessage', {
                query: trimmedQuery,
                status: t(`answers.cardStatus.${status}`),
              })
        }
        actionLabel={t('common.search.clearSearchButton')}
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
              {t('deckStats.deckStatsScreen.cardPerformanceTitle')}
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
              accessibilityLabel={t('deckStats.deckStatsScreen.sortButtonA11yLabel', {
                sort: sortLabel,
              })}
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
        title={t('deckStats.deckStatsScreen.sortSheetTitle')}
        items={SORT_ORDERS.map(order => ({
          label: t(`answers.sortOrders.${order}`),
          selected: order === sort,
          onPress: () => setSort(order),
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
