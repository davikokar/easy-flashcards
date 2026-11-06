export const settings = {
  settingsScreen: {
    title: 'Settings',
    generalSection: 'General',
    appSection: 'App',
    communitySection: 'Community and support',
    legalSection: 'Legal',
    changeLanguageItem: 'Change language',
    shareAppItem: 'Share app',
    shareMessage: 'Try Easy Flashcards, an app for studying flashcard decks: {url}',
    rateAppItem: 'Rate app',
    customerSupportItem: 'Customer support',
    aboutItem: 'About',
    buyCoffeeItem: 'Buy me a coffee',
    privacyPolicyItem: 'Privacy policy',
    termsItem: 'Terms',
  },
  languageDialog: {
    title: 'Change language',
    systemDefaultOption: 'System default',
  },
  aboutAlert: {
    title: 'About',
    // The name and the version number are values, not text to translate.
    message: '{name}, version {version}',
  },
  linkFailedAlert: {
    title: 'Could not open the link',
    message: 'No app on this device could open it.',
  },
  emailFailedAlert: {
    title: 'No email app',
    message: 'To reach customer support, write to {email}.',
  },
  coffeeThanksAlert: {
    title: 'Thank you!',
    message: 'Your coffee is on its way to the developer. Thank you for your support.',
  },
  coffeeUnavailableAlert: {
    title: 'Buy me a coffee',
    message: 'Buying a coffee is not available right now. Please try again later.',
  },
} as const;
