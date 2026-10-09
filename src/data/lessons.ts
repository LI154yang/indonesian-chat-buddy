export interface DialogueLine {
  speaker: string;
  indonesian: string;
  chinese: string;
  tip?: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  level: "入门" | "初级" | "进阶";
  scene: string;
  cultureNote: string;
  lines: DialogueLine[];
  vocab: { word: string; meaning: string }[];
}

export const lessons: Lesson[] = [
  {
    id: "greeting",
    title: "见面打招呼",
    subtitle: "第一次和印尼朋友见面",
    level: "入门",
    scene: "在雅加达的朋友聚会上",
    cultureNote:
      "印尼人非常重视问候。见面时说「Apa kabar?」（你好吗）是基本礼貌，回答「Baik」（很好）后记得回问对方。握手要轻，许多人会用右手轻触胸口表示真诚。",
    lines: [
      {
        speaker: "Andi",
        indonesian: "Halo! Selamat pagi. Nama saya Andi.",
        chinese: "你好！早上好。我叫安迪。",
        tip: "Selamat pagi = 早上好（10点前用）",
      },
      {
        speaker: "你",
        indonesian: "Selamat pagi, Andi. Nama saya Mei. Senang bertemu denganmu.",
        chinese: "早上好，安迪。我叫小美。很高兴认识你。",
        tip: "Senang bertemu denganmu = 很高兴认识你",
      },
      {
        speaker: "Andi",
        indonesian: "Senang bertemu denganmu juga. Apa kabar?",
        chinese: "我也很高兴认识你。你好吗？",
      },
      {
        speaker: "你",
        indonesian: "Baik, terima kasih. Kamu bagaimana?",
        chinese: "很好，谢谢。你呢？",
        tip: "Baik = 好；terima kasih = 谢谢",
      },
      {
        speaker: "Andi",
        indonesian: "Saya baik juga. Dari mana asalmu?",
        chinese: "我也很好。你来自哪里？",
      },
      {
        speaker: "你",
        indonesian: "Saya dari Tiongkok. Ini pertama kali saya di Indonesia.",
        chinese: "我来自中国。这是我第一次来印尼。",
      },
    ],
    vocab: [
      { word: "Halo", meaning: "你好" },
      { word: "Selamat pagi", meaning: "早上好" },
      { word: "Apa kabar?", meaning: "你好吗？" },
      { word: "Baik", meaning: "好 / 很好" },
      { word: "Terima kasih", meaning: "谢谢" },
      { word: "Nama saya...", meaning: "我叫……" },
    ],
  },
  {
    id: "market",
    title: "市场砍价",
    subtitle: "在传统市场买到好价钱",
    level: "初级",
    scene: "巴厘岛乌布传统市场",
    cultureNote:
      "在印尼传统市场砍价是常态，也是一种社交乐趣。保持微笑、语气轻松，砍到六七折很常见。说「Mahal sekali!」（太贵了！）配合夸张的表情，摊主通常会笑着降价。",
    lines: [
      {
        speaker: "摊主",
        indonesian: "Silakan dilihat-lihat, Mbak! Batiknya bagus-bagus.",
        chinese: "随便看看，小姐！这些蜡染布都很漂亮。",
        tip: "Mbak = 对年轻女性的称呼；Mas = 对年轻男性",
      },
      {
        speaker: "你",
        indonesian: "Ini berapa harganya, Bu?",
        chinese: "这个多少钱，阿姨？",
        tip: "Berapa harganya = 多少钱",
      },
      {
        speaker: "摊主",
        indonesian: "Itu seratus lima puluh ribu rupiah.",
        chinese: "那个十五万印尼盾。",
      },
      {
        speaker: "你",
        indonesian: "Wah, mahal sekali! Bisa kurang?",
        chinese: "哇，太贵了！可以便宜点吗？",
        tip: "Bisa kurang? = 能便宜吗？砍价金句",
      },
      {
        speaker: "摊主",
        indonesian: "Berapa Mbak mau bayar?",
        chinese: "小姐你想出多少钱？",
      },
      {
        speaker: "你",
        indonesian: "Delapan puluh ribu, bagaimana?",
        chinese: "八万，怎么样？",
      },
      {
        speaker: "摊主",
        indonesian: "Aduh, terlalu murah. Seratus ribu saja, ya?",
        chinese: "哎呀，太便宜了。十万吧，好吗？",
      },
      {
        speaker: "你",
        indonesian: "Baik, seratus ribu. Terima kasih, Bu!",
        chinese: "好，十万成交。谢谢阿姨！",
      },
    ],
    vocab: [
      { word: "Berapa harganya?", meaning: "多少钱？" },
      { word: "Mahal sekali!", meaning: "太贵了！" },
      { word: "Bisa kurang?", meaning: "能便宜点吗？" },
      { word: "Murah", meaning: "便宜" },
      { word: "Ribu", meaning: "千（价格单位）" },
      { word: "Rupiah", meaning: "印尼盾" },
    ],
  },
  {
    id: "restaurant",
    title: "餐厅点餐",
    subtitle: "在 Warung 点地道美食",
    level: "初级",
    scene: "日惹街边的 Warung（小餐馆）",
    cultureNote:
      "Warung 是印尼最常见的小餐馆。点餐时说「Pedas?」（辣吗）很重要——印尼菜普遍偏辣。不吃辣就说「Tidak pedas, ya」。饭后说「Enak sekali!」（太好吃了）会让老板非常开心。",
    lines: [
      {
        speaker: "服务员",
        indonesian: "Selamat malam! Mau pesan apa?",
        chinese: "晚上好！想点些什么？",
        tip: "Selamat malam = 晚上好（天黑后用）",
      },
      {
        speaker: "你",
        indonesian: "Saya mau nasi goreng satu. Pedas atau tidak?",
        chinese: "我要一份印尼炒饭。辣不辣？",
        tip: "Nasi goreng = 印尼炒饭，国民美食",
      },
      {
        speaker: "服务员",
        indonesian: "Sedikit pedas. Mau yang tidak pedas?",
        chinese: "有点辣。要不辣的吗？",
      },
      {
        speaker: "你",
        indonesian: "Tidak pedas, ya. Terus es teh manis satu.",
        chinese: "不辣的，谢谢。再来一杯甜冰茶。",
        tip: "Es teh manis = 甜冰茶，印尼国民饮料",
      },
      {
        speaker: "服务员",
        indonesian: "Baik. Ada lagi?",
        chinese: "好的。还要别的吗？",
      },
      {
        speaker: "你",
        indonesian: "Sudah, itu saja. Berapa semuanya?",
        chinese: "够了，就这些。一共多少钱？",
      },
      {
        speaker: "服务员",
        indonesian: "Tiga puluh lima ribu rupiah.",
        chinese: "三万五千印尼盾。",
      },
      {
        speaker: "你",
        indonesian: "Ini uangnya. Enak sekali, terima kasih!",
        chinese: "给你钱。太好吃了，谢谢！",
      },
    ],
    vocab: [
      { word: "Mau pesan apa?", meaning: "想点什么？" },
      { word: "Nasi goreng", meaning: "印尼炒饭" },
      { word: "Pedas", meaning: "辣" },
      { word: "Es teh manis", meaning: "甜冰茶" },
      { word: "Berapa semuanya?", meaning: "一共多少钱？" },
      { word: "Enak sekali!", meaning: "太好吃了！" },
    ],
  },
  {
    id: "directions", title: "问路与出行", subtitle: "找到车站，轻松走到目的地", level: "初级", scene: "日惹街头，前往火车站",
    cultureNote: "向陌生人问路可以先说 Permisi（打扰一下）。在问句末尾加 ya，语气通常会更柔和。听完路线后，记得说 Terima kasih。",
    lines: [
      { speaker: "你", indonesian: "Permisi, stasiun di mana, ya?", chinese: "打扰一下，请问火车站在哪里？", tip: "Di mana = 在哪里" },
      { speaker: "路人", indonesian: "Lurus saja dari sini, lalu belok kiri.", chinese: "从这里直走，然后左转。", tip: "Belok kiri = 左转；belok kanan = 右转" },
      { speaker: "你", indonesian: "Masih jauh dari sini?", chinese: "离这里还远吗？" },
      { speaker: "路人", indonesian: "Tidak, dekat. Sekitar lima menit jalan kaki.", chinese: "不远，很近。走路大概五分钟。" },
      { speaker: "你", indonesian: "Baik, terima kasih banyak!", chinese: "好的，非常感谢！" },
      { speaker: "路人", indonesian: "Sama-sama. Hati-hati di jalan.", chinese: "不客气。路上小心。" },
    ],
    vocab: [{ word: "Permisi", meaning: "打扰一下" }, { word: "Di mana?", meaning: "在哪里？" }, { word: "Belok kiri", meaning: "左转" }, { word: "Jalan kaki", meaning: "步行" }, { word: "Dekat", meaning: "近" }, { word: "Lurus", meaning: "直走" }],
  },
  {
    id: "hotel", title: "酒店入住", subtitle: "办理入住，询问早餐与房间", level: "初级", scene: "巴厘岛酒店前台",
    cultureNote: "递交护照或付款时，使用右手或双手比较礼貌。询问是否包含早餐可以说 Sudah termasuk sarapan?，避免把早餐是否收费当作默认。",
    lines: [
      { speaker: "你", indonesian: "Selamat siang, saya mau check-in.", chinese: "中午好，我想办理入住。" },
      { speaker: "前台", indonesian: "Baik, atas nama siapa pesanannya?", chinese: "好的，请问用谁的名字预订的？", tip: "Atas nama = 以……的名字" },
      { speaker: "你", indonesian: "Atas nama Mei. Ini paspor saya.", chinese: "用小美的名字。这是我的护照。" },
      { speaker: "前台", indonesian: "Kamar Anda di lantai dua. Ini kuncinya.", chinese: "您的房间在二楼。这是钥匙。" },
      { speaker: "你", indonesian: "Sudah termasuk sarapan?", chinese: "包含早餐吗？", tip: "Termasuk = 包含" },
      { speaker: "前台", indonesian: "Sudah. Sarapan mulai jam tujuh di restoran.", chinese: "包含了。早餐七点开始，在餐厅用餐。" },
    ],
    vocab: [{ word: "Paspor", meaning: "护照" }, { word: "Kamar", meaning: "房间" }, { word: "Lantai dua", meaning: "二楼" }, { word: "Sarapan", meaning: "早餐" }, { word: "Kunci", meaning: "钥匙" }, { word: "Termasuk", meaning: "包含" }],
  },
  {
    id: "friends", title: "交朋友与邀约", subtitle: "聊聊生活，约一杯咖啡", level: "进阶", scene: "雅加达咖啡馆，与新朋友聊天",
    cultureNote: "Ngopi 是日常口语里的「喝咖啡」，也常用来邀请朋友小聚。Kapan-kapan 表示「改天、有空的时候」，不一定是已经确定的约会时间。",
    lines: [
      { speaker: "Andi", indonesian: "Kamu tinggal di mana sekarang?", chinese: "你现在住在哪里？" },
      { speaker: "你", indonesian: "Saya tinggal di Jakarta. Saya baru pindah ke sini.", chinese: "我住在雅加达。我刚搬到这里。", tip: "Baru pindah = 刚搬来" },
      { speaker: "Andi", indonesian: "Wah, selamat datang! Kamu suka kopi?", chinese: "哇，欢迎！你喜欢咖啡吗？" },
      { speaker: "你", indonesian: "Suka! Ada kafe yang enak di dekat sini?", chinese: "喜欢！附近有什么不错的咖啡馆吗？" },
      { speaker: "Andi", indonesian: "Ada. Besok sore kita ngopi, yuk!", chinese: "有。明天下午我们一起喝咖啡吧！", tip: "Yuk = 一起……吧，用于邀约" },
      { speaker: "你", indonesian: "Boleh! Sampai ketemu besok.", chinese: "好啊！明天见。" },
    ],
    vocab: [{ word: "Tinggal", meaning: "居住" }, { word: "Baru pindah", meaning: "刚搬来" }, { word: "Ngopi", meaning: "喝咖啡" }, { word: "Besok", meaning: "明天" }, { word: "Suka", meaning: "喜欢" }, { word: "Sampai ketemu", meaning: "回头见" }],
  },
];

