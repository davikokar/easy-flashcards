import type { Catalogue, Language, PluralRule } from '../utils/i18n';

// Japanese has no plural forms (CLDR), so every count uses 'other'.
export const jaPlural: PluralRule = () => 'other';

// "Okeish" is rendered "まあまあ" (so-so): it reads as clearly between "正解" and "不正解".
const messages: Catalogue = {
  common: {
    actions: {
      back: '戻る',
      cancel: 'キャンセル',
      clear: 'クリア',
      close: '閉じる',
      delete: '削除',
      discard: '破棄',
      export: 'エクスポート',
      keepEditing: '編集を続ける',
      ok: 'OK',
      reset: 'リセット',
      save: '保存',
      start: '開始',
    },
    search: {
      noMatchesTitle: '一致するものがありません',
      noMatchesMessage: '「{query}」に一致するものはありません。',
      clearSearchButton: '検索をクリア',
    },
    counts: {
      cards: {
        other: '{count}枚',
      },
      sessions: {
        other: '{count}セッション',
      },
      reviews: {
        other: '復習{count}回',
      },
    },
  },
  navigation: {
    tabs: {
      decks: 'デッキ',
      learn: '学習',
      categories: 'カテゴリ',
      statistics: '統計',
    },
    headers: {
      decksList: 'デッキ',
      editDeck: 'デッキを編集',
      newDeck: '新しいデッキ',
      learnList: '学習',
      study: 'セッション',
      categoriesList: 'カテゴリ',
      newCategory: '新しいカテゴリ',
      statsOverview: '統計',
      deckStats: 'デッキの統計',
    },
  },
  answers: {
    answerLabels: {
      ok: '正解',
      okeish: 'まあまあ',
      notOk: '不正解',
    },
    shares: {
      notReviewed: 'まだ復習していません',
      summary: '正解{ok}、まあまあ{okeish}、不正解{notOk}',
    },
    cardStatus: {
      needsReview: '要復習',
      learning: '学習中',
      mastered: '習得済み',
      new: '新規',
    },
    timeframes: {
      all: '全期間',
      month: '今月',
      week: '過去7日間',
    },
    sortOrders: {
      hardest: '難しい順',
      deck: 'デッキ順',
      recent: '最近復習した順',
    },
    dates: {
      never: 'なし',
    },
  },
  importExport: {
    defaultDeckName: 'インポートしたデッキ',
    importErrors: {
      emptyFile: '選択したファイルは空です。',
      notADeck:
        'Easy Flashcards のデッキファイルではありません。アプリからエクスポートした JSON ファイルを選択してください。',
      newerVersion:
        'このデッキファイルは新しいバージョンの Easy Flashcards で作成されています。インポートするにはアプリを更新してください。',
      noCards:
        '使用できるカードが見つかりません。すべてのカードに問題と答えが必要です。',
      noHeader:
        'ヘッダー行が見つかりません。空白行でも "#" のコメント行でもない最初の行に、"question" 列と "answer" 列の名前が必要です。区切りには、カンマ、セミコロン、タブ、またはその他の記号を1つ使えます。',
      noUsableRows:
        '使用できる行が見つかりません。すべての行に問題と答えが必要です。',
      unreadable: '選択したファイルを読み込めませんでした。',
    },
    importAlert: {
      successTitle: 'デッキをインポートしました',
      successMessage: {
        other: '「{name}」に{count}枚のカードが入りました。',
      },
      skippedRows: {
        other: '不完全な{count}行をスキップしました。',
      },
      skippedCards: {
        other: '不完全なカード{count}枚をスキップしました。',
      },
      failedTitle: 'インポートに失敗しました',
      failedWithDetails: 'ファイルをインポートできませんでした：{details}',
      failedUnknown: 'ファイルのインポート中に不明なエラーが発生しました。',
    },
    exportAlert: {
      successTitle: 'デッキをエクスポートしました',
      savedAs: '{name} として保存しました。',
      saved: 'デッキを保存しました。',
      failedTitle: 'エクスポートに失敗しました',
      deckGone: 'このデッキはもう存在しません。',
      failedFallback: 'デッキをエクスポートできませんでした。',
    },
    separators: {
      comma: 'カンマ (,)',
      semicolon: 'セミコロン (;)',
      tab: 'タブ',
    },
    sampleExport: {
      successTitle: 'サンプルデッキをエクスポートしました',
      partlyTitle: 'サンプルデッキを一部だけエクスポートしました',
      failedTitle: 'エクスポートに失敗しました',
      savedAsOne: '{name} として保存しました。',
      savedAsTwo: '{first} と {second} として保存しました。',
      fileFailed: '{format} ファイルを保存できませんでした：{details}',
      fileNotSaved: '{format} ファイルは保存されませんでした。',
      unknownError: '不明なエラー',
    },
  },
  categoryNames: {
    builtIn: {
      astronomy: '天文学',
      biology: '生物学',
      botany: '植物学',
      chemistry: '化学',
      cinema: '映画',
      computer_science: '情報科学',
      economics: '経済学',
      gastronomy: '料理',
      geography: '地理',
      history: '歴史',
      languages: '語学',
      law: '法律',
      literature: '文学',
      mathematics: '数学',
      medicine: '医学',
      music: '音楽',
      philosophy: '哲学',
      physics: '物理学',
      religion: '宗教',
      sport: 'スポーツ',
      zoology: '動物学',
    },
    icons: {
      plane_contrails: '飛行機',
      anchor: '錨',
      nutrition: 'リンゴ',
      emergency: 'アスタリスク',
      microbiology: '細菌',
      finance: '棒グラフ',
      sports_basketball: 'バスケットボール',
      neurology: '脳',
      bug_report: '虫',
      calendar_month: 'カレンダー',
      photo_camera: 'カメラ',
      camera: 'カメラの絞り',
      cannabis: '大麻の葉',
      directions_car: '車',
      chess_pawn: 'チェスのポーン',
      language_chinese_dayi: '漢字とアルファベット',
      location_city: '都市',
      circle_circle: '同心円',
      restaurant: 'カトラリー',
      database: 'データベース',
      nest_heat_link_e: '円の中の点',
      engineering: 'エンジニア',
      face: '顔',
      face_3: '髪のある顔',
      theaters: 'フィルム',
      flag_2: '旗',
      science: 'フラスコ',
      save: 'フロッピーディスク',
      sports_and_outdoors: 'フットボール',
      skillet: 'フライパン',
      sports_esports: 'ゲームコントローラー',
      language: '地球儀',
      diversity_3: '人々のグループ',
      psychology: '歯車のある頭',
      headphones: 'ヘッドホン',
      health_and_safety: '健康の盾',
      landscape_2: '丘',
      hive: 'ハチの巣',
      hourglass_empty: '砂時計',
      house: '家',
      icecream: 'アイスクリーム',
      temp_preferences_eco: '葉',
      electric_bolt: '稲妻',
      wand_stars: '魔法の杖',
      biotech: '顕微鏡',
      mindfulness: 'マインドフルネス',
      motorcycle: 'バイク',
      music_note_2: '音符',
      network_node: 'ネットワーク',
      import_contacts: '開いた本',
      pan_tool: '開いた手',
      pets: '肉球',
      stylus: '鉛筆',
      person: '人',
      history_edu: '羽根ペンと紙',
      radio: 'ラジオ',
      raven: 'カラス',
      rib_cage: '肋骨',
      rocket_launch: 'ロケット',
      scatter_plot: '散布図',
      category: '図形',
      interests: '図形とハート',
      shopping_cart: 'ショッピングカート',
      functions: 'シグマ',
      skull: 'ドクロ',
      emoji_language: '笑顔と地球',
      snowflake: '雪の結晶',
      hotel_class: '星',
      mountain_flag: '山頂の旗',
      sunny: '太陽',
      mixture_med: '注射器と錠剤',
      temple_buddhist: '寺院',
      text_snippet: 'テキスト文書',
      theater_comedy: '演劇の仮面',
      nest_thermostat_gen_3: 'サーモスタット',
      translate: '翻訳',
      nature: '木',
      fertile: 'チューリップ',
      videocam: 'ビデオカメラ',
      coronavirus: 'ウイルス',
      volcano: '火山',
      warning: '警告',
      water: '波',
      air: '風',
      build: 'レンチ',
    },
  },
  shell: {
    appMenu: {
      triggerA11yLabel: 'アプリメニュー',
      exportSampleDeckItem: 'サンプルデッキをエクスポート',
      settingsItem: '設定',
    },
    settingsAlert: {
      title: '設定',
      message: '設定はまだ利用できません。',
    },
    exportSampleDeckDialog: {
      title: 'サンプルデッキをエクスポート',
      body: 'サンプルデッキを CSV と JSON の2つのファイルとして保存します。それぞれの保存先を尋ねられます。どちらかをキャンセルすると、そのファイルは保存されません。\n\nCSV：# で始まる行（タイトル、説明、カテゴリ）はインポート時に読み飛ばされ、続いて "question" / "answer" のヘッダー行と、1行につき1枚のカードが並びます。ここではセミコロンで区切っています（カンマ、タブ、その他の1文字の記号も使えます）。\n\nJSON：タイトル、説明、カテゴリも復元されます。\n\nカードの表と裏のどちらにも、<b>、<i>、<br /> などの基本的な HTML を使えます。',
    },
    kebabMenu: {
      triggerA11yLabel: 'その他のオプション',
    },
    searchBar: {
      inputA11yLabel: '検索テキスト',
      closeButtonA11yLabel: '検索を閉じる',
    },
  },
  decks: {
    decksScreen: {
      searchA11yLabel: 'デッキを検索',
      searchPlaceholder: 'デッキを検索',
      loadError: '保存されたデッキを読み込めませんでした。',
      addDeckA11yLabel: 'デッキを追加',
      emptyTitle: 'デッキがまだありません',
      emptyMessage:
        '+ ボタンからデッキファイルをインポートして、最初のデッキを作成しましょう。',
    },
    emptyDeckAlert: {
      title: '空のデッキ',
      message: 'このデッキには学習するカードがありません。',
    },
    deleteDeckAlert: {
      title: 'デッキを削除',
      message: '「{name}」と、そのセッションおよびすべての統計を削除しますか？',
    },
    addDeckMenu: {
      title: 'デッキを追加',
      importItem: 'ファイルからデッキをインポート',
      manualItem: '手動でデッキを追加',
    },
    deckOptionsMenu: {
      startWithOptionsItem: 'オプションを指定してセッションを開始',
      editItem: 'デッキを編集',
      exportItem: 'ファイルにエクスポート',
      deleteItem: 'デッキを削除',
    },
    exportFormatMenu: {
      title: 'デッキをファイルにエクスポート',
    },
    csvSeparatorMenu: {
      title: 'CSV の区切り文字',
      customItem: 'カスタム…',
    },
    deckCard: {
      optionsA11yLabel: '{name}のオプション',
      activeCount: '進行中{count}件',
      lastSession: '前回：{date}',
      startA11yLabel: '{name}のセッションを開始',
    },
    masteryBar: {
      a11yLabel: '習熟度：{summary}',
    },
    sessionSetupDialog: {
      title: 'セッションを開始',
      invertedLabel: '反転',
      invertedDescription: '答えを表に、問題を裏に表示します。',
      shuffleLabel: 'シャッフル',
      shuffleDescription: 'カードをランダムな順番で学習します。',
    },
    customSeparatorDialog: {
      title: 'カスタム区切り文字',
      separatorLabel: '区切り文字',
      separatorPlaceholder: '例：|',
      errors: {
        empty: '1文字入力してください。',
        tooLong: '1文字だけ入力してください。',
        reserved: '引用符、#、改行は使用できません。',
        whitespace:
          'スペースは使用できません。タブを使うには「タブ」を選んでください。',
        alphanumeric: '英数字は使用できません。',
      },
    },
  },
  editDeck: {
    deckNotFound: {
      title: 'デッキが見つかりません',
      message: 'このデッキはもう存在しません。',
      backButton: 'デッキ一覧に戻る',
    },
    editDeckScreen: {
      titleLabel: 'タイトル',
      descriptionLabel: '説明',
      descriptionPlaceholder: '任意',
      saveButtonA11yLabel: 'デッキを保存',
      addCardButton: 'カードを追加',
    },
    titleNeededAlert: {
      title: 'タイトルが必要です',
      message: 'デッキのタイトルを入力してください。',
    },
    cardIncompleteAlert: {
      title: 'カードが未完成です',
      message: 'カード{number}には問題と答えの両方が必要です。',
    },
    removeCardsAlert: {
      title: 'カードを削除しますか？',
      message: {
        other: '{count}枚のカードを、その統計とともにデッキから削除します。',
      },
    },
    discardChangesAlert: {
      title: '変更を破棄しますか？',
      messageEdit: 'このデッキへの編集は保存されていません。',
      messageNew: 'このデッキは保存されていません。',
    },
    cardEditor: {
      title: 'カード{number}',
      removeButtonA11yLabel: 'カード{number}を削除',
      questionLabel: '問題',
      questionA11yLabel: 'カード{number}の問題',
      answerLabel: '答え',
      answerA11yLabel: 'カード{number}の答え',
    },
    categoryField: {
      label: 'カテゴリ',
      a11yLabel: 'カテゴリ：{name}',
      a11yLabelNone: 'カテゴリ：なし',
      a11yHint: 'カテゴリの選択を開きます',
      noneValue: 'カテゴリなし',
    },
    categoryPicker: {
      title: 'カテゴリ',
      groupA11yLabel: 'カテゴリの選択',
      noneTile: 'カテゴリなし',
    },
  },
  learn: {
    learnScreen: {
      searchA11yLabel: 'セッションを検索',
      searchPlaceholder: 'セッションを検索',
    },
    headerToolbar: {
      clearCompletedItem: '完了したセッションをクリア',
    },
    emptyState: {
      noSessionsTitle: 'セッションがまだありません',
      noSessionsMessage:
        'デッキを選んで学習セッションを開始すると、終了するまでここに表示されます。',
      allClearedTitle: '表示するセッションがありません',
      allClearedMessage:
        'クリアしたセッションも統計には含まれます。デッキから新しいセッションを開始すると、ここに表示されます。',
      goToDecksButton: 'デッキへ移動',
    },
    deckUnavailableAlert: {
      title: 'デッキを利用できません',
      message: 'このデッキはすでに存在しないか、カードがありません。',
    },
    clearCompletedSessionsAlert: {
      title: '完了したセッションをクリア',
      nothingToClear: 'クリアできる完了済みのセッションはありません。',
      message: {
        other:
          '完了した{count}件のセッションをこの一覧から削除しますか？結果は統計に残ります。',
      },
    },
    discardSessionAlert: {
      title: 'セッションを破棄',
      message:
        '「{deckName}」の未完了のセッションを破棄しますか？その回答も統計から削除されます。',
    },
    clearSessionAlert: {
      title: 'セッションをクリア',
      message:
        '「{deckName}」の完了したセッションをこの一覧から削除しますか？結果は統計に残ります。',
    },
    sessionOptionsMenu: {
      discardItem: 'セッションを破棄',
      clearItem: 'セッションをクリア',
    },
    sessionCard: {
      inProgressStatus: {
        other: '進行中・{answered}/{count}枚',
      },
      completedStatus: {
        other: '完了・{count}枚',
      },
      invertedPill: '反転',
      invertedPillA11yLabel: '反転セッション',
      optionsA11yLabel: '{deckName}のセッションのオプション',
      started: '開始：{date}',
      resumeButtonA11yLabel: '{deckName}のセッションを再開',
      replayButtonA11yLabel: '{deckName}のセッションをもう一度行う',
      reviewErrorsButtonA11yLabel: {
        other: '{deckName}の間違えたカードと自信のないカード{count}枚を復習',
      },
      reviewErrorsDoneA11yLabel:
        '{deckName}の間違えたカードと自信のないカードはすべて解決済み',
    },
    sessionResultsBar: {
      progressA11yLabel:
        '進捗：{cardCount}枚中{answered}枚回答済み、正解{ok}、まあまあ{okeish}、不正解{notOk}',
    },
  },
  study: {
    studyScreen: {
      fallbackTitle: 'セッション',
      unavailableTitle: '学習するカードがありません',
      unavailableMessage: 'このセッションはもう利用できません。',
      unavailableAction: 'セッション一覧に戻る',
    },
    progressHeader: {
      position: 'カード {current}/{total}',
      okCount: '正解 {count}',
    },
    invertedPill: {
      text: '反転',
      a11yLabel: '反転セッション：表に答えが表示されます',
    },
    swipeHint: {
      reviewing:
        '回答済みのカードを見直しています。左にスワイプすると元の位置に戻ります',
    },
    historyStrip: {
      a11yLabel: 'これまでの回答',
    },
    flipCard: {
      questionLabel: '問題',
      answerLabel: '答え',
      revealHint: 'タップして答えを表示',
      backHint: 'タップして問題をもう一度表示',
      showQuestionA11yLabel: '問題を表示',
      showAnswerA11yLabel: '答えを表示',
    },
    sessionSummary: {
      title: 'セッション完了',
      successRateA11yLabel: '正答率{rate}',
      reviewedCount: '復習済み{count}',
      studyAgainLabel: 'デッキ全体をもう一度学習',
      studyAgainButtonA11yLabel: 'デッキ全体をもう一度学習',
    },
    reviewSummary: {
      title: '復習完了',
      stillToFix: '残り{count}件',
      allFixed: 'すべて解決済み',
    },
    summaryAction: {
      reviewLabel: '間違えたカードと自信のないカードを復習',
      reviewButtonA11yLabel: {
        other: '間違えたカードと自信のないカード{count}枚を復習',
      },
      backLabel: 'セッション一覧に戻る',
      backButtonA11yLabel: 'セッション一覧に戻る',
    },
  },
  categories: {
    categoriesScreen: {
      customSectionTitle: 'カスタムカテゴリ',
      customSectionSubtitle: {
        other: '利用可能{count}件',
      },
      customEmptyHint: '自分で作成したカテゴリがここに表示されます。',
      defaultSectionTitle: '標準カテゴリ',
      defaultSectionSubtitle: {
        other: '内蔵{count}件',
      },
      newCategoryButton: '新しいカテゴリ',
      categoryTileA11yLabel: '{name}のオプション',
    },
    categoryOptionsMenu: {
      deleteItem: 'カテゴリを削除',
    },
    deleteCategoryAlert: {
      title: 'カテゴリを削除しますか？',
      message: '「{name}」を削除します。',
      messageWithDecks: {
        other:
          '「{name}」を削除します。{count}個のデッキはカテゴリなしになります。',
      },
    },
    newCategoryScreen: {
      saveButtonA11yLabel: 'カテゴリを保存',
      nameField: '名前',
      colourLabel: '色',
      iconLabel: 'アイコン',
      nameCounter: '{length}/{max}',
      nameErrors: {
        empty: '名前を入力してください。',
        tooLong: {
          other: '{count}文字以内で入力してください。',
        },
        duplicate: 'この名前のカテゴリはすでに存在します。',
      },
    },
    discardChangesAlert: {
      title: '変更を破棄しますか？',
      message: 'このカテゴリは保存されていません。',
    },
    tilePreview: {
      placeholder: 'カテゴリ名',
      a11yLabel: 'プレビュー：{name}',
      noNameA11yLabel: 'プレビュー：名前はまだありません',
    },
    colourPicker: {
      a11yLabel: '色の選択',
      swatchA11yLabel: '色 {position}/{total}',
    },
    customColourSwatch: {
      a11yLabel: 'カスタムカラー',
      a11yHint: '色の選択画面を開きます',
    },
    iconPicker: {
      a11yLabel: 'アイコンの選択',
    },
    customColourDialog: {
      title: 'カスタムカラー',
      hueLabel: '色相',
      hueValue: '{value}°',
      saturationLabel: '彩度',
      brightnessLabel: '明度',
      percentValue: '{value}%',
      previewA11yLabel: '色のプレビュー {color}',
      tooDark: 'アイコンには暗すぎます。もっと明るい色を試してください。',
      useButton: 'この色を使う',
    },
    categorySquare: {
      a11yLabel: 'カテゴリ：{name}',
    },
  },
  stats: {
    statsScreen: {
      searchA11yLabel: 'デッキを検索',
      searchPlaceholder: 'デッキを検索',
      aggregatedHeading: '集計',
      decksTile: {
        label: 'デッキ',
        caption: 'ライブラリ内',
      },
      totalCardsTile: {
        label: 'カード総数',
        caption: '全デッキ合計',
      },
      totalReviewsTile: {
        label: '総復習回数',
        caption: {
          all: '記録された回答',
          month: '今月の回答',
          week: '過去7日間の回答',
        },
      },
      sessionsTile: {
        label: 'セッション',
        caption: '進行中{count}件',
      },
      tileA11yLabel: '{label}：{value}、{caption}',
      decksBreakdownHeading: 'デッキ別の内訳',
      deckCount: {
        other: '{count}デッキ',
      },
      emptyState: {
        title: '統計はまだありません',
        message: 'デッキをインポートして学習すると、結果がここに表示されます。',
      },
    },
    masteryRing: {
      summaryA11yLabel: '正答率{rate}。{shares}。件数：{counts}',
      caption: '正答率',
    },
    deckStatsCard: {
      summaryA11yLabel:
        '{name}：{shares}、{cards}、{sessions}、{reviews}、最終 {last}',
      openA11yHint: 'カードごとの詳細を開きます',
      cardsLabel: 'カード',
      sessionsLabel: 'セッション',
      reviewsLabel: '復習',
      lastLabel: '最終',
    },
    timeframeChips: {
      groupA11yLabel: '期間',
    },
  },
  deckStats: {
    deckStatsScreen: {
      optionsA11yLabel: '{deckName}の統計のオプション',
      resetStatisticsMenuItem: '統計をリセット',
      resetAlert: {
        title: '統計をリセット',
        message:
          '「{deckName}」の記録された結果とセッションをすべて消去しますか？',
      },
      notFound: {
        title: 'デッキが見つかりません',
        message: 'このデッキは削除されました。',
      },
      cardPerformanceTitle: 'カードごとの成績',
      subtitle: {
        other: '{count}枚・{sort}',
      },
      subtitleNarrowed: {
        other: '{count}枚中{shown}枚・{sort}',
      },
      sortButtonA11yLabel: 'カードの並べ替え：{sort}',
      sortSheetTitle: 'カードの並べ替え',
      noCards: {
        title: 'カードがまだありません',
        message:
          'このデッキにカードを追加すると、カードごとの成績を確認できます。',
      },
      statusEmpty: {
        needsReview: {
          title: '復習が必要なカードはありません',
          message: '正答率が40%未満のカードはありません。',
        },
        learning: {
          title: '学習中のカードはありません',
          message: '正答率が40%から70%のカードはありません。',
        },
        mastered: {
          title: '習得済みのカードはまだありません',
          message: '正答率が70%以上になると、カードは習得済みになります。',
        },
        new: {
          title: '新規カードはありません',
          message: 'すべてのカードが1回以上復習されています。',
        },
      },
      showAllCardsButton: 'すべてのカードを表示',
      noMatches: {
        filteredMessage:
          '「{query}」に一致するカードは、フィルター「{status}」の中にありません。',
      },
    },
    deckIdentityRow: {
      categoryA11yLabel: 'カテゴリ：{name}',
    },
    deckMasteryCard: {
      successRateA11yLabel: '正答率：{rate}',
      successRateNoReviewsA11yLabel: '正答率：まだ復習していません',
      successRateCaption: '正答率',
      answerTile: {
        ok: '正解{count}件、{percent}',
        okeish: 'まあまあ{count}件、{percent}',
        notOk: '不正解{count}件、{percent}',
      },
      answerTileNoReviews: {
        ok: '正解{count}件、まだ復習していません',
        okeish: 'まあまあ{count}件、まだ復習していません',
        notOk: '不正解{count}件、まだ復習していません',
      },
      reviewsFigure: '復習回数',
      sessionsFigure: 'セッション',
      lastSessionFigure: '前回のセッション',
      figureA11yLabel: '{label}：{value}',
      changeChip: {
        none: '前回のセッションから変化なし',
        up: '前回のセッションから+{points}pt',
        down: '前回のセッションから-{points}pt',
        noneA11yLabel: '正答率は前回のセッションから変わっていません',
        upA11yLabel: {
          other: '正答率は前回のセッションから{count}ポイント上がりました',
        },
        downA11yLabel: {
          other: '正答率は前回のセッションから{count}ポイント下がりました',
        },
      },
    },
    cardStatsRow: {
      footerNeverReviewed: '未復習',
      footerReviewed: {
        other: '復習{count}回・{date}に復習',
      },
      neverReviewedA11yLabel:
        '問題：{question}。答え：{answer}。{status}。未復習。',
      reviewedA11yLabel: {
        other:
          '問題：{question}。答え：{answer}。{status}、正答率{rate}。復習{count}回：正解{ok}、まあまあ{okeish}、不正解{notOk}。',
      },
      reviewedOnA11yLabel: {
        other:
          '問題：{question}。答え：{answer}。{status}、正答率{rate}。復習{count}回：正解{ok}、まあまあ{okeish}、不正解{notOk}。{date}に復習。',
      },
    },
    cardStatusChips: {
      groupA11yLabel: 'カードの状態',
      allChip: 'すべて',
      chipLabel: '{label} ({count})',
      chipA11yLabel: {
        other: '{label}、{count}枚',
      },
    },
    cardSearchField: {
      searchA11yLabel: 'カードを検索',
      searchPlaceholder: '問題と答えを検索',
      clearA11yLabel: 'カードの検索をクリア',
    },
    sessionHistoryChart: {
      title: 'セッション履歴',
      subtitleLatest: '全{total}件のうち最新の{shown}件',
      empty: {
        title: 'このデッキのセッションはありません',
        message:
          'デッキタブからセッションを開始すると、結果がここに表示されます。',
      },
      unansweredLegend: '未回答',
      legendNote: '各セッションのカードに占める割合（%）',
      sessionA11yLabel: {
        other:
          '{date}のセッション：正答率{rate}、{count}枚中{answered}枚回答済み、正解{ok}、まあまあ{okeish}、不正解{notOk}',
      },
      sessionNoAnswersA11yLabel: {
        other:
          '{date}のセッション：正答率は回答なし、{count}枚中{answered}枚回答済み、正解{ok}、まあまあ{okeish}、不正解{notOk}',
      },
    },
  },
};

export const ja: Language = { code: 'ja', plural: jaPlural, messages };
