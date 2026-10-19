import type { NavigatorScreenParams } from '@react-navigation/native';

export type DecksStackParamList = {
  DecksList: undefined;
};

export type LearnStackParamList = {
  LearnList: undefined;
  Study: { sessionId: string };
};

export type StatsStackParamList = {
  StatsOverview: undefined;
  DeckStats: { deckId: string };
};

export type RootTabParamList = {
  DecksTab: NavigatorScreenParams<DecksStackParamList>;
  LearnTab: NavigatorScreenParams<LearnStackParamList>;
  StatsTab: NavigatorScreenParams<StatsStackParamList>;
};
