import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import EmptyState from '../components/EmptyState';
import SuccessBar from '../components/SuccessBar';
import { useDecks } from '../state/DecksContext';
import { StatsStackParamList } from '../navigation/types';
import { formatDate, formatRate, getDeckStats, getGlobalStats } from '../utils/stats';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<StatsStackParamList, 'StatsOverview'>;

export default function StatsScreen({ navigation }: Props) {
  const { decks } = useDecks();
  const global = useMemo(() => getGlobalStats(decks), [decks]);

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={deck => deck.id}
        contentContainerStyle={[styles.listContent, decks.length === 0 && styles.listContentEmpty]}
        ListHeaderComponent={
          decks.length === 0 ? undefined : (
            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>Overall success rate</Text>
              <Text style={styles.summaryValue}>{formatRate(global.successRate)}</Text>
              <SuccessBar rate={global.successRate} height={10} />
              <View style={styles.summaryGrid}>
                <Stat label="Decks" value={String(global.deckCount)} />
                <Stat label="Cards" value={String(global.cardCount)} />
                <Stat label="Reviews" value={String(global.reviewCount)} />
                <Stat label="Sessions" value={String(global.sessionCount)} />
                <Stat label="Ok" value={String(global.okCount)} tint={colors.success} />
                <Stat label="Not Ok" value={String(global.notOkCount)} tint={colors.danger} />
              </View>
            </View>
          )
        }
        ListEmptyComponent={
          <EmptyState
            title="No statistics yet"
            message="Import a deck and study it; results will show up here."
          />
        }
        renderItem={({ item }) => {
          const stats = getDeckStats(item);
          return (
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('DeckStats', { deckId: item.id })}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
              <View style={styles.cardHeader}>
                <Text style={styles.deckName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.rate}>{formatRate(stats.successRate)}</Text>
              </View>
              <SuccessBar rate={stats.successRate} />
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{stats.cardCount} cards</Text>
                <Text style={styles.meta}>{stats.reviewCount} reviews</Text>
                <Text style={styles.meta}>{item.sessionCount} sessions</Text>
                <Text style={styles.meta}>Last {formatDate(item.lastStudiedAt)}</Text>
              </View>
              <Text style={styles.drillDown}>Tap for per-card details</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

function Stat({ label, value, tint }: { label: string; value: string; tint?: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={[styles.statValue, tint ? { color: tint } : null]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  summary: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  statCell: {
    width: '33.33%',
    paddingVertical: spacing.sm,
  },
  statValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textDim,
    fontSize: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardPressed: {
    opacity: 0.75,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  deckName: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  rate: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
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
  drillDown: {
    color: colors.textDim,
    fontSize: 12,
  },
});
