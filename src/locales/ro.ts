import type { Language, PluralRule } from '../utils/i18n';

// CLDR: one for 1; few for 0 and for 2..19 modulo 100; other otherwise (20, 100, 120...).
export const roPlural: PluralRule = count => {
  if (count === 1) {
    return 'one';
  }
  const lastTwoDigits = count % 100;
  return count === 0 || (lastTwoDigits >= 1 && lastTwoDigits <= 19)
    ? 'few'
    : 'other';
};

export const ro: Language = {
  code: 'ro',
  plural: roPlural,
  messages: {
    common: {
      actions: {
        back: 'Înapoi',
        cancel: 'Anulează',
        clear: 'Elimină',
        close: 'Închide',
        delete: 'Șterge',
        discard: 'Renunță',
        export: 'Exportă',
        keepEditing: 'Continuă editarea',
        ok: 'OK',
        reset: 'Resetează',
        save: 'Salvează',
        start: 'Începe',
      },
      search: {
        noMatchesTitle: 'Niciun rezultat',
        noMatchesMessage: 'Nimic nu se potrivește cu "{query}".',
        clearSearchButton: 'Șterge căutarea',
      },
      counts: {
        cards: {
          one: '{count} card',
          few: '{count} carduri',
          other: '{count} de carduri',
        },
        sessions: {
          one: '{count} sesiune',
          few: '{count} sesiuni',
          other: '{count} de sesiuni',
        },
        reviews: {
          one: '{count} recapitulare',
          few: '{count} recapitulări',
          other: '{count} de recapitulări',
        },
      },
    },
    navigation: {
      tabs: {
        decks: 'Pachete',
        learn: 'Învățare',
        categories: 'Categorii',
        statistics: 'Statistici',
      },
      headers: {
        decksList: 'Pachete',
        editDeck: 'Editează pachetul',
        newDeck: 'Pachet nou',
        learnList: 'Învățare',
        study: 'Sesiune',
        categoriesList: 'Categorii',
        newCategory: 'Categorie nouă',
        statsOverview: 'Statistici',
        deckStats: 'Statisticile pachetului',
      },
    },
    answers: {
      answerLabels: {
        ok: 'Corect',
        okeish: 'Așa-așa',
        notOk: 'Greșit',
      },
      shares: {
        notReviewed: 'Încă nerecapitulat',
        summary: '{ok} corect, {okeish} așa-așa, {notOk} greșit',
      },
      cardStatus: {
        needsReview: 'De recapitulat',
        learning: 'În învățare',
        mastered: 'Stăpânit',
        new: 'Nou',
      },
      timeframes: {
        all: 'Tot timpul',
        month: 'Luna aceasta',
        week: 'Ultimele 7 zile',
      },
      sortOrders: {
        hardest: 'Cele mai grele primele',
        deck: 'Ordinea din pachet',
        recent: 'Recapitulate recent',
      },
      dates: {
        never: 'Niciodată',
      },
    },
    importExport: {
      defaultDeckName: 'Pachet importat',
      importErrors: {
        emptyFile: 'Fișierul selectat este gol.',
        notADeck:
          'Acesta nu este un fișier de pachet Easy Flashcards. Alege un fișier JSON exportat din aplicație.',
        newerVersion:
          'Acest fișier de pachet a fost creat de o versiune mai nouă a Easy Flashcards. Actualizează aplicația pentru a-l importa.',
        noCards:
          'Nu s-a găsit niciun card utilizabil. Fiecare card are nevoie de o întrebare și de un răspuns.',
        noHeader:
          'Nu s-a găsit niciun rând de antet. Prima linie care nu este goală și nu este un comentariu cu "#" trebuie să conțină o coloană "question" și una "answer", separate prin virgulă, punct și virgulă, tab sau un alt simbol.',
        noUsableRows:
          'Nu s-a găsit niciun rând utilizabil. Fiecare rând are nevoie de o întrebare și de un răspuns.',
        unreadable: 'Fișierul selectat nu a putut fi citit.',
      },
      importAlert: {
        successTitle: 'Pachet importat',
        successMessage: {
          one: '"{name}" are acum {count} card.',
          few: '"{name}" are acum {count} carduri.',
          other: '"{name}" are acum {count} de carduri.',
        },
        skippedRows: {
          one: '{count} rând incomplet a fost omis.',
          few: '{count} rânduri incomplete au fost omise.',
          other: '{count} de rânduri incomplete au fost omise.',
        },
        skippedCards: {
          one: '{count} card incomplet a fost omis.',
          few: '{count} carduri incomplete au fost omise.',
          other: '{count} de carduri incomplete au fost omise.',
        },
        failedTitle: 'Importul a eșuat',
        failedWithDetails: 'Fișierul nu a putut fi importat: {details}',
        failedUnknown: 'Eroare necunoscută la importul fișierului.',
      },
      exportAlert: {
        successTitle: 'Pachet exportat',
        savedAs: 'Salvat ca {name}.',
        saved: 'Pachetul a fost salvat.',
        failedTitle: 'Exportul a eșuat',
        deckGone: 'Acest pachet nu mai există.',
        failedFallback: 'Pachetul nu a putut fi exportat.',
      },
      separators: {
        comma: 'Virgulă (,)',
        semicolon: 'Punct și virgulă (;)',
        tab: 'Tab',
      },
      sampleExport: {
        successTitle: 'Pachet de exemplu exportat',
        partlyTitle: 'Pachet de exemplu exportat parțial',
        failedTitle: 'Exportul a eșuat',
        savedAsOne: 'Salvat ca {name}.',
        savedAsTwo: 'Salvat ca {first} și {second}.',
        fileFailed: 'Fișierul {format} nu a putut fi salvat: {details}',
        fileNotSaved: 'Fișierul {format} nu a fost salvat.',
        unknownError: 'Eroare necunoscută',
      },
    },
    categoryNames: {
      builtIn: {
        astronomy: 'Astronomie',
        biology: 'Biologie',
        botany: 'Botanică',
        chemistry: 'Chimie',
        cinema: 'Cinema',
        computer_science: 'Informatică',
        economics: 'Economie',
        gastronomy: 'Gastronomie',
        geography: 'Geografie',
        history: 'Istorie',
        languages: 'Limbi străine',
        law: 'Drept',
        literature: 'Literatură',
        mathematics: 'Matematică',
        medicine: 'Medicină',
        music: 'Muzică',
        philosophy: 'Filosofie',
        physics: 'Fizică',
        religion: 'Religie',
        sport: 'Sport',
        zoology: 'Zoologie',
      },
      icons: {
        plane_contrails: 'Avion',
        anchor: 'Ancoră',
        nutrition: 'Măr',
        emergency: 'Asterisc',
        microbiology: 'Bacterie',
        finance: 'Grafic cu bare',
        sports_basketball: 'Minge de baschet',
        neurology: 'Creier',
        bug_report: 'Insectă',
        calendar_month: 'Calendar',
        photo_camera: 'Aparat foto',
        camera: 'Diafragmă',
        cannabis: 'Frunză de cannabis',
        directions_car: 'Mașină',
        chess_pawn: 'Pion de șah',
        language_chinese_dayi: 'Litere chinezești și latine',
        location_city: 'Oraș',
        circle_circle: 'Cercuri concentrice',
        restaurant: 'Tacâmuri',
        database: 'Bază de date',
        nest_heat_link_e: 'Punct într-un cerc',
        engineering: 'Inginer',
        face: 'Față',
        face_3: 'Față cu păr',
        theaters: 'Peliculă de film',
        flag_2: 'Steag',
        science: 'Balon de laborator',
        save: 'Dischetă',
        sports_and_outdoors: 'Minge de fotbal',
        skillet: 'Tigaie',
        sports_esports: 'Controler de jocuri',
        language: 'Glob pământesc',
        diversity_3: 'Grup de oameni',
        psychology: 'Cap cu angrenaj',
        headphones: 'Căști',
        health_and_safety: 'Scut de sănătate',
        landscape_2: 'Dealuri',
        hive: 'Fagure',
        hourglass_empty: 'Clepsidră',
        house: 'Casă',
        icecream: 'Înghețată',
        temp_preferences_eco: 'Frunze',
        electric_bolt: 'Fulger',
        wand_stars: 'Baghetă magică',
        biotech: 'Microscop',
        mindfulness: 'Mindfulness',
        motorcycle: 'Motocicletă',
        music_note_2: 'Notă muzicală',
        network_node: 'Rețea',
        import_contacts: 'Carte deschisă',
        pan_tool: 'Mână deschisă',
        pets: 'Lăbuță',
        stylus: 'Creion',
        person: 'Persoană',
        history_edu: 'Pană și hârtie',
        radio: 'Radio',
        raven: 'Corb',
        rib_cage: 'Cutie toracică',
        rocket_launch: 'Rachetă',
        scatter_plot: 'Grafic de dispersie',
        category: 'Forme',
        interests: 'Forme și inimă',
        shopping_cart: 'Coș de cumpărături',
        functions: 'Sigma',
        skull: 'Craniu',
        emoji_language: 'Zâmbet și glob',
        snowflake: 'Fulg de nea',
        hotel_class: 'Stea',
        mountain_flag: 'Steag pe vârf',
        sunny: 'Soare',
        mixture_med: 'Seringă și pastilă',
        temple_buddhist: 'Templu',
        text_snippet: 'Document text',
        theater_comedy: 'Măști de teatru',
        nest_thermostat_gen_3: 'Termostat',
        translate: 'Traducere',
        nature: 'Copac',
        fertile: 'Lalea',
        videocam: 'Cameră video',
        coronavirus: 'Virus',
        volcano: 'Vulcan',
        warning: 'Avertisment',
        water: 'Valuri',
        air: 'Vânt',
        build: 'Cheie fixă',
      },
    },
    shell: {
      appMenu: {
        triggerA11yLabel: 'Meniul aplicației',
        exportSampleDeckItem: 'Exportă pachetul de exemplu',
        settingsItem: 'Setări',
      },
      exportSampleDeckDialog: {
        title: 'Exportă pachetul de exemplu',
        body: 'Aceasta salvează același pachet de exemplu în două fișiere, CSV și JSON. Ți se cere unde să salvezi fiecare și poți anula oricare dintre ele pentru a-l omite.\n\nCSV: liniile care încep cu # (titlu, descriere, categorie) sunt ignorate la import, apoi urmează un antet "question" / "answer" și câte un card pe fiecare rând, cu coloanele separate aici prin punct și virgulă (merge și o virgulă, un tab sau un alt simbol).\n\nJSON: restabilește și titlul, descrierea și categoria.\n\nHTML de bază, cum ar fi <b>, <i> și <br />, este permis pe oricare dintre fețele unui card.',
      },
      kebabMenu: {
        triggerA11yLabel: 'Mai multe opțiuni',
      },
      searchBar: {
        inputA11yLabel: 'Text de căutare',
        closeButtonA11yLabel: 'Închide căutarea',
      },
    },
    settings: {
      settingsScreen: {
        title: 'Setări',
        generalSection: 'General',
        appSection: 'Aplicație',
        communitySection: 'Comunitate și asistență',
        legalSection: 'Informații legale',
        changeLanguageItem: 'Schimbă limba',
        shareAppItem: 'Distribuie aplicația',
        shareMessage:
          'Încearcă Easy Flashcards, o aplicație pentru studiul pachetelor de cartonașe: {url}',
        rateAppItem: 'Evaluează aplicația',
        customerSupportItem: 'Asistență clienți',
        aboutItem: 'Despre',
        buyCoffeeItem: 'Cumpără-mi o cafea',
        privacyPolicyItem: 'Politica de confidențialitate',
        termsItem: 'Termeni',
      },
      languageDialog: {
        title: 'Schimbă limba',
        systemDefaultOption: 'Limba sistemului',
      },
      aboutAlert: {
        title: 'Despre',
        message: '{name}, versiunea {version}',
      },
      linkFailedAlert: {
        title: 'Linkul nu a putut fi deschis',
        message: 'Nicio aplicație de pe acest dispozitiv nu l-a putut deschide.',
      },
      emailFailedAlert: {
        title: 'Nicio aplicație de e-mail',
        message: 'Pentru a contacta asistența clienți, scrie la {email}.',
      },
      coffeeThanksAlert: {
        title: 'Mulțumesc!',
        message: 'Cafeaua ta este pe drum către dezvoltator. Mulțumesc pentru sprijin.',
      },
      coffeeUnavailableAlert: {
        title: 'Cumpără-mi o cafea',
        message: 'Cumpărarea unei cafele nu este disponibilă acum. Încearcă din nou mai târziu.',
      },
    },
    decks: {
      decksScreen: {
        searchA11yLabel: 'Caută pachete',
        searchPlaceholder: 'Caută pachete',
        loadError: 'Pachetele salvate nu au putut fi citite.',
        addDeckA11yLabel: 'Adaugă un pachet',
        emptyTitle: 'Niciun pachet încă',
        emptyMessage:
          'Folosește butonul + pentru a importa un fișier de pachet și a crea primul tău pachet.',
      },
      emptyDeckAlert: {
        title: 'Pachet gol',
        message: 'Acest pachet nu are carduri de învățat.',
      },
      deleteDeckAlert: {
        title: 'Șterge pachetul',
        message:
          'Ștergi pachetul "{name}", sesiunile lui și toate statisticile lui?',
      },
      addDeckMenu: {
        title: 'Adaugă un pachet',
        importItem: 'Importă pachet din fișier',
        manualItem: 'Adaugă pachet manual',
      },
      deckOptionsMenu: {
        startWithOptionsItem: 'Începe sesiunea cu opțiuni',
        editItem: 'Editează pachetul',
        exportItem: 'Exportă în fișier',
        deleteItem: 'Șterge pachetul',
      },
      exportFormatMenu: {
        title: 'Exportă pachetul în fișier',
      },
      csvSeparatorMenu: {
        title: 'Separator CSV',
        customItem: 'Personalizat…',
      },
      deckCard: {
        optionsA11yLabel: 'Opțiuni pentru {name}',
        activeCount: 'Active: {count}',
        lastSession: 'Ultima: {date}',
        startA11yLabel: 'Începe sesiunea pentru {name}',
      },
      masteryBar: {
        a11yLabel: 'Stăpânire: {summary}',
      },
      sessionSetupDialog: {
        title: 'Începe sesiunea',
        invertedLabel: 'Inversat',
        invertedDescription:
          'Afișează mai întâi răspunsul, iar întrebarea pe verso.',
        shuffleLabel: 'Amestecă',
        shuffleDescription: 'Studiază cardurile în ordine aleatorie.',
      },
      customSeparatorDialog: {
        title: 'Separator personalizat',
        separatorLabel: 'Separator',
        separatorPlaceholder: 'De exemplu |',
        errors: {
          empty: 'Introdu un caracter.',
          tooLong: 'Folosește un singur caracter.',
          reserved:
            'Ghilimelele, # și întreruperile de rând nu pot fi folosite.',
          whitespace:
            'Spațiile nu sunt permise. Folosește opțiunea Tab pentru un tab.',
          alphanumeric: 'Literele și cifrele nu sunt permise.',
        },
      },
    },
    editDeck: {
      deckNotFound: {
        title: 'Pachet negăsit',
        message: 'Acest pachet nu mai există.',
        backButton: 'Înapoi la pachete',
      },
      editDeckScreen: {
        titleLabel: 'Titlu',
        descriptionLabel: 'Descriere',
        descriptionPlaceholder: 'Opțional',
        saveButtonA11yLabel: 'Salvează pachetul',
        addCardButton: 'Adaugă card',
      },
      titleNeededAlert: {
        title: 'Titlu necesar',
        message: 'Dă un titlu pachetului.',
      },
      cardIncompleteAlert: {
        title: 'Card incomplet',
        message:
          'Cardul {number} are nevoie atât de o întrebare, cât și de un răspuns.',
      },
      removeCardsAlert: {
        title: 'Elimini cardurile?',
        message: {
          one: '{count} card va fi eliminat din pachet, împreună cu statisticile lui.',
          few: '{count} carduri vor fi eliminate din pachet, împreună cu statisticile lor.',
          other:
            '{count} de carduri vor fi eliminate din pachet, împreună cu statisticile lor.',
        },
      },
      discardChangesAlert: {
        title: 'Renunți la modificări?',
        messageEdit: 'Modificările aduse acestui pachet nu au fost salvate.',
        messageNew: 'Acest pachet nu a fost salvat.',
      },
      cardEditor: {
        title: 'Card {number}',
        removeButtonA11yLabel: 'Elimină cardul {number}',
        questionLabel: 'Întrebare',
        questionA11yLabel: 'Întrebare pentru cardul {number}',
        answerLabel: 'Răspuns',
        answerA11yLabel: 'Răspuns pentru cardul {number}',
      },
      categoryField: {
        label: 'Categorie',
        a11yLabel: 'Categorie: {name}',
        a11yLabelNone: 'Categorie: niciuna',
        a11yHint: 'Deschide selectorul de categorii',
        noneValue: 'Fără categorie',
      },
      categoryPicker: {
        title: 'Categorie',
        groupA11yLabel: 'Selector de categorii',
        noneTile: 'Fără categorie',
      },
    },
    learn: {
      learnScreen: {
        searchA11yLabel: 'Caută sesiuni',
        searchPlaceholder: 'Caută sesiuni',
      },
      headerToolbar: {
        clearCompletedItem: 'Elimină sesiunile finalizate',
      },
      emptyState: {
        noSessionsTitle: 'Nicio sesiune încă',
        noSessionsMessage:
          'Alege un pachet și începe o sesiune de învățare; va apărea aici până când o termini.',
        allClearedTitle: 'Nicio sesiune de afișat',
        allClearedMessage:
          'Sesiunile eliminate rămân incluse în Statistici. Începe o sesiune nouă dintr-un pachet pentru a o vedea aici.',
        goToDecksButton: 'Mergi la pachete',
      },
      deckUnavailableAlert: {
        title: 'Pachet indisponibil',
        message: 'Acest pachet nu mai există sau nu are carduri.',
      },
      clearCompletedSessionsAlert: {
        title: 'Elimină sesiunile finalizate',
        nothingToClear: 'Nu există sesiuni finalizate de eliminat.',
        message: {
          one: 'Elimini {count} sesiune finalizată din această listă? Rezultatele rămân în Statistici.',
          few: 'Elimini {count} sesiuni finalizate din această listă? Rezultatele rămân în Statistici.',
          other:
            'Elimini {count} de sesiuni finalizate din această listă? Rezultatele rămân în Statistici.',
        },
      },
      discardSessionAlert: {
        title: 'Renunță la sesiune',
        message:
          'Renunți la sesiunea nefinalizată pentru "{deckName}"? Răspunsurile ei sunt eliminate și din Statistici.',
      },
      clearSessionAlert: {
        title: 'Elimină sesiunea',
        message:
          'Elimini sesiunea finalizată pentru "{deckName}" din această listă? Rezultatele ei rămân în Statistici.',
      },
      sessionOptionsMenu: {
        discardItem: 'Renunță la sesiune',
        clearItem: 'Elimină sesiunea',
      },
      sessionCard: {
        inProgressStatus: {
          one: 'În curs \u2014 {answered}/{count} card',
          few: 'În curs \u2014 {answered}/{count} carduri',
          other: 'În curs \u2014 {answered}/{count} de carduri',
        },
        completedStatus: {
          one: 'Finalizată \u2014 {count} card',
          few: 'Finalizată \u2014 {count} carduri',
          other: 'Finalizată \u2014 {count} de carduri',
        },
        invertedPill: 'Inversat',
        invertedPillA11yLabel: 'Sesiune inversată',
        optionsA11yLabel: 'Opțiuni pentru sesiunea {deckName}',
        started: 'Începută {date}',
        resumeButtonA11yLabel: 'Continuă sesiunea pentru {deckName}',
        replayButtonA11yLabel: 'Repetă sesiunea pentru {deckName}',
        reviewErrorsButtonA11yLabel: {
          one: 'Recapitulează {count} card greșit sau nesigur pentru {deckName}',
          few: 'Recapitulează {count} carduri greșite sau nesigure pentru {deckName}',
          other:
            'Recapitulează {count} de carduri greșite sau nesigure pentru {deckName}',
        },
        reviewErrorsDoneA11yLabel:
          'Toate cardurile greșite sau nesigure au fost rezolvate pentru {deckName}',
      },
      sessionResultsBar: {
        progressA11yLabel:
          'Progres: {answered} din {cardCount} cu răspuns \u2014 {ok} corect, {okeish} așa-așa, {notOk} greșit',
      },
    },
    study: {
      studyScreen: {
        fallbackTitle: 'Sesiune',
        unavailableTitle: 'Nimic de studiat',
        unavailableMessage: 'Această sesiune nu mai este disponibilă.',
        unavailableAction: 'Înapoi la sesiuni',
      },
      progressHeader: {
        position: 'Cardul {current} din {total}',
        okCount: 'Corect {count}',
      },
      invertedPill: {
        text: 'Inversat',
        a11yLabel: 'Sesiune inversată: fața afișează răspunsul',
      },
      swipeHint: {
        reviewing:
          'Revezi un card la care ai răspuns \u2014 glisează spre stânga pentru a reveni unde ai rămas',
      },
      historyStrip: {
        a11yLabel: 'Răspunsuri până acum',
      },
      flipCard: {
        questionLabel: 'ÎNTREBARE',
        answerLabel: 'RĂSPUNS',
        revealHint: 'Atinge pentru a vedea răspunsul',
        backHint: 'Atinge pentru a vedea din nou întrebarea',
        showQuestionA11yLabel: 'Arată întrebarea',
        showAnswerA11yLabel: 'Arată răspunsul',
      },
      sessionSummary: {
        title: 'Sesiune finalizată',
        successRateA11yLabel: 'Rata de succes {rate}',
        reviewedCount: 'Recapitulate {count}',
        studyAgainLabel: 'Studiază din nou tot pachetul',
        studyAgainButtonA11yLabel: 'Studiază din nou tot pachetul',
      },
      reviewSummary: {
        title: 'Recapitulare finalizată',
        stillToFix: '{count} de corectat',
        allFixed: 'Toate corectate',
      },
      summaryAction: {
        reviewLabel: 'Recapitulează cardurile greșite sau nesigure',
        reviewButtonA11yLabel: {
          one: 'Recapitulează {count} card greșit sau nesigur',
          few: 'Recapitulează {count} carduri greșite sau nesigure',
          other: 'Recapitulează {count} de carduri greșite sau nesigure',
        },
        backLabel: 'Înapoi la sesiuni',
        backButtonA11yLabel: 'Înapoi la sesiuni',
      },
    },
    categories: {
      categoriesScreen: {
        customSectionTitle: 'Categorii personalizate',
        customSectionSubtitle: {
          one: '{count} disponibilă',
          few: '{count} disponibile',
          other: '{count} de disponibile',
        },
        customEmptyHint: 'Categoriile tale vor apărea aici.',
        defaultSectionTitle: 'Categorii predefinite',
        defaultSectionSubtitle: {
          one: '{count} predefinită',
          few: '{count} predefinite',
          other: '{count} de predefinite',
        },
        newCategoryButton: 'Categorie nouă',
        categoryTileA11yLabel: 'Opțiuni pentru {name}',
      },
      categoryOptionsMenu: {
        deleteItem: 'Șterge categoria',
      },
      deleteCategoryAlert: {
        title: 'Ștergi categoria?',
        message: '"{name}" va fi ștearsă.',
        messageWithDecks: {
          one: '"{name}" va fi ștearsă. {count} pachet va rămâne fără categorie.',
          few: '"{name}" va fi ștearsă. {count} pachete vor rămâne fără categorie.',
          other:
            '"{name}" va fi ștearsă. {count} de pachete vor rămâne fără categorie.',
        },
      },
      newCategoryScreen: {
        saveButtonA11yLabel: 'Salvează categoria',
        nameField: 'Nume',
        colourLabel: 'Culoare',
        iconLabel: 'Pictogramă',
        nameCounter: '{length}/{max}',
        nameErrors: {
          empty: 'Introdu un nume.',
          tooLong: {
            one: 'Folosește cel mult {count} caracter.',
            few: 'Folosește cel mult {count} caractere.',
            other: 'Folosește cel mult {count} de caractere.',
          },
          duplicate: 'Există deja o categorie cu acest nume.',
        },
      },
      discardChangesAlert: {
        title: 'Renunți la modificări?',
        message: 'Această categorie nu a fost salvată.',
      },
      tilePreview: {
        placeholder: 'Numele categoriei',
        a11yLabel: 'Previzualizare: {name}',
        noNameA11yLabel: 'Previzualizare: încă fără nume',
      },
      colourPicker: {
        a11yLabel: 'Selector de culori',
        swatchA11yLabel: 'Culoarea {position} din {total}',
      },
      customColourSwatch: {
        a11yLabel: 'Culoare personalizată',
        a11yHint: 'Deschide selectorul de culori',
      },
      iconPicker: {
        a11yLabel: 'Selector de pictograme',
      },
      customColourDialog: {
        title: 'Culoare personalizată',
        hueLabel: 'Nuanță',
        hueValue: '{value}°',
        saturationLabel: 'Saturație',
        brightnessLabel: 'Luminozitate',
        percentValue: '{value}%',
        previewA11yLabel: 'Previzualizare culoare {color}',
        tooDark:
          'Prea închisă pentru pictogramă. Încearcă o culoare mai deschisă.',
        useButton: 'Folosește culoarea',
      },
      categorySquare: {
        a11yLabel: 'Categorie: {name}',
      },
    },
    stats: {
      statsScreen: {
        searchA11yLabel: 'Caută pachete',
        searchPlaceholder: 'Caută pachete',
        aggregatedHeading: 'Statistici agregate',
        decksTile: {
          label: 'Pachete',
          caption: 'În biblioteca ta',
        },
        totalCardsTile: {
          label: 'Total carduri',
          caption: 'În toate pachetele',
        },
        totalReviewsTile: {
          label: 'Total recapitulări',
          caption: {
            all: 'Răspunsuri înregistrate',
            month: 'Răspunsuri luna aceasta',
            week: 'Răspunsuri în ultimele 7 zile',
          },
        },
        sessionsTile: {
          label: 'Sesiuni',
          caption: 'Active: {count}',
        },
        tileA11yLabel: '{label}: {value}, {caption}',
        decksBreakdownHeading: 'Detalii pe pachete',
        deckCount: {
          one: '{count} pachet',
          few: '{count} pachete',
          other: '{count} de pachete',
        },
        emptyState: {
          title: 'Nicio statistică încă',
          message:
            'Importă un pachet și studiază-l; rezultatele vor apărea aici.',
        },
      },
      masteryRing: {
        summaryA11yLabel: 'Rata de succes {rate}. {shares}. Totaluri: {counts}',
        caption: 'Rata de succes',
      },
      deckStatsCard: {
        summaryA11yLabel:
          '{name}: {shares}, {cards}, {sessions}, {reviews}, ultima {last}',
        openA11yHint: 'Deschide detaliile pe carduri',
        cardsLabel: 'Carduri',
        sessionsLabel: 'Sesiuni',
        reviewsLabel: 'Recapitulări',
        lastLabel: 'Ultima',
      },
      timeframeChips: {
        groupA11yLabel: 'Interval de timp',
      },
    },
    deckStats: {
      deckStatsScreen: {
        optionsA11yLabel: 'Opțiuni pentru statisticile pachetului {deckName}',
        resetStatisticsMenuItem: 'Resetează statisticile',
        resetAlert: {
          title: 'Resetează statisticile',
          message:
            'Ștergi toate rezultatele și sesiunile înregistrate pentru "{deckName}"?',
        },
        notFound: {
          title: 'Pachet negăsit',
          message: 'Acest pachet a fost șters.',
        },
        cardPerformanceTitle: 'Performanța cardurilor',
        subtitle: {
          one: '{count} card · {sort}',
          few: '{count} carduri · {sort}',
          other: '{count} de carduri · {sort}',
        },
        subtitleNarrowed: {
          one: '{shown} din {count} card · {sort}',
          few: '{shown} din {count} carduri · {sort}',
          other: '{shown} din {count} de carduri · {sort}',
        },
        sortButtonA11yLabel: 'Sortează cardurile: {sort}',
        sortSheetTitle: 'Sortează cardurile',
        noCards: {
          title: 'Niciun card încă',
          message:
            'Adaugă carduri în acest pachet pentru a vedea cum se descurcă fiecare.',
        },
        statusEmpty: {
          needsReview: {
            title: 'Niciun card de recapitulat',
            message: 'Niciun card nu are sub 40% succes.',
          },
          learning: {
            title: 'Niciun card în învățare',
            message: 'Niciun card nu se află între 40% și 70% succes.',
          },
          mastered: {
            title: 'Niciun card stăpânit încă',
            message: 'Un card este stăpânit la 70% succes sau mai mult.',
          },
          new: {
            title: 'Niciun card nou',
            message: 'Fiecare card a fost recapitulat cel puțin o dată.',
          },
        },
        showAllCardsButton: 'Arată toate cardurile',
        noMatches: {
          filteredMessage:
            'Nimic nu se potrivește cu "{query}" pentru filtrul {status}.',
        },
      },
      deckIdentityRow: {
        categoryA11yLabel: 'Categorie: {name}',
      },
      deckMasteryCard: {
        successRateA11yLabel: 'Rata de succes: {rate}',
        successRateNoReviewsA11yLabel:
          'Rata de succes: încă nicio recapitulare',
        successRateCaption: 'Rata de succes',
        answerTile: {
          ok: '{count} corect, {percent}',
          okeish: '{count} așa-așa, {percent}',
          notOk: '{count} greșit, {percent}',
        },
        answerTileNoReviews: {
          ok: '{count} corect, încă nicio recapitulare',
          okeish: '{count} așa-așa, încă nicio recapitulare',
          notOk: '{count} greșit, încă nicio recapitulare',
        },
        reviewsFigure: 'Recapitulări',
        sessionsFigure: 'Sesiuni',
        lastSessionFigure: 'Ultima sesiune',
        figureA11yLabel: '{label}: {value}',
        changeChip: {
          none: 'Nicio schimbare de la ultima sesiune',
          up: '+{points} pct. de la ultima sesiune',
          down: '-{points} pct. de la ultima sesiune',
          noneA11yLabel:
            'Rata de succes este neschimbată față de ultima sesiune',
          upA11yLabel: {
            one: 'Rata de succes a crescut cu {count} punct față de ultima sesiune',
            few: 'Rata de succes a crescut cu {count} puncte față de ultima sesiune',
            other:
              'Rata de succes a crescut cu {count} de puncte față de ultima sesiune',
          },
          downA11yLabel: {
            one: 'Rata de succes a scăzut cu {count} punct față de ultima sesiune',
            few: 'Rata de succes a scăzut cu {count} puncte față de ultima sesiune',
            other:
              'Rata de succes a scăzut cu {count} de puncte față de ultima sesiune',
          },
        },
      },
      cardStatsRow: {
        footerNeverReviewed: 'Niciodată recapitulat',
        footerReviewed: {
          one: '{count} recapitulare · Recapitulat {date}',
          few: '{count} recapitulări · Recapitulat {date}',
          other: '{count} de recapitulări · Recapitulat {date}',
        },
        neverReviewedA11yLabel:
          'Întrebare: {question}. Răspuns: {answer}. {status}. Niciodată recapitulat.',
        reviewedA11yLabel: {
          one: 'Întrebare: {question}. Răspuns: {answer}. {status}, rata de succes {rate}. {count} recapitulare: {ok} corect, {okeish} așa-așa, {notOk} greșit.',
          few: 'Întrebare: {question}. Răspuns: {answer}. {status}, rata de succes {rate}. {count} recapitulări: {ok} corect, {okeish} așa-așa, {notOk} greșit.',
          other:
            'Întrebare: {question}. Răspuns: {answer}. {status}, rata de succes {rate}. {count} de recapitulări: {ok} corect, {okeish} așa-așa, {notOk} greșit.',
        },
        reviewedOnA11yLabel: {
          one: 'Întrebare: {question}. Răspuns: {answer}. {status}, rata de succes {rate}. {count} recapitulare: {ok} corect, {okeish} așa-așa, {notOk} greșit. Recapitulat {date}.',
          few: 'Întrebare: {question}. Răspuns: {answer}. {status}, rata de succes {rate}. {count} recapitulări: {ok} corect, {okeish} așa-așa, {notOk} greșit. Recapitulat {date}.',
          other:
            'Întrebare: {question}. Răspuns: {answer}. {status}, rata de succes {rate}. {count} de recapitulări: {ok} corect, {okeish} așa-așa, {notOk} greșit. Recapitulat {date}.',
        },
      },
      cardStatusChips: {
        groupA11yLabel: 'Starea cardului',
        allChip: 'Toate',
        chipLabel: '{label} ({count})',
        chipA11yLabel: {
          one: '{label}, {count} card',
          few: '{label}, {count} carduri',
          other: '{label}, {count} de carduri',
        },
      },
      cardSearchField: {
        searchA11yLabel: 'Caută carduri',
        searchPlaceholder: 'Caută în întrebări și răspunsuri',
        clearA11yLabel: 'Șterge căutarea de carduri',
      },
      sessionHistoryChart: {
        title: 'Istoricul sesiunilor',
        subtitleLatest: 'Ultimele {shown} din {total}',
        empty: {
          title: 'Nicio sesiune pentru acest pachet',
          message:
            'Începe una din fila Pachete și rezultatele ei vor apărea aici.',
        },
        unansweredLegend: 'Fără răspuns',
        legendNote: '% din cardurile fiecărei sesiuni',
        sessionA11yLabel: {
          one: 'Sesiune din {date}: rata de succes {rate}, {answered} din {count} card cu răspuns — {ok} corect, {okeish} așa-așa, {notOk} greșit',
          few: 'Sesiune din {date}: rata de succes {rate}, {answered} din {count} carduri cu răspuns — {ok} corect, {okeish} așa-așa, {notOk} greșit',
          other:
            'Sesiune din {date}: rata de succes {rate}, {answered} din {count} de carduri cu răspuns — {ok} corect, {okeish} așa-așa, {notOk} greșit',
        },
        sessionNoAnswersA11yLabel: {
          one: 'Sesiune din {date}: rata de succes încă fără răspunsuri, {answered} din {count} card cu răspuns — {ok} corect, {okeish} așa-așa, {notOk} greșit',
          few: 'Sesiune din {date}: rata de succes încă fără răspunsuri, {answered} din {count} carduri cu răspuns — {ok} corect, {okeish} așa-așa, {notOk} greșit',
          other:
            'Sesiune din {date}: rata de succes încă fără răspunsuri, {answered} din {count} de carduri cu răspuns — {ok} corect, {okeish} așa-așa, {notOk} greșit',
        },
      },
    },
  },
};
