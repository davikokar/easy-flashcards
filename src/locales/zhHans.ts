import type { Catalogue, Language, PluralRule } from '../utils/i18n';

// Simplified Chinese (Mainland) wording.
// Chinese has no plural forms (CLDR), so every count uses `other`.
export const zhHansPlural: PluralRule = () => 'other';

// "Okeish" is rendered "差不多": it reads as clearly between "正确" (Ok) and "错误" (Not ok).
const messages: Catalogue = {
  common: {
    actions: {
      back: '返回',
      cancel: '取消',
      clear: '清除',
      close: '关闭',
      delete: '删除',
      discard: '放弃',
      export: '导出',
      keepEditing: '继续编辑',
      ok: '确定',
      reset: '重置',
      save: '保存',
      start: '开始',
    },
    search: {
      noMatchesTitle: '无匹配结果',
      noMatchesMessage: '没有与“{query}”匹配的内容。',
      clearSearchButton: '清除搜索',
    },
    counts: {
      cards: {
        other: '{count} 张卡片',
      },
      sessions: {
        other: '{count} 个学习会话',
      },
      reviews: {
        other: '{count} 次复习',
      },
    },
  },
  navigation: {
    tabs: {
      decks: '卡组',
      learn: '学习',
      categories: '分类',
      statistics: '统计',
    },
    headers: {
      decksList: '卡组',
      editDeck: '编辑卡组',
      newDeck: '新建卡组',
      learnList: '学习',
      study: '学习会话',
      categoriesList: '分类',
      newCategory: '新建分类',
      statsOverview: '统计',
      deckStats: '卡组统计',
    },
  },
  answers: {
    answerLabels: {
      ok: '正确',
      okeish: '差不多',
      notOk: '错误',
    },
    shares: {
      notReviewed: '尚未复习',
      summary: '{ok} 正确，{okeish} 差不多，{notOk} 错误',
    },
    cardStatus: {
      needsReview: '待复习',
      learning: '学习中',
      mastered: '已掌握',
      new: '新卡片',
    },
    timeframes: {
      all: '全部时间',
      month: '本月',
      week: '最近 7 天',
    },
    sortOrders: {
      hardest: '最难的在前',
      deck: '卡组顺序',
      recent: '最近复习',
    },
    dates: {
      never: '从未',
    },
  },
  importExport: {
    defaultDeckName: '导入的卡组',
    importErrors: {
      emptyFile: '所选文件为空。',
      notADeck:
        '这不是 Easy Flashcards 的卡组文件。请选择从本应用导出的 JSON 文件。',
      newerVersion:
        '此卡组文件由更新版本的 Easy Flashcards 创建。请更新应用后再导入。',
      noCards: '未找到可用的卡片。每张卡片都需要有问题和答案。',
      noHeader:
        '未找到标题行。第一行既不是空行也不是以 "#" 开头的注释，必须包含名为 "question" 和 "answer" 的列，并用逗号、分号、制表符或其他符号分隔。',
      noUsableRows: '未找到可用的行。每一行都需要有问题和答案。',
      unreadable: '无法读取所选文件。',
    },
    importAlert: {
      successTitle: '卡组已导入',
      successMessage: {
        other: '“{name}”现在有 {count} 张卡片。',
      },
      skippedRows: {
        other: '已跳过 {count} 行不完整的内容。',
      },
      skippedCards: {
        other: '已跳过 {count} 张不完整的卡片。',
      },
      failedTitle: '导入失败',
      failedWithDetails: '无法导入该文件：{details}',
      failedUnknown: '导入文件时出现未知错误。',
    },
    exportAlert: {
      successTitle: '卡组已导出',
      savedAs: '已保存为 {name}。',
      saved: '卡组已保存。',
      failedTitle: '导出失败',
      deckGone: '此卡组已不存在。',
      failedFallback: '无法导出卡组。',
    },
    separators: {
      comma: '逗号 (,)',
      semicolon: '分号 (;)',
      tab: '制表符',
    },
    sampleExport: {
      successTitle: '示例卡组已导出',
      partlyTitle: '示例卡组已部分导出',
      failedTitle: '导出失败',
      savedAsOne: '已保存为 {name}。',
      savedAsTwo: '已保存为 {first} 和 {second}。',
      fileFailed: '无法保存 {format} 文件：{details}',
      fileNotSaved: '{format} 文件未保存。',
      unknownError: '未知错误',
    },
  },
  categoryNames: {
    builtIn: {
      astronomy: '天文学',
      biology: '生物学',
      botany: '植物学',
      chemistry: '化学',
      cinema: '电影',
      computer_science: '计算机科学',
      economics: '经济学',
      gastronomy: '美食',
      geography: '地理',
      history: '历史',
      languages: '语言',
      law: '法律',
      literature: '文学',
      mathematics: '数学',
      medicine: '医学',
      music: '音乐',
      philosophy: '哲学',
      physics: '物理学',
      religion: '宗教',
      sport: '体育',
      zoology: '动物学',
    },
    icons: {
      plane_contrails: '飞机',
      anchor: '锚',
      nutrition: '苹果',
      emergency: '星号',
      microbiology: '细菌',
      finance: '柱状图',
      sports_basketball: '篮球',
      neurology: '大脑',
      bug_report: '虫子',
      calendar_month: '日历',
      photo_camera: '相机',
      camera: '相机光圈',
      cannabis: '大麻叶',
      directions_car: '汽车',
      chess_pawn: '国际象棋兵',
      language_chinese_dayi: '中文与拉丁字母',
      location_city: '城市',
      circle_circle: '同心圆',
      restaurant: '餐具',
      database: '数据库',
      nest_heat_link_e: '圆圈中的圆点',
      engineering: '工程师',
      face: '人脸',
      face_3: '长发人脸',
      theaters: '胶片',
      flag_2: '旗帜',
      science: '烧瓶',
      save: '软盘',
      sports_and_outdoors: '足球',
      skillet: '煎锅',
      sports_esports: '游戏手柄',
      language: '地球',
      diversity_3: '人群',
      psychology: '带齿轮的头部',
      headphones: '耳机',
      health_and_safety: '健康盾牌',
      landscape_2: '山丘',
      hive: '蜂巢',
      hourglass_empty: '沙漏',
      house: '房子',
      icecream: '冰淇淋',
      temp_preferences_eco: '树叶',
      electric_bolt: '闪电',
      wand_stars: '魔杖',
      biotech: '显微镜',
      mindfulness: '正念',
      motorcycle: '摩托车',
      music_note_2: '音符',
      network_node: '网络',
      import_contacts: '打开的书',
      pan_tool: '张开的手',
      pets: '爪印',
      stylus: '铅笔',
      person: '人物',
      history_edu: '羽毛笔和纸',
      radio: '收音机',
      raven: '乌鸦',
      rib_cage: '胸腔',
      rocket_launch: '火箭',
      scatter_plot: '散点图',
      category: '形状',
      interests: '形状和爱心',
      shopping_cart: '购物车',
      functions: '西格玛',
      skull: '骷髅',
      emoji_language: '笑脸和地球',
      snowflake: '雪花',
      hotel_class: '星星',
      mountain_flag: '山顶旗帜',
      sunny: '太阳',
      mixture_med: '注射器和药片',
      temple_buddhist: '寺庙',
      text_snippet: '文本文档',
      theater_comedy: '戏剧面具',
      nest_thermostat_gen_3: '恒温器',
      translate: '翻译',
      nature: '树',
      fertile: '郁金香',
      videocam: '摄像机',
      coronavirus: '病毒',
      volcano: '火山',
      warning: '警告',
      water: '波浪',
      air: '风',
      build: '扳手',
    },
  },
  shell: {
    appMenu: {
      triggerA11yLabel: '应用菜单',
      exportSampleDeckItem: '导出示例卡组',
      settingsItem: '设置',
    },
    exportSampleDeckDialog: {
      title: '导出示例卡组',
      body: '这会将同一个示例卡组保存为两个文件：CSV 和 JSON。每个文件都会询问保存位置，你可以取消其中任何一个以跳过它。\n\nCSV：以 # 开头的行（title、description、category）在导入时会被跳过，接着是包含 "question" / "answer" 的标题行，之后每行一张卡片，此处用分号分隔（逗号、制表符或其他单个符号也可以）。\n\nJSON：还可以恢复标题、描述和分类。\n\n卡片的两面都可以使用基本的 HTML，例如 <b>、<i> 和 <br />。',
    },
    kebabMenu: {
      triggerA11yLabel: '更多选项',
    },
    searchBar: {
      inputA11yLabel: '搜索文字',
      closeButtonA11yLabel: '关闭搜索',
    },
  },
  settings: {
    settingsScreen: {
      title: '设置',
      generalSection: '通用',
      appSection: '应用',
      communitySection: '社区与支持',
      legalSection: '法律信息',
      changeLanguageItem: '更改语言',
      shareAppItem: '分享应用',
      shareMessage: '试试 Easy Flashcards，一款用卡组学习闪卡的应用：{url}',
      rateAppItem: '给应用评分',
      customerSupportItem: '客户支持',
      aboutItem: '关于',
      buyCoffeeItem: '请我喝杯咖啡',
      privacyPolicyItem: '隐私政策',
      termsItem: '服务条款',
    },
    languageDialog: {
      title: '更改语言',
      systemDefaultOption: '系统默认',
    },
    aboutAlert: {
      title: '关于',
      message: '{name}，版本 {version}',
    },
    linkFailedAlert: {
      title: '无法打开链接',
      message: '此设备上没有可以打开它的应用。',
    },
    emailFailedAlert: {
      title: '没有邮件应用',
      message: '如需联系客户支持，请发送邮件至 {email}。',
    },
    coffeeThanksAlert: {
      title: '谢谢！',
      message: '你的咖啡正送往开发者。感谢你的支持。',
    },
    coffeeUnavailableAlert: {
      title: '请我喝杯咖啡',
      message: '目前无法请喝咖啡，请稍后再试。',
    },
  },
  decks: {
    decksScreen: {
      searchA11yLabel: '搜索卡组',
      searchPlaceholder: '搜索卡组',
      loadError: '无法读取已保存的卡组。',
      addDeckA11yLabel: '添加卡组',
      emptyTitle: '还没有卡组',
      emptyMessage: '点按 + 按钮导入卡组文件，创建你的第一个卡组。',
    },
    emptyDeckAlert: {
      title: '空卡组',
      message: '此卡组中没有可学习的卡片。',
    },
    deleteDeckAlert: {
      title: '删除卡组',
      message: '要删除“{name}”、它的学习会话及全部统计数据吗？',
    },
    addDeckMenu: {
      title: '添加卡组',
      importItem: '从文件导入卡组',
      manualItem: '手动添加卡组',
    },
    deckOptionsMenu: {
      startWithOptionsItem: '带选项开始学习会话',
      editItem: '编辑卡组',
      exportItem: '导出到文件',
      deleteItem: '删除卡组',
    },
    exportFormatMenu: {
      title: '将卡组导出到文件',
    },
    csvSeparatorMenu: {
      title: 'CSV 分隔符',
      customItem: '自定义…',
    },
    deckCard: {
      optionsA11yLabel: '{name} 的选项',
      activeCount: '{count} 个进行中',
      lastSession: '上次：{date}',
      startA11yLabel: '开始 {name} 的学习会话',
    },
    masteryBar: {
      a11yLabel: '掌握情况：{summary}',
    },
    sessionSetupDialog: {
      title: '开始学习会话',
      invertedLabel: '反向',
      invertedDescription: '先显示答案，问题在背面。',
      shuffleLabel: '随机排序',
      shuffleDescription: '按随机顺序学习卡片。',
    },
    customSeparatorDialog: {
      title: '自定义分隔符',
      separatorLabel: '分隔符',
      separatorPlaceholder: '例如 |',
      errors: {
        empty: '请输入一个字符。',
        tooLong: '请只使用一个字符。',
        reserved: '不能使用引号、# 和换行符。',
        whitespace: '不允许使用空格。如需制表符，请使用“制表符”选项。',
        alphanumeric: '不允许使用字母和数字。',
      },
    },
  },
  editDeck: {
    deckNotFound: {
      title: '未找到卡组',
      message: '此卡组已不存在。',
      backButton: '返回卡组',
    },
    editDeckScreen: {
      titleLabel: '标题',
      descriptionLabel: '描述',
      descriptionPlaceholder: '可选',
      saveButtonA11yLabel: '保存卡组',
      addCardButton: '添加卡片',
    },
    titleNeededAlert: {
      title: '需要标题',
      message: '请为卡组输入标题。',
    },
    cardIncompleteAlert: {
      title: '卡片不完整',
      message: '第 {number} 张卡片需要同时有问题和答案。',
    },
    removeCardsAlert: {
      title: '移除卡片？',
      message: {
        other: '将从卡组中移除 {count} 张卡片及其统计数据。',
      },
    },
    discardChangesAlert: {
      title: '放弃更改？',
      messageEdit: '你对此卡组的修改尚未保存。',
      messageNew: '此卡组尚未保存。',
    },
    cardEditor: {
      title: '第 {number} 张卡片',
      removeButtonA11yLabel: '移除第 {number} 张卡片',
      questionLabel: '问题',
      questionA11yLabel: '第 {number} 张卡片的问题',
      answerLabel: '答案',
      answerA11yLabel: '第 {number} 张卡片的答案',
    },
    categoryField: {
      label: '分类',
      a11yLabel: '分类：{name}',
      a11yLabelNone: '分类：无',
      a11yHint: '打开分类选择器',
      noneValue: '无分类',
    },
    categoryPicker: {
      title: '分类',
      groupA11yLabel: '分类选择器',
      noneTile: '无分类',
    },
  },
  learn: {
    learnScreen: {
      searchA11yLabel: '搜索学习会话',
      searchPlaceholder: '搜索学习会话',
    },
    headerToolbar: {
      clearCompletedItem: '清除已完成的学习会话',
    },
    emptyState: {
      noSessionsTitle: '还没有学习会话',
      noSessionsMessage:
        '选择一个卡组并开始学习会话；在完成之前，它会一直显示在这里。',
      allClearedTitle: '没有可显示的学习会话',
      allClearedMessage:
        '已清除的学习会话仍会计入统计。从卡组开始新的学习会话即可在此看到。',
      goToDecksButton: '前往卡组',
    },
    deckUnavailableAlert: {
      title: '卡组不可用',
      message: '此卡组已不存在或没有卡片。',
    },
    clearCompletedSessionsAlert: {
      title: '清除已完成的学习会话',
      nothingToClear: '没有可清除的已完成学习会话。',
      message: {
        other:
          '要从此列表中移除 {count} 个已完成的学习会话吗？它们的结果会保留在统计中。',
      },
    },
    discardSessionAlert: {
      title: '放弃学习会话',
      message:
        '要放弃“{deckName}”未完成的学习会话吗？它的答案也会从统计中移除。',
    },
    clearSessionAlert: {
      title: '清除学习会话',
      message:
        '要从此列表中移除“{deckName}”已完成的学习会话吗？它的结果会保留在统计中。',
    },
    sessionOptionsMenu: {
      discardItem: '放弃学习会话',
      clearItem: '清除学习会话',
    },
    sessionCard: {
      inProgressStatus: {
        other: '进行中 \u2014 {answered}/{count} 张卡片',
      },
      completedStatus: {
        other: '已完成 \u2014 {count} 张卡片',
      },
      invertedPill: '反向',
      invertedPillA11yLabel: '反向学习会话',
      optionsA11yLabel: '{deckName} 学习会话的选项',
      started: '开始于 {date}',
      resumeButtonA11yLabel: '继续 {deckName} 的学习会话',
      replayButtonA11yLabel: '重新开始 {deckName} 的学习会话',
      reviewErrorsButtonA11yLabel: {
        other: '复习 {deckName} 中 {count} 张答错或不确定的卡片',
      },
      reviewErrorsDoneA11yLabel: '{deckName} 中答错或不确定的卡片已全部纠正',
    },
    sessionResultsBar: {
      progressA11yLabel:
        '进度：已回答 {answered}/{cardCount} \u2014 {ok} 个正确，{okeish} 个差不多，{notOk} 个错误',
    },
  },
  study: {
    studyScreen: {
      fallbackTitle: '学习会话',
      unavailableTitle: '没有可学习的内容',
      unavailableMessage: '此学习会话已不可用。',
      unavailableAction: '返回学习会话',
    },
    progressHeader: {
      position: '第 {current} 张，共 {total} 张',
      okCount: '正确 {count}',
    },
    invertedPill: {
      text: '反向',
      a11yLabel: '反向学习会话：正面显示答案',
    },
    swipeHint: {
      reviewing: '正在查看已回答的卡片 \u2014 向左滑动即可回到原来的位置',
    },
    historyStrip: {
      a11yLabel: '目前的答题记录',
    },
    flipCard: {
      questionLabel: '问题',
      answerLabel: '答案',
      revealHint: '点按以显示答案',
      backHint: '点按以再次查看问题',
      showQuestionA11yLabel: '显示问题',
      showAnswerA11yLabel: '显示答案',
    },
    sessionSummary: {
      title: '学习会话完成',
      successRateA11yLabel: '正确率 {rate}',
      reviewedCount: '已复习 {count}',
      studyAgainLabel: '再次学习整个卡组',
      studyAgainButtonA11yLabel: '再次学习整个卡组',
    },
    reviewSummary: {
      title: '复习完成',
      stillToFix: '还有 {count} 张待纠正',
      allFixed: '已全部纠正',
    },
    summaryAction: {
      reviewLabel: '复习答错或不确定的卡片',
      reviewButtonA11yLabel: {
        other: '复习 {count} 张答错或不确定的卡片',
      },
      backLabel: '返回学习会话',
      backButtonA11yLabel: '返回学习会话',
    },
  },
  categories: {
    categoriesScreen: {
      customSectionTitle: '自定义分类',
      customSectionSubtitle: {
        other: '{count} 个可用',
      },
      customEmptyHint: '你自己的分类会显示在这里。',
      defaultSectionTitle: '默认分类',
      defaultSectionSubtitle: {
        other: '{count} 个内置',
      },
      newCategoryButton: '新建分类',
      categoryTileA11yLabel: '{name} 的选项',
    },
    categoryOptionsMenu: {
      deleteItem: '删除分类',
    },
    deleteCategoryAlert: {
      title: '删除分类？',
      message: '将删除“{name}”。',
      messageWithDecks: {
        other: '将删除“{name}”。{count} 个卡组将不再有分类。',
      },
    },
    newCategoryScreen: {
      saveButtonA11yLabel: '保存分类',
      nameField: '名称',
      colourLabel: '颜色',
      iconLabel: '图标',
      nameCounter: '{length}/{max}',
      nameErrors: {
        empty: '请输入名称。',
        tooLong: {
          other: '最多使用 {count} 个字符。',
        },
        duplicate: '已存在同名的分类。',
      },
    },
    discardChangesAlert: {
      title: '放弃更改？',
      message: '此分类尚未保存。',
    },
    tilePreview: {
      placeholder: '分类名称',
      a11yLabel: '预览：{name}',
      noNameA11yLabel: '预览：尚未输入名称',
    },
    colourPicker: {
      a11yLabel: '颜色选择器',
      swatchA11yLabel: '第 {position} 种颜色，共 {total} 种',
    },
    customColourSwatch: {
      a11yLabel: '自定义颜色',
      a11yHint: '打开颜色选择窗口',
    },
    iconPicker: {
      a11yLabel: '图标选择器',
    },
    customColourDialog: {
      title: '自定义颜色',
      hueLabel: '色相',
      hueValue: '{value}°',
      saturationLabel: '饱和度',
      brightnessLabel: '亮度',
      percentValue: '{value}%',
      previewA11yLabel: '颜色预览 {color}',
      tooDark: '颜色太深，图标看不清。请尝试更浅的颜色。',
      useButton: '使用颜色',
    },
    categorySquare: {
      a11yLabel: '分类：{name}',
    },
  },
  stats: {
    statsScreen: {
      searchA11yLabel: '搜索卡组',
      searchPlaceholder: '搜索卡组',
      aggregatedHeading: '汇总统计',
      decksTile: {
        label: '卡组',
        caption: '你的资料库中',
      },
      totalCardsTile: {
        label: '卡片总数',
        caption: '所有卡组合计',
      },
      totalReviewsTile: {
        label: '复习总数',
        caption: {
          all: '已记录的答案',
          month: '本月的答案',
          week: '最近 7 天的答案',
        },
      },
      sessionsTile: {
        label: '学习会话',
        caption: '{count} 个进行中',
      },
      tileA11yLabel: '{label}：{value}，{caption}',
      decksBreakdownHeading: '卡组明细',
      deckCount: {
        other: '{count} 个卡组',
      },
      emptyState: {
        title: '还没有统计数据',
        message: '导入卡组并开始学习，结果会显示在这里。',
      },
    },
    masteryRing: {
      summaryA11yLabel: '正确率 {rate}。{shares}。数量：{counts}',
      caption: '正确率',
    },
    deckStatsCard: {
      summaryA11yLabel:
        '{name}：{shares}，{cards}，{sessions}，{reviews}，上次 {last}',
      openA11yHint: '打开各卡片的详情',
      cardsLabel: '卡片',
      sessionsLabel: '学习会话',
      reviewsLabel: '复习',
      lastLabel: '上次',
    },
    timeframeChips: {
      groupA11yLabel: '时间范围',
    },
  },
  deckStats: {
    deckStatsScreen: {
      optionsA11yLabel: '{deckName} 统计的选项',
      resetStatisticsMenuItem: '重置统计',
      resetAlert: {
        title: '重置统计',
        message: '要清除“{deckName}”的所有已记录结果和学习会话吗？',
      },
      notFound: {
        title: '未找到卡组',
        message: '此卡组已被删除。',
      },
      cardPerformanceTitle: '卡片表现',
      subtitle: {
        other: '{count} 张卡片 · {sort}',
      },
      subtitleNarrowed: {
        other: '{shown}/{count} 张卡片 · {sort}',
      },
      sortButtonA11yLabel: '卡片排序：{sort}',
      sortSheetTitle: '卡片排序',
      noCards: {
        title: '还没有卡片',
        message: '向此卡组添加卡片，即可查看每张卡片的表现。',
      },
      statusEmpty: {
        needsReview: {
          title: '没有待复习的卡片',
          message: '没有正确率低于 40% 的卡片。',
        },
        learning: {
          title: '没有学习中的卡片',
          message: '没有正确率在 40% 到 70% 之间的卡片。',
        },
        mastered: {
          title: '还没有已掌握的卡片',
          message: '正确率达到 70% 或以上的卡片即为已掌握。',
        },
        new: {
          title: '没有新卡片',
          message: '每张卡片都至少复习过一次。',
        },
      },
      showAllCardsButton: '显示所有卡片',
      noMatches: {
        filteredMessage: '在“{status}”筛选下没有与“{query}”匹配的内容。',
      },
    },
    deckIdentityRow: {
      categoryA11yLabel: '分类：{name}',
    },
    deckMasteryCard: {
      successRateA11yLabel: '正确率：{rate}',
      successRateNoReviewsA11yLabel: '正确率：尚无复习记录',
      successRateCaption: '正确率',
      answerTile: {
        ok: '{count} 个正确，{percent}',
        okeish: '{count} 个差不多，{percent}',
        notOk: '{count} 个错误，{percent}',
      },
      answerTileNoReviews: {
        ok: '{count} 个正确，尚无复习记录',
        okeish: '{count} 个差不多，尚无复习记录',
        notOk: '{count} 个错误，尚无复习记录',
      },
      reviewsFigure: '复习',
      sessionsFigure: '学习会话',
      lastSessionFigure: '上次学习会话',
      figureA11yLabel: '{label}：{value}',
      changeChip: {
        none: '与上次学习会话相比无变化',
        up: '比上次学习会话 +{points} 个百分点',
        down: '比上次学习会话 -{points} 个百分点',
        noneA11yLabel: '正确率与上次学习会话相比没有变化',
        upA11yLabel: {
          other: '正确率比上次学习会话上升了 {count} 个百分点',
        },
        downA11yLabel: {
          other: '正确率比上次学习会话下降了 {count} 个百分点',
        },
      },
    },
    cardStatsRow: {
      footerNeverReviewed: '从未复习',
      footerReviewed: {
        other: '{count} 次复习 · 复习于 {date}',
      },
      neverReviewedA11yLabel:
        '问题：{question}。答案：{answer}。{status}。从未复习。',
      reviewedA11yLabel: {
        other:
          '问题：{question}。答案：{answer}。{status}，正确率 {rate}。{count} 次复习：{ok} 个正确，{okeish} 个差不多，{notOk} 个错误。',
      },
      reviewedOnA11yLabel: {
        other:
          '问题：{question}。答案：{answer}。{status}，正确率 {rate}。{count} 次复习：{ok} 个正确，{okeish} 个差不多，{notOk} 个错误。复习于 {date}。',
      },
    },
    cardStatusChips: {
      groupA11yLabel: '卡片状态',
      allChip: '全部',
      chipLabel: '{label} ({count})',
      chipA11yLabel: {
        other: '{label}，{count} 张卡片',
      },
    },
    cardSearchField: {
      searchA11yLabel: '搜索卡片',
      searchPlaceholder: '搜索问题和答案',
      clearA11yLabel: '清除卡片搜索',
    },
    sessionHistoryChart: {
      title: '学习会话历史',
      subtitleLatest: '最近 {shown} 个，共 {total} 个',
      empty: {
        title: '此卡组没有学习会话',
        message: '在“卡组”标签页中开始一个，结果会显示在这里。',
      },
      unansweredLegend: '未回答',
      legendNote: '占每个学习会话卡片的百分比',
      sessionA11yLabel: {
        other:
          '{date} 的学习会话：正确率 {rate}，已回答 {answered}/{count} 张卡片 \u2014 {ok} 个正确，{okeish} 个差不多，{notOk} 个错误',
      },
      sessionNoAnswersA11yLabel: {
        other:
          '{date} 的学习会话：正确率暂无答案，已回答 {answered}/{count} 张卡片 \u2014 {ok} 个正确，{okeish} 个差不多，{notOk} 个错误',
      },
    },
  },
};

export const zhHans: Language = {
  code: 'zh-CN',
  plural: zhHansPlural,
  messages,
};
