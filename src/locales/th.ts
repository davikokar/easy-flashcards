import type { Catalogue, Language, PluralRule } from '../utils/i18n';

// Thai has no plural forms (CLDR), so every count uses 'other'.
export const thPlural: PluralRule = () => 'other';

// "Okeish" is rendered "พอใช้": it reads as clearly between "โอเค" and "ไม่โอเค".
const messages: Catalogue = {
  common: {
    actions: {
      back: 'กลับ',
      cancel: 'ยกเลิก',
      clear: 'ล้าง',
      close: 'ปิด',
      delete: 'ลบ',
      discard: 'ละทิ้ง',
      export: 'ส่งออก',
      keepEditing: 'แก้ไขต่อ',
      ok: 'ตกลง',
      reset: 'รีเซ็ต',
      save: 'บันทึก',
      start: 'เริ่ม',
    },
    search: {
      noMatchesTitle: 'ไม่พบรายการที่ตรงกัน',
      noMatchesMessage: 'ไม่มีรายการที่ตรงกับ "{query}"',
      clearSearchButton: 'ล้างการค้นหา',
    },
    counts: {
      cards: {
        other: '{count} การ์ด',
      },
      sessions: {
        other: '{count} เซสชัน',
      },
      reviews: {
        other: 'ทบทวน {count} ครั้ง',
      },
    },
  },
  navigation: {
    tabs: {
      decks: 'ชุดการ์ด',
      learn: 'เรียนรู้',
      categories: 'หมวดหมู่',
      statistics: 'สถิติ',
    },
    headers: {
      decksList: 'ชุดการ์ด',
      editDeck: 'แก้ไขชุดการ์ด',
      newDeck: 'ชุดการ์ดใหม่',
      learnList: 'เรียนรู้',
      study: 'เซสชัน',
      categoriesList: 'หมวดหมู่',
      newCategory: 'หมวดหมู่ใหม่',
      statsOverview: 'สถิติ',
      deckStats: 'สถิติชุดการ์ด',
    },
  },
  answers: {
    answerLabels: {
      ok: 'โอเค',
      okeish: 'พอใช้',
      notOk: 'ไม่โอเค',
    },
    shares: {
      notReviewed: 'ยังไม่ได้ทบทวน',
      summary: '{ok} โอเค, {okeish} พอใช้, {notOk} ไม่โอเค',
    },
    cardStatus: {
      needsReview: 'ต้องทบทวน',
      learning: 'กำลังเรียน',
      mastered: 'เชี่ยวชาญแล้ว',
      new: 'ใหม่',
    },
    timeframes: {
      all: 'ทั้งหมด',
      month: 'เดือนนี้',
      week: '7 วันล่าสุด',
    },
    sortOrders: {
      hardest: 'ยากที่สุดก่อน',
      deck: 'ตามลำดับในชุด',
      recent: 'ทบทวนล่าสุด',
    },
    dates: {
      never: 'ไม่เคย',
    },
  },
  importExport: {
    defaultDeckName: 'ชุดการ์ดที่นำเข้า',
    importErrors: {
      emptyFile: 'ไฟล์ที่เลือกว่างเปล่า',
      notADeck:
        'นี่ไม่ใช่ไฟล์ชุดการ์ดของ Easy Flashcards เลือกไฟล์ JSON ที่ส่งออกจากแอป',
      newerVersion:
        'ไฟล์ชุดการ์ดนี้สร้างโดย Easy Flashcards เวอร์ชันที่ใหม่กว่า อัปเดตแอปเพื่อนำเข้าไฟล์นี้',
      noCards: 'ไม่พบการ์ดที่ใช้ได้ ทุกการ์ดต้องมีคำถามและคำตอบ',
      noHeader:
        'ไม่พบแถวหัวตาราง บรรทัดแรกที่ไม่ว่างและไม่ใช่คอมเมนต์ "#" ต้องระบุคอลัมน์ "question" และ "answer" โดยคั่นด้วยคอมมา เซมิโคลอน แท็บ หรือสัญลักษณ์อื่นหนึ่งตัว',
      noUsableRows: 'ไม่พบแถวที่ใช้ได้ ทุกแถวต้องมีคำถามและคำตอบ',
      unreadable: 'ไม่สามารถอ่านไฟล์ที่เลือกได้',
    },
    importAlert: {
      successTitle: 'นำเข้าชุดการ์ดแล้ว',
      successMessage: {
        other: '"{name}" มี {count} การ์ดแล้ว',
      },
      skippedRows: {
        other: 'ข้ามแถวที่ไม่สมบูรณ์ {count} แถว',
      },
      skippedCards: {
        other: 'ข้ามการ์ดที่ไม่สมบูรณ์ {count} ใบ',
      },
      failedTitle: 'นำเข้าไม่สำเร็จ',
      failedWithDetails: 'ไม่สามารถนำเข้าไฟล์ได้: {details}',
      failedUnknown: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุขณะนำเข้าไฟล์',
    },
    exportAlert: {
      successTitle: 'ส่งออกชุดการ์ดแล้ว',
      savedAs: 'บันทึกเป็น {name}',
      saved: 'บันทึกชุดการ์ดแล้ว',
      failedTitle: 'ส่งออกไม่สำเร็จ',
      deckGone: 'ชุดการ์ดนี้ไม่มีอยู่แล้ว',
      failedFallback: 'ไม่สามารถส่งออกชุดการ์ดได้',
    },
    separators: {
      comma: 'คอมมา (,)',
      semicolon: 'เซมิโคลอน (;)',
      tab: 'แท็บ',
    },
    sampleExport: {
      successTitle: 'ส่งออกชุดการ์ดตัวอย่างแล้ว',
      partlyTitle: 'ส่งออกชุดการ์ดตัวอย่างบางส่วน',
      failedTitle: 'ส่งออกไม่สำเร็จ',
      savedAsOne: 'บันทึกเป็น {name}',
      savedAsTwo: 'บันทึกเป็น {first} และ {second}',
      fileFailed: 'ไม่สามารถบันทึกไฟล์ {format} ได้: {details}',
      fileNotSaved: 'ไม่ได้บันทึกไฟล์ {format}',
      unknownError: 'ข้อผิดพลาดที่ไม่ทราบสาเหตุ',
    },
  },
  categoryNames: {
    builtIn: {
      astronomy: 'ดาราศาสตร์',
      biology: 'ชีววิทยา',
      botany: 'พฤกษศาสตร์',
      chemistry: 'เคมี',
      cinema: 'ภาพยนตร์',
      computer_science: 'วิทยาการคอมพิวเตอร์',
      economics: 'เศรษฐศาสตร์',
      gastronomy: 'อาหาร',
      geography: 'ภูมิศาสตร์',
      history: 'ประวัติศาสตร์',
      languages: 'ภาษา',
      law: 'กฎหมาย',
      literature: 'วรรณกรรม',
      mathematics: 'คณิตศาสตร์',
      medicine: 'การแพทย์',
      music: 'ดนตรี',
      philosophy: 'ปรัชญา',
      physics: 'ฟิสิกส์',
      religion: 'ศาสนา',
      sport: 'กีฬา',
      zoology: 'สัตววิทยา',
    },
    icons: {
      plane_contrails: 'เครื่องบิน',
      anchor: 'สมอเรือ',
      nutrition: 'แอปเปิล',
      emergency: 'ดอกจัน',
      microbiology: 'แบคทีเรีย',
      finance: 'แผนภูมิแท่ง',
      sports_basketball: 'บาสเกตบอล',
      neurology: 'สมอง',
      bug_report: 'แมลง',
      calendar_month: 'ปฏิทิน',
      photo_camera: 'กล้องถ่ายรูป',
      camera: 'ช่องรับแสงกล้อง',
      cannabis: 'ใบกัญชา',
      directions_car: 'รถยนต์',
      chess_pawn: 'เบี้ยหมากรุก',
      language_chinese_dayi: 'อักษรจีนและอักษรละติน',
      location_city: 'เมือง',
      circle_circle: 'วงกลมซ้อนกัน',
      restaurant: 'ช้อนส้อม',
      database: 'ฐานข้อมูล',
      nest_heat_link_e: 'จุดในวงกลม',
      engineering: 'วิศวกร',
      face: 'ใบหน้า',
      face_3: 'ใบหน้ามีผม',
      theaters: 'แถบฟิล์ม',
      flag_2: 'ธง',
      science: 'ขวดทดลอง',
      save: 'ฟล็อปปีดิสก์',
      sports_and_outdoors: 'ฟุตบอล',
      skillet: 'กระทะ',
      sports_esports: 'จอยเกม',
      language: 'ลูกโลก',
      diversity_3: 'กลุ่มคน',
      psychology: 'ศีรษะมีเฟือง',
      headphones: 'หูฟัง',
      health_and_safety: 'โล่สุขภาพ',
      landscape_2: 'เนินเขา',
      hive: 'รวงผึ้ง',
      hourglass_empty: 'นาฬิกาทราย',
      house: 'บ้าน',
      icecream: 'ไอศกรีม',
      temp_preferences_eco: 'ใบไม้',
      electric_bolt: 'สายฟ้า',
      wand_stars: 'ไม้กายสิทธิ์',
      biotech: 'กล้องจุลทรรศน์',
      mindfulness: 'สติ',
      motorcycle: 'มอเตอร์ไซค์',
      music_note_2: 'โน้ตดนตรี',
      network_node: 'เครือข่าย',
      import_contacts: 'หนังสือเปิด',
      pan_tool: 'มือเปิด',
      pets: 'รอยเท้าสัตว์',
      stylus: 'ดินสอ',
      person: 'บุคคล',
      history_edu: 'ปากกาขนนกและกระดาษ',
      radio: 'วิทยุ',
      raven: 'อีกา',
      rib_cage: 'ซี่โครง',
      rocket_launch: 'จรวด',
      scatter_plot: 'แผนภาพการกระจาย',
      category: 'รูปทรง',
      interests: 'รูปทรงและหัวใจ',
      shopping_cart: 'รถเข็นช้อปปิ้ง',
      functions: 'ซิกมา',
      skull: 'กะโหลก',
      emoji_language: 'หน้ายิ้มและลูกโลก',
      snowflake: 'เกล็ดหิมะ',
      hotel_class: 'ดาว',
      mountain_flag: 'ธงบนยอดเขา',
      sunny: 'ดวงอาทิตย์',
      mixture_med: 'เข็มฉีดยาและยาเม็ด',
      temple_buddhist: 'วัด',
      text_snippet: 'เอกสารข้อความ',
      theater_comedy: 'หน้ากากละคร',
      nest_thermostat_gen_3: 'เทอร์โมสตัท',
      translate: 'แปลภาษา',
      nature: 'ต้นไม้',
      fertile: 'ดอกทิวลิป',
      videocam: 'กล้องวิดีโอ',
      coronavirus: 'ไวรัส',
      volcano: 'ภูเขาไฟ',
      warning: 'คำเตือน',
      water: 'คลื่นน้ำ',
      air: 'ลม',
      build: 'ประแจ',
    },
  },
  shell: {
    appMenu: {
      triggerA11yLabel: 'เมนูแอป',
      exportSampleDeckItem: 'ส่งออกชุดการ์ดตัวอย่าง',
      settingsItem: 'การตั้งค่า',
    },
    exportSampleDeckDialog: {
      title: 'ส่งออกชุดการ์ดตัวอย่าง',
      body: 'ระบบจะบันทึกชุดการ์ดตัวอย่างชุดเดียวกันเป็นสองไฟล์ คือ CSV และ JSON โดยจะถามตำแหน่งที่จะบันทึกแต่ละไฟล์ และคุณยกเลิกไฟล์ใดไฟล์หนึ่งเพื่อข้ามได้\n\nCSV: บรรทัดที่ขึ้นต้นด้วย # (ชื่อ คำอธิบาย หมวดหมู่) จะถูกข้ามเมื่อนำเข้า ตามด้วยแถวหัวตาราง "question" / "answer" และการ์ดหนึ่งใบต่อหนึ่งแถว ในที่นี้คั่นด้วยเซมิโคลอน (ใช้คอมมา แท็บ หรือสัญลักษณ์อื่นหนึ่งตัวก็ได้)\n\nJSON: จะนำชื่อ คำอธิบาย และหมวดหมู่กลับมาด้วย\n\nใช้ HTML พื้นฐาน เช่น <b>, <i> และ <br /> ได้ทั้งสองด้านของการ์ด',
    },
    kebabMenu: {
      triggerA11yLabel: 'ตัวเลือกเพิ่มเติม',
    },
    searchBar: {
      inputA11yLabel: 'ข้อความค้นหา',
      closeButtonA11yLabel: 'ปิดการค้นหา',
    },
  },
  settings: {
    settingsScreen: {
      title: 'การตั้งค่า',
      generalSection: 'ทั่วไป',
      appSection: 'แอป',
      communitySection: 'ชุมชนและการสนับสนุน',
      legalSection: 'กฎหมาย',
      changeLanguageItem: 'เปลี่ยนภาษา',
      shareAppItem: 'แชร์แอป',
      shareMessage: 'ลองใช้ Easy Flashcards แอปสำหรับเรียนด้วยชุดแฟลชการ์ด: {url}',
      rateAppItem: 'ให้คะแนนแอป',
      customerSupportItem: 'ฝ่ายสนับสนุนลูกค้า',
      aboutItem: 'เกี่ยวกับ',
      buyCoffeeItem: 'เลี้ยงกาแฟฉันหน่อย',
      privacyPolicyItem: 'นโยบายความเป็นส่วนตัว',
      termsItem: 'ข้อกำหนด',
    },
    languageDialog: {
      title: 'เปลี่ยนภาษา',
      systemDefaultOption: 'ค่าเริ่มต้นของระบบ',
    },
    aboutAlert: {
      title: 'เกี่ยวกับ',
      message: '{name} เวอร์ชัน {version}',
    },
    linkFailedAlert: {
      title: 'เปิดลิงก์ไม่ได้',
      message: 'ไม่มีแอปในอุปกรณ์นี้ที่เปิดลิงก์ได้',
    },
    emailFailedAlert: {
      title: 'ไม่มีแอปอีเมล',
      message: 'หากต้องการติดต่อฝ่ายสนับสนุนลูกค้า โปรดส่งอีเมลถึง {email}',
    },
    coffeeThanksAlert: {
      title: 'ขอบคุณ!',
      message: 'กาแฟของคุณกำลังเดินทางไปหาผู้พัฒนา ขอบคุณสำหรับการสนับสนุน',
    },
    coffeeUnavailableAlert: {
      title: 'เลี้ยงกาแฟฉันหน่อย',
      message: 'ขณะนี้ไม่สามารถเลี้ยงกาแฟได้ โปรดลองอีกครั้งในภายหลัง',
    },
  },
  decks: {
    decksScreen: {
      searchA11yLabel: 'ค้นหาชุดการ์ด',
      searchPlaceholder: 'ค้นหาชุดการ์ด',
      loadError: 'ไม่สามารถอ่านชุดการ์ดที่บันทึกไว้ได้',
      addDeckA11yLabel: 'เพิ่มชุดการ์ด',
      emptyTitle: 'ยังไม่มีชุดการ์ด',
      emptyMessage:
        'ใช้ปุ่ม + เพื่อนำเข้าไฟล์ชุดการ์ดและสร้างชุดการ์ดชุดแรกของคุณ',
    },
    emptyDeckAlert: {
      title: 'ชุดการ์ดว่าง',
      message: 'ชุดการ์ดนี้ไม่มีการ์ดให้เรียน',
    },
    deleteDeckAlert: {
      title: 'ลบชุดการ์ด',
      message: 'ลบ "{name}" เซสชัน และสถิติทั้งหมดของชุดการ์ดนี้หรือไม่',
    },
    addDeckMenu: {
      title: 'เพิ่มชุดการ์ด',
      importItem: 'นำเข้าชุดการ์ดจากไฟล์',
      manualItem: 'เพิ่มชุดการ์ดด้วยตนเอง',
    },
    deckOptionsMenu: {
      startWithOptionsItem: 'เริ่มเซสชันพร้อมตัวเลือก',
      editItem: 'แก้ไขชุดการ์ด',
      exportItem: 'ส่งออกเป็นไฟล์',
      deleteItem: 'ลบชุดการ์ด',
    },
    exportFormatMenu: {
      title: 'ส่งออกชุดการ์ดเป็นไฟล์',
    },
    csvSeparatorMenu: {
      title: 'ตัวคั่น CSV',
      customItem: 'กำหนดเอง…',
    },
    deckCard: {
      optionsA11yLabel: 'ตัวเลือกของ {name}',
      activeCount: 'กำลังดำเนินการ {count}',
      lastSession: 'ล่าสุด: {date}',
      startA11yLabel: 'เริ่มเซสชันของ {name}',
    },
    masteryBar: {
      a11yLabel: 'ความเชี่ยวชาญ: {summary}',
    },
    sessionSetupDialog: {
      title: 'เริ่มเซสชัน',
      invertedLabel: 'สลับด้าน',
      invertedDescription: 'แสดงคำตอบก่อน และให้คำถามอยู่ด้านหลัง',
      shuffleLabel: 'สุ่มลำดับ',
      shuffleDescription: 'เรียนการ์ดโดยสุ่มลำดับ',
    },
    customSeparatorDialog: {
      title: 'ตัวคั่นที่กำหนดเอง',
      separatorLabel: 'ตัวคั่น',
      separatorPlaceholder: 'ตัวอย่าง |',
      errors: {
        empty: 'กรุณากรอกอักขระหนึ่งตัว',
        tooLong: 'ใช้อักขระเพียงตัวเดียว',
        reserved: 'ใช้เครื่องหมายคำพูด # และการขึ้นบรรทัดใหม่ไม่ได้',
        whitespace: 'ไม่อนุญาตให้ใช้ช่องว่าง หากต้องการแท็บ ให้ใช้ตัวเลือกแท็บ',
        alphanumeric: 'ไม่อนุญาตให้ใช้ตัวอักษรและตัวเลข',
      },
    },
  },
  editDeck: {
    deckNotFound: {
      title: 'ไม่พบชุดการ์ด',
      message: 'ชุดการ์ดนี้ไม่มีอยู่แล้ว',
      backButton: 'กลับไปที่ชุดการ์ด',
    },
    editDeckScreen: {
      titleLabel: 'ชื่อ',
      descriptionLabel: 'คำอธิบาย',
      descriptionPlaceholder: 'ไม่บังคับ',
      saveButtonA11yLabel: 'บันทึกชุดการ์ด',
      addCardButton: 'เพิ่มการ์ด',
    },
    titleNeededAlert: {
      title: 'ต้องมีชื่อ',
      message: 'กรุณาตั้งชื่อชุดการ์ด',
    },
    cardIncompleteAlert: {
      title: 'การ์ดไม่สมบูรณ์',
      message: 'การ์ดใบที่ {number} ต้องมีทั้งคำถามและคำตอบ',
    },
    removeCardsAlert: {
      title: 'ลบการ์ดหรือไม่',
      message: {
        other:
          'การ์ด {count} ใบจะถูกลบออกจากชุดการ์ดพร้อมสถิติของการ์ดเหล่านั้น',
      },
    },
    discardChangesAlert: {
      title: 'ละทิ้งการเปลี่ยนแปลงหรือไม่',
      messageEdit: 'ยังไม่ได้บันทึกการแก้ไขชุดการ์ดนี้',
      messageNew: 'ยังไม่ได้บันทึกชุดการ์ดนี้',
    },
    cardEditor: {
      title: 'การ์ด {number}',
      removeButtonA11yLabel: 'ลบการ์ด {number}',
      questionLabel: 'คำถาม',
      questionA11yLabel: 'คำถามของการ์ด {number}',
      answerLabel: 'คำตอบ',
      answerA11yLabel: 'คำตอบของการ์ด {number}',
    },
    categoryField: {
      label: 'หมวดหมู่',
      a11yLabel: 'หมวดหมู่: {name}',
      a11yLabelNone: 'หมวดหมู่: ไม่มี',
      a11yHint: 'เปิดตัวเลือกหมวดหมู่',
      noneValue: 'ไม่มีหมวดหมู่',
    },
    categoryPicker: {
      title: 'หมวดหมู่',
      groupA11yLabel: 'ตัวเลือกหมวดหมู่',
      noneTile: 'ไม่มีหมวดหมู่',
    },
  },
  learn: {
    learnScreen: {
      searchA11yLabel: 'ค้นหาเซสชัน',
      searchPlaceholder: 'ค้นหาเซสชัน',
    },
    headerToolbar: {
      clearCompletedItem: 'ล้างเซสชันที่เสร็จสิ้น',
    },
    emptyState: {
      noSessionsTitle: 'ยังไม่มีเซสชัน',
      noSessionsMessage:
        'เลือกชุดการ์ดแล้วเริ่มเซสชันการเรียน เซสชันจะแสดงที่นี่จนกว่าคุณจะเรียนจบ',
      allClearedTitle: 'ไม่มีเซสชันให้แสดง',
      allClearedMessage:
        'เซสชันที่ล้างแล้วยังนับรวมในสถิติ เริ่มเซสชันใหม่จากชุดการ์ดเพื่อดูที่นี่',
      goToDecksButton: 'ไปที่ชุดการ์ด',
    },
    deckUnavailableAlert: {
      title: 'ใช้ชุดการ์ดไม่ได้',
      message: 'ชุดการ์ดนี้ไม่มีอยู่แล้วหรือไม่มีการ์ด',
    },
    clearCompletedSessionsAlert: {
      title: 'ล้างเซสชันที่เสร็จสิ้น',
      nothingToClear: 'ไม่มีเซสชันที่เสร็จสิ้นให้ล้าง',
      message: {
        other:
          'นำ {count} เซสชันที่เสร็จสิ้นออกจากรายการนี้หรือไม่ ผลลัพธ์ยังอยู่ในสถิติ',
      },
    },
    discardSessionAlert: {
      title: 'ละทิ้งเซสชัน',
      message:
        'ละทิ้งเซสชันที่ยังไม่จบของ "{deckName}" หรือไม่ คำตอบของเซสชันจะถูกนำออกจากสถิติด้วย',
    },
    clearSessionAlert: {
      title: 'ล้างเซสชัน',
      message:
        'นำเซสชันที่เสร็จสิ้นของ "{deckName}" ออกจากรายการนี้หรือไม่ ผลลัพธ์ยังอยู่ในสถิติ',
    },
    sessionOptionsMenu: {
      discardItem: 'ละทิ้งเซสชัน',
      clearItem: 'ล้างเซสชัน',
    },
    sessionCard: {
      inProgressStatus: {
        other: 'กำลังเรียน \u2014 {answered}/{count} การ์ด',
      },
      completedStatus: {
        other: 'เสร็จสิ้น \u2014 {count} การ์ด',
      },
      invertedPill: 'สลับด้าน',
      invertedPillA11yLabel: 'เซสชันสลับด้าน',
      optionsA11yLabel: 'ตัวเลือกของเซสชัน {deckName}',
      started: 'เริ่มเมื่อ {date}',
      resumeButtonA11yLabel: 'เรียนเซสชันของ {deckName} ต่อ',
      replayButtonA11yLabel: 'เรียนเซสชันของ {deckName} ซ้ำ',
      reviewErrorsButtonA11yLabel: {
        other: 'ทบทวนการ์ดที่พลาดหรือไม่แน่ใจ {count} ใบของ {deckName}',
      },
      reviewErrorsDoneA11yLabel:
        'แก้การ์ดที่พลาดหรือไม่แน่ใจของ {deckName} ครบแล้ว',
    },
    sessionResultsBar: {
      progressA11yLabel:
        'ความคืบหน้า: ตอบแล้ว {answered} จาก {cardCount} \u2014 โอเค {ok}, พอใช้ {okeish}, ไม่โอเค {notOk}',
    },
  },
  study: {
    studyScreen: {
      fallbackTitle: 'เซสชัน',
      unavailableTitle: 'ไม่มีอะไรให้เรียน',
      unavailableMessage: 'เซสชันนี้ใช้งานไม่ได้อีกต่อไป',
      unavailableAction: 'กลับไปที่เซสชัน',
    },
    progressHeader: {
      position: 'การ์ด {current} จาก {total}',
      okCount: 'โอเค {count}',
    },
    invertedPill: {
      text: 'สลับด้าน',
      a11yLabel: 'เซสชันสลับด้าน: ด้านหน้าแสดงคำตอบ',
    },
    swipeHint: {
      reviewing: 'กำลังดูการ์ดที่ตอบแล้ว \u2014 ปัดซ้ายเพื่อกลับไปที่เดิม',
    },
    historyStrip: {
      a11yLabel: 'คำตอบที่ผ่านมา',
    },
    flipCard: {
      questionLabel: 'คำถาม',
      answerLabel: 'คำตอบ',
      revealHint: 'แตะเพื่อดูคำตอบ',
      backHint: 'แตะเพื่อดูคำถามอีกครั้ง',
      showQuestionA11yLabel: 'แสดงคำถาม',
      showAnswerA11yLabel: 'แสดงคำตอบ',
    },
    sessionSummary: {
      title: 'เซสชันเสร็จสิ้น',
      successRateA11yLabel: 'อัตราความสำเร็จ {rate}',
      reviewedCount: 'ทบทวนแล้ว {count}',
      studyAgainLabel: 'เรียนทั้งชุดอีกครั้ง',
      studyAgainButtonA11yLabel: 'เรียนทั้งชุดอีกครั้ง',
    },
    reviewSummary: {
      title: 'ทบทวนเสร็จสิ้น',
      stillToFix: 'ยังต้องแก้ {count}',
      allFixed: 'แก้ครบแล้ว',
    },
    summaryAction: {
      reviewLabel: 'ทบทวนการ์ดที่พลาดหรือไม่แน่ใจ',
      reviewButtonA11yLabel: {
        other: 'ทบทวนการ์ดที่พลาดหรือไม่แน่ใจ {count} ใบ',
      },
      backLabel: 'กลับไปที่เซสชัน',
      backButtonA11yLabel: 'กลับไปที่เซสชัน',
    },
  },
  categories: {
    categoriesScreen: {
      customSectionTitle: 'หมวดหมู่ที่กำหนดเอง',
      customSectionSubtitle: {
        other: 'มี {count} หมวดหมู่',
      },
      customEmptyHint: 'หมวดหมู่ที่คุณสร้างเองจะแสดงที่นี่',
      defaultSectionTitle: 'หมวดหมู่เริ่มต้น',
      defaultSectionSubtitle: {
        other: 'ในตัว {count} หมวดหมู่',
      },
      newCategoryButton: 'หมวดหมู่ใหม่',
      categoryTileA11yLabel: 'ตัวเลือกของ {name}',
    },
    categoryOptionsMenu: {
      deleteItem: 'ลบหมวดหมู่',
    },
    deleteCategoryAlert: {
      title: 'ลบหมวดหมู่หรือไม่',
      message: '"{name}" จะถูกลบ',
      messageWithDecks: {
        other: '"{name}" จะถูกลบ และชุดการ์ด {count} ชุดจะไม่มีหมวดหมู่',
      },
    },
    newCategoryScreen: {
      saveButtonA11yLabel: 'บันทึกหมวดหมู่',
      nameField: 'ชื่อ',
      colourLabel: 'สี',
      iconLabel: 'ไอคอน',
      nameCounter: '{length}/{max}',
      nameErrors: {
        empty: 'กรุณากรอกชื่อ',
        tooLong: {
          other: 'ใช้ไม่เกิน {count} ตัวอักษร',
        },
        duplicate: 'มีหมวดหมู่ชื่อนี้อยู่แล้ว',
      },
    },
    discardChangesAlert: {
      title: 'ละทิ้งการเปลี่ยนแปลงหรือไม่',
      message: 'ยังไม่ได้บันทึกหมวดหมู่นี้',
    },
    tilePreview: {
      placeholder: 'ชื่อหมวดหมู่',
      a11yLabel: 'ตัวอย่าง: {name}',
      noNameA11yLabel: 'ตัวอย่าง: ยังไม่มีชื่อ',
    },
    colourPicker: {
      a11yLabel: 'ตัวเลือกสี',
      swatchA11yLabel: 'สีที่ {position} จาก {total}',
    },
    customColourSwatch: {
      a11yLabel: 'สีที่กำหนดเอง',
      a11yHint: 'เปิดตัวเลือกสี',
    },
    iconPicker: {
      a11yLabel: 'ตัวเลือกไอคอน',
    },
    customColourDialog: {
      title: 'สีที่กำหนดเอง',
      hueLabel: 'เฉดสี',
      hueValue: '{value}°',
      saturationLabel: 'ความอิ่มตัว',
      brightnessLabel: 'ความสว่าง',
      percentValue: '{value}%',
      previewA11yLabel: 'ตัวอย่างสี {color}',
      tooDark: 'สีเข้มเกินไปสำหรับไอคอน ลองใช้สีที่อ่อนกว่า',
      useButton: 'ใช้สีนี้',
    },
    categorySquare: {
      a11yLabel: 'หมวดหมู่: {name}',
    },
  },
  stats: {
    statsScreen: {
      searchA11yLabel: 'ค้นหาชุดการ์ด',
      searchPlaceholder: 'ค้นหาชุดการ์ด',
      aggregatedHeading: 'สถิติรวม',
      decksTile: {
        label: 'ชุดการ์ด',
        caption: 'ในคลังของคุณ',
      },
      totalCardsTile: {
        label: 'การ์ดทั้งหมด',
        caption: 'จากทุกชุดการ์ด',
      },
      totalReviewsTile: {
        label: 'การทบทวนทั้งหมด',
        caption: {
          all: 'คำตอบที่บันทึกไว้',
          month: 'คำตอบในเดือนนี้',
          week: 'คำตอบใน 7 วันล่าสุด',
        },
      },
      sessionsTile: {
        label: 'เซสชัน',
        caption: 'กำลังดำเนินการ {count}',
      },
      tileA11yLabel: '{label}: {value}, {caption}',
      decksBreakdownHeading: 'แยกตามชุดการ์ด',
      deckCount: {
        other: '{count} ชุด',
      },
      emptyState: {
        title: 'ยังไม่มีสถิติ',
        message: 'นำเข้าชุดการ์ดแล้วเริ่มเรียน ผลลัพธ์จะแสดงที่นี่',
      },
    },
    masteryRing: {
      summaryA11yLabel: 'อัตราความสำเร็จ {rate}. {shares}. จำนวน: {counts}',
      caption: 'อัตราความสำเร็จ',
    },
    deckStatsCard: {
      summaryA11yLabel:
        '{name}: {shares}, {cards}, {sessions}, {reviews}, ล่าสุด {last}',
      openA11yHint: 'เปิดรายละเอียดของแต่ละการ์ด',
      cardsLabel: 'การ์ด',
      sessionsLabel: 'เซสชัน',
      reviewsLabel: 'การทบทวน',
      lastLabel: 'ล่าสุด',
    },
    timeframeChips: {
      groupA11yLabel: 'ช่วงเวลา',
    },
  },
  deckStats: {
    deckStatsScreen: {
      optionsA11yLabel: 'ตัวเลือกของสถิติ {deckName}',
      resetStatisticsMenuItem: 'รีเซ็ตสถิติ',
      resetAlert: {
        title: 'รีเซ็ตสถิติ',
        message:
          'ล้างผลลัพธ์และเซสชันที่บันทึกไว้ทั้งหมดของ "{deckName}" หรือไม่',
      },
      notFound: {
        title: 'ไม่พบชุดการ์ด',
        message: 'ชุดการ์ดนี้ถูกลบแล้ว',
      },
      cardPerformanceTitle: 'ผลของแต่ละการ์ด',
      subtitle: {
        other: '{count} การ์ด · {sort}',
      },
      subtitleNarrowed: {
        other: '{shown} จาก {count} การ์ด · {sort}',
      },
      sortButtonA11yLabel: 'เรียงการ์ด: {sort}',
      sortSheetTitle: 'เรียงการ์ด',
      noCards: {
        title: 'ยังไม่มีการ์ด',
        message: 'เพิ่มการ์ดในชุดนี้เพื่อดูผลของแต่ละการ์ด',
      },
      statusEmpty: {
        needsReview: {
          title: 'ไม่มีการ์ดที่ต้องทบทวน',
          message: 'ไม่มีการ์ดที่อัตราความสำเร็จต่ำกว่า 40%',
        },
        learning: {
          title: 'ไม่มีการ์ดที่กำลังเรียน',
          message: 'ไม่มีการ์ดที่อัตราความสำเร็จอยู่ระหว่าง 40% ถึง 70%',
        },
        mastered: {
          title: 'ยังไม่มีการ์ดที่เชี่ยวชาญ',
          message: 'การ์ดจะเชี่ยวชาญเมื่ออัตราความสำเร็จถึง 70% ขึ้นไป',
        },
        new: {
          title: 'ไม่มีการ์ดใหม่',
          message: 'ทุกการ์ดถูกทบทวนอย่างน้อยหนึ่งครั้งแล้ว',
        },
      },
      showAllCardsButton: 'แสดงการ์ดทั้งหมด',
      noMatches: {
        filteredMessage: 'ไม่มีรายการที่ตรงกับ "{query}" ในตัวกรอง {status}',
      },
    },
    deckIdentityRow: {
      categoryA11yLabel: 'หมวดหมู่: {name}',
    },
    deckMasteryCard: {
      successRateA11yLabel: 'อัตราความสำเร็จ: {rate}',
      successRateNoReviewsA11yLabel: 'อัตราความสำเร็จ: ยังไม่มีการทบทวน',
      successRateCaption: 'อัตราความสำเร็จ',
      answerTile: {
        ok: '{count} โอเค, {percent}',
        okeish: '{count} พอใช้, {percent}',
        notOk: '{count} ไม่โอเค, {percent}',
      },
      answerTileNoReviews: {
        ok: '{count} โอเค, ยังไม่มีการทบทวน',
        okeish: '{count} พอใช้, ยังไม่มีการทบทวน',
        notOk: '{count} ไม่โอเค, ยังไม่มีการทบทวน',
      },
      reviewsFigure: 'การทบทวน',
      sessionsFigure: 'เซสชัน',
      lastSessionFigure: 'เซสชันล่าสุด',
      figureA11yLabel: '{label}: {value}',
      changeChip: {
        none: 'ไม่เปลี่ยนจากเซสชันก่อนหน้า',
        up: '+{points} จุดจากเซสชันก่อนหน้า',
        down: '-{points} จุดจากเซสชันก่อนหน้า',
        noneA11yLabel: 'อัตราความสำเร็จไม่เปลี่ยนจากเซสชันก่อนหน้า',
        upA11yLabel: {
          other: 'อัตราความสำเร็จเพิ่มขึ้น {count} จุดจากเซสชันก่อนหน้า',
        },
        downA11yLabel: {
          other: 'อัตราความสำเร็จลดลง {count} จุดจากเซสชันก่อนหน้า',
        },
      },
    },
    cardStatsRow: {
      footerNeverReviewed: 'ยังไม่เคยทบทวน',
      footerReviewed: {
        other: 'ทบทวน {count} ครั้ง · ทบทวนเมื่อ {date}',
      },
      neverReviewedA11yLabel:
        'คำถาม: {question}. คำตอบ: {answer}. {status}. ยังไม่เคยทบทวน',
      reviewedA11yLabel: {
        other:
          'คำถาม: {question}. คำตอบ: {answer}. {status}, อัตราความสำเร็จ {rate}. ทบทวน {count} ครั้ง: โอเค {ok}, พอใช้ {okeish}, ไม่โอเค {notOk}',
      },
      reviewedOnA11yLabel: {
        other:
          'คำถาม: {question}. คำตอบ: {answer}. {status}, อัตราความสำเร็จ {rate}. ทบทวน {count} ครั้ง: โอเค {ok}, พอใช้ {okeish}, ไม่โอเค {notOk}. ทบทวนเมื่อ {date}',
      },
    },
    cardStatusChips: {
      groupA11yLabel: 'สถานะการ์ด',
      allChip: 'ทั้งหมด',
      chipLabel: '{label} ({count})',
      chipA11yLabel: {
        other: '{label}, {count} การ์ด',
      },
    },
    cardSearchField: {
      searchA11yLabel: 'ค้นหาการ์ด',
      searchPlaceholder: 'ค้นหาคำถามและคำตอบ',
      clearA11yLabel: 'ล้างการค้นหาการ์ด',
    },
    sessionHistoryChart: {
      title: 'ประวัติเซสชัน',
      subtitleLatest: 'ล่าสุด {shown} จาก {total}',
      empty: {
        title: 'ชุดการ์ดนี้ยังไม่มีเซสชัน',
        message: 'เริ่มเซสชันจากแท็บชุดการ์ด แล้วผลลัพธ์จะแสดงที่นี่',
      },
      unansweredLegend: 'ยังไม่ได้ตอบ',
      legendNote: '% ของการ์ดในแต่ละเซสชัน',
      sessionA11yLabel: {
        other:
          'เซสชันเมื่อ {date}: อัตราความสำเร็จ {rate}, ตอบแล้ว {answered} จาก {count} การ์ด \u2014 โอเค {ok}, พอใช้ {okeish}, ไม่โอเค {notOk}',
      },
      sessionNoAnswersA11yLabel: {
        other:
          'เซสชันเมื่อ {date}: อัตราความสำเร็จ ยังไม่มีคำตอบ, ตอบแล้ว {answered} จาก {count} การ์ด \u2014 โอเค {ok}, พอใช้ {okeish}, ไม่โอเค {notOk}',
      },
    },
  },
};

export const th: Language = { code: 'th', plural: thPlural, messages };
