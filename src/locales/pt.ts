// Brazilian Portuguese wording and spelling, registered under the generic code `pt`.
import type { Language, PluralRule } from '../utils/i18n';

// CLDR `pt` for integers: 0 and 1 are `one`; the `many` form for exact millions is not implemented.
export const ptPlural: PluralRule = count =>
  count === 0 || count === 1 ? 'one' : 'other';

export const pt: Language = {
  code: 'pt',
  plural: ptPlural,
  messages: {
    common: {
      actions: {
        back: 'Voltar',
        cancel: 'Cancelar',
        clear: 'Limpar',
        close: 'Fechar',
        delete: 'Excluir',
        discard: 'Descartar',
        export: 'Exportar',
        keepEditing: 'Continuar editando',
        ok: 'OK',
        reset: 'Redefinir',
        save: 'Salvar',
        start: 'Iniciar',
      },
      search: {
        noMatchesTitle: 'Nenhum resultado',
        noMatchesMessage: 'Nada corresponde a "{query}".',
        clearSearchButton: 'Limpar busca',
      },
      counts: {
        cards: {
          one: '{count} cartão',
          other: '{count} cartões',
        },
        sessions: {
          one: '{count} sessão',
          other: '{count} sessões',
        },
        reviews: {
          one: '{count} revisão',
          other: '{count} revisões',
        },
      },
    },
    navigation: {
      tabs: {
        decks: 'Baralhos',
        learn: 'Aprender',
        categories: 'Categorias',
        statistics: 'Estatísticas',
      },
      headers: {
        decksList: 'Baralhos',
        editDeck: 'Editar baralho',
        newDeck: 'Novo baralho',
        learnList: 'Aprender',
        study: 'Sessão',
        categoriesList: 'Categorias',
        newCategory: 'Nova categoria',
        statsOverview: 'Estatísticas',
        deckStats: 'Estatísticas do baralho',
      },
    },
    answers: {
      answerLabels: {
        ok: 'Ok',
        okeish: 'Quase ok',
        notOk: 'Não ok',
      },
      shares: {
        notReviewed: 'Ainda não revisado',
        summary: '{ok} Ok, {okeish} Quase ok, {notOk} Não ok',
      },
      cardStatus: {
        needsReview: 'Para revisar',
        learning: 'Aprendendo',
        mastered: 'Dominado',
        new: 'Novo',
      },
      timeframes: {
        all: 'Todo o período',
        month: 'Este mês',
        week: 'Últimos 7 dias',
      },
      sortOrders: {
        hardest: 'Mais difíceis primeiro',
        deck: 'Ordem do baralho',
        recent: 'Revisados recentemente',
      },
      dates: {
        never: 'Nunca',
      },
    },
    importExport: {
      defaultDeckName: 'Baralho importado',
      importErrors: {
        emptyFile: 'O arquivo selecionado está vazio.',
        notADeck:
          'Este não é um arquivo de baralho do Easy Flashcards. Escolha um arquivo JSON exportado pelo app.',
        newerVersion:
          'Este arquivo de baralho foi criado por uma versão mais recente do Easy Flashcards. Atualize o app para importá-lo.',
        noCards:
          'Nenhum cartão utilizável encontrado. Todo cartão precisa de uma pergunta e de uma resposta.',
        noHeader:
          'Nenhuma linha de cabeçalho encontrada. A primeira linha que não estiver em branco nem for um comentário "#" deve nomear uma coluna "question" e uma coluna "answer", separadas por vírgula, ponto e vírgula, tabulação ou outro símbolo.',
        noUsableRows:
          'Nenhuma linha utilizável encontrada. Toda linha precisa de uma pergunta e de uma resposta.',
        unreadable: 'Não foi possível ler o arquivo selecionado.',
      },
      importAlert: {
        successTitle: 'Baralho importado',
        successMessage: {
          one: '"{name}" agora tem {count} cartão.',
          other: '"{name}" agora tem {count} cartões.',
        },
        skippedRows: {
          one: '{count} linha incompleta ignorada.',
          other: '{count} linhas incompletas ignoradas.',
        },
        skippedCards: {
          one: '{count} cartão incompleto ignorado.',
          other: '{count} cartões incompletos ignorados.',
        },
        failedTitle: 'Falha na importação',
        failedWithDetails: 'Não foi possível importar o arquivo: {details}',
        failedUnknown: 'Erro desconhecido ao importar o arquivo.',
      },
      exportAlert: {
        successTitle: 'Baralho exportado',
        savedAs: 'Salvo como {name}.',
        saved: 'O baralho foi salvo.',
        failedTitle: 'Falha na exportação',
        deckGone: 'Este baralho não existe mais.',
        failedFallback: 'Não foi possível exportar o baralho.',
      },
      separators: {
        comma: 'Vírgula (,)',
        semicolon: 'Ponto e vírgula (;)',
        tab: 'Tabulação',
      },
      sampleExport: {
        successTitle: 'Baralho de exemplo exportado',
        partlyTitle: 'Baralho de exemplo exportado parcialmente',
        failedTitle: 'Falha na exportação',
        savedAsOne: 'Salvo como {name}.',
        savedAsTwo: 'Salvo como {first} e {second}.',
        fileFailed: 'Não foi possível salvar o arquivo {format}: {details}',
        fileNotSaved: 'O arquivo {format} não foi salvo.',
        unknownError: 'Erro desconhecido',
      },
    },
    categoryNames: {
      builtIn: {
        astronomy: 'Astronomia',
        biology: 'Biologia',
        botany: 'Botânica',
        chemistry: 'Química',
        cinema: 'Cinema',
        computer_science: 'Ciência da computação',
        economics: 'Economia',
        gastronomy: 'Gastronomia',
        geography: 'Geografia',
        history: 'História',
        languages: 'Idiomas',
        law: 'Direito',
        literature: 'Literatura',
        mathematics: 'Matemática',
        medicine: 'Medicina',
        music: 'Música',
        philosophy: 'Filosofia',
        physics: 'Física',
        religion: 'Religião',
        sport: 'Esporte',
        zoology: 'Zoologia',
      },
      icons: {
        plane_contrails: 'Avião',
        anchor: 'Âncora',
        nutrition: 'Maçã',
        emergency: 'Asterisco',
        microbiology: 'Bactéria',
        finance: 'Gráfico de barras',
        sports_basketball: 'Basquete',
        neurology: 'Cérebro',
        bug_report: 'Inseto',
        calendar_month: 'Calendário',
        photo_camera: 'Câmera',
        camera: 'Abertura da câmera',
        cannabis: 'Folha de cannabis',
        directions_car: 'Carro',
        chess_pawn: 'Peão de xadrez',
        language_chinese_dayi: 'Letras chinesas e latinas',
        location_city: 'Cidade',
        circle_circle: 'Círculos concêntricos',
        restaurant: 'Talheres',
        database: 'Banco de dados',
        nest_heat_link_e: 'Ponto em um círculo',
        engineering: 'Engenheiro',
        face: 'Rosto',
        face_3: 'Rosto com cabelo',
        theaters: 'Rolo de filme',
        flag_2: 'Bandeira',
        science: 'Frasco',
        save: 'Disquete',
        sports_and_outdoors: 'Futebol',
        skillet: 'Frigideira',
        sports_esports: 'Controle de videogame',
        language: 'Globo',
        diversity_3: 'Grupo de pessoas',
        psychology: 'Cabeça com engrenagem',
        headphones: 'Fones de ouvido',
        health_and_safety: 'Escudo de saúde',
        landscape_2: 'Colinas',
        hive: 'Favo de mel',
        hourglass_empty: 'Ampulheta',
        house: 'Casa',
        icecream: 'Sorvete',
        temp_preferences_eco: 'Folhas',
        electric_bolt: 'Raio',
        wand_stars: 'Varinha mágica',
        biotech: 'Microscópio',
        mindfulness: 'Atenção plena',
        motorcycle: 'Moto',
        music_note_2: 'Nota musical',
        network_node: 'Rede',
        import_contacts: 'Livro aberto',
        pan_tool: 'Mão aberta',
        pets: 'Pata',
        stylus: 'Lápis',
        person: 'Pessoa',
        history_edu: 'Pena e papel',
        radio: 'Rádio',
        raven: 'Corvo',
        rib_cage: 'Caixa torácica',
        rocket_launch: 'Foguete',
        scatter_plot: 'Gráfico de dispersão',
        category: 'Formas',
        interests: 'Formas e coração',
        shopping_cart: 'Carrinho de compras',
        functions: 'Sigma',
        skull: 'Caveira',
        emoji_language: 'Sorriso e globo',
        snowflake: 'Floco de neve',
        hotel_class: 'Estrela',
        mountain_flag: 'Bandeira no cume',
        sunny: 'Sol',
        mixture_med: 'Seringa e comprimido',
        temple_buddhist: 'Templo',
        text_snippet: 'Documento de texto',
        theater_comedy: 'Máscaras de teatro',
        nest_thermostat_gen_3: 'Termostato',
        translate: 'Traduzir',
        nature: 'Árvore',
        fertile: 'Tulipa',
        videocam: 'Câmera de vídeo',
        coronavirus: 'Vírus',
        volcano: 'Vulcão',
        warning: 'Alerta',
        water: 'Ondas',
        air: 'Vento',
        build: 'Chave inglesa',
      },
    },
    shell: {
      appMenu: {
        triggerA11yLabel: 'Menu do app',
        exportSampleDeckItem: 'Exportar baralho de exemplo',
        settingsItem: 'Configurações',
      },
      settingsAlert: {
        title: 'Configurações',
        message: 'As configurações ainda não estão disponíveis.',
      },
      exportSampleDeckDialog: {
        title: 'Exportar baralho de exemplo',
        body: 'Isto salva o mesmo baralho de exemplo em dois arquivos, CSV e JSON. Você escolhe onde salvar cada um e pode cancelar qualquer um deles para pulá-lo.\n\nCSV: as linhas que começam com # (título, descrição, categoria) são ignoradas na importação; depois vêm um cabeçalho "question" / "answer" e um cartão por linha, separados aqui por ponto e vírgula (vírgula, tabulação ou outro símbolo único também funciona).\n\nJSON: também restaura o título, a descrição e a categoria.\n\nHTML básico como <b>, <i> e <br /> é permitido nos dois lados de um cartão.',
      },
      kebabMenu: {
        triggerA11yLabel: 'Mais opções',
      },
      searchBar: {
        inputA11yLabel: 'Texto da busca',
        closeButtonA11yLabel: 'Fechar busca',
      },
    },
    decks: {
      decksScreen: {
        searchA11yLabel: 'Buscar baralhos',
        searchPlaceholder: 'Buscar baralhos',
        loadError: 'Não foi possível ler os baralhos salvos.',
        addDeckA11yLabel: 'Adicionar baralho',
        emptyTitle: 'Nenhum baralho ainda',
        emptyMessage:
          'Use o botão + para importar um arquivo de baralho e criar seu primeiro baralho.',
      },
      emptyDeckAlert: {
        title: 'Baralho vazio',
        message: 'Este baralho não tem cartões para aprender.',
      },
      deleteDeckAlert: {
        title: 'Excluir baralho',
        message: 'Excluir "{name}", suas sessões e todas as suas estatísticas?',
      },
      addDeckMenu: {
        title: 'Adicionar baralho',
        importItem: 'Importar baralho de arquivo',
        manualItem: 'Adicionar baralho manualmente',
      },
      deckOptionsMenu: {
        startWithOptionsItem: 'Iniciar sessão com opções',
        editItem: 'Editar baralho',
        exportItem: 'Exportar para arquivo',
        deleteItem: 'Excluir baralho',
      },
      exportFormatMenu: {
        title: 'Exportar baralho para arquivo',
      },
      csvSeparatorMenu: {
        title: 'Separador do CSV',
        customItem: 'Personalizado…',
      },
      deckCard: {
        optionsA11yLabel: 'Opções de {name}',
        activeCount: 'Ativas: {count}',
        lastSession: 'Última: {date}',
        startA11yLabel: 'Iniciar sessão de {name}',
      },
      masteryBar: {
        a11yLabel: 'Domínio: {summary}',
      },
      sessionSetupDialog: {
        title: 'Iniciar sessão',
        invertedLabel: 'Invertida',
        invertedDescription:
          'Mostra a resposta primeiro e a pergunta no verso.',
        shuffleLabel: 'Embaralhar',
        shuffleDescription: 'Estuda os cartões em ordem aleatória.',
      },
      customSeparatorDialog: {
        title: 'Separador personalizado',
        separatorLabel: 'Separador',
        separatorPlaceholder: 'Por exemplo |',
        errors: {
          empty: 'Digite um caractere.',
          tooLong: 'Use um único caractere.',
          reserved: 'Aspas, # e quebras de linha não podem ser usados.',
          whitespace:
            'Espaços não são permitidos. Use a opção Tabulação para uma tabulação.',
          alphanumeric: 'Letras e dígitos não são permitidos.',
        },
      },
    },
    editDeck: {
      deckNotFound: {
        title: 'Baralho não encontrado',
        message: 'Este baralho não existe mais.',
        backButton: 'Voltar aos baralhos',
      },
      editDeckScreen: {
        titleLabel: 'Título',
        descriptionLabel: 'Descrição',
        descriptionPlaceholder: 'Opcional',
        saveButtonA11yLabel: 'Salvar baralho',
        addCardButton: 'Adicionar cartão',
      },
      titleNeededAlert: {
        title: 'Título necessário',
        message: 'Dê um título ao baralho.',
      },
      cardIncompleteAlert: {
        title: 'Cartão incompleto',
        message: 'O cartão {number} precisa de uma pergunta e de uma resposta.',
      },
      removeCardsAlert: {
        title: 'Remover cartões?',
        message: {
          one: '{count} cartão será removido do baralho, junto com suas estatísticas.',
          other:
            '{count} cartões serão removidos do baralho, junto com suas estatísticas.',
        },
      },
      discardChangesAlert: {
        title: 'Descartar alterações?',
        messageEdit: 'As edições feitas neste baralho não foram salvas.',
        messageNew: 'Este baralho não foi salvo.',
      },
      cardEditor: {
        title: 'Cartão {number}',
        removeButtonA11yLabel: 'Remover cartão {number}',
        questionLabel: 'Pergunta',
        questionA11yLabel: 'Pergunta do cartão {number}',
        answerLabel: 'Resposta',
        answerA11yLabel: 'Resposta do cartão {number}',
      },
      categoryField: {
        label: 'Categoria',
        a11yLabel: 'Categoria: {name}',
        a11yLabelNone: 'Categoria: nenhuma',
        a11yHint: 'Abre o seletor de categoria',
        noneValue: 'Sem categoria',
      },
      categoryPicker: {
        title: 'Categoria',
        groupA11yLabel: 'Seletor de categoria',
        noneTile: 'Sem categoria',
      },
    },
    learn: {
      learnScreen: {
        searchA11yLabel: 'Buscar sessões',
        searchPlaceholder: 'Buscar sessões',
      },
      headerToolbar: {
        clearCompletedItem: 'Limpar sessões concluídas',
      },
      emptyState: {
        noSessionsTitle: 'Nenhuma sessão ainda',
        noSessionsMessage:
          'Escolha um baralho e inicie uma sessão de aprendizado; ela aparecerá aqui até você terminá-la.',
        allClearedTitle: 'Nenhuma sessão para mostrar',
        allClearedMessage:
          'As sessões limpas continuam contando nas Estatísticas. Inicie uma nova sessão a partir de um baralho para vê-la aqui.',
        goToDecksButton: 'Ir para os baralhos',
      },
      deckUnavailableAlert: {
        title: 'Baralho indisponível',
        message: 'Este baralho não existe mais ou não tem cartões.',
      },
      clearCompletedSessionsAlert: {
        title: 'Limpar sessões concluídas',
        nothingToClear: 'Não há sessões concluídas para limpar.',
        message: {
          one: 'Remover {count} sessão concluída desta lista? O resultado dela continua nas Estatísticas.',
          other:
            'Remover {count} sessões concluídas desta lista? Os resultados delas continuam nas Estatísticas.',
        },
      },
      discardSessionAlert: {
        title: 'Descartar sessão',
        message:
          'Descartar a sessão não concluída de "{deckName}"? As respostas dela também são removidas das Estatísticas.',
      },
      clearSessionAlert: {
        title: 'Limpar sessão',
        message:
          'Remover a sessão concluída de "{deckName}" desta lista? Os resultados dela continuam nas Estatísticas.',
      },
      sessionOptionsMenu: {
        discardItem: 'Descartar sessão',
        clearItem: 'Limpar sessão',
      },
      sessionCard: {
        inProgressStatus: {
          one: 'Em andamento \u2014 {answered}/{count} cartão',
          other: 'Em andamento \u2014 {answered}/{count} cartões',
        },
        completedStatus: {
          one: 'Concluída \u2014 {count} cartão',
          other: 'Concluída \u2014 {count} cartões',
        },
        invertedPill: 'Invertida',
        invertedPillA11yLabel: 'Sessão invertida',
        optionsA11yLabel: 'Opções da sessão de {deckName}',
        started: 'Iniciada em {date}',
        resumeButtonA11yLabel: 'Retomar sessão de {deckName}',
        replayButtonA11yLabel: 'Repetir sessão de {deckName}',
        reviewErrorsButtonA11yLabel: {
          one: 'Revisar {count} cartão errado ou incerto de {deckName}',
          other: 'Revisar {count} cartões errados ou incertos de {deckName}',
        },
        reviewErrorsDoneA11yLabel:
          'Todos os cartões errados ou incertos de {deckName} foram corrigidos',
      },
      sessionResultsBar: {
        progressA11yLabel:
          'Progresso: {answered} de {cardCount} respondidos \u2014 {ok} ok, {okeish} quase ok, {notOk} não ok',
      },
    },
    study: {
      studyScreen: {
        fallbackTitle: 'Sessão',
        unavailableTitle: 'Nada para estudar',
        unavailableMessage: 'Esta sessão não está mais disponível.',
        unavailableAction: 'Voltar às sessões',
      },
      progressHeader: {
        position: 'Cartão {current} de {total}',
        okCount: 'Ok {count}',
      },
      invertedPill: {
        text: 'Invertida',
        a11yLabel: 'Sessão invertida: a frente mostra a resposta',
      },
      swipeHint: {
        reviewing:
          'Revendo um cartão respondido \u2014 deslize para a esquerda para voltar de onde você parou',
      },
      historyStrip: {
        a11yLabel: 'Respostas até agora',
      },
      flipCard: {
        questionLabel: 'PERGUNTA',
        answerLabel: 'RESPOSTA',
        revealHint: 'Toque para revelar a resposta',
        backHint: 'Toque para ver a pergunta de novo',
        showQuestionA11yLabel: 'Mostrar pergunta',
        showAnswerA11yLabel: 'Mostrar resposta',
      },
      sessionSummary: {
        title: 'Sessão concluída',
        successRateA11yLabel: 'Taxa de acerto {rate}',
        reviewedCount: 'Revisados {count}',
        studyAgainLabel: 'Estudar o baralho inteiro de novo',
        studyAgainButtonA11yLabel: 'Estudar o baralho inteiro de novo',
      },
      reviewSummary: {
        title: 'Revisão concluída',
        stillToFix: '{count} ainda por corrigir',
        allFixed: 'Tudo corrigido',
      },
      summaryAction: {
        reviewLabel: 'Revisar os cartões errados ou incertos',
        reviewButtonA11yLabel: {
          one: 'Revisar {count} cartão errado ou incerto',
          other: 'Revisar {count} cartões errados ou incertos',
        },
        backLabel: 'Voltar às sessões',
        backButtonA11yLabel: 'Voltar às sessões',
      },
    },
    categories: {
      categoriesScreen: {
        customSectionTitle: 'Categorias personalizadas',
        customSectionSubtitle: {
          one: '{count} disponível',
          other: '{count} disponíveis',
        },
        customEmptyHint: 'Suas próprias categorias aparecerão aqui.',
        defaultSectionTitle: 'Categorias padrão',
        defaultSectionSubtitle: {
          one: '{count} integrada',
          other: '{count} integradas',
        },
        newCategoryButton: 'Nova categoria',
        categoryTileA11yLabel: 'Opções de {name}',
      },
      categoryOptionsMenu: {
        deleteItem: 'Excluir categoria',
      },
      deleteCategoryAlert: {
        title: 'Excluir categoria?',
        message: '"{name}" será excluída.',
        messageWithDecks: {
          one: '"{name}" será excluída. {count} baralho ficará sem categoria.',
          other:
            '"{name}" será excluída. {count} baralhos ficarão sem categoria.',
        },
      },
      newCategoryScreen: {
        saveButtonA11yLabel: 'Salvar categoria',
        nameField: 'Nome',
        colourLabel: 'Cor',
        iconLabel: 'Ícone',
        nameCounter: '{length}/{max}',
        nameErrors: {
          empty: 'Digite um nome.',
          tooLong: {
            one: 'Use {count} caractere ou menos.',
            other: 'Use {count} caracteres ou menos.',
          },
          duplicate: 'Já existe uma categoria com este nome.',
        },
      },
      discardChangesAlert: {
        title: 'Descartar alterações?',
        message: 'Esta categoria não foi salva.',
      },
      tilePreview: {
        placeholder: 'Nome da categoria',
        a11yLabel: 'Prévia: {name}',
        noNameA11yLabel: 'Prévia: ainda sem nome',
      },
      colourPicker: {
        a11yLabel: 'Seletor de cor',
        swatchA11yLabel: 'Cor {position} de {total}',
      },
      customColourSwatch: {
        a11yLabel: 'Cor personalizada',
        a11yHint: 'Abre o seletor de cores',
      },
      iconPicker: {
        a11yLabel: 'Seletor de ícone',
      },
      customColourDialog: {
        title: 'Cor personalizada',
        hueLabel: 'Matiz',
        hueValue: '{value}°',
        saturationLabel: 'Saturação',
        brightnessLabel: 'Brilho',
        percentValue: '{value}%',
        previewA11yLabel: 'Prévia da cor {color}',
        tooDark: 'Escuro demais para o ícone. Tente uma cor mais clara.',
        useButton: 'Usar cor',
      },
      categorySquare: {
        a11yLabel: 'Categoria: {name}',
      },
    },
    stats: {
      statsScreen: {
        searchA11yLabel: 'Buscar baralhos',
        searchPlaceholder: 'Buscar baralhos',
        aggregatedHeading: 'Estatísticas agregadas',
        decksTile: {
          label: 'Baralhos',
          caption: 'Na sua biblioteca',
        },
        totalCardsTile: {
          label: 'Total de cartões',
          caption: 'Em todos os baralhos',
        },
        totalReviewsTile: {
          label: 'Total de revisões',
          caption: {
            all: 'Respostas registradas',
            month: 'Respostas neste mês',
            week: 'Respostas nos últimos 7 dias',
          },
        },
        sessionsTile: {
          label: 'Sessões',
          caption: 'Ativas: {count}',
        },
        tileA11yLabel: '{label}: {value}, {caption}',
        decksBreakdownHeading: 'Detalhamento por baralho',
        deckCount: {
          one: '{count} baralho',
          other: '{count} baralhos',
        },
        emptyState: {
          title: 'Nenhuma estatística ainda',
          message:
            'Importe um baralho e estude-o; os resultados aparecerão aqui.',
        },
      },
      masteryRing: {
        summaryA11yLabel:
          'Taxa de acerto {rate}. {shares}. Contagens: {counts}',
        caption: 'Taxa de acerto',
      },
      deckStatsCard: {
        summaryA11yLabel:
          '{name}: {shares}, {cards}, {sessions}, {reviews}, última {last}',
        openA11yHint: 'Abre os detalhes por cartão',
        cardsLabel: 'Cartões',
        sessionsLabel: 'Sessões',
        reviewsLabel: 'Revisões',
        lastLabel: 'Última',
      },
      timeframeChips: {
        groupA11yLabel: 'Período',
      },
    },
    deckStats: {
      deckStatsScreen: {
        optionsA11yLabel: 'Opções das estatísticas de {deckName}',
        resetStatisticsMenuItem: 'Redefinir estatísticas',
        resetAlert: {
          title: 'Redefinir estatísticas',
          message:
            'Apagar todos os resultados e sessões registrados de "{deckName}"?',
        },
        notFound: {
          title: 'Baralho não encontrado',
          message: 'Este baralho foi excluído.',
        },
        cardPerformanceTitle: 'Desempenho dos cartões',
        subtitle: {
          one: '{count} cartão · {sort}',
          other: '{count} cartões · {sort}',
        },
        subtitleNarrowed: {
          one: '{shown} de {count} cartões · {sort}',
          other: '{shown} de {count} cartões · {sort}',
        },
        sortButtonA11yLabel: 'Ordenar cartões: {sort}',
        sortSheetTitle: 'Ordenar cartões',
        noCards: {
          title: 'Nenhum cartão ainda',
          message:
            'Adicione cartões a este baralho para ver o desempenho de cada um.',
        },
        statusEmpty: {
          needsReview: {
            title: 'Nenhum cartão para revisar',
            message: 'Nenhum cartão está abaixo de 40% de acerto.',
          },
          learning: {
            title: 'Nenhum cartão em aprendizado',
            message: 'Nenhum cartão está entre 40% e 70% de acerto.',
          },
          mastered: {
            title: 'Nenhum cartão dominado ainda',
            message: 'Um cartão é dominado com 70% de acerto ou mais.',
          },
          new: {
            title: 'Nenhum cartão novo',
            message: 'Todos os cartões foram revisados pelo menos uma vez.',
          },
        },
        showAllCardsButton: 'Mostrar todos os cartões',
        noMatches: {
          filteredMessage:
            'Nada corresponde a "{query}" com o filtro {status}.',
        },
      },
      deckIdentityRow: {
        categoryA11yLabel: 'Categoria: {name}',
      },
      deckMasteryCard: {
        successRateA11yLabel: 'Taxa de acerto: {rate}',
        successRateNoReviewsA11yLabel: 'Taxa de acerto: ainda sem revisões',
        successRateCaption: 'Taxa de acerto',
        answerTile: {
          ok: '{count} ok, {percent}',
          okeish: '{count} quase ok, {percent}',
          notOk: '{count} não ok, {percent}',
        },
        answerTileNoReviews: {
          ok: '{count} ok, ainda sem revisões',
          okeish: '{count} quase ok, ainda sem revisões',
          notOk: '{count} não ok, ainda sem revisões',
        },
        reviewsFigure: 'Revisões',
        sessionsFigure: 'Sessões',
        lastSessionFigure: 'Última sessão',
        figureA11yLabel: '{label}: {value}',
        changeChip: {
          none: 'Sem mudança desde a última sessão',
          up: '+{points} pts desde a última sessão',
          down: '-{points} pts desde a última sessão',
          noneA11yLabel: 'Taxa de acerto inalterada desde a última sessão',
          upA11yLabel: {
            one: 'Taxa de acerto subiu {count} ponto desde a última sessão',
            other: 'Taxa de acerto subiu {count} pontos desde a última sessão',
          },
          downA11yLabel: {
            one: 'Taxa de acerto caiu {count} ponto desde a última sessão',
            other: 'Taxa de acerto caiu {count} pontos desde a última sessão',
          },
        },
      },
      cardStatsRow: {
        footerNeverReviewed: 'Nunca revisado',
        footerReviewed: {
          one: '{count} revisão · Revisado em {date}',
          other: '{count} revisões · Revisado em {date}',
        },
        neverReviewedA11yLabel:
          'Pergunta: {question}. Resposta: {answer}. {status}. Nunca revisado.',
        reviewedA11yLabel: {
          one: 'Pergunta: {question}. Resposta: {answer}. {status}, taxa de acerto {rate}. {count} revisão: {ok} ok, {okeish} quase ok, {notOk} não ok.',
          other:
            'Pergunta: {question}. Resposta: {answer}. {status}, taxa de acerto {rate}. {count} revisões: {ok} ok, {okeish} quase ok, {notOk} não ok.',
        },
        reviewedOnA11yLabel: {
          one: 'Pergunta: {question}. Resposta: {answer}. {status}, taxa de acerto {rate}. {count} revisão: {ok} ok, {okeish} quase ok, {notOk} não ok. Revisado em {date}.',
          other:
            'Pergunta: {question}. Resposta: {answer}. {status}, taxa de acerto {rate}. {count} revisões: {ok} ok, {okeish} quase ok, {notOk} não ok. Revisado em {date}.',
        },
      },
      cardStatusChips: {
        groupA11yLabel: 'Status do cartão',
        allChip: 'Todos',
        chipLabel: '{label} ({count})',
        chipA11yLabel: {
          one: '{label}, {count} cartão',
          other: '{label}, {count} cartões',
        },
      },
      cardSearchField: {
        searchA11yLabel: 'Buscar cartões',
        searchPlaceholder: 'Buscar perguntas e respostas',
        clearA11yLabel: 'Limpar busca de cartões',
      },
      sessionHistoryChart: {
        title: 'Histórico de sessões',
        subtitleLatest: 'Mais recentes: {shown} de {total}',
        empty: {
          title: 'Nenhuma sessão para este baralho',
          message:
            'Inicie uma na aba Baralhos e os resultados aparecerão aqui.',
        },
        unansweredLegend: 'Sem resposta',
        legendNote: '% dos cartões de cada sessão',
        sessionA11yLabel: {
          one: 'Sessão de {date}: taxa de acerto {rate}, {answered} de {count} cartão respondido — {ok} ok, {okeish} quase ok, {notOk} não ok',
          other:
            'Sessão de {date}: taxa de acerto {rate}, {answered} de {count} cartões respondidos — {ok} ok, {okeish} quase ok, {notOk} não ok',
        },
        sessionNoAnswersA11yLabel: {
          one: 'Sessão de {date}: taxa de acerto ainda sem respostas, {answered} de {count} cartão respondido — {ok} ok, {okeish} quase ok, {notOk} não ok',
          other:
            'Sessão de {date}: taxa de acerto ainda sem respostas, {answered} de {count} cartões respondidos — {ok} ok, {okeish} quase ok, {notOk} não ok',
        },
      },
    },
  },
};
