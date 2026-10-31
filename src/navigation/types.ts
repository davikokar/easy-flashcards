import type { NavigatorScreenParams } from '@react-navigation/native';

export type DecksStackParamList = {
  DecksList: undefined;
  EditDeck: { deckId: string };
};

export type LearnStackParamList = {
  LearnList: undefined;
  Study: { sessionId: string; mode?: 'review' };
};

export type CategoriesStackParamList = {
  CategoriesList: undefined;
  NewCategory: undefined;
};

export type StatsStackParamList = {
  StatsOverview: undefined;
  DeckStats: { deckId: string };
};

export type RootTabParamList = {
  DecksTab: NavigatorScreenParams<DecksStackParamList>;
  LearnTab: NavigatorScreenParams<LearnStackParamList>;
  CategoriesTab: NavigatorScreenParams<CategoriesStackParamList>;
  StatsTab: NavigatorScreenParams<StatsStackParamList>;
};
