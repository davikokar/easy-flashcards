import type { Catalogue, Language, PluralRule } from '../utils/i18n';

export const ukPlural: PluralRule = count => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return 'one';
  }
  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)
  ) {
    return 'few';
  }
  return 'many';
};

const messages: Catalogue = {
  common: {
    actions: {
      back: 'Назад',
      cancel: 'Скасувати',
      clear: 'Очистити',
      close: 'Закрити',
      delete: 'Видалити',
      discard: 'Відкинути',
      export: 'Експорт',
      keepEditing: 'Редагувати далі',
      ok: 'OK',
      reset: 'Скинути',
      save: 'Зберегти',
      start: 'Почати',
    },
    search: {
      noMatchesTitle: 'Нічого не знайдено',
      noMatchesMessage: 'Нічого не знайдено за запитом «{query}».',
      clearSearchButton: 'Очистити пошук',
    },
    counts: {
      cards: {
        one: '{count} картка',
        few: '{count} картки',
        many: '{count} карток',
        other: '{count} карток',
      },
      sessions: {
        one: '{count} сесія',
        few: '{count} сесії',
        many: '{count} сесій',
        other: '{count} сесій',
      },
      reviews: {
        one: '{count} повторення',
        few: '{count} повторення',
        many: '{count} повторень',
        other: '{count} повторень',
      },
    },
  },
  navigation: {
    tabs: {
      decks: 'Колоди',
      learn: 'Навчання',
      categories: 'Категорії',
      statistics: 'Статистика',
    },
    headers: {
      decksList: 'Колоди',
      editDeck: 'Редагування колоди',
      newDeck: 'Нова колода',
      learnList: 'Навчання',
      study: 'Сесія',
      categoriesList: 'Категорії',
      newCategory: 'Нова категорія',
      statsOverview: 'Статистика',
      deckStats: 'Статистика колоди',
    },
  },
  answers: {
    answerLabels: {
      ok: 'Ок',
      okeish: 'Так собі',
      notOk: 'Не ок',
    },
    shares: {
      notReviewed: 'Ще не повторювали',
      summary: '{ok} Ок, {okeish} Так собі, {notOk} Не ок',
    },
    cardStatus: {
      needsReview: 'Потрібне повторення',
      learning: 'Вивчаються',
      mastered: 'Засвоєно',
      new: 'Нові',
    },
    timeframes: {
      all: 'За весь час',
      month: 'Цей місяць',
      week: 'Останні 7 днів',
    },
    sortOrders: {
      hardest: 'Найскладніші першими',
      deck: 'Порядок у колоді',
      recent: 'Нещодавно повторені',
    },
    dates: {
      never: 'Ніколи',
    },
  },
  importExport: {
    defaultDeckName: 'Імпортована колода',
    importErrors: {
      emptyFile: 'Вибраний файл порожній.',
      notADeck:
        'Це не файл колоди Easy Flashcards. Виберіть JSON-файл, експортований із застосунку.',
      newerVersion:
        'Цей файл колоди створено новішою версією Easy Flashcards. Оновіть застосунок, щоб імпортувати його.',
      noCards:
        'Не знайдено придатних карток. Кожна картка потребує запитання й відповіді.',
      noHeader:
        'Рядок заголовка не знайдено. Перший рядок, що не порожній і не є коментарем із "#", має містити стовпці "question" і "answer", розділені комою, крапкою з комою, табуляцією або іншим символом.',
      noUsableRows:
        'Не знайдено придатних рядків. Кожен рядок потребує запитання й відповіді.',
      unreadable: 'Не вдалося прочитати вибраний файл.',
    },
    importAlert: {
      successTitle: 'Колоду імпортовано',
      successMessage: {
        one: 'Колода «{name}» тепер містить {count} картку.',
        few: 'Колода «{name}» тепер містить {count} картки.',
        many: 'Колода «{name}» тепер містить {count} карток.',
        other: 'Колода «{name}» тепер містить {count} карток.',
      },
      skippedRows: {
        one: 'Пропущено {count} неповний рядок.',
        few: 'Пропущено {count} неповні рядки.',
        many: 'Пропущено {count} неповних рядків.',
        other: 'Пропущено {count} неповних рядків.',
      },
      skippedCards: {
        one: 'Пропущено {count} неповну картку.',
        few: 'Пропущено {count} неповні картки.',
        many: 'Пропущено {count} неповних карток.',
        other: 'Пропущено {count} неповних карток.',
      },
      failedTitle: 'Не вдалося імпортувати',
      failedWithDetails: 'Не вдалося імпортувати файл: {details}',
      failedUnknown: 'Невідома помилка під час імпорту файлу.',
    },
    exportAlert: {
      successTitle: 'Колоду експортовано',
      savedAs: 'Збережено як {name}.',
      saved: 'Колоду збережено.',
      failedTitle: 'Не вдалося експортувати',
      deckGone: 'Цієї колоди більше не існує.',
      failedFallback: 'Не вдалося експортувати колоду.',
    },
    separators: {
      comma: 'Кома (,)',
      semicolon: 'Крапка з комою (;)',
      tab: 'Табуляція',
    },
    sampleExport: {
      successTitle: 'Приклад колоди експортовано',
      partlyTitle: 'Приклад колоди експортовано частково',
      failedTitle: 'Не вдалося експортувати',
      savedAsOne: 'Збережено як {name}.',
      savedAsTwo: 'Збережено як {first} і {second}.',
      fileFailed: 'Не вдалося зберегти файл {format}: {details}',
      fileNotSaved: 'Файл {format} не збережено.',
      unknownError: 'Невідома помилка',
    },
  },
  categoryNames: {
    builtIn: {
      astronomy: 'Астрономія',
      biology: 'Біологія',
      botany: 'Ботаніка',
      chemistry: 'Хімія',
      cinema: 'Кіно',
      computer_science: 'Інформатика',
      economics: 'Економіка',
      gastronomy: 'Гастрономія',
      geography: 'Географія',
      history: 'Історія',
      languages: 'Мови',
      law: 'Право',
      literature: 'Література',
      mathematics: 'Математика',
      medicine: 'Медицина',
      music: 'Музика',
      philosophy: 'Філософія',
      physics: 'Фізика',
      religion: 'Релігія',
      sport: 'Спорт',
      zoology: 'Зоологія',
    },
    icons: {
      plane_contrails: 'Літак',
      anchor: 'Якір',
      nutrition: 'Яблуко',
      emergency: 'Зірочка',
      microbiology: 'Бактерія',
      finance: 'Стовпчаста діаграма',
      sports_basketball: 'Баскетбол',
      neurology: 'Мозок',
      bug_report: 'Жук',
      calendar_month: 'Календар',
      photo_camera: 'Фотоапарат',
      camera: 'Діафрагма',
      cannabis: 'Листок конопель',
      directions_car: 'Автомобіль',
      chess_pawn: 'Шахова пішка',
      language_chinese_dayi: 'Китайські та латинські літери',
      location_city: 'Місто',
      circle_circle: 'Концентричні кола',
      restaurant: 'Столові прибори',
      database: 'База даних',
      nest_heat_link_e: 'Крапка в колі',
      engineering: 'Інженер',
      face: 'Обличчя',
      face_3: 'Обличчя з волоссям',
      theaters: 'Кіноплівка',
      flag_2: 'Прапор',
      science: 'Колба',
      save: 'Дискета',
      sports_and_outdoors: 'Футбольний м’яч',
      skillet: 'Сковорідка',
      sports_esports: 'Ігровий контролер',
      language: 'Глобус',
      diversity_3: 'Група людей',
      psychology: 'Голова із шестірнею',
      headphones: 'Навушники',
      health_and_safety: 'Щит здоров’я',
      landscape_2: 'Пагорби',
      hive: 'Соти',
      hourglass_empty: 'Пісочний годинник',
      house: 'Будинок',
      icecream: 'Морозиво',
      temp_preferences_eco: 'Листя',
      electric_bolt: 'Блискавка',
      wand_stars: 'Чарівна паличка',
      biotech: 'Мікроскоп',
      mindfulness: 'Усвідомленість',
      motorcycle: 'Мотоцикл',
      music_note_2: 'Музична нота',
      network_node: 'Мережа',
      import_contacts: 'Розгорнута книга',
      pan_tool: 'Піднята долоня',
      pets: 'Лапа',
      stylus: 'Олівець',
      person: 'Людина',
      history_edu: 'Перо й папір',
      radio: 'Радіо',
      raven: 'Крук',
      rib_cage: 'Грудна клітка',
      rocket_launch: 'Ракета',
      scatter_plot: 'Діаграма розсіювання',
      category: 'Фігури',
      interests: 'Фігури й серце',
      shopping_cart: 'Кошик для покупок',
      functions: 'Сигма',
      skull: 'Череп',
      emoji_language: 'Смайлик і глобус',
      snowflake: 'Сніжинка',
      hotel_class: 'Зірка',
      mountain_flag: 'Прапор на вершині',
      sunny: 'Сонце',
      mixture_med: 'Шприц і таблетка',
      temple_buddhist: 'Храм',
      text_snippet: 'Текстовий документ',
      theater_comedy: 'Театральні маски',
      nest_thermostat_gen_3: 'Термостат',
      translate: 'Переклад',
      nature: 'Дерево',
      fertile: 'Тюльпан',
      videocam: 'Відеокамера',
      coronavirus: 'Вірус',
      volcano: 'Вулкан',
      warning: 'Попередження',
      water: 'Хвилі',
      air: 'Вітер',
      build: 'Гайковий ключ',
    },
  },
  shell: {
    appMenu: {
      triggerA11yLabel: 'Меню застосунку',
      exportSampleDeckItem: 'Експортувати приклад колоди',
      settingsItem: 'Налаштування',
    },
    settingsAlert: {
      title: 'Налаштування',
      message: 'Налаштування поки що недоступні.',
    },
    exportSampleDeckDialog: {
      title: 'Експорт прикладу колоди',
      body: 'Приклад колоди буде збережено у двох файлах: CSV і JSON. Для кожного з них вам запропонують вибрати місце збереження; будь-який файл можна пропустити, скасувавши вибір.\n\nCSV: рядки, що починаються з # (назва, опис, категорія), під час імпорту пропускаються; далі йде заголовок "question" / "answer" і по одній картці в рядку, тут розділених крапкою з комою (кома, табуляція чи інший одиночний символ теж підійдуть).\n\nJSON: також відновлює назву, опис і категорію.\n\nНа будь-якому боці картки можна використовувати простий HTML, як-от <b>, <i> і <br />.',
    },
    kebabMenu: {
      triggerA11yLabel: 'Інші параметри',
    },
    searchBar: {
      inputA11yLabel: 'Текст пошуку',
      closeButtonA11yLabel: 'Закрити пошук',
    },
  },
  decks: {
    decksScreen: {
      searchA11yLabel: 'Шукати колоди',
      searchPlaceholder: 'Пошук колод',
      loadError: 'Не вдалося прочитати збережені колоди.',
      addDeckA11yLabel: 'Додати колоду',
      emptyTitle: 'Колод ще немає',
      emptyMessage:
        'Натисніть кнопку +, щоб імпортувати файл колоди й створити першу колоду.',
    },
    emptyDeckAlert: {
      title: 'Порожня колода',
      message: 'У цій колоді немає карток для вивчення.',
    },
    deleteDeckAlert: {
      title: 'Видалити колоду',
      message: 'Видалити колоду «{name}», її сесії та всю статистику?',
    },
    addDeckMenu: {
      title: 'Додати колоду',
      importItem: 'Імпортувати колоду з файлу',
      manualItem: 'Додати колоду вручну',
    },
    deckOptionsMenu: {
      startWithOptionsItem: 'Почати сесію з параметрами',
      editItem: 'Редагувати колоду',
      exportItem: 'Експортувати у файл',
      deleteItem: 'Видалити колоду',
    },
    exportFormatMenu: {
      title: 'Експорт колоди у файл',
    },
    csvSeparatorMenu: {
      title: 'Роздільник CSV',
      customItem: 'Власний…',
    },
    deckCard: {
      optionsA11yLabel: 'Параметри колоди: {name}',
      activeCount: 'Активних: {count}',
      lastSession: 'Остання: {date}',
      startA11yLabel: 'Почати сесію для колоди «{name}»',
    },
    masteryBar: {
      a11yLabel: 'Засвоєння: {summary}',
    },
    sessionSetupDialog: {
      title: 'Початок сесії',
      invertedLabel: 'Навпаки',
      invertedDescription:
        'Спочатку показувати відповідь, а запитання — на звороті.',
      shuffleLabel: 'Перемішати',
      shuffleDescription: 'Вивчати картки у випадковому порядку.',
    },
    customSeparatorDialog: {
      title: 'Власний роздільник',
      separatorLabel: 'Роздільник',
      separatorPlaceholder: 'Наприклад, |',
      errors: {
        empty: 'Введіть один символ.',
        tooLong: 'Використайте один символ.',
        reserved: 'Лапки, # і розриви рядків використовувати не можна.',
        whitespace:
          'Пробіли не дозволені. Для табуляції оберіть варіант «Табуляція».',
        alphanumeric: 'Літери й цифри не дозволені.',
      },
    },
  },
  editDeck: {
    deckNotFound: {
      title: 'Колоду не знайдено',
      message: 'Цієї колоди більше не існує.',
      backButton: 'Назад до колод',
    },
    editDeckScreen: {
      titleLabel: 'Назва',
      descriptionLabel: 'Опис',
      descriptionPlaceholder: 'Необов’язково',
      saveButtonA11yLabel: 'Зберегти колоду',
      addCardButton: 'Додати картку',
    },
    titleNeededAlert: {
      title: 'Потрібна назва',
      message: 'Дайте колоді назву.',
    },
    cardIncompleteAlert: {
      title: 'Картка неповна',
      message: 'Картка {number} потребує і запитання, і відповіді.',
    },
    removeCardsAlert: {
      title: 'Видалити картки?',
      message: {
        one: 'З колоди буде видалено {count} картку разом зі статистикою.',
        few: 'З колоди буде видалено {count} картки разом зі статистикою.',
        many: 'З колоди буде видалено {count} карток разом зі статистикою.',
        other: 'З колоди буде видалено {count} карток разом зі статистикою.',
      },
    },
    discardChangesAlert: {
      title: 'Відкинути зміни?',
      messageEdit: 'Зміни в цій колоді не збережено.',
      messageNew: 'Цю колоду не збережено.',
    },
    cardEditor: {
      title: 'Картка {number}',
      removeButtonA11yLabel: 'Видалити картку {number}',
      questionLabel: 'Запитання',
      questionA11yLabel: 'Запитання для картки {number}',
      answerLabel: 'Відповідь',
      answerA11yLabel: 'Відповідь для картки {number}',
    },
    categoryField: {
      label: 'Категорія',
      a11yLabel: 'Категорія: {name}',
      a11yLabelNone: 'Категорія: немає',
      a11yHint: 'Відкриває вибір категорії',
      noneValue: 'Без категорії',
    },
    categoryPicker: {
      title: 'Категорія',
      groupA11yLabel: 'Вибір категорії',
      noneTile: 'Без категорії',
    },
  },
  learn: {
    learnScreen: {
      searchA11yLabel: 'Шукати сесії',
      searchPlaceholder: 'Пошук сесій',
    },
    headerToolbar: {
      clearCompletedItem: 'Очистити завершені сесії',
    },
    emptyState: {
      noSessionsTitle: 'Сесій ще немає',
      noSessionsMessage:
        'Виберіть колоду й почніть сесію навчання; вона з’явиться тут, доки ви її не завершите.',
      allClearedTitle: 'Немає сесій для показу',
      allClearedMessage:
        'Очищені сесії й надалі враховуються в статистиці. Почніть нову сесію з колоди, щоб побачити її тут.',
      goToDecksButton: 'До колод',
    },
    deckUnavailableAlert: {
      title: 'Колода недоступна',
      message: 'Цієї колоди більше не існує або в ній немає карток.',
    },
    clearCompletedSessionsAlert: {
      title: 'Очистити завершені сесії',
      nothingToClear: 'Немає завершених сесій для очищення.',
      message: {
        one: 'Прибрати {count} завершену сесію з цього списку? Її результати залишаться в статистиці.',
        few: 'Прибрати {count} завершені сесії з цього списку? Їхні результати залишаться в статистиці.',
        many: 'Прибрати {count} завершених сесій з цього списку? Їхні результати залишаться в статистиці.',
        other:
          'Прибрати {count} завершених сесій з цього списку? Їхні результати залишаться в статистиці.',
      },
    },
    discardSessionAlert: {
      title: 'Відкинути сесію',
      message:
        'Відкинути незавершену сесію для колоди «{deckName}»? Її відповіді також буде видалено зі статистики.',
    },
    clearSessionAlert: {
      title: 'Очистити сесію',
      message:
        'Прибрати завершену сесію для колоди «{deckName}» з цього списку? Її результати залишаться в статистиці.',
    },
    sessionOptionsMenu: {
      discardItem: 'Відкинути сесію',
      clearItem: 'Очистити сесію',
    },
    sessionCard: {
      inProgressStatus: {
        one: 'У процесі \u2014 {answered} із {count} картки',
        few: 'У процесі \u2014 {answered} із {count} карток',
        many: 'У процесі \u2014 {answered} із {count} карток',
        other: 'У процесі \u2014 {answered} із {count} карток',
      },
      completedStatus: {
        one: 'Завершено \u2014 {count} картка',
        few: 'Завершено \u2014 {count} картки',
        many: 'Завершено \u2014 {count} карток',
        other: 'Завершено \u2014 {count} карток',
      },
      invertedPill: 'Навпаки',
      invertedPillA11yLabel: 'Сесія навпаки',
      optionsA11yLabel: 'Параметри сесії для колоди «{deckName}»',
      started: 'Почато: {date}',
      resumeButtonA11yLabel: 'Продовжити сесію для колоди «{deckName}»',
      replayButtonA11yLabel: 'Пройти сесію ще раз для колоди «{deckName}»',
      reviewErrorsButtonA11yLabel: {
        one: 'Повторити проблемні картки ({count}) для колоди «{deckName}»',
        few: 'Повторити проблемні картки ({count}) для колоди «{deckName}»',
        many: 'Повторити проблемні картки ({count}) для колоди «{deckName}»',
        other: 'Повторити проблемні картки ({count}) для колоди «{deckName}»',
      },
      reviewErrorsDoneA11yLabel:
        'Усі проблемні картки виправлено для колоди «{deckName}»',
    },
    sessionResultsBar: {
      progressA11yLabel:
        'Прогрес: відповідено {answered} із {cardCount} \u2014 {ok} ок, {okeish} так собі, {notOk} не ок',
    },
  },
  study: {
    studyScreen: {
      fallbackTitle: 'Сесія',
      unavailableTitle: 'Нічого вивчати',
      unavailableMessage: 'Ця сесія більше недоступна.',
      unavailableAction: 'Назад до сесій',
    },
    progressHeader: {
      position: 'Картка {current} із {total}',
      okCount: 'Ок {count}',
    },
    invertedPill: {
      text: 'Навпаки',
      a11yLabel: 'Сесія навпаки: на лицьовому боці показано відповідь',
    },
    swipeHint: {
      reviewing:
        'Перегляд картки, на яку вже відповіли \u2014 проведіть уліво, щоб повернутися на місце',
    },
    historyStrip: {
      a11yLabel: 'Відповіді досі',
    },
    flipCard: {
      questionLabel: 'ЗАПИТАННЯ',
      answerLabel: 'ВІДПОВІДЬ',
      revealHint: 'Торкніться, щоб побачити відповідь',
      backHint: 'Торкніться, щоб знову побачити запитання',
      showQuestionA11yLabel: 'Показати запитання',
      showAnswerA11yLabel: 'Показати відповідь',
    },
    sessionSummary: {
      title: 'Сесію завершено',
      successRateA11yLabel: 'Успішність {rate}',
      reviewedCount: 'Повторено: {count}',
      studyAgainLabel: 'Вивчити всю колоду ще раз',
      studyAgainButtonA11yLabel: 'Вивчити всю колоду ще раз',
    },
    reviewSummary: {
      title: 'Повторення завершено',
      stillToFix: 'Лишилося виправити: {count}',
      allFixed: 'Усе виправлено',
    },
    summaryAction: {
      reviewLabel: 'Повторити проблемні картки',
      reviewButtonA11yLabel: {
        one: 'Повторити проблемні картки: {count}',
        few: 'Повторити проблемні картки: {count}',
        many: 'Повторити проблемні картки: {count}',
        other: 'Повторити проблемні картки: {count}',
      },
      backLabel: 'Назад до сесій',
      backButtonA11yLabel: 'Назад до сесій',
    },
  },
  categories: {
    categoriesScreen: {
      customSectionTitle: 'Власні категорії',
      customSectionSubtitle: {
        one: 'Доступно: {count}',
        few: 'Доступно: {count}',
        many: 'Доступно: {count}',
        other: 'Доступно: {count}',
      },
      customEmptyHint: 'Тут з’являться ваші власні категорії.',
      defaultSectionTitle: 'Типові категорії',
      defaultSectionSubtitle: {
        one: 'Вбудовано: {count}',
        few: 'Вбудовано: {count}',
        many: 'Вбудовано: {count}',
        other: 'Вбудовано: {count}',
      },
      newCategoryButton: 'Нова категорія',
      categoryTileA11yLabel: 'Параметри категорії: {name}',
    },
    categoryOptionsMenu: {
      deleteItem: 'Видалити категорію',
    },
    deleteCategoryAlert: {
      title: 'Видалити категорію?',
      message: 'Категорію «{name}» буде видалено.',
      messageWithDecks: {
        one: 'Категорію «{name}» буде видалено. {count} колода залишиться без категорії.',
        few: 'Категорію «{name}» буде видалено. {count} колоди залишаться без категорії.',
        many: 'Категорію «{name}» буде видалено. {count} колод залишаться без категорії.',
        other:
          'Категорію «{name}» буде видалено. {count} колод залишаться без категорії.',
      },
    },
    newCategoryScreen: {
      saveButtonA11yLabel: 'Зберегти категорію',
      nameField: 'Назва',
      colourLabel: 'Колір',
      iconLabel: 'Значок',
      nameCounter: '{length}/{max}',
      nameErrors: {
        empty: 'Введіть назву.',
        tooLong: {
          one: 'Використайте не більше {count} символу.',
          few: 'Використайте не більше {count} символів.',
          many: 'Використайте не більше {count} символів.',
          other: 'Використайте не більше {count} символів.',
        },
        duplicate: 'Категорія з такою назвою вже існує.',
      },
    },
    discardChangesAlert: {
      title: 'Відкинути зміни?',
      message: 'Цю категорію не збережено.',
    },
    tilePreview: {
      placeholder: 'Назва категорії',
      a11yLabel: 'Попередній перегляд: {name}',
      noNameA11yLabel: 'Попередній перегляд: назви ще немає',
    },
    colourPicker: {
      a11yLabel: 'Вибір кольору',
      swatchA11yLabel: 'Колір {position} із {total}',
    },
    customColourSwatch: {
      a11yLabel: 'Власний колір',
      a11yHint: 'Відкриває вибір кольору',
    },
    iconPicker: {
      a11yLabel: 'Вибір значка',
    },
    customColourDialog: {
      title: 'Власний колір',
      hueLabel: 'Відтінок',
      hueValue: '{value}°',
      saturationLabel: 'Насиченість',
      brightnessLabel: 'Яскравість',
      percentValue: '{value}%',
      previewA11yLabel: 'Попередній перегляд кольору {color}',
      tooDark: 'Надто темний для значка. Спробуйте світліший колір.',
      useButton: 'Використати колір',
    },
    categorySquare: {
      a11yLabel: 'Категорія: {name}',
    },
  },
  stats: {
    statsScreen: {
      searchA11yLabel: 'Шукати колоди',
      searchPlaceholder: 'Пошук колод',
      aggregatedHeading: 'Загальна статистика',
      decksTile: {
        label: 'Колоди',
        caption: 'У бібліотеці',
      },
      totalCardsTile: {
        label: 'Усього карток',
        caption: 'У всіх колодах',
      },
      totalReviewsTile: {
        label: 'Усього повторень',
        caption: {
          all: 'Записано відповідей',
          month: 'Відповідей цього місяця',
          week: 'Відповідей за останні 7 днів',
        },
      },
      sessionsTile: {
        label: 'Сесії',
        caption: 'Активних: {count}',
      },
      tileA11yLabel: '{label}: {value}, {caption}',
      decksBreakdownHeading: 'Розподіл за колодами',
      deckCount: {
        one: '{count} колода',
        few: '{count} колоди',
        many: '{count} колод',
        other: '{count} колод',
      },
      emptyState: {
        title: 'Статистики ще немає',
        message: 'Імпортуйте колоду й вивчайте її; результати з’являться тут.',
      },
    },
    masteryRing: {
      summaryA11yLabel: 'Успішність {rate}. {shares}. Кількість: {counts}',
      caption: 'Успішність',
    },
    deckStatsCard: {
      summaryA11yLabel:
        '{name}: {shares}, {cards}, {sessions}, {reviews}, остання: {last}',
      openA11yHint: 'Відкриває відомості про кожну картку',
      cardsLabel: 'Картки',
      sessionsLabel: 'Сесії',
      reviewsLabel: 'Повторення',
      lastLabel: 'Остання',
    },
    timeframeChips: {
      groupA11yLabel: 'Період',
    },
  },
  deckStats: {
    deckStatsScreen: {
      optionsA11yLabel: 'Параметри статистики колоди «{deckName}»',
      resetStatisticsMenuItem: 'Скинути статистику',
      resetAlert: {
        title: 'Скинути статистику',
        message:
          'Очистити всі записані результати й сесії для колоди «{deckName}»?',
      },
      notFound: {
        title: 'Колоду не знайдено',
        message: 'Цю колоду видалено.',
      },
      cardPerformanceTitle: 'Успішність карток',
      subtitle: {
        one: '{count} картка · {sort}',
        few: '{count} картки · {sort}',
        many: '{count} карток · {sort}',
        other: '{count} карток · {sort}',
      },
      subtitleNarrowed: {
        one: '{shown} із {count} картки · {sort}',
        few: '{shown} із {count} карток · {sort}',
        many: '{shown} із {count} карток · {sort}',
        other: '{shown} із {count} карток · {sort}',
      },
      sortButtonA11yLabel: 'Сортувати картки: {sort}',
      sortSheetTitle: 'Сортування карток',
      noCards: {
        title: 'Карток ще немає',
        message:
          'Додайте картки до цієї колоди, щоб побачити результати кожної.',
      },
      statusEmpty: {
        needsReview: {
          title: 'Немає карток для повторення',
          message: 'Жодна картка не має успішності нижче 40%.',
        },
        learning: {
          title: 'Немає карток, що вивчаються',
          message: 'Жодна картка не має успішності від 40% до 70%.',
        },
        mastered: {
          title: 'Засвоєних карток ще немає',
          message: 'Картка вважається засвоєною за успішності від 70%.',
        },
        new: {
          title: 'Немає нових карток',
          message: 'Кожну картку повторено принаймні раз.',
        },
      },
      showAllCardsButton: 'Показати всі картки',
      noMatches: {
        filteredMessage:
          'Нічого не знайдено за запитом «{query}» з фільтром: {status}.',
      },
    },
    deckIdentityRow: {
      categoryA11yLabel: 'Категорія: {name}',
    },
    deckMasteryCard: {
      successRateA11yLabel: 'Успішність: {rate}',
      successRateNoReviewsA11yLabel: 'Успішність: повторень ще немає',
      successRateCaption: 'Успішність',
      answerTile: {
        ok: '{count} ок, {percent}',
        okeish: '{count} так собі, {percent}',
        notOk: '{count} не ок, {percent}',
      },
      answerTileNoReviews: {
        ok: '{count} ок, повторень ще немає',
        okeish: '{count} так собі, повторень ще немає',
        notOk: '{count} не ок, повторень ще немає',
      },
      reviewsFigure: 'Повторення',
      sessionsFigure: 'Сесії',
      lastSessionFigure: 'Остання сесія',
      figureA11yLabel: '{label}: {value}',
      changeChip: {
        none: 'Без змін від минулої сесії',
        up: '+{points} в. п. від минулої сесії',
        down: '-{points} в. п. від минулої сесії',
        noneA11yLabel: 'Успішність не змінилася порівняно з останньою сесією',
        upA11yLabel: {
          one: 'Успішність зросла на {count} відсотковий пункт порівняно з останньою сесією',
          few: 'Успішність зросла на {count} відсоткові пункти порівняно з останньою сесією',
          many: 'Успішність зросла на {count} відсоткових пунктів порівняно з останньою сесією',
          other:
            'Успішність зросла на {count} відсоткових пунктів порівняно з останньою сесією',
        },
        downA11yLabel: {
          one: 'Успішність впала на {count} відсотковий пункт порівняно з останньою сесією',
          few: 'Успішність впала на {count} відсоткові пункти порівняно з останньою сесією',
          many: 'Успішність впала на {count} відсоткових пунктів порівняно з останньою сесією',
          other:
            'Успішність впала на {count} відсоткових пунктів порівняно з останньою сесією',
        },
      },
    },
    cardStatsRow: {
      footerNeverReviewed: 'Не повторювалася',
      footerReviewed: {
        one: '{count} повторення · Повторено: {date}',
        few: '{count} повторення · Повторено: {date}',
        many: '{count} повторень · Повторено: {date}',
        other: '{count} повторень · Повторено: {date}',
      },
      neverReviewedA11yLabel:
        'Запитання: {question}. Відповідь: {answer}. {status}. Не повторювалася.',
      reviewedA11yLabel: {
        one: 'Запитання: {question}. Відповідь: {answer}. {status}, успішність {rate}. {count} повторення: {ok} ок, {okeish} так собі, {notOk} не ок.',
        few: 'Запитання: {question}. Відповідь: {answer}. {status}, успішність {rate}. {count} повторення: {ok} ок, {okeish} так собі, {notOk} не ок.',
        many: 'Запитання: {question}. Відповідь: {answer}. {status}, успішність {rate}. {count} повторень: {ok} ок, {okeish} так собі, {notOk} не ок.',
        other:
          'Запитання: {question}. Відповідь: {answer}. {status}, успішність {rate}. {count} повторень: {ok} ок, {okeish} так собі, {notOk} не ок.',
      },
      reviewedOnA11yLabel: {
        one: 'Запитання: {question}. Відповідь: {answer}. {status}, успішність {rate}. {count} повторення: {ok} ок, {okeish} так собі, {notOk} не ок. Повторено: {date}.',
        few: 'Запитання: {question}. Відповідь: {answer}. {status}, успішність {rate}. {count} повторення: {ok} ок, {okeish} так собі, {notOk} не ок. Повторено: {date}.',
        many: 'Запитання: {question}. Відповідь: {answer}. {status}, успішність {rate}. {count} повторень: {ok} ок, {okeish} так собі, {notOk} не ок. Повторено: {date}.',
        other:
          'Запитання: {question}. Відповідь: {answer}. {status}, успішність {rate}. {count} повторень: {ok} ок, {okeish} так собі, {notOk} не ок. Повторено: {date}.',
      },
    },
    cardStatusChips: {
      groupA11yLabel: 'Статус картки',
      allChip: 'Усі',
      chipLabel: '{label} ({count})',
      chipA11yLabel: {
        one: '{label}, {count} картка',
        few: '{label}, {count} картки',
        many: '{label}, {count} карток',
        other: '{label}, {count} карток',
      },
    },
    cardSearchField: {
      searchA11yLabel: 'Шукати картки',
      searchPlaceholder: 'Пошук запитань і відповідей',
      clearA11yLabel: 'Очистити пошук карток',
    },
    sessionHistoryChart: {
      title: 'Історія сесій',
      subtitleLatest: 'Останні {shown} із {total}',
      empty: {
        title: 'Для цієї колоди немає сесій',
        message:
          'Почніть сесію на вкладці «Колоди», і її результати з’являться тут.',
      },
      unansweredLegend: 'Без відповіді',
      legendNote: '% карток кожної сесії',
      sessionA11yLabel: {
        one: 'Сесія від {date}: успішність {rate}, відповідено {answered} із {count} картки \u2014 {ok} ок, {okeish} так собі, {notOk} не ок',
        few: 'Сесія від {date}: успішність {rate}, відповідено {answered} із {count} карток \u2014 {ok} ок, {okeish} так собі, {notOk} не ок',
        many: 'Сесія від {date}: успішність {rate}, відповідено {answered} із {count} карток \u2014 {ok} ок, {okeish} так собі, {notOk} не ок',
        other:
          'Сесія від {date}: успішність {rate}, відповідено {answered} із {count} карток \u2014 {ok} ок, {okeish} так собі, {notOk} не ок',
      },
      sessionNoAnswersA11yLabel: {
        one: 'Сесія від {date}: успішність: відповідей ще немає, відповідено {answered} із {count} картки \u2014 {ok} ок, {okeish} так собі, {notOk} не ок',
        few: 'Сесія від {date}: успішність: відповідей ще немає, відповідено {answered} із {count} карток \u2014 {ok} ок, {okeish} так собі, {notOk} не ок',
        many: 'Сесія від {date}: успішність: відповідей ще немає, відповідено {answered} із {count} карток \u2014 {ok} ок, {okeish} так собі, {notOk} не ок',
        other:
          'Сесія від {date}: успішність: відповідей ще немає, відповідено {answered} із {count} карток \u2014 {ok} ок, {okeish} так собі, {notOk} не ок',
      },
    },
  },
};

export const uk: Language = { code: 'uk', plural: ukPlural, messages };
