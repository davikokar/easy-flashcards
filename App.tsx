/**
 * Easy Flashcards - study decks imported from local CSV files.
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nProvider } from './src/i18n/I18nProvider';
import RootNavigator from './src/navigation/RootNavigator';
import { DecksProvider } from './src/state/DecksContext';
import { colors } from './src/theme';

function App() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          <DecksProvider>
            <RootNavigator />
          </DecksProvider>
        </View>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
