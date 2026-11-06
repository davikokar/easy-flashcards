import type { Catalogue, Language, PluralRule } from '../utils/i18n';

// Indonesian has no plural forms (CLDR), so every count uses 'other'.
export const idPlural: PluralRule = () => 'other';

// "Okeish" is rendered "Lumayan": it reads as clearly between "Oke" and "Tidak oke".
const messages: Catalogue = {
  common: {
    actions: {
      back: 'Kembali',
      cancel: 'Batal',
      clear: 'Bersihkan',
      close: 'Tutup',
      delete: 'Hapus',
      discard: 'Buang',
      export: 'Ekspor',
      keepEditing: 'Lanjut mengedit',
      ok: 'OK',
      reset: 'Atur ulang',
      save: 'Simpan',
      start: 'Mulai',
    },
    search: {
      noMatchesTitle: 'Tidak ada hasil',
      noMatchesMessage: 'Tidak ada yang cocok dengan "{query}".',
      clearSearchButton: 'Hapus pencarian',
    },
    counts: {
      cards: {
        other: '{count} kartu',
      },
      sessions: {
        other: '{count} sesi',
      },
      reviews: {
        other: '{count} tinjauan',
      },
    },
  },
  navigation: {
    tabs: {
      decks: 'Dek',
      learn: 'Belajar',
      categories: 'Kategori',
      statistics: 'Statistik',
    },
    headers: {
      decksList: 'Dek',
      editDeck: 'Edit dek',
      newDeck: 'Dek baru',
      learnList: 'Belajar',
      study: 'Sesi',
      categoriesList: 'Kategori',
      newCategory: 'Kategori baru',
      statsOverview: 'Statistik',
      deckStats: 'Statistik dek',
    },
  },
  answers: {
    answerLabels: {
      ok: 'Oke',
      okeish: 'Lumayan',
      notOk: 'Tidak oke',
    },
    shares: {
      notReviewed: 'Belum ditinjau',
      summary: '{ok} Oke, {okeish} Lumayan, {notOk} Tidak oke',
    },
    cardStatus: {
      needsReview: 'Perlu ditinjau',
      learning: 'Dipelajari',
      mastered: 'Dikuasai',
      new: 'Baru',
    },
    timeframes: {
      all: 'Sepanjang waktu',
      month: 'Bulan ini',
      week: '7 hari terakhir',
    },
    sortOrders: {
      hardest: 'Tersulit dulu',
      deck: 'Urutan dek',
      recent: 'Baru ditinjau',
    },
    dates: {
      never: 'Tidak pernah',
    },
  },
  importExport: {
    defaultDeckName: 'Dek impor',
    importErrors: {
      emptyFile: 'File yang dipilih kosong.',
      notADeck:
        'Ini bukan file dek Easy Flashcards. Pilih file JSON yang diekspor dari aplikasi.',
      newerVersion:
        'File dek ini dibuat oleh Easy Flashcards versi yang lebih baru. Perbarui aplikasi untuk mengimpornya.',
      noCards:
        'Tidak ada kartu yang dapat digunakan. Setiap kartu harus memiliki pertanyaan dan jawaban.',
      noHeader:
        'Baris header tidak ditemukan. Baris pertama yang bukan baris kosong atau komentar "#" harus memuat kolom "question" dan "answer", dipisahkan dengan koma, titik koma, tab, atau satu simbol lain.',
      noUsableRows:
        'Tidak ada baris yang dapat digunakan. Setiap baris harus memiliki pertanyaan dan jawaban.',
      unreadable: 'File yang dipilih tidak dapat dibaca.',
    },
    importAlert: {
      successTitle: 'Dek diimpor',
      successMessage: {
        other: '"{name}" kini memiliki {count} kartu.',
      },
      skippedRows: {
        other: '{count} baris tidak lengkap dilewati.',
      },
      skippedCards: {
        other: '{count} kartu tidak lengkap dilewati.',
      },
      failedTitle: 'Impor gagal',
      failedWithDetails: 'File tidak dapat diimpor: {details}',
      failedUnknown: 'Terjadi kesalahan tidak dikenal saat mengimpor file.',
    },
    exportAlert: {
      successTitle: 'Dek diekspor',
      savedAs: 'Disimpan sebagai {name}.',
      saved: 'Dek telah disimpan.',
      failedTitle: 'Ekspor gagal',
      deckGone: 'Dek ini sudah tidak ada.',
      failedFallback: 'Dek tidak dapat diekspor.',
    },
    separators: {
      comma: 'Koma (,)',
      semicolon: 'Titik koma (;)',
      tab: 'Tab',
    },
    sampleExport: {
      successTitle: 'Dek contoh diekspor',
      partlyTitle: 'Dek contoh diekspor sebagian',
      failedTitle: 'Ekspor gagal',
      savedAsOne: 'Disimpan sebagai {name}.',
      savedAsTwo: 'Disimpan sebagai {first} dan {second}.',
      fileFailed: 'File {format} tidak dapat disimpan: {details}',
      fileNotSaved: 'File {format} tidak disimpan.',
      unknownError: 'Kesalahan tidak dikenal',
    },
  },
  categoryNames: {
    builtIn: {
      astronomy: 'Astronomi',
      biology: 'Biologi',
      botany: 'Botani',
      chemistry: 'Kimia',
      cinema: 'Sinema',
      computer_science: 'Ilmu komputer',
      economics: 'Ekonomi',
      gastronomy: 'Gastronomi',
      geography: 'Geografi',
      history: 'Sejarah',
      languages: 'Bahasa',
      law: 'Hukum',
      literature: 'Sastra',
      mathematics: 'Matematika',
      medicine: 'Kedokteran',
      music: 'Musik',
      philosophy: 'Filsafat',
      physics: 'Fisika',
      religion: 'Agama',
      sport: 'Olahraga',
      zoology: 'Zoologi',
    },
    icons: {
      plane_contrails: 'Pesawat',
      anchor: 'Jangkar',
      nutrition: 'Apel',
      emergency: 'Asterisk',
      microbiology: 'Bakteri',
      finance: 'Diagram batang',
      sports_basketball: 'Bola basket',
      neurology: 'Otak',
      bug_report: 'Serangga',
      calendar_month: 'Kalender',
      photo_camera: 'Kamera',
      camera: 'Diafragma kamera',
      cannabis: 'Daun ganja',
      directions_car: 'Mobil',
      chess_pawn: 'Bidak catur',
      language_chinese_dayi: 'Huruf Tionghoa dan Latin',
      location_city: 'Kota',
      circle_circle: 'Lingkaran konsentris',
      restaurant: 'Alat makan',
      database: 'Basis data',
      nest_heat_link_e: 'Titik dalam lingkaran',
      engineering: 'Insinyur',
      face: 'Wajah',
      face_3: 'Wajah berambut',
      theaters: 'Pita film',
      flag_2: 'Bendera',
      science: 'Labu kimia',
      save: 'Disket',
      sports_and_outdoors: 'Sepak bola',
      skillet: 'Wajan',
      sports_esports: 'Pengendali gim',
      language: 'Bola dunia',
      diversity_3: 'Kelompok orang',
      psychology: 'Kepala dengan roda gigi',
      headphones: 'Headphone',
      health_and_safety: 'Perisai kesehatan',
      landscape_2: 'Perbukitan',
      hive: 'Sarang lebah',
      hourglass_empty: 'Jam pasir',
      house: 'Rumah',
      icecream: 'Es krim',
      temp_preferences_eco: 'Dedaunan',
      electric_bolt: 'Petir',
      wand_stars: 'Tongkat sihir',
      biotech: 'Mikroskop',
      mindfulness: 'Meditasi',
      motorcycle: 'Sepeda motor',
      music_note_2: 'Not musik',
      network_node: 'Jaringan',
      import_contacts: 'Buku terbuka',
      pan_tool: 'Tangan terbuka',
      pets: 'Jejak kaki',
      stylus: 'Pensil',
      person: 'Orang',
      history_edu: 'Pena bulu dan kertas',
      radio: 'Radio',
      raven: 'Gagak',
      rib_cage: 'Tulang rusuk',
      rocket_launch: 'Roket',
      scatter_plot: 'Diagram sebar',
      category: 'Bentuk',
      interests: 'Bentuk dan hati',
      shopping_cart: 'Keranjang belanja',
      functions: 'Sigma',
      skull: 'Tengkorak',
      emoji_language: 'Smiley dan bola dunia',
      snowflake: 'Kepingan salju',
      hotel_class: 'Bintang',
      mountain_flag: 'Bendera puncak',
      sunny: 'Matahari',
      mixture_med: 'Suntikan dan pil',
      temple_buddhist: 'Kuil',
      text_snippet: 'Dokumen teks',
      theater_comedy: 'Topeng teater',
      nest_thermostat_gen_3: 'Termostat',
      translate: 'Terjemahan',
      nature: 'Pohon',
      fertile: 'Tulip',
      videocam: 'Kamera video',
      coronavirus: 'Virus',
      volcano: 'Gunung berapi',
      warning: 'Peringatan',
      water: 'Gelombang',
      air: 'Angin',
      build: 'Kunci inggris',
    },
  },
  shell: {
    appMenu: {
      triggerA11yLabel: 'Menu aplikasi',
      exportSampleDeckItem: 'Ekspor dek contoh',
      settingsItem: 'Pengaturan',
    },
    exportSampleDeckDialog: {
      title: 'Ekspor dek contoh',
      body: 'Ini menyimpan dek contoh yang sama sebagai dua file, CSV dan JSON. Kamu akan ditanya lokasi penyimpanan untuk masing-masing file dan dapat membatalkan salah satunya untuk melewatinya.\n\nCSV: baris yang diawali # (judul, deskripsi, kategori) dilewati saat impor, lalu baris header "question" / "answer" dan satu kartu per baris, di sini dipisahkan dengan titik koma (koma, tab, atau satu simbol lain juga bisa).\n\nJSON: juga memulihkan judul, deskripsi, dan kategori.\n\nHTML dasar seperti <b>, <i>, dan <br /> diperbolehkan di kedua sisi kartu.',
    },
    kebabMenu: {
      triggerA11yLabel: 'Opsi lainnya',
    },
    searchBar: {
      inputA11yLabel: 'Teks pencarian',
      closeButtonA11yLabel: 'Tutup pencarian',
    },
  },
  settings: {
    settingsScreen: {
      title: 'Pengaturan',
      generalSection: 'Umum',
      appSection: 'Aplikasi',
      communitySection: 'Komunitas dan dukungan',
      legalSection: 'Hukum',
      changeLanguageItem: 'Ubah bahasa',
      shareAppItem: 'Bagikan aplikasi',
      shareMessage: 'Coba Easy Flashcards, aplikasi untuk belajar dengan dek kartu belajar: {url}',
      rateAppItem: 'Beri nilai aplikasi',
      customerSupportItem: 'Dukungan pelanggan',
      aboutItem: 'Tentang',
      buyCoffeeItem: 'Traktir saya kopi',
      privacyPolicyItem: 'Kebijakan privasi',
      termsItem: 'Ketentuan',
    },
    languageDialog: {
      title: 'Ubah bahasa',
      systemDefaultOption: 'Bawaan sistem',
    },
    aboutAlert: {
      title: 'Tentang',
      message: '{name}, versi {version}',
    },
    linkFailedAlert: {
      title: 'Tautan tidak dapat dibuka',
      message: 'Tidak ada aplikasi di perangkat ini yang dapat membukanya.',
    },
    emailFailedAlert: {
      title: 'Tidak ada aplikasi email',
      message: 'Untuk menghubungi dukungan pelanggan, kirim email ke {email}.',
    },
    coffeeThanksAlert: {
      title: 'Terima kasih!',
      message: 'Kopimu sedang dalam perjalanan ke pengembang. Terima kasih atas dukunganmu.',
    },
    coffeeUnavailableAlert: {
      title: 'Traktir saya kopi',
      message: 'Mentraktir kopi tidak tersedia saat ini. Silakan coba lagi nanti.',
    },
  },
  decks: {
    decksScreen: {
      searchA11yLabel: 'Cari dek',
      searchPlaceholder: 'Cari dek',
      loadError: 'Dek tersimpan tidak dapat dibaca.',
      addDeckA11yLabel: 'Tambah dek',
      emptyTitle: 'Belum ada dek',
      emptyMessage:
        'Gunakan tombol + untuk mengimpor file dek dan membuat dek pertama.',
    },
    emptyDeckAlert: {
      title: 'Dek kosong',
      message: 'Dek ini tidak memiliki kartu untuk dipelajari.',
    },
    deleteDeckAlert: {
      title: 'Hapus dek',
      message: 'Hapus "{name}", sesinya, dan semua statistiknya?',
    },
    addDeckMenu: {
      title: 'Tambah dek',
      importItem: 'Impor dek dari file',
      manualItem: 'Tambah dek secara manual',
    },
    deckOptionsMenu: {
      startWithOptionsItem: 'Mulai sesi dengan opsi',
      editItem: 'Edit dek',
      exportItem: 'Ekspor ke file',
      deleteItem: 'Hapus dek',
    },
    exportFormatMenu: {
      title: 'Ekspor dek ke file',
    },
    csvSeparatorMenu: {
      title: 'Pemisah CSV',
      customItem: 'Kustom…',
    },
    deckCard: {
      optionsA11yLabel: 'Opsi untuk {name}',
      activeCount: '{count} aktif',
      lastSession: 'Terakhir: {date}',
      startA11yLabel: 'Mulai sesi untuk {name}',
    },
    masteryBar: {
      a11yLabel: 'Penguasaan: {summary}',
    },
    sessionSetupDialog: {
      title: 'Mulai sesi',
      invertedLabel: 'Terbalik',
      invertedDescription:
        'Tampilkan jawaban lebih dulu dan pertanyaan di sisi belakang.',
      shuffleLabel: 'Acak',
      shuffleDescription: 'Pelajari kartu dalam urutan acak.',
    },
    customSeparatorDialog: {
      title: 'Pemisah kustom',
      separatorLabel: 'Pemisah',
      separatorPlaceholder: 'Contoh: |',
      errors: {
        empty: 'Masukkan satu karakter.',
        tooLong: 'Gunakan satu karakter saja.',
        reserved: 'Tanda kutip, # dan jeda baris tidak dapat digunakan.',
        whitespace:
          'Spasi tidak diperbolehkan. Gunakan opsi Tab untuk karakter tab.',
        alphanumeric: 'Huruf dan angka tidak diperbolehkan.',
      },
    },
  },
  editDeck: {
    deckNotFound: {
      title: 'Dek tidak ditemukan',
      message: 'Dek ini sudah tidak ada.',
      backButton: 'Kembali ke dek',
    },
    editDeckScreen: {
      titleLabel: 'Judul',
      descriptionLabel: 'Deskripsi',
      descriptionPlaceholder: 'Opsional',
      saveButtonA11yLabel: 'Simpan dek',
      addCardButton: 'Tambah kartu',
    },
    titleNeededAlert: {
      title: 'Judul diperlukan',
      message: 'Beri judul pada dek.',
    },
    cardIncompleteAlert: {
      title: 'Kartu belum lengkap',
      message: 'Kartu {number} harus memiliki pertanyaan dan jawaban.',
    },
    removeCardsAlert: {
      title: 'Hapus kartu?',
      message: {
        other: '{count} kartu akan dihapus dari dek, beserta statistiknya.',
      },
    },
    discardChangesAlert: {
      title: 'Buang perubahan?',
      messageEdit: 'Perubahan pada dek ini belum disimpan.',
      messageNew: 'Dek ini belum disimpan.',
    },
    cardEditor: {
      title: 'Kartu {number}',
      removeButtonA11yLabel: 'Hapus kartu {number}',
      questionLabel: 'Pertanyaan',
      questionA11yLabel: 'Pertanyaan untuk kartu {number}',
      answerLabel: 'Jawaban',
      answerA11yLabel: 'Jawaban untuk kartu {number}',
    },
    categoryField: {
      label: 'Kategori',
      a11yLabel: 'Kategori: {name}',
      a11yLabelNone: 'Kategori: tidak ada',
      a11yHint: 'Membuka pemilih kategori',
      noneValue: 'Tanpa kategori',
    },
    categoryPicker: {
      title: 'Kategori',
      groupA11yLabel: 'Pemilih kategori',
      noneTile: 'Tanpa kategori',
    },
  },
  learn: {
    learnScreen: {
      searchA11yLabel: 'Cari sesi',
      searchPlaceholder: 'Cari sesi',
    },
    headerToolbar: {
      clearCompletedItem: 'Bersihkan sesi selesai',
    },
    emptyState: {
      noSessionsTitle: 'Belum ada sesi',
      noSessionsMessage:
        'Pilih dek dan mulai sesi belajar; sesi akan muncul di sini sampai selesai.',
      allClearedTitle: 'Tidak ada sesi untuk ditampilkan',
      allClearedMessage:
        'Sesi yang dibersihkan tetap dihitung di Statistik. Mulai sesi baru dari sebuah dek untuk melihatnya di sini.',
      goToDecksButton: 'Ke dek',
    },
    deckUnavailableAlert: {
      title: 'Dek tidak tersedia',
      message: 'Dek ini sudah tidak ada atau tidak memiliki kartu.',
    },
    clearCompletedSessionsAlert: {
      title: 'Bersihkan sesi selesai',
      nothingToClear: 'Tidak ada sesi selesai untuk dibersihkan.',
      message: {
        other:
          'Hapus {count} sesi selesai dari daftar ini? Hasilnya tetap ada di Statistik.',
      },
    },
    discardSessionAlert: {
      title: 'Buang sesi',
      message:
        'Buang sesi yang belum selesai untuk "{deckName}"? Jawabannya juga dihapus dari Statistik.',
    },
    clearSessionAlert: {
      title: 'Bersihkan sesi',
      message:
        'Hapus sesi selesai untuk "{deckName}" dari daftar ini? Hasilnya tetap ada di Statistik.',
    },
    sessionOptionsMenu: {
      discardItem: 'Buang sesi',
      clearItem: 'Bersihkan sesi',
    },
    sessionCard: {
      inProgressStatus: {
        other: 'Berlangsung \u2014 {answered}/{count} kartu',
      },
      completedStatus: {
        other: 'Selesai \u2014 {count} kartu',
      },
      invertedPill: 'Terbalik',
      invertedPillA11yLabel: 'Sesi terbalik',
      optionsA11yLabel: 'Opsi untuk sesi {deckName}',
      started: 'Dimulai {date}',
      resumeButtonA11yLabel: 'Lanjutkan sesi untuk {deckName}',
      replayButtonA11yLabel: 'Ulangi sesi untuk {deckName}',
      reviewErrorsButtonA11yLabel: {
        other: 'Tinjau {count} kartu yang salah atau ragu untuk {deckName}',
      },
      reviewErrorsDoneA11yLabel:
        'Semua kartu yang salah atau ragu sudah diperbaiki untuk {deckName}',
    },
    sessionResultsBar: {
      progressA11yLabel:
        'Kemajuan: {answered} dari {cardCount} terjawab \u2014 {ok} oke, {okeish} lumayan, {notOk} tidak oke',
    },
  },
  study: {
    studyScreen: {
      fallbackTitle: 'Sesi',
      unavailableTitle: 'Tidak ada yang dipelajari',
      unavailableMessage: 'Sesi ini sudah tidak tersedia.',
      unavailableAction: 'Kembali ke sesi',
    },
    progressHeader: {
      position: 'Kartu {current} dari {total}',
      okCount: 'Oke {count}',
    },
    invertedPill: {
      text: 'Terbalik',
      a11yLabel: 'Sesi terbalik: sisi depan menampilkan jawaban',
    },
    swipeHint: {
      reviewing:
        'Meninjau kartu yang sudah dijawab \u2014 geser ke kiri untuk kembali ke posisi semula',
    },
    historyStrip: {
      a11yLabel: 'Jawaban sejauh ini',
    },
    flipCard: {
      questionLabel: 'PERTANYAAN',
      answerLabel: 'JAWABAN',
      revealHint: 'Ketuk untuk menampilkan jawaban',
      backHint: 'Ketuk untuk melihat pertanyaan lagi',
      showQuestionA11yLabel: 'Tampilkan pertanyaan',
      showAnswerA11yLabel: 'Tampilkan jawaban',
    },
    sessionSummary: {
      title: 'Sesi selesai',
      successRateA11yLabel: 'Tingkat keberhasilan {rate}',
      reviewedCount: 'Ditinjau {count}',
      studyAgainLabel: 'Pelajari seluruh dek lagi',
      studyAgainButtonA11yLabel: 'Pelajari seluruh dek lagi',
    },
    reviewSummary: {
      title: 'Tinjauan selesai',
      stillToFix: '{count} lagi perlu diperbaiki',
      allFixed: 'Semua beres',
    },
    summaryAction: {
      reviewLabel: 'Tinjau kartu yang salah atau ragu',
      reviewButtonA11yLabel: {
        other: 'Tinjau {count} kartu yang salah atau ragu',
      },
      backLabel: 'Kembali ke sesi',
      backButtonA11yLabel: 'Kembali ke sesi',
    },
  },
  categories: {
    categoriesScreen: {
      customSectionTitle: 'Kategori kustom',
      customSectionSubtitle: {
        other: '{count} tersedia',
      },
      customEmptyHint: 'Kategori buatanmu akan muncul di sini.',
      defaultSectionTitle: 'Kategori bawaan',
      defaultSectionSubtitle: {
        other: '{count} bawaan',
      },
      newCategoryButton: 'Kategori baru',
      categoryTileA11yLabel: 'Opsi untuk {name}',
    },
    categoryOptionsMenu: {
      deleteItem: 'Hapus kategori',
    },
    deleteCategoryAlert: {
      title: 'Hapus kategori?',
      message: '"{name}" akan dihapus.',
      messageWithDecks: {
        other:
          '"{name}" akan dihapus. {count} dek akan menjadi tanpa kategori.',
      },
    },
    newCategoryScreen: {
      saveButtonA11yLabel: 'Simpan kategori',
      nameField: 'Nama',
      colourLabel: 'Warna',
      iconLabel: 'Ikon',
      nameCounter: '{length}/{max}',
      nameErrors: {
        empty: 'Masukkan nama.',
        tooLong: {
          other: 'Gunakan maksimal {count} karakter.',
        },
        duplicate: 'Kategori dengan nama ini sudah ada.',
      },
    },
    discardChangesAlert: {
      title: 'Buang perubahan?',
      message: 'Kategori ini belum disimpan.',
    },
    tilePreview: {
      placeholder: 'Nama kategori',
      a11yLabel: 'Pratinjau: {name}',
      noNameA11yLabel: 'Pratinjau: belum ada nama',
    },
    colourPicker: {
      a11yLabel: 'Pemilih warna',
      swatchA11yLabel: 'Warna {position} dari {total}',
    },
    customColourSwatch: {
      a11yLabel: 'Warna kustom',
      a11yHint: 'Membuka pemilih warna',
    },
    iconPicker: {
      a11yLabel: 'Pemilih ikon',
    },
    customColourDialog: {
      title: 'Warna kustom',
      hueLabel: 'Rona',
      hueValue: '{value}°',
      saturationLabel: 'Saturasi',
      brightnessLabel: 'Kecerahan',
      percentValue: '{value}%',
      previewA11yLabel: 'Pratinjau warna {color}',
      tooDark: 'Terlalu gelap untuk ikon. Coba warna yang lebih terang.',
      useButton: 'Gunakan warna',
    },
    categorySquare: {
      a11yLabel: 'Kategori: {name}',
    },
  },
  stats: {
    statsScreen: {
      searchA11yLabel: 'Cari dek',
      searchPlaceholder: 'Cari dek',
      aggregatedHeading: 'Statistik gabungan',
      decksTile: {
        label: 'Dek',
        caption: 'Di pustakamu',
      },
      totalCardsTile: {
        label: 'Total kartu',
        caption: 'Di semua dek',
      },
      totalReviewsTile: {
        label: 'Total tinjauan',
        caption: {
          all: 'Jawaban tercatat',
          month: 'Jawaban bulan ini',
          week: 'Jawaban dalam 7 hari terakhir',
        },
      },
      sessionsTile: {
        label: 'Sesi',
        caption: '{count} aktif',
      },
      tileA11yLabel: '{label}: {value}, {caption}',
      decksBreakdownHeading: 'Rincian dek',
      deckCount: {
        other: '{count} dek',
      },
      emptyState: {
        title: 'Belum ada statistik',
        message: 'Impor dek dan pelajari; hasilnya akan muncul di sini.',
      },
    },
    masteryRing: {
      summaryA11yLabel:
        'Tingkat keberhasilan {rate}. {shares}. Jumlah: {counts}',
      caption: 'Tingkat keberhasilan',
    },
    deckStatsCard: {
      summaryA11yLabel:
        '{name}: {shares}, {cards}, {sessions}, {reviews}, terakhir {last}',
      openA11yHint: 'Membuka detail per kartu',
      cardsLabel: 'Kartu',
      sessionsLabel: 'Sesi',
      reviewsLabel: 'Tinjauan',
      lastLabel: 'Terakhir',
    },
    timeframeChips: {
      groupA11yLabel: 'Rentang waktu',
    },
  },
  deckStats: {
    deckStatsScreen: {
      optionsA11yLabel: 'Opsi untuk statistik {deckName}',
      resetStatisticsMenuItem: 'Atur ulang statistik',
      resetAlert: {
        title: 'Atur ulang statistik',
        message: 'Hapus semua hasil dan sesi yang tercatat untuk "{deckName}"?',
      },
      notFound: {
        title: 'Dek tidak ditemukan',
        message: 'Dek ini telah dihapus.',
      },
      cardPerformanceTitle: 'Performa kartu',
      subtitle: {
        other: '{count} kartu · {sort}',
      },
      subtitleNarrowed: {
        other: '{shown} dari {count} kartu · {sort}',
      },
      sortButtonA11yLabel: 'Urutkan kartu: {sort}',
      sortSheetTitle: 'Urutkan kartu',
      noCards: {
        title: 'Belum ada kartu',
        message:
          'Tambahkan kartu ke dek ini untuk melihat performa tiap kartu.',
      },
      statusEmpty: {
        needsReview: {
          title: 'Tidak ada kartu yang perlu ditinjau',
          message: 'Tidak ada kartu dengan keberhasilan di bawah 40%.',
        },
        learning: {
          title: 'Tidak ada kartu yang sedang dipelajari',
          message: 'Tidak ada kartu dengan keberhasilan antara 40% dan 70%.',
        },
        mastered: {
          title: 'Belum ada kartu yang dikuasai',
          message: 'Kartu dianggap dikuasai pada keberhasilan 70% atau lebih.',
        },
        new: {
          title: 'Tidak ada kartu baru',
          message: 'Setiap kartu sudah ditinjau setidaknya sekali.',
        },
      },
      showAllCardsButton: 'Tampilkan semua kartu',
      noMatches: {
        filteredMessage:
          'Tidak ada yang cocok dengan "{query}" pada filter {status}.',
      },
    },
    deckIdentityRow: {
      categoryA11yLabel: 'Kategori: {name}',
    },
    deckMasteryCard: {
      successRateA11yLabel: 'Tingkat keberhasilan: {rate}',
      successRateNoReviewsA11yLabel: 'Tingkat keberhasilan: belum ada tinjauan',
      successRateCaption: 'Tingkat keberhasilan',
      answerTile: {
        ok: '{count} oke, {percent}',
        okeish: '{count} lumayan, {percent}',
        notOk: '{count} tidak oke, {percent}',
      },
      answerTileNoReviews: {
        ok: '{count} oke, belum ada tinjauan',
        okeish: '{count} lumayan, belum ada tinjauan',
        notOk: '{count} tidak oke, belum ada tinjauan',
      },
      reviewsFigure: 'Tinjauan',
      sessionsFigure: 'Sesi',
      lastSessionFigure: 'Sesi terakhir',
      figureA11yLabel: '{label}: {value}',
      changeChip: {
        none: 'Tidak ada perubahan sejak sesi terakhir',
        up: '+{points} poin sejak sesi terakhir',
        down: '-{points} poin sejak sesi terakhir',
        noneA11yLabel: 'Tingkat keberhasilan tidak berubah sejak sesi terakhir',
        upA11yLabel: {
          other: 'Tingkat keberhasilan naik {count} poin sejak sesi terakhir',
        },
        downA11yLabel: {
          other: 'Tingkat keberhasilan turun {count} poin sejak sesi terakhir',
        },
      },
    },
    cardStatsRow: {
      footerNeverReviewed: 'Belum pernah ditinjau',
      footerReviewed: {
        other: '{count} tinjauan · Ditinjau {date}',
      },
      neverReviewedA11yLabel:
        'Pertanyaan: {question}. Jawaban: {answer}. {status}. Belum pernah ditinjau.',
      reviewedA11yLabel: {
        other:
          'Pertanyaan: {question}. Jawaban: {answer}. {status}, tingkat keberhasilan {rate}. {count} tinjauan: {ok} oke, {okeish} lumayan, {notOk} tidak oke.',
      },
      reviewedOnA11yLabel: {
        other:
          'Pertanyaan: {question}. Jawaban: {answer}. {status}, tingkat keberhasilan {rate}. {count} tinjauan: {ok} oke, {okeish} lumayan, {notOk} tidak oke. Ditinjau {date}.',
      },
    },
    cardStatusChips: {
      groupA11yLabel: 'Status kartu',
      allChip: 'Semua',
      chipLabel: '{label} ({count})',
      chipA11yLabel: {
        other: '{label}, {count} kartu',
      },
    },
    cardSearchField: {
      searchA11yLabel: 'Cari kartu',
      searchPlaceholder: 'Cari pertanyaan dan jawaban',
      clearA11yLabel: 'Hapus pencarian kartu',
    },
    sessionHistoryChart: {
      title: 'Riwayat sesi',
      subtitleLatest: '{shown} terbaru dari {total}',
      empty: {
        title: 'Tidak ada sesi untuk dek ini',
        message:
          'Mulai satu sesi dari tab Dek dan hasilnya akan tampil di sini.',
      },
      unansweredLegend: 'Belum dijawab',
      legendNote: '% dari kartu tiap sesi',
      sessionA11yLabel: {
        other:
          'Sesi pada {date}: tingkat keberhasilan {rate}, {answered} dari {count} kartu terjawab \u2014 {ok} oke, {okeish} lumayan, {notOk} tidak oke',
      },
      sessionNoAnswersA11yLabel: {
        other:
          'Sesi pada {date}: tingkat keberhasilan belum ada jawaban, {answered} dari {count} kartu terjawab \u2014 {ok} oke, {okeish} lumayan, {notOk} tidak oke',
      },
    },
  },
};

export const id: Language = { code: 'id', plural: idPlural, messages };
