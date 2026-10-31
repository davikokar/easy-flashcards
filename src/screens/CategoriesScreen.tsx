import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppMenu from '../components/AppMenu';
import Button from '../components/Button';
import CategoryTile from '../components/CategoryTile';
import MenuSheet from '../components/MenuSheet';
import { useDecks } from '../state/DecksContext';
import { CategoriesStackParamList } from '../navigation/types';
import { Category } from '../types';
import {
  DEFAULT_CATEGORIES,
  countDecksInCategory,
  sortCategoriesByName,
} from '../utils/categories';
import { colors, spacing } from '../theme';

type Props = NativeStackScreenProps<CategoriesStackParamList, 'CategoriesList'>;

export default function CategoriesScreen({ navigation }: Props) {
  const { decks, categories, deleteCategory } = useDecks();
  const customs = useMemo(() => sortCategoriesByName(categories), [categories]);
  // The sheet keeps its category while it fades out, so `menuVisible` is separate from it.
  const [menuCategory, setMenuCategory] = useState<Category | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const menu = useMemo(() => <AppMenu variant="boxed" />, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.background },
      headerTitleStyle: { color: colors.text, fontSize: 24, fontWeight: '700' },
      headerRight: () => menu,
    });
  }, [navigation, menu]);

  const openMenu = useCallback((category: Category) => {
    setMenuCategory(category);
    setMenuVisible(true);
  }, []);

  const confirmDelete = useCallback(
    (category: Category) => {
      const deckCount = countDecksInCategory(decks, category.id);
      const consequence =
        deckCount === 0
          ? ''
          : deckCount === 1
            ? ' 1 deck will have no category.'
            : ` ${deckCount} decks will have no category.`;
      Alert.alert('Delete category?', `"${category.name}" will be deleted.${consequence}`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(category.id) },
      ]);
    },
    [decks, deleteCategory],
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Custom categories" subtitle={`${customs.length} available`}>
          {customs.length === 0 ? (
            <Text style={styles.hint}>Your own categories will appear here.</Text>
          ) : (
            <View style={styles.grid}>
              {customs.map(category => (
                <View key={category.id} style={styles.cell}>
                  <CategoryTile
                    name={category.name}
                    color={category.color}
                    icon={category.icon}
                    accessibilityLabel={`Options for ${category.name}`}
                    onPress={() => openMenu(category)}
                  />
                </View>
              ))}
            </View>
          )}
        </Section>
        <Section title="Default categories" subtitle={`${DEFAULT_CATEGORIES.length} built in`}>
          <View style={styles.grid}>
            {DEFAULT_CATEGORIES.map(category => (
              <View key={category.id} style={styles.cell}>
                <CategoryTile name={category.name} color={category.color} icon={category.icon} />
              </View>
            ))}
          </View>
        </Section>
      </ScrollView>

      {/* A sibling of the scroll view, not an overlay, so it never covers the last row. */}
      <View style={styles.footer}>
        <Button label="New category" onPress={() => navigation.navigate('NewCategory')} />
      </View>

      <MenuSheet
        visible={menuVisible}
        title={menuCategory?.name}
        onClose={() => setMenuVisible(false)}
        items={
          menuCategory
            ? [
                {
                  label: 'Delete category',
                  icon: 'delete',
                  destructive: true,
                  onPress: () => confirmDelete(menuCategory),
                },
              ]
            : []
        }
      />
    </View>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          {title}
        </Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
  hint: {
    color: colors.textDim,
    fontSize: 14,
  },
  // The negative margin cancels the cells' side padding, so tiles line up with the content edge.
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  cell: {
    width: `${100 / 3}%`,
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.md,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
