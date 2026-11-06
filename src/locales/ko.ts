import type { Catalogue, Language, PluralRule } from '../utils/i18n';

// Korean has no plural forms (CLDR), so every count uses 'other'.
export const koPlural: PluralRule = () => 'other';

// "Okeish" is rendered "애매함" (so-so): it sits clearly between "맞음" (right) and "틀림" (wrong).
const messages: Catalogue = {
  common: {
    actions: {
      back: '뒤로',
      cancel: '취소',
      clear: '지우기',
      close: '닫기',
      delete: '삭제',
      discard: '버리기',
      export: '내보내기',
      keepEditing: '계속 편집',
      ok: '확인',
      reset: '초기화',
      save: '저장',
      start: '시작',
    },
    search: {
      noMatchesTitle: '검색 결과 없음',
      noMatchesMessage: '"{query}"에 해당하는 항목이 없어요.',
      clearSearchButton: '검색어 지우기',
    },
    counts: {
      cards: {
        other: '카드 {count}장',
      },
      sessions: {
        other: '세션 {count}개',
      },
      reviews: {
        other: '복습 {count}회',
      },
    },
  },
  navigation: {
    tabs: {
      decks: '덱',
      learn: '학습',
      categories: '카테고리',
      statistics: '통계',
    },
    headers: {
      decksList: '덱',
      editDeck: '덱 편집',
      newDeck: '새 덱',
      learnList: '학습',
      study: '세션',
      categoriesList: '카테고리',
      newCategory: '새 카테고리',
      statsOverview: '통계',
      deckStats: '덱 통계',
    },
  },
  answers: {
    answerLabels: {
      ok: '맞음',
      okeish: '애매함',
      notOk: '틀림',
    },
    shares: {
      notReviewed: '아직 복습 안 함',
      summary: '{ok} 맞음, {okeish} 애매함, {notOk} 틀림',
    },
    cardStatus: {
      needsReview: '복습 필요',
      learning: '학습 중',
      mastered: '숙달',
      new: '새 카드',
    },
    timeframes: {
      all: '전체 기간',
      month: '이번 달',
      week: '최근 7일',
    },
    sortOrders: {
      hardest: '어려운 순',
      deck: '덱 순서',
      recent: '최근 복습순',
    },
    dates: {
      never: '없음',
    },
  },
  importExport: {
    defaultDeckName: '가져온 덱',
    importErrors: {
      emptyFile: '선택한 파일이 비어 있어요.',
      notADeck:
        'Easy Flashcards 덱 파일이 아니에요. 앱에서 내보낸 JSON 파일을 선택하세요.',
      newerVersion:
        '이 덱 파일은 더 최신 버전의 Easy Flashcards에서 만들어졌어요. 가져오려면 앱을 업데이트하세요.',
      noCards:
        '사용할 수 있는 카드가 없어요. 모든 카드에는 질문과 답이 필요해요.',
      noHeader:
        '헤더 행을 찾을 수 없어요. 비어 있지 않고 "#" 주석이 아닌 첫 줄에 "question" 열과 "answer" 열이 있어야 하며, 쉼표, 세미콜론, 탭 또는 다른 기호 한 개로 구분해야 해요.',
      noUsableRows:
        '사용할 수 있는 행이 없어요. 모든 행에는 질문과 답이 필요해요.',
      unreadable: '선택한 파일을 읽을 수 없어요.',
    },
    importAlert: {
      successTitle: '덱을 가져왔어요',
      successMessage: {
        other: '"{name}" 덱에 카드 {count}장이 있어요.',
      },
      skippedRows: {
        other: '불완전한 행 {count}개를 건너뛰었어요.',
      },
      skippedCards: {
        other: '불완전한 카드 {count}장을 건너뛰었어요.',
      },
      failedTitle: '가져오기 실패',
      failedWithDetails: '파일을 가져올 수 없어요: {details}',
      failedUnknown: '파일을 가져오는 중 알 수 없는 오류가 발생했어요.',
    },
    exportAlert: {
      successTitle: '덱을 내보냈어요',
      savedAs: '저장된 파일: {name}',
      saved: '덱을 저장했어요.',
      failedTitle: '내보내기 실패',
      deckGone: '이 덱은 더 이상 없어요.',
      failedFallback: '덱을 내보낼 수 없어요.',
    },
    separators: {
      comma: '쉼표 (,)',
      semicolon: '세미콜론 (;)',
      tab: '탭',
    },
    sampleExport: {
      successTitle: '샘플 덱을 내보냈어요',
      partlyTitle: '샘플 덱을 일부만 내보냈어요',
      failedTitle: '내보내기 실패',
      savedAsOne: '저장된 파일: {name}',
      savedAsTwo: '저장된 파일: {first}, {second}',
      fileFailed: '{format} 파일을 저장할 수 없어요: {details}',
      fileNotSaved: '{format} 파일을 저장하지 않았어요.',
      unknownError: '알 수 없는 오류',
    },
  },
  categoryNames: {
    builtIn: {
      astronomy: '천문학',
      biology: '생물학',
      botany: '식물학',
      chemistry: '화학',
      cinema: '영화',
      computer_science: '컴퓨터 과학',
      economics: '경제학',
      gastronomy: '미식',
      geography: '지리학',
      history: '역사',
      languages: '언어',
      law: '법학',
      literature: '문학',
      mathematics: '수학',
      medicine: '의학',
      music: '음악',
      philosophy: '철학',
      physics: '물리학',
      religion: '종교',
      sport: '스포츠',
      zoology: '동물학',
    },
    icons: {
      plane_contrails: '비행기',
      anchor: '닻',
      nutrition: '사과',
      emergency: '별표',
      microbiology: '세균',
      finance: '막대 그래프',
      sports_basketball: '농구공',
      neurology: '뇌',
      bug_report: '벌레',
      calendar_month: '달력',
      photo_camera: '카메라',
      camera: '카메라 조리개',
      cannabis: '대마초 잎',
      directions_car: '자동차',
      chess_pawn: '체스 폰',
      language_chinese_dayi: '한자와 알파벳',
      location_city: '도시',
      circle_circle: '동심원',
      restaurant: '식기',
      database: '데이터베이스',
      nest_heat_link_e: '원 안의 점',
      engineering: '엔지니어',
      face: '얼굴',
      face_3: '머리카락이 있는 얼굴',
      theaters: '필름',
      flag_2: '깃발',
      science: '플라스크',
      save: '플로피 디스크',
      sports_and_outdoors: '축구공',
      skillet: '프라이팬',
      sports_esports: '게임 컨트롤러',
      language: '지구본',
      diversity_3: '사람들',
      psychology: '톱니바퀴가 있는 머리',
      headphones: '헤드폰',
      health_and_safety: '건강 방패',
      landscape_2: '언덕',
      hive: '벌집',
      hourglass_empty: '모래시계',
      house: '집',
      icecream: '아이스크림',
      temp_preferences_eco: '잎',
      electric_bolt: '번개',
      wand_stars: '마술봉',
      biotech: '현미경',
      mindfulness: '마음 챙김',
      motorcycle: '오토바이',
      music_note_2: '음표',
      network_node: '네트워크',
      import_contacts: '펼친 책',
      pan_tool: '펼친 손',
      pets: '발자국',
      stylus: '연필',
      person: '사람',
      history_edu: '깃펜과 종이',
      radio: '라디오',
      raven: '까마귀',
      rib_cage: '갈비뼈',
      rocket_launch: '로켓',
      scatter_plot: '산점도',
      category: '도형',
      interests: '도형과 하트',
      shopping_cart: '쇼핑 카트',
      functions: '시그마',
      skull: '해골',
      emoji_language: '웃는 얼굴과 지구본',
      snowflake: '눈송이',
      hotel_class: '별',
      mountain_flag: '정상의 깃발',
      sunny: '해',
      mixture_med: '주사기와 알약',
      temple_buddhist: '사원',
      text_snippet: '텍스트 문서',
      theater_comedy: '연극 가면',
      nest_thermostat_gen_3: '온도 조절기',
      translate: '번역',
      nature: '나무',
      fertile: '튤립',
      videocam: '비디오 카메라',
      coronavirus: '바이러스',
      volcano: '화산',
      warning: '경고',
      water: '물결',
      air: '바람',
      build: '렌치',
    },
  },
  shell: {
    appMenu: {
      triggerA11yLabel: '앱 메뉴',
      exportSampleDeckItem: '샘플 덱 내보내기',
      settingsItem: '설정',
    },
    exportSampleDeckDialog: {
      title: '샘플 덱 내보내기',
      body: '같은 샘플 덱을 CSV와 JSON, 두 개의 파일로 저장해요. 파일마다 저장할 위치를 묻는데, 취소하면 해당 파일은 건너뛰어요.\n\nCSV: # 기호로 시작하는 줄(제목, 설명, 카테고리)은 가져올 때 건너뛰고, 그다음 "question" / "answer" 헤더와 카드당 한 행이 이어져요. 여기서는 세미콜론으로 구분하지만 쉼표, 탭, 다른 기호 한 개도 사용할 수 있어요.\n\nJSON: 제목, 설명, 카테고리도 함께 복원해요.\n\n카드의 양면에는 <b>, <i>, <br /> 같은 기본 HTML을 사용할 수 있어요.',
    },
    kebabMenu: {
      triggerA11yLabel: '옵션 더보기',
    },
    searchBar: {
      inputA11yLabel: '검색어',
      closeButtonA11yLabel: '검색 닫기',
    },
  },
  settings: {
    settingsScreen: {
      title: '설정',
      generalSection: '일반',
      appSection: '앱',
      communitySection: '커뮤니티 및 지원',
      legalSection: '법적 고지',
      changeLanguageItem: '언어 변경',
      shareAppItem: '앱 공유',
      shareMessage: 'Easy Flashcards를 사용해 보세요. 덱으로 공부하는 플래시카드 앱이에요: {url}',
      rateAppItem: '앱 평가하기',
      customerSupportItem: '고객 지원',
      aboutItem: '정보',
      buyCoffeeItem: '커피 한 잔 사주기',
      privacyPolicyItem: '개인정보 처리방침',
      termsItem: '이용약관',
    },
    languageDialog: {
      title: '언어 변경',
      systemDefaultOption: '시스템 기본값',
    },
    aboutAlert: {
      title: '정보',
      message: '{name}, 버전 {version}',
    },
    linkFailedAlert: {
      title: '링크를 열 수 없어요',
      message: '이 기기에서 링크를 열 수 있는 앱이 없어요.',
    },
    emailFailedAlert: {
      title: '이메일 앱 없음',
      message: '고객 지원에 문의하려면 {email}(으)로 메일을 보내 주세요.',
    },
    coffeeThanksAlert: {
      title: '감사합니다!',
      message: '커피가 개발자에게 가고 있어요. 응원해 주셔서 감사합니다.',
    },
    coffeeUnavailableAlert: {
      title: '커피 한 잔 사주기',
      message: '지금은 커피를 사줄 수 없어요. 나중에 다시 시도해 주세요.',
    },
  },
  decks: {
    decksScreen: {
      searchA11yLabel: '덱 검색',
      searchPlaceholder: '덱 검색',
      loadError: '저장된 덱을 읽을 수 없어요.',
      addDeckA11yLabel: '덱 추가',
      emptyTitle: '아직 덱이 없어요',
      emptyMessage: '+ 버튼으로 덱 파일을 가져와 첫 덱을 만들어 보세요.',
    },
    emptyDeckAlert: {
      title: '빈 덱',
      message: '이 덱에는 학습할 카드가 없어요.',
    },
    deleteDeckAlert: {
      title: '덱 삭제',
      message: '"{name}" 덱과 해당 세션 및 모든 통계를 삭제할까요?',
    },
    addDeckMenu: {
      title: '덱 추가',
      importItem: '파일에서 덱 가져오기',
      manualItem: '덱 직접 추가',
    },
    deckOptionsMenu: {
      startWithOptionsItem: '옵션으로 세션 시작',
      editItem: '덱 편집',
      exportItem: '파일로 내보내기',
      deleteItem: '덱 삭제',
    },
    exportFormatMenu: {
      title: '덱을 파일로 내보내기',
    },
    csvSeparatorMenu: {
      title: 'CSV 구분 기호',
      customItem: '직접 입력…',
    },
    deckCard: {
      optionsA11yLabel: '{name} 옵션',
      activeCount: '진행 중 {count}개',
      lastSession: '마지막: {date}',
      startA11yLabel: '{name} 세션 시작',
    },
    masteryBar: {
      a11yLabel: '숙련도: {summary}',
    },
    sessionSetupDialog: {
      title: '세션 시작',
      invertedLabel: '뒤집기',
      invertedDescription: '답을 먼저 보여 주고 질문은 뒷면에 표시해요.',
      shuffleLabel: '섞기',
      shuffleDescription: '카드를 무작위 순서로 학습해요.',
    },
    customSeparatorDialog: {
      title: '직접 입력한 구분 기호',
      separatorLabel: '구분 기호',
      separatorPlaceholder: '예: |',
      errors: {
        empty: '한 글자를 입력하세요.',
        tooLong: '한 글자만 사용하세요.',
        reserved: '따옴표, # 및 줄바꿈은 사용할 수 없어요.',
        whitespace: '공백은 사용할 수 없어요. 탭은 탭 옵션을 사용하세요.',
        alphanumeric: '글자와 숫자는 사용할 수 없어요.',
      },
    },
  },
  editDeck: {
    deckNotFound: {
      title: '덱을 찾을 수 없어요',
      message: '이 덱은 더 이상 없어요.',
      backButton: '덱으로 돌아가기',
    },
    editDeckScreen: {
      titleLabel: '제목',
      descriptionLabel: '설명',
      descriptionPlaceholder: '선택 사항',
      saveButtonA11yLabel: '덱 저장',
      addCardButton: '카드 추가',
    },
    titleNeededAlert: {
      title: '제목 필요',
      message: '덱에 제목을 지정하세요.',
    },
    cardIncompleteAlert: {
      title: '카드가 완성되지 않았어요',
      message: '{number}번 카드에는 질문과 답이 모두 필요해요.',
    },
    removeCardsAlert: {
      title: '카드를 삭제할까요?',
      message: {
        other: '카드 {count}장이 덱과 해당 통계에서 삭제돼요.',
      },
    },
    discardChangesAlert: {
      title: '변경 사항을 버릴까요?',
      messageEdit: '이 덱의 편집 내용이 저장되지 않았어요.',
      messageNew: '이 덱이 저장되지 않았어요.',
    },
    cardEditor: {
      title: '카드 {number}',
      removeButtonA11yLabel: '카드 {number} 삭제',
      questionLabel: '질문',
      questionA11yLabel: '카드 {number} 질문',
      answerLabel: '답',
      answerA11yLabel: '카드 {number} 답',
    },
    categoryField: {
      label: '카테고리',
      a11yLabel: '카테고리: {name}',
      a11yLabelNone: '카테고리: 없음',
      a11yHint: '카테고리 선택기를 열어요',
      noneValue: '카테고리 없음',
    },
    categoryPicker: {
      title: '카테고리',
      groupA11yLabel: '카테고리 선택기',
      noneTile: '카테고리 없음',
    },
  },
  learn: {
    learnScreen: {
      searchA11yLabel: '세션 검색',
      searchPlaceholder: '세션 검색',
    },
    headerToolbar: {
      clearCompletedItem: '완료한 세션 지우기',
    },
    emptyState: {
      noSessionsTitle: '아직 세션이 없어요',
      noSessionsMessage:
        '덱을 골라 학습 세션을 시작하면 끝낼 때까지 여기에 표시돼요.',
      allClearedTitle: '표시할 세션이 없어요',
      allClearedMessage:
        '지운 세션도 통계에는 계속 반영돼요. 덱에서 새 세션을 시작하면 여기에 표시돼요.',
      goToDecksButton: '덱으로 이동',
    },
    deckUnavailableAlert: {
      title: '덱을 사용할 수 없어요',
      message: '이 덱이 더 이상 없거나 카드가 없어요.',
    },
    clearCompletedSessionsAlert: {
      title: '완료한 세션 지우기',
      nothingToClear: '지울 완료 세션이 없어요.',
      message: {
        other:
          '완료한 세션 {count}개를 이 목록에서 지울까요? 결과는 통계에 그대로 남아요.',
      },
    },
    discardSessionAlert: {
      title: '세션 버리기',
      message:
        '"{deckName}" 덱의 끝나지 않은 세션을 버릴까요? 답변도 통계에서 삭제돼요.',
    },
    clearSessionAlert: {
      title: '세션 지우기',
      message:
        '"{deckName}" 덱의 완료한 세션을 이 목록에서 지울까요? 결과는 통계에 그대로 남아요.',
    },
    sessionOptionsMenu: {
      discardItem: '세션 버리기',
      clearItem: '세션 지우기',
    },
    sessionCard: {
      inProgressStatus: {
        other: '진행 중 \u2014 {answered}/{count}장',
      },
      completedStatus: {
        other: '완료 \u2014 {count}장',
      },
      invertedPill: '뒤집기',
      invertedPillA11yLabel: '뒤집은 세션',
      optionsA11yLabel: '{deckName} 세션 옵션',
      started: '시작: {date}',
      resumeButtonA11yLabel: '{deckName} 세션 이어서 하기',
      replayButtonA11yLabel: '{deckName} 세션 다시 하기',
      reviewErrorsButtonA11yLabel: {
        other: '{deckName} 틀렸거나 애매한 카드 {count}장 복습',
      },
      reviewErrorsDoneA11yLabel:
        '{deckName}: 틀렸거나 애매한 카드를 모두 해결했어요',
    },
    sessionResultsBar: {
      progressA11yLabel:
        '진행: {cardCount}장 중 {answered}장 답변 \u2014 맞음 {ok}, 애매함 {okeish}, 틀림 {notOk}',
    },
  },
  study: {
    studyScreen: {
      fallbackTitle: '세션',
      unavailableTitle: '학습할 내용이 없어요',
      unavailableMessage: '이 세션은 더 이상 사용할 수 없어요.',
      unavailableAction: '세션으로 돌아가기',
    },
    progressHeader: {
      position: '카드 {current}/{total}',
      okCount: '맞음 {count}',
    },
    invertedPill: {
      text: '뒤집기',
      a11yLabel: '뒤집은 세션: 앞면에 답이 표시돼요',
    },
    swipeHint: {
      reviewing:
        '이미 답한 카드를 보는 중 \u2014 왼쪽으로 스와이프하면 원래 위치로 돌아가요',
    },
    historyStrip: {
      a11yLabel: '지금까지의 답변',
    },
    flipCard: {
      questionLabel: '질문',
      answerLabel: '답',
      revealHint: '탭하여 답 보기',
      backHint: '탭하여 질문 다시 보기',
      showQuestionA11yLabel: '질문 보기',
      showAnswerA11yLabel: '답 보기',
    },
    sessionSummary: {
      title: '세션 완료',
      successRateA11yLabel: '성공률 {rate}',
      reviewedCount: '복습 {count}회',
      studyAgainLabel: '덱 전체 다시 학습',
      studyAgainButtonA11yLabel: '덱 전체 다시 학습',
    },
    reviewSummary: {
      title: '복습 완료',
      stillToFix: '남은 카드 {count}장',
      allFixed: '모두 해결',
    },
    summaryAction: {
      reviewLabel: '틀렸거나 애매한 카드 복습',
      reviewButtonA11yLabel: {
        other: '틀렸거나 애매한 카드 {count}장 복습',
      },
      backLabel: '세션으로 돌아가기',
      backButtonA11yLabel: '세션으로 돌아가기',
    },
  },
  categories: {
    categoriesScreen: {
      customSectionTitle: '내 카테고리',
      customSectionSubtitle: {
        other: '{count}개 사용 가능',
      },
      customEmptyHint: '직접 만든 카테고리가 여기에 표시돼요.',
      defaultSectionTitle: '기본 카테고리',
      defaultSectionSubtitle: {
        other: '{count}개 기본 제공',
      },
      newCategoryButton: '새 카테고리',
      categoryTileA11yLabel: '{name} 옵션',
    },
    categoryOptionsMenu: {
      deleteItem: '카테고리 삭제',
    },
    deleteCategoryAlert: {
      title: '카테고리를 삭제할까요?',
      message: '"{name}" 카테고리가 삭제돼요.',
      messageWithDecks: {
        other:
          '"{name}" 카테고리가 삭제돼요. 덱 {count}개의 카테고리가 해제돼요.',
      },
    },
    newCategoryScreen: {
      saveButtonA11yLabel: '카테고리 저장',
      nameField: '이름',
      colourLabel: '색상',
      iconLabel: '아이콘',
      nameCounter: '{length}/{max}',
      nameErrors: {
        empty: '이름을 입력하세요.',
        tooLong: {
          other: '{count}자 이하로 입력하세요.',
        },
        duplicate: '이미 같은 이름의 카테고리가 있어요.',
      },
    },
    discardChangesAlert: {
      title: '변경 사항을 버릴까요?',
      message: '이 카테고리가 저장되지 않았어요.',
    },
    tilePreview: {
      placeholder: '카테고리 이름',
      a11yLabel: '미리 보기: {name}',
      noNameA11yLabel: '미리 보기: 아직 이름 없음',
    },
    colourPicker: {
      a11yLabel: '색상 선택기',
      swatchA11yLabel: '색상 {position}/{total}',
    },
    customColourSwatch: {
      a11yLabel: '사용자 지정 색상',
      a11yHint: '색상 선택 화면을 열어요',
    },
    iconPicker: {
      a11yLabel: '아이콘 선택기',
    },
    customColourDialog: {
      title: '사용자 지정 색상',
      hueLabel: '색조',
      hueValue: '{value}°',
      saturationLabel: '채도',
      brightnessLabel: '명도',
      percentValue: '{value}%',
      previewA11yLabel: '색상 미리 보기 {color}',
      tooDark: '아이콘에 비해 너무 어두워요. 더 밝은 색을 선택하세요.',
      useButton: '색상 사용',
    },
    categorySquare: {
      a11yLabel: '카테고리: {name}',
    },
  },
  stats: {
    statsScreen: {
      searchA11yLabel: '덱 검색',
      searchPlaceholder: '덱 검색',
      aggregatedHeading: '전체 통계',
      decksTile: {
        label: '덱',
        caption: '내 라이브러리',
      },
      totalCardsTile: {
        label: '전체 카드',
        caption: '모든 덱 합계',
      },
      totalReviewsTile: {
        label: '전체 복습',
        caption: {
          all: '기록된 답변',
          month: '이번 달 답변',
          week: '최근 7일간 답변',
        },
      },
      sessionsTile: {
        label: '세션',
        caption: '진행 중 {count}개',
      },
      tileA11yLabel: '{label}: {value}, {caption}',
      decksBreakdownHeading: '덱별 내역',
      deckCount: {
        other: '덱 {count}개',
      },
      emptyState: {
        title: '아직 통계가 없어요',
        message: '덱을 가져와 학습하면 결과가 여기에 표시돼요.',
      },
    },
    masteryRing: {
      summaryA11yLabel: '성공률 {rate}. {shares}. 개수: {counts}',
      caption: '성공률',
    },
    deckStatsCard: {
      summaryA11yLabel:
        '{name}: {shares}, {cards}, {sessions}, {reviews}, 마지막 {last}',
      openA11yHint: '카드별 상세 정보를 열어요',
      cardsLabel: '카드',
      sessionsLabel: '세션',
      reviewsLabel: '복습',
      lastLabel: '마지막',
    },
    timeframeChips: {
      groupA11yLabel: '기간',
    },
  },
  deckStats: {
    deckStatsScreen: {
      optionsA11yLabel: '{deckName} 통계 옵션',
      resetStatisticsMenuItem: '통계 초기화',
      resetAlert: {
        title: '통계 초기화',
        message: '"{deckName}" 덱의 기록된 모든 결과와 세션을 지울까요?',
      },
      notFound: {
        title: '덱을 찾을 수 없어요',
        message: '이 덱은 삭제되었어요.',
      },
      cardPerformanceTitle: '카드별 성과',
      subtitle: {
        other: '카드 {count}장 · {sort}',
      },
      subtitleNarrowed: {
        other: '카드 {count}장 중 {shown}장 · {sort}',
      },
      sortButtonA11yLabel: '카드 정렬: {sort}',
      sortSheetTitle: '카드 정렬',
      noCards: {
        title: '아직 카드가 없어요',
        message: '이 덱에 카드를 추가하면 각 카드의 성과를 볼 수 있어요.',
      },
      statusEmpty: {
        needsReview: {
          title: '복습이 필요한 카드가 없어요',
          message: '성공률이 40% 미만인 카드가 없어요.',
        },
        learning: {
          title: '학습 중인 카드가 없어요',
          message: '성공률이 40%에서 70% 사이인 카드가 없어요.',
        },
        mastered: {
          title: '숙달한 카드가 아직 없어요',
          message: '성공률이 70% 이상이면 숙달한 카드예요.',
        },
        new: {
          title: '새 카드가 없어요',
          message: '모든 카드를 한 번 이상 복습했어요.',
        },
      },
      showAllCardsButton: '모든 카드 보기',
      noMatches: {
        filteredMessage:
          '{status} 필터에서 "{query}"에 해당하는 항목이 없어요.',
      },
    },
    deckIdentityRow: {
      categoryA11yLabel: '카테고리: {name}',
    },
    deckMasteryCard: {
      successRateA11yLabel: '성공률: {rate}',
      successRateNoReviewsA11yLabel: '성공률: 아직 복습 없음',
      successRateCaption: '성공률',
      answerTile: {
        ok: '맞음 {count}, {percent}',
        okeish: '애매함 {count}, {percent}',
        notOk: '틀림 {count}, {percent}',
      },
      answerTileNoReviews: {
        ok: '맞음 {count}, 아직 복습 없음',
        okeish: '애매함 {count}, 아직 복습 없음',
        notOk: '틀림 {count}, 아직 복습 없음',
      },
      reviewsFigure: '복습',
      sessionsFigure: '세션',
      lastSessionFigure: '마지막 세션',
      figureA11yLabel: '{label}: {value}',
      changeChip: {
        none: '지난 세션 이후 변화 없음',
        up: '지난 세션 이후 +{points}점',
        down: '지난 세션 이후 -{points}점',
        noneA11yLabel: '지난 세션 이후 성공률 변화 없음',
        upA11yLabel: {
          other: '지난 세션 이후 성공률 {count}점 상승',
        },
        downA11yLabel: {
          other: '지난 세션 이후 성공률 {count}점 하락',
        },
      },
    },
    cardStatsRow: {
      footerNeverReviewed: '복습 안 함',
      footerReviewed: {
        other: '복습 {count}회 · 마지막 복습 {date}',
      },
      neverReviewedA11yLabel:
        '질문: {question}. 답: {answer}. {status}. 복습 안 함.',
      reviewedA11yLabel: {
        other:
          '질문: {question}. 답: {answer}. {status}, 성공률 {rate}. 복습 {count}회: 맞음 {ok}, 애매함 {okeish}, 틀림 {notOk}.',
      },
      reviewedOnA11yLabel: {
        other:
          '질문: {question}. 답: {answer}. {status}, 성공률 {rate}. 복습 {count}회: 맞음 {ok}, 애매함 {okeish}, 틀림 {notOk}. 마지막 복습 {date}.',
      },
    },
    cardStatusChips: {
      groupA11yLabel: '카드 상태',
      allChip: '전체',
      chipLabel: '{label} ({count})',
      chipA11yLabel: {
        other: '{label}, 카드 {count}장',
      },
    },
    cardSearchField: {
      searchA11yLabel: '카드 검색',
      searchPlaceholder: '질문과 답 검색',
      clearA11yLabel: '카드 검색어 지우기',
    },
    sessionHistoryChart: {
      title: '세션 기록',
      subtitleLatest: '전체 {total}개 중 최근 {shown}개',
      empty: {
        title: '이 덱의 세션이 없어요',
        message: '덱 탭에서 세션을 시작하면 결과가 여기에 표시돼요.',
      },
      unansweredLegend: '미답변',
      legendNote: '각 세션 카드의 비율(%)',
      sessionA11yLabel: {
        other:
          '{date} 세션: 성공률 {rate}, 카드 {count}장 중 {answered}장 답변 \u2014 맞음 {ok}, 애매함 {okeish}, 틀림 {notOk}',
      },
      sessionNoAnswersA11yLabel: {
        other:
          '{date} 세션: 성공률 아직 답변 없음, 카드 {count}장 중 {answered}장 답변 \u2014 맞음 {ok}, 애매함 {okeish}, 틀림 {notOk}',
      },
    },
  },
};

export const ko: Language = { code: 'ko', plural: koPlural, messages };
