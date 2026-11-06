import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

/** A callback that opens the Settings screen from any screen inside the tabs. */
export function useOpenSettings(): () => void {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return useCallback(() => navigation.navigate('Settings'), [navigation]);
}
