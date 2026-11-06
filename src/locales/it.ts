import type { Language, PluralRule } from '../utils/i18n';

// CLDR also has `many` for exact multiples of 1,000,000; it is deliberately not implemented.
export const itPlural: PluralRule = count => (count === 1 ? 'one' : 'other');

export const it: Language = {
  code: 'it',
  plural: itPlural,
  messages: {
    common: {
      actions: {
        back: 'Indietro',
        cancel: 'Annulla',
        clear: 'Rimuovi',
        close: 'Chiudi',
        delete: 'Elimina',
        discard: 'Scarta',
        export: 'Esporta',
        keepEditing: 'Continua a modificare',
        ok: 'OK',
        reset: 'Azzera',
        save: 'Salva',
        start: 'Avvia',
      },
      search: {
        noMatchesTitle: 'Nessun risultato',
        noMatchesMessage: 'Nessun risultato per "{query}".',
        clearSearchButton: 'Cancella ricerca',
      },
      counts: {
        cards: {
          one: '{count} carta',
          other: '{count} carte',
        },
        sessions: {
          one: '{count} sessione',
          other: '{count} sessioni',
        },
        reviews: {
          one: '{count} ripasso',
          other: '{count} ripassi',
        },
      },
    },
    navigation: {
      tabs: {
        decks: 'Mazzi',
        learn: 'Impara',
        categories: 'Categorie',
        statistics: 'Statistiche',
      },
      headers: {
        decksList: 'Mazzi',
        editDeck: 'Modifica mazzo',
        newDeck: 'Nuovo mazzo',
        learnList: 'Impara',
        study: 'Sessione',
        categoriesList: 'Categorie',
        newCategory: 'Nuova categoria',
        statsOverview: 'Statistiche',
        deckStats: 'Statistiche del mazzo',
      },
    },
    answers: {
      answerLabels: {
        ok: 'Ok',
        okeish: 'Così così',
        notOk: 'Non ok',
      },
      shares: {
        notReviewed: 'Non ancora ripassata',
        summary: '{ok} Ok, {okeish} Così così, {notOk} Non ok',
      },
      cardStatus: {
        needsReview: 'Da ripassare',
        learning: 'In apprendimento',
        mastered: 'Padroneggiata',
        new: 'Nuova',
      },
      timeframes: {
        all: 'Sempre',
        month: 'Questo mese',
        week: 'Ultimi 7 giorni',
      },
      sortOrders: {
        hardest: 'Più difficili prima',
        deck: 'Ordine del mazzo',
        recent: 'Ripassate di recente',
      },
      dates: {
        never: 'Mai',
      },
    },
    importExport: {
      defaultDeckName: 'Mazzo importato',
      importErrors: {
        emptyFile: 'Il file selezionato è vuoto.',
        notADeck:
          "Questo non è un file di mazzo di Easy Flashcards. Scegli un file JSON esportato dall'app.",
        newerVersion:
          "Questo file di mazzo è stato creato da una versione più recente di Easy Flashcards. Aggiorna l'app per importarlo.",
        noCards:
          'Nessuna carta utilizzabile trovata. Ogni carta deve avere una domanda e una risposta.',
        noHeader:
          'Nessuna riga di intestazione trovata. La prima riga che non sia vuota né un commento "#" deve indicare una colonna "question" e una colonna "answer", separate da una virgola, un punto e virgola, una tabulazione o un altro simbolo.',
        noUsableRows:
          'Nessuna riga utilizzabile trovata. Ogni riga deve avere una domanda e una risposta.',
        unreadable: 'Impossibile leggere il file selezionato.',
      },
      importAlert: {
        successTitle: 'Mazzo importato',
        successMessage: {
          one: '"{name}" ora ha {count} carta.',
          other: '"{name}" ora ha {count} carte.',
        },
        skippedRows: {
          one: '{count} riga incompleta ignorata.',
          other: '{count} righe incomplete ignorate.',
        },
        skippedCards: {
          one: '{count} carta incompleta ignorata.',
          other: '{count} carte incomplete ignorate.',
        },
        failedTitle: 'Importazione non riuscita',
        failedWithDetails: 'Impossibile importare il file: {details}',
        failedUnknown: "Errore sconosciuto durante l'importazione del file.",
      },
      exportAlert: {
        successTitle: 'Mazzo esportato',
        savedAs: 'Salvato come {name}.',
        saved: 'Il mazzo è stato salvato.',
        failedTitle: 'Esportazione non riuscita',
        deckGone: 'Questo mazzo non esiste più.',
        failedFallback: 'Impossibile esportare il mazzo.',
      },
      separators: {
        comma: 'Virgola (,)',
        semicolon: 'Punto e virgola (;)',
        tab: 'Tabulazione',
      },
      sampleExport: {
        successTitle: 'Mazzo di esempio esportato',
        partlyTitle: 'Mazzo di esempio esportato in parte',
        failedTitle: 'Esportazione non riuscita',
        savedAsOne: 'Salvato come {name}.',
        savedAsTwo: 'Salvati come {first} e {second}.',
        fileFailed: 'Impossibile salvare il file {format}: {details}',
        fileNotSaved: 'Il file {format} non è stato salvato.',
        unknownError: 'Errore sconosciuto',
      },
    },
    categoryNames: {
      builtIn: {
        astronomy: 'Astronomia',
        biology: 'Biologia',
        botany: 'Botanica',
        chemistry: 'Chimica',
        cinema: 'Cinema',
        computer_science: 'Informatica',
        economics: 'Economia',
        gastronomy: 'Gastronomia',
        geography: 'Geografia',
        history: 'Storia',
        languages: 'Lingue',
        law: 'Diritto',
        literature: 'Letteratura',
        mathematics: 'Matematica',
        medicine: 'Medicina',
        music: 'Musica',
        philosophy: 'Filosofia',
        physics: 'Fisica',
        religion: 'Religione',
        sport: 'Sport',
        zoology: 'Zoologia',
      },
      icons: {
        plane_contrails: 'Aeroplano',
        anchor: 'Ancora',
        nutrition: 'Mela',
        emergency: 'Asterisco',
        microbiology: 'Batterio',
        finance: 'Grafico a barre',
        sports_basketball: 'Pallacanestro',
        neurology: 'Cervello',
        bug_report: 'Insetto',
        calendar_month: 'Calendario',
        photo_camera: 'Fotocamera',
        camera: "Apertura dell'obiettivo",
        cannabis: 'Foglia di cannabis',
        directions_car: 'Auto',
        chess_pawn: 'Pedone degli scacchi',
        language_chinese_dayi: 'Lettere cinesi e latine',
        location_city: 'Città',
        circle_circle: 'Cerchi concentrici',
        restaurant: 'Posate',
        database: 'Database',
        nest_heat_link_e: 'Punto in un cerchio',
        engineering: 'Ingegnere',
        face: 'Volto',
        face_3: 'Volto con capelli',
        theaters: 'Pellicola',
        flag_2: 'Bandiera',
        science: 'Beuta',
        save: 'Floppy disk',
        sports_and_outdoors: 'Pallone da calcio',
        skillet: 'Padella',
        sports_esports: 'Controller per videogiochi',
        language: 'Globo',
        diversity_3: 'Gruppo di persone',
        psychology: 'Testa con ingranaggio',
        headphones: 'Cuffie',
        health_and_safety: 'Scudo della salute',
        landscape_2: 'Colline',
        hive: 'Favo',
        hourglass_empty: 'Clessidra',
        house: 'Casa',
        icecream: 'Gelato',
        temp_preferences_eco: 'Foglie',
        electric_bolt: 'Fulmine',
        wand_stars: 'Bacchetta magica',
        biotech: 'Microscopio',
        mindfulness: 'Mindfulness',
        motorcycle: 'Moto',
        music_note_2: 'Nota musicale',
        network_node: 'Rete',
        import_contacts: 'Libro aperto',
        pan_tool: 'Mano aperta',
        pets: 'Zampa',
        stylus: 'Matita',
        person: 'Persona',
        history_edu: "Penna d'oca e foglio",
        radio: 'Radio',
        raven: 'Corvo',
        rib_cage: 'Gabbia toracica',
        rocket_launch: 'Razzo',
        scatter_plot: 'Grafico a dispersione',
        category: 'Forme',
        interests: 'Forme e cuore',
        shopping_cart: 'Carrello',
        functions: 'Sigma',
        skull: 'Teschio',
        emoji_language: 'Smiley e globo',
        snowflake: 'Fiocco di neve',
        hotel_class: 'Stella',
        mountain_flag: 'Bandiera sulla vetta',
        sunny: 'Sole',
        mixture_med: 'Siringa e pillola',
        temple_buddhist: 'Tempio',
        text_snippet: 'Documento di testo',
        theater_comedy: 'Maschere teatrali',
        nest_thermostat_gen_3: 'Termostato',
        translate: 'Traduci',
        nature: 'Albero',
        fertile: 'Tulipano',
        videocam: 'Videocamera',
        coronavirus: 'Virus',
        volcano: 'Vulcano',
        warning: 'Avviso',
        water: 'Onde',
        air: 'Vento',
        build: 'Chiave inglese',
      },
    },
    shell: {
      appMenu: {
        triggerA11yLabel: "Menu dell'app",
        exportSampleDeckItem: 'Esporta mazzo di esempio',
        settingsItem: 'Impostazioni',
      },
      settingsAlert: {
        title: 'Impostazioni',
        message: 'Le impostazioni non sono ancora disponibili.',
      },
      exportSampleDeckDialog: {
        title: 'Esporta mazzo di esempio',
        body: 'Questo salva lo stesso mazzo di esempio come due file, CSV e JSON. Ti viene chiesto dove salvare ciascuno e puoi annullare uno dei due per saltarlo.\n\nCSV: le righe che iniziano con # (title, description, category) vengono ignorate quando si importa, poi una riga di intestazione "question" / "answer" e una carta per riga, separate qui da punti e virgola (funzionano anche una virgola, una tabulazione o un altro simbolo singolo).\n\nJSON: ripristina anche titolo, descrizione e categoria.\n\nSu entrambi i lati di una carta è consentito HTML di base, come <b>, <i> e <br />.',
      },
      kebabMenu: {
        triggerA11yLabel: 'Altre opzioni',
      },
      searchBar: {
        inputA11yLabel: 'Testo di ricerca',
        closeButtonA11yLabel: 'Chiudi ricerca',
      },
    },
    decks: {
      decksScreen: {
        searchA11yLabel: 'Cerca mazzi',
        searchPlaceholder: 'Cerca mazzi',
        loadError: 'Impossibile leggere i mazzi salvati.',
        addDeckA11yLabel: 'Aggiungi un mazzo',
        emptyTitle: 'Ancora nessun mazzo',
        emptyMessage:
          'Usa il pulsante + per importare un file di mazzo e creare il tuo primo mazzo.',
      },
      emptyDeckAlert: {
        title: 'Mazzo vuoto',
        message: 'Questo mazzo non ha carte da studiare.',
      },
      deleteDeckAlert: {
        title: 'Elimina mazzo',
        message:
          'Eliminare "{name}", le sue sessioni e tutte le sue statistiche?',
      },
      addDeckMenu: {
        title: 'Aggiungi un mazzo',
        importItem: 'Importa mazzo da file',
        manualItem: 'Aggiungi mazzo manualmente',
      },
      deckOptionsMenu: {
        startWithOptionsItem: 'Avvia sessione con opzioni',
        editItem: 'Modifica mazzo',
        exportItem: 'Esporta in un file',
        deleteItem: 'Elimina mazzo',
      },
      exportFormatMenu: {
        title: 'Esporta mazzo in un file',
      },
      csvSeparatorMenu: {
        title: 'Separatore CSV',
        customItem: 'Personalizzato…',
      },
      deckCard: {
        optionsA11yLabel: 'Opzioni per {name}',
        activeCount: '{count} attive',
        lastSession: 'Ultima: {date}',
        startA11yLabel: 'Avvia sessione per {name}',
      },
      masteryBar: {
        a11yLabel: 'Padronanza: {summary}',
      },
      sessionSetupDialog: {
        title: 'Avvia sessione',
        invertedLabel: 'Invertita',
        invertedDescription: 'Mostra prima la risposta e la domanda sul retro.',
        shuffleLabel: 'Mescola',
        shuffleDescription: 'Studia le carte in ordine casuale.',
      },
      customSeparatorDialog: {
        title: 'Separatore personalizzato',
        separatorLabel: 'Separatore',
        separatorPlaceholder: 'Ad esempio |',
        errors: {
          empty: 'Inserisci un carattere.',
          tooLong: 'Usa un solo carattere.',
          reserved: 'Virgolette, # e a capo non sono consentiti.',
          whitespace:
            "Gli spazi non sono consentiti. Usa l'opzione Tabulazione per una tabulazione.",
          alphanumeric: 'Lettere e cifre non sono consentite.',
        },
      },
    },
    editDeck: {
      deckNotFound: {
        title: 'Mazzo non trovato',
        message: 'Questo mazzo non esiste più.',
        backButton: 'Torna ai mazzi',
      },
      editDeckScreen: {
        titleLabel: 'Titolo',
        descriptionLabel: 'Descrizione',
        descriptionPlaceholder: 'Facoltativa',
        saveButtonA11yLabel: 'Salva mazzo',
        addCardButton: 'Aggiungi carta',
      },
      titleNeededAlert: {
        title: 'Titolo obbligatorio',
        message: 'Dai un titolo al mazzo.',
      },
      cardIncompleteAlert: {
        title: 'Carta incompleta',
        message: 'La carta {number} richiede sia una domanda sia una risposta.',
      },
      removeCardsAlert: {
        title: 'Rimuovere le carte?',
        message: {
          one: '{count} carta verrà rimossa dal mazzo, insieme alle sue statistiche.',
          other:
            '{count} carte verranno rimosse dal mazzo, insieme alle loro statistiche.',
        },
      },
      discardChangesAlert: {
        title: 'Scartare le modifiche?',
        messageEdit: 'Le modifiche a questo mazzo non sono state salvate.',
        messageNew: 'Questo mazzo non è stato salvato.',
      },
      cardEditor: {
        title: 'Carta {number}',
        removeButtonA11yLabel: 'Rimuovi carta {number}',
        questionLabel: 'Domanda',
        questionA11yLabel: 'Domanda della carta {number}',
        answerLabel: 'Risposta',
        answerA11yLabel: 'Risposta della carta {number}',
      },
      categoryField: {
        label: 'Categoria',
        a11yLabel: 'Categoria: {name}',
        a11yLabelNone: 'Categoria: nessuna',
        a11yHint: 'Apre il selettore di categoria',
        noneValue: 'Nessuna categoria',
      },
      categoryPicker: {
        title: 'Categoria',
        groupA11yLabel: 'Selettore di categoria',
        noneTile: 'Nessuna categoria',
      },
    },
    learn: {
      learnScreen: {
        searchA11yLabel: 'Cerca sessioni',
        searchPlaceholder: 'Cerca sessioni',
      },
      headerToolbar: {
        clearCompletedItem: 'Rimuovi sessioni completate',
      },
      emptyState: {
        noSessionsTitle: 'Ancora nessuna sessione',
        noSessionsMessage:
          'Scegli un mazzo e avvia una sessione di studio: resterà qui finché non la termini.',
        allClearedTitle: 'Nessuna sessione da mostrare',
        allClearedMessage:
          'Le sessioni rimosse contano ancora nelle Statistiche. Avvia una nuova sessione da un mazzo per vederla qui.',
        goToDecksButton: 'Vai ai mazzi',
      },
      deckUnavailableAlert: {
        title: 'Mazzo non disponibile',
        message: 'Questo mazzo non esiste più o non ha carte.',
      },
      clearCompletedSessionsAlert: {
        title: 'Rimuovi sessioni completate',
        nothingToClear: 'Nessuna sessione completata da rimuovere.',
        message: {
          one: 'Rimuovere {count} sessione completata da questo elenco? I risultati restano nelle Statistiche.',
          other:
            'Rimuovere {count} sessioni completate da questo elenco? I risultati restano nelle Statistiche.',
        },
      },
      discardSessionAlert: {
        title: 'Scarta sessione',
        message:
          'Scartare la sessione non terminata di "{deckName}"? Anche le sue risposte vengono rimosse dalle Statistiche.',
      },
      clearSessionAlert: {
        title: 'Rimuovi sessione',
        message:
          'Rimuovere la sessione completata di "{deckName}" da questo elenco? I risultati restano nelle Statistiche.',
      },
      sessionOptionsMenu: {
        discardItem: 'Scarta sessione',
        clearItem: 'Rimuovi sessione',
      },
      sessionCard: {
        inProgressStatus: {
          one: 'In corso \u2014 {answered}/{count} carta',
          other: 'In corso \u2014 {answered}/{count} carte',
        },
        completedStatus: {
          one: 'Completata \u2014 {count} carta',
          other: 'Completata \u2014 {count} carte',
        },
        invertedPill: 'Invertita',
        invertedPillA11yLabel: 'Sessione invertita',
        optionsA11yLabel: 'Opzioni per la sessione di {deckName}',
        started: 'Iniziata il {date}',
        resumeButtonA11yLabel: 'Riprendi la sessione di {deckName}',
        replayButtonA11yLabel: 'Ripeti la sessione di {deckName}',
        reviewErrorsButtonA11yLabel: {
          one: 'Ripassa {count} carta sbagliata o incerta di {deckName}',
          other: 'Ripassa {count} carte sbagliate o incerte di {deckName}',
        },
        reviewErrorsDoneA11yLabel:
          'Tutte le carte sbagliate o incerte di {deckName} sono state corrette',
      },
      sessionResultsBar: {
        progressA11yLabel:
          'Avanzamento: {answered} di {cardCount} risposte \u2014 {ok} ok, {okeish} così così, {notOk} non ok',
      },
    },
    study: {
      studyScreen: {
        fallbackTitle: 'Sessione',
        unavailableTitle: 'Niente da studiare',
        unavailableMessage: 'Questa sessione non è più disponibile.',
        unavailableAction: 'Torna alle sessioni',
      },
      progressHeader: {
        position: 'Carta {current} di {total}',
        okCount: 'Ok {count}',
      },
      invertedPill: {
        text: 'Invertita',
        a11yLabel: 'Sessione invertita: il fronte mostra la risposta',
      },
      swipeHint: {
        reviewing:
          'Stai rivedendo una carta già risposta \u2014 scorri a sinistra per tornare dove eri',
      },
      historyStrip: {
        a11yLabel: 'Risposte finora',
      },
      flipCard: {
        questionLabel: 'DOMANDA',
        answerLabel: 'RISPOSTA',
        revealHint: 'Tocca per mostrare la risposta',
        backHint: 'Tocca per rivedere la domanda',
        showQuestionA11yLabel: 'Mostra domanda',
        showAnswerA11yLabel: 'Mostra risposta',
      },
      sessionSummary: {
        title: 'Sessione completata',
        successRateA11yLabel: 'Tasso di successo {rate}',
        reviewedCount: 'Ripassate: {count}',
        studyAgainLabel: 'Ristudia tutto il mazzo',
        studyAgainButtonA11yLabel: 'Ristudia tutto il mazzo',
      },
      reviewSummary: {
        title: 'Ripasso completato',
        stillToFix: '{count} ancora da correggere',
        allFixed: 'Tutte corrette',
      },
      summaryAction: {
        reviewLabel: 'Ripassa le carte sbagliate o incerte',
        reviewButtonA11yLabel: {
          one: 'Ripassa {count} carta sbagliata o incerta',
          other: 'Ripassa {count} carte sbagliate o incerte',
        },
        backLabel: 'Torna alle sessioni',
        backButtonA11yLabel: 'Torna alle sessioni',
      },
    },
    categories: {
      categoriesScreen: {
        customSectionTitle: 'Categorie personalizzate',
        customSectionSubtitle: {
          one: '{count} disponibile',
          other: '{count} disponibili',
        },
        customEmptyHint: 'Le tue categorie appariranno qui.',
        defaultSectionTitle: 'Categorie predefinite',
        defaultSectionSubtitle: {
          one: '{count} predefinita',
          other: '{count} predefinite',
        },
        newCategoryButton: 'Nuova categoria',
        categoryTileA11yLabel: 'Opzioni per {name}',
      },
      categoryOptionsMenu: {
        deleteItem: 'Elimina categoria',
      },
      deleteCategoryAlert: {
        title: 'Eliminare la categoria?',
        message: '"{name}" verrà eliminata.',
        messageWithDecks: {
          one: '"{name}" verrà eliminata. {count} mazzo resterà senza categoria.',
          other:
            '"{name}" verrà eliminata. {count} mazzi resteranno senza categoria.',
        },
      },
      newCategoryScreen: {
        saveButtonA11yLabel: 'Salva categoria',
        nameField: 'Nome',
        colourLabel: 'Colore',
        iconLabel: 'Icona',
        nameCounter: '{length}/{max}',
        nameErrors: {
          empty: 'Inserisci un nome.',
          tooLong: {
            one: 'Usa al massimo {count} carattere.',
            other: 'Usa al massimo {count} caratteri.',
          },
          duplicate: 'Esiste già una categoria con questo nome.',
        },
      },
      discardChangesAlert: {
        title: 'Scartare le modifiche?',
        message: 'Questa categoria non è stata salvata.',
      },
      tilePreview: {
        placeholder: 'Nome categoria',
        a11yLabel: 'Anteprima: {name}',
        noNameA11yLabel: 'Anteprima: nessun nome',
      },
      colourPicker: {
        a11yLabel: 'Selettore di colore',
        swatchA11yLabel: 'Colore {position} di {total}',
      },
      customColourSwatch: {
        a11yLabel: 'Colore personalizzato',
        a11yHint: 'Apre la scelta del colore',
      },
      iconPicker: {
        a11yLabel: 'Selettore di icone',
      },
      customColourDialog: {
        title: 'Colore personalizzato',
        hueLabel: 'Tonalità',
        hueValue: '{value}°',
        saturationLabel: 'Saturazione',
        brightnessLabel: 'Luminosità',
        percentValue: '{value}%',
        previewA11yLabel: 'Anteprima colore {color}',
        tooDark: "Troppo scuro per l'icona. Prova un colore più chiaro.",
        useButton: 'Usa colore',
      },
      categorySquare: {
        a11yLabel: 'Categoria: {name}',
      },
    },
    stats: {
      statsScreen: {
        searchA11yLabel: 'Cerca mazzi',
        searchPlaceholder: 'Cerca mazzi',
        aggregatedHeading: 'Statistiche aggregate',
        decksTile: {
          label: 'Mazzi',
          caption: 'Nella tua libreria',
        },
        totalCardsTile: {
          label: 'Carte totali',
          caption: 'In tutti i mazzi',
        },
        totalReviewsTile: {
          label: 'Ripassi totali',
          caption: {
            all: 'Risposte registrate',
            month: 'Risposte di questo mese',
            week: 'Risposte degli ultimi 7 giorni',
          },
        },
        sessionsTile: {
          label: 'Sessioni',
          caption: '{count} attive',
        },
        tileA11yLabel: '{label}: {value}, {caption}',
        decksBreakdownHeading: 'Dettaglio dei mazzi',
        deckCount: {
          one: '{count} mazzo',
          other: '{count} mazzi',
        },
        emptyState: {
          title: 'Ancora nessuna statistica',
          message: 'Importa un mazzo e studialo: i risultati compariranno qui.',
        },
      },
      masteryRing: {
        summaryA11yLabel:
          'Tasso di successo {rate}. {shares}. Conteggi: {counts}',
        caption: 'Tasso di successo',
      },
      deckStatsCard: {
        summaryA11yLabel:
          '{name}: {shares}, {cards}, {sessions}, {reviews}, ultima {last}',
        openA11yHint: 'Apre i dettagli per carta',
        cardsLabel: 'Carte',
        sessionsLabel: 'Sessioni',
        reviewsLabel: 'Ripassi',
        lastLabel: 'Ultima',
      },
      timeframeChips: {
        groupA11yLabel: 'Periodo',
      },
    },
    deckStats: {
      deckStatsScreen: {
        optionsA11yLabel: 'Opzioni per le statistiche di {deckName}',
        resetStatisticsMenuItem: 'Azzera statistiche',
        resetAlert: {
          title: 'Azzera statistiche',
          message:
            'Cancellare tutti i risultati e le sessioni registrati per "{deckName}"?',
        },
        notFound: {
          title: 'Mazzo non trovato',
          message: 'Questo mazzo è stato eliminato.',
        },
        cardPerformanceTitle: 'Rendimento delle carte',
        subtitle: {
          one: '{count} carta · {sort}',
          other: '{count} carte · {sort}',
        },
        subtitleNarrowed: {
          one: '{shown} di {count} carta · {sort}',
          other: '{shown} di {count} carte · {sort}',
        },
        sortButtonA11yLabel: 'Ordina carte: {sort}',
        sortSheetTitle: 'Ordina carte',
        noCards: {
          title: 'Ancora nessuna carta',
          message: 'Aggiungi carte a questo mazzo per vedere come va ciascuna.',
        },
        statusEmpty: {
          needsReview: {
            title: 'Nessuna carta da ripassare',
            message: 'Nessuna carta è sotto il 40% di successo.',
          },
          learning: {
            title: 'Nessuna carta in apprendimento',
            message: 'Nessuna carta è tra il 40% e il 70% di successo.',
          },
          mastered: {
            title: 'Ancora nessuna carta padroneggiata',
            message: 'Una carta è padroneggiata con il 70% di successo o più.',
          },
          new: {
            title: 'Nessuna carta nuova',
            message: 'Ogni carta è stata ripassata almeno una volta.',
          },
        },
        showAllCardsButton: 'Mostra tutte le carte',
        noMatches: {
          filteredMessage:
            'Nessun risultato per "{query}" con il filtro {status}.',
        },
      },
      deckIdentityRow: {
        categoryA11yLabel: 'Categoria: {name}',
      },
      deckMasteryCard: {
        successRateA11yLabel: 'Tasso di successo: {rate}',
        successRateNoReviewsA11yLabel:
          'Tasso di successo: ancora nessun ripasso',
        successRateCaption: 'Tasso di successo',
        answerTile: {
          ok: '{count} ok, {percent}',
          okeish: '{count} così così, {percent}',
          notOk: '{count} non ok, {percent}',
        },
        answerTileNoReviews: {
          ok: '{count} ok, ancora nessun ripasso',
          okeish: '{count} così così, ancora nessun ripasso',
          notOk: '{count} non ok, ancora nessun ripasso',
        },
        reviewsFigure: 'Ripassi',
        sessionsFigure: 'Sessioni',
        lastSessionFigure: 'Ultima sessione',
        figureA11yLabel: '{label}: {value}',
        changeChip: {
          none: "Nessuna variazione dall'ultima sessione",
          up: "+{points} pt dall'ultima sessione",
          down: "-{points} pt dall'ultima sessione",
          noneA11yLabel:
            "Tasso di successo invariato rispetto all'ultima sessione",
          upA11yLabel: {
            one: "Tasso di successo aumentato di {count} punto rispetto all'ultima sessione",
            other:
              "Tasso di successo aumentato di {count} punti rispetto all'ultima sessione",
          },
          downA11yLabel: {
            one: "Tasso di successo diminuito di {count} punto rispetto all'ultima sessione",
            other:
              "Tasso di successo diminuito di {count} punti rispetto all'ultima sessione",
          },
        },
      },
      cardStatsRow: {
        footerNeverReviewed: 'Mai ripassata',
        footerReviewed: {
          one: '{count} ripasso · Ripassata il {date}',
          other: '{count} ripassi · Ripassata il {date}',
        },
        neverReviewedA11yLabel:
          'Domanda: {question}. Risposta: {answer}. {status}. Mai ripassata.',
        reviewedA11yLabel: {
          one: 'Domanda: {question}. Risposta: {answer}. {status}, tasso di successo {rate}. {count} ripasso: {ok} ok, {okeish} così così, {notOk} non ok.',
          other:
            'Domanda: {question}. Risposta: {answer}. {status}, tasso di successo {rate}. {count} ripassi: {ok} ok, {okeish} così così, {notOk} non ok.',
        },
        reviewedOnA11yLabel: {
          one: 'Domanda: {question}. Risposta: {answer}. {status}, tasso di successo {rate}. {count} ripasso: {ok} ok, {okeish} così così, {notOk} non ok. Ripassata il {date}.',
          other:
            'Domanda: {question}. Risposta: {answer}. {status}, tasso di successo {rate}. {count} ripassi: {ok} ok, {okeish} così così, {notOk} non ok. Ripassata il {date}.',
        },
      },
      cardStatusChips: {
        groupA11yLabel: 'Stato della carta',
        allChip: 'Tutte',
        chipLabel: '{label} ({count})',
        chipA11yLabel: {
          one: '{label}, {count} carta',
          other: '{label}, {count} carte',
        },
      },
      cardSearchField: {
        searchA11yLabel: 'Cerca carte',
        searchPlaceholder: 'Cerca nelle domande e nelle risposte',
        clearA11yLabel: 'Cancella ricerca carte',
      },
      sessionHistoryChart: {
        title: 'Cronologia delle sessioni',
        subtitleLatest: 'Ultime {shown} di {total}',
        empty: {
          title: 'Nessuna sessione per questo mazzo',
          message:
            'Avviane una dalla scheda Mazzi e i risultati compariranno qui.',
        },
        unansweredLegend: 'Senza risposta',
        legendNote: '% delle carte di ogni sessione',
        sessionA11yLabel: {
          one: 'Sessione del {date}: tasso di successo {rate}, {answered} di {count} carta con risposta — {ok} ok, {okeish} così così, {notOk} non ok',
          other:
            'Sessione del {date}: tasso di successo {rate}, {answered} di {count} carte con risposta — {ok} ok, {okeish} così così, {notOk} non ok',
        },
        sessionNoAnswersA11yLabel: {
          one: 'Sessione del {date}: tasso di successo non ancora disponibile, {answered} di {count} carta con risposta — {ok} ok, {okeish} così così, {notOk} non ok',
          other:
            'Sessione del {date}: tasso di successo non ancora disponibile, {answered} di {count} carte con risposta — {ok} ok, {okeish} così così, {notOk} non ok',
        },
      },
    },
  },
};
