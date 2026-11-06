import {
  PLAY_STORE_MARKET_URL,
  PLAY_STORE_WEB_URL,
  SUPPORT_EMAIL,
  SUPPORT_SUBJECT,
  supportMailtoUrl,
} from '../src/utils/appLinks';

describe('supportMailtoUrl', () => {
  it('addresses the support mailbox', () => {
    expect(supportMailtoUrl().startsWith(`mailto:${SUPPORT_EMAIL}?`)).toBe(true);
    expect(SUPPORT_EMAIL).toBe('davidemela.support@gmail.com');
  });

  it('carries the subject, percent-encoded', () => {
    const subject = supportMailtoUrl().split('?subject=')[1];

    expect(subject).toBe('Easy%20Flashcards%20support%20request');
    expect(decodeURIComponent(subject)).toBe(SUPPORT_SUBJECT);
  });
});

describe('store links', () => {
  it('point at this app by its package id', () => {
    expect(PLAY_STORE_MARKET_URL).toBe('market://details?id=com.easyflashcards');
    expect(PLAY_STORE_WEB_URL).toBe('https://play.google.com/store/apps/details?id=com.easyflashcards');
  });
});
