import type { Catalogue, Language, PluralRule } from '../utils/i18n';

export const arPlural: PluralRule = count => {
  if (count === 0) {
    return 'zero';
  }
  if (count === 1) {
    return 'one';
  }
  if (count === 2) {
    return 'two';
  }
  const lastTwoDigits = count % 100;
  if (lastTwoDigits >= 3 && lastTwoDigits <= 10) {
    return 'few';
  }
  if (lastTwoDigits >= 11) {
    return 'many';
  }
  return 'other';
};

// "Okeish" is rendered "تقريبًا" ("almost"): it reads as clearly between "صحيح" and "خطأ".
const messages: Catalogue = {
  common: {
    actions: {
      back: 'رجوع',
      cancel: 'إلغاء',
      clear: 'مسح',
      close: 'إغلاق',
      delete: 'حذف',
      discard: 'تجاهل',
      export: 'تصدير',
      keepEditing: 'متابعة التعديل',
      ok: 'موافق',
      reset: 'إعادة تعيين',
      save: 'حفظ',
      start: 'بدء',
    },
    search: {
      noMatchesTitle: 'لا توجد نتائج',
      noMatchesMessage: 'لا توجد نتائج مطابقة لـ «{query}».',
      clearSearchButton: 'مسح البحث',
    },
    counts: {
      cards: {
        zero: '{count} بطاقات',
        one: '{count} بطاقة',
        two: '{count} بطاقتان',
        few: '{count} بطاقات',
        many: '{count} بطاقة',
        other: '{count} بطاقة',
      },
      sessions: {
        zero: '{count} جلسات',
        one: '{count} جلسة',
        two: '{count} جلستان',
        few: '{count} جلسات',
        many: '{count} جلسة',
        other: '{count} جلسة',
      },
      reviews: {
        zero: '{count} مراجعات',
        one: '{count} مراجعة',
        two: '{count} مراجعتان',
        few: '{count} مراجعات',
        many: '{count} مراجعة',
        other: '{count} مراجعة',
      },
    },
  },
  navigation: {
    tabs: {
      decks: 'المجموعات',
      learn: 'التعلم',
      categories: 'الفئات',
      statistics: 'الإحصائيات',
    },
    headers: {
      decksList: 'المجموعات',
      editDeck: 'تعديل المجموعة',
      newDeck: 'مجموعة جديدة',
      learnList: 'التعلم',
      study: 'الجلسة',
      categoriesList: 'الفئات',
      newCategory: 'فئة جديدة',
      statsOverview: 'الإحصائيات',
      deckStats: 'إحصائيات المجموعة',
    },
  },
  answers: {
    answerLabels: {
      ok: 'صحيح',
      okeish: 'تقريبًا',
      notOk: 'خطأ',
    },
    shares: {
      notReviewed: 'لم تتم المراجعة بعد',
      summary: '{ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
    },
    cardStatus: {
      needsReview: 'تحتاج مراجعة',
      learning: 'قيد التعلم',
      mastered: 'متقنة',
      new: 'جديدة',
    },
    timeframes: {
      all: 'كل الأوقات',
      month: 'هذا الشهر',
      week: 'آخر 7 أيام',
    },
    sortOrders: {
      hardest: 'الأصعب أولًا',
      deck: 'ترتيب المجموعة',
      recent: 'الأحدث مراجعة',
    },
    dates: {
      never: 'أبدًا',
    },
  },
  importExport: {
    defaultDeckName: 'مجموعة مستوردة',
    importErrors: {
      emptyFile: 'الملف المحدد فارغ.',
      notADeck:
        'هذا ليس ملف مجموعة من Easy Flashcards. اختر ملف JSON مُصدَّرًا من التطبيق.',
      newerVersion:
        'أُنشئ ملف المجموعة هذا بإصدار أحدث من Easy Flashcards. حدّث التطبيق لاستيراده.',
      noCards:
        'لم يتم العثور على بطاقات صالحة. تحتاج كل بطاقة إلى سؤال وإجابة.',
      noHeader:
        'لم يتم العثور على صف رأس. يجب أن يحتوي أول سطر ليس فارغًا ولا تعليقًا يبدأ بـ "#" على عمود باسم "question" وعمود باسم "answer"، يفصل بينهما فاصلة أو فاصلة منقوطة أو علامة جدولة أو رمز واحد آخر.',
      noUsableRows:
        'لم يتم العثور على صفوف صالحة. يحتاج كل صف إلى سؤال وإجابة.',
      unreadable: 'تعذّرت قراءة الملف المحدد.',
    },
    importAlert: {
      successTitle: 'تم استيراد المجموعة',
      successMessage: {
        zero: 'أصبحت المجموعة «{name}» تحتوي على {count} بطاقات.',
        one: 'أصبحت المجموعة «{name}» تحتوي على {count} بطاقة.',
        two: 'أصبحت المجموعة «{name}» تحتوي على {count} بطاقتين.',
        few: 'أصبحت المجموعة «{name}» تحتوي على {count} بطاقات.',
        many: 'أصبحت المجموعة «{name}» تحتوي على {count} بطاقة.',
        other: 'أصبحت المجموعة «{name}» تحتوي على {count} بطاقة.',
      },
      skippedRows: {
        zero: 'تم تخطي {count} صفوف غير مكتملة.',
        one: 'تم تخطي {count} صف غير مكتمل.',
        two: 'تم تخطي {count} صفين غير مكتملين.',
        few: 'تم تخطي {count} صفوف غير مكتملة.',
        many: 'تم تخطي {count} صفًا غير مكتمل.',
        other: 'تم تخطي {count} صف غير مكتمل.',
      },
      skippedCards: {
        zero: 'تم تخطي {count} بطاقات غير مكتملة.',
        one: 'تم تخطي {count} بطاقة غير مكتملة.',
        two: 'تم تخطي {count} بطاقتين غير مكتملتين.',
        few: 'تم تخطي {count} بطاقات غير مكتملة.',
        many: 'تم تخطي {count} بطاقة غير مكتملة.',
        other: 'تم تخطي {count} بطاقة غير مكتملة.',
      },
      failedTitle: 'فشل الاستيراد',
      failedWithDetails: 'تعذّر استيراد الملف: {details}',
      failedUnknown: 'حدث خطأ غير معروف أثناء استيراد الملف.',
    },
    exportAlert: {
      successTitle: 'تم تصدير المجموعة',
      savedAs: 'تم الحفظ باسم الملف «{name}».',
      saved: 'تم حفظ المجموعة.',
      failedTitle: 'فشل التصدير',
      deckGone: 'لم تعد هذه المجموعة موجودة.',
      failedFallback: 'تعذّر تصدير المجموعة.',
    },
    separators: {
      comma: 'فاصلة (,)',
      semicolon: 'فاصلة منقوطة (;)',
      tab: 'علامة جدولة',
    },
    sampleExport: {
      successTitle: 'تم تصدير المجموعة النموذجية',
      partlyTitle: 'تم تصدير المجموعة النموذجية جزئيًا',
      failedTitle: 'فشل التصدير',
      savedAsOne: 'تم الحفظ باسم الملف «{name}».',
      savedAsTwo: 'تم الحفظ باسم الملفين «{first}» و«{second}».',
      fileFailed: 'تعذّر حفظ ملف {format}: {details}',
      fileNotSaved: 'لم يتم حفظ ملف {format}.',
      unknownError: 'خطأ غير معروف',
    },
  },
  categoryNames: {
    builtIn: {
      astronomy: 'علم الفلك',
      biology: 'الأحياء',
      botany: 'علم النبات',
      chemistry: 'الكيمياء',
      cinema: 'السينما',
      computer_science: 'علوم الحاسوب',
      economics: 'الاقتصاد',
      gastronomy: 'فنون الطهي',
      geography: 'الجغرافيا',
      history: 'التاريخ',
      languages: 'اللغات',
      law: 'القانون',
      literature: 'الأدب',
      mathematics: 'الرياضيات',
      medicine: 'الطب',
      music: 'الموسيقى',
      philosophy: 'الفلسفة',
      physics: 'الفيزياء',
      religion: 'الدين',
      sport: 'الرياضة',
      zoology: 'علم الحيوان',
    },
    icons: {
      plane_contrails: 'طائرة',
      anchor: 'مرساة',
      nutrition: 'تفاحة',
      emergency: 'علامة النجمة',
      microbiology: 'بكتيريا',
      finance: 'مخطط شريطي',
      sports_basketball: 'كرة السلة',
      neurology: 'دماغ',
      bug_report: 'حشرة',
      calendar_month: 'تقويم',
      photo_camera: 'كاميرا',
      camera: 'فتحة العدسة',
      cannabis: 'ورقة القنب',
      directions_car: 'سيارة',
      chess_pawn: 'بيدق الشطرنج',
      language_chinese_dayi: 'حروف صينية ولاتينية',
      location_city: 'مدينة',
      circle_circle: 'دوائر متحدة المركز',
      restaurant: 'شوكة وسكين',
      database: 'قاعدة بيانات',
      nest_heat_link_e: 'نقطة داخل دائرة',
      engineering: 'مهندس',
      face: 'وجه',
      face_3: 'وجه بشعر',
      theaters: 'شريط أفلام',
      flag_2: 'علم',
      science: 'دورق',
      save: 'قرص مرن',
      sports_and_outdoors: 'كرة قدم',
      skillet: 'مقلاة',
      sports_esports: 'ذراع ألعاب',
      language: 'كرة أرضية',
      diversity_3: 'عدة أشخاص',
      psychology: 'رأس وترس',
      headphones: 'سماعات رأس',
      health_and_safety: 'درع صحي',
      landscape_2: 'تلال',
      hive: 'قرص عسل',
      hourglass_empty: 'ساعة رملية',
      house: 'منزل',
      icecream: 'مثلجات',
      temp_preferences_eco: 'أوراق شجر',
      electric_bolt: 'صاعقة',
      wand_stars: 'عصا سحرية',
      biotech: 'مجهر',
      mindfulness: 'اليقظة الذهنية',
      motorcycle: 'دراجة نارية',
      music_note_2: 'نوتة موسيقية',
      network_node: 'شبكة',
      import_contacts: 'كتاب مفتوح',
      pan_tool: 'يد مفتوحة',
      pets: 'كف حيوان',
      stylus: 'قلم',
      person: 'شخص',
      history_edu: 'ريشة وورقة',
      radio: 'راديو',
      raven: 'غراب',
      rib_cage: 'قفص صدري',
      rocket_launch: 'صاروخ',
      scatter_plot: 'مخطط انتشار',
      category: 'أشكال',
      interests: 'أشكال وقلب',
      shopping_cart: 'عربة تسوق',
      functions: 'سيغما',
      skull: 'جمجمة',
      emoji_language: 'وجه مبتسم وكرة أرضية',
      snowflake: 'ندفة ثلج',
      hotel_class: 'نجمة',
      mountain_flag: 'علم على قمة',
      sunny: 'شمس',
      mixture_med: 'حقنة وحبة دواء',
      temple_buddhist: 'معبد',
      text_snippet: 'مستند نصي',
      theater_comedy: 'أقنعة المسرح',
      nest_thermostat_gen_3: 'منظم حرارة',
      translate: 'ترجمة',
      nature: 'شجرة',
      fertile: 'زهرة التوليب',
      videocam: 'كاميرا فيديو',
      coronavirus: 'فيروس',
      volcano: 'بركان',
      warning: 'تحذير',
      water: 'أمواج',
      air: 'رياح',
      build: 'مفتاح ربط',
    },
  },
  shell: {
    appMenu: {
      triggerA11yLabel: 'قائمة التطبيق',
      exportSampleDeckItem: 'تصدير مجموعة نموذجية',
      settingsItem: 'الإعدادات',
    },
    exportSampleDeckDialog: {
      title: 'تصدير مجموعة نموذجية',
      body: 'يحفظ هذا الإجراء المجموعة النموذجية نفسها في ملفين: CSV وJSON. سيُطلب منك اختيار مكان حفظ كل ملف، ويمكنك إلغاء أيٍّ منهما لتخطيه.\n\nCSV: تُتجاهل عند الاستيراد الأسطر التي تبدأ بالرمز # (العنوان والوصف والفئة)، ثم يأتي صف رأس يحتوي على "question" و"answer" وبعده بطاقة واحدة في كل صف، مع الفصل هنا بفاصلة منقوطة (ويمكن أيضًا استخدام فاصلة أو علامة جدولة أو رمز واحد آخر).\n\nJSON: يستعيد أيضًا العنوان والوصف والفئة.\n\nيمكن استخدام HTML بسيط مثل <b> و<i> و<br /> في أي من وجهي البطاقة.',
    },
    kebabMenu: {
      triggerA11yLabel: 'خيارات إضافية',
    },
    searchBar: {
      inputA11yLabel: 'نص البحث',
      closeButtonA11yLabel: 'إغلاق البحث',
    },
  },
  settings: {
    settingsScreen: {
      title: 'الإعدادات',
      generalSection: 'عام',
      appSection: 'التطبيق',
      communitySection: 'المجتمع والدعم',
      legalSection: 'قانوني',
      changeLanguageItem: 'تغيير اللغة',
      shareAppItem: 'مشاركة التطبيق',
      shareMessage: 'جرّب Easy Flashcards، تطبيق لدراسة مجموعات البطاقات التعليمية: {url}',
      rateAppItem: 'تقييم التطبيق',
      customerSupportItem: 'دعم العملاء',
      aboutItem: 'حول',
      buyCoffeeItem: 'اشترِ لي قهوة',
      privacyPolicyItem: 'سياسة الخصوصية',
      termsItem: 'الشروط',
    },
    languageDialog: {
      title: 'تغيير اللغة',
      systemDefaultOption: 'الافتراضية للنظام',
    },
    aboutAlert: {
      title: 'حول',
      message: '{name}، الإصدار {version}',
    },
    linkFailedAlert: {
      title: 'تعذّر فتح الرابط',
      message: 'لم يتمكن أي تطبيق على هذا الجهاز من فتحه.',
    },
    emailFailedAlert: {
      title: 'لا يوجد تطبيق بريد إلكتروني',
      message: 'للتواصل مع دعم العملاء، راسل {email}.',
    },
    coffeeThanksAlert: {
      title: 'شكرًا لك!',
      message: 'قهوتك في طريقها إلى المطوّر. شكرًا على دعمك.',
    },
    coffeeUnavailableAlert: {
      title: 'اشترِ لي قهوة',
      message: 'شراء القهوة غير متاح حاليًا. يُرجى المحاولة لاحقًا.',
    },
  },
  decks: {
    decksScreen: {
      searchA11yLabel: 'البحث في المجموعات',
      searchPlaceholder: 'ابحث في المجموعات',
      loadError: 'تعذّرت قراءة المجموعات المحفوظة.',
      addDeckA11yLabel: 'إضافة مجموعة',
      emptyTitle: 'لا توجد مجموعات بعد',
      emptyMessage: 'استخدم الزر + لاستيراد ملف مجموعة وإنشاء مجموعتك الأولى.',
    },
    emptyDeckAlert: {
      title: 'مجموعة فارغة',
      message: 'لا تحتوي هذه المجموعة على بطاقات للتعلم.',
    },
    deleteDeckAlert: {
      title: 'حذف المجموعة',
      message: 'هل تريد حذف المجموعة «{name}» وجلساتها وجميع إحصائياتها؟',
    },
    addDeckMenu: {
      title: 'إضافة مجموعة',
      importItem: 'استيراد مجموعة من ملف',
      manualItem: 'إضافة مجموعة يدويًا',
    },
    deckOptionsMenu: {
      startWithOptionsItem: 'بدء جلسة بخيارات',
      editItem: 'تعديل المجموعة',
      exportItem: 'تصدير إلى ملف',
      deleteItem: 'حذف المجموعة',
    },
    exportFormatMenu: {
      title: 'تصدير المجموعة إلى ملف',
    },
    csvSeparatorMenu: {
      title: 'فاصل CSV',
      customItem: 'مخصص…',
    },
    deckCard: {
      optionsA11yLabel: 'خيارات المجموعة «{name}»',
      activeCount: '{count} نشطة',
      lastSession: 'الأخيرة: {date}',
      startA11yLabel: 'بدء جلسة للمجموعة «{name}»',
    },
    masteryBar: {
      a11yLabel: 'الإتقان: {summary}',
    },
    sessionSetupDialog: {
      title: 'بدء جلسة',
      invertedLabel: 'معكوسة',
      invertedDescription: 'عرض الإجابة أولًا والسؤال على الوجه الخلفي.',
      shuffleLabel: 'خلط',
      shuffleDescription: 'دراسة البطاقات بترتيب عشوائي.',
    },
    customSeparatorDialog: {
      title: 'فاصل مخصص',
      separatorLabel: 'الفاصل',
      separatorPlaceholder: 'مثال: |',
      errors: {
        empty: 'أدخل حرفًا واحدًا.',
        tooLong: 'استخدم حرفًا واحدًا فقط.',
        reserved: 'لا يمكن استخدام علامات الاقتباس أو # أو فواصل الأسطر.',
        whitespace:
          'المسافات غير مسموحة. استخدم خيار «علامة جدولة» لاستخدامها فاصلًا.',
        alphanumeric: 'الأحرف والأرقام غير مسموحة.',
      },
    },
  },
  editDeck: {
    deckNotFound: {
      title: 'المجموعة غير موجودة',
      message: 'لم تعد هذه المجموعة موجودة.',
      backButton: 'العودة إلى المجموعات',
    },
    editDeckScreen: {
      titleLabel: 'العنوان',
      descriptionLabel: 'الوصف',
      descriptionPlaceholder: 'اختياري',
      saveButtonA11yLabel: 'حفظ المجموعة',
      addCardButton: 'إضافة بطاقة',
    },
    titleNeededAlert: {
      title: 'العنوان مطلوب',
      message: 'أعطِ المجموعة عنوانًا.',
    },
    cardIncompleteAlert: {
      title: 'بطاقة غير مكتملة',
      message: 'تحتاج البطاقة {number} إلى سؤال وإجابة معًا.',
    },
    removeCardsAlert: {
      title: 'إزالة البطاقات؟',
      message: {
        zero: 'ستتم إزالة {count} بطاقات من المجموعة مع إحصائياتها.',
        one: 'ستتم إزالة {count} بطاقة من المجموعة مع إحصائياتها.',
        two: 'ستتم إزالة {count} بطاقتين من المجموعة مع إحصائياتهما.',
        few: 'ستتم إزالة {count} بطاقات من المجموعة مع إحصائياتها.',
        many: 'ستتم إزالة {count} بطاقة من المجموعة مع إحصائياتها.',
        other: 'ستتم إزالة {count} بطاقة من المجموعة مع إحصائياتها.',
      },
    },
    discardChangesAlert: {
      title: 'تجاهل التغييرات؟',
      messageEdit: 'لم يتم حفظ تعديلاتك على هذه المجموعة.',
      messageNew: 'لم يتم حفظ هذه المجموعة.',
    },
    cardEditor: {
      title: 'البطاقة {number}',
      removeButtonA11yLabel: 'إزالة البطاقة {number}',
      questionLabel: 'السؤال',
      questionA11yLabel: 'سؤال البطاقة {number}',
      answerLabel: 'الإجابة',
      answerA11yLabel: 'إجابة البطاقة {number}',
    },
    categoryField: {
      label: 'الفئة',
      a11yLabel: 'الفئة: {name}',
      a11yLabelNone: 'الفئة: لا شيء',
      a11yHint: 'يفتح منتقي الفئات',
      noneValue: 'بلا فئة',
    },
    categoryPicker: {
      title: 'الفئة',
      groupA11yLabel: 'منتقي الفئات',
      noneTile: 'بلا فئة',
    },
  },
  learn: {
    learnScreen: {
      searchA11yLabel: 'البحث في الجلسات',
      searchPlaceholder: 'ابحث في الجلسات',
    },
    headerToolbar: {
      clearCompletedItem: 'مسح الجلسات المكتملة',
    },
    emptyState: {
      noSessionsTitle: 'لا توجد جلسات بعد',
      noSessionsMessage:
        'اختر مجموعة وابدأ جلسة تعلم؛ ستظهر هنا إلى أن تنهيها.',
      allClearedTitle: 'لا توجد جلسات للعرض',
      allClearedMessage:
        'تبقى الجلسات الممسوحة محتسبة في الإحصائيات. ابدأ جلسة جديدة من إحدى المجموعات لتظهر هنا.',
      goToDecksButton: 'الانتقال إلى المجموعات',
    },
    deckUnavailableAlert: {
      title: 'المجموعة غير متاحة',
      message: 'لم تعد هذه المجموعة موجودة أو لا تحتوي على بطاقات.',
    },
    clearCompletedSessionsAlert: {
      title: 'مسح الجلسات المكتملة',
      nothingToClear: 'لا توجد جلسات مكتملة لمسحها.',
      message: {
        zero: 'هل تريد إزالة {count} جلسات مكتملة من هذه القائمة؟ تبقى نتائجها في الإحصائيات.',
        one: 'هل تريد إزالة {count} جلسة مكتملة من هذه القائمة؟ تبقى نتائجها في الإحصائيات.',
        two: 'هل تريد إزالة {count} جلستين مكتملتين من هذه القائمة؟ تبقى نتائجهما في الإحصائيات.',
        few: 'هل تريد إزالة {count} جلسات مكتملة من هذه القائمة؟ تبقى نتائجها في الإحصائيات.',
        many: 'هل تريد إزالة {count} جلسة مكتملة من هذه القائمة؟ تبقى نتائجها في الإحصائيات.',
        other:
          'هل تريد إزالة {count} جلسة مكتملة من هذه القائمة؟ تبقى نتائجها في الإحصائيات.',
      },
    },
    discardSessionAlert: {
      title: 'تجاهل الجلسة',
      message:
        'هل تريد تجاهل الجلسة غير المكتملة للمجموعة «{deckName}»؟ ستُزال إجاباتها أيضًا من الإحصائيات.',
    },
    clearSessionAlert: {
      title: 'مسح الجلسة',
      message:
        'هل تريد إزالة الجلسة المكتملة للمجموعة «{deckName}» من هذه القائمة؟ تبقى نتائجها في الإحصائيات.',
    },
    sessionOptionsMenu: {
      discardItem: 'تجاهل الجلسة',
      clearItem: 'مسح الجلسة',
    },
    sessionCard: {
      inProgressStatus: {
        zero: 'جارية \u2014 {answered}/{count} بطاقات',
        one: 'جارية \u2014 {answered}/{count} بطاقة',
        two: 'جارية \u2014 {answered}/{count} بطاقتين',
        few: 'جارية \u2014 {answered}/{count} بطاقات',
        many: 'جارية \u2014 {answered}/{count} بطاقة',
        other: 'جارية \u2014 {answered}/{count} بطاقة',
      },
      completedStatus: {
        zero: 'مكتملة \u2014 {count} بطاقات',
        one: 'مكتملة \u2014 {count} بطاقة',
        two: 'مكتملة \u2014 {count} بطاقتان',
        few: 'مكتملة \u2014 {count} بطاقات',
        many: 'مكتملة \u2014 {count} بطاقة',
        other: 'مكتملة \u2014 {count} بطاقة',
      },
      invertedPill: 'معكوسة',
      invertedPillA11yLabel: 'جلسة معكوسة',
      optionsA11yLabel: 'خيارات جلسة المجموعة «{deckName}»',
      started: 'بدأت {date}',
      resumeButtonA11yLabel: 'متابعة جلسة المجموعة «{deckName}»',
      replayButtonA11yLabel: 'إعادة جلسة المجموعة «{deckName}»',
      reviewErrorsButtonA11yLabel: {
        zero: 'مراجعة {count} بطاقات خاطئة أو غير مؤكدة للمجموعة «{deckName}»',
        one: 'مراجعة {count} بطاقة خاطئة أو غير مؤكدة للمجموعة «{deckName}»',
        two: 'مراجعة {count} بطاقتين خاطئتين أو غير مؤكدتين للمجموعة «{deckName}»',
        few: 'مراجعة {count} بطاقات خاطئة أو غير مؤكدة للمجموعة «{deckName}»',
        many: 'مراجعة {count} بطاقة خاطئة أو غير مؤكدة للمجموعة «{deckName}»',
        other: 'مراجعة {count} بطاقة خاطئة أو غير مؤكدة للمجموعة «{deckName}»',
      },
      reviewErrorsDoneA11yLabel:
        'تم تصحيح كل البطاقات الخاطئة أو غير المؤكدة للمجموعة «{deckName}»',
    },
    sessionResultsBar: {
      progressA11yLabel:
        'التقدم: أُجيب عن {answered} من {cardCount} \u2014 {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
    },
  },
  study: {
    studyScreen: {
      fallbackTitle: 'الجلسة',
      unavailableTitle: 'لا شيء للدراسة',
      unavailableMessage: 'لم تعد هذه الجلسة متاحة.',
      unavailableAction: 'العودة إلى الجلسات',
    },
    progressHeader: {
      position: 'البطاقة {current} من {total}',
      okCount: 'صحيح {count}',
    },
    invertedPill: {
      text: 'معكوسة',
      a11yLabel: 'جلسة معكوسة: الوجه الأمامي يعرض الإجابة',
    },
    swipeHint: {
      reviewing: 'تستعرض بطاقة أُجيب عنها \u2014 اسحب لليسار للعودة إلى مكانك',
    },
    historyStrip: {
      a11yLabel: 'الإجابات حتى الآن',
    },
    flipCard: {
      questionLabel: 'السؤال',
      answerLabel: 'الإجابة',
      revealHint: 'انقر لإظهار الإجابة',
      backHint: 'انقر لرؤية السؤال مجددًا',
      showQuestionA11yLabel: 'إظهار السؤال',
      showAnswerA11yLabel: 'إظهار الإجابة',
    },
    sessionSummary: {
      title: 'اكتملت الجلسة',
      successRateA11yLabel: 'نسبة النجاح {rate}',
      reviewedCount: 'تمت مراجعة {count}',
      studyAgainLabel: 'دراسة المجموعة كاملة مجددًا',
      studyAgainButtonA11yLabel: 'دراسة المجموعة كاملة مجددًا',
    },
    reviewSummary: {
      title: 'اكتملت المراجعة',
      stillToFix: '{count} متبقية للتصحيح',
      allFixed: 'تم تصحيح الكل',
    },
    summaryAction: {
      reviewLabel: 'مراجعة البطاقات الخاطئة أو غير المؤكدة',
      reviewButtonA11yLabel: {
        zero: 'مراجعة {count} بطاقات خاطئة أو غير مؤكدة',
        one: 'مراجعة {count} بطاقة خاطئة أو غير مؤكدة',
        two: 'مراجعة {count} بطاقتين خاطئتين أو غير مؤكدتين',
        few: 'مراجعة {count} بطاقات خاطئة أو غير مؤكدة',
        many: 'مراجعة {count} بطاقة خاطئة أو غير مؤكدة',
        other: 'مراجعة {count} بطاقة خاطئة أو غير مؤكدة',
      },
      backLabel: 'العودة إلى الجلسات',
      backButtonA11yLabel: 'العودة إلى الجلسات',
    },
  },
  categories: {
    categoriesScreen: {
      customSectionTitle: 'الفئات المخصصة',
      customSectionSubtitle: {
        zero: '{count} فئات متاحة',
        one: '{count} فئة متاحة',
        two: '{count} فئتان متاحتان',
        few: '{count} فئات متاحة',
        many: '{count} فئة متاحة',
        other: '{count} فئة متاحة',
      },
      customEmptyHint: 'ستظهر فئاتك الخاصة هنا.',
      defaultSectionTitle: 'الفئات الافتراضية',
      defaultSectionSubtitle: {
        zero: '{count} فئات مدمجة',
        one: '{count} فئة مدمجة',
        two: '{count} فئتان مدمجتان',
        few: '{count} فئات مدمجة',
        many: '{count} فئة مدمجة',
        other: '{count} فئة مدمجة',
      },
      newCategoryButton: 'فئة جديدة',
      categoryTileA11yLabel: 'خيارات الفئة «{name}»',
    },
    categoryOptionsMenu: {
      deleteItem: 'حذف الفئة',
    },
    deleteCategoryAlert: {
      title: 'حذف الفئة؟',
      message: 'سيتم حذف الفئة «{name}».',
      messageWithDecks: {
        zero: 'سيتم حذف الفئة «{name}». ستصبح {count} مجموعات بلا فئة.',
        one: 'سيتم حذف الفئة «{name}». ستصبح {count} مجموعة بلا فئة.',
        two: 'سيتم حذف الفئة «{name}». ستصبح {count} مجموعتان بلا فئة.',
        few: 'سيتم حذف الفئة «{name}». ستصبح {count} مجموعات بلا فئة.',
        many: 'سيتم حذف الفئة «{name}». ستصبح {count} مجموعة بلا فئة.',
        other: 'سيتم حذف الفئة «{name}». ستصبح {count} مجموعة بلا فئة.',
      },
    },
    newCategoryScreen: {
      saveButtonA11yLabel: 'حفظ الفئة',
      nameField: 'الاسم',
      colourLabel: 'اللون',
      iconLabel: 'الأيقونة',
      nameCounter: '{length}/{max}',
      nameErrors: {
        empty: 'أدخل اسمًا.',
        tooLong: {
          zero: 'استخدم {count} أحرف أو أقل.',
          one: 'استخدم {count} حرف أو أقل.',
          two: 'استخدم {count} حرفين أو أقل.',
          few: 'استخدم {count} أحرف أو أقل.',
          many: 'استخدم {count} حرفًا أو أقل.',
          other: 'استخدم {count} حرف أو أقل.',
        },
        duplicate: 'توجد فئة بهذا الاسم بالفعل.',
      },
    },
    discardChangesAlert: {
      title: 'تجاهل التغييرات؟',
      message: 'لم يتم حفظ هذه الفئة.',
    },
    tilePreview: {
      placeholder: 'اسم الفئة',
      a11yLabel: 'معاينة: {name}',
      noNameA11yLabel: 'معاينة: لا اسم بعد',
    },
    colourPicker: {
      a11yLabel: 'منتقي الألوان',
      swatchA11yLabel: 'اللون {position} من {total}',
    },
    customColourSwatch: {
      a11yLabel: 'لون مخصص',
      a11yHint: 'يفتح أداة اختيار اللون',
    },
    iconPicker: {
      a11yLabel: 'منتقي الأيقونات',
    },
    customColourDialog: {
      title: 'لون مخصص',
      hueLabel: 'التدرج اللوني',
      hueValue: '{value}°',
      saturationLabel: 'التشبع',
      brightnessLabel: 'السطوع',
      percentValue: '{value}%',
      previewA11yLabel: 'معاينة اللون {color}',
      tooDark: 'اللون داكن جدًا بالنسبة للأيقونة. جرّب لونًا أفتح.',
      useButton: 'استخدام اللون',
    },
    categorySquare: {
      a11yLabel: 'الفئة: {name}',
    },
  },
  stats: {
    statsScreen: {
      searchA11yLabel: 'البحث في المجموعات',
      searchPlaceholder: 'ابحث في المجموعات',
      aggregatedHeading: 'إحصائيات إجمالية',
      decksTile: {
        label: 'المجموعات',
        caption: 'في مكتبتك',
      },
      totalCardsTile: {
        label: 'إجمالي البطاقات',
        caption: 'في كل المجموعات',
      },
      totalReviewsTile: {
        label: 'إجمالي المراجعات',
        caption: {
          all: 'الإجابات المسجلة',
          month: 'الإجابات هذا الشهر',
          week: 'الإجابات في آخر 7 أيام',
        },
      },
      sessionsTile: {
        label: 'الجلسات',
        caption: '{count} نشطة',
      },
      tileA11yLabel: '{label}: {value}، {caption}',
      decksBreakdownHeading: 'تفصيل المجموعات',
      deckCount: {
        zero: '{count} مجموعات',
        one: '{count} مجموعة',
        two: '{count} مجموعتان',
        few: '{count} مجموعات',
        many: '{count} مجموعة',
        other: '{count} مجموعة',
      },
      emptyState: {
        title: 'لا توجد إحصائيات بعد',
        message: 'استورد مجموعة وادرسها؛ ستظهر النتائج هنا.',
      },
    },
    masteryRing: {
      summaryA11yLabel: 'نسبة النجاح {rate}. {shares}. الأعداد: {counts}',
      caption: 'نسبة النجاح',
    },
    deckStatsCard: {
      summaryA11yLabel:
        'المجموعة «{name}»: {shares}، {cards}، {sessions}، {reviews}، الأخيرة {last}',
      openA11yHint: 'يفتح تفاصيل كل بطاقة',
      cardsLabel: 'البطاقات',
      sessionsLabel: 'الجلسات',
      reviewsLabel: 'المراجعات',
      lastLabel: 'الأخيرة',
    },
    timeframeChips: {
      groupA11yLabel: 'الفترة الزمنية',
    },
  },
  deckStats: {
    deckStatsScreen: {
      optionsA11yLabel: 'خيارات إحصائيات المجموعة «{deckName}»',
      resetStatisticsMenuItem: 'إعادة تعيين الإحصائيات',
      resetAlert: {
        title: 'إعادة تعيين الإحصائيات',
        message:
          'هل تريد مسح جميع النتائج والجلسات المسجلة للمجموعة «{deckName}»؟',
      },
      notFound: {
        title: 'المجموعة غير موجودة',
        message: 'تم حذف هذه المجموعة.',
      },
      cardPerformanceTitle: 'أداء البطاقات',
      subtitle: {
        zero: '{count} بطاقات · {sort}',
        one: '{count} بطاقة · {sort}',
        two: '{count} بطاقتان · {sort}',
        few: '{count} بطاقات · {sort}',
        many: '{count} بطاقة · {sort}',
        other: '{count} بطاقة · {sort}',
      },
      subtitleNarrowed: {
        zero: '{shown} من {count} بطاقات · {sort}',
        one: '{shown} من {count} بطاقة · {sort}',
        two: '{shown} من {count} بطاقتين · {sort}',
        few: '{shown} من {count} بطاقات · {sort}',
        many: '{shown} من {count} بطاقة · {sort}',
        other: '{shown} من {count} بطاقة · {sort}',
      },
      sortButtonA11yLabel: 'ترتيب البطاقات: {sort}',
      sortSheetTitle: 'ترتيب البطاقات',
      noCards: {
        title: 'لا توجد بطاقات بعد',
        message: 'أضف بطاقات إلى هذه المجموعة لترى أداء كل منها.',
      },
      statusEmpty: {
        needsReview: {
          title: 'لا توجد بطاقات تحتاج مراجعة',
          message: 'لا توجد بطاقة نسبة نجاحها أقل من 40%.',
        },
        learning: {
          title: 'لا توجد بطاقات قيد التعلم',
          message: 'لا توجد بطاقة نسبة نجاحها بين 40% و70%.',
        },
        mastered: {
          title: 'لا توجد بطاقات متقنة بعد',
          message: 'تُعد البطاقة متقنة عند نسبة نجاح 70% أو أكثر.',
        },
        new: {
          title: 'لا توجد بطاقات جديدة',
          message: 'روجعت كل بطاقة مرة واحدة على الأقل.',
        },
      },
      showAllCardsButton: 'عرض كل البطاقات',
      noMatches: {
        filteredMessage: 'لا توجد نتائج لـ «{query}» ضمن الحالة «{status}».',
      },
    },
    deckIdentityRow: {
      categoryA11yLabel: 'الفئة: {name}',
    },
    deckMasteryCard: {
      successRateA11yLabel: 'نسبة النجاح: {rate}',
      successRateNoReviewsA11yLabel: 'نسبة النجاح: لا توجد مراجعات بعد',
      successRateCaption: 'نسبة النجاح',
      answerTile: {
        ok: '{count} صحيح، {percent}',
        okeish: '{count} تقريبًا، {percent}',
        notOk: '{count} خطأ، {percent}',
      },
      answerTileNoReviews: {
        ok: '{count} صحيح، لا توجد مراجعات بعد',
        okeish: '{count} تقريبًا، لا توجد مراجعات بعد',
        notOk: '{count} خطأ، لا توجد مراجعات بعد',
      },
      reviewsFigure: 'المراجعات',
      sessionsFigure: 'الجلسات',
      lastSessionFigure: 'آخر جلسة',
      figureA11yLabel: '{label}: {value}',
      changeChip: {
        none: 'لا تغيير منذ آخر جلسة',
        up: 'ارتفاع {points} نقطة منذ آخر جلسة',
        down: 'انخفاض {points} نقطة منذ آخر جلسة',
        noneA11yLabel: 'لم تتغير نسبة النجاح منذ آخر جلسة',
        upA11yLabel: {
          zero: 'ارتفعت نسبة النجاح بمقدار {count} نقاط منذ آخر جلسة',
          one: 'ارتفعت نسبة النجاح بمقدار {count} نقطة منذ آخر جلسة',
          two: 'ارتفعت نسبة النجاح بمقدار {count} نقطتين منذ آخر جلسة',
          few: 'ارتفعت نسبة النجاح بمقدار {count} نقاط منذ آخر جلسة',
          many: 'ارتفعت نسبة النجاح بمقدار {count} نقطة منذ آخر جلسة',
          other: 'ارتفعت نسبة النجاح بمقدار {count} نقطة منذ آخر جلسة',
        },
        downA11yLabel: {
          zero: 'انخفضت نسبة النجاح بمقدار {count} نقاط منذ آخر جلسة',
          one: 'انخفضت نسبة النجاح بمقدار {count} نقطة منذ آخر جلسة',
          two: 'انخفضت نسبة النجاح بمقدار {count} نقطتين منذ آخر جلسة',
          few: 'انخفضت نسبة النجاح بمقدار {count} نقاط منذ آخر جلسة',
          many: 'انخفضت نسبة النجاح بمقدار {count} نقطة منذ آخر جلسة',
          other: 'انخفضت نسبة النجاح بمقدار {count} نقطة منذ آخر جلسة',
        },
      },
    },
    cardStatsRow: {
      footerNeverReviewed: 'لم تتم مراجعتها',
      footerReviewed: {
        zero: '{count} مراجعات · روجعت {date}',
        one: '{count} مراجعة · روجعت {date}',
        two: '{count} مراجعتان · روجعت {date}',
        few: '{count} مراجعات · روجعت {date}',
        many: '{count} مراجعة · روجعت {date}',
        other: '{count} مراجعة · روجعت {date}',
      },
      neverReviewedA11yLabel:
        'السؤال: {question}. الإجابة: {answer}. {status}. لم تتم مراجعتها بعد.',
      reviewedA11yLabel: {
        zero: 'السؤال: {question}. الإجابة: {answer}. {status}، نسبة النجاح {rate}. {count} مراجعات: {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ.',
        one: 'السؤال: {question}. الإجابة: {answer}. {status}، نسبة النجاح {rate}. {count} مراجعة: {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ.',
        two: 'السؤال: {question}. الإجابة: {answer}. {status}، نسبة النجاح {rate}. {count} مراجعتان: {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ.',
        few: 'السؤال: {question}. الإجابة: {answer}. {status}، نسبة النجاح {rate}. {count} مراجعات: {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ.',
        many: 'السؤال: {question}. الإجابة: {answer}. {status}، نسبة النجاح {rate}. {count} مراجعة: {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ.',
        other:
          'السؤال: {question}. الإجابة: {answer}. {status}، نسبة النجاح {rate}. {count} مراجعة: {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ.',
      },
      reviewedOnA11yLabel: {
        zero: 'السؤال: {question}. الإجابة: {answer}. {status}، نسبة النجاح {rate}. {count} مراجعات: {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ. روجعت {date}.',
        one: 'السؤال: {question}. الإجابة: {answer}. {status}، نسبة النجاح {rate}. {count} مراجعة: {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ. روجعت {date}.',
        two: 'السؤال: {question}. الإجابة: {answer}. {status}، نسبة النجاح {rate}. {count} مراجعتان: {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ. روجعت {date}.',
        few: 'السؤال: {question}. الإجابة: {answer}. {status}، نسبة النجاح {rate}. {count} مراجعات: {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ. روجعت {date}.',
        many: 'السؤال: {question}. الإجابة: {answer}. {status}، نسبة النجاح {rate}. {count} مراجعة: {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ. روجعت {date}.',
        other:
          'السؤال: {question}. الإجابة: {answer}. {status}، نسبة النجاح {rate}. {count} مراجعة: {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ. روجعت {date}.',
      },
    },
    cardStatusChips: {
      groupA11yLabel: 'حالة البطاقة',
      allChip: 'الكل',
      chipLabel: '{label} ({count})',
      chipA11yLabel: {
        zero: '{label}، {count} بطاقات',
        one: '{label}، {count} بطاقة',
        two: '{label}، {count} بطاقتان',
        few: '{label}، {count} بطاقات',
        many: '{label}، {count} بطاقة',
        other: '{label}، {count} بطاقة',
      },
    },
    cardSearchField: {
      searchA11yLabel: 'البحث في البطاقات',
      searchPlaceholder: 'ابحث في الأسئلة والإجابات',
      clearA11yLabel: 'مسح بحث البطاقات',
    },
    sessionHistoryChart: {
      title: 'سجل الجلسات',
      subtitleLatest: 'آخر {shown} من {total}',
      empty: {
        title: 'لا توجد جلسات لهذه المجموعة',
        message: 'ابدأ جلسة من تبويب المجموعات وستظهر نتائجها هنا.',
      },
      unansweredLegend: 'بلا إجابة',
      legendNote: '% من بطاقات كل جلسة',
      sessionA11yLabel: {
        zero: 'جلسة بتاريخ {date}: نسبة النجاح {rate}، أُجيب عن {answered} من {count} بطاقات \u2014 {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
        one: 'جلسة بتاريخ {date}: نسبة النجاح {rate}، أُجيب عن {answered} من {count} بطاقة \u2014 {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
        two: 'جلسة بتاريخ {date}: نسبة النجاح {rate}، أُجيب عن {answered} من {count} بطاقتين \u2014 {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
        few: 'جلسة بتاريخ {date}: نسبة النجاح {rate}، أُجيب عن {answered} من {count} بطاقات \u2014 {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
        many: 'جلسة بتاريخ {date}: نسبة النجاح {rate}، أُجيب عن {answered} من {count} بطاقة \u2014 {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
        other:
          'جلسة بتاريخ {date}: نسبة النجاح {rate}، أُجيب عن {answered} من {count} بطاقة \u2014 {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
      },
      sessionNoAnswersA11yLabel: {
        zero: 'جلسة بتاريخ {date}: نسبة النجاح لا توجد إجابات بعد، أُجيب عن {answered} من {count} بطاقات \u2014 {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
        one: 'جلسة بتاريخ {date}: نسبة النجاح لا توجد إجابات بعد، أُجيب عن {answered} من {count} بطاقة \u2014 {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
        two: 'جلسة بتاريخ {date}: نسبة النجاح لا توجد إجابات بعد، أُجيب عن {answered} من {count} بطاقتين \u2014 {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
        few: 'جلسة بتاريخ {date}: نسبة النجاح لا توجد إجابات بعد، أُجيب عن {answered} من {count} بطاقات \u2014 {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
        many: 'جلسة بتاريخ {date}: نسبة النجاح لا توجد إجابات بعد، أُجيب عن {answered} من {count} بطاقة \u2014 {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
        other:
          'جلسة بتاريخ {date}: نسبة النجاح لا توجد إجابات بعد، أُجيب عن {answered} من {count} بطاقة \u2014 {ok} صحيح، {okeish} تقريبًا، {notOk} خطأ',
      },
    },
  },
};

export const ar: Language = { code: 'ar', plural: arPlural, messages };
