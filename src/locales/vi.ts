import type { Catalogue, Language, PluralRule } from '../utils/i18n';

// Vietnamese has no plural forms (CLDR), so every count uses `other`.
export const viPlural: PluralRule = () => 'other';

// "Okeish" is rendered "Tạm ổn": it reads as clearly between "Ok" and "Không ok".
const messages: Catalogue = {
  common: {
    actions: {
      back: 'Quay lại',
      cancel: 'Hủy',
      clear: 'Gỡ',
      close: 'Đóng',
      delete: 'Xóa',
      discard: 'Bỏ',
      export: 'Xuất',
      keepEditing: 'Tiếp tục sửa',
      ok: 'OK',
      reset: 'Đặt lại',
      save: 'Lưu',
      start: 'Bắt đầu',
    },
    search: {
      noMatchesTitle: 'Không có kết quả',
      noMatchesMessage: 'Không có kết quả nào khớp với "{query}".',
      clearSearchButton: 'Xóa tìm kiếm',
    },
    counts: {
      cards: {
        other: '{count} thẻ',
      },
      sessions: {
        other: '{count} phiên',
      },
      reviews: {
        other: '{count} lượt ôn',
      },
    },
  },
  navigation: {
    tabs: {
      decks: 'Bộ thẻ',
      learn: 'Học',
      categories: 'Danh mục',
      statistics: 'Thống kê',
    },
    headers: {
      decksList: 'Bộ thẻ',
      editDeck: 'Sửa bộ thẻ',
      newDeck: 'Bộ thẻ mới',
      learnList: 'Học',
      study: 'Phiên học',
      categoriesList: 'Danh mục',
      newCategory: 'Danh mục mới',
      statsOverview: 'Thống kê',
      deckStats: 'Thống kê bộ thẻ',
    },
  },
  answers: {
    answerLabels: {
      ok: 'Ok',
      okeish: 'Tạm ổn',
      notOk: 'Không ok',
    },
    shares: {
      notReviewed: 'Chưa ôn',
      summary: '{ok} Ok, {okeish} Tạm ổn, {notOk} Không ok',
    },
    cardStatus: {
      needsReview: 'Cần ôn',
      learning: 'Đang học',
      mastered: 'Đã thuộc',
      new: 'Mới',
    },
    timeframes: {
      all: 'Mọi lúc',
      month: 'Tháng này',
      week: '7 ngày qua',
    },
    sortOrders: {
      hardest: 'Khó nhất trước',
      deck: 'Thứ tự trong bộ thẻ',
      recent: 'Ôn gần đây',
    },
    dates: {
      never: 'Chưa bao giờ',
    },
  },
  importExport: {
    defaultDeckName: 'Bộ thẻ đã nhập',
    importErrors: {
      emptyFile: 'Tệp đã chọn trống.',
      notADeck:
        'Đây không phải tệp bộ thẻ của Easy Flashcards. Hãy chọn tệp JSON đã xuất từ ứng dụng.',
      newerVersion:
        'Tệp bộ thẻ này được tạo bởi phiên bản Easy Flashcards mới hơn. Hãy cập nhật ứng dụng để nhập.',
      noCards: 'Không tìm thấy thẻ dùng được. Mỗi thẻ cần có câu hỏi và câu trả lời.',
      noHeader:
        'Không tìm thấy dòng tiêu đề. Dòng đầu tiên không trống và không phải chú thích "#" phải có cột "question" và cột "answer", phân tách bằng dấu phẩy, dấu chấm phẩy, tab hoặc một ký hiệu khác.',
      noUsableRows: 'Không tìm thấy dòng dùng được. Mỗi dòng cần có câu hỏi và câu trả lời.',
      unreadable: 'Không đọc được tệp đã chọn.',
    },
    importAlert: {
      successTitle: 'Đã nhập bộ thẻ',
      successMessage: {
        other: '"{name}" hiện có {count} thẻ.',
      },
      skippedRows: {
        other: 'Đã bỏ qua {count} dòng chưa đầy đủ.',
      },
      skippedCards: {
        other: 'Đã bỏ qua {count} thẻ chưa đầy đủ.',
      },
      failedTitle: 'Nhập thất bại',
      failedWithDetails: 'Không thể nhập tệp: {details}',
      failedUnknown: 'Lỗi không xác định khi nhập tệp.',
    },
    exportAlert: {
      successTitle: 'Đã xuất bộ thẻ',
      savedAs: 'Đã lưu thành {name}.',
      saved: 'Đã lưu bộ thẻ.',
      failedTitle: 'Xuất thất bại',
      deckGone: 'Bộ thẻ này không còn tồn tại.',
      failedFallback: 'Không thể xuất bộ thẻ.',
    },
    separators: {
      comma: 'Dấu phẩy (,)',
      semicolon: 'Dấu chấm phẩy (;)',
      tab: 'Tab',
    },
    sampleExport: {
      successTitle: 'Đã xuất bộ thẻ mẫu',
      partlyTitle: 'Đã xuất một phần bộ thẻ mẫu',
      failedTitle: 'Xuất thất bại',
      savedAsOne: 'Đã lưu thành {name}.',
      savedAsTwo: 'Đã lưu thành {first} và {second}.',
      fileFailed: 'Không thể lưu tệp {format}: {details}',
      fileNotSaved: 'Tệp {format} chưa được lưu.',
      unknownError: 'Lỗi không xác định',
    },
  },
  categoryNames: {
    builtIn: {
      astronomy: 'Thiên văn học',
      biology: 'Sinh học',
      botany: 'Thực vật học',
      chemistry: 'Hóa học',
      cinema: 'Điện ảnh',
      computer_science: 'Khoa học máy tính',
      economics: 'Kinh tế học',
      gastronomy: 'Ẩm thực',
      geography: 'Địa lý',
      history: 'Lịch sử',
      languages: 'Ngôn ngữ',
      law: 'Luật',
      literature: 'Văn học',
      mathematics: 'Toán học',
      medicine: 'Y học',
      music: 'Âm nhạc',
      philosophy: 'Triết học',
      physics: 'Vật lý',
      religion: 'Tôn giáo',
      sport: 'Thể thao',
      zoology: 'Động vật học',
    },
    icons: {
      plane_contrails: 'Máy bay',
      anchor: 'Mỏ neo',
      nutrition: 'Quả táo',
      emergency: 'Dấu hoa thị',
      microbiology: 'Vi khuẩn',
      finance: 'Biểu đồ cột',
      sports_basketball: 'Bóng rổ',
      neurology: 'Bộ não',
      bug_report: 'Con bọ',
      calendar_month: 'Lịch',
      photo_camera: 'Máy ảnh',
      camera: 'Khẩu độ máy ảnh',
      cannabis: 'Lá cần sa',
      directions_car: 'Ô tô',
      chess_pawn: 'Quân tốt',
      language_chinese_dayi: 'Chữ Hán và chữ Latinh',
      location_city: 'Thành phố',
      circle_circle: 'Vòng tròn đồng tâm',
      restaurant: 'Dao nĩa',
      database: 'Cơ sở dữ liệu',
      nest_heat_link_e: 'Chấm trong vòng tròn',
      engineering: 'Kỹ sư',
      face: 'Khuôn mặt',
      face_3: 'Khuôn mặt có tóc',
      theaters: 'Cuộn phim',
      flag_2: 'Lá cờ',
      science: 'Bình thí nghiệm',
      save: 'Đĩa mềm',
      sports_and_outdoors: 'Bóng đá',
      skillet: 'Chảo rán',
      sports_esports: 'Tay cầm chơi game',
      language: 'Quả địa cầu',
      diversity_3: 'Nhóm người',
      psychology: 'Đầu có bánh răng',
      headphones: 'Tai nghe',
      health_and_safety: 'Khiên sức khỏe',
      landscape_2: 'Đồi núi',
      hive: 'Tổ ong',
      hourglass_empty: 'Đồng hồ cát',
      house: 'Ngôi nhà',
      icecream: 'Kem',
      temp_preferences_eco: 'Lá cây',
      electric_bolt: 'Tia chớp',
      wand_stars: 'Đũa phép',
      biotech: 'Kính hiển vi',
      mindfulness: 'Chánh niệm',
      motorcycle: 'Xe máy',
      music_note_2: 'Nốt nhạc',
      network_node: 'Mạng lưới',
      import_contacts: 'Cuốn sách mở',
      pan_tool: 'Bàn tay mở',
      pets: 'Dấu chân thú',
      stylus: 'Bút chì',
      person: 'Người',
      history_edu: 'Bút lông và giấy',
      radio: 'Radio',
      raven: 'Con quạ',
      rib_cage: 'Lồng ngực',
      rocket_launch: 'Tên lửa',
      scatter_plot: 'Biểu đồ phân tán',
      category: 'Các hình khối',
      interests: 'Hình khối và trái tim',
      shopping_cart: 'Giỏ hàng',
      functions: 'Sigma',
      skull: 'Đầu lâu',
      emoji_language: 'Mặt cười và quả địa cầu',
      snowflake: 'Bông tuyết',
      hotel_class: 'Ngôi sao',
      mountain_flag: 'Cờ trên đỉnh núi',
      sunny: 'Mặt trời',
      mixture_med: 'Ống tiêm và viên thuốc',
      temple_buddhist: 'Ngôi chùa',
      text_snippet: 'Tài liệu văn bản',
      theater_comedy: 'Mặt nạ sân khấu',
      nest_thermostat_gen_3: 'Bộ điều nhiệt',
      translate: 'Dịch',
      nature: 'Cây',
      fertile: 'Hoa tulip',
      videocam: 'Máy quay phim',
      coronavirus: 'Vi-rút',
      volcano: 'Núi lửa',
      warning: 'Cảnh báo',
      water: 'Sóng nước',
      air: 'Gió',
      build: 'Cờ lê',
    },
  },
  shell: {
    appMenu: {
      triggerA11yLabel: 'Menu ứng dụng',
      exportSampleDeckItem: 'Xuất bộ thẻ mẫu',
      settingsItem: 'Cài đặt',
    },
    exportSampleDeckDialog: {
      title: 'Xuất bộ thẻ mẫu',
      body: 'Thao tác này lưu cùng một bộ thẻ mẫu thành hai tệp, CSV và JSON. Ứng dụng sẽ hỏi nơi lưu từng tệp; có thể hủy một trong hai để bỏ qua tệp đó.\n\nCSV: các dòng bắt đầu bằng # (tiêu đề, mô tả, danh mục) được bỏ qua khi nhập, tiếp đến là dòng tiêu đề "question" / "answer" và mỗi thẻ một dòng, ở đây phân tách bằng dấu chấm phẩy (dấu phẩy, tab hoặc một ký hiệu đơn khác cũng dùng được).\n\nJSON: còn khôi phục cả tiêu đề, mô tả và danh mục.\n\nCó thể dùng HTML cơ bản như <b>, <i> và <br /> ở cả hai mặt của thẻ.',
    },
    kebabMenu: {
      triggerA11yLabel: 'Thêm tùy chọn',
    },
    searchBar: {
      inputA11yLabel: 'Văn bản tìm kiếm',
      closeButtonA11yLabel: 'Đóng tìm kiếm',
    },
  },
  settings: {
    settingsScreen: {
      title: 'Cài đặt',
      generalSection: 'Chung',
      appSection: 'Ứng dụng',
      communitySection: 'Cộng đồng và hỗ trợ',
      legalSection: 'Pháp lý',
      changeLanguageItem: 'Đổi ngôn ngữ',
      shareAppItem: 'Chia sẻ ứng dụng',
      shareMessage: 'Hãy thử Easy Flashcards, ứng dụng để học với các bộ thẻ ghi nhớ: {url}',
      rateAppItem: 'Đánh giá ứng dụng',
      customerSupportItem: 'Hỗ trợ khách hàng',
      aboutItem: 'Giới thiệu',
      buyCoffeeItem: 'Mời tôi một ly cà phê',
      privacyPolicyItem: 'Chính sách quyền riêng tư',
      termsItem: 'Điều khoản',
    },
    languageDialog: {
      title: 'Đổi ngôn ngữ',
      systemDefaultOption: 'Mặc định của hệ thống',
    },
    aboutAlert: {
      title: 'Giới thiệu',
      message: '{name}, phiên bản {version}',
    },
    linkFailedAlert: {
      title: 'Không thể mở liên kết',
      message: 'Không có ứng dụng nào trên thiết bị này mở được liên kết.',
    },
    emailFailedAlert: {
      title: 'Không có ứng dụng email',
      message: 'Để liên hệ hỗ trợ khách hàng, hãy gửi email đến {email}.',
    },
    coffeeThanksAlert: {
      title: 'Cảm ơn bạn!',
      message: 'Ly cà phê của bạn đang trên đường đến với nhà phát triển. Cảm ơn bạn đã ủng hộ.',
    },
    coffeeUnavailableAlert: {
      title: 'Mời tôi một ly cà phê',
      message: 'Hiện không thể mời cà phê. Vui lòng thử lại sau.',
    },
  },
  decks: {
    decksScreen: {
      searchA11yLabel: 'Tìm bộ thẻ',
      searchPlaceholder: 'Tìm bộ thẻ',
      loadError: 'Không đọc được các bộ thẻ đã lưu.',
      addDeckA11yLabel: 'Thêm bộ thẻ',
      emptyTitle: 'Chưa có bộ thẻ',
      emptyMessage: 'Nhấn nút + để nhập tệp bộ thẻ và tạo bộ thẻ đầu tiên.',
    },
    emptyDeckAlert: {
      title: 'Bộ thẻ trống',
      message: 'Bộ thẻ này không có thẻ nào để học.',
    },
    deleteDeckAlert: {
      title: 'Xóa bộ thẻ',
      message: 'Xóa "{name}", các phiên học và toàn bộ thống kê của bộ thẻ này?',
    },
    addDeckMenu: {
      title: 'Thêm bộ thẻ',
      importItem: 'Nhập bộ thẻ từ tệp',
      manualItem: 'Thêm bộ thẻ thủ công',
    },
    deckOptionsMenu: {
      startWithOptionsItem: 'Bắt đầu phiên với tùy chọn',
      editItem: 'Sửa bộ thẻ',
      exportItem: 'Xuất ra tệp',
      deleteItem: 'Xóa bộ thẻ',
    },
    exportFormatMenu: {
      title: 'Xuất bộ thẻ ra tệp',
    },
    csvSeparatorMenu: {
      title: 'Dấu phân tách CSV',
      customItem: 'Tùy chỉnh…',
    },
    deckCard: {
      optionsA11yLabel: 'Tùy chọn cho {name}',
      activeCount: '{count} chưa xong',
      lastSession: 'Gần nhất: {date}',
      startA11yLabel: 'Bắt đầu phiên cho {name}',
    },
    masteryBar: {
      a11yLabel: 'Mức thành thạo: {summary}',
    },
    sessionSetupDialog: {
      title: 'Bắt đầu phiên',
      invertedLabel: 'Đảo ngược',
      invertedDescription: 'Hiện câu trả lời trước và câu hỏi ở mặt sau.',
      shuffleLabel: 'Xáo trộn',
      shuffleDescription: 'Học các thẻ theo thứ tự ngẫu nhiên.',
    },
    customSeparatorDialog: {
      title: 'Dấu phân tách tùy chỉnh',
      separatorLabel: 'Dấu phân tách',
      separatorPlaceholder: 'Ví dụ |',
      errors: {
        empty: 'Nhập một ký tự.',
        tooLong: 'Chỉ dùng một ký tự.',
        reserved: 'Không dùng được dấu ngoặc kép, # và ngắt dòng.',
        whitespace: 'Không được dùng dấu cách. Chọn tùy chọn Tab để dùng tab.',
        alphanumeric: 'Không được dùng chữ cái và chữ số.',
      },
    },
  },
  editDeck: {
    deckNotFound: {
      title: 'Không tìm thấy bộ thẻ',
      message: 'Bộ thẻ này không còn tồn tại.',
      backButton: 'Quay lại bộ thẻ',
    },
    editDeckScreen: {
      titleLabel: 'Tiêu đề',
      descriptionLabel: 'Mô tả',
      descriptionPlaceholder: 'Không bắt buộc',
      saveButtonA11yLabel: 'Lưu bộ thẻ',
      addCardButton: 'Thêm thẻ',
    },
    titleNeededAlert: {
      title: 'Cần có tiêu đề',
      message: 'Nhập tiêu đề cho bộ thẻ.',
    },
    cardIncompleteAlert: {
      title: 'Thẻ chưa đầy đủ',
      message: 'Thẻ {number} cần có cả câu hỏi và câu trả lời.',
    },
    removeCardsAlert: {
      title: 'Xóa thẻ?',
      message: {
        other: '{count} thẻ sẽ bị xóa khỏi bộ thẻ cùng với thống kê của các thẻ đó.',
      },
    },
    discardChangesAlert: {
      title: 'Bỏ thay đổi?',
      messageEdit: 'Các chỉnh sửa của bộ thẻ này chưa được lưu.',
      messageNew: 'Bộ thẻ này chưa được lưu.',
    },
    cardEditor: {
      title: 'Thẻ {number}',
      removeButtonA11yLabel: 'Xóa thẻ {number}',
      questionLabel: 'Câu hỏi',
      questionA11yLabel: 'Câu hỏi của thẻ {number}',
      answerLabel: 'Câu trả lời',
      answerA11yLabel: 'Câu trả lời của thẻ {number}',
    },
    categoryField: {
      label: 'Danh mục',
      a11yLabel: 'Danh mục: {name}',
      a11yLabelNone: 'Danh mục: không có',
      a11yHint: 'Mở bộ chọn danh mục',
      noneValue: 'Không có danh mục',
    },
    categoryPicker: {
      title: 'Danh mục',
      groupA11yLabel: 'Bộ chọn danh mục',
      noneTile: 'Không có danh mục',
    },
  },
  learn: {
    learnScreen: {
      searchA11yLabel: 'Tìm phiên học',
      searchPlaceholder: 'Tìm phiên học',
    },
    headerToolbar: {
      clearCompletedItem: 'Gỡ các phiên đã hoàn thành',
    },
    emptyState: {
      noSessionsTitle: 'Chưa có phiên học',
      noSessionsMessage:
        'Chọn một bộ thẻ và bắt đầu phiên học; phiên sẽ hiện ở đây cho đến khi hoàn thành.',
      allClearedTitle: 'Không có phiên để hiển thị',
      allClearedMessage:
        'Các phiên đã gỡ vẫn được tính trong Thống kê. Bắt đầu phiên mới từ một bộ thẻ để thấy phiên ở đây.',
      goToDecksButton: 'Đến bộ thẻ',
    },
    deckUnavailableAlert: {
      title: 'Bộ thẻ không khả dụng',
      message: 'Bộ thẻ này không còn tồn tại hoặc không có thẻ.',
    },
    clearCompletedSessionsAlert: {
      title: 'Gỡ các phiên đã hoàn thành',
      nothingToClear: 'Không có phiên đã hoàn thành để gỡ.',
      message: {
        other:
          'Gỡ {count} phiên đã hoàn thành khỏi danh sách này? Kết quả vẫn được giữ trong Thống kê.',
      },
    },
    discardSessionAlert: {
      title: 'Bỏ phiên học',
      message:
        'Bỏ phiên chưa hoàn thành của "{deckName}"? Các câu trả lời của phiên cũng bị xóa khỏi Thống kê.',
    },
    clearSessionAlert: {
      title: 'Gỡ phiên học',
      message:
        'Gỡ phiên đã hoàn thành của "{deckName}" khỏi danh sách này? Kết quả vẫn được giữ trong Thống kê.',
    },
    sessionOptionsMenu: {
      discardItem: 'Bỏ phiên học',
      clearItem: 'Gỡ phiên học',
    },
    sessionCard: {
      inProgressStatus: {
        other: 'Đang diễn ra \u2014 {answered}/{count} thẻ',
      },
      completedStatus: {
        other: 'Đã hoàn thành \u2014 {count} thẻ',
      },
      invertedPill: 'Đảo ngược',
      invertedPillA11yLabel: 'Phiên đảo ngược',
      optionsA11yLabel: 'Tùy chọn cho phiên {deckName}',
      started: 'Bắt đầu {date}',
      resumeButtonA11yLabel: 'Tiếp tục phiên của {deckName}',
      replayButtonA11yLabel: 'Học lại phiên của {deckName}',
      reviewErrorsButtonA11yLabel: {
        other: 'Ôn {count} thẻ sai hoặc chưa chắc của {deckName}',
      },
      reviewErrorsDoneA11yLabel: 'Đã sửa hết các thẻ sai hoặc chưa chắc của {deckName}',
    },
    sessionResultsBar: {
      progressA11yLabel:
        'Tiến độ: đã trả lời {answered} trên {cardCount} \u2014 {ok} ok, {okeish} tạm ổn, {notOk} không ok',
    },
  },
  study: {
    studyScreen: {
      fallbackTitle: 'Phiên học',
      unavailableTitle: 'Không có gì để học',
      unavailableMessage: 'Phiên này không còn khả dụng.',
      unavailableAction: 'Quay lại các phiên',
    },
    progressHeader: {
      position: 'Thẻ {current} trên {total}',
      okCount: 'Ok {count}',
    },
    invertedPill: {
      text: 'Đảo ngược',
      a11yLabel: 'Phiên đảo ngược: mặt trước hiện câu trả lời',
    },
    swipeHint: {
      reviewing: 'Đang xem lại thẻ đã trả lời \u2014 vuốt trái để quay về vị trí cũ',
    },
    historyStrip: {
      a11yLabel: 'Các câu trả lời đến nay',
    },
    flipCard: {
      questionLabel: 'CÂU HỎI',
      answerLabel: 'CÂU TRẢ LỜI',
      revealHint: 'Chạm để xem câu trả lời',
      backHint: 'Chạm để xem lại câu hỏi',
      showQuestionA11yLabel: 'Hiện câu hỏi',
      showAnswerA11yLabel: 'Hiện câu trả lời',
    },
    sessionSummary: {
      title: 'Hoàn thành phiên',
      successRateA11yLabel: 'Tỷ lệ thành công {rate}',
      reviewedCount: 'Đã ôn {count}',
      studyAgainLabel: 'Học lại cả bộ thẻ',
      studyAgainButtonA11yLabel: 'Học lại cả bộ thẻ',
    },
    reviewSummary: {
      title: 'Hoàn thành ôn tập',
      stillToFix: 'Còn {count} thẻ cần sửa',
      allFixed: 'Đã sửa hết',
    },
    summaryAction: {
      reviewLabel: 'Ôn các thẻ sai hoặc chưa chắc',
      reviewButtonA11yLabel: {
        other: 'Ôn {count} thẻ sai hoặc chưa chắc',
      },
      backLabel: 'Quay lại các phiên',
      backButtonA11yLabel: 'Quay lại các phiên',
    },
  },
  categories: {
    categoriesScreen: {
      customSectionTitle: 'Danh mục tùy chỉnh',
      customSectionSubtitle: {
        other: '{count} có sẵn',
      },
      customEmptyHint: 'Các danh mục tự tạo sẽ hiện ở đây.',
      defaultSectionTitle: 'Danh mục mặc định',
      defaultSectionSubtitle: {
        other: '{count} tích hợp sẵn',
      },
      newCategoryButton: 'Danh mục mới',
      categoryTileA11yLabel: 'Tùy chọn cho {name}',
    },
    categoryOptionsMenu: {
      deleteItem: 'Xóa danh mục',
    },
    deleteCategoryAlert: {
      title: 'Xóa danh mục?',
      message: '"{name}" sẽ bị xóa.',
      messageWithDecks: {
        other: '"{name}" sẽ bị xóa. {count} bộ thẻ sẽ không còn danh mục.',
      },
    },
    newCategoryScreen: {
      saveButtonA11yLabel: 'Lưu danh mục',
      nameField: 'Tên',
      colourLabel: 'Màu',
      iconLabel: 'Biểu tượng',
      nameCounter: '{length}/{max}',
      nameErrors: {
        empty: 'Nhập tên.',
        tooLong: {
          other: 'Dùng tối đa {count} ký tự.',
        },
        duplicate: 'Đã có danh mục với tên này.',
      },
    },
    discardChangesAlert: {
      title: 'Bỏ thay đổi?',
      message: 'Danh mục này chưa được lưu.',
    },
    tilePreview: {
      placeholder: 'Tên danh mục',
      a11yLabel: 'Xem trước: {name}',
      noNameA11yLabel: 'Xem trước: chưa có tên',
    },
    colourPicker: {
      a11yLabel: 'Bộ chọn màu',
      swatchA11yLabel: 'Màu {position} trên {total}',
    },
    customColourSwatch: {
      a11yLabel: 'Màu tùy chỉnh',
      a11yHint: 'Mở bộ chọn màu',
    },
    iconPicker: {
      a11yLabel: 'Bộ chọn biểu tượng',
    },
    customColourDialog: {
      title: 'Màu tùy chỉnh',
      hueLabel: 'Sắc độ',
      hueValue: '{value}°',
      saturationLabel: 'Độ bão hòa',
      brightnessLabel: 'Độ sáng',
      percentValue: '{value}%',
      previewA11yLabel: 'Xem trước màu {color}',
      tooDark: 'Quá tối cho biểu tượng. Hãy thử màu sáng hơn.',
      useButton: 'Dùng màu',
    },
    categorySquare: {
      a11yLabel: 'Danh mục: {name}',
    },
  },
  stats: {
    statsScreen: {
      searchA11yLabel: 'Tìm bộ thẻ',
      searchPlaceholder: 'Tìm bộ thẻ',
      aggregatedHeading: 'Thống kê tổng hợp',
      decksTile: {
        label: 'Bộ thẻ',
        caption: 'Trong thư viện',
      },
      totalCardsTile: {
        label: 'Tổng số thẻ',
        caption: 'Trên mọi bộ thẻ',
      },
      totalReviewsTile: {
        label: 'Tổng lượt ôn',
        caption: {
          all: 'Số câu trả lời đã ghi',
          month: 'Số câu trả lời tháng này',
          week: 'Số câu trả lời trong 7 ngày qua',
        },
      },
      sessionsTile: {
        label: 'Phiên',
        caption: '{count} chưa xong',
      },
      tileA11yLabel: '{label}: {value}, {caption}',
      decksBreakdownHeading: 'Chi tiết theo bộ thẻ',
      deckCount: {
        other: '{count} bộ thẻ',
      },
      emptyState: {
        title: 'Chưa có thống kê',
        message: 'Nhập một bộ thẻ và học; kết quả sẽ hiện ở đây.',
      },
    },
    masteryRing: {
      summaryA11yLabel: 'Tỷ lệ thành công {rate}. {shares}. Số lượng: {counts}',
      caption: 'Tỷ lệ thành công',
    },
    deckStatsCard: {
      summaryA11yLabel: '{name}: {shares}, {cards}, {sessions}, {reviews}, gần nhất {last}',
      openA11yHint: 'Mở chi tiết từng thẻ',
      cardsLabel: 'Thẻ',
      sessionsLabel: 'Phiên',
      reviewsLabel: 'Lượt ôn',
      lastLabel: 'Gần nhất',
    },
    timeframeChips: {
      groupA11yLabel: 'Khung thời gian',
    },
  },
  deckStats: {
    deckStatsScreen: {
      optionsA11yLabel: 'Tùy chọn cho thống kê {deckName}',
      resetStatisticsMenuItem: 'Đặt lại thống kê',
      resetAlert: {
        title: 'Đặt lại thống kê',
        message: 'Xóa mọi kết quả và phiên học đã ghi của "{deckName}"?',
      },
      notFound: {
        title: 'Không tìm thấy bộ thẻ',
        message: 'Bộ thẻ này đã bị xóa.',
      },
      cardPerformanceTitle: 'Hiệu quả từng thẻ',
      subtitle: {
        other: '{count} thẻ · {sort}',
      },
      subtitleNarrowed: {
        other: '{shown} trong {count} thẻ · {sort}',
      },
      sortButtonA11yLabel: 'Sắp xếp thẻ: {sort}',
      sortSheetTitle: 'Sắp xếp thẻ',
      noCards: {
        title: 'Chưa có thẻ',
        message: 'Thêm thẻ vào bộ thẻ này để xem từng thẻ học tốt đến đâu.',
      },
      statusEmpty: {
        needsReview: {
          title: 'Không có thẻ cần ôn',
          message: 'Không có thẻ nào dưới 40% thành công.',
        },
        learning: {
          title: 'Không có thẻ đang học',
          message: 'Không có thẻ nào ở mức từ 40% đến 70% thành công.',
        },
        mastered: {
          title: 'Chưa có thẻ đã thuộc',
          message: 'Thẻ được coi là đã thuộc khi đạt từ 70% thành công trở lên.',
        },
        new: {
          title: 'Không có thẻ mới',
          message: 'Mọi thẻ đều đã được ôn ít nhất một lần.',
        },
      },
      showAllCardsButton: 'Hiện tất cả thẻ',
      noMatches: {
        filteredMessage: 'Không có gì khớp với "{query}" trong bộ lọc {status}.',
      },
    },
    deckIdentityRow: {
      categoryA11yLabel: 'Danh mục: {name}',
    },
    deckMasteryCard: {
      successRateA11yLabel: 'Tỷ lệ thành công: {rate}',
      successRateNoReviewsA11yLabel: 'Tỷ lệ thành công: chưa có lượt ôn',
      successRateCaption: 'Tỷ lệ thành công',
      answerTile: {
        ok: '{count} ok, {percent}',
        okeish: '{count} tạm ổn, {percent}',
        notOk: '{count} không ok, {percent}',
      },
      answerTileNoReviews: {
        ok: '{count} ok, chưa có lượt ôn',
        okeish: '{count} tạm ổn, chưa có lượt ôn',
        notOk: '{count} không ok, chưa có lượt ôn',
      },
      reviewsFigure: 'Lượt ôn',
      sessionsFigure: 'Phiên',
      lastSessionFigure: 'Phiên gần nhất',
      figureA11yLabel: '{label}: {value}',
      changeChip: {
        none: 'Không đổi so với phiên trước',
        up: '+{points} điểm so với phiên trước',
        down: '-{points} điểm so với phiên trước',
        noneA11yLabel: 'Tỷ lệ thành công không đổi so với phiên trước',
        upA11yLabel: {
          other: 'Tỷ lệ thành công tăng {count} điểm so với phiên trước',
        },
        downA11yLabel: {
          other: 'Tỷ lệ thành công giảm {count} điểm so với phiên trước',
        },
      },
    },
    cardStatsRow: {
      footerNeverReviewed: 'Chưa ôn lần nào',
      footerReviewed: {
        other: '{count} lượt ôn · Ôn lần cuối: {date}',
      },
      neverReviewedA11yLabel:
        'Câu hỏi: {question}. Câu trả lời: {answer}. {status}. Chưa ôn lần nào.',
      reviewedA11yLabel: {
        other:
          'Câu hỏi: {question}. Câu trả lời: {answer}. {status}, tỷ lệ thành công {rate}. {count} lượt ôn: {ok} ok, {okeish} tạm ổn, {notOk} không ok.',
      },
      reviewedOnA11yLabel: {
        other:
          'Câu hỏi: {question}. Câu trả lời: {answer}. {status}, tỷ lệ thành công {rate}. {count} lượt ôn: {ok} ok, {okeish} tạm ổn, {notOk} không ok. Ôn lần cuối: {date}.',
      },
    },
    cardStatusChips: {
      groupA11yLabel: 'Trạng thái thẻ',
      allChip: 'Tất cả',
      chipLabel: '{label} ({count})',
      chipA11yLabel: {
        other: '{label}, {count} thẻ',
      },
    },
    cardSearchField: {
      searchA11yLabel: 'Tìm thẻ',
      searchPlaceholder: 'Tìm trong câu hỏi và câu trả lời',
      clearA11yLabel: 'Xóa tìm kiếm thẻ',
    },
    sessionHistoryChart: {
      title: 'Lịch sử phiên',
      subtitleLatest: 'Gần nhất: {shown} trên {total}',
      empty: {
        title: 'Bộ thẻ này chưa có phiên nào',
        message: 'Bắt đầu một phiên từ tab Bộ thẻ, kết quả sẽ hiện ở đây.',
      },
      unansweredLegend: 'Chưa trả lời',
      legendNote: '% số thẻ của mỗi phiên',
      sessionA11yLabel: {
        other:
          'Phiên {date}: tỷ lệ thành công {rate}, đã trả lời {answered} trên {count} thẻ — {ok} ok, {okeish} tạm ổn, {notOk} không ok',
      },
      sessionNoAnswersA11yLabel: {
        other:
          'Phiên {date}: chưa có tỷ lệ thành công, đã trả lời {answered} trên {count} thẻ — {ok} ok, {okeish} tạm ổn, {notOk} không ok',
      },
    },
  },
};

export const vi: Language = { code: 'vi', plural: viPlural, messages };
