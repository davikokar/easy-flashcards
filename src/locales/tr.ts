import type { Catalogue, Language, PluralRule } from '../utils/i18n';

export const trPlural: PluralRule = count => (count === 1 ? 'one' : 'other');

const messages: Catalogue = {
  common: {
    actions: {
      back: 'Geri',
      cancel: 'İptal',
      clear: 'Temizle',
      close: 'Kapat',
      delete: 'Sil',
      discard: 'At',
      export: 'Dışa aktar',
      keepEditing: 'Düzenlemeye devam et',
      ok: 'Tamam',
      reset: 'Sıfırla',
      save: 'Kaydet',
      start: 'Başlat',
    },
    search: {
      noMatchesTitle: 'Eşleşme yok',
      noMatchesMessage: '"{query}" ile eşleşen sonuç yok.',
      clearSearchButton: 'Aramayı temizle',
    },
    counts: {
      cards: {
        one: '{count} kart',
        other: '{count} kart',
      },
      sessions: {
        one: '{count} oturum',
        other: '{count} oturum',
      },
      reviews: {
        one: '{count} tekrar',
        other: '{count} tekrar',
      },
    },
  },
  navigation: {
    tabs: {
      decks: 'Desteler',
      learn: 'Öğren',
      categories: 'Kategoriler',
      statistics: 'İstatistikler',
    },
    headers: {
      decksList: 'Desteler',
      editDeck: 'Desteyi düzenle',
      newDeck: 'Yeni deste',
      learnList: 'Öğren',
      study: 'Oturum',
      categoriesList: 'Kategoriler',
      newCategory: 'Yeni kategori',
      statsOverview: 'İstatistikler',
      deckStats: 'Deste istatistikleri',
    },
  },
  answers: {
    answerLabels: {
      ok: 'İyi',
      okeish: 'Eh',
      notOk: 'Kötü',
    },
    shares: {
      notReviewed: 'Henüz tekrar edilmedi',
      summary: '{ok} İyi, {okeish} Eh, {notOk} Kötü',
    },
    cardStatus: {
      needsReview: 'Tekrar gerekli',
      learning: 'Öğreniliyor',
      mastered: 'Pekişti',
      new: 'Yeni',
    },
    timeframes: {
      all: 'Tüm zamanlar',
      month: 'Bu ay',
      week: 'Son 7 gün',
    },
    sortOrders: {
      hardest: 'Önce en zorlar',
      deck: 'Deste sırası',
      recent: 'Son tekrar edilenler',
    },
    dates: {
      never: 'Hiç',
    },
  },
  importExport: {
    defaultDeckName: 'İçe aktarılan deste',
    importErrors: {
      emptyFile: 'Seçilen dosya boş.',
      notADeck:
        'Bu bir Easy Flashcards deste dosyası değil. Uygulamadan dışa aktarılmış bir JSON dosyası seçin.',
      newerVersion:
        'Bu deste dosyası Easy Flashcards uygulamasının daha yeni bir sürümüyle oluşturulmuş. İçe aktarmak için uygulamayı güncelleyin.',
      noCards: 'Kullanılabilir kart bulunamadı. Her kartın bir sorusu ve bir cevabı olmalı.',
      noHeader:
        'Başlık satırı bulunamadı. Boş olmayan ve "#" ile başlamayan ilk satırda, virgül, noktalı virgül, sekme veya başka bir simgeyle ayrılmış "question" ve "answer" sütunları bulunmalı.',
      noUsableRows: 'Kullanılabilir satır bulunamadı. Her satırın bir sorusu ve bir cevabı olmalı.',
      unreadable: 'Seçilen dosya okunamadı.',
    },
    importAlert: {
      successTitle: 'Deste içe aktarıldı',
      successMessage: {
        one: '"{name}" destesinde artık {count} kart var.',
        other: '"{name}" destesinde artık {count} kart var.',
      },
      skippedRows: {
        one: '{count} eksik satır atlandı.',
        other: '{count} eksik satır atlandı.',
      },
      skippedCards: {
        one: '{count} eksik kart atlandı.',
        other: '{count} eksik kart atlandı.',
      },
      failedTitle: 'İçe aktarma başarısız',
      failedWithDetails: 'Dosya içe aktarılamadı: {details}',
      failedUnknown: 'Dosya içe aktarılırken bilinmeyen bir hata oluştu.',
    },
    exportAlert: {
      successTitle: 'Deste dışa aktarıldı',
      savedAs: '{name} olarak kaydedildi.',
      saved: 'Deste kaydedildi.',
      failedTitle: 'Dışa aktarma başarısız',
      deckGone: 'Bu deste artık yok.',
      failedFallback: 'Deste dışa aktarılamadı.',
    },
    separators: {
      comma: 'Virgül (,)',
      semicolon: 'Noktalı virgül (;)',
      tab: 'Sekme',
    },
    sampleExport: {
      successTitle: 'Örnek deste dışa aktarıldı',
      partlyTitle: 'Örnek deste kısmen dışa aktarıldı',
      failedTitle: 'Dışa aktarma başarısız',
      savedAsOne: '{name} olarak kaydedildi.',
      savedAsTwo: '{first} ve {second} olarak kaydedildi.',
      fileFailed: '{format} dosyası kaydedilemedi: {details}',
      fileNotSaved: '{format} dosyası kaydedilmedi.',
      unknownError: 'Bilinmeyen hata',
    },
  },
  categoryNames: {
    builtIn: {
      astronomy: 'Astronomi',
      biology: 'Biyoloji',
      botany: 'Botanik',
      chemistry: 'Kimya',
      cinema: 'Sinema',
      computer_science: 'Bilgisayar bilimi',
      economics: 'Ekonomi',
      gastronomy: 'Gastronomi',
      geography: 'Coğrafya',
      history: 'Tarih',
      languages: 'Diller',
      law: 'Hukuk',
      literature: 'Edebiyat',
      mathematics: 'Matematik',
      medicine: 'Tıp',
      music: 'Müzik',
      philosophy: 'Felsefe',
      physics: 'Fizik',
      religion: 'Din',
      sport: 'Spor',
      zoology: 'Zooloji',
    },
    icons: {
      plane_contrails: 'Uçak',
      anchor: 'Çapa',
      nutrition: 'Elma',
      emergency: 'Yıldız işareti',
      microbiology: 'Bakteri',
      finance: 'Çubuk grafik',
      sports_basketball: 'Basketbol',
      neurology: 'Beyin',
      bug_report: 'Böcek',
      calendar_month: 'Takvim',
      photo_camera: 'Fotoğraf makinesi',
      camera: 'Kamera diyaframı',
      cannabis: 'Kenevir yaprağı',
      directions_car: 'Araba',
      chess_pawn: 'Satranç piyonu',
      language_chinese_dayi: 'Çince ve Latin harfleri',
      location_city: 'Şehir',
      circle_circle: 'İç içe daireler',
      restaurant: 'Çatal bıçak',
      database: 'Veritabanı',
      nest_heat_link_e: 'Daire içinde nokta',
      engineering: 'Mühendis',
      face: 'Yüz',
      face_3: 'Saçlı yüz',
      theaters: 'Film şeridi',
      flag_2: 'Bayrak',
      science: 'Deney şişesi',
      save: 'Disket',
      sports_and_outdoors: 'Futbol topu',
      skillet: 'Tava',
      sports_esports: 'Oyun kumandası',
      language: 'Küre',
      diversity_3: 'İnsan grubu',
      psychology: 'Dişli çarklı kafa',
      headphones: 'Kulaklık',
      health_and_safety: 'Sağlık kalkanı',
      landscape_2: 'Tepeler',
      hive: 'Petek',
      hourglass_empty: 'Kum saati',
      house: 'Ev',
      icecream: 'Dondurma',
      temp_preferences_eco: 'Yapraklar',
      electric_bolt: 'Yıldırım',
      wand_stars: 'Sihirli değnek',
      biotech: 'Mikroskop',
      mindfulness: 'Farkındalık',
      motorcycle: 'Motosiklet',
      music_note_2: 'Müzik notası',
      network_node: 'Ağ',
      import_contacts: 'Açık kitap',
      pan_tool: 'Açık el',
      pets: 'Pati',
      stylus: 'Kalem',
      person: 'Kişi',
      history_edu: 'Tüy kalem ve kâğıt',
      radio: 'Radyo',
      raven: 'Kuzgun',
      rib_cage: 'Kaburga kafesi',
      rocket_launch: 'Roket',
      scatter_plot: 'Dağılım grafiği',
      category: 'Şekiller',
      interests: 'Şekiller ve kalp',
      shopping_cart: 'Alışveriş sepeti',
      functions: 'Sigma',
      skull: 'Kafatası',
      emoji_language: 'Gülen yüz ve küre',
      snowflake: 'Kar tanesi',
      hotel_class: 'Yıldız',
      mountain_flag: 'Zirve bayrağı',
      sunny: 'Güneş',
      mixture_med: 'Şırınga ve hap',
      temple_buddhist: 'Tapınak',
      text_snippet: 'Metin belgesi',
      theater_comedy: 'Tiyatro maskeleri',
      nest_thermostat_gen_3: 'Termostat',
      translate: 'Çeviri',
      nature: 'Ağaç',
      fertile: 'Lale',
      videocam: 'Video kamera',
      coronavirus: 'Virüs',
      volcano: 'Yanardağ',
      warning: 'Uyarı',
      water: 'Dalgalar',
      air: 'Rüzgâr',
      build: 'İngiliz anahtarı',
    },
  },
  shell: {
    appMenu: {
      triggerA11yLabel: 'Uygulama menüsü',
      exportSampleDeckItem: 'Örnek desteyi dışa aktar',
      settingsItem: 'Ayarlar',
    },
    settingsAlert: {
      title: 'Ayarlar',
      message: 'Ayarlar henüz kullanılamıyor.',
    },
    exportSampleDeckDialog: {
      title: 'Örnek desteyi dışa aktar',
      body: 'Bu işlem aynı örnek desteyi CSV ve JSON olmak üzere iki dosya olarak kaydeder. Her birinin nereye kaydedileceği sorulur; birini atlamak için iptal edebilirsiniz.\n\nCSV: # ile başlayan satırlar (başlık, açıklama, kategori) içe aktarırken atlanır; ardından bir "question" / "answer" başlık satırı ve her satırda bir kart gelir; burada noktalı virgülle ayrılmıştır (virgül, sekme veya başka bir tek simge de olur).\n\nJSON: başlığı, açıklamayı ve kategoriyi de geri getirir.\n\n<b>, <i> ve <br /> gibi temel HTML, kartın her iki yüzünde de kullanılabilir.',
    },
    kebabMenu: {
      triggerA11yLabel: 'Diğer seçenekler',
    },
    searchBar: {
      inputA11yLabel: 'Arama metni',
      closeButtonA11yLabel: 'Aramayı kapat',
    },
  },
  decks: {
    decksScreen: {
      searchA11yLabel: 'Destelerde ara',
      searchPlaceholder: 'Destelerde ara',
      loadError: 'Kayıtlı desteler okunamadı.',
      addDeckA11yLabel: 'Deste ekle',
      emptyTitle: 'Henüz deste yok',
      emptyMessage: 'İlk destenizi oluşturmak için + düğmesiyle bir deste dosyası içe aktarın.',
    },
    emptyDeckAlert: {
      title: 'Boş deste',
      message: 'Bu destede öğrenilecek kart yok.',
    },
    deleteDeckAlert: {
      title: 'Desteyi sil',
      message: '"{name}" destesi, oturumları ve tüm istatistikleri silinsin mi?',
    },
    addDeckMenu: {
      title: 'Deste ekle',
      importItem: 'Dosyadan deste içe aktar',
      manualItem: 'Deste elle ekle',
    },
    deckOptionsMenu: {
      startWithOptionsItem: 'Seçeneklerle oturum başlat',
      editItem: 'Desteyi düzenle',
      exportItem: 'Dosyaya dışa aktar',
      deleteItem: 'Desteyi sil',
    },
    exportFormatMenu: {
      title: 'Desteyi dosyaya dışa aktar',
    },
    csvSeparatorMenu: {
      title: 'CSV ayırıcı',
      customItem: 'Özel…',
    },
    deckCard: {
      optionsA11yLabel: '{name} seçenekleri',
      activeCount: '{count} etkin',
      lastSession: 'Son: {date}',
      startA11yLabel: '{name} için oturum başlat',
    },
    masteryBar: {
      a11yLabel: 'Hakimiyet: {summary}',
    },
    sessionSetupDialog: {
      title: 'Oturumu başlat',
      invertedLabel: 'Ters',
      invertedDescription: 'Önce cevabı, arka yüzde soruyu göster.',
      shuffleLabel: 'Karıştır',
      shuffleDescription: 'Kartları rastgele sırayla çalış.',
    },
    customSeparatorDialog: {
      title: 'Özel ayırıcı',
      separatorLabel: 'Ayırıcı',
      separatorPlaceholder: 'Örneğin |',
      errors: {
        empty: 'Bir karakter girin.',
        tooLong: 'Tek bir karakter kullanın.',
        reserved: 'Tırnak işaretleri, # ve satır sonları kullanılamaz.',
        whitespace: 'Boşluk kullanılamaz. Sekme için Sekme seçeneğini kullanın.',
        alphanumeric: 'Harf ve rakam kullanılamaz.',
      },
    },
  },
  editDeck: {
    deckNotFound: {
      title: 'Deste bulunamadı',
      message: 'Bu deste artık yok.',
      backButton: 'Destelere dön',
    },
    editDeckScreen: {
      titleLabel: 'Başlık',
      descriptionLabel: 'Açıklama',
      descriptionPlaceholder: 'İsteğe bağlı',
      saveButtonA11yLabel: 'Desteyi kaydet',
      addCardButton: 'Kart ekle',
    },
    titleNeededAlert: {
      title: 'Başlık gerekli',
      message: 'Desteye bir başlık verin.',
    },
    cardIncompleteAlert: {
      title: 'Kart eksik',
      message: '{number}. kartın hem sorusu hem cevabı olmalı.',
    },
    removeCardsAlert: {
      title: 'Kartlar kaldırılsın mı?',
      message: {
        one: '{count} kart, istatistikleriyle birlikte desteden kaldırılacak.',
        other: '{count} kart, istatistikleriyle birlikte desteden kaldırılacak.',
      },
    },
    discardChangesAlert: {
      title: 'Değişiklikler atılsın mı?',
      messageEdit: 'Bu destede yaptığınız düzenlemeler kaydedilmedi.',
      messageNew: 'Bu deste kaydedilmedi.',
    },
    cardEditor: {
      title: '{number}. kart',
      removeButtonA11yLabel: '{number}. kartı kaldır',
      questionLabel: 'Soru',
      questionA11yLabel: '{number}. kartın sorusu',
      answerLabel: 'Cevap',
      answerA11yLabel: '{number}. kartın cevabı',
    },
    categoryField: {
      label: 'Kategori',
      a11yLabel: 'Kategori: {name}',
      a11yLabelNone: 'Kategori: yok',
      a11yHint: 'Kategori seçiciyi açar',
      noneValue: 'Kategori yok',
    },
    categoryPicker: {
      title: 'Kategori',
      groupA11yLabel: 'Kategori seçici',
      noneTile: 'Kategori yok',
    },
  },
  learn: {
    learnScreen: {
      searchA11yLabel: 'Oturumlarda ara',
      searchPlaceholder: 'Oturumlarda ara',
    },
    headerToolbar: {
      clearCompletedItem: 'Tamamlanan oturumları temizle',
    },
    emptyState: {
      noSessionsTitle: 'Henüz oturum yok',
      noSessionsMessage: 'Bir deste seçip öğrenme oturumu başlatın; bitirene kadar burada görünür.',
      allClearedTitle: 'Gösterilecek oturum yok',
      allClearedMessage:
        'Temizlenen oturumlar istatistiklerde yine sayılır. Burada görmek için bir desteden yeni oturum başlatın.',
      goToDecksButton: 'Destelere git',
    },
    deckUnavailableAlert: {
      title: 'Deste kullanılamıyor',
      message: 'Bu deste artık yok veya hiç kartı yok.',
    },
    clearCompletedSessionsAlert: {
      title: 'Tamamlanan oturumları temizle',
      nothingToClear: 'Temizlenecek tamamlanmış oturum yok.',
      message: {
        one: '{count} tamamlanmış oturum bu listeden kaldırılsın mı? Sonuçları istatistiklerde kalır.',
        other:
          '{count} tamamlanmış oturum bu listeden kaldırılsın mı? Sonuçları istatistiklerde kalır.',
      },
    },
    discardSessionAlert: {
      title: 'Oturumu at',
      message:
        '"{deckName}" destesindeki bitmemiş oturum atılsın mı? Cevapları da istatistiklerden kaldırılır.',
    },
    clearSessionAlert: {
      title: 'Oturumu temizle',
      message:
        '"{deckName}" destesindeki tamamlanmış oturum bu listeden kaldırılsın mı? Sonuçları istatistiklerde kalır.',
    },
    sessionOptionsMenu: {
      discardItem: 'Oturumu at',
      clearItem: 'Oturumu temizle',
    },
    sessionCard: {
      inProgressStatus: {
        one: 'Devam ediyor \u2014 {answered}/{count} kart',
        other: 'Devam ediyor \u2014 {answered}/{count} kart',
      },
      completedStatus: {
        one: 'Tamamlandı \u2014 {count} kart',
        other: 'Tamamlandı \u2014 {count} kart',
      },
      invertedPill: 'Ters',
      invertedPillA11yLabel: 'Ters oturum',
      optionsA11yLabel: '{deckName} oturumu seçenekleri',
      started: 'Başlangıç: {date}',
      resumeButtonA11yLabel: '{deckName} için oturuma devam et',
      replayButtonA11yLabel: '{deckName} için oturumu yeniden başlat',
      reviewErrorsButtonA11yLabel: {
        one: '{deckName}: kaçırılan veya emin olunmayan {count} kartı gözden geçir',
        other: '{deckName}: kaçırılan veya emin olunmayan {count} kartı gözden geçir',
      },
      reviewErrorsDoneA11yLabel: '{deckName}: kaçırılan veya emin olunmayan tüm kartlar düzeltildi',
    },
    sessionResultsBar: {
      progressA11yLabel:
        'İlerleme: {cardCount} karttan {answered} tanesi cevaplandı \u2014 {ok} iyi, {okeish} eh, {notOk} kötü',
    },
  },
  study: {
    studyScreen: {
      fallbackTitle: 'Oturum',
      unavailableTitle: 'Çalışılacak bir şey yok',
      unavailableMessage: 'Bu oturum artık kullanılamıyor.',
      unavailableAction: 'Oturumlara dön',
    },
    progressHeader: {
      position: 'Kart {current} / {total}',
      okCount: 'İyi {count}',
    },
    invertedPill: {
      text: 'Ters',
      a11yLabel: 'Ters oturum: ön yüz cevabı gösterir',
    },
    swipeHint: {
      reviewing:
        'Cevaplanmış bir kart gözden geçiriliyor \u2014 kaldığınız yere dönmek için sola kaydırın',
    },
    historyStrip: {
      a11yLabel: 'Şu ana kadarki cevaplar',
    },
    flipCard: {
      questionLabel: 'SORU',
      answerLabel: 'CEVAP',
      revealHint: 'Cevabı görmek için dokunun',
      backHint: 'Soruyu tekrar görmek için dokunun',
      showQuestionA11yLabel: 'Soruyu göster',
      showAnswerA11yLabel: 'Cevabı göster',
    },
    sessionSummary: {
      title: 'Oturum tamamlandı',
      successRateA11yLabel: 'Başarı oranı {rate}',
      reviewedCount: 'Tekrar: {count}',
      studyAgainLabel: 'Tüm desteyi yeniden çalış',
      studyAgainButtonA11yLabel: 'Tüm desteyi yeniden çalış',
    },
    reviewSummary: {
      title: 'Gözden geçirme tamamlandı',
      stillToFix: '{count} düzeltilecek',
      allFixed: 'Hepsi düzeltildi',
    },
    summaryAction: {
      reviewLabel: 'Kaçırılan veya emin olunmayan kartları gözden geçir',
      reviewButtonA11yLabel: {
        one: 'Kaçırılan veya emin olunmayan {count} kartı gözden geçir',
        other: 'Kaçırılan veya emin olunmayan {count} kartı gözden geçir',
      },
      backLabel: 'Oturumlara dön',
      backButtonA11yLabel: 'Oturumlara dön',
    },
  },
  categories: {
    categoriesScreen: {
      customSectionTitle: 'Özel kategoriler',
      customSectionSubtitle: {
        one: '{count} mevcut',
        other: '{count} mevcut',
      },
      customEmptyHint: 'Kendi kategorileriniz burada görünecek.',
      defaultSectionTitle: 'Varsayılan kategoriler',
      defaultSectionSubtitle: {
        one: '{count} yerleşik',
        other: '{count} yerleşik',
      },
      newCategoryButton: 'Yeni kategori',
      categoryTileA11yLabel: '{name} seçenekleri',
    },
    categoryOptionsMenu: {
      deleteItem: 'Kategoriyi sil',
    },
    deleteCategoryAlert: {
      title: 'Kategori silinsin mi?',
      message: '"{name}" silinecek.',
      messageWithDecks: {
        one: '"{name}" silinecek. {count} destenin kategorisi olmayacak.',
        other: '"{name}" silinecek. {count} destenin kategorisi olmayacak.',
      },
    },
    newCategoryScreen: {
      saveButtonA11yLabel: 'Kategoriyi kaydet',
      nameField: 'Ad',
      colourLabel: 'Renk',
      iconLabel: 'Simge',
      nameCounter: '{length}/{max}',
      nameErrors: {
        empty: 'Bir ad girin.',
        tooLong: {
          one: '{count} karakter veya daha azını kullanın.',
          other: '{count} karakter veya daha azını kullanın.',
        },
        duplicate: 'Bu adda bir kategori zaten var.',
      },
    },
    discardChangesAlert: {
      title: 'Değişiklikler atılsın mı?',
      message: 'Bu kategori kaydedilmedi.',
    },
    tilePreview: {
      placeholder: 'Kategori adı',
      a11yLabel: 'Önizleme: {name}',
      noNameA11yLabel: 'Önizleme: henüz ad yok',
    },
    colourPicker: {
      a11yLabel: 'Renk seçici',
      swatchA11yLabel: 'Renk {position} / {total}',
    },
    customColourSwatch: {
      a11yLabel: 'Özel renk',
      a11yHint: 'Renk seçiciyi açar',
    },
    iconPicker: {
      a11yLabel: 'Simge seçici',
    },
    customColourDialog: {
      title: 'Özel renk',
      hueLabel: 'Ton',
      hueValue: '{value}°',
      saturationLabel: 'Doygunluk',
      brightnessLabel: 'Parlaklık',
      percentValue: '%{value}',
      previewA11yLabel: 'Renk önizlemesi {color}',
      tooDark: 'Simge için çok koyu. Daha açık bir renk deneyin.',
      useButton: 'Rengi kullan',
    },
    categorySquare: {
      a11yLabel: 'Kategori: {name}',
    },
  },
  stats: {
    statsScreen: {
      searchA11yLabel: 'Destelerde ara',
      searchPlaceholder: 'Destelerde ara',
      aggregatedHeading: 'Toplu istatistikler',
      decksTile: {
        label: 'Desteler',
        caption: 'Kitaplığınızda',
      },
      totalCardsTile: {
        label: 'Toplam kart',
        caption: 'Tüm destelerde',
      },
      totalReviewsTile: {
        label: 'Toplam tekrar',
        caption: {
          all: 'Kaydedilen cevaplar',
          month: 'Bu ayki cevaplar',
          week: 'Son 7 gündeki cevaplar',
        },
      },
      sessionsTile: {
        label: 'Oturumlar',
        caption: '{count} etkin',
      },
      tileA11yLabel: '{label}: {value}, {caption}',
      decksBreakdownHeading: 'Deste dökümü',
      deckCount: {
        one: '{count} deste',
        other: '{count} deste',
      },
      emptyState: {
        title: 'Henüz istatistik yok',
        message: 'Bir deste içe aktarıp çalışın; sonuçlar burada görünür.',
      },
    },
    masteryRing: {
      summaryA11yLabel: 'Başarı oranı {rate}. {shares}. Sayılar: {counts}',
      caption: 'Başarı oranı',
    },
    deckStatsCard: {
      summaryA11yLabel: '{name}: {shares}, {cards}, {sessions}, {reviews}, son {last}',
      openA11yHint: 'Kart ayrıntılarını açar',
      cardsLabel: 'Kartlar',
      sessionsLabel: 'Oturumlar',
      reviewsLabel: 'Tekrarlar',
      lastLabel: 'Son',
    },
    timeframeChips: {
      groupA11yLabel: 'Zaman aralığı',
    },
  },
  deckStats: {
    deckStatsScreen: {
      optionsA11yLabel: '{deckName} istatistikleri seçenekleri',
      resetStatisticsMenuItem: 'İstatistikleri sıfırla',
      resetAlert: {
        title: 'İstatistikleri sıfırla',
        message: '"{deckName}" destesinin tüm kayıtlı sonuçları ve oturumları temizlensin mi?',
      },
      notFound: {
        title: 'Deste bulunamadı',
        message: 'Bu deste silinmiş.',
      },
      cardPerformanceTitle: 'Kart performansı',
      subtitle: {
        one: '{count} kart · {sort}',
        other: '{count} kart · {sort}',
      },
      subtitleNarrowed: {
        one: '{count} karttan {shown} · {sort}',
        other: '{count} karttan {shown} · {sort}',
      },
      sortButtonA11yLabel: 'Kartları sırala: {sort}',
      sortSheetTitle: 'Kartları sırala',
      noCards: {
        title: 'Henüz kart yok',
        message: 'Her kartın nasıl gittiğini görmek için bu desteye kart ekleyin.',
      },
      statusEmpty: {
        needsReview: {
          title: 'Tekrar gerektiren kart yok',
          message: 'Hiçbir kartın başarı oranı %40 altında değil.',
        },
        learning: {
          title: 'Öğrenilmekte olan kart yok',
          message: 'Hiçbir kartın başarı oranı %40 ile %70 arasında değil.',
        },
        mastered: {
          title: 'Henüz pekişen kart yok',
          message: 'Başarı oranı %70 veya üzeri olan kart pekişmiş sayılır.',
        },
        new: {
          title: 'Yeni kart yok',
          message: 'Her kart en az bir kez tekrar edildi.',
        },
      },
      showAllCardsButton: 'Tüm kartları göster',
      noMatches: {
        filteredMessage: '"{query}" ile eşleşen ve {status} filtresine uyan sonuç yok.',
      },
    },
    deckIdentityRow: {
      categoryA11yLabel: 'Kategori: {name}',
    },
    deckMasteryCard: {
      successRateA11yLabel: 'Başarı oranı: {rate}',
      successRateNoReviewsA11yLabel: 'Başarı oranı: henüz tekrar yok',
      successRateCaption: 'Başarı oranı',
      answerTile: {
        ok: '{count} iyi, {percent}',
        okeish: '{count} eh, {percent}',
        notOk: '{count} kötü, {percent}',
      },
      answerTileNoReviews: {
        ok: '{count} iyi, henüz tekrar yok',
        okeish: '{count} eh, henüz tekrar yok',
        notOk: '{count} kötü, henüz tekrar yok',
      },
      reviewsFigure: 'Tekrarlar',
      sessionsFigure: 'Oturumlar',
      lastSessionFigure: 'Son oturum',
      figureA11yLabel: '{label}: {value}',
      changeChip: {
        none: 'Son oturumdan beri değişiklik yok',
        up: 'Son oturumdan beri +{points} puan',
        down: 'Son oturumdan beri -{points} puan',
        noneA11yLabel: 'Başarı oranı son oturumdan beri değişmedi',
        upA11yLabel: {
          one: 'Başarı oranı son oturumdan beri {count} puan arttı',
          other: 'Başarı oranı son oturumdan beri {count} puan arttı',
        },
        downA11yLabel: {
          one: 'Başarı oranı son oturumdan beri {count} puan azaldı',
          other: 'Başarı oranı son oturumdan beri {count} puan azaldı',
        },
      },
    },
    cardStatsRow: {
      footerNeverReviewed: 'Hiç tekrar edilmedi',
      footerReviewed: {
        one: '{count} tekrar · Son tekrar: {date}',
        other: '{count} tekrar · Son tekrar: {date}',
      },
      neverReviewedA11yLabel: 'Soru: {question}. Cevap: {answer}. {status}. Hiç tekrar edilmedi.',
      reviewedA11yLabel: {
        one: 'Soru: {question}. Cevap: {answer}. {status}, başarı oranı {rate}. {count} tekrar: {ok} iyi, {okeish} eh, {notOk} kötü.',
        other:
          'Soru: {question}. Cevap: {answer}. {status}, başarı oranı {rate}. {count} tekrar: {ok} iyi, {okeish} eh, {notOk} kötü.',
      },
      reviewedOnA11yLabel: {
        one: 'Soru: {question}. Cevap: {answer}. {status}, başarı oranı {rate}. {count} tekrar: {ok} iyi, {okeish} eh, {notOk} kötü. Son tekrar: {date}.',
        other:
          'Soru: {question}. Cevap: {answer}. {status}, başarı oranı {rate}. {count} tekrar: {ok} iyi, {okeish} eh, {notOk} kötü. Son tekrar: {date}.',
      },
    },
    cardStatusChips: {
      groupA11yLabel: 'Kart durumu',
      allChip: 'Tümü',
      chipLabel: '{label} ({count})',
      chipA11yLabel: {
        one: '{label}, {count} kart',
        other: '{label}, {count} kart',
      },
    },
    cardSearchField: {
      searchA11yLabel: 'Kartlarda ara',
      searchPlaceholder: 'Sorularda ve cevaplarda ara',
      clearA11yLabel: 'Kart aramasını temizle',
    },
    sessionHistoryChart: {
      title: 'Oturum geçmişi',
      subtitleLatest: '{total} oturumun son {shown} tanesi',
      empty: {
        title: 'Bu deste için oturum yok',
        message: 'Desteler sekmesinden bir oturum başlatın; sonuçları burada görünür.',
      },
      unansweredLegend: 'Cevaplanmamış',
      legendNote: 'Her oturumdaki kartların yüzdesi',
      sessionA11yLabel: {
        one: '{date} tarihli oturum: başarı oranı {rate}, {count} karttan {answered} tanesi cevaplandı \u2014 {ok} iyi, {okeish} eh, {notOk} kötü',
        other:
          '{date} tarihli oturum: başarı oranı {rate}, {count} karttan {answered} tanesi cevaplandı \u2014 {ok} iyi, {okeish} eh, {notOk} kötü',
      },
      sessionNoAnswersA11yLabel: {
        one: '{date} tarihli oturum: başarı oranı henüz cevap yok, {count} karttan {answered} tanesi cevaplandı \u2014 {ok} iyi, {okeish} eh, {notOk} kötü',
        other:
          '{date} tarihli oturum: başarı oranı henüz cevap yok, {count} karttan {answered} tanesi cevaplandı \u2014 {ok} iyi, {okeish} eh, {notOk} kötü',
      },
    },
  },
};

export const tr: Language = { code: 'tr', plural: trPlural, messages };
