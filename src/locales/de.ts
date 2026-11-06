import type { Catalogue, Language, PluralRule } from '../utils/i18n';

export const dePlural: PluralRule = count => (count === 1 ? 'one' : 'other');

// "Okeish" is rendered "Geht so": it reads as clearly between "Ok" and "Nicht ok".
const messages: Catalogue = {
  common: {
    actions: {
      back: 'Zurück',
      cancel: 'Abbrechen',
      clear: 'Entfernen',
      close: 'Schließen',
      delete: 'Löschen',
      discard: 'Verwerfen',
      export: 'Exportieren',
      keepEditing: 'Weiter bearbeiten',
      ok: 'OK',
      reset: 'Zurücksetzen',
      save: 'Speichern',
      start: 'Starten',
    },
    search: {
      noMatchesTitle: 'Keine Treffer',
      noMatchesMessage: 'Keine Treffer für „{query}“.',
      clearSearchButton: 'Suche leeren',
    },
    counts: {
      cards: {
        one: '{count} Karte',
        other: '{count} Karten',
      },
      sessions: {
        one: '{count} Sitzung',
        other: '{count} Sitzungen',
      },
      reviews: {
        one: '{count} Wiederholung',
        other: '{count} Wiederholungen',
      },
    },
  },
  navigation: {
    tabs: {
      decks: 'Stapel',
      learn: 'Lernen',
      categories: 'Kategorien',
      statistics: 'Statistik',
    },
    headers: {
      decksList: 'Stapel',
      editDeck: 'Stapel bearbeiten',
      newDeck: 'Neuer Stapel',
      learnList: 'Lernen',
      study: 'Sitzung',
      categoriesList: 'Kategorien',
      newCategory: 'Neue Kategorie',
      statsOverview: 'Statistik',
      deckStats: 'Stapelstatistik',
    },
  },
  answers: {
    answerLabels: {
      ok: 'Ok',
      okeish: 'Geht so',
      notOk: 'Nicht ok',
    },
    shares: {
      notReviewed: 'Noch nicht wiederholt',
      summary: '{ok} Ok, {okeish} Geht so, {notOk} Nicht ok',
    },
    cardStatus: {
      needsReview: 'Zu wiederholen',
      learning: 'Lernend',
      mastered: 'Gemeistert',
      new: 'Neu',
    },
    timeframes: {
      all: 'Gesamt',
      month: 'Dieser Monat',
      week: 'Letzte 7 Tage',
    },
    sortOrders: {
      hardest: 'Schwierigste zuerst',
      deck: 'Stapelreihenfolge',
      recent: 'Zuletzt wiederholt',
    },
    dates: {
      never: 'Nie',
    },
  },
  importExport: {
    defaultDeckName: 'Importierter Stapel',
    importErrors: {
      emptyFile: 'Die ausgewählte Datei ist leer.',
      notADeck:
        'Das ist keine Stapeldatei von Easy Flashcards. Bitte eine aus der App exportierte JSON-Datei auswählen.',
      newerVersion:
        'Diese Stapeldatei stammt aus einer neueren Version von Easy Flashcards. Zum Importieren die App aktualisieren.',
      noCards:
        'Keine verwendbaren Karten gefunden. Jede Karte braucht eine Frage und eine Antwort.',
      noHeader:
        'Keine Kopfzeile gefunden. Die erste Zeile, die weder leer noch ein "#"-Kommentar ist, muss eine Spalte "question" und eine Spalte "answer" benennen, getrennt durch ein Komma, ein Semikolon, einen Tabulator oder ein anderes Symbol.',
      noUsableRows:
        'Keine verwendbaren Zeilen gefunden. Jede Zeile braucht eine Frage und eine Antwort.',
      unreadable: 'Die ausgewählte Datei konnte nicht gelesen werden.',
    },
    importAlert: {
      successTitle: 'Stapel importiert',
      successMessage: {
        one: '„{name}“ enthält jetzt {count} Karte.',
        other: '„{name}“ enthält jetzt {count} Karten.',
      },
      skippedRows: {
        one: '{count} unvollständige Zeile übersprungen.',
        other: '{count} unvollständige Zeilen übersprungen.',
      },
      skippedCards: {
        one: '{count} unvollständige Karte übersprungen.',
        other: '{count} unvollständige Karten übersprungen.',
      },
      failedTitle: 'Import fehlgeschlagen',
      failedWithDetails: 'Die Datei konnte nicht importiert werden: {details}',
      failedUnknown: 'Unbekannter Fehler beim Importieren der Datei.',
    },
    exportAlert: {
      successTitle: 'Stapel exportiert',
      savedAs: 'Gespeichert als {name}.',
      saved: 'Der Stapel wurde gespeichert.',
      failedTitle: 'Export fehlgeschlagen',
      deckGone: 'Dieser Stapel existiert nicht mehr.',
      failedFallback: 'Der Stapel konnte nicht exportiert werden.',
    },
    separators: {
      comma: 'Komma (,)',
      semicolon: 'Semikolon (;)',
      tab: 'Tabulator',
    },
    sampleExport: {
      successTitle: 'Beispielstapel exportiert',
      partlyTitle: 'Beispielstapel teilweise exportiert',
      failedTitle: 'Export fehlgeschlagen',
      savedAsOne: 'Gespeichert als {name}.',
      savedAsTwo: 'Gespeichert als {first} und {second}.',
      fileFailed: 'Die {format}-Datei konnte nicht gespeichert werden: {details}',
      fileNotSaved: 'Die {format}-Datei wurde nicht gespeichert.',
      unknownError: 'Unbekannter Fehler',
    },
  },
  categoryNames: {
    builtIn: {
      astronomy: 'Astronomie',
      biology: 'Biologie',
      botany: 'Botanik',
      chemistry: 'Chemie',
      cinema: 'Kino',
      computer_science: 'Informatik',
      economics: 'Wirtschaft',
      gastronomy: 'Gastronomie',
      geography: 'Geografie',
      history: 'Geschichte',
      languages: 'Sprachen',
      law: 'Recht',
      literature: 'Literatur',
      mathematics: 'Mathematik',
      medicine: 'Medizin',
      music: 'Musik',
      philosophy: 'Philosophie',
      physics: 'Physik',
      religion: 'Religion',
      sport: 'Sport',
      zoology: 'Zoologie',
    },
    icons: {
      plane_contrails: 'Flugzeug',
      anchor: 'Anker',
      nutrition: 'Apfel',
      emergency: 'Sternchen',
      microbiology: 'Bakterium',
      finance: 'Balkendiagramm',
      sports_basketball: 'Basketball',
      neurology: 'Gehirn',
      bug_report: 'Käfer',
      calendar_month: 'Kalender',
      photo_camera: 'Kamera',
      camera: 'Kamerablende',
      cannabis: 'Hanfblatt',
      directions_car: 'Auto',
      chess_pawn: 'Schachbauer',
      language_chinese_dayi: 'Chinesische und lateinische Buchstaben',
      location_city: 'Stadt',
      circle_circle: 'Konzentrische Kreise',
      restaurant: 'Besteck',
      database: 'Datenbank',
      nest_heat_link_e: 'Punkt in einem Kreis',
      engineering: 'Ingenieur',
      face: 'Gesicht',
      face_3: 'Gesicht mit Haaren',
      theaters: 'Filmstreifen',
      flag_2: 'Flagge',
      science: 'Kolben',
      save: 'Diskette',
      sports_and_outdoors: 'Fußball',
      skillet: 'Bratpfanne',
      sports_esports: 'Spielcontroller',
      language: 'Globus',
      diversity_3: 'Personengruppe',
      psychology: 'Kopf mit Zahnrad',
      headphones: 'Kopfhörer',
      health_and_safety: 'Gesundheitsschild',
      landscape_2: 'Hügel',
      hive: 'Wabe',
      hourglass_empty: 'Sanduhr',
      house: 'Haus',
      icecream: 'Eis',
      temp_preferences_eco: 'Blätter',
      electric_bolt: 'Blitz',
      wand_stars: 'Zauberstab',
      biotech: 'Mikroskop',
      mindfulness: 'Achtsamkeit',
      motorcycle: 'Motorrad',
      music_note_2: 'Musiknote',
      network_node: 'Netzwerk',
      import_contacts: 'Offenes Buch',
      pan_tool: 'Offene Hand',
      pets: 'Pfote',
      stylus: 'Bleistift',
      person: 'Person',
      history_edu: 'Feder und Papier',
      radio: 'Radio',
      raven: 'Rabe',
      rib_cage: 'Brustkorb',
      rocket_launch: 'Rakete',
      scatter_plot: 'Streudiagramm',
      category: 'Formen',
      interests: 'Formen und Herz',
      shopping_cart: 'Einkaufswagen',
      functions: 'Sigma',
      skull: 'Totenkopf',
      emoji_language: 'Smiley und Globus',
      snowflake: 'Schneeflocke',
      hotel_class: 'Stern',
      mountain_flag: 'Gipfelflagge',
      sunny: 'Sonne',
      mixture_med: 'Spritze und Tablette',
      temple_buddhist: 'Tempel',
      text_snippet: 'Textdokument',
      theater_comedy: 'Theatermasken',
      nest_thermostat_gen_3: 'Thermostat',
      translate: 'Übersetzen',
      nature: 'Baum',
      fertile: 'Tulpe',
      videocam: 'Videokamera',
      coronavirus: 'Virus',
      volcano: 'Vulkan',
      warning: 'Warnung',
      water: 'Wellen',
      air: 'Wind',
      build: 'Schraubenschlüssel',
    },
  },
  shell: {
    appMenu: {
      triggerA11yLabel: 'App-Menü',
      exportSampleDeckItem: 'Beispielstapel exportieren',
      settingsItem: 'Einstellungen',
    },
    exportSampleDeckDialog: {
      title: 'Beispielstapel exportieren',
      body: 'Dies speichert denselben Beispielstapel als zwei Dateien, CSV und JSON. Für jede Datei wird nach dem Speicherort gefragt; jede lässt sich abbrechen, um sie zu überspringen.\n\nCSV: Zeilen, die mit # beginnen (title, description, category), werden beim Import übersprungen, danach folgen eine Kopfzeile mit "question" / "answer" und eine Karte pro Zeile, hier durch Semikolons getrennt (ein Komma, ein Tabulator oder ein anderes einzelnes Symbol funktioniert ebenfalls).\n\nJSON: stellt zusätzlich Titel, Beschreibung und Kategorie wieder her.\n\nEinfaches HTML wie <b>, <i> und <br /> ist auf beiden Seiten einer Karte erlaubt.',
    },
    kebabMenu: {
      triggerA11yLabel: 'Weitere Optionen',
    },
    searchBar: {
      inputA11yLabel: 'Suchtext',
      closeButtonA11yLabel: 'Suche schließen',
    },
  },
  settings: {
    settingsScreen: {
      title: 'Einstellungen',
      generalSection: 'Allgemein',
      appSection: 'App',
      communitySection: 'Community und Support',
      legalSection: 'Rechtliches',
      changeLanguageItem: 'Sprache ändern',
      shareAppItem: 'App teilen',
      shareMessage:
        'Probier Easy Flashcards aus, eine App zum Lernen mit Karteikarten-Stapeln: {url}',
      rateAppItem: 'App bewerten',
      customerSupportItem: 'Kundensupport',
      aboutItem: 'Über',
      buyCoffeeItem: 'Spendiere mir einen Kaffee',
      privacyPolicyItem: 'Datenschutzerklärung',
      termsItem: 'Nutzungsbedingungen',
    },
    languageDialog: {
      title: 'Sprache ändern',
      systemDefaultOption: 'Systemstandard',
    },
    aboutAlert: {
      title: 'Über',
      message: '{name}, Version {version}',
    },
    linkFailedAlert: {
      title: 'Link konnte nicht geöffnet werden',
      message: 'Keine App auf diesem Gerät konnte ihn öffnen.',
    },
    emailFailedAlert: {
      title: 'Keine E-Mail-App',
      message: 'Um den Kundensupport zu erreichen, schreibe an {email}.',
    },
    coffeeThanksAlert: {
      title: 'Danke!',
      message: 'Dein Kaffee ist auf dem Weg zum Entwickler. Danke für deine Unterstützung.',
    },
    coffeeUnavailableAlert: {
      title: 'Spendiere mir einen Kaffee',
      message:
        'Einen Kaffee zu spendieren ist gerade nicht möglich. Bitte versuche es später erneut.',
    },
  },
  decks: {
    decksScreen: {
      searchA11yLabel: 'Stapel durchsuchen',
      searchPlaceholder: 'Stapel suchen',
      loadError: 'Gespeicherte Stapel konnten nicht gelesen werden.',
      addDeckA11yLabel: 'Stapel hinzufügen',
      emptyTitle: 'Noch keine Stapel',
      emptyMessage:
        'Mit der Schaltfläche + eine Stapeldatei importieren und den ersten Stapel erstellen.',
    },
    emptyDeckAlert: {
      title: 'Leerer Stapel',
      message: 'Dieser Stapel enthält keine Karten zum Lernen.',
    },
    deleteDeckAlert: {
      title: 'Stapel löschen',
      message: '„{name}“, die zugehörigen Sitzungen und die gesamte Statistik löschen?',
    },
    addDeckMenu: {
      title: 'Stapel hinzufügen',
      importItem: 'Stapel aus Datei importieren',
      manualItem: 'Stapel manuell hinzufügen',
    },
    deckOptionsMenu: {
      startWithOptionsItem: 'Sitzung mit Optionen starten',
      editItem: 'Stapel bearbeiten',
      exportItem: 'In Datei exportieren',
      deleteItem: 'Stapel löschen',
    },
    exportFormatMenu: {
      title: 'Stapel in Datei exportieren',
    },
    csvSeparatorMenu: {
      title: 'CSV-Trennzeichen',
      customItem: 'Benutzerdefiniert…',
    },
    deckCard: {
      optionsA11yLabel: 'Optionen für {name}',
      activeCount: '{count} aktiv',
      lastSession: 'Zuletzt: {date}',
      startA11yLabel: 'Sitzung für {name} starten',
    },
    masteryBar: {
      a11yLabel: 'Beherrschung: {summary}',
    },
    sessionSetupDialog: {
      title: 'Sitzung starten',
      invertedLabel: 'Umgekehrt',
      invertedDescription: 'Zuerst die Antwort zeigen, die Frage steht auf der Rückseite.',
      shuffleLabel: 'Mischen',
      shuffleDescription: 'Die Karten in zufälliger Reihenfolge lernen.',
    },
    customSeparatorDialog: {
      title: 'Benutzerdefiniertes Trennzeichen',
      separatorLabel: 'Trennzeichen',
      separatorPlaceholder: 'Zum Beispiel |',
      errors: {
        empty: 'Ein Zeichen eingeben.',
        tooLong: 'Nur ein einzelnes Zeichen verwenden.',
        reserved: 'Anführungszeichen, # und Zeilenumbrüche sind nicht erlaubt.',
        whitespace:
          'Leerzeichen sind nicht erlaubt. Für einen Tabulator die Option „Tabulator“ verwenden.',
        alphanumeric: 'Buchstaben und Ziffern sind nicht erlaubt.',
      },
    },
  },
  editDeck: {
    deckNotFound: {
      title: 'Stapel nicht gefunden',
      message: 'Dieser Stapel existiert nicht mehr.',
      backButton: 'Zurück zu den Stapeln',
    },
    editDeckScreen: {
      titleLabel: 'Titel',
      descriptionLabel: 'Beschreibung',
      descriptionPlaceholder: 'Optional',
      saveButtonA11yLabel: 'Stapel speichern',
      addCardButton: 'Karte hinzufügen',
    },
    titleNeededAlert: {
      title: 'Titel erforderlich',
      message: 'Dem Stapel einen Titel geben.',
    },
    cardIncompleteAlert: {
      title: 'Karte unvollständig',
      message: 'Karte {number} braucht eine Frage und eine Antwort.',
    },
    removeCardsAlert: {
      title: 'Karten entfernen?',
      message: {
        one: '{count} Karte wird zusammen mit ihrer Statistik aus dem Stapel entfernt.',
        other: '{count} Karten werden zusammen mit ihrer Statistik aus dem Stapel entfernt.',
      },
    },
    discardChangesAlert: {
      title: 'Änderungen verwerfen?',
      messageEdit: 'Die Änderungen an diesem Stapel wurden nicht gespeichert.',
      messageNew: 'Dieser Stapel wurde nicht gespeichert.',
    },
    cardEditor: {
      title: 'Karte {number}',
      removeButtonA11yLabel: 'Karte {number} entfernen',
      questionLabel: 'Frage',
      questionA11yLabel: 'Frage für Karte {number}',
      answerLabel: 'Antwort',
      answerA11yLabel: 'Antwort für Karte {number}',
    },
    categoryField: {
      label: 'Kategorie',
      a11yLabel: 'Kategorie: {name}',
      a11yLabelNone: 'Kategorie: keine',
      a11yHint: 'Öffnet die Kategorieauswahl',
      noneValue: 'Keine Kategorie',
    },
    categoryPicker: {
      title: 'Kategorie',
      groupA11yLabel: 'Kategorieauswahl',
      noneTile: 'Keine Kategorie',
    },
  },
  learn: {
    learnScreen: {
      searchA11yLabel: 'Sitzungen durchsuchen',
      searchPlaceholder: 'Sitzungen suchen',
    },
    headerToolbar: {
      clearCompletedItem: 'Abgeschlossene Sitzungen entfernen',
    },
    emptyState: {
      noSessionsTitle: 'Noch keine Sitzungen',
      noSessionsMessage:
        'Einen Stapel auswählen und eine Lernsitzung starten; sie erscheint hier, bis sie abgeschlossen ist.',
      allClearedTitle: 'Keine Sitzungen anzuzeigen',
      allClearedMessage:
        'Entfernte Sitzungen zählen weiterhin in der Statistik. Eine neue Sitzung aus einem Stapel starten, um sie hier zu sehen.',
      goToDecksButton: 'Zu den Stapeln',
    },
    deckUnavailableAlert: {
      title: 'Stapel nicht verfügbar',
      message: 'Dieser Stapel existiert nicht mehr oder enthält keine Karten.',
    },
    clearCompletedSessionsAlert: {
      title: 'Abgeschlossene Sitzungen entfernen',
      nothingToClear: 'Keine abgeschlossenen Sitzungen zum Entfernen.',
      message: {
        one: '{count} abgeschlossene Sitzung aus dieser Liste entfernen? Ihre Ergebnisse bleiben in der Statistik erhalten.',
        other:
          '{count} abgeschlossene Sitzungen aus dieser Liste entfernen? Ihre Ergebnisse bleiben in der Statistik erhalten.',
      },
    },
    discardSessionAlert: {
      title: 'Sitzung verwerfen',
      message:
        'Die unvollständige Sitzung für „{deckName}“ verwerfen? Ihre Antworten werden auch aus der Statistik entfernt.',
    },
    clearSessionAlert: {
      title: 'Sitzung entfernen',
      message:
        'Die abgeschlossene Sitzung für „{deckName}“ aus dieser Liste entfernen? Ihre Ergebnisse bleiben in der Statistik erhalten.',
    },
    sessionOptionsMenu: {
      discardItem: 'Sitzung verwerfen',
      clearItem: 'Sitzung entfernen',
    },
    sessionCard: {
      inProgressStatus: {
        one: 'Läuft \u2013 {answered}/{count} Karte',
        other: 'Läuft \u2013 {answered}/{count} Karten',
      },
      completedStatus: {
        one: 'Abgeschlossen \u2013 {count} Karte',
        other: 'Abgeschlossen \u2013 {count} Karten',
      },
      invertedPill: 'Umgekehrt',
      invertedPillA11yLabel: 'Umgekehrte Sitzung',
      optionsA11yLabel: 'Optionen für die Sitzung {deckName}',
      started: 'Gestartet {date}',
      resumeButtonA11yLabel: 'Sitzung für {deckName} fortsetzen',
      replayButtonA11yLabel: 'Sitzung für {deckName} erneut starten',
      reviewErrorsButtonA11yLabel: {
        one: '{count} falsche oder unsichere Karte für {deckName} durchgehen',
        other: '{count} falsche oder unsichere Karten für {deckName} durchgehen',
      },
      reviewErrorsDoneA11yLabel: 'Alle falschen oder unsicheren Karten für {deckName} korrigiert',
    },
    sessionResultsBar: {
      progressA11yLabel:
        'Fortschritt: {answered} von {cardCount} beantwortet \u2013 {ok} ok, {okeish} geht so, {notOk} nicht ok',
    },
  },
  study: {
    studyScreen: {
      fallbackTitle: 'Sitzung',
      unavailableTitle: 'Nichts zu lernen',
      unavailableMessage: 'Diese Sitzung ist nicht mehr verfügbar.',
      unavailableAction: 'Zurück zu den Sitzungen',
    },
    progressHeader: {
      position: 'Karte {current} von {total}',
      okCount: 'Ok {count}',
    },
    invertedPill: {
      text: 'Umgekehrt',
      a11yLabel: 'Umgekehrte Sitzung: Die Vorderseite zeigt die Antwort',
    },
    swipeHint: {
      reviewing:
        'Eine beantwortete Karte wird angesehen \u2013 nach links wischen, um zurückzukehren',
    },
    historyStrip: {
      a11yLabel: 'Bisherige Antworten',
    },
    flipCard: {
      questionLabel: 'FRAGE',
      answerLabel: 'ANTWORT',
      revealHint: 'Tippen, um die Antwort aufzudecken',
      backHint: 'Tippen, um die Frage erneut zu sehen',
      showQuestionA11yLabel: 'Frage anzeigen',
      showAnswerA11yLabel: 'Antwort anzeigen',
    },
    sessionSummary: {
      title: 'Sitzung abgeschlossen',
      successRateA11yLabel: 'Erfolgsquote {rate}',
      reviewedCount: 'Wiederholt {count}',
      studyAgainLabel: 'Ganzen Stapel erneut lernen',
      studyAgainButtonA11yLabel: 'Ganzen Stapel erneut lernen',
    },
    reviewSummary: {
      title: 'Durchsicht abgeschlossen',
      stillToFix: 'Noch {count} zu korrigieren',
      allFixed: 'Alles korrigiert',
    },
    summaryAction: {
      reviewLabel: 'Falsche oder unsichere Karten durchgehen',
      reviewButtonA11yLabel: {
        one: '{count} falsche oder unsichere Karte durchgehen',
        other: '{count} falsche oder unsichere Karten durchgehen',
      },
      backLabel: 'Zurück zu den Sitzungen',
      backButtonA11yLabel: 'Zurück zu den Sitzungen',
    },
  },
  categories: {
    categoriesScreen: {
      customSectionTitle: 'Eigene Kategorien',
      customSectionSubtitle: {
        one: '{count} verfügbar',
        other: '{count} verfügbar',
      },
      customEmptyHint: 'Eigene Kategorien erscheinen hier.',
      defaultSectionTitle: 'Standardkategorien',
      defaultSectionSubtitle: {
        one: '{count} integriert',
        other: '{count} integriert',
      },
      newCategoryButton: 'Neue Kategorie',
      categoryTileA11yLabel: 'Optionen für {name}',
    },
    categoryOptionsMenu: {
      deleteItem: 'Kategorie löschen',
    },
    deleteCategoryAlert: {
      title: 'Kategorie löschen?',
      message: '„{name}“ wird gelöscht.',
      messageWithDecks: {
        one: '„{name}“ wird gelöscht. {count} Stapel hat dann keine Kategorie.',
        other: '„{name}“ wird gelöscht. {count} Stapel haben dann keine Kategorie.',
      },
    },
    newCategoryScreen: {
      saveButtonA11yLabel: 'Kategorie speichern',
      nameField: 'Name',
      colourLabel: 'Farbe',
      iconLabel: 'Symbol',
      nameCounter: '{length}/{max}',
      nameErrors: {
        empty: 'Einen Namen eingeben.',
        tooLong: {
          one: 'Höchstens {count} Zeichen verwenden.',
          other: 'Höchstens {count} Zeichen verwenden.',
        },
        duplicate: 'Eine Kategorie mit diesem Namen existiert bereits.',
      },
    },
    discardChangesAlert: {
      title: 'Änderungen verwerfen?',
      message: 'Diese Kategorie wurde nicht gespeichert.',
    },
    tilePreview: {
      placeholder: 'Kategoriename',
      a11yLabel: 'Vorschau: {name}',
      noNameA11yLabel: 'Vorschau: noch kein Name',
    },
    colourPicker: {
      a11yLabel: 'Farbauswahl',
      swatchA11yLabel: 'Farbe {position} von {total}',
    },
    customColourSwatch: {
      a11yLabel: 'Eigene Farbe',
      a11yHint: 'Öffnet den Farbwähler',
    },
    iconPicker: {
      a11yLabel: 'Symbolauswahl',
    },
    customColourDialog: {
      title: 'Eigene Farbe',
      hueLabel: 'Farbton',
      hueValue: '{value}°',
      saturationLabel: 'Sättigung',
      brightnessLabel: 'Helligkeit',
      percentValue: '{value} %',
      previewA11yLabel: 'Farbvorschau {color}',
      tooDark: 'Zu dunkel für das Symbol. Eine hellere Farbe versuchen.',
      useButton: 'Farbe verwenden',
    },
    categorySquare: {
      a11yLabel: 'Kategorie: {name}',
    },
  },
  stats: {
    statsScreen: {
      searchA11yLabel: 'Stapel durchsuchen',
      searchPlaceholder: 'Stapel suchen',
      aggregatedHeading: 'Zusammengefasste Statistik',
      decksTile: {
        label: 'Stapel',
        caption: 'In der Bibliothek',
      },
      totalCardsTile: {
        label: 'Karten gesamt',
        caption: 'In allen Stapeln',
      },
      totalReviewsTile: {
        label: 'Wiederholungen gesamt',
        caption: {
          all: 'Erfasste Antworten',
          month: 'Antworten in diesem Monat',
          week: 'Antworten in den letzten 7 Tagen',
        },
      },
      sessionsTile: {
        label: 'Sitzungen',
        caption: '{count} aktiv',
      },
      tileA11yLabel: '{label}: {value}, {caption}',
      decksBreakdownHeading: 'Stapelübersicht',
      deckCount: {
        one: '{count} Stapel',
        other: '{count} Stapel',
      },
      emptyState: {
        title: 'Noch keine Statistik',
        message: 'Einen Stapel importieren und lernen; die Ergebnisse erscheinen hier.',
      },
    },
    masteryRing: {
      summaryA11yLabel: 'Erfolgsquote {rate}. {shares}. Anzahl: {counts}',
      caption: 'Erfolgsquote',
    },
    deckStatsCard: {
      summaryA11yLabel: '{name}: {shares}, {cards}, {sessions}, {reviews}, zuletzt {last}',
      openA11yHint: 'Öffnet Details zu den einzelnen Karten',
      cardsLabel: 'Karten',
      sessionsLabel: 'Sitzungen',
      reviewsLabel: 'Wiederholungen',
      lastLabel: 'Zuletzt',
    },
    timeframeChips: {
      groupA11yLabel: 'Zeitraum',
    },
  },
  deckStats: {
    deckStatsScreen: {
      optionsA11yLabel: 'Optionen für die Statistik von {deckName}',
      resetStatisticsMenuItem: 'Statistik zurücksetzen',
      resetAlert: {
        title: 'Statistik zurücksetzen',
        message: 'Alle erfassten Ergebnisse und Sitzungen für „{deckName}“ löschen?',
      },
      notFound: {
        title: 'Stapel nicht gefunden',
        message: 'Dieser Stapel wurde gelöscht.',
      },
      cardPerformanceTitle: 'Kartenleistung',
      subtitle: {
        one: '{count} Karte · {sort}',
        other: '{count} Karten · {sort}',
      },
      subtitleNarrowed: {
        one: '{shown} von {count} Karten · {sort}',
        other: '{shown} von {count} Karten · {sort}',
      },
      sortButtonA11yLabel: 'Karten sortieren: {sort}',
      sortSheetTitle: 'Karten sortieren',
      noCards: {
        title: 'Noch keine Karten',
        message: 'Dem Stapel Karten hinzufügen, um zu sehen, wie jede einzelne abschneidet.',
      },
      statusEmpty: {
        needsReview: {
          title: 'Keine Karten zu wiederholen',
          message: 'Keine Karte liegt unter 40 % Erfolg.',
        },
        learning: {
          title: 'Keine Karten in der Lernphase',
          message: 'Keine Karte liegt zwischen 40 % und 70 % Erfolg.',
        },
        mastered: {
          title: 'Noch keine gemeisterten Karten',
          message: 'Eine Karte gilt ab 70 % Erfolg als gemeistert.',
        },
        new: {
          title: 'Keine neuen Karten',
          message: 'Jede Karte wurde mindestens einmal wiederholt.',
        },
      },
      showAllCardsButton: 'Alle Karten anzeigen',
      noMatches: {
        filteredMessage: 'Keine Treffer für „{query}“ mit dem Filter {status}.',
      },
    },
    deckIdentityRow: {
      categoryA11yLabel: 'Kategorie: {name}',
    },
    deckMasteryCard: {
      successRateA11yLabel: 'Erfolgsquote: {rate}',
      successRateNoReviewsA11yLabel: 'Erfolgsquote: noch keine Wiederholungen',
      successRateCaption: 'Erfolgsquote',
      answerTile: {
        ok: '{count} ok, {percent}',
        okeish: '{count} geht so, {percent}',
        notOk: '{count} nicht ok, {percent}',
      },
      answerTileNoReviews: {
        ok: '{count} ok, noch keine Wiederholungen',
        okeish: '{count} geht so, noch keine Wiederholungen',
        notOk: '{count} nicht ok, noch keine Wiederholungen',
      },
      reviewsFigure: 'Wiederholungen',
      sessionsFigure: 'Sitzungen',
      lastSessionFigure: 'Letzte Sitzung',
      figureA11yLabel: '{label}: {value}',
      changeChip: {
        none: 'Keine Änderung seit der letzten Sitzung',
        up: '+{points} Pkt. seit der letzten Sitzung',
        down: '-{points} Pkt. seit der letzten Sitzung',
        noneA11yLabel: 'Erfolgsquote seit der letzten Sitzung unverändert',
        upA11yLabel: {
          one: 'Erfolgsquote seit der letzten Sitzung um {count} Punkt gestiegen',
          other: 'Erfolgsquote seit der letzten Sitzung um {count} Punkte gestiegen',
        },
        downA11yLabel: {
          one: 'Erfolgsquote seit der letzten Sitzung um {count} Punkt gesunken',
          other: 'Erfolgsquote seit der letzten Sitzung um {count} Punkte gesunken',
        },
      },
    },
    cardStatsRow: {
      footerNeverReviewed: 'Nie wiederholt',
      footerReviewed: {
        one: '{count} Wiederholung · Wiederholt am {date}',
        other: '{count} Wiederholungen · Wiederholt am {date}',
      },
      neverReviewedA11yLabel: 'Frage: {question}. Antwort: {answer}. {status}. Nie wiederholt.',
      reviewedA11yLabel: {
        one: 'Frage: {question}. Antwort: {answer}. {status}, Erfolgsquote {rate}. {count} Wiederholung: {ok} ok, {okeish} geht so, {notOk} nicht ok.',
        other:
          'Frage: {question}. Antwort: {answer}. {status}, Erfolgsquote {rate}. {count} Wiederholungen: {ok} ok, {okeish} geht so, {notOk} nicht ok.',
      },
      reviewedOnA11yLabel: {
        one: 'Frage: {question}. Antwort: {answer}. {status}, Erfolgsquote {rate}. {count} Wiederholung: {ok} ok, {okeish} geht so, {notOk} nicht ok. Wiederholt am {date}.',
        other:
          'Frage: {question}. Antwort: {answer}. {status}, Erfolgsquote {rate}. {count} Wiederholungen: {ok} ok, {okeish} geht so, {notOk} nicht ok. Wiederholt am {date}.',
      },
    },
    cardStatusChips: {
      groupA11yLabel: 'Kartenstatus',
      allChip: 'Alle',
      chipLabel: '{label} ({count})',
      chipA11yLabel: {
        one: '{label}, {count} Karte',
        other: '{label}, {count} Karten',
      },
    },
    cardSearchField: {
      searchA11yLabel: 'Karten durchsuchen',
      searchPlaceholder: 'Fragen und Antworten durchsuchen',
      clearA11yLabel: 'Kartensuche leeren',
    },
    sessionHistoryChart: {
      title: 'Sitzungsverlauf',
      subtitleLatest: 'Letzte {shown} von {total}',
      empty: {
        title: 'Keine Sitzungen für diesen Stapel',
        message: 'Auf dem Tab „Stapel“ eine starten, dann erscheinen die Ergebnisse hier.',
      },
      unansweredLegend: 'Unbeantwortet',
      legendNote: '% der Karten jeder Sitzung',
      sessionA11yLabel: {
        one: 'Sitzung am {date}: Erfolgsquote {rate}, {answered} von {count} Karte beantwortet \u2013 {ok} ok, {okeish} geht so, {notOk} nicht ok',
        other:
          'Sitzung am {date}: Erfolgsquote {rate}, {answered} von {count} Karten beantwortet \u2013 {ok} ok, {okeish} geht so, {notOk} nicht ok',
      },
      sessionNoAnswersA11yLabel: {
        one: 'Sitzung am {date}: Erfolgsquote noch keine Antworten, {answered} von {count} Karte beantwortet \u2013 {ok} ok, {okeish} geht so, {notOk} nicht ok',
        other:
          'Sitzung am {date}: Erfolgsquote noch keine Antworten, {answered} von {count} Karten beantwortet \u2013 {ok} ok, {okeish} geht so, {notOk} nicht ok',
      },
    },
  },
};

export const de: Language = { code: 'de', plural: dePlural, messages };
