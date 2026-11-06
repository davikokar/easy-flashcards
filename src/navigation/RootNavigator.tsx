import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoriesScreen from '../screens/CategoriesScreen';
import DecksScreen from '../screens/DecksScreen';
import EditDeckScreen from '../screens/EditDeckScreen';
import LearnScreen from '../screens/LearnScreen';
import NewCategoryScreen from '../screens/NewCategoryScreen';
import StudyScreen from '../screens/StudyScreen';
import StatsScreen from '../screens/StatsScreen';
import DeckStatsScreen from '../screens/DeckStatsScreen';
import { useT } from '../i18n/I18nProvider';
import { useDecks } from '../state/DecksContext';
import { isSessionActive } from '../utils/stats';
import {
  CategoriesStackParamList,
  DecksStackParamList,
  LearnStackParamList,
  RootTabParamList,
  StatsStackParamList,
} from './types';
import { CategoriesIcon, DecksIcon, LearnIcon, StatsIcon } from './TabIcons';
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
const LearnStack = createNativeStackNavigator<LearnStackParamList>();
const CategoriesStack = createNativeStackNavigator<CategoriesStackParamList>();
const StatsStack = createNativeStackNavigator<StatsStackParamList>();
const Tabs = createBottomTabNavigator<RootTabParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerTitleStyle: { color: colors.text },
  contentStyle: { backgroundColor: colors.background },
} as const;

function DecksNavigator() {
  const t = useT();
  return (
    <DecksStack.Navigator screenOptions={screenOptions}>
      <DecksStack.Screen
        name="DecksList"
        component={DecksScreen}
        options={{ title: t('navigation.headers.decksList') }}
      />
      <DecksStack.Screen
        name="EditDeck"
        component={EditDeckScreen}
        options={{ title: t('navigation.headers.editDeck') }}
      />
      <DecksStack.Screen
        name="NewDeck"
        component={EditDeckScreen}
        options={{ title: t('navigation.headers.newDeck') }}
      />
    </DecksStack.Navigator>
  );
}

function LearnNavigator() {
  const t = useT();
  return (
    <LearnStack.Navigator screenOptions={screenOptions}>
      <LearnStack.Screen
        name="LearnList"
        component={LearnScreen}
        options={{ title: t('navigation.headers.learnList') }}
      />
      <LearnStack.Screen
        name="Study"
        component={StudyScreen}
        options={{ title: t('navigation.headers.study') }}
      />
    </LearnStack.Navigator>
  );
}

function CategoriesNavigator() {
  const t = useT();
  return (
    <CategoriesStack.Navigator screenOptions={screenOptions}>
      <CategoriesStack.Screen
        name="CategoriesList"
        component={CategoriesScreen}
        options={{ title: t('navigation.headers.categoriesList') }}
      />
      <CategoriesStack.Screen
        name="NewCategory"
        component={NewCategoryScreen}
        options={{ title: t('navigation.headers.newCategory') }}
      />
    </CategoriesStack.Navigator>
  );
}

function StatsNavigator() {
  const t = useT();
  return (
    <StatsStack.Navigator screenOptions={screenOptions}>
      <StatsStack.Screen
        name="StatsOverview"
        component={StatsScreen}
        options={{ title: t('navigation.headers.statsOverview') }}
      />
      <StatsStack.Screen
        name="DeckStats"
        component={DeckStatsScreen}
        options={{ title: t('navigation.headers.deckStats') }}
      />
    </StatsStack.Navigator>
  );
}

const renderDecksIcon = ({ color }: { color: string }) => <DecksIcon color={color} />;
const renderLearnIcon = ({ color }: { color: string }) => <LearnIcon color={color} />;
const renderCategoriesIcon = ({ color }: { color: string }) => <CategoriesIcon color={color} />;
const renderStatsIcon = ({ color }: { color: string }) => <StatsIcon color={color} />;

export default function RootNavigator() {
  const { sessions, isLoading } = useDecks();
  const t = useT();

  // The landing tab depends on persisted sessions, so wait for them before mounting the tabs.
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const hasActiveSession = sessions.some(isSessionActive);

  return (
    // The layout is never mirrored; text direction is handled per paragraph.
    <NavigationContainer theme={navigationTheme} direction="ltr">
      <Tabs.Navigator
        initialRouteName={hasActiveSession ? 'LearnTab' : 'DecksTab'}
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
            title: t('navigation.tabs.decks'),
            tabBarIcon: renderDecksIcon,
          }}
        />
        <Tabs.Screen
          name="LearnTab"
          component={LearnNavigator}
          options={{
            title: t('navigation.tabs.learn'),
            tabBarIcon: renderLearnIcon,
          }}
        />
        <Tabs.Screen
          name="CategoriesTab"
          component={CategoriesNavigator}
          options={{
            title: t('navigation.tabs.categories'),
            tabBarIcon: renderCategoriesIcon,
          }}
        />
        <Tabs.Screen
          name="StatsTab"
          component={StatsNavigator}
          options={{
            title: t('navigation.tabs.statistics'),
            tabBarIcon: renderStatsIcon,
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
