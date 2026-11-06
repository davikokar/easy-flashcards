export const study = {
  studyScreen: {
    fallbackTitle: 'Session',
    unavailableTitle: 'Nothing to study',
    unavailableMessage: 'This session is no longer available.',
    unavailableAction: 'Back to sessions',
  },
  progressHeader: {
    position: 'Card {current} of {total}',
    okCount: 'Ok {count}',
  },
  invertedPill: {
    text: 'Inverted',
    a11yLabel: 'Inverted session: the front shows the answer',
  },
  swipeHint: {
    reviewing: 'Reviewing an answered card \u2014 swipe left to get back to where you were',
  },
  historyStrip: {
    a11yLabel: 'Answers so far',
  },
  flipCard: {
    questionLabel: 'QUESTION',
    answerLabel: 'ANSWER',
    revealHint: 'Tap to reveal the answer',
    backHint: 'Tap to see the question again',
    showQuestionA11yLabel: 'Show question',
    showAnswerA11yLabel: 'Show answer',
  },
  sessionSummary: {
    title: 'Session complete',
    successRateA11yLabel: 'Success rate {rate}',
    reviewedCount: 'Reviewed {count}',
    studyAgainLabel: 'Study the whole deck again',
    studyAgainButtonA11yLabel: 'Study the whole deck again',
  },
  reviewSummary: {
    title: 'Review complete',
    stillToFix: '{count} still to fix',
    allFixed: 'All fixed',
  },
  summaryAction: {
    reviewLabel: 'Review the missed or unsure cards',
    reviewButtonA11yLabel: {
      one: 'Review the {count} missed or unsure card',
      other: 'Review the {count} missed or unsure cards',
    },
    backLabel: 'Back to sessions',
    backButtonA11yLabel: 'Back to sessions',
  },
} as const;
