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
import { Answer, SessionResult } from '../types';
import {
  formatRate,
  getOutstandingReviewCardIds,
  getSessionTally,
  isSessionActive,
  previousReviewIndex,
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
  const { sessionId, mode } = route.params;
  const { getSession, getDeck, startSession, recordAnswer, recordReviewAnswer } = useDecks();
  const session = getSession(sessionId);
  const deck = session ? getDeck(session.deckId) : undefined;
  const isReviewMode = mode === 'review';
  const reviewUnavailable =
    isReviewMode && (!session || !deck || isSessionActive(session));

  // Live, so it also drives the summaries; a review pass copies it once, when the pass starts.
  const outstandingIds = useMemo(
    () => (session ? getOutstandingReviewCardIds(session, deck) : []),
    [session, deck],
  );
  // A review pass is a snapshot of the cards outstanding when it began, shown once each; its answers live here, not in the store.
  const [passIds, setPassIds] = useState<string[]>(() => (isReviewMode ? outstandingIds : []));
  const [passResults, setPassResults] = useState<SessionResult[]>([]);
  const [passNumber, setPassNumber] = useState(0);

  const queue = useMemo(
    () => (isReviewMode ? passIds : session?.cardIds ?? []),
    [isReviewMode, passIds, session?.cardIds],
  );
  const results = useMemo(
    () => (isReviewMode ? passResults : session?.results ?? []),
    [isReviewMode, passResults, session?.results],
  );
  // `index` is the frontier: the first card that has not been answered yet.
  const index = results.length;
  // `viewIndex` is the card on screen, which may be an already answered one.
  const [viewIndex, setViewIndex] = useState(index);
  const [shownSessionId, setShownSessionId] = useState(sessionId);
  const [shownMode, setShownMode] = useState(mode);
  const [flipped, setFlipped] = useState(false);
  // The card whose answer side has been shown; keyed by id so it survives flipping back and swiping away.
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);

  // The screen can be reused for another session or mode, so follow the new one's progress.
  if (shownSessionId !== sessionId || shownMode !== mode) {
    setShownSessionId(sessionId);
    setShownMode(mode);
    setPassIds(isReviewMode ? outstandingIds : []);
    setPassResults([]);
    setPassNumber(0);
    setViewIndex(isReviewMode ? 0 : session?.results.length ?? 0);
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
  // An empty review pass is finished at once: there was nothing left to fix.
  const isFinished = (isReviewMode || queue.length > 0) && index >= queue.length;
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
      if (isReviewMode) {
        recordReviewAnswer(sessionId, cardId, value);
        setPassResults(previous => [...previous, { cardId, answer: value }]);
      } else {
        recordAnswer(sessionId, cardId, value);
      }
      setFlipped(false);
      setViewIndex(index + 1);
    },
    [
      queue,
      index,
      viewIndex,
      revealedCardId,
      isReviewMode,
      recordAnswer,
      recordReviewAnswer,
      sessionId,
    ],
  );

  const startNextPass = useCallback(() => {
    setPassIds(outstandingIds);
    setPassResults([]);
    setPassNumber(previous => previous + 1);
    setViewIndex(0);
    setFlipped(false);
    setRevealedCardId(null);
    translateX.setValue(0);
  }, [outstandingIds, translateX]);

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
            (gesture.dx > 0 && previousReviewIndex(from, frontier) === null) ||
            (gesture.dx < 0 && from >= frontier);
          translateX.setValue(blocked ? gesture.dx * 0.15 : gesture.dx);
        },
        onPanResponderRelease: (_event, gesture) => {
          const { viewIndex: from, frontier } = navStateRef.current;
          const previous = previousReviewIndex(from, frontier);
          if (gesture.dx > SWIPE_THRESHOLD && previous !== null) {
            slideTo(previous, windowWidth);
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

  const startAgain = useCallback(() => {
    if (!deck) {
      return;
    }
    const next = startSession(deck);
    navigation.replace('Study', { sessionId: next.id });
  }, [deck, navigation, startSession]);

  if (!session || !deck || reviewUnavailable || (!isReviewMode && queue.length === 0)) {
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

  // Tally of what is on screen: the session's results, or the review pass's own.
  const { okCount, okeishCount, notOkCount } = getSessionTally({ ...session, results });

  if (isFinished && isReviewMode) {
    return (
      <View style={[styles.container, styles.summaryContainer]}>
        <Text style={styles.summaryTitle}>Review complete</Text>
        <View style={styles.summaryCard}>
          {results.length > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryOk}>Ok {okCount}</Text>
              <Text style={styles.summaryOkeish}>Okeish {okeishCount}</Text>
              <Text style={styles.summaryNotOk}>Not Ok {notOkCount}</Text>
            </View>
          ) : null}
          {outstandingIds.length > 0 ? (
            <Text style={styles.summaryMeta}>{outstandingIds.length} still to fix</Text>
          ) : (
            <View style={styles.fixedState}>
              <AnswerIcon name="tick" color={colors.success} size={44} />
              <Text style={styles.summaryFixed}>All fixed</Text>
            </View>
          )}
        </View>

        <View style={styles.summaryActions}>
          {outstandingIds.length > 0 ? (
            <Button
              label={`Review the ${outstandingIds.length} missed or unsure`}
              onPress={startNextPass}
            />
          ) : null}
          <Button label="Back to sessions" variant="secondary" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  if (isFinished) {
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
          {outstandingIds.length > 0 ? (
            <Button
              label={`Review the ${outstandingIds.length} missed or unsure`}
              onPress={() => navigation.replace('Study', { sessionId, mode: 'review' })}
            />
          ) : null}
          <Button
            label="Study the whole deck again"
            variant="secondary"
            onPress={startAgain}
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
      <SuccessBar rate={(index / queue.length) * 100} height={6} color={colors.text} />

      <HistoryStrip results={results} currentIndex={viewIndex} />

      <Animated.View
        style={[styles.cardArea, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}>
        {currentCard ? (
          <FlipCard
            // A fresh mount starts face-up; reusing one would show the old card's flip state on the new card.
            key={`${sessionId}-${mode ?? 'session'}-${passNumber}-${viewIndex}`}
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
  fixedState: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryFixed: {
    color: colors.success,
    fontSize: 24,
    fontWeight: '700',
  },
  summaryActions: {
    gap: spacing.sm,
  },
});
