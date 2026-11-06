import type { Language, PluralRule } from '../utils/i18n';

// CLDR's `many` form (exact multiples of 1,000,000) is deliberately not implemented.
export const frPlural: PluralRule = count =>
  count === 0 || count === 1 ? 'one' : 'other';

export const fr: Language = {
  code: 'fr',
  plural: frPlural,
  messages: {
    common: {
      actions: {
        back: 'Retour',
        cancel: 'Annuler',
        clear: 'Effacer',
        close: 'Fermer',
        delete: 'Supprimer',
        discard: 'Abandonner',
        export: 'Exporter',
        keepEditing: 'Continuer',
        ok: 'OK',
        reset: 'Réinitialiser',
        save: 'Enregistrer',
        start: 'Démarrer',
      },
      search: {
        noMatchesTitle: 'Aucun résultat',
        noMatchesMessage: 'Aucun résultat pour «\u00a0{query}\u00a0».',
        clearSearchButton: 'Effacer la recherche',
      },
      counts: {
        cards: {
          one: '{count} carte',
          other: '{count} cartes',
        },
        sessions: {
          one: '{count} session',
          other: '{count} sessions',
        },
        reviews: {
          one: '{count} révision',
          other: '{count} révisions',
        },
      },
    },
    navigation: {
      tabs: {
        decks: 'Paquets',
        learn: 'Apprendre',
        categories: 'Catégories',
        statistics: 'Statistiques',
      },
      headers: {
        decksList: 'Paquets',
        editDeck: 'Modifier le paquet',
        newDeck: 'Nouveau paquet',
        learnList: 'Apprendre',
        study: 'Session',
        categoriesList: 'Catégories',
        newCategory: 'Nouvelle catégorie',
        statsOverview: 'Statistiques',
        deckStats: 'Statistiques du paquet',
      },
    },
    answers: {
      answerLabels: {
        ok: 'Ok',
        // "Moyen" sits clearly between "Ok" and "Pas ok" and reads the same in a sentence.
        okeish: 'Moyen',
        notOk: 'Pas ok',
      },
      shares: {
        notReviewed: 'Pas encore révisé',
        summary: '{ok} Ok, {okeish} Moyen, {notOk} Pas ok',
      },
      cardStatus: {
        needsReview: 'À revoir',
        learning: 'En cours',
        mastered: 'Maîtrisée',
        new: 'Nouvelle',
      },
      timeframes: {
        all: 'Tout',
        month: 'Ce mois-ci',
        week: '7 derniers jours',
      },
      sortOrders: {
        hardest: "Plus difficiles d'abord",
        deck: 'Ordre du paquet',
        recent: 'Révisées récemment',
      },
      dates: {
        never: 'Jamais',
      },
    },
    importExport: {
      defaultDeckName: 'Paquet importé',
      importErrors: {
        emptyFile: 'Le fichier sélectionné est vide.',
        notADeck:
          "Ce n'est pas un fichier de paquet Easy Flashcards. Choisissez un fichier JSON exporté depuis l'application.",
        newerVersion:
          "Ce fichier de paquet a été créé par une version plus récente d'Easy Flashcards. Mettez l'application à jour pour l'importer.",
        noCards:
          'Aucune carte exploitable trouvée. Chaque carte doit avoir une question et une réponse.',
        noHeader:
          'En-tête introuvable. La première ligne non vide qui ne commence pas par "#" doit nommer une colonne "question" et une colonne "answer", séparées par une virgule, un point-virgule, une tabulation ou un autre symbole.',
        noUsableRows:
          'Aucune ligne exploitable trouvée. Chaque ligne doit avoir une question et une réponse.',
        unreadable: 'Impossible de lire le fichier sélectionné.',
      },
      importAlert: {
        successTitle: 'Paquet importé',
        successMessage: {
          one: '«\u00a0{name}\u00a0» contient maintenant {count} carte.',
          other: '«\u00a0{name}\u00a0» contient maintenant {count} cartes.',
        },
        skippedRows: {
          one: '{count} ligne incomplète ignorée.',
          other: '{count} lignes incomplètes ignorées.',
        },
        skippedCards: {
          one: '{count} carte incomplète ignorée.',
          other: '{count} cartes incomplètes ignorées.',
        },
        failedTitle: "Échec de l'importation",
        failedWithDetails:
          "Le fichier n'a pas pu être importé\u00a0: {details}",
        failedUnknown: "Erreur inconnue lors de l'importation du fichier.",
      },
      exportAlert: {
        successTitle: 'Paquet exporté',
        savedAs: 'Enregistré sous {name}.',
        saved: 'Le paquet a été enregistré.',
        failedTitle: "Échec de l'exportation",
        deckGone: "Ce paquet n'existe plus.",
        failedFallback: "Impossible d'exporter le paquet.",
      },
      separators: {
        comma: 'Virgule (,)',
        semicolon: 'Point-virgule (;)',
        tab: 'Tabulation',
      },
      sampleExport: {
        successTitle: "Paquet d'exemple exporté",
        partlyTitle: "Paquet d'exemple partiellement exporté",
        failedTitle: "Échec de l'exportation",
        savedAsOne: 'Enregistré sous {name}.',
        savedAsTwo: 'Enregistré sous {first} et {second}.',
        fileFailed:
          "Le fichier {format} n'a pas pu être enregistré\u00a0: {details}",
        fileNotSaved: "Le fichier {format} n'a pas été enregistré.",
        unknownError: 'Erreur inconnue',
      },
    },
    categoryNames: {
      builtIn: {
        astronomy: 'Astronomie',
        biology: 'Biologie',
        botany: 'Botanique',
        chemistry: 'Chimie',
        cinema: 'Cinéma',
        computer_science: 'Informatique',
        economics: 'Économie',
        gastronomy: 'Gastronomie',
        geography: 'Géographie',
        history: 'Histoire',
        languages: 'Langues',
        law: 'Droit',
        literature: 'Littérature',
        mathematics: 'Mathématiques',
        medicine: 'Médecine',
        music: 'Musique',
        philosophy: 'Philosophie',
        physics: 'Physique',
        religion: 'Religion',
        sport: 'Sport',
        zoology: 'Zoologie',
      },
      icons: {
        plane_contrails: 'Avion',
        anchor: 'Ancre',
        nutrition: 'Pomme',
        emergency: 'Astérisque',
        microbiology: 'Bactérie',
        finance: 'Diagramme en barres',
        sports_basketball: 'Ballon de basket',
        neurology: 'Cerveau',
        bug_report: 'Insecte',
        calendar_month: 'Calendrier',
        photo_camera: 'Appareil photo',
        camera: 'Diaphragme',
        cannabis: 'Feuille de cannabis',
        directions_car: 'Voiture',
        chess_pawn: "Pion d'échecs",
        language_chinese_dayi: 'Caractères chinois et latins',
        location_city: 'Ville',
        circle_circle: 'Cercles concentriques',
        restaurant: 'Couverts',
        database: 'Base de données',
        nest_heat_link_e: 'Point dans un cercle',
        engineering: 'Ingénieur',
        face: 'Visage',
        face_3: 'Visage avec cheveux',
        theaters: 'Pellicule',
        flag_2: 'Drapeau',
        science: 'Fiole',
        save: 'Disquette',
        sports_and_outdoors: 'Ballon de football',
        skillet: 'Poêle',
        sports_esports: 'Manette de jeu',
        language: 'Globe',
        diversity_3: 'Groupe de personnes',
        psychology: 'Tête avec engrenage',
        headphones: 'Casque audio',
        health_and_safety: 'Bouclier santé',
        landscape_2: 'Collines',
        hive: "Nid d'abeilles",
        hourglass_empty: 'Sablier',
        house: 'Maison',
        icecream: 'Glace',
        temp_preferences_eco: 'Feuilles',
        electric_bolt: 'Éclair',
        wand_stars: 'Baguette magique',
        biotech: 'Microscope',
        mindfulness: 'Pleine conscience',
        motorcycle: 'Moto',
        music_note_2: 'Note de musique',
        network_node: 'Réseau',
        import_contacts: 'Livre ouvert',
        pan_tool: 'Main ouverte',
        pets: 'Patte',
        stylus: 'Crayon',
        person: 'Personne',
        history_edu: 'Plume et papier',
        radio: 'Radio',
        raven: 'Corbeau',
        rib_cage: 'Cage thoracique',
        rocket_launch: 'Fusée',
        scatter_plot: 'Nuage de points',
        category: 'Formes',
        interests: 'Formes et cœur',
        shopping_cart: 'Panier',
        functions: 'Sigma',
        skull: 'Crâne',
        emoji_language: 'Smiley et globe',
        snowflake: 'Flocon de neige',
        hotel_class: 'Étoile',
        mountain_flag: 'Drapeau au sommet',
        sunny: 'Soleil',
        mixture_med: 'Seringue et pilule',
        temple_buddhist: 'Temple',
        text_snippet: 'Document texte',
        theater_comedy: 'Masques de théâtre',
        nest_thermostat_gen_3: 'Thermostat',
        translate: 'Traduction',
        nature: 'Arbre',
        fertile: 'Tulipe',
        videocam: 'Caméra',
        coronavirus: 'Virus',
        volcano: 'Volcan',
        warning: 'Avertissement',
        water: 'Vagues',
        air: 'Vent',
        build: 'Clé à molette',
      },
    },
    shell: {
      appMenu: {
        triggerA11yLabel: "Menu de l'application",
        exportSampleDeckItem: "Exporter le paquet d'exemple",
        settingsItem: 'Paramètres',
      },
      settingsAlert: {
        title: 'Paramètres',
        message: 'Les paramètres ne sont pas encore disponibles.',
      },
      exportSampleDeckDialog: {
        title: "Exporter le paquet d'exemple",
        body: "Cette action enregistre le même paquet d'exemple en deux fichiers, CSV et JSON. Vous choisissez où enregistrer chacun et pouvez annuler l'un des deux pour l'ignorer.\n\nCSV\u00a0: les lignes commençant par # (titre, description, catégorie) sont ignorées à l'importation, puis viennent un en-tête \"question\" / \"answer\" et une carte par ligne, avec ici des points-virgules comme séparateurs (une virgule, une tabulation ou un autre symbole unique fonctionne aussi).\n\nJSON\u00a0: restitue aussi le titre, la description et la catégorie.\n\nLe HTML de base, comme <b>, <i> et <br />, est autorisé des deux côtés d'une carte.",
      },
      kebabMenu: {
        triggerA11yLabel: "Plus d'options",
      },
      searchBar: {
        inputA11yLabel: 'Texte de recherche',
        closeButtonA11yLabel: 'Fermer la recherche',
      },
    },
    decks: {
      decksScreen: {
        searchA11yLabel: 'Rechercher des paquets',
        searchPlaceholder: 'Rechercher des paquets',
        loadError: 'Impossible de lire les paquets enregistrés.',
        addDeckA11yLabel: 'Ajouter un paquet',
        emptyTitle: 'Aucun paquet pour le moment',
        emptyMessage:
          'Utilisez le bouton + pour importer un fichier de paquet et créer votre premier paquet.',
      },
      emptyDeckAlert: {
        title: 'Paquet vide',
        message: 'Ce paquet ne contient aucune carte à apprendre.',
      },
      deleteDeckAlert: {
        title: 'Supprimer le paquet',
        message:
          'Supprimer «\u00a0{name}\u00a0», ses sessions et toutes ses statistiques\u00a0?',
      },
      addDeckMenu: {
        title: 'Ajouter un paquet',
        importItem: 'Importer un paquet depuis un fichier',
        manualItem: 'Ajouter un paquet manuellement',
      },
      deckOptionsMenu: {
        startWithOptionsItem: 'Démarrer une session avec options',
        editItem: 'Modifier le paquet',
        exportItem: 'Exporter vers un fichier',
        deleteItem: 'Supprimer le paquet',
      },
      exportFormatMenu: {
        title: 'Exporter le paquet vers un fichier',
      },
      csvSeparatorMenu: {
        title: 'Séparateur CSV',
        customItem: 'Personnalisé…',
      },
      deckCard: {
        optionsA11yLabel: 'Options pour {name}',
        activeCount: '{count} en cours',
        lastSession: 'Dernière\u00a0: {date}',
        startA11yLabel: 'Démarrer une session pour {name}',
      },
      masteryBar: {
        a11yLabel: 'Maîtrise\u00a0: {summary}',
      },
      sessionSetupDialog: {
        title: 'Démarrer une session',
        invertedLabel: 'Inversée',
        invertedDescription:
          "Afficher d'abord la réponse, et la question au verso.",
        shuffleLabel: 'Mélanger',
        shuffleDescription: 'Étudier les cartes dans un ordre aléatoire.',
      },
      customSeparatorDialog: {
        title: 'Séparateur personnalisé',
        separatorLabel: 'Séparateur',
        separatorPlaceholder: 'Par exemple |',
        errors: {
          empty: 'Saisissez un caractère.',
          tooLong: 'Utilisez un seul caractère.',
          reserved:
            'Les guillemets, le # et les sauts de ligne sont interdits.',
          whitespace:
            "Les espaces ne sont pas autorisés. Utilisez l'option Tabulation pour une tabulation.",
          alphanumeric: 'Les lettres et les chiffres ne sont pas autorisés.',
        },
      },
    },
    editDeck: {
      deckNotFound: {
        title: 'Paquet introuvable',
        message: "Ce paquet n'existe plus.",
        backButton: 'Retour aux paquets',
      },
      editDeckScreen: {
        titleLabel: 'Titre',
        descriptionLabel: 'Description',
        descriptionPlaceholder: 'Facultatif',
        saveButtonA11yLabel: 'Enregistrer le paquet',
        addCardButton: 'Ajouter une carte',
      },
      titleNeededAlert: {
        title: 'Titre requis',
        message: 'Donnez un titre au paquet.',
      },
      cardIncompleteAlert: {
        title: 'Carte incomplète',
        message: 'La carte {number} doit avoir une question et une réponse.',
      },
      removeCardsAlert: {
        title: 'Supprimer des cartes\u00a0?',
        message: {
          one: '{count} carte sera retirée du paquet, avec ses statistiques.',
          other:
            '{count} cartes seront retirées du paquet, avec leurs statistiques.',
        },
      },
      discardChangesAlert: {
        title: 'Abandonner les modifications\u00a0?',
        messageEdit:
          "Vos modifications de ce paquet n'ont pas été enregistrées.",
        messageNew: "Ce paquet n'a pas été enregistré.",
      },
      cardEditor: {
        title: 'Carte {number}',
        removeButtonA11yLabel: 'Supprimer la carte {number}',
        questionLabel: 'Question',
        questionA11yLabel: 'Question de la carte {number}',
        answerLabel: 'Réponse',
        answerA11yLabel: 'Réponse de la carte {number}',
      },
      categoryField: {
        label: 'Catégorie',
        a11yLabel: 'Catégorie\u00a0: {name}',
        a11yLabelNone: 'Catégorie\u00a0: aucune',
        a11yHint: 'Ouvre le sélecteur de catégorie',
        noneValue: 'Aucune catégorie',
      },
      categoryPicker: {
        title: 'Catégorie',
        groupA11yLabel: 'Sélecteur de catégorie',
        noneTile: 'Aucune catégorie',
      },
    },
    learn: {
      learnScreen: {
        searchA11yLabel: 'Rechercher des sessions',
        searchPlaceholder: 'Rechercher des sessions',
      },
      headerToolbar: {
        clearCompletedItem: 'Effacer les sessions terminées',
      },
      emptyState: {
        noSessionsTitle: 'Aucune session pour le moment',
        noSessionsMessage:
          "Choisissez un paquet et lancez une session d'apprentissage\u00a0; elle apparaîtra ici jusqu'à sa fin.",
        allClearedTitle: 'Aucune session à afficher',
        allClearedMessage:
          'Les sessions effacées restent comptées dans les statistiques. Lancez une nouvelle session depuis un paquet pour la voir ici.',
        goToDecksButton: 'Aller aux paquets',
      },
      deckUnavailableAlert: {
        title: 'Paquet indisponible',
        message: "Ce paquet n'existe plus ou ne contient aucune carte.",
      },
      clearCompletedSessionsAlert: {
        title: 'Effacer les sessions terminées',
        nothingToClear: 'Aucune session terminée à effacer.',
        message: {
          one: 'Retirer {count} session terminée de cette liste\u00a0? Ses résultats restent dans les statistiques.',
          other:
            'Retirer {count} sessions terminées de cette liste\u00a0? Leurs résultats restent dans les statistiques.',
        },
      },
      discardSessionAlert: {
        title: 'Abandonner la session',
        message:
          'Abandonner la session inachevée pour «\u00a0{deckName}\u00a0»\u00a0? Ses réponses sont aussi retirées des statistiques.',
      },
      clearSessionAlert: {
        title: 'Effacer la session',
        message:
          'Retirer la session terminée pour «\u00a0{deckName}\u00a0» de cette liste\u00a0? Ses résultats restent dans les statistiques.',
      },
      sessionOptionsMenu: {
        discardItem: 'Abandonner la session',
        clearItem: 'Effacer la session',
      },
      sessionCard: {
        inProgressStatus: {
          one: 'En cours \u2014 {answered}/{count} carte',
          other: 'En cours \u2014 {answered}/{count} cartes',
        },
        completedStatus: {
          one: 'Terminée \u2014 {count} carte',
          other: 'Terminée \u2014 {count} cartes',
        },
        invertedPill: 'Inversée',
        invertedPillA11yLabel: 'Session inversée',
        optionsA11yLabel: 'Options pour la session {deckName}',
        started: 'Commencée le {date}',
        resumeButtonA11yLabel: 'Reprendre la session pour {deckName}',
        replayButtonA11yLabel: 'Rejouer la session pour {deckName}',
        reviewErrorsButtonA11yLabel: {
          one: 'Revoir {count} carte ratée ou incertaine pour {deckName}',
          other: 'Revoir {count} cartes ratées ou incertaines pour {deckName}',
        },
        reviewErrorsDoneA11yLabel:
          'Toutes les cartes ratées ou incertaines sont corrigées pour {deckName}',
      },
      sessionResultsBar: {
        progressA11yLabel:
          'Progression\u00a0: {answered} sur {cardCount} répondues \u2014 {ok} ok, {okeish} moyen, {notOk} pas ok',
      },
    },
    study: {
      studyScreen: {
        fallbackTitle: 'Session',
        unavailableTitle: 'Rien à étudier',
        unavailableMessage: "Cette session n'est plus disponible.",
        unavailableAction: 'Retour aux sessions',
      },
      progressHeader: {
        position: 'Carte {current} sur {total}',
        okCount: 'Ok {count}',
      },
      invertedPill: {
        text: 'Inversée',
        a11yLabel: 'Session inversée\u00a0: le recto affiche la réponse',
      },
      swipeHint: {
        reviewing:
          "Révision d'une carte déjà répondue \u2014 balayez vers la gauche pour revenir où vous étiez",
      },
      historyStrip: {
        a11yLabel: "Réponses jusqu'ici",
      },
      flipCard: {
        questionLabel: 'QUESTION',
        answerLabel: 'RÉPONSE',
        revealHint: 'Touchez pour révéler la réponse',
        backHint: 'Touchez pour revoir la question',
        showQuestionA11yLabel: 'Afficher la question',
        showAnswerA11yLabel: 'Afficher la réponse',
      },
      sessionSummary: {
        title: 'Session terminée',
        successRateA11yLabel: 'Taux de réussite {rate}',
        reviewedCount: 'Révisées\u00a0: {count}',
        studyAgainLabel: 'Étudier à nouveau tout le paquet',
        studyAgainButtonA11yLabel: 'Étudier à nouveau tout le paquet',
      },
      reviewSummary: {
        title: 'Révision terminée',
        stillToFix: '{count} à corriger',
        allFixed: 'Tout est corrigé',
      },
      summaryAction: {
        reviewLabel: 'Revoir les cartes ratées ou incertaines',
        reviewButtonA11yLabel: {
          one: 'Revoir {count} carte ratée ou incertaine',
          other: 'Revoir {count} cartes ratées ou incertaines',
        },
        backLabel: 'Retour aux sessions',
        backButtonA11yLabel: 'Retour aux sessions',
      },
    },
    categories: {
      categoriesScreen: {
        customSectionTitle: 'Catégories personnalisées',
        customSectionSubtitle: {
          one: '{count} disponible',
          other: '{count} disponibles',
        },
        customEmptyHint: 'Vos propres catégories apparaîtront ici.',
        defaultSectionTitle: 'Catégories par défaut',
        defaultSectionSubtitle: {
          one: '{count} intégrée',
          other: '{count} intégrées',
        },
        newCategoryButton: 'Nouvelle catégorie',
        categoryTileA11yLabel: 'Options pour {name}',
      },
      categoryOptionsMenu: {
        deleteItem: 'Supprimer la catégorie',
      },
      deleteCategoryAlert: {
        title: 'Supprimer la catégorie\u00a0?',
        message: '«\u00a0{name}\u00a0» sera supprimée.',
        messageWithDecks: {
          one: "«\u00a0{name}\u00a0» sera supprimée. {count} paquet n'aura plus de catégorie.",
          other:
            "«\u00a0{name}\u00a0» sera supprimée. {count} paquets n'auront plus de catégorie.",
        },
      },
      newCategoryScreen: {
        saveButtonA11yLabel: 'Enregistrer la catégorie',
        nameField: 'Nom',
        colourLabel: 'Couleur',
        iconLabel: 'Icône',
        nameCounter: '{length}/{max}',
        nameErrors: {
          empty: 'Saisissez un nom.',
          tooLong: {
            one: 'Utilisez {count} caractère au maximum.',
            other: 'Utilisez {count} caractères au maximum.',
          },
          duplicate: 'Une catégorie portant ce nom existe déjà.',
        },
      },
      discardChangesAlert: {
        title: 'Abandonner les modifications\u00a0?',
        message: "Cette catégorie n'a pas été enregistrée.",
      },
      tilePreview: {
        placeholder: 'Nom de la catégorie',
        a11yLabel: 'Aperçu\u00a0: {name}',
        noNameA11yLabel: 'Aperçu\u00a0: pas encore de nom',
      },
      colourPicker: {
        a11yLabel: 'Sélecteur de couleur',
        swatchA11yLabel: 'Couleur {position} sur {total}',
      },
      customColourSwatch: {
        a11yLabel: 'Couleur personnalisée',
        a11yHint: 'Ouvre le sélecteur de couleur',
      },
      iconPicker: {
        a11yLabel: "Sélecteur d'icône",
      },
      customColourDialog: {
        title: 'Couleur personnalisée',
        hueLabel: 'Teinte',
        hueValue: '{value}°',
        saturationLabel: 'Saturation',
        brightnessLabel: 'Luminosité',
        percentValue: '{value}%',
        previewA11yLabel: 'Aperçu de la couleur {color}',
        tooDark: "Trop sombre pour l'icône. Essayez une couleur plus claire.",
        useButton: 'Utiliser la couleur',
      },
      categorySquare: {
        a11yLabel: 'Catégorie\u00a0: {name}',
      },
    },
    stats: {
      statsScreen: {
        searchA11yLabel: 'Rechercher des paquets',
        searchPlaceholder: 'Rechercher des paquets',
        aggregatedHeading: 'Statistiques globales',
        decksTile: {
          label: 'Paquets',
          caption: 'Dans votre bibliothèque',
        },
        totalCardsTile: {
          label: 'Total des cartes',
          caption: 'Tous paquets confondus',
        },
        totalReviewsTile: {
          label: 'Total des révisions',
          caption: {
            all: 'Réponses enregistrées',
            month: 'Réponses ce mois-ci',
            week: 'Réponses des 7 derniers jours',
          },
        },
        sessionsTile: {
          label: 'Sessions',
          caption: '{count} en cours',
        },
        tileA11yLabel: '{label}\u00a0: {value}, {caption}',
        decksBreakdownHeading: 'Détail par paquet',
        deckCount: {
          one: '{count} paquet',
          other: '{count} paquets',
        },
        emptyState: {
          title: 'Pas encore de statistiques',
          message:
            'Importez un paquet et étudiez-le\u00a0; les résultats apparaîtront ici.',
        },
      },
      masteryRing: {
        summaryA11yLabel:
          'Taux de réussite {rate}. {shares}. Totaux\u00a0: {counts}',
        caption: 'Taux de réussite',
      },
      deckStatsCard: {
        summaryA11yLabel:
          '{name}\u00a0: {shares}, {cards}, {sessions}, {reviews}, dernière session {last}',
        openA11yHint: 'Ouvre les détails par carte',
        cardsLabel: 'Cartes',
        sessionsLabel: 'Sessions',
        reviewsLabel: 'Révisions',
        lastLabel: 'Dernière',
      },
      timeframeChips: {
        groupA11yLabel: 'Période',
      },
    },
    deckStats: {
      deckStatsScreen: {
        optionsA11yLabel: 'Options pour les statistiques de {deckName}',
        resetStatisticsMenuItem: 'Réinitialiser les statistiques',
        resetAlert: {
          title: 'Réinitialiser les statistiques',
          message:
            'Effacer tous les résultats et toutes les sessions enregistrés pour «\u00a0{deckName}\u00a0»\u00a0?',
        },
        notFound: {
          title: 'Paquet introuvable',
          message: 'Ce paquet a été supprimé.',
        },
        cardPerformanceTitle: 'Performance des cartes',
        subtitle: {
          one: '{count} carte · {sort}',
          other: '{count} cartes · {sort}',
        },
        subtitleNarrowed: {
          one: '{shown} sur {count} carte · {sort}',
          other: '{shown} sur {count} cartes · {sort}',
        },
        sortButtonA11yLabel: 'Trier les cartes\u00a0: {sort}',
        sortSheetTitle: 'Trier les cartes',
        noCards: {
          title: 'Aucune carte pour le moment',
          message:
            'Ajoutez des cartes à ce paquet pour voir les performances de chacune.',
        },
        statusEmpty: {
          needsReview: {
            title: 'Aucune carte à revoir',
            message: "Aucune carte n'est en dessous de 40% de réussite.",
          },
          learning: {
            title: 'Aucune carte en cours',
            message: "Aucune carte n'est entre 40% et 70% de réussite.",
          },
          mastered: {
            title: 'Aucune carte maîtrisée pour le moment',
            message: 'Une carte est maîtrisée à partir de 70% de réussite.',
          },
          new: {
            title: 'Aucune nouvelle carte',
            message: 'Chaque carte a été révisée au moins une fois.',
          },
        },
        showAllCardsButton: 'Afficher toutes les cartes',
        noMatches: {
          filteredMessage:
            'Aucun résultat pour «\u00a0{query}\u00a0» avec le filtre {status}.',
        },
      },
      deckIdentityRow: {
        categoryA11yLabel: 'Catégorie\u00a0: {name}',
      },
      deckMasteryCard: {
        successRateA11yLabel: 'Taux de réussite\u00a0: {rate}',
        successRateNoReviewsA11yLabel:
          'Taux de réussite\u00a0: pas encore de révision',
        successRateCaption: 'Taux de réussite',
        answerTile: {
          ok: '{count} ok, {percent}',
          okeish: '{count} moyen, {percent}',
          notOk: '{count} pas ok, {percent}',
        },
        answerTileNoReviews: {
          ok: '{count} ok, pas encore de révision',
          okeish: '{count} moyen, pas encore de révision',
          notOk: '{count} pas ok, pas encore de révision',
        },
        reviewsFigure: 'Révisions',
        sessionsFigure: 'Sessions',
        lastSessionFigure: 'Dernière session',
        figureA11yLabel: '{label}\u00a0: {value}',
        changeChip: {
          none: 'Aucun changement depuis la dernière session',
          up: '+{points} pts depuis la dernière session',
          down: '-{points} pts depuis la dernière session',
          noneA11yLabel: 'Taux de réussite inchangé depuis la dernière session',
          upA11yLabel: {
            one: 'Taux de réussite en hausse de {count} point depuis la dernière session',
            other:
              'Taux de réussite en hausse de {count} points depuis la dernière session',
          },
          downA11yLabel: {
            one: 'Taux de réussite en baisse de {count} point depuis la dernière session',
            other:
              'Taux de réussite en baisse de {count} points depuis la dernière session',
          },
        },
      },
      cardStatsRow: {
        footerNeverReviewed: 'Jamais révisée',
        footerReviewed: {
          one: '{count} révision · Révisée le {date}',
          other: '{count} révisions · Révisée le {date}',
        },
        neverReviewedA11yLabel:
          'Question\u00a0: {question}. Réponse\u00a0: {answer}. {status}. Jamais révisée.',
        reviewedA11yLabel: {
          one: 'Question\u00a0: {question}. Réponse\u00a0: {answer}. {status}, taux de réussite {rate}. {count} révision\u00a0: {ok} ok, {okeish} moyen, {notOk} pas ok.',
          other:
            'Question\u00a0: {question}. Réponse\u00a0: {answer}. {status}, taux de réussite {rate}. {count} révisions\u00a0: {ok} ok, {okeish} moyen, {notOk} pas ok.',
        },
        reviewedOnA11yLabel: {
          one: 'Question\u00a0: {question}. Réponse\u00a0: {answer}. {status}, taux de réussite {rate}. {count} révision\u00a0: {ok} ok, {okeish} moyen, {notOk} pas ok. Révisée le {date}.',
          other:
            'Question\u00a0: {question}. Réponse\u00a0: {answer}. {status}, taux de réussite {rate}. {count} révisions\u00a0: {ok} ok, {okeish} moyen, {notOk} pas ok. Révisée le {date}.',
        },
      },
      cardStatusChips: {
        groupA11yLabel: 'Statut de la carte',
        allChip: 'Toutes',
        chipLabel: '{label} ({count})',
        chipA11yLabel: {
          one: '{label}, {count} carte',
          other: '{label}, {count} cartes',
        },
      },
      cardSearchField: {
        searchA11yLabel: 'Rechercher des cartes',
        searchPlaceholder: 'Rechercher dans les questions et réponses',
        clearA11yLabel: 'Effacer la recherche de cartes',
      },
      sessionHistoryChart: {
        title: 'Historique des sessions',
        subtitleLatest: 'Les {shown} dernières sur {total}',
        empty: {
          title: 'Aucune session pour ce paquet',
          message:
            "Lancez-en une depuis l'onglet Paquets et ses résultats s'afficheront ici.",
        },
        unansweredLegend: 'Sans réponse',
        legendNote: '% des cartes de chaque session',
        sessionA11yLabel: {
          one: 'Session du {date}\u00a0: taux de réussite {rate}, {answered} sur {count} carte répondue \u2014 {ok} ok, {okeish} moyen, {notOk} pas ok',
          other:
            'Session du {date}\u00a0: taux de réussite {rate}, {answered} sur {count} cartes répondues \u2014 {ok} ok, {okeish} moyen, {notOk} pas ok',
        },
        sessionNoAnswersA11yLabel: {
          one: 'Session du {date}\u00a0: taux de réussite non disponible, {answered} sur {count} carte répondue \u2014 {ok} ok, {okeish} moyen, {notOk} pas ok',
          other:
            'Session du {date}\u00a0: taux de réussite non disponible, {answered} sur {count} cartes répondues \u2014 {ok} ok, {okeish} moyen, {notOk} pas ok',
        },
      },
    },
  },
};
