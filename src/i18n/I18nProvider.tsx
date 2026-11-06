import React, { createContext, useContext, useState } from 'react';
import { englishT, translatorForTag } from '../locales';
import { getDeviceLocaleTag } from '../services/deviceLocale';
import type { Translator } from '../utils/i18n';

const I18nContext = createContext<Translator | null>(null);

// The tag is read once, so a language change takes effect when the app is next started.
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [translator] = useState(() => translatorForTag(getDeviceLocaleTag()));
  return <I18nContext.Provider value={translator}>{children}</I18nContext.Provider>;
}

export function useT(): Translator {
  return useContext(I18nContext) ?? englishT;
}
