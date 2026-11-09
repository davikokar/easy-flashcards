import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CommunityDeckCard from '../components/CommunityDeckCard';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import { useT } from '../i18n/I18nProvider';
import { useDecks } from '../state/DecksContext';
import { DecksStackParamList } from '../navigation/types';
import { CommunityError, CommunityErrorCode, fetchCommunityDecks } from '../services/communityDecks';
import { loadAuthorUuid } from '../storage/identityStorage';
import { resolveCategoryReference } from '../utils/categories';
import { CommunityDeckFile, importOfCommunityFile, isOwnedBy } from '../utils/communityDeck';
import { filterByTitle } from '../utils/search';
import { colors, spacing } from '../theme';

type Props = NativeStackScreenProps<DecksStackParamList, 'CommunityDecks'>;

type Status = 'loading' | 'ready' | 'error';

const DOWNLOAD_DEBOUNCE_MS = 1000;

export default function CommunityDecksScreen(_props: Props) {
  const { categories, addDeck } = useDecks();
  const t = useT();
  const [status, setStatus] = useState<Status>('loading');
  const [errorCode, setErrorCode] = useState<CommunityErrorCode>('network');
  const [files, setFiles] = useState<CommunityDeckFile[]>([]);
  const [authorUuid, setAuthorUuid] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const lastDownloadAt = useRef(0);
  const loadId = useRef(0);

  const load = useCallback(async () => {
    loadId.current += 1;
    const thisLoad = loadId.current;
    setStatus('loading');
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

  const visibleFiles = useMemo(() => filterByTitle(files, query, file => file.title), [files, query]);

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
            category={resolveCategoryReference(item.category, categories)}
            cardCount={item.cards.length}
            mine={authorUuid !== null && isOwnedBy(item, authorUuid)}
            onDownload={() => download(item)}
          />
        )}
      />
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
  listContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
});
