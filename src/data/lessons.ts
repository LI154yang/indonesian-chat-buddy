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
