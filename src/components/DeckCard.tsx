import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import KebabMenu from './KebabMenu';
import MasteryBar from './MasteryBar';
import { MenuItem } from './MenuSheet';
import MenuIcon from './MenuIcons';
import { AnswerShares } from '../types';
import { colors, radius, spacing } from '../theme';

type Props = {
  name: string;
  cardCount: number;
  shares: AnswerShares | null;
  sessionCount: number;
  activeCount: number;
  lastSession: string;
  menuItems: MenuItem[];
  onStart: () => void;
};

export default function DeckCard({
  name,
  cardCount,
  shares,
  sessionCount,
  activeCount,
  lastSession,
  menuItems,
  onStart,
}: Props) {
  const hasActive = activeCount > 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.count}>
            {cardCount} card{cardCount === 1 ? '' : 's'}
          </Text>
        </View>
        <KebabMenu
          title={name}
          accessibilityLabel={`Options for ${name}`}
          items={menuItems}
        />
      </View>

      <MasteryBar shares={shares} />

      <View style={styles.meta}>
        <View style={styles.metaText}>
          <View style={styles.metaCounts}>
            <View style={styles.sessions}>
              <MenuIcon name="clock" color={colors.textDim} size={14} />
              <Text style={styles.sessionText}>
                {sessionCount} session{sessionCount === 1 ? '' : 's'}
              </Text>
            </View>
            <View style={[styles.pill, hasActive && styles.pillActive]}>
              {hasActive ? <View style={styles.pillDot} /> : null}
              <Text style={[styles.pillText, hasActive && styles.pillTextActive]}>
                {activeCount} active
              </Text>
            </View>
          </View>
          <Text style={styles.last} numberOfLines={1}>
            Last: <Text style={styles.lastValue}>{lastSession}</Text>
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Start session for ${name}`}
          hitSlop={6}
          onPress={onStart}
          style={({ pressed }) => [styles.play, pressed && styles.playPressed]}>
          <MenuIcon name="play" color={colors.background} size={16} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  count: {
    color: colors.textMuted,
    fontSize: 13,
  },
  // Two lines of text beside the play button: one row does not fit 360dp.
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  metaText: {
    flex: 1,
    gap: spacing.xs,
  },
  metaCounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: spacing.sm,
    rowGap: spacing.xs,
  },
  sessions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sessionText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  // Translucent primary, built from the token so the tint follows it.
  pillActive: {
    borderColor: `${colors.primary}4d`,
    backgroundColor: `${colors.primary}26`,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  pillText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  last: {
    color: colors.textDim,
    fontSize: 12,
  },
  lastValue: {
    color: colors.textMuted,
  },
  play: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    elevation: 2,
  },
  playPressed: {
    opacity: 0.75,
  },
});
