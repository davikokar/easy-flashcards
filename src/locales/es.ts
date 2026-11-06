import type { Catalogue, Language, PluralRule } from '../utils/i18n';

// CLDR also has a `many` form for exact multiples of 1,000,000; it is deliberately not implemented.
export const esPlural: PluralRule = count => (count === 1 ? 'one' : 'other');

const messages: Catalogue = {
  common: {
    actions: {
      back: 'Atrás',
      cancel: 'Cancelar',
      clear: 'Limpiar',
      close: 'Cerrar',
      delete: 'Eliminar',
      discard: 'Descartar',
      export: 'Exportar',
      keepEditing: 'Seguir editando',
      ok: 'Aceptar',
      reset: 'Restablecer',
      save: 'Guardar',
      start: 'Iniciar',
    },
    search: {
      noMatchesTitle: 'Sin coincidencias',
      noMatchesMessage: 'Nada coincide con "{query}".',
      clearSearchButton: 'Borrar búsqueda',
    },
    counts: {
      cards: {
        one: '{count} tarjeta',
        other: '{count} tarjetas',
      },
      sessions: {
        one: '{count} sesión',
        other: '{count} sesiones',
      },
      reviews: {
        one: '{count} repaso',
        other: '{count} repasos',
      },
    },
  },
  navigation: {
    tabs: {
      decks: 'Mazos',
      learn: 'Aprender',
      categories: 'Categorías',
      statistics: 'Estadísticas',
    },
    headers: {
      decksList: 'Mazos',
      editDeck: 'Editar mazo',
      newDeck: 'Nuevo mazo',
      learnList: 'Aprender',
      study: 'Sesión',
      categoriesList: 'Categorías',
      newCategory: 'Nueva categoría',
      statsOverview: 'Estadísticas',
      deckStats: 'Estadísticas del mazo',
    },
  },
  answers: {
    answerLabels: {
      ok: 'Bien',
      okeish: 'Regular',
      notOk: 'Mal',
    },
    shares: {
      notReviewed: 'Aún sin repasar',
      summary: '{ok} Bien, {okeish} Regular, {notOk} Mal',
    },
    cardStatus: {
      needsReview: 'Por repasar',
      learning: 'Aprendiendo',
      mastered: 'Dominada',
      new: 'Nueva',
    },
    timeframes: {
      all: 'Todo el tiempo',
      month: 'Este mes',
      week: 'Últimos 7 días',
    },
    sortOrders: {
      hardest: 'Más difíciles primero',
      deck: 'Orden del mazo',
      recent: 'Repasadas recientemente',
    },
    dates: {
      never: 'Nunca',
    },
  },
  importExport: {
    defaultDeckName: 'Mazo importado',
    importErrors: {
      emptyFile: 'El archivo seleccionado está vacío.',
      notADeck:
        'Este no es un archivo de mazo de Easy Flashcards. Elige un archivo JSON exportado desde la aplicación.',
      newerVersion:
        'Este archivo de mazo se creó con una versión más reciente de Easy Flashcards. Actualiza la aplicación para importarlo.',
      noCards:
        'No se encontraron tarjetas utilizables. Cada tarjeta necesita una pregunta y una respuesta.',
      noHeader:
        'No se encontró la fila de encabezado. La primera línea que no esté en blanco ni sea un comentario con "#" debe nombrar una columna "question" y una columna "answer", separadas por una coma, un punto y coma, un tabulador u otro símbolo.',
      noUsableRows:
        'No se encontraron filas utilizables. Cada fila necesita una pregunta y una respuesta.',
      unreadable: 'No se pudo leer el archivo seleccionado.',
    },
    importAlert: {
      successTitle: 'Mazo importado',
      successMessage: {
        one: '"{name}" ahora tiene {count} tarjeta.',
        other: '"{name}" ahora tiene {count} tarjetas.',
      },
      skippedRows: {
        one: '{count} fila incompleta omitida.',
        other: '{count} filas incompletas omitidas.',
      },
      skippedCards: {
        one: '{count} tarjeta incompleta omitida.',
        other: '{count} tarjetas incompletas omitidas.',
      },
      failedTitle: 'Error al importar',
      failedWithDetails: 'No se pudo importar el archivo: {details}',
      failedUnknown: 'Error desconocido al importar el archivo.',
    },
    exportAlert: {
      successTitle: 'Mazo exportado',
      savedAs: 'Guardado como {name}.',
      saved: 'El mazo se guardó.',
      failedTitle: 'Error al exportar',
      deckGone: 'Este mazo ya no existe.',
      failedFallback: 'No se pudo exportar el mazo.',
    },
    separators: {
      comma: 'Coma (,)',
      semicolon: 'Punto y coma (;)',
      tab: 'Tabulador',
    },
    sampleExport: {
      successTitle: 'Mazo de ejemplo exportado',
      partlyTitle: 'Mazo de ejemplo exportado parcialmente',
      failedTitle: 'Error al exportar',
      savedAsOne: 'Guardado como {name}.',
      savedAsTwo: 'Guardado como {first} y {second}.',
      fileFailed: 'No se pudo guardar el archivo {format}: {details}',
      fileNotSaved: 'No se guardó el archivo {format}.',
      unknownError: 'Error desconocido',
    },
  },
  categoryNames: {
    builtIn: {
      astronomy: 'Astronomía',
      biology: 'Biología',
      botany: 'Botánica',
      chemistry: 'Química',
      cinema: 'Cine',
      computer_science: 'Informática',
      economics: 'Economía',
      gastronomy: 'Gastronomía',
      geography: 'Geografía',
      history: 'Historia',
      languages: 'Idiomas',
      law: 'Derecho',
      literature: 'Literatura',
      mathematics: 'Matemáticas',
      medicine: 'Medicina',
      music: 'Música',
      philosophy: 'Filosofía',
      physics: 'Física',
      religion: 'Religión',
      sport: 'Deporte',
      zoology: 'Zoología',
    },
    icons: {
      plane_contrails: 'Avión',
      anchor: 'Ancla',
      nutrition: 'Manzana',
      emergency: 'Asterisco',
      microbiology: 'Bacteria',
      finance: 'Gráfico de barras',
      sports_basketball: 'Baloncesto',
      neurology: 'Cerebro',
      bug_report: 'Insecto',
      calendar_month: 'Calendario',
      photo_camera: 'Cámara',
      camera: 'Diafragma de cámara',
      cannabis: 'Hoja de cannabis',
      directions_car: 'Automóvil',
      chess_pawn: 'Peón de ajedrez',
      language_chinese_dayi: 'Letras chinas y latinas',
      location_city: 'Ciudad',
      circle_circle: 'Círculos concéntricos',
      restaurant: 'Cubiertos',
      database: 'Base de datos',
      nest_heat_link_e: 'Punto en un círculo',
      engineering: 'Ingeniero',
      face: 'Cara',
      face_3: 'Cara con pelo',
      theaters: 'Tira de película',
      flag_2: 'Bandera',
      science: 'Matraz',
      save: 'Disquete',
      sports_and_outdoors: 'Balón de fútbol',
      skillet: 'Sartén',
      sports_esports: 'Gamepad',
      language: 'Globo terráqueo',
      diversity_3: 'Grupo de personas',
      psychology: 'Cabeza con engranaje',
      headphones: 'Auriculares',
      health_and_safety: 'Escudo de salud',
      landscape_2: 'Colinas',
      hive: 'Panal',
      hourglass_empty: 'Reloj de arena',
      house: 'Casa',
      icecream: 'Helado',
      temp_preferences_eco: 'Hojas',
      electric_bolt: 'Rayo',
      wand_stars: 'Varita mágica',
      biotech: 'Microscopio',
      mindfulness: 'Atención plena',
      motorcycle: 'Motocicleta',
      music_note_2: 'Nota musical',
      network_node: 'Red',
      import_contacts: 'Libro abierto',
      pan_tool: 'Mano abierta',
      pets: 'Huella de pata',
      stylus: 'Lápiz',
      person: 'Persona',
      history_edu: 'Pluma y papel',
      radio: 'Radio',
      raven: 'Cuervo',
      rib_cage: 'Caja torácica',
      rocket_launch: 'Cohete',
      scatter_plot: 'Diagrama de dispersión',
      category: 'Formas',
      interests: 'Formas y corazón',
      shopping_cart: 'Carrito de compras',
      functions: 'Sigma',
      skull: 'Calavera',
      emoji_language: 'Carita sonriente y globo terráqueo',
      snowflake: 'Copo de nieve',
      hotel_class: 'Estrella',
      mountain_flag: 'Bandera en la cima',
      sunny: 'Sol',
      mixture_med: 'Jeringa y pastilla',
      temple_buddhist: 'Templo',
      text_snippet: 'Documento de texto',
      theater_comedy: 'Máscaras de teatro',
      nest_thermostat_gen_3: 'Termostato',
      translate: 'Traducir',
      nature: 'Árbol',
      fertile: 'Tulipán',
      videocam: 'Videocámara',
      coronavirus: 'Virus',
      volcano: 'Volcán',
      warning: 'Advertencia',
      water: 'Olas',
      air: 'Viento',
      build: 'Llave inglesa',
    },
  },
  shell: {
    appMenu: {
      triggerA11yLabel: 'Menú de la aplicación',
      exportSampleDeckItem: 'Exportar mazo de ejemplo',
      settingsItem: 'Ajustes',
    },
    settingsAlert: {
      title: 'Ajustes',
      message: 'Los ajustes aún no están disponibles.',
    },
    exportSampleDeckDialog: {
      title: 'Exportar mazo de ejemplo',
      body: 'Esto guarda el mismo mazo de ejemplo en dos archivos, CSV y JSON. Se te pregunta dónde guardar cada uno y puedes cancelar cualquiera de los dos para omitirlo.\n\nCSV: las líneas que empiezan por # (título, descripción, categoría) se omiten al importar; después van un encabezado "question" / "answer" y una tarjeta por fila, separadas aquí por punto y coma (también sirven una coma, un tabulador u otro símbolo único).\n\nJSON: también recupera el título, la descripción y la categoría.\n\nSe admite HTML básico como <b>, <i> y <br /> en cualquiera de los dos lados de una tarjeta.',
    },
    kebabMenu: {
      triggerA11yLabel: 'Más opciones',
    },
    searchBar: {
      inputA11yLabel: 'Texto de búsqueda',
      closeButtonA11yLabel: 'Cerrar búsqueda',
    },
  },
  decks: {
    decksScreen: {
      searchA11yLabel: 'Buscar mazos',
      searchPlaceholder: 'Buscar mazos',
      loadError: 'No se pudieron leer los mazos guardados.',
      addDeckA11yLabel: 'Añadir un mazo',
      emptyTitle: 'Aún no hay mazos',
      emptyMessage:
        'Usa el botón + para importar un archivo de mazo y crear tu primer mazo.',
    },
    emptyDeckAlert: {
      title: 'Mazo vacío',
      message: 'Este mazo no tiene tarjetas para estudiar.',
    },
    deleteDeckAlert: {
      title: 'Eliminar mazo',
      message: '¿Eliminar "{name}", sus sesiones y todas sus estadísticas?',
    },
    addDeckMenu: {
      title: 'Añadir un mazo',
      importItem: 'Importar mazo desde archivo',
      manualItem: 'Añadir mazo manualmente',
    },
    deckOptionsMenu: {
      startWithOptionsItem: 'Iniciar sesión con opciones',
      editItem: 'Editar mazo',
      exportItem: 'Exportar a archivo',
      deleteItem: 'Eliminar mazo',
    },
    exportFormatMenu: {
      title: 'Exportar mazo a archivo',
    },
    csvSeparatorMenu: {
      title: 'Separador CSV',
      customItem: 'Personalizado…',
    },
    deckCard: {
      optionsA11yLabel: 'Opciones de {name}',
      activeCount: 'Activas: {count}',
      lastSession: 'Última: {date}',
      startA11yLabel: 'Iniciar sesión de {name}',
    },
    masteryBar: {
      a11yLabel: 'Dominio: {summary}',
    },
    sessionSetupDialog: {
      title: 'Iniciar sesión',
      invertedLabel: 'Invertida',
      invertedDescription:
        'Muestra primero la respuesta y la pregunta al dorso.',
      shuffleLabel: 'Mezclar',
      shuffleDescription: 'Estudia las tarjetas en orden aleatorio.',
    },
    customSeparatorDialog: {
      title: 'Separador personalizado',
      separatorLabel: 'Separador',
      separatorPlaceholder: 'Por ejemplo |',
      errors: {
        empty: 'Introduce un carácter.',
        tooLong: 'Usa un solo carácter.',
        reserved: 'No se pueden usar comillas, # ni saltos de línea.',
        whitespace:
          'No se permiten espacios. Usa la opción Tabulador para un tabulador.',
        alphanumeric: 'No se permiten letras ni dígitos.',
      },
    },
  },
  editDeck: {
    deckNotFound: {
      title: 'Mazo no encontrado',
      message: 'Este mazo ya no existe.',
      backButton: 'Volver a los mazos',
    },
    editDeckScreen: {
      titleLabel: 'Título',
      descriptionLabel: 'Descripción',
      descriptionPlaceholder: 'Opcional',
      saveButtonA11yLabel: 'Guardar mazo',
      addCardButton: 'Añadir tarjeta',
    },
    titleNeededAlert: {
      title: 'Falta el título',
      message: 'Ponle un título al mazo.',
    },
    cardIncompleteAlert: {
      title: 'Tarjeta incompleta',
      message: 'La tarjeta {number} necesita una pregunta y una respuesta.',
    },
    removeCardsAlert: {
      title: '¿Quitar tarjetas?',
      message: {
        one: 'Se quitará {count} tarjeta del mazo, junto con sus estadísticas.',
        other:
          'Se quitarán {count} tarjetas del mazo, junto con sus estadísticas.',
      },
    },
    discardChangesAlert: {
      title: '¿Descartar cambios?',
      messageEdit: 'Tus cambios en este mazo no se han guardado.',
      messageNew: 'Este mazo no se ha guardado.',
    },
    cardEditor: {
      title: 'Tarjeta {number}',
      removeButtonA11yLabel: 'Quitar tarjeta {number}',
      questionLabel: 'Pregunta',
      questionA11yLabel: 'Pregunta de la tarjeta {number}',
      answerLabel: 'Respuesta',
      answerA11yLabel: 'Respuesta de la tarjeta {number}',
    },
    categoryField: {
      label: 'Categoría',
      a11yLabel: 'Categoría: {name}',
      a11yLabelNone: 'Categoría: ninguna',
      a11yHint: 'Abre el selector de categoría',
      noneValue: 'Sin categoría',
    },
    categoryPicker: {
      title: 'Categoría',
      groupA11yLabel: 'Selector de categoría',
      noneTile: 'Sin categoría',
    },
  },
  learn: {
    learnScreen: {
      searchA11yLabel: 'Buscar sesiones',
      searchPlaceholder: 'Buscar sesiones',
    },
    headerToolbar: {
      clearCompletedItem: 'Limpiar sesiones completadas',
    },
    emptyState: {
      noSessionsTitle: 'Aún no hay sesiones',
      noSessionsMessage:
        'Elige un mazo e inicia una sesión de estudio; aparecerá aquí hasta que la termines.',
      allClearedTitle: 'No hay sesiones que mostrar',
      allClearedMessage:
        'Las sesiones limpiadas siguen contando en Estadísticas. Inicia una sesión nueva desde un mazo para verla aquí.',
      goToDecksButton: 'Ir a los mazos',
    },
    deckUnavailableAlert: {
      title: 'Mazo no disponible',
      message: 'Este mazo ya no existe o no tiene tarjetas.',
    },
    clearCompletedSessionsAlert: {
      title: 'Limpiar sesiones completadas',
      nothingToClear: 'No hay sesiones completadas que limpiar.',
      message: {
        one: '¿Quitar {count} sesión completada de esta lista? Sus resultados se conservan en Estadísticas.',
        other:
          '¿Quitar {count} sesiones completadas de esta lista? Sus resultados se conservan en Estadísticas.',
      },
    },
    discardSessionAlert: {
      title: 'Descartar sesión',
      message:
        '¿Descartar la sesión sin terminar de "{deckName}"? Sus respuestas también se quitan de Estadísticas.',
    },
    clearSessionAlert: {
      title: 'Limpiar sesión',
      message:
        '¿Quitar de esta lista la sesión completada de "{deckName}"? Sus resultados se conservan en Estadísticas.',
    },
    sessionOptionsMenu: {
      discardItem: 'Descartar sesión',
      clearItem: 'Limpiar sesión',
    },
    sessionCard: {
      inProgressStatus: {
        one: 'En curso \u2014 {answered}/{count} tarjeta',
        other: 'En curso \u2014 {answered}/{count} tarjetas',
      },
      completedStatus: {
        one: 'Completada \u2014 {count} tarjeta',
        other: 'Completada \u2014 {count} tarjetas',
      },
      invertedPill: 'Invertida',
      invertedPillA11yLabel: 'Sesión invertida',
      optionsA11yLabel: 'Opciones de la sesión de {deckName}',
      started: 'Iniciada {date}',
      resumeButtonA11yLabel: 'Reanudar la sesión de {deckName}',
      replayButtonA11yLabel: 'Repetir la sesión de {deckName}',
      reviewErrorsButtonA11yLabel: {
        one: 'Repasar la {count} tarjeta fallada o dudosa de {deckName}',
        other: 'Repasar las {count} tarjetas falladas o dudosas de {deckName}',
      },
      reviewErrorsDoneA11yLabel:
        'Todas las tarjetas falladas o dudosas de {deckName} corregidas',
    },
    sessionResultsBar: {
      progressA11yLabel:
        'Progreso: {answered} de {cardCount} respondidas \u2014 {ok} bien, {okeish} regular, {notOk} mal',
    },
  },
  study: {
    studyScreen: {
      fallbackTitle: 'Sesión',
      unavailableTitle: 'Nada que estudiar',
      unavailableMessage: 'Esta sesión ya no está disponible.',
      unavailableAction: 'Volver a las sesiones',
    },
    progressHeader: {
      position: 'Tarjeta {current} de {total}',
      okCount: 'Bien {count}',
    },
    invertedPill: {
      text: 'Invertida',
      a11yLabel: 'Sesión invertida: el anverso muestra la respuesta',
    },
    swipeHint: {
      reviewing:
        'Viendo una tarjeta ya respondida \u2014 desliza a la izquierda para volver donde estabas',
    },
    historyStrip: {
      a11yLabel: 'Respuestas hasta ahora',
    },
    flipCard: {
      questionLabel: 'PREGUNTA',
      answerLabel: 'RESPUESTA',
      revealHint: 'Toca para mostrar la respuesta',
      backHint: 'Toca para volver a ver la pregunta',
      showQuestionA11yLabel: 'Mostrar pregunta',
      showAnswerA11yLabel: 'Mostrar respuesta',
    },
    sessionSummary: {
      title: 'Sesión completada',
      successRateA11yLabel: 'Tasa de acierto {rate}',
      reviewedCount: 'Repasadas {count}',
      studyAgainLabel: 'Estudiar todo el mazo de nuevo',
      studyAgainButtonA11yLabel: 'Estudiar todo el mazo de nuevo',
    },
    reviewSummary: {
      title: 'Repaso completado',
      stillToFix: '{count} por corregir',
      allFixed: 'Todo corregido',
    },
    summaryAction: {
      reviewLabel: 'Repasar las tarjetas falladas o dudosas',
      reviewButtonA11yLabel: {
        one: 'Repasar la {count} tarjeta fallada o dudosa',
        other: 'Repasar las {count} tarjetas falladas o dudosas',
      },
      backLabel: 'Volver a las sesiones',
      backButtonA11yLabel: 'Volver a las sesiones',
    },
  },
  categories: {
    categoriesScreen: {
      customSectionTitle: 'Categorías personalizadas',
      customSectionSubtitle: {
        one: '{count} disponible',
        other: '{count} disponibles',
      },
      customEmptyHint: 'Tus propias categorías aparecerán aquí.',
      defaultSectionTitle: 'Categorías predeterminadas',
      defaultSectionSubtitle: {
        one: '{count} integrada',
        other: '{count} integradas',
      },
      newCategoryButton: 'Nueva categoría',
      categoryTileA11yLabel: 'Opciones de {name}',
    },
    categoryOptionsMenu: {
      deleteItem: 'Eliminar categoría',
    },
    deleteCategoryAlert: {
      title: '¿Eliminar categoría?',
      message: 'Se eliminará "{name}".',
      messageWithDecks: {
        one: 'Se eliminará "{name}". {count} mazo se quedará sin categoría.',
        other:
          'Se eliminará "{name}". {count} mazos se quedarán sin categoría.',
      },
    },
    newCategoryScreen: {
      saveButtonA11yLabel: 'Guardar categoría',
      nameField: 'Nombre',
      colourLabel: 'Color',
      iconLabel: 'Icono',
      nameCounter: '{length}/{max}',
      nameErrors: {
        empty: 'Introduce un nombre.',
        tooLong: {
          one: 'Usa como máximo {count} carácter.',
          other: 'Usa como máximo {count} caracteres.',
        },
        duplicate: 'Ya existe una categoría con este nombre.',
      },
    },
    discardChangesAlert: {
      title: '¿Descartar cambios?',
      message: 'Esta categoría no se ha guardado.',
    },
    tilePreview: {
      placeholder: 'Nombre de la categoría',
      a11yLabel: 'Vista previa: {name}',
      noNameA11yLabel: 'Vista previa: aún sin nombre',
    },
    colourPicker: {
      a11yLabel: 'Selector de color',
      swatchA11yLabel: 'Color {position} de {total}',
    },
    customColourSwatch: {
      a11yLabel: 'Color personalizado',
      a11yHint: 'Abre el selector de color',
    },
    iconPicker: {
      a11yLabel: 'Selector de icono',
    },
    customColourDialog: {
      title: 'Color personalizado',
      hueLabel: 'Tono',
      hueValue: '{value}°',
      saturationLabel: 'Saturación',
      brightnessLabel: 'Brillo',
      percentValue: '{value}%',
      previewA11yLabel: 'Vista previa del color {color}',
      tooDark: 'Demasiado oscuro para el icono. Prueba con un color más claro.',
      useButton: 'Usar color',
    },
    categorySquare: {
      a11yLabel: 'Categoría: {name}',
    },
  },
  stats: {
    statsScreen: {
      searchA11yLabel: 'Buscar mazos',
      searchPlaceholder: 'Buscar mazos',
      aggregatedHeading: 'Estadísticas globales',
      decksTile: {
        label: 'Mazos',
        caption: 'En tu biblioteca',
      },
      totalCardsTile: {
        label: 'Tarjetas totales',
        caption: 'En todos los mazos',
      },
      totalReviewsTile: {
        label: 'Repasos totales',
        caption: {
          all: 'Respuestas registradas',
          month: 'Respuestas este mes',
          week: 'Respuestas en los últimos 7 días',
        },
      },
      sessionsTile: {
        label: 'Sesiones',
        caption: 'Activas: {count}',
      },
      tileA11yLabel: '{label}: {value}, {caption}',
      decksBreakdownHeading: 'Desglose por mazo',
      deckCount: {
        one: '{count} mazo',
        other: '{count} mazos',
      },
      emptyState: {
        title: 'Aún no hay estadísticas',
        message: 'Importa un mazo y estúdialo; los resultados aparecerán aquí.',
      },
    },
    masteryRing: {
      summaryA11yLabel: 'Tasa de acierto {rate}. {shares}. Recuentos: {counts}',
      caption: 'Tasa de acierto',
    },
    deckStatsCard: {
      summaryA11yLabel:
        '{name}: {shares}, {cards}, {sessions}, {reviews}, última {last}',
      openA11yHint: 'Abre los detalles por tarjeta',
      cardsLabel: 'Tarjetas',
      sessionsLabel: 'Sesiones',
      reviewsLabel: 'Repasos',
      lastLabel: 'Última',
    },
    timeframeChips: {
      groupA11yLabel: 'Periodo',
    },
  },
  deckStats: {
    deckStatsScreen: {
      optionsA11yLabel: 'Opciones de las estadísticas de {deckName}',
      resetStatisticsMenuItem: 'Restablecer estadísticas',
      resetAlert: {
        title: 'Restablecer estadísticas',
        message:
          '¿Borrar todos los resultados y sesiones registrados de "{deckName}"?',
      },
      notFound: {
        title: 'Mazo no encontrado',
        message: 'Este mazo se ha eliminado.',
      },
      cardPerformanceTitle: 'Rendimiento de las tarjetas',
      subtitle: {
        one: '{count} tarjeta · {sort}',
        other: '{count} tarjetas · {sort}',
      },
      subtitleNarrowed: {
        one: '{shown} de {count} tarjeta · {sort}',
        other: '{shown} de {count} tarjetas · {sort}',
      },
      sortButtonA11yLabel: 'Ordenar tarjetas: {sort}',
      sortSheetTitle: 'Ordenar tarjetas',
      noCards: {
        title: 'Aún no hay tarjetas',
        message: 'Añade tarjetas a este mazo para ver cómo rinde cada una.',
      },
      statusEmpty: {
        needsReview: {
          title: 'Ninguna tarjeta por repasar',
          message: 'Ninguna tarjeta está por debajo del 40% de aciertos.',
        },
        learning: {
          title: 'Ninguna tarjeta en aprendizaje',
          message: 'Ninguna tarjeta está entre el 40% y el 70% de aciertos.',
        },
        mastered: {
          title: 'Aún no hay tarjetas dominadas',
          message: 'Una tarjeta está dominada con un 70% de aciertos o más.',
        },
        new: {
          title: 'No hay tarjetas nuevas',
          message: 'Todas las tarjetas se han repasado al menos una vez.',
        },
      },
      showAllCardsButton: 'Mostrar todas las tarjetas',
      noMatches: {
        filteredMessage: 'Nada coincide con "{query}" con el filtro {status}.',
      },
    },
    deckIdentityRow: {
      categoryA11yLabel: 'Categoría: {name}',
    },
    deckMasteryCard: {
      successRateA11yLabel: 'Tasa de acierto: {rate}',
      successRateNoReviewsA11yLabel: 'Tasa de acierto: aún sin repasos',
      successRateCaption: 'Tasa de acierto',
      answerTile: {
        ok: '{count} bien, {percent}',
        okeish: '{count} regular, {percent}',
        notOk: '{count} mal, {percent}',
      },
      answerTileNoReviews: {
        ok: '{count} bien, aún sin repasos',
        okeish: '{count} regular, aún sin repasos',
        notOk: '{count} mal, aún sin repasos',
      },
      reviewsFigure: 'Repasos',
      sessionsFigure: 'Sesiones',
      lastSessionFigure: 'Última sesión',
      figureA11yLabel: '{label}: {value}',
      changeChip: {
        none: 'Sin cambios desde la última sesión',
        up: '+{points} pts desde la última sesión',
        down: '-{points} pts desde la última sesión',
        noneA11yLabel:
          'La tasa de acierto no ha cambiado desde la última sesión',
        upA11yLabel: {
          one: 'La tasa de acierto ha subido {count} punto desde la última sesión',
          other:
            'La tasa de acierto ha subido {count} puntos desde la última sesión',
        },
        downA11yLabel: {
          one: 'La tasa de acierto ha bajado {count} punto desde la última sesión',
          other:
            'La tasa de acierto ha bajado {count} puntos desde la última sesión',
        },
      },
    },
    cardStatsRow: {
      footerNeverReviewed: 'Nunca repasada',
      footerReviewed: {
        one: '{count} repaso · Repasada {date}',
        other: '{count} repasos · Repasada {date}',
      },
      neverReviewedA11yLabel:
        'Pregunta: {question}. Respuesta: {answer}. {status}. Nunca repasada.',
      reviewedA11yLabel: {
        one: 'Pregunta: {question}. Respuesta: {answer}. {status}, tasa de acierto {rate}. {count} repaso: {ok} bien, {okeish} regular, {notOk} mal.',
        other:
          'Pregunta: {question}. Respuesta: {answer}. {status}, tasa de acierto {rate}. {count} repasos: {ok} bien, {okeish} regular, {notOk} mal.',
      },
      reviewedOnA11yLabel: {
        one: 'Pregunta: {question}. Respuesta: {answer}. {status}, tasa de acierto {rate}. {count} repaso: {ok} bien, {okeish} regular, {notOk} mal. Repasada {date}.',
        other:
          'Pregunta: {question}. Respuesta: {answer}. {status}, tasa de acierto {rate}. {count} repasos: {ok} bien, {okeish} regular, {notOk} mal. Repasada {date}.',
      },
    },
    cardStatusChips: {
      groupA11yLabel: 'Estado de la tarjeta',
      allChip: 'Todas',
      chipLabel: '{label} ({count})',
      chipA11yLabel: {
        one: '{label}, {count} tarjeta',
        other: '{label}, {count} tarjetas',
      },
    },
    cardSearchField: {
      searchA11yLabel: 'Buscar tarjetas',
      searchPlaceholder: 'Buscar en preguntas y respuestas',
      clearA11yLabel: 'Borrar búsqueda de tarjetas',
    },
    sessionHistoryChart: {
      title: 'Historial de sesiones',
      subtitleLatest: 'Últimas {shown} de {total}',
      empty: {
        title: 'Este mazo no tiene sesiones',
        message:
          'Inicia una desde la pestaña Mazos y sus resultados aparecerán aquí.',
      },
      unansweredLegend: 'Sin responder',
      legendNote: '% de las tarjetas de cada sesión',
      sessionA11yLabel: {
        one: 'Sesión del {date}: tasa de acierto {rate}, tarjetas respondidas: {answered} de {count} \u2014 {ok} bien, {okeish} regular, {notOk} mal',
        other:
          'Sesión del {date}: tasa de acierto {rate}, tarjetas respondidas: {answered} de {count} \u2014 {ok} bien, {okeish} regular, {notOk} mal',
      },
      sessionNoAnswersA11yLabel: {
        one: 'Sesión del {date}: tasa de acierto sin respuestas aún, tarjetas respondidas: {answered} de {count} \u2014 {ok} bien, {okeish} regular, {notOk} mal',
        other:
          'Sesión del {date}: tasa de acierto sin respuestas aún, tarjetas respondidas: {answered} de {count} \u2014 {ok} bien, {okeish} regular, {notOk} mal',
      },
    },
  },
};

export const es: Language = { code: 'es', plural: esPlural, messages };
