import { I18nManager } from 'react-native';
import { normalizeLocaleTag } from '../utils/i18n';

function intlLocaleTag(): string | null {
  try {
    return normalizeLocaleTag(Intl.DateTimeFormat().resolvedOptions().locale);
  } catch {
    return null;
  }
}

function i18nManagerLocaleTag(): string | null {
  try {
    return normalizeLocaleTag(I18nManager.getConstants().localeIdentifier);
  } catch {
    return null;
  }
}

/** The device's language as a BCP 47 tag, or null when neither source knows it. */
export function getDeviceLocaleTag(): string | null {
  return intlLocaleTag() ?? i18nManagerLocaleTag();
}

/** Stops an RTL device language from mirroring the layout; Android reads the setting when the next launch creates the root view. */
export function keepLayoutLeftToRight(): void {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
}
