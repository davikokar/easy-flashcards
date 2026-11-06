import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@easy-flashcards/settings/v1';

export type Settings = {
  /** A registered language code, or null to follow the device. */
  language: string | null;
};

export const DEFAULT_SETTINGS: Settings = { language: null };

/** Never throws on bad data: a missing, corrupt or wrongly shaped value reads as the defaults. */
export async function loadSettings(): Promise<Settings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (raw === null) {
    return DEFAULT_SETTINGS;
  }
  try {
    const value = JSON.parse(raw) as Record<string, unknown> | null;
    const language = value?.language;
    return { language: typeof language === 'string' && language !== '' ? language : null };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
