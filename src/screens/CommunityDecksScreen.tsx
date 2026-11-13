import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { usePreventRemove } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CategoryTile from '../components/CategoryTile';
import CommunityDeckCard from '../components/CommunityDeckCard';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import { useT } from '../i18n/I18nProvider';
import { useDecks } from '../state/DecksContext';
import { DecksStackParamList } from '../navigation/types';
import { CommunityError, CommunityErrorCode, fetchCommunityDecks } from '../services/communityDecks';
import { loadAuthorUuid } from '../storage/identityStorage';
import { categoryDisplayName, resolveCategoryReference } from '../utils/categories';
import { CommunityDeckFile, importOfCommunityFile, isOwnedBy } from '../utils/communityDeck';
import {
  CommunityGroup,
  CommunityGroupSelection,
  findCommunityGroup,
  groupCommunityDecks,
  selectionOfCommunityGroup,
} from '../utils/communityGroups';
import { filterByTitle } from '../utils/search';
import { colors, spacing } from '../theme';

type Props = NativeStackScreenProps<DecksStackParamList, 'CommunityDecks'>;

type Status = 'loading' | 'ready' | 'error';

const DOWNLOAD_DEBOUNCE_MS = 1000;

export default function CommunityDecksScreen({ navigation }: Props) {
  const { categories, addDeck } = useDecks();
  const t = useT();
  const [status, setStatus] = useState<Status>('loading');
  const [errorCode, setErrorCode] = useState<CommunityErrorCode>('network');
  const [files, setFiles] = useState<CommunityDeckFile[]>([]);
  const [authorUuid, setAuthorUuid] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  // null is the Category level; otherwise the Deck level of that group.
  const [selection, setSelection] = useState<CommunityGroupSelection | null>(null);
  const lastDownloadAt = useRef(0);
  const loadId = useRef(0);

  const groups = useMemo(() => groupCommunityDecks(files, categories, t), [files, categories, t]);
  const activeGroup = useMemo(
    () => (selection === null ? undefined : findCommunityGroup(groups, selection)),
    [groups, selection],
  );
  const groupName = useCallback(
    (group: CommunityGroup) =>
      group.category === null ? t('community.otherGroup.name') : categoryDisplayName(group.category, t),
    [t],
  );

  const backToCategories = useCallback(() => {
    setSelection(null);
    setQuery('');
  }, []);

  // While a group is open, every removal of the route (Back, popToTop) returns to the Category level instead.
  usePreventRemove(activeGroup !== undefined, backToCategories);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: activeGroup ? groupName(activeGroup) : t('community.title'),
    });
  }, [navigation, activeGroup, groupName, t]);

  // The selected group has no decks any more, e.g. its custom category was deleted on another tab.
  useEffect(() => {
    if (selection !== null && activeGroup === undefined) {
      backToCategories();
    }
  }, [selection, activeGroup, backToCategories]);

  const load = useCallback(async () => {
    loadId.current += 1;
    const thisLoad = loadId.current;
    setStatus('loading');
    setSelection(null);
    setQuery('');
    try {
      const [list, uuid] = await Promise.all([
        fetchCommunityDecks(),
        loadAuthorUuid().catch(() => null),
      ]);
      if (thisLoad === loadId.current) {
        setFiles(list);
        setAuthorUuid(uuid);
        setStatus('ready');
      }
    } catch (loadError) {
      if (thisLoad === loadId.current) {
        setErrorCode(loadError instanceof CommunityError ? loadError.code : 'server');
        setStatus('error');
      }
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // The Deck level searches within its group; the Category level, across every group.
  const visibleFiles = useMemo(
    () => filterByTitle(activeGroup ? activeGroup.files : files, query, file => file.title),
    [activeGroup, files, query],
  );
  const showGrid = activeGroup === undefined && files.length > 0 && query.trim() === '';

  const openGroup = useCallback((group: CommunityGroup) => {
    setSelection(selectionOfCommunityGroup(group));
    setQuery('');
  }, []);

  const download = useCallback(
    (file: CommunityDeckFile) => {
      // A double tap would otherwise add the copy twice.
      if (Date.now() - lastDownloadAt.current < DOWNLOAD_DEBOUNCE_MS) {
        return;
      }
      lastDownloadAt.current = Date.now();
      const own = authorUuid !== null && isOwnedBy(file, authorUuid);
      const deck = addDeck({
        ...importOfCommunityFile(file),
        ...(own ? { communityId: file.deck_id } : {}),
      });
      Alert.alert(
        t('importExport.importAlert.successTitle'),
        t('importExport.importAlert.successMessage', {
          name: deck.name,
          count: deck.cards.length,
        }),
      );
    },
    [addDeck, authorUuid, t],
  );

  if (status === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <EmptyState
          title={t('community.loadFailedTitle')}
          message={t(`community.errors.${errorCode}`)}
          actionLabel={t('community.retryButton')}
          onAction={load}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {files.length > 0 ? (
        <SearchBar
          autoFocus={false}
          value={query}
          onChangeText={setQuery}
          onClose={() => setQuery('')}
          placeholder={t('community.searchPlaceholder')}
        />
      ) : null}
      {showGrid ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.gridContent}>
          <View style={styles.grid}>
            {groups.map(group => {
              const name = groupName(group);
              const count = group.files.length;
              const selectionOfGroup = selectionOfCommunityGroup(group);
              const tileProps = {
                name,
                caption: t('common.counts.decks', { count }),
                accessibilityLabel: t('community.communityDecksScreen.categoryTileA11yLabel', {
                  name,
                  count,
                }),
                onPress: () => openGroup(group),
              };
              return (
                <View
                  key={
                    selectionOfGroup.kind === 'other' ? 'other' : `category:${selectionOfGroup.id}`
                  }
                  style={styles.cell}>
                  {group.category === null ? (
                    <CategoryTile {...tileProps} none />
                  ) : (
                    <CategoryTile
                      {...tileProps}
                      color={group.category.color}
                      icon={group.category.icon}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={visibleFiles}
          keyExtractor={file => file.deck_id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.listContent, files.length === 0 && styles.listContentEmpty]}
          ListEmptyComponent={
            files.length === 0 ? (
              <EmptyState title={t('community.emptyTitle')} message={t('community.emptyMessage')} />
            ) : (
              <EmptyState
                title={t('common.search.noMatchesTitle')}
                message={t('common.search.noMatchesMessage', { query: query.trim() })}
                actionLabel={t('common.search.clearSearchButton')}
                onAction={() => setQuery('')}
              />
            )
          }
          renderItem={({ item }) => (
            <CommunityDeckCard
              title={item.title}
              description={item.description}
              category={activeGroup ? null : resolveCategoryReference(item.category, categories)}
              cardCount={item.cards.length}
              mine={authorUuid !== null && isOwnedBy(item, authorUuid)}
              onDownload={() => download(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  gridContent: {
    padding: spacing.md,
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
  listContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
});
