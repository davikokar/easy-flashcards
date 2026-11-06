export const answers = {
  answerLabels: {
    ok: 'Ok',
    okeish: 'Okeish',
    notOk: 'Not ok',
  },
  shares: {
    notReviewed: 'Not reviewed yet',
    summary: '{ok} Ok, {okeish} Okeish, {notOk} Not ok',
  },
  cardStatus: {
    needsReview: 'Needs review',
    learning: 'Learning',
    mastered: 'Mastered',
    new: 'New',
  },
  timeframes: {
    all: 'All time',
    month: 'This month',
    week: 'Last 7 days',
  },
  sortOrders: {
    hardest: 'Hardest first',
    deck: 'Deck order',
    recent: 'Recently reviewed',
  },
  dates: {
    never: 'Never',
  },
} as const;
