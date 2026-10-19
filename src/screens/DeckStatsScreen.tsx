import React, { useEffect, useMemo } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import RichText from '../components/RichText';
import SuccessBar from '../components/SuccessBar';
import { useDecks } from '../state/DecksContext';
import { StatsStackParamList } from '../navigation/types';
import {
  cardReviewCount,
  formatDate,
  formatRate,
  getDeckStats,
  sortCardsByDifficulty,
  successRate,
  summarizeSessions,
} from '../utils/stats';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<StatsStackParamList, 'DeckStats'>;

export default function DeckStatsScreen({ route, navigation }: Props) {
  const { deckId } = route.params;
  const { getDeck, sessions, resetDeckStats } = useDecks();
  const deck = getDeck(deckId);

  useEffect(() => {
    navigation.setOptions({ title: deck?.name ?? 'Deck statistics' });
  }, [navigation, deck?.name]);

  const cards = useMemo(() => (deck ? sortCardsByDifficulty(deck.cards) : []), [deck]);
  const sessionSummary = useMemo(
    () => summarizeSessions(sessions.filter(session => session.deckId === deckId)),
    [sessions, deckId],
  );

  if (!deck) {
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

  const stats = getDeckStats(deck);

  const confirmReset = () => {
    Alert.alert(
      'Reset statistics',
      `Clear all recorded results and sessions for "${deck.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetDeckStats(deck.id) },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        keyExtractor={card => card.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.summary}>
            <Text style={styles.summaryValue}>{formatRate(stats.successRate)}</Text>
            <SuccessBar rate={stats.successRate} height={10} />
            <View style={styles.metaRow}>
              <Text style={styles.meta}>{stats.reviewCount} reviews</Text>
              <Text style={[styles.meta, styles.ok]}>{stats.okCount} ok</Text>
              <Text style={[styles.meta, styles.notOk]}>{stats.notOkCount} not ok</Text>
              <Text style={styles.meta}>{sessionSummary.total} sessions</Text>
            </View>
            <Text style={styles.meta}>Last session {formatDate(sessionSummary.lastSessionAt)}</Text>
            <Text style={styles.sectionTitle}>Cards, hardest first</Text>
            <Button label="Reset statistics" variant="secondary" onPress={confirmReset} />
          </View>
        }
        renderItem={({ item }) => {
          const reviews = cardReviewCount(item);
          const rate = successRate(item.okCount, item.notOkCount);
          return (
            <View style={styles.card}>
              <RichText html={item.question} style={styles.question} numberOfLines={2} />
              <RichText html={item.answer} style={styles.answer} numberOfLines={2} />
              <SuccessBar rate={rate} height={6} />
              <View style={styles.metaRow}>
                <Text style={styles.cardRate}>{formatRate(rate)}</Text>
                <Text style={styles.meta}>{reviews === 0 ? 'Never reviewed' : `${reviews} reviews`}</Text>
                <Text style={[styles.meta, styles.ok]}>{item.okCount} ok</Text>
                <Text style={[styles.meta, styles.notOk]}>{item.notOkCount} not ok</Text>
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
  listContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  question: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  answer: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.md,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  cardRate: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  ok: {
    color: colors.success,
  },
  notOk: {
    color: colors.danger,
  },
});
