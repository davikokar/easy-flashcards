import type { PluralRule } from '../../utils/i18n';
import { answers } from './answers';
import { categories } from './categories';
import { categoryNames } from './categoryNames';
import { common } from './common';
import { deckStats } from './deckStats';
import { decks } from './decks';
import { editDeck } from './editDeck';
import { importExport } from './importExport';
import { learn } from './learn';
import { navigation } from './navigation';
import { settings } from './settings';
import { shell } from './shell';
import { stats } from './stats';
import { study } from './study';

export const en = {
  common,
  navigation,
  answers,
  importExport,
  categoryNames,
  shell,
  settings,
  decks,
  editDeck,
  learn,
  study,
  categories,
  stats,
  deckStats,
} as const;

export const englishPlural: PluralRule = count => (count === 1 ? 'one' : 'other');
