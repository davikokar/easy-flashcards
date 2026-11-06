import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CategoryColorPicker from '../components/CategoryColorPicker';
import CategoryIconPicker from '../components/CategoryIconPicker';
import CategoryTile from '../components/CategoryTile';
import CustomColorDialog from '../components/CustomColorDialog';
import FormField from '../components/FormField';
import { useT } from '../i18n/I18nProvider';
import { useDecks } from '../state/DecksContext';
import { CategoriesStackParamList } from '../navigation/types';
import { CategoryIcon } from '../types';
import {
  CATEGORY_NAME_MAX_LENGTH,
  FALLBACK_CATEGORY_ICON,
  validateCategoryName,
} from '../utils/categories';
import { categoryPalette, colors, spacing } from '../theme';

type Props = NativeStackScreenProps<CategoriesStackParamList, 'NewCategory'>;

const INITIAL_COLOR = categoryPalette[0];

export default function NewCategoryScreen({ navigation }: Props) {
  const { categories, addCategory } = useDecks();
  const t = useT();
  const [name, setName] = useState('');
  const [color, setColor] = useState(INITIAL_COLOR);
  const [icon, setIcon] = useState<CategoryIcon>(FALLBACK_CATEGORY_ICON);
  const [customColorOpen, setCustomColorOpen] = useState(false);
  // The name's error stays hidden until the user has typed, so a fresh form is not red.
  const [nameTouched, setNameTouched] = useState(false);
  // Set once the category is saved, so leaving the screen afterwards is not treated as discarding it.
  const saved = useRef(false);

  const validation = useMemo(
    () => validateCategoryName(name, categories, t),
    [name, categories, t],
  );
  const isChanged = name.trim() !== '' || color !== INITIAL_COLOR || icon !== FALLBACK_CATEGORY_ICON;
  const canSave = validation.ok;

  const saveButton = useMemo(() => {
    const save = () => {
      if (!validation.ok) {
        return;
      }
      saved.current = true;
      addCategory({ name: validation.name, color, icon });
      navigation.goBack();
    };
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('categories.newCategoryScreen.saveButtonA11yLabel')}
        accessibilityState={{ disabled: !canSave }}
        disabled={!canSave}
        hitSlop={8}
        onPress={save}
        style={({ pressed }) => [pressed && styles.pressed]}>
        <Text style={[styles.save, !canSave && styles.saveDisabled]}>
          {t('common.actions.save')}
        </Text>
      </Pressable>
    );
  }, [validation, canSave, color, icon, addCategory, navigation, t]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => saveButton });
  }, [navigation, saveButton]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', event => {
        if (!isChanged || saved.current) {
          return;
        }
        event.preventDefault();
        Alert.alert(
          t('categories.discardChangesAlert.title'),
          t('categories.discardChangesAlert.message'),
          [
            { text: t('common.actions.keepEditing'), style: 'cancel' },
            {
              text: t('common.actions.discard'),
              style: 'destructive',
              onPress: () => navigation.dispatch(event.data.action),
            },
          ],
        );
      }),
    [navigation, isChanged, t],
  );

  const trimmedName = name.trim();
  let nameError: string | null = null;
  if (nameTouched && !validation.ok) {
    if (validation.reason === 'empty') {
      nameError = t('categories.newCategoryScreen.nameErrors.empty');
    } else if (validation.reason === 'tooLong') {
      nameError = t('categories.newCategoryScreen.nameErrors.tooLong', {
        count: CATEGORY_NAME_MAX_LENGTH,
      });
    } else {
      nameError = t('categories.newCategoryScreen.nameErrors.duplicate');
    }
  }

  const changeName = (text: string) => {
    setNameTouched(true);
    // Stands in for a maxLength prop, which FormField does not have.
    setName(text.slice(0, CATEGORY_NAME_MAX_LENGTH));
  };

  return (
    // The keyboard overlays the window on this device instead of resizing it.
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View style={styles.preview}>
          <CategoryTile
            name={
              trimmedName === '' ? t('categories.tilePreview.placeholder') : trimmedName
            }
            nameDimmed={trimmedName === ''}
            color={color}
            icon={icon}
            accessibilityLabel={
              trimmedName === ''
                ? t('categories.tilePreview.noNameA11yLabel')
                : t('categories.tilePreview.a11yLabel', { name: trimmedName })
            }
          />
        </View>

        <View style={styles.group}>
          <FormField
            label={t('categories.newCategoryScreen.nameField')}
            value={name}
            onChangeText={changeName}
          />
          <View style={styles.helperRow} accessibilityLiveRegion="polite">
            <Text style={[styles.helper, nameError !== null && styles.helperError]}>
              {nameError ?? ' '}
            </Text>
            <Text style={styles.count}>
              {t('categories.newCategoryScreen.nameCounter', {
                length: name.length,
                max: CATEGORY_NAME_MAX_LENGTH,
              })}
            </Text>
          </View>
        </View>

        <View style={styles.group}>
          <Text style={styles.groupLabel}>{t('categories.newCategoryScreen.colourLabel')}</Text>
          <CategoryColorPicker
            palette={categoryPalette}
            value={color}
            onChange={setColor}
            onCustomPress={() => setCustomColorOpen(true)}
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.groupLabel}>{t('categories.newCategoryScreen.iconLabel')}</Text>
          <CategoryIconPicker value={icon} onChange={setIcon} />
        </View>
      </ScrollView>
      <CustomColorDialog
        visible={customColorOpen}
        color={color}
        onUse={custom => {
          setColor(custom);
          setCustomColorOpen(false);
        }}
        onCancel={() => setCustomColorOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  preview: {
    width: 96,
    alignSelf: 'center',
  },
  group: {
    gap: spacing.xs,
  },
  groupLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  helper: {
    flex: 1,
    color: colors.textDim,
    fontSize: 13,
  },
  helperError: {
    color: colors.danger,
  },
  count: {
    color: colors.textDim,
    fontSize: 13,
  },
  save: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  saveDisabled: {
    color: colors.textDim,
  },
  pressed: {
    opacity: 0.5,
  },
});
