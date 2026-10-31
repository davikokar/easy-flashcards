export type Card = {
  id: string;
  question: string;
  answer: string;
  okCount: number;
  okeishCount: number;
  notOkCount: number;
  lastReviewedAt: number | null;
};

export type Deck = {
  id: string;
  name: string;
  /** Free text; '' when the deck has none. */
  description: string;
  /** A default or custom category id, not checked against the categories; null for none. */
  categoryId: string | null;
  sourceFileName: string | null;
  createdAt: number;
  lastStudiedAt: number | null;
  cards: Card[];
};

export type Answer = 'ok' | 'okeish' | 'notOk';

export type SessionResult = {
  cardId: string;
  answer: Answer;
};

/** A learning session: one pass over a snapshot of a deck's cards. */
export type Session = {
  id: string;
  deckId: string;
  deckName: string;
  cardIds: string[];
  results: SessionResult[];
  startedAt: number;
  updatedAt: number;
  completedAt: number | null;
  /** When a completed session was hidden from the Learn list; null while listed. Never set on an active session. */
  clearedAt: number | null;
  /** Missed or unsure cards since answered Ok in a review of this session; always [] while active. */
  fixedCardIds: string[];
  /** Show each card's answer first; fixed when the session is created. */
  inverted: boolean;
};

/** A completed session's error review: hidden, still has cards to go over, or finished. */
export type ReviewState =
  | { kind: 'none' }
  | { kind: 'outstanding'; count: number }
  | { kind: 'done' };

export type DeckStats = {
  cardCount: number;
  reviewCount: number;
  okCount: number;
  okeishCount: number;
  notOkCount: number;
  successRate: number | null;
};

export type SessionSummary = {
  total: number;
  active: number;
  completed: number;
  lastSessionAt: number | null;
};

/** Per-answer counts for one session's results. */
export type AnswerTally = {
  okCount: number;
  okeishCount: number;
  notOkCount: number;
};

/** Each answer's percentage of all reviews (0-100). */
export type AnswerShares = {
  ok: number;
  okeish: number;
  notOk: number;
};

/** The icons the default categories use. */
export type DefaultCategoryIcon =
  | 'astronomy'
  | 'biology'
  | 'botany'
  | 'chemistry'
  | 'cinema'
  | 'computer_science'
  | 'economics'
  | 'gastronomy'
  | 'geography'
  | 'history'
  | 'languages'
  | 'law'
  | 'literature'
  | 'mathematics'
  | 'medicine'
  | 'music'
  | 'philosophy'
  | 'physics'
  | 'religion'
  | 'sport'
  | 'zoology';

/** Icons that belong to no default category; a custom category may choose one. */
export type ExtraCategoryIcon =
  | 'plane_contrails'
  | 'anchor'
  | 'nutrition'
  | 'emergency'
  | 'microbiology'
  | 'finance'
  | 'sports_basketball'
  | 'neurology'
  | 'bug_report'
  | 'calendar_month'
  | 'photo_camera'
  | 'camera'
  | 'cannabis'
  | 'directions_car'
  | 'chess_pawn'
  | 'language_chinese_dayi'
  | 'location_city'
  | 'circle_circle'
  | 'restaurant'
  | 'database'
  | 'nest_heat_link_e'
  | 'engineering'
  | 'face'
  | 'face_3'
  | 'theaters'
  | 'flag_2'
  | 'science'
  | 'save'
  | 'sports_and_outdoors'
  | 'skillet'
  | 'sports_esports'
  | 'language'
  | 'diversity_3'
  | 'psychology'
  | 'headphones'
  | 'health_and_safety'
  | 'landscape_2'
  | 'hive'
  | 'hourglass_empty'
  | 'house'
  | 'icecream'
  | 'temp_preferences_eco'
  | 'electric_bolt'
  | 'wand_stars'
  | 'biotech'
  | 'mindfulness'
  | 'motorcycle'
  | 'music_note_2'
  | 'network_node'
  | 'import_contacts'
  | 'pan_tool'
  | 'pets'
  | 'stylus'
  | 'person'
  | 'history_edu'
  | 'radio'
  | 'raven'
  | 'rib_cage'
  | 'rocket_launch'
  | 'scatter_plot'
  | 'category'
  | 'interests'
  | 'shopping_cart'
  | 'functions'
  | 'skull'
  | 'emoji_language'
  | 'snowflake'
  | 'hotel_class'
  | 'mountain_flag'
  | 'sunny'
  | 'mixture_med'
  | 'temple_buddhist'
  | 'text_snippet'
  | 'theater_comedy'
  | 'nest_thermostat_gen_3'
  | 'translate'
  | 'nature'
  | 'fertile'
  | 'videocam'
  | 'coronavirus'
  | 'volcano'
  | 'warning'
  | 'water'
  | 'air'
  | 'build';

export type CategoryIcon = DefaultCategoryIcon | ExtraCategoryIcon;

/** A subject category. Defaults are built into the app; only custom ones are stored. */
export type Category = {
  id: string;
  name: string;
  /** A hex colour string. */
  color: string;
  icon: CategoryIcon;
  createdAt: number;
};
