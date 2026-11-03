import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DeckStatsCard from '../components/DeckStatsCard';
import EmptyState from '../components/EmptyState';
import HeaderToolbar from '../components/HeaderToolbar';
import MasteryRing from '../components/MasteryRing';
import MenuIcon from '../components/MenuIcons';
import SearchBar from '../components/SearchBar';
import TimeframeChips from '../components/TimeframeChips';
import { DecksIcon } from '../navigation/TabIcons';
import { useDecks } from '../state/DecksContext';
import { StatsStackParamList } from '../navigation/types';
import {
  EMPTY_SESSION_SUMMARY,
  answerShares,
  countSessionsByDeckSince,
  countSessionsSince,
  getDeckStatsSince,
  getGlobalStatsSince,
  summarizeSessionsByDeck,
} from '../utils/stats';
import { findCategory } from '../utils/categories';
import { filterByTitle } from '../utils/search';
import { timeframeStart, type Timeframe } from '../utils/timeframe';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<StatsStackParamList, 'StatsOverview'>;

const TOTAL_REVIEWS_CAPTION: Record<Timeframe, string> = {
  all: 'Answers recorded',
  month: 'Answers this month',
  week: 'Answers in the last 7 days',
};

export default function StatsScreen({ navigation }: Props) {
  const { decks, sessions, categories } = useDecks();
  const [timeframe, setTimeframe] = useState<Timeframe>('all');
  // The window is cut from the clock when these are derived, so it is recomputed with the data.
  const windowed = useMemo(() => {
    const since = timeframeStart(timeframe, Date.now());
    const global = getGlobalStatsSince(decks, sessions, since);
    return {
      global,
      globalShares: answerShares(global),
      sessionCount: countSessionsSince(sessions, since),
      deckStats: getDeckStatsSince(decks, sessions, since),
      deckSessions: countSessionsByDeckSince(sessions, since),
    };
  }, [timeframe, decks, sessions]);
  const { global, globalShares, sessionCount } = windowed;
  // `Last` is the latest session start over all time, whatever the timeframe.
  const sessionsByDeck = useMemo(() => summarizeSessionsByDeck(sessions), [sessions]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const visibleDecks = useMemo(() => filterByTitle(decks, query, deck => deck.name), [decks, query]);
  const rows = useMemo(
    () =>
      visibleDecks.flatMap(deck => {
        const stats = windowed.deckStats.get(deck.id);
        if (!stats) {
          return [];
        }
        return [
          {
            deck,
            stats,
            shares: answerShares(stats),
            category: findCategory(deck.categoryId, categories),
            sessionTotal: windowed.deckSessions.get(deck.id)?.total ?? 0,
            lastSessionAt:
              (sessionsByDeck.get(deck.id) ?? EMPTY_SESSION_SUMMARY).lastSessionAt,
          },
        ];
      }),
    [visibleDecks, categories, windowed, sessionsByDeck],
  );

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
      <HeaderToolbar onSearch={toggleSearch} searchActive={searchOpen} searchLabel="Search decks" />
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
      {decks.length === 0 ? null : (
        <View style={styles.chips}>
          <TimeframeChips value={timeframe} onChange={setTimeframe} />
        </View>
      )}
      <FlatList
        data={rows}
        keyExtractor={row => row.deck.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[styles.listContent, rows.length === 0 && styles.listContentEmpty]}
        ListHeaderComponent={
          decks.length === 0 ? undefined : (
            <View style={styles.header}>
              <View style={styles.section}>
                <Text accessibilityRole="header" style={styles.sectionHeading}>
                  Aggregated stats
                </Text>
                <View style={styles.aggregate}>
                  <MasteryRing shares={globalShares} rate={global.successRate} tally={global} />
                  <View style={styles.tileRow}>
                    <StatTile
                      icon={<DecksIcon color={colors.primary} />}
                      label="Decks"
                      value={String(global.deckCount)}
                      caption="In your library"
                    />
                    <StatTile
                      icon={<MenuIcon name="file" color={colors.primary} />}
                      label="Total cards"
                      value={String(global.cardCount)}
                      caption="Across all decks"
                    />
                  </View>
                  <View style={styles.tileRow}>
                    <StatTile
                      icon={<MenuIcon name="tally" color={colors.primary} />}
                      label="Total reviews"
                      value={String(global.reviewCount)}
                      caption={TOTAL_REVIEWS_CAPTION[timeframe]}
                    />
                    <StatTile
                      icon={<MenuIcon name="clock" color={colors.primary} />}
                      label="Sessions"
                      value={String(sessionCount.total)}
                      caption={`${sessionCount.active} active`}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.breakdownHeading}>
                <Text accessibilityRole="header" style={styles.sectionHeading}>
                  Decks breakdown
                </Text>
                <Text style={styles.deckCount}>
                  {rows.length} {rows.length === 1 ? 'deck' : 'decks'}
                </Text>
              </View>
            </View>
          )
        }
        ListEmptyComponent={
          decks.length === 0 ? (
            <EmptyState
              title="No statistics yet"
              message="Import a deck and study it; results will show up here."
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
        renderItem={({ item: row }) => (
          <DeckStatsCard
            name={row.deck.name}
            category={row.category}
            cardCount={row.stats.cardCount}
            reviewCount={row.stats.reviewCount}
            shares={row.shares}
            sessionCount={row.sessionTotal}
            lastSessionAt={row.lastSessionAt}
            onPress={() => navigation.navigate('DeckStats', { deckId: row.deck.id })}
          />
        )}
      />
    </View>
  );
}

function StatTile({
  icon,
  label,
  value,
  caption,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  caption: string;
}) {
  const { fontScale } = useWindowDimensions();
  const scale = Math.min(fontScale, MAX_TILE_FONT_SCALE);
  return (
    <View accessible accessibilityLabel={`${label}: ${value}, ${caption}`} style={styles.tile}>
      <View style={styles.tileHead}>
        {icon ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.tileIcon}>
            {icon}
          </View>
        ) : null}
        <Text maxFontSizeMultiplier={1.3} numberOfLines={2} style={styles.tileLabel}>
          {label}
        </Text>
      </View>
      <View style={styles.tileBody}>
        <View style={[styles.tileValueBox, { height: Math.ceil(VALUE_LINE_HEIGHT * scale) }]}>
          <Text
            maxFontSizeMultiplier={MAX_TILE_FONT_SCALE}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            style={styles.tileValue}>
            {value}
          </Text>
        </View>
        <View style={{ height: 2 * Math.ceil(CAPTION_LINE_HEIGHT * scale) }}>
          <Text maxFontSizeMultiplier={MAX_TILE_FONT_SCALE} numberOfLines={2} style={styles.tileCaption}>
            {caption}
          </Text>
        </View>
      </View>
    </View>
  );
}

const MAX_TILE_FONT_SCALE = 1.3;
const VALUE_LINE_HEIGHT = 34;
const CAPTION_LINE_HEIGHT = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chips: {
    paddingHorizontal: spacing.md,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  header: {
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeading: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  aggregate: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  tileRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
    justifyContent: 'space-between',
  },
  // The body (value and a two-line caption) has the same height in every tile and sits at the
  // bottom of a stretched tile, so values line up in a row whatever the label or caption wraps to.
  tileBody: {
    gap: spacing.xs,
  },
  // Fixed-height box: a value shrunk to fit stays centred where an unshrunk one would be.
  tileValueBox: {
    justifyContent: 'center',
  },
  tileHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 24,
  },
  tileIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tileValue: {
    color: colors.text,
    fontSize: 28,
    lineHeight: VALUE_LINE_HEIGHT,
    fontWeight: '700',
  },
  tileCaption: {
    color: colors.textDim,
    fontSize: 12,
    lineHeight: CAPTION_LINE_HEIGHT,
  },
  breakdownHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  deckCount: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
