export const APP_NAME = 'Easy Flashcards';
export const ANDROID_PACKAGE = 'com.easyflashcards';

export const SUPPORT_EMAIL = 'davidemela.support@gmail.com';
export const SUPPORT_SUBJECT = 'Easy Flashcards support request';

// Right once the app is published under this package id.
export const PLAY_STORE_WEB_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
export const PLAY_STORE_MARKET_URL = `market://details?id=${ANDROID_PACKAGE}`;

// PLACEHOLDER: replace with the real GitHub-hosted files before release.
export const PRIVACY_POLICY_URL =
  'https://github.com/OWNER/REPOSITORY/blob/main/legal/privacy-policy.md';
// PLACEHOLDER: replace with the real GitHub-hosted files before release.
export const TERMS_URL = 'https://github.com/OWNER/REPOSITORY/blob/main/legal/terms.md';

export function supportMailtoUrl(): string {
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(SUPPORT_SUBJECT)}`;
}
