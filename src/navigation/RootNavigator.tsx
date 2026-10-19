import React from 'react';
import { DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DecksScreen from '../screens/DecksScreen';
import StudyScreen from '../screens/StudyScreen';
import StatsScreen from '../screens/StatsScreen';
import DeckStatsScreen from '../screens/DeckStatsScreen';
import { DecksStackParamList, RootTabParamList, StatsStackParamList } from './types';
import { DecksIcon, StatsIcon } from './TabIcons';
import { colors } from '../theme';

const navigationTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.danger,
  },
};

const DecksStack = createNativeStackNavigator<DecksStackParamList>();
const StatsStack = createNativeStackNavigator<StatsStackParamList>();
const Tabs = createBottomTabNavigator<RootTabParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerTitleStyle: { color: colors.text },
  contentStyle: { backgroundColor: colors.background },
} as const;

function DecksNavigator() {
  return (
    <DecksStack.Navigator screenOptions={screenOptions}>
      <DecksStack.Screen name="DecksList" component={DecksScreen} options={{ title: 'Decks' }} />
      <DecksStack.Screen name="Study" component={StudyScreen} options={{ title: 'Study' }} />
    </DecksStack.Navigator>
  );
}

function StatsNavigator() {
  return (
    <StatsStack.Navigator screenOptions={screenOptions}>
      <StatsStack.Screen
        name="StatsOverview"
        component={StatsScreen}
        options={{ title: 'Statistics' }}
      />
      <StatsStack.Screen
        name="DeckStats"
        component={DeckStatsScreen}
        options={{ title: 'Deck statistics' }}
      />
    </StatsStack.Navigator>
  );
}

const renderDecksIcon = ({ color }: { color: string }) => <DecksIcon color={color} />;
const renderStatsIcon = ({ color }: { color: string }) => <StatsIcon color={color} />;

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Tabs.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textDim,
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        }}>
        <Tabs.Screen
          name="DecksTab"
          component={DecksNavigator}
          options={{
            title: 'Decks',
            tabBarIcon: renderDecksIcon,
          }}
        />
        <Tabs.Screen
          name="StatsTab"
          component={StatsNavigator}
          options={{
            title: 'Statistics',
            tabBarIcon: renderStatsIcon,
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
