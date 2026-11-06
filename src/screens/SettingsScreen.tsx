import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import LanguageDialog, { type LanguageOption } from '../components/LanguageDialog';
import SettingsRow from '../components/SettingsRow';
import { useLanguage, useT } from '../i18n/I18nProvider';
import { LANGUAGE_NAMES, SELECTABLE_LANGUAGES } from '../locales';
import { openStoreListing, openSupportEmail, openUrl, shareText } from '../services/appActions';
import { buyCoffee } from '../services/tipJar';
import { colors, spacing } from '../theme';
import { APP_VERSION } from '../utils/appInfo';
import {
  APP_NAME,
  PLAY_STORE_WEB_URL,
  PRIVACY_POLICY_URL,
  SUPPORT_EMAIL,
  TERMS_URL,
} from '../utils/appLinks';

export default function SettingsScreen() {
  const t = useT();
  const { choice, setChoice } = useLanguage();
  const [languageVisible, setLanguageVisible] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const buyInFlight = useRef(false);

  const languageOptions = useMemo<LanguageOption[]>(
    () => [
      { code: null, label: t('settings.languageDialog.systemDefaultOption') },
      ...SELECTABLE_LANGUAGES.map(language => ({
        code: language.code,
        label: LANGUAGE_NAMES[language.code] ?? language.code,
      })),
    ],
    [t],
  );
  const currentLanguage =
    languageOptions.find(option => option.code === choice) ?? languageOptions[0];

  const showLinkFailed = useCallback(() => {
    Alert.alert(t('settings.linkFailedAlert.title'), t('settings.linkFailedAlert.message'));
  }, [t]);

  const openLink = useCallback(
    async (url: string) => {
      if (!(await openUrl(url))) {
        showLinkFailed();
      }
    },
    [showLinkFailed],
  );

  const handleShare = useCallback(() => {
    shareText(t('settings.settingsScreen.shareMessage', { url: PLAY_STORE_WEB_URL }));
  }, [t]);

  const handleRate = useCallback(async () => {
    if (!(await openStoreListing())) {
      showLinkFailed();
    }
  }, [showLinkFailed]);

  const handleSupport = useCallback(async () => {
    if (!(await openSupportEmail())) {
      Alert.alert(
        t('settings.emailFailedAlert.title'),
        t('settings.emailFailedAlert.message', { email: SUPPORT_EMAIL }),
      );
    }
  }, [t]);

  const handleAbout = useCallback(() => {
    Alert.alert(
      t('settings.aboutAlert.title'),
      t('settings.aboutAlert.message', { name: APP_NAME, version: APP_VERSION }),
    );
  }, [t]);

  const handleBuyCoffee = useCallback(async () => {
    // The ref, not the state, is the guard: state is stale until the next render.
    if (buyInFlight.current) {
      return;
    }
    buyInFlight.current = true;
    setIsBuying(true);
    try {
      const result = await buyCoffee();
      if (result === 'thanks') {
        Alert.alert(t('settings.coffeeThanksAlert.title'), t('settings.coffeeThanksAlert.message'));
      } else if (result === 'unavailable') {
        Alert.alert(
          t('settings.coffeeUnavailableAlert.title'),
          t('settings.coffeeUnavailableAlert.message'),
        );
      }
    } finally {
      buyInFlight.current = false;
      setIsBuying(false);
    }
  }, [t]);

  const chooseLanguage = useCallback(
    (code: string | null) => {
      setLanguageVisible(false);
      setChoice(code);
    },
    [setChoice],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Section title={t('settings.settingsScreen.generalSection')}>
        <SettingsRow
          icon="globe"
          label={t('settings.settingsScreen.changeLanguageItem')}
          value={currentLanguage.label}
          onPress={() => setLanguageVisible(true)}
        />
      </Section>

      <Section title={t('settings.settingsScreen.appSection')}>
        <SettingsRow
          icon="share"
          label={t('settings.settingsScreen.shareAppItem')}
          onPress={handleShare}
        />
        <SettingsRow
          icon="star"
          label={t('settings.settingsScreen.rateAppItem')}
          onPress={handleRate}
        />
        <SettingsRow
          icon="mail"
          label={t('settings.settingsScreen.customerSupportItem')}
          onPress={handleSupport}
        />
        <SettingsRow
          icon="info"
          label={t('settings.settingsScreen.aboutItem')}
          value={APP_VERSION}
          onPress={handleAbout}
        />
      </Section>

      <Section title={t('settings.settingsScreen.communitySection')}>
        <SettingsRow
          icon="cup"
          label={t('settings.settingsScreen.buyCoffeeItem')}
          loading={isBuying}
          onPress={handleBuyCoffee}
        />
      </Section>

      <Section title={t('settings.settingsScreen.legalSection')}>
        <SettingsRow
          icon="lock"
          label={t('settings.settingsScreen.privacyPolicyItem')}
          onPress={() => openLink(PRIVACY_POLICY_URL)}
        />
        <SettingsRow
          icon="file"
          label={t('settings.settingsScreen.termsItem')}
          onPress={() => openLink(TERMS_URL)}
        />
      </Section>

      <LanguageDialog
        visible={languageVisible}
        title={t('settings.languageDialog.title')}
        options={languageOptions}
        selectedCode={currentLanguage.code}
        closeLabel={t('common.actions.cancel')}
        onSelect={chooseLanguage}
        onClose={() => setLanguageVisible(false)}
      />
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  sectionBody: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
