import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import FlipCard from '../components/FlipCard';
import HistoryStrip from '../components/HistoryStrip';
import SuccessBar from '../components/SuccessBar';
import { useDecks } from '../state/DecksContext';
import { DecksStackParamList } from '../navigation/types';
import { Answer, Card, SessionResult } from '../types';
import { formatRate, successRate } from '../utils/stats';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<DecksStackParamList, 'Study'>;

const SWIPE_THRESHOLD = 60;

export default function StudyScreen({ route, navigation }: Props) {
  const { deckId } = route.params;
  const { getDeck, commitSession } = useDecks();
  const deck = getDeck(deckId);

  const [cards] = useState<Card[]>(() => deck?.cards ?? []);
  const [queue, setQueue] = useState<string[]>(() => (deck?.cards ?? []).map(card => card.id));
  // `index` is the frontier: the first card that has not been answered yet.
  const [index, setIndex] = useState(0);
  // `viewIndex` is the card on screen, which may be an already answered one.
  const [viewIndex, setViewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<SessionResult[]>([]);

  const resultsRef = useRef<SessionResult[]>([]);
  const committedRef = useRef(false);
  const commitRef = useRef(commitSession);
  const navStateRef = useRef({ viewIndex: 0, frontier: 0 });
  const translateX = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    commitRef.current = commitSession;
  }, [commitSession]);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  const commitPending = useCallback(() => {
    if (committedRef.current || resultsRef.current.length === 0) {
      return;
    }
    committedRef.current = true;
    commitRef.current(deckId, resultsRef.current);
  }, [deckId]);

  // Statistics are saved when the session ends, including an early exit.
  useEffect(() => () => commitPending(), [commitPending]);

  const cardsById = useMemo(() => new Map(cards.map(card => [card.id, card])), [cards]);
  const isFinished = index >= queue.length;
  const isReviewing = viewIndex < index;
  const currentCard = isFinished ? undefined : cardsById.get(queue[viewIndex]);

  useEffect(() => {
    navStateRef.current = { viewIndex, frontier: index };
  }, [viewIndex, index]);

  useEffect(() => {
    if (isFinished && queue.length > 0) {
      commitPending();
    }
  }, [isFinished, queue.length, commitPending]);

  useEffect(() => {
    navigation.setOptions({ title: deck?.name ?? 'Study' });
  }, [navigation, deck?.name]);

  const answer = useCallback(
    (value: Answer) => {
      const liveCard = cardsById.get(queue[index]);
      if (!liveCard || viewIndex !== index) {
        return;
      }
      setResults(previous => [...previous, { cardId: liveCard.id, answer: value }]);
      setFlipped(false);
      setIndex(previous => previous + 1);
      setViewIndex(previous => previous + 1);
    },
    [cardsById, queue, index, viewIndex],
  );

  // Slides the current card out, swaps it, then slides the new one in from the other side.
  const slideTo = useCallback(
    (target: number, exitOffset: number) => {
      Animated.timing(translateX, {
        toValue: exitOffset,
        duration: 130,
        useNativeDriver: true,
      }).start(() => {
        setViewIndex(target);
        setFlipped(false);
        translateX.setValue(-exitOffset);
        Animated.timing(translateX, {
          toValue: 0,
          duration: 170,
          useNativeDriver: true,
        }).start();
      });
    },
    [translateX],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          Math.abs(gesture.dx) > 14 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5,
        onPanResponderMove: (_event, gesture) => {
          const { viewIndex: from, frontier } = navStateRef.current;
          const blocked =
            (gesture.dx > 0 && from === 0) || (gesture.dx < 0 && from >= frontier);
          translateX.setValue(blocked ? gesture.dx * 0.15 : gesture.dx);
        },
        onPanResponderRelease: (_event, gesture) => {
          const { viewIndex: from, frontier } = navStateRef.current;
          if (gesture.dx > SWIPE_THRESHOLD && from > 0) {
            slideTo(from - 1, windowWidth);
            return;
          }
          if (gesture.dx < -SWIPE_THRESHOLD && from < frontier) {
            slideTo(from + 1, -windowWidth);
            return;
          }
          Animated.spring(translateX, {
            toValue: 0,
            bounciness: 0,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateX, {
            toValue: 0,
            bounciness: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [slideTo, translateX, windowWidth],
  );

  const restart = useCallback(
    (cardIds: string[]) => {
      commitPending();
      committedRef.current = false;
      resultsRef.current = [];
      setResults([]);
      setQueue(cardIds);
      setIndex(0);
      setViewIndex(0);
      setFlipped(false);
      translateX.setValue(0);
    },
    [commitPending, translateX],
  );

  if (!deck || cards.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Nothing to study"
          message="This deck is no longer available or has no cards."
          actionLabel="Back to decks"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  if (isFinished) {
    const okCount = results.filter(result => result.answer === 'ok').length;
    const notOkCount = results.length - okCount;
    const missedIds = [
      ...new Set(results.filter(result => result.answer === 'notOk').map(result => result.cardId)),
    ];

    return (
      <View style={[styles.container, styles.summaryContainer]}>
        <Text style={styles.summaryTitle}>Session complete</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryRate}>{formatRate(successRate(okCount, notOkCount))}</Text>
          <SuccessBar rate={successRate(okCount, notOkCount)} height={10} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryOk}>Ok {okCount}</Text>
            <Text style={styles.summaryNotOk}>Not Ok {notOkCount}</Text>
            <Text style={styles.summaryMeta}>Reviewed {results.length}</Text>
          </View>
        </View>

        <View style={styles.summaryActions}>
          {missedIds.length > 0 ? (
            <Button
              label={`Review the ${missedIds.length} missed`}
              onPress={() => restart(missedIds)}
            />
          ) : null}
          <Button
            label="Study the whole deck again"
            variant="secondary"
            onPress={() => restart(cards.map(card => card.id))}
          />
          <Button label="Back to decks" variant="secondary" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>
          Card {viewIndex + 1} of {queue.length}
        </Text>
        <Text style={styles.progressText}>
          Ok {results.filter(result => result.answer === 'ok').length}
        </Text>
      </View>
      <SuccessBar rate={(index / queue.length) * 100} height={6} />

      <HistoryStrip results={results} currentIndex={viewIndex} />

      <Animated.View
        style={[styles.cardArea, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}>
        {currentCard ? (
          <FlipCard
            question={currentCard.question}
            answer={currentCard.answer}
            flipped={flipped}
            onFlip={() => setFlipped(previous => !previous)}
          />
        ) : null}
      </Animated.View>

      <Text style={styles.swipeHint}>
        {isReviewing
          ? 'Reviewing an answered card \u2014 swipe left to get back to where you were'
          : index > 0
          ? 'Swipe right to review the cards you already answered'
          : ' '}
      </Text>

      <View style={styles.feedback}>
        <Button
          label="Not Ok"
          variant="danger"
          disabled={isReviewing}
          onPress={() => answer('notOk')}
          style={styles.feedbackButton}
        />
        <Button
          label="Ok"
          variant="success"
          disabled={isReviewing}
          onPress={() => answer('ok')}
          style={styles.feedbackButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    gap: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  cardArea: {
    flex: 1,
    marginVertical: spacing.sm,
  },
  swipeHint: {
    color: colors.textDim,
    fontSize: 12,
    textAlign: 'center',
  },
  feedback: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  feedbackButton: {
    flex: 1,
  },
  summaryContainer: {
    justifyContent: 'center',
    gap: spacing.lg,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  summaryRate: {
    color: colors.text,
    fontSize: 44,
    fontWeight: '800',
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryOk: {
    color: colors.success,
    fontSize: 15,
    fontWeight: '700',
  },
  summaryNotOk: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
  summaryMeta: {
    color: colors.textMuted,
    fontSize: 15,
  },
  summaryActions: {
    gap: spacing.sm,
  },
});
