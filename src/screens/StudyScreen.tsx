import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AnswerIcon } from '../components/AnswerIcons';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import FlipCard from '../components/FlipCard';
import HistoryStrip from '../components/HistoryStrip';
import SuccessBar from '../components/SuccessBar';
import { useDecks } from '../state/DecksContext';
import { LearnStackParamList } from '../navigation/types';
import { Answer } from '../types';
import {
  formatRate,
  getMissedOrUnsureCardIds,
  getSessionTally,
  successRate,
} from '../utils/stats';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<LearnStackParamList, 'Study'>;

const SWIPE_THRESHOLD = 60;

const renderCrossIcon = (color: string) => <AnswerIcon name="cross" color={color} size={32} />;
const renderQuestionIcon = (color: string) => (
  <AnswerIcon name="question" color={color} size={32} />
);
const renderTickIcon = (color: string) => <AnswerIcon name="tick" color={color} size={32} />;

export default function StudyScreen({ route, navigation }: Props) {
  const { sessionId } = route.params;
  const { getSession, getDeck, startSession, recordAnswer } = useDecks();
  const session = getSession(sessionId);
  const deck = session ? getDeck(session.deckId) : undefined;

  const queue = useMemo(() => session?.cardIds ?? [], [session?.cardIds]);
  const results = useMemo(() => session?.results ?? [], [session?.results]);
  // `index` is the frontier: the first card that has not been answered yet.
  const index = results.length;
  // `viewIndex` is the card on screen, which may be an already answered one.
  const [viewIndex, setViewIndex] = useState(index);
  const [shownSessionId, setShownSessionId] = useState(sessionId);
  const [flipped, setFlipped] = useState(false);
  // The card whose answer side has been shown; keyed by id so it survives flipping back and swiping away.
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);

  // The screen can be reused for another session, so follow the new session's progress.
  if (shownSessionId !== sessionId) {
    setShownSessionId(sessionId);
    setViewIndex(index);
    setFlipped(false);
    setRevealedCardId(null);
  }

  const navStateRef = useRef({ viewIndex: index, frontier: index });
  const translateX = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;

  const cardsById = useMemo(
    () => new Map((deck?.cards ?? []).map(card => [card.id, card])),
    [deck?.cards],
  );
  const isFinished = queue.length > 0 && index >= queue.length;
  const isReviewing = viewIndex < index;
  const currentCard = isFinished ? undefined : cardsById.get(queue[viewIndex]);
  const hasSeenAnswer = currentCard !== undefined && currentCard.id === revealedCardId;
  const answersDisabled = isReviewing || !hasSeenAnswer;

  useEffect(() => {
    navStateRef.current = { viewIndex, frontier: index };
  }, [viewIndex, index]);

  useEffect(() => {
    navigation.setOptions({ title: deck?.name ?? 'Session' });
  }, [navigation, deck?.name]);

  const answer = useCallback(
    (value: Answer) => {
      const cardId = queue[index];
      if (!cardId || viewIndex !== index || cardId !== revealedCardId) {
        return;
      }
      recordAnswer(sessionId, cardId, value);
      setFlipped(false);
      setViewIndex(index + 1);
    },
    [queue, index, viewIndex, revealedCardId, recordAnswer, sessionId],
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

  const startAgain = useCallback(
    (cardIds?: string[]) => {
      if (!deck) {
        return;
      }
      const next = startSession(deck, cardIds);
      navigation.replace('Study', { sessionId: next.id });
    },
    [deck, navigation, startSession],
  );

  if (!session || !deck || queue.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Nothing to study"
          message="This session is no longer available."
          actionLabel="Back to sessions"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  const { okCount, okeishCount, notOkCount } = getSessionTally(session);

  if (isFinished) {
    const missedIds = getMissedOrUnsureCardIds(session);
    const rate = successRate(okCount, okeishCount, notOkCount);

    return (
      <View style={[styles.container, styles.summaryContainer]}>
        <Text style={styles.summaryTitle}>Session complete</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryRate}>{formatRate(rate)}</Text>
          <SuccessBar rate={rate} height={10} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryOk}>Ok {okCount}</Text>
            <Text style={styles.summaryOkeish}>Okeish {okeishCount}</Text>
            <Text style={styles.summaryNotOk}>Not Ok {notOkCount}</Text>
          </View>
          <Text style={styles.summaryMeta}>Reviewed {results.length}</Text>
        </View>

        <View style={styles.summaryActions}>
          {missedIds.length > 0 ? (
            <Button
              label={`Review the ${missedIds.length} missed or unsure`}
              onPress={() => startAgain(missedIds)}
            />
          ) : null}
          <Button
            label="Study the whole deck again"
            variant="secondary"
            onPress={() => startAgain()}
          />
          <Button label="Back to sessions" variant="secondary" onPress={() => navigation.goBack()} />
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
        <Text style={styles.progressText}>Ok {okCount}</Text>
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
            onFlip={() => {
              setFlipped(previous => !previous);
              setRevealedCardId(currentCard.id);
            }}
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
          accessibilityLabel="Not ok"
          variant="danger"
          icon={renderCrossIcon}
          disabled={answersDisabled}
          onPress={() => answer('notOk')}
          style={styles.feedbackButton}
        />
        <Button
          accessibilityLabel="Okeish"
          variant="warning"
          icon={renderQuestionIcon}
          disabled={answersDisabled}
          onPress={() => answer('okeish')}
          style={styles.feedbackButton}
        />
        <Button
          accessibilityLabel="Ok"
          variant="success"
          icon={renderTickIcon}
          disabled={answersDisabled}
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
  summaryOkeish: {
    color: colors.warning,
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
    textAlign: 'center',
  },
  summaryActions: {
    gap: spacing.sm,
  },
});
