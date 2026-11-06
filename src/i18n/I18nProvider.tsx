import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { englishT, isSelectableLanguageCode, translatorForChoice } from '../locales';
import { getDeviceLocaleTag } from '../services/deviceLocale';
import { loadSettings, saveSettings } from '../storage/settingsStorage';
import type { Translator } from '../utils/i18n';

type LanguageChoice = {
  /** A registered language code, or null to follow the device. */
  choice: string | null;
  setChoice: (code: string | null) => void;
};

const I18nContext = createContext<Translator | null>(null);
const LanguageContext = createContext<LanguageChoice>({ choice: null, setChoice: () => undefined });

// Renders nothing until the saved choice is read, so the first frame is never in the wrong language.
export function I18nProvider({ children }: { children: React.ReactNode }) {
  // The device tag is read once, so a device language change takes effect when the app is next started.
  const [deviceTag] = useState(() => getDeviceLocaleTag());
  const [choice, setChoiceState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadSettings()
      .then(settings => {
        if (!cancelled && isSelectableLanguageCode(settings.language)) {
          setChoiceState(settings.language);
        }
      })
      .catch(() => {
        // An unreadable setting means following the device.
      })
      .finally(() => {
        if (!cancelled) {
          setIsReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setChoice = useCallback((code: string | null) => {
    const next = isSelectableLanguageCode(code) ? code : null;
    setChoiceState(next);
    saveSettings({ language: next }).catch(() => {
      // The choice still holds for this run; a failed write must not break the screen.
    });
  }, []);

  const translator = useMemo(() => translatorForChoice(choice, deviceTag), [choice, deviceTag]);
  const language = useMemo(() => ({ choice, setChoice }), [choice, setChoice]);

  if (!isReady) {
    return null;
  }

  return (
    <LanguageContext.Provider value={language}>
      <I18nContext.Provider value={translator}>{children}</I18nContext.Provider>
    </LanguageContext.Provider>
  );
}

export function useT(): Translator {
  return useContext(I18nContext) ?? englishT;
}

export function useLanguage(): LanguageChoice {
  return useContext(LanguageContext);
}
