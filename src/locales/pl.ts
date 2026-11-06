import type { Language, PluralRule } from '../utils/i18n';

// CLDR Polish: `other` only covers fractions, so each plural message gives it the `many` text.
export const plPlural: PluralRule = count => {
  if (!Number.isInteger(count)) {
    return 'other';
  }
  if (count === 1) {
    return 'one';
  }
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
  ) {
    return 'few';
  }
  return 'many';
};

export const pl: Language = {
  code: 'pl',
  plural: plPlural,
  messages: {
    common: {
      actions: {
        back: 'Wstecz',
        cancel: 'Anuluj',
        clear: 'Wyczyść',
        close: 'Zamknij',
        delete: 'Usuń',
        discard: 'Odrzuć',
        export: 'Eksportuj',
        keepEditing: 'Kontynuuj edycję',
        ok: 'OK',
        reset: 'Resetuj',
        save: 'Zapisz',
        start: 'Start',
      },
      search: {
        noMatchesTitle: 'Brak wyników',
        noMatchesMessage: 'Nic nie pasuje do "{query}".',
        clearSearchButton: 'Wyczyść wyszukiwanie',
      },
      counts: {
        cards: {
          one: '{count} fiszka',
          few: '{count} fiszki',
          many: '{count} fiszek',
          other: '{count} fiszek',
        },
        sessions: {
          one: '{count} sesja',
          few: '{count} sesje',
          many: '{count} sesji',
          other: '{count} sesji',
        },
        reviews: {
          one: '{count} powtórzenie',
          few: '{count} powtórzenia',
          many: '{count} powtórzeń',
          other: '{count} powtórzeń',
        },
      },
    },
    navigation: {
      tabs: {
        decks: 'Talie',
        learn: 'Nauka',
        categories: 'Kategorie',
        statistics: 'Statystyki',
      },
      headers: {
        decksList: 'Talie',
        editDeck: 'Edytuj talię',
        newDeck: 'Nowa talia',
        learnList: 'Nauka',
        study: 'Sesja',
        categoriesList: 'Kategorie',
        newCategory: 'Nowa kategoria',
        statsOverview: 'Statystyki',
        deckStats: 'Statystyki talii',
      },
    },
    answers: {
      answerLabels: {
        ok: 'Dobrze',
        okeish: 'Tak sobie',
        notOk: 'Źle',
      },
      shares: {
        notReviewed: 'Jeszcze nie powtarzano',
        summary: '{ok} Dobrze, {okeish} Tak sobie, {notOk} Źle',
      },
      cardStatus: {
        needsReview: 'Do powtórki',
        learning: 'W nauce',
        mastered: 'Opanowane',
        new: 'Nowe',
      },
      timeframes: {
        all: 'Cały czas',
        month: 'Ten miesiąc',
        week: 'Ostatnie 7 dni',
      },
      sortOrders: {
        hardest: 'Najtrudniejsze najpierw',
        deck: 'Kolejność w talii',
        recent: 'Ostatnio powtarzane',
      },
      dates: {
        never: 'Nigdy',
      },
    },
    importExport: {
      defaultDeckName: 'Zaimportowana talia',
      importErrors: {
        emptyFile: 'Wybrany plik jest pusty.',
        notADeck:
          'To nie jest plik talii Easy Flashcards. Wybierz plik JSON wyeksportowany z aplikacji.',
        newerVersion:
          'Ten plik talii został utworzony w nowszej wersji Easy Flashcards. Zaktualizuj aplikację, aby go zaimportować.',
        noCards:
          'Nie znaleziono użytecznych fiszek. Każda fiszka musi mieć pytanie i odpowiedź.',
        noHeader:
          'Nie znaleziono wiersza nagłówka. Pierwsza linia, która nie jest pusta ani komentarzem "#", musi zawierać kolumny "question" i "answer", oddzielone przecinkiem, średnikiem, tabulatorem lub innym pojedynczym znakiem.',
        noUsableRows:
          'Nie znaleziono użytecznych wierszy. Każdy wiersz musi zawierać pytanie i odpowiedź.',
        unreadable: 'Nie można odczytać wybranego pliku.',
      },
      importAlert: {
        successTitle: 'Talia zaimportowana',
        successMessage: {
          one: '"{name}" ma teraz {count} fiszkę.',
          few: '"{name}" ma teraz {count} fiszki.',
          many: '"{name}" ma teraz {count} fiszek.',
          other: '"{name}" ma teraz {count} fiszek.',
        },
        skippedRows: {
          one: 'Pominięto {count} niekompletny wiersz.',
          few: 'Pominięto {count} niekompletne wiersze.',
          many: 'Pominięto {count} niekompletnych wierszy.',
          other: 'Pominięto {count} niekompletnych wierszy.',
        },
        skippedCards: {
          one: 'Pominięto {count} niekompletną fiszkę.',
          few: 'Pominięto {count} niekompletne fiszki.',
          many: 'Pominięto {count} niekompletnych fiszek.',
          other: 'Pominięto {count} niekompletnych fiszek.',
        },
        failedTitle: 'Import nie powiódł się',
        failedWithDetails: 'Nie można zaimportować pliku: {details}',
        failedUnknown: 'Nieznany błąd podczas importowania pliku.',
      },
      exportAlert: {
        successTitle: 'Talia wyeksportowana',
        savedAs: 'Zapisano jako {name}.',
        saved: 'Talia została zapisana.',
        failedTitle: 'Eksport nie powiódł się',
        deckGone: 'Ta talia już nie istnieje.',
        failedFallback: 'Nie można wyeksportować talii.',
      },
      separators: {
        comma: 'Przecinek (,)',
        semicolon: 'Średnik (;)',
        tab: 'Tabulator',
      },
      sampleExport: {
        successTitle: 'Przykładowa talia wyeksportowana',
        partlyTitle: 'Przykładowa talia wyeksportowana częściowo',
        failedTitle: 'Eksport nie powiódł się',
        savedAsOne: 'Zapisano jako {name}.',
        savedAsTwo: 'Zapisano jako {first} i {second}.',
        fileFailed: 'Nie można zapisać pliku {format}: {details}',
        fileNotSaved: 'Plik {format} nie został zapisany.',
        unknownError: 'Nieznany błąd',
      },
    },
    categoryNames: {
      builtIn: {
        astronomy: 'Astronomia',
        biology: 'Biologia',
        botany: 'Botanika',
        chemistry: 'Chemia',
        cinema: 'Kino',
        computer_science: 'Informatyka',
        economics: 'Ekonomia',
        gastronomy: 'Gastronomia',
        geography: 'Geografia',
        history: 'Historia',
        languages: 'Języki',
        law: 'Prawo',
        literature: 'Literatura',
        mathematics: 'Matematyka',
        medicine: 'Medycyna',
        music: 'Muzyka',
        philosophy: 'Filozofia',
        physics: 'Fizyka',
        religion: 'Religia',
        sport: 'Sport',
        zoology: 'Zoologia',
      },
      icons: {
        plane_contrails: 'Samolot',
        anchor: 'Kotwica',
        nutrition: 'Jabłko',
        emergency: 'Asterysk',
        microbiology: 'Bakteria',
        finance: 'Wykres słupkowy',
        sports_basketball: 'Koszykówka',
        neurology: 'Mózg',
        bug_report: 'Robak',
        calendar_month: 'Kalendarz',
        photo_camera: 'Aparat',
        camera: 'Przysłona aparatu',
        cannabis: 'Liść konopi',
        directions_car: 'Samochód',
        chess_pawn: 'Pionek szachowy',
        language_chinese_dayi: 'Znaki chińskie i łacińskie',
        location_city: 'Miasto',
        circle_circle: 'Koła współśrodkowe',
        restaurant: 'Sztućce',
        database: 'Baza danych',
        nest_heat_link_e: 'Kropka w kole',
        engineering: 'Inżynier',
        face: 'Twarz',
        face_3: 'Twarz z włosami',
        theaters: 'Taśma filmowa',
        flag_2: 'Flaga',
        science: 'Kolba',
        save: 'Dyskietka',
        sports_and_outdoors: 'Piłka nożna',
        skillet: 'Patelnia',
        sports_esports: 'Kontroler do gier',
        language: 'Globus',
        diversity_3: 'Grupa osób',
        psychology: 'Głowa z zębatką',
        headphones: 'Słuchawki',
        health_and_safety: 'Tarcza zdrowia',
        landscape_2: 'Wzgórza',
        hive: 'Plaster miodu',
        hourglass_empty: 'Klepsydra',
        house: 'Dom',
        icecream: 'Lody',
        temp_preferences_eco: 'Liście',
        electric_bolt: 'Błyskawica',
        wand_stars: 'Różdżka',
        biotech: 'Mikroskop',
        mindfulness: 'Uważność',
        motorcycle: 'Motocykl',
        music_note_2: 'Nuta',
        network_node: 'Sieć',
        import_contacts: 'Otwarta książka',
        pan_tool: 'Otwarta dłoń',
        pets: 'Łapa',
        stylus: 'Ołówek',
        person: 'Osoba',
        history_edu: 'Pióro i papier',
        radio: 'Radio',
        raven: 'Kruk',
        rib_cage: 'Klatka piersiowa',
        rocket_launch: 'Rakieta',
        scatter_plot: 'Wykres punktowy',
        category: 'Kształty',
        interests: 'Kształty i serce',
        shopping_cart: 'Koszyk',
        functions: 'Sigma',
        skull: 'Czaszka',
        emoji_language: 'Uśmiech i globus',
        snowflake: 'Śnieżynka',
        hotel_class: 'Gwiazda',
        mountain_flag: 'Flaga na szczycie',
        sunny: 'Słońce',
        mixture_med: 'Strzykawka i tabletka',
        temple_buddhist: 'Świątynia',
        text_snippet: 'Dokument tekstowy',
        theater_comedy: 'Maski teatralne',
        nest_thermostat_gen_3: 'Termostat',
        translate: 'Tłumaczenie',
        nature: 'Drzewo',
        fertile: 'Tulipan',
        videocam: 'Kamera wideo',
        coronavirus: 'Wirus',
        volcano: 'Wulkan',
        warning: 'Ostrzeżenie',
        water: 'Fale',
        air: 'Wiatr',
        build: 'Klucz',
      },
    },
    shell: {
      appMenu: {
        triggerA11yLabel: 'Menu aplikacji',
        exportSampleDeckItem: 'Eksportuj przykładową talię',
        settingsItem: 'Ustawienia',
      },
      exportSampleDeckDialog: {
        title: 'Eksportuj przykładową talię',
        body: 'Zapisuje tę samą przykładową talię jako dwa pliki: CSV i JSON. Dla każdego z nich wybierasz miejsce zapisu i możesz anulować, aby go pominąć.\n\nCSV: wiersze zaczynające się od # (tytuł, opis, kategoria) są pomijane przy imporcie, dalej nagłówek "question" / "answer" i jedna fiszka w wierszu, tu oddzielone średnikami (działa też przecinek, tabulator lub inny pojedynczy znak).\n\nJSON: przywraca także tytuł, opis i kategorię.\n\nPodstawowy HTML, taki jak <b>, <i> i <br />, jest dozwolony po obu stronach fiszki.',
      },
      kebabMenu: {
        triggerA11yLabel: 'Więcej opcji',
      },
      searchBar: {
        inputA11yLabel: 'Tekst wyszukiwania',
        closeButtonA11yLabel: 'Zamknij wyszukiwanie',
      },
    },
    settings: {
      settingsScreen: {
        title: 'Ustawienia',
        generalSection: 'Ogólne',
        appSection: 'Aplikacja',
        communitySection: 'Społeczność i wsparcie',
        legalSection: 'Informacje prawne',
        changeLanguageItem: 'Zmień język',
        shareAppItem: 'Udostępnij aplikację',
        shareMessage: 'Wypróbuj Easy Flashcards, aplikację do nauki z talii fiszek: {url}',
        rateAppItem: 'Oceń aplikację',
        customerSupportItem: 'Obsługa klienta',
        aboutItem: 'O aplikacji',
        buyCoffeeItem: 'Postaw mi kawę',
        privacyPolicyItem: 'Polityka prywatności',
        termsItem: 'Regulamin',
      },
      languageDialog: {
        title: 'Zmień język',
        systemDefaultOption: 'Domyślny język systemu',
      },
      aboutAlert: {
        title: 'O aplikacji',
        message: '{name}, wersja {version}',
      },
      linkFailedAlert: {
        title: 'Nie można otworzyć linku',
        message: 'Żadna aplikacja na tym urządzeniu nie mogła go otworzyć.',
      },
      emailFailedAlert: {
        title: 'Brak aplikacji pocztowej',
        message: 'Aby skontaktować się z obsługą klienta, napisz na adres {email}.',
      },
      coffeeThanksAlert: {
        title: 'Dziękuję!',
        message: 'Twoja kawa jest w drodze do dewelopera. Dziękuję za wsparcie.',
      },
      coffeeUnavailableAlert: {
        title: 'Postaw mi kawę',
        message: 'Postawienie kawy jest teraz niedostępne. Spróbuj ponownie później.',
      },
    },
    decks: {
      decksScreen: {
        searchA11yLabel: 'Szukaj talii',
        searchPlaceholder: 'Szukaj talii',
        loadError: 'Nie można odczytać zapisanych talii.',
        addDeckA11yLabel: 'Dodaj talię',
        emptyTitle: 'Brak talii',
        emptyMessage:
          'Użyj przycisku +, aby zaimportować plik talii i utworzyć pierwszą talię.',
      },
      emptyDeckAlert: {
        title: 'Pusta talia',
        message: 'Ta talia nie ma fiszek do nauki.',
      },
      deleteDeckAlert: {
        title: 'Usuń talię',
        message: 'Usunąć "{name}", jej sesje i wszystkie statystyki?',
      },
      addDeckMenu: {
        title: 'Dodaj talię',
        importItem: 'Importuj talię z pliku',
        manualItem: 'Dodaj talię ręcznie',
      },
      deckOptionsMenu: {
        startWithOptionsItem: 'Rozpocznij sesję z opcjami',
        editItem: 'Edytuj talię',
        exportItem: 'Eksportuj do pliku',
        deleteItem: 'Usuń talię',
      },
      exportFormatMenu: {
        title: 'Eksportuj talię do pliku',
      },
      csvSeparatorMenu: {
        title: 'Separator CSV',
        customItem: 'Własny…',
      },
      deckCard: {
        optionsA11yLabel: 'Opcje: {name}',
        activeCount: 'Aktywne: {count}',
        lastSession: 'Ostatnio: {date}',
        startA11yLabel: 'Rozpocznij sesję: {name}',
      },
      masteryBar: {
        a11yLabel: 'Opanowanie: {summary}',
      },
      sessionSetupDialog: {
        title: 'Rozpocznij sesję',
        invertedLabel: 'Odwrócona',
        invertedDescription: 'Najpierw pokaż odpowiedź, a pytanie na odwrocie.',
        shuffleLabel: 'Wymieszaj',
        shuffleDescription: 'Ucz się fiszek w losowej kolejności.',
      },
      customSeparatorDialog: {
        title: 'Własny separator',
        separatorLabel: 'Separator',
        separatorPlaceholder: 'Na przykład |',
        errors: {
          empty: 'Wpisz jeden znak.',
          tooLong: 'Użyj jednego znaku.',
          reserved: 'Cudzysłowów, # i podziałów wierszy nie można używać.',
          whitespace:
            'Spacje są niedozwolone. Do tabulatora użyj opcji Tabulator.',
          alphanumeric: 'Litery i cyfry są niedozwolone.',
        },
      },
    },
    editDeck: {
      deckNotFound: {
        title: 'Nie znaleziono talii',
        message: 'Ta talia już nie istnieje.',
        backButton: 'Wróć do talii',
      },
      editDeckScreen: {
        titleLabel: 'Tytuł',
        descriptionLabel: 'Opis',
        descriptionPlaceholder: 'Opcjonalnie',
        saveButtonA11yLabel: 'Zapisz talię',
        addCardButton: 'Dodaj fiszkę',
      },
      titleNeededAlert: {
        title: 'Wymagany tytuł',
        message: 'Nadaj talii tytuł.',
      },
      cardIncompleteAlert: {
        title: 'Niekompletna fiszka',
        message: 'Fiszka {number} wymaga pytania i odpowiedzi.',
      },
      removeCardsAlert: {
        title: 'Usunąć fiszki?',
        message: {
          one: '{count} fiszka zostanie usunięta z talii razem ze swoimi statystykami.',
          few: '{count} fiszki zostaną usunięte z talii razem ze swoimi statystykami.',
          many: '{count} fiszek zostanie usuniętych z talii razem ze swoimi statystykami.',
          other:
            '{count} fiszek zostanie usuniętych z talii razem ze swoimi statystykami.',
        },
      },
      discardChangesAlert: {
        title: 'Odrzucić zmiany?',
        messageEdit: 'Twoje zmiany w tej talii nie zostały zapisane.',
        messageNew: 'Ta talia nie została zapisana.',
      },
      cardEditor: {
        title: 'Fiszka {number}',
        removeButtonA11yLabel: 'Usuń fiszkę {number}',
        questionLabel: 'Pytanie',
        questionA11yLabel: 'Pytanie do fiszki {number}',
        answerLabel: 'Odpowiedź',
        answerA11yLabel: 'Odpowiedź do fiszki {number}',
      },
      categoryField: {
        label: 'Kategoria',
        a11yLabel: 'Kategoria: {name}',
        a11yLabelNone: 'Kategoria: brak',
        a11yHint: 'Otwiera wybór kategorii',
        noneValue: 'Brak kategorii',
      },
      categoryPicker: {
        title: 'Kategoria',
        groupA11yLabel: 'Wybór kategorii',
        noneTile: 'Brak kategorii',
      },
    },
    learn: {
      learnScreen: {
        searchA11yLabel: 'Szukaj sesji',
        searchPlaceholder: 'Szukaj sesji',
      },
      headerToolbar: {
        clearCompletedItem: 'Wyczyść ukończone sesje',
      },
      emptyState: {
        noSessionsTitle: 'Brak sesji',
        noSessionsMessage:
          'Wybierz talię i rozpocznij sesję nauki; będzie widoczna tutaj, dopóki jej nie ukończysz.',
        allClearedTitle: 'Brak sesji do wyświetlenia',
        allClearedMessage:
          'Wyczyszczone sesje nadal liczą się w statystykach. Rozpocznij nową sesję z talii, aby zobaczyć ją tutaj.',
        goToDecksButton: 'Przejdź do talii',
      },
      deckUnavailableAlert: {
        title: 'Talia niedostępna',
        message: 'Ta talia już nie istnieje lub nie ma fiszek.',
      },
      clearCompletedSessionsAlert: {
        title: 'Wyczyść ukończone sesje',
        nothingToClear: 'Brak ukończonych sesji do wyczyszczenia.',
        message: {
          one: 'Usunąć {count} ukończoną sesję z tej listy? Jej wyniki pozostaną w statystykach.',
          few: 'Usunąć {count} ukończone sesje z tej listy? Ich wyniki pozostaną w statystykach.',
          many: 'Usunąć {count} ukończonych sesji z tej listy? Ich wyniki pozostaną w statystykach.',
          other:
            'Usunąć {count} ukończonych sesji z tej listy? Ich wyniki pozostaną w statystykach.',
        },
      },
      discardSessionAlert: {
        title: 'Odrzuć sesję',
        message:
          'Odrzucić nieukończoną sesję talii "{deckName}"? Jej odpowiedzi zostaną też usunięte ze statystyk.',
      },
      clearSessionAlert: {
        title: 'Wyczyść sesję',
        message:
          'Usunąć ukończoną sesję talii "{deckName}" z tej listy? Jej wyniki pozostaną w statystykach.',
      },
      sessionOptionsMenu: {
        discardItem: 'Odrzuć sesję',
        clearItem: 'Wyczyść sesję',
      },
      sessionCard: {
        inProgressStatus: {
          one: 'W toku \u2014 {answered}/{count} fiszka',
          few: 'W toku \u2014 {answered}/{count} fiszek',
          many: 'W toku \u2014 {answered}/{count} fiszek',
          other: 'W toku \u2014 {answered}/{count} fiszek',
        },
        completedStatus: {
          one: 'Ukończona \u2014 {count} fiszka',
          few: 'Ukończona \u2014 {count} fiszki',
          many: 'Ukończona \u2014 {count} fiszek',
          other: 'Ukończona \u2014 {count} fiszek',
        },
        invertedPill: 'Odwrócona',
        invertedPillA11yLabel: 'Sesja odwrócona',
        optionsA11yLabel: 'Opcje sesji: {deckName}',
        started: 'Rozpoczęto {date}',
        resumeButtonA11yLabel: 'Wznów sesję: {deckName}',
        replayButtonA11yLabel: 'Rozpocznij sesję ponownie: {deckName}',
        reviewErrorsButtonA11yLabel: {
          one: 'Powtórz {count} błędną lub niepewną fiszkę: {deckName}',
          few: 'Powtórz {count} błędne lub niepewne fiszki: {deckName}',
          many: 'Powtórz {count} błędnych lub niepewnych fiszek: {deckName}',
          other: 'Powtórz {count} błędnych lub niepewnych fiszek: {deckName}',
        },
        reviewErrorsDoneA11yLabel:
          'Wszystkie błędne i niepewne fiszki poprawione: {deckName}',
      },
      sessionResultsBar: {
        progressA11yLabel:
          'Postęp: odpowiedziano na {answered} z {cardCount} \u2014 {ok} dobrze, {okeish} tak sobie, {notOk} źle',
      },
    },
    study: {
      studyScreen: {
        fallbackTitle: 'Sesja',
        unavailableTitle: 'Nic do nauki',
        unavailableMessage: 'Ta sesja nie jest już dostępna.',
        unavailableAction: 'Wróć do sesji',
      },
      progressHeader: {
        position: 'Fiszka {current} z {total}',
        okCount: 'Dobrze {count}',
      },
      invertedPill: {
        text: 'Odwrócona',
        a11yLabel: 'Sesja odwrócona: z przodu widać odpowiedź',
      },
      swipeHint: {
        reviewing:
          'Przeglądasz już ocenioną fiszkę \u2014 przesuń w lewo, aby wrócić do bieżącej fiszki',
      },
      historyStrip: {
        a11yLabel: 'Dotychczasowe odpowiedzi',
      },
      flipCard: {
        questionLabel: 'PYTANIE',
        answerLabel: 'ODPOWIEDŹ',
        revealHint: 'Dotknij, aby odkryć odpowiedź',
        backHint: 'Dotknij, aby ponownie zobaczyć pytanie',
        showQuestionA11yLabel: 'Pokaż pytanie',
        showAnswerA11yLabel: 'Pokaż odpowiedź',
      },
      sessionSummary: {
        title: 'Sesja zakończona',
        successRateA11yLabel: 'Skuteczność {rate}',
        reviewedCount: 'Powtórzenia: {count}',
        studyAgainLabel: 'Ucz się całej talii ponownie',
        studyAgainButtonA11yLabel: 'Ucz się całej talii ponownie',
      },
      reviewSummary: {
        title: 'Powtórka zakończona',
        stillToFix: 'Do poprawy: {count}',
        allFixed: 'Wszystko poprawione',
      },
      summaryAction: {
        reviewLabel: 'Powtórz błędne i niepewne fiszki',
        reviewButtonA11yLabel: {
          one: 'Powtórz {count} błędną lub niepewną fiszkę',
          few: 'Powtórz {count} błędne lub niepewne fiszki',
          many: 'Powtórz {count} błędnych lub niepewnych fiszek',
          other: 'Powtórz {count} błędnych lub niepewnych fiszek',
        },
        backLabel: 'Wróć do sesji',
        backButtonA11yLabel: 'Wróć do sesji',
      },
    },
    categories: {
      categoriesScreen: {
        customSectionTitle: 'Własne kategorie',
        customSectionSubtitle: {
          one: '{count} dostępna',
          few: '{count} dostępne',
          many: '{count} dostępnych',
          other: '{count} dostępnych',
        },
        customEmptyHint: 'Tutaj pojawią się Twoje własne kategorie.',
        defaultSectionTitle: 'Domyślne kategorie',
        defaultSectionSubtitle: {
          one: '{count} wbudowana',
          few: '{count} wbudowane',
          many: '{count} wbudowanych',
          other: '{count} wbudowanych',
        },
        newCategoryButton: 'Nowa kategoria',
        categoryTileA11yLabel: 'Opcje: {name}',
      },
      categoryOptionsMenu: {
        deleteItem: 'Usuń kategorię',
      },
      deleteCategoryAlert: {
        title: 'Usunąć kategorię?',
        message: 'Kategoria "{name}" zostanie usunięta.',
        messageWithDecks: {
          one: 'Kategoria "{name}" zostanie usunięta. {count} talia będzie bez kategorii.',
          few: 'Kategoria "{name}" zostanie usunięta. {count} talie będą bez kategorii.',
          many: 'Kategoria "{name}" zostanie usunięta. {count} talii będzie bez kategorii.',
          other:
            'Kategoria "{name}" zostanie usunięta. {count} talii będzie bez kategorii.',
        },
      },
      newCategoryScreen: {
        saveButtonA11yLabel: 'Zapisz kategorię',
        nameField: 'Nazwa',
        colourLabel: 'Kolor',
        iconLabel: 'Ikona',
        nameCounter: '{length}/{max}',
        nameErrors: {
          empty: 'Wpisz nazwę.',
          tooLong: {
            one: 'Użyj do {count} znaku.',
            few: 'Użyj do {count} znaków.',
            many: 'Użyj do {count} znaków.',
            other: 'Użyj do {count} znaków.',
          },
          duplicate: 'Kategoria o tej nazwie już istnieje.',
        },
      },
      discardChangesAlert: {
        title: 'Odrzucić zmiany?',
        message: 'Ta kategoria nie została zapisana.',
      },
      tilePreview: {
        placeholder: 'Nazwa kategorii',
        a11yLabel: 'Podgląd: {name}',
        noNameA11yLabel: 'Podgląd: brak nazwy',
      },
      colourPicker: {
        a11yLabel: 'Wybór koloru',
        swatchA11yLabel: 'Kolor {position} z {total}',
      },
      customColourSwatch: {
        a11yLabel: 'Własny kolor',
        a11yHint: 'Otwiera wybór koloru',
      },
      iconPicker: {
        a11yLabel: 'Wybór ikony',
      },
      customColourDialog: {
        title: 'Własny kolor',
        hueLabel: 'Odcień',
        hueValue: '{value}°',
        saturationLabel: 'Nasycenie',
        brightnessLabel: 'Jasność',
        percentValue: '{value}%',
        previewA11yLabel: 'Podgląd koloru {color}',
        tooDark: 'Za ciemny dla ikony. Spróbuj jaśniejszego koloru.',
        useButton: 'Użyj koloru',
      },
      categorySquare: {
        a11yLabel: 'Kategoria: {name}',
      },
    },
    stats: {
      statsScreen: {
        searchA11yLabel: 'Szukaj talii',
        searchPlaceholder: 'Szukaj talii',
        aggregatedHeading: 'Statystyki zbiorcze',
        decksTile: {
          label: 'Talie',
          caption: 'W Twojej bibliotece',
        },
        totalCardsTile: {
          label: 'Wszystkie fiszki',
          caption: 'We wszystkich taliach',
        },
        totalReviewsTile: {
          label: 'Wszystkie powtórzenia',
          caption: {
            all: 'Zapisane odpowiedzi',
            month: 'Odpowiedzi w tym miesiącu',
            week: 'Odpowiedzi w ostatnich 7 dniach',
          },
        },
        sessionsTile: {
          label: 'Sesje',
          caption: 'Aktywne: {count}',
        },
        tileA11yLabel: '{label}: {value}, {caption}',
        decksBreakdownHeading: 'Podział według talii',
        deckCount: {
          one: '{count} talia',
          few: '{count} talie',
          many: '{count} talii',
          other: '{count} talii',
        },
        emptyState: {
          title: 'Brak statystyk',
          message:
            'Zaimportuj talię i ucz się z niej; wyniki pojawią się tutaj.',
        },
      },
      masteryRing: {
        summaryA11yLabel: 'Skuteczność {rate}. {shares}. Liczba: {counts}',
        caption: 'Skuteczność',
      },
      deckStatsCard: {
        summaryA11yLabel:
          '{name}: {shares}, {cards}, {sessions}, {reviews}, ostatnio {last}',
        openA11yHint: 'Otwiera szczegóły fiszek',
        cardsLabel: 'Fiszki',
        sessionsLabel: 'Sesje',
        reviewsLabel: 'Powtórzenia',
        lastLabel: 'Ostatnio',
      },
      timeframeChips: {
        groupA11yLabel: 'Zakres czasu',
      },
    },
    deckStats: {
      deckStatsScreen: {
        optionsA11yLabel: 'Opcje statystyk: {deckName}',
        resetStatisticsMenuItem: 'Resetuj statystyki',
        resetAlert: {
          title: 'Resetuj statystyki',
          message:
            'Wyczyścić wszystkie zapisane wyniki i sesje talii "{deckName}"?',
        },
        notFound: {
          title: 'Nie znaleziono talii',
          message: 'Ta talia została usunięta.',
        },
        cardPerformanceTitle: 'Wyniki fiszek',
        subtitle: {
          one: '{count} fiszka · {sort}',
          few: '{count} fiszki · {sort}',
          many: '{count} fiszek · {sort}',
          other: '{count} fiszek · {sort}',
        },
        subtitleNarrowed: {
          one: '{shown} z {count} fiszki · {sort}',
          few: '{shown} z {count} fiszek · {sort}',
          many: '{shown} z {count} fiszek · {sort}',
          other: '{shown} z {count} fiszek · {sort}',
        },
        sortButtonA11yLabel: 'Sortuj fiszki: {sort}',
        sortSheetTitle: 'Sortuj fiszki',
        noCards: {
          title: 'Brak fiszek',
          message:
            'Dodaj fiszki do tej talii, aby zobaczyć wyniki każdej z nich.',
        },
        statusEmpty: {
          needsReview: {
            title: 'Brak fiszek do powtórki',
            message: 'Żadna fiszka nie ma skuteczności poniżej 40%.',
          },
          learning: {
            title: 'Brak fiszek w nauce',
            message: 'Żadna fiszka nie ma skuteczności między 40% a 70%.',
          },
          mastered: {
            title: 'Brak opanowanych fiszek',
            message: 'Fiszka jest opanowana przy skuteczności 70% lub wyższej.',
          },
          new: {
            title: 'Brak nowych fiszek',
            message: 'Każda fiszka została powtórzona co najmniej raz.',
          },
        },
        showAllCardsButton: 'Pokaż wszystkie fiszki',
        noMatches: {
          filteredMessage:
            'Nic nie pasuje do "{query}" przy filtrze: {status}.',
        },
      },
      deckIdentityRow: {
        categoryA11yLabel: 'Kategoria: {name}',
      },
      deckMasteryCard: {
        successRateA11yLabel: 'Skuteczność: {rate}',
        successRateNoReviewsA11yLabel: 'Skuteczność: brak powtórzeń',
        successRateCaption: 'Skuteczność',
        answerTile: {
          ok: '{count} dobrze, {percent}',
          okeish: '{count} tak sobie, {percent}',
          notOk: '{count} źle, {percent}',
        },
        answerTileNoReviews: {
          ok: '{count} dobrze, brak powtórzeń',
          okeish: '{count} tak sobie, brak powtórzeń',
          notOk: '{count} źle, brak powtórzeń',
        },
        reviewsFigure: 'Powtórzenia',
        sessionsFigure: 'Sesje',
        lastSessionFigure: 'Ostatnia sesja',
        figureA11yLabel: '{label}: {value}',
        changeChip: {
          none: 'Bez zmian od ostatniej sesji',
          up: '+{points} pkt od ostatniej sesji',
          down: '-{points} pkt od ostatniej sesji',
          noneA11yLabel: 'Skuteczność bez zmian od ostatniej sesji',
          upA11yLabel: {
            one: 'Skuteczność wzrosła o {count} punkt od ostatniej sesji',
            few: 'Skuteczność wzrosła o {count} punkty od ostatniej sesji',
            many: 'Skuteczność wzrosła o {count} punktów od ostatniej sesji',
            other: 'Skuteczność wzrosła o {count} punktów od ostatniej sesji',
          },
          downA11yLabel: {
            one: 'Skuteczność spadła o {count} punkt od ostatniej sesji',
            few: 'Skuteczność spadła o {count} punkty od ostatniej sesji',
            many: 'Skuteczność spadła o {count} punktów od ostatniej sesji',
            other: 'Skuteczność spadła o {count} punktów od ostatniej sesji',
          },
        },
      },
      cardStatsRow: {
        footerNeverReviewed: 'Nigdy nie powtarzano',
        footerReviewed: {
          one: '{count} powtórzenie · Powtórzono {date}',
          few: '{count} powtórzenia · Powtórzono {date}',
          many: '{count} powtórzeń · Powtórzono {date}',
          other: '{count} powtórzeń · Powtórzono {date}',
        },
        neverReviewedA11yLabel:
          'Pytanie: {question}. Odpowiedź: {answer}. {status}. Nigdy nie powtarzano.',
        reviewedA11yLabel: {
          one: 'Pytanie: {question}. Odpowiedź: {answer}. {status}, skuteczność {rate}. {count} powtórzenie: {ok} dobrze, {okeish} tak sobie, {notOk} źle.',
          few: 'Pytanie: {question}. Odpowiedź: {answer}. {status}, skuteczność {rate}. {count} powtórzenia: {ok} dobrze, {okeish} tak sobie, {notOk} źle.',
          many: 'Pytanie: {question}. Odpowiedź: {answer}. {status}, skuteczność {rate}. {count} powtórzeń: {ok} dobrze, {okeish} tak sobie, {notOk} źle.',
          other:
            'Pytanie: {question}. Odpowiedź: {answer}. {status}, skuteczność {rate}. {count} powtórzeń: {ok} dobrze, {okeish} tak sobie, {notOk} źle.',
        },
        reviewedOnA11yLabel: {
          one: 'Pytanie: {question}. Odpowiedź: {answer}. {status}, skuteczność {rate}. {count} powtórzenie: {ok} dobrze, {okeish} tak sobie, {notOk} źle. Powtórzono {date}.',
          few: 'Pytanie: {question}. Odpowiedź: {answer}. {status}, skuteczność {rate}. {count} powtórzenia: {ok} dobrze, {okeish} tak sobie, {notOk} źle. Powtórzono {date}.',
          many: 'Pytanie: {question}. Odpowiedź: {answer}. {status}, skuteczność {rate}. {count} powtórzeń: {ok} dobrze, {okeish} tak sobie, {notOk} źle. Powtórzono {date}.',
          other:
            'Pytanie: {question}. Odpowiedź: {answer}. {status}, skuteczność {rate}. {count} powtórzeń: {ok} dobrze, {okeish} tak sobie, {notOk} źle. Powtórzono {date}.',
        },
      },
      cardStatusChips: {
        groupA11yLabel: 'Status fiszki',
        allChip: 'Wszystkie',
        chipLabel: '{label} ({count})',
        chipA11yLabel: {
          one: '{label}, {count} fiszka',
          few: '{label}, {count} fiszki',
          many: '{label}, {count} fiszek',
          other: '{label}, {count} fiszek',
        },
      },
      cardSearchField: {
        searchA11yLabel: 'Szukaj fiszek',
        searchPlaceholder: 'Szukaj w pytaniach i odpowiedziach',
        clearA11yLabel: 'Wyczyść wyszukiwanie fiszek',
      },
      sessionHistoryChart: {
        title: 'Historia sesji',
        subtitleLatest: 'Ostatnie {shown} z {total}',
        empty: {
          title: 'Brak sesji dla tej talii',
          message:
            'Rozpocznij jedną w zakładce Talie, a jej wyniki pojawią się tutaj.',
        },
        unansweredLegend: 'Bez odpowiedzi',
        legendNote: '% fiszek w każdej sesji',
        sessionA11yLabel: {
          one: 'Sesja z {date}: skuteczność {rate}, odpowiedziano na {answered} z {count} fiszki \u2014 {ok} dobrze, {okeish} tak sobie, {notOk} źle',
          few: 'Sesja z {date}: skuteczność {rate}, odpowiedziano na {answered} z {count} fiszek \u2014 {ok} dobrze, {okeish} tak sobie, {notOk} źle',
          many: 'Sesja z {date}: skuteczność {rate}, odpowiedziano na {answered} z {count} fiszek \u2014 {ok} dobrze, {okeish} tak sobie, {notOk} źle',
          other:
            'Sesja z {date}: skuteczność {rate}, odpowiedziano na {answered} z {count} fiszek \u2014 {ok} dobrze, {okeish} tak sobie, {notOk} źle',
        },
        sessionNoAnswersA11yLabel: {
          one: 'Sesja z {date}: skuteczność: brak odpowiedzi, odpowiedziano na {answered} z {count} fiszki \u2014 {ok} dobrze, {okeish} tak sobie, {notOk} źle',
          few: 'Sesja z {date}: skuteczność: brak odpowiedzi, odpowiedziano na {answered} z {count} fiszek \u2014 {ok} dobrze, {okeish} tak sobie, {notOk} źle',
          many: 'Sesja z {date}: skuteczność: brak odpowiedzi, odpowiedziano na {answered} z {count} fiszek \u2014 {ok} dobrze, {okeish} tak sobie, {notOk} źle',
          other:
            'Sesja z {date}: skuteczność: brak odpowiedzi, odpowiedziano na {answered} z {count} fiszek \u2014 {ok} dobrze, {okeish} tak sobie, {notOk} źle',
        },
      },
    },
  },
};
