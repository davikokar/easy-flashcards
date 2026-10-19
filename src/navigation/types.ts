import type { NavigatorScreenParams } from '@react-navigation/native';

export type DecksStackParamList = {
  DecksList: undefined;
  Study: { deckId: string };
};

export type StatsStackParamList = {
  StatsOverview: undefined;
  DeckStats: { deckId: string };
};

export type RootTabParamList = {
  DecksTab: NavigatorScreenParams<DecksStackParamList>;
  StatsTab: NavigatorScreenParams<StatsStackParamList>;
};