export interface QuizQuestion {
  question: string;
  audio: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: "听录音，这句话是什么意思？",
    audio: "Apa kabar?",
    options: ["你叫什么名字？", "你好吗？", "多少钱？", "再见"],
    answer: 1,
    explanation: "「Apa kabar?」是最常用的问候语，意思是「你好吗？」",
  },
  {
    question: "听录音，这句话是什么意思？",
    audio: "Bisa kurang?",
    options: ["可以加辣吗？", "可以便宜点吗？", "可以打包吗？", "可以刷卡吗？"],
    answer: 1,
    explanation: "「Bisa kurang?」是砍价金句：能便宜点吗？",
  },
  {
    question: "在餐厅不想吃辣，你应该说：",
    audio: "Tidak pedas, ya.",
    options: ["Pedas sekali", "Tidak pedas, ya", "Enak sekali", "Sedikit pedas"],
    answer: 1,
    explanation: "「Tidak pedas」= 不辣。加上「ya」语气更柔和礼貌。",
  },
  {
    question: "听录音，对方在说什么？",
    audio: "Terima kasih banyak!",
    options: ["非常抱歉！", "非常感谢！", "不客气！", "请再说一遍！"],
    answer: 1,
    explanation: "「Terima kasih banyak」= 非常感谢，banyak 表示「很多/非常」。",
  },
  {
    question: "摊主说「Seratus ribu」，价格是：",
    audio: "Seratus ribu rupiah.",
    options: ["一万印尼盾", "十万印尼盾", "一百万印尼盾", "一千印尼盾"],
    answer: 1,
    explanation: "Seratus = 一百，ribu = 千，所以是十万印尼盾。",
  },
];
