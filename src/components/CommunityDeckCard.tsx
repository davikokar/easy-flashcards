import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import CategorySquare from './CategorySquare';
import MenuIcon from './MenuIcons';
import { useT } from '../i18n/I18nProvider';
import type { Category } from '../types';
import { colors, radius, spacing } from '../theme';

const renderDownloadIcon = (color: string) => <MenuIcon name="import" color={color} />;

type Props = {
  title: string;
  description: string;
  /** Drawn at the top left, before the title. Nothing, and no gap, when absent. */
  category: Category | null;
  cardCount: number;
  /** Published from this device, so the user may update it. */
  mine: boolean;
  onDownload: () => void;
};

export default function CommunityDeckCard({
  title,
  description,
  category,
  cardCount,
  mine,
  onDownload,
}: Props) {
  const t = useT();
  return (
    <View style={styles.card}>
      {category ? <CategorySquare category={category} /> : null}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {description !== '' ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
        <View style={styles.meta}>
          <Text style={styles.count}>{t('common.counts.cards', { count: cardCount })}</Text>
          {mine ? (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{t('community.yoursBadge')}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <Button
        variant="primary"
        accessibilityLabel={t('community.downloadA11yLabel', { name: title })}
        icon={renderDownloadIcon}
        onPress={onDownload}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    elevation: 3,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: spacing.sm,
    rowGap: spacing.xs,
    marginTop: spacing.xs,
  },
  count: {
    color: colors.textDim,
    fontSize: 12,
  },
  // Translucent primary, built from the token so the tint follows it.
  pill: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: `${colors.primary}4d`,
    backgroundColor: `${colors.primary}26`,
  },
  pillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
