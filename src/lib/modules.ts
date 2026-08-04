/**
 * Unit-level syllabus content.
 *
 * The catalogue in curriculum.ts describes the shape of a ladder. This file is
 * what a learner actually works through: units, the grammar each one turns on,
 * drill lines with numbered pinyin so the tone checker knows what to expect,
 * and the exam task each unit feeds.
 */

export type Drill = {
  target: string;
  roman: string;
  gloss: string;
};

export type Unit = {
  id: string;
  title: string;
  focus: string;
  grammar: string[];
  vocabulary: string[];
  drills: Drill[];
  examTask: string;
};

export type Module = {
  code: string;
  track: string;
  title: string;
  summary: string;
  hours: number;
  words: number;
  exitCriteria: string;
  units: Unit[];
};

/* ------------------------------------------------------------- Mandarin */

export const HSK_MODULES: Module[] = [
  {
    code: "HSK 1",
    track: "mandarin",
    title: "First hundred characters",
    summary:
      "Sound system, tones, and enough vocabulary to introduce yourself and get through a shop without pointing.",
    hours: 24,
    words: 150,
    exitCriteria:
      "Produce all four tones distinctly in isolation and in two-syllable words, and hold a six-turn exchange about name, nationality and family.",
    units: [
      {
        id: "hsk1-u1",
        title: "Tones and greeting",
        focus: "The four tones, drilled before any grammar is introduced.",
        grammar: ["Subject + 好", "吗 turns a statement into a yes-no question"],
        vocabulary: ["你", "好", "我", "是", "吗", "不", "谢谢", "再见"],
        drills: [
          { target: "你好", roman: "ni3 hao3", gloss: "Hello" },
          { target: "我很好", roman: "wo3 hen3 hao3", gloss: "I am well" },
          { target: "谢谢你", roman: "xie4 xie5 ni3", gloss: "Thank you" },
          { target: "你好吗", roman: "ni3 hao3 ma5", gloss: "How are you?" },
        ],
        examTask: "HSK 1 listening part 1: match a spoken greeting to a picture.",
      },
      {
        id: "hsk1-u2",
        title: "Names and countries",
        focus: "Asking who someone is and where they are from.",
        grammar: ["叫 for names", "是 as the equative verb", "的 for possession"],
        vocabulary: ["叫", "什么", "名字", "中国", "人", "老师", "学生"],
        drills: [
          { target: "你叫什么名字", roman: "ni3 jiao4 shen2 me5 ming2 zi5", gloss: "What is your name?" },
          { target: "我是中国人", roman: "wo3 shi4 zhong1 guo2 ren2", gloss: "I am Chinese" },
          { target: "他是我的老师", roman: "ta1 shi4 wo3 de5 lao3 shi1", gloss: "He is my teacher" },
        ],
        examTask: "HSK 1 speaking: introduce yourself in three sentences.",
      },
      {
        id: "hsk1-u3",
        title: "Numbers, dates and time",
        focus: "Counting, telling the time, and naming the day.",
        grammar: ["Measure word 个", "Time expressions precede the verb"],
        vocabulary: ["一", "二", "三", "十", "点", "今天", "明天", "星期"],
        drills: [
          { target: "现在几点", roman: "xian4 zai4 ji3 dian3", gloss: "What time is it?" },
          { target: "今天星期三", roman: "jin1 tian1 xing1 qi1 san1", gloss: "Today is Wednesday" },
          { target: "我有三个朋友", roman: "wo3 you3 san1 ge4 peng2 you5", gloss: "I have three friends" },
        ],
        examTask: "HSK 1 reading: pick the sentence matching a written date.",
      },
      {
        id: "hsk1-u4",
        title: "Food, shops and money",
        focus: "Ordering and buying without switching to English.",
        grammar: ["想 for wanting to do something", "多少钱 for price"],
        vocabulary: ["吃", "喝", "菜", "水", "买", "钱", "多少", "块"],
        drills: [
          { target: "我想喝水", roman: "wo3 xiang3 he1 shui3", gloss: "I would like some water" },
          { target: "这个多少钱", roman: "zhe4 ge5 duo1 shao5 qian2", gloss: "How much is this?" },
          { target: "我不吃肉", roman: "wo3 bu4 chi1 rou4", gloss: "I do not eat meat" },
        ],
        examTask: "HSK 1 listening part 4: choose the correct reply to a shop question.",
      },
    ],
  },
  {
    code: "HSK 2",
    track: "mandarin",
    title: "Daily routines",
    summary:
      "Past events, comparisons, and the vocabulary of getting around a city on your own.",
    hours: 36,
    words: 300,
    exitCriteria:
      "Describe yesterday, tomorrow and a routine week without preparation, and ask for directions and understand the answer.",
    units: [
      {
        id: "hsk2-u1",
        title: "Completed actions",
        focus: "了 as an aspect marker, which is where most learners first slip.",
        grammar: ["了 for completion", "过 for past experience", "还没 for not yet"],
        vocabulary: ["了", "过", "已经", "昨天", "去年", "开始"],
        drills: [
          { target: "我吃了饭", roman: "wo3 chi1 le5 fan4", gloss: "I have eaten" },
          { target: "我去过北京", roman: "wo3 qu4 guo4 bei3 jing1", gloss: "I have been to Beijing" },
          { target: "他还没来", roman: "ta1 hai2 mei2 lai2", gloss: "He has not come yet" },
        ],
        examTask: "HSK 2 reading: order four events into a sequence.",
      },
      {
        id: "hsk2-u2",
        title: "Getting around",
        focus: "Directions, transport, and distance.",
        grammar: ["坐 + transport", "从 … 到 … for routes", "离 for distance"],
        vocabulary: ["坐", "地铁", "公共汽车", "左", "右", "远", "近", "路"],
        drills: [
          { target: "我坐地铁去公司", roman: "wo3 zuo4 di4 tie3 qu4 gong1 si1", gloss: "I take the subway to the office" },
          { target: "从这儿到火车站很远", roman: "cong2 zher4 dao4 huo3 che1 zhan4 hen3 yuan3", gloss: "It is far from here to the station" },
        ],
        examTask: "HSK 2 listening: follow a spoken route and name the destination.",
      },
      {
        id: "hsk2-u3",
        title: "Comparing things",
        focus: "比 constructions, including the negative form learners avoid.",
        grammar: ["A 比 B + adjective", "没有 for the negative comparison", "一样 for equality"],
        vocabulary: ["比", "一样", "更", "最", "便宜", "贵", "快", "慢"],
        drills: [
          { target: "这个比那个便宜", roman: "zhe4 ge5 bi3 na4 ge5 pian2 yi5", gloss: "This is cheaper than that" },
          { target: "他没有我高", roman: "ta1 mei2 you3 wo3 gao1", gloss: "He is not as tall as me" },
        ],
        examTask: "HSK 2 writing: complete a comparison from a prompt.",
      },
    ],
  },
  {
    code: "HSK 3",
    track: "mandarin",
    title: "Opinions and plans",
    summary:
      "Complements, the 把 construction, and enough range to explain why you think something.",
    hours: 60,
    words: 600,
    exitCriteria:
      "Give and defend an opinion for a minute without stalling, and handle a hotel, a clinic and a delayed train.",
    units: [
      {
        id: "hsk3-u1",
        title: "Result and degree complements",
        focus: "Saying how well an action came off, not just that it happened.",
        grammar: ["V + 得 + adjective", "V + 完 / 好 / 错", "V + 得了 for capability"],
        vocabulary: ["得", "完", "错", "清楚", "流利", "认真"],
        drills: [
          { target: "他说得很流利", roman: "ta1 shuo1 de5 hen3 liu2 li4", gloss: "He speaks very fluently" },
          { target: "我没听清楚", roman: "wo3 mei2 ting1 qing1 chu5", gloss: "I did not hear that clearly" },
        ],
        examTask: "HSK 3 speaking: describe a photograph in five sentences.",
      },
      {
        id: "hsk3-u2",
        title: "The 把 construction",
        focus: "Moving the object forward when something is done to it.",
        grammar: ["把 + object + verb + complement", "被 for the passive"],
        vocabulary: ["把", "被", "放", "拿", "搬", "忘"],
        drills: [
          { target: "请把门关上", roman: "qing3 ba3 men2 guan1 shang4", gloss: "Please close the door" },
          { target: "我把钱包忘在家里了", roman: "wo3 ba3 qian2 bao1 wang4 zai4 jia1 li3 le5", gloss: "I left my wallet at home" },
        ],
        examTask: "HSK 3 writing: rewrite a sentence using 把.",
      },
      {
        id: "hsk3-u3",
        title: "Reasons and conditions",
        focus: "Linking clauses so an argument holds together.",
        grammar: ["因为 … 所以 …", "虽然 … 但是 …", "如果 … 就 …"],
        vocabulary: ["因为", "所以", "虽然", "但是", "如果", "就", "才"],
        drills: [
          { target: "因为下雨所以我没去", roman: "yin1 wei4 xia4 yu3 suo3 yi3 wo3 mei2 qu4", gloss: "I did not go because it rained" },
          { target: "如果你有时间就来吧", roman: "ru2 guo3 ni3 you3 shi2 jian1 jiu4 lai2 ba5", gloss: "Come along if you have time" },
        ],
        examTask: "HSK 3 reading: choose the connector that fits the gap.",
      },
    ],
  },
  {
    code: "HSK 4",
    track: "mandarin",
    title: "Work and study",
    summary:
      "Abstract vocabulary, longer written texts, and the register shift between a friend and a manager.",
    hours: 96,
    words: 1200,
    exitCriteria:
      "Read a short news item unaided, argue a position in a meeting, and write a 120 character message that lands the right tone.",
    units: [
      {
        id: "hsk4-u1",
        title: "Workplace register",
        focus: "Polite indirectness, which is where fluent-sounding learners give themselves away.",
        grammar: ["麻烦你 … for requests", "能不能 … softening", "恐怕 for bad news"],
        vocabulary: ["麻烦", "安排", "负责", "会议", "同事", "计划", "任务"],
        drills: [
          { target: "麻烦你把报告发给我", roman: "ma2 fan5 ni3 ba3 bao4 gao4 fa1 gei3 wo3", gloss: "Could you send me the report" },
          { target: "恐怕我今天来不了", roman: "kong3 pa4 wo3 jin1 tian1 lai2 bu5 liao3", gloss: "I am afraid I cannot make it today" },
        ],
        examTask: "HSK 4 writing part 2: compose an email from three keywords.",
      },
      {
        id: "hsk4-u2",
        title: "Cause, effect and consequence",
        focus: "Building a paragraph rather than a chain of short sentences.",
        grammar: ["不但 … 而且 …", "既然 … 就 …", "无论 … 都 …"],
        vocabulary: ["不但", "而且", "既然", "无论", "影响", "结果", "原因"],
        drills: [
          { target: "无论多忙我都会去", roman: "wu2 lun4 duo1 mang2 wo3 dou1 hui4 qu4", gloss: "However busy I am, I will go" },
        ],
        examTask: "HSK 4 reading part 3: identify the writer's main claim.",
      },
      {
        id: "hsk4-u3",
        title: "Idiom and set phrase",
        focus: "The first four-character expressions, used correctly rather than decoratively.",
        grammar: ["Four-character 成语 in a sentence frame"],
        vocabulary: ["马马虎虎", "自言自语", "乱七八糟", "不可思议"],
        drills: [
          { target: "他的中文马马虎虎", roman: "ta1 de5 zhong1 wen2 ma3 ma3 hu1 hu1", gloss: "His Chinese is so-so" },
        ],
        examTask: "HSK 4 listening part 2: infer the speaker's attitude.",
      },
    ],
  },
  {
    code: "HSK 5",
    track: "mandarin",
    title: "Media literacy",
    summary:
      "Newspaper prose, formal written grammar, and film dialogue at native speed without subtitles.",
    hours: 150,
    words: 2500,
    exitCriteria:
      "Summarise a 600 character article accurately, and sustain a ten minute discussion on an unfamiliar topic.",
    units: [
      {
        id: "hsk5-u1",
        title: "Written register",
        focus: "The formal grammar that appears in print but never in speech.",
        grammar: ["于 / 予以 / 加以 constructions", "所 + verb", "为 … 所 … passive"],
        vocabulary: ["予以", "加以", "从而", "以及", "鉴于", "针对"],
        drills: [
          { target: "这个问题需要加以解决", roman: "zhe4 ge5 wen4 ti2 xu1 yao4 jia1 yi3 jie3 jue2", gloss: "This problem needs to be addressed" },
        ],
        examTask: "HSK 5 reading part 2: fill formal connectors into a news paragraph.",
      },
      {
        id: "hsk5-u2",
        title: "Argument and rebuttal",
        focus: "Disagreeing without sounding either rude or evasive.",
        grammar: ["与其 … 不如 …", "宁可 … 也不 …", "并非 for emphatic negation"],
        vocabulary: ["与其", "不如", "宁可", "并非", "反而", "未必"],
        drills: [
          { target: "与其等待不如现在开始", roman: "yu3 qi2 deng3 dai4 bu4 ru2 xian4 zai4 kai1 shi3", gloss: "Rather than wait, better to start now" },
        ],
        examTask: "HSK 5 writing: 80 character argued response to a prompt.",
      },
    ],
  },
  {
    code: "HSK 6",
    track: "mandarin",
    title: "Full command",
    summary:
      "Literary register, dense idiom, rapid inference, and writing that a native editor would pass.",
    hours: 240,
    words: 5000,
    exitCriteria:
      "Condense a 1000 character passage into 400 characters under time, and speak on abstract subjects with control of register and nuance.",
    units: [
      {
        id: "hsk6-u1",
        title: "Idiom at density",
        focus: "成语 used the way an educated native uses them — sparingly and precisely.",
        grammar: ["成语 as predicate and as modifier", "Classical residue in modern prose"],
        vocabulary: ["画蛇添足", "因地制宜", "不言而喻", "潜移默化", "众所周知"],
        drills: [
          { target: "这种影响是潜移默化的", roman: "zhe4 zhong3 ying3 xiang3 shi4 qian2 yi2 mo4 hua4 de5", gloss: "That kind of influence works imperceptibly" },
        ],
        examTask: "HSK 6 reading part 1: spot the sentence containing an error.",
      },
      {
        id: "hsk6-u2",
        title: "Summary writing under time",
        focus: "The task that decides most HSK 6 results.",
        grammar: ["Compression strategies", "Reported speech in written register"],
        vocabulary: ["概括", "归纳", "阐述", "论证", "剖析"],
        drills: [
          { target: "请概括这篇文章的主要观点", roman: "qing3 gai4 kuo4 zhe4 pian1 wen2 zhang1 de5 zhu3 yao4 guan1 dian3", gloss: "Summarise the article's main argument" },
        ],
        examTask: "HSK 6 writing: read for ten minutes, then reproduce in 400 characters.",
      },
      {
        id: "hsk6-u3",
        title: "Listening at speed",
        focus: "Interviews and lectures with no repetition and heavy inference.",
        grammar: ["Ellipsis in rapid speech", "Tone of voice carrying the meaning"],
        vocabulary: ["言外之意", "立场", "前提", "倾向", "本质"],
        drills: [
          { target: "他的言外之意是不同意", roman: "ta1 de5 yan2 wai4 zhi1 yi4 shi4 bu4 tong2 yi4", gloss: "What he implied was disagreement" },
        ],
        examTask: "HSK 6 listening part 3: answer inference questions on a lecture.",
      },
    ],
  },
];

/* -------------------------------------------------------------- English */

export const ENGLISH_MODULES: Module[] = [
  {
    code: "Foundation",
    track: "english",
    title: "Repair work",
    summary:
      "The errors that survive years of study and quietly cap a score: articles, prepositions, and tense agreement.",
    hours: 60,
    words: 2000,
    exitCriteria:
      "Speak for two minutes with fewer than three grammatical slips, and self-correct without being prompted.",
    units: [
      {
        id: "en-f1",
        title: "Articles and countability",
        focus: "The single most persistent error for speakers of article-less languages.",
        grammar: ["Zero article with uncountables", "a/an for first mention, the for second"],
        vocabulary: ["advice", "equipment", "research", "furniture", "information"],
        drills: [
          { target: "I need some advice about the equipment.", roman: "", gloss: "Uncountable nouns take no plural" },
          { target: "She bought a laptop. The laptop was faulty.", roman: "", gloss: "First mention, then definite" },
        ],
        examTask: "TOEIC Part 5: single-sentence grammar completion.",
      },
      {
        id: "en-f2",
        title: "Tense and time reference",
        focus: "Present perfect against past simple, drilled until it stops needing thought.",
        grammar: ["Present perfect for unfinished time", "Past simple with a finished time marker"],
        vocabulary: ["since", "for", "already", "yet", "recently"],
        drills: [
          { target: "I have worked here since 2021.", roman: "", gloss: "Still true now" },
          { target: "I worked there for two years before I moved.", roman: "", gloss: "Finished period" },
        ],
        examTask: "TOEIC Part 6: complete a short business text.",
      },
    ],
  },
  {
    code: "TOEIC 700",
    track: "english",
    title: "Working proficiency",
    summary:
      "Business listening at pace, correspondence, and the vocabulary that carries most of Parts 5 to 7.",
    hours: 120,
    words: 4500,
    exitCriteria:
      "Score consistently above 700 on full practice sets, with Listening no more than 50 points below Reading.",
    units: [
      {
        id: "en-t7-1",
        title: "Short conversations",
        focus: "Part 3, where speed rather than vocabulary is the constraint.",
        grammar: ["Question forms in rapid speech", "Elliptical replies"],
        vocabulary: ["invoice", "shipment", "postpone", "reimburse", "vendor"],
        drills: [
          { target: "Could we push the vendor meeting to Thursday?", roman: "", gloss: "Requesting a reschedule" },
        ],
        examTask: "TOEIC Part 3: three questions on a 40 second exchange.",
      },
      {
        id: "en-t7-2",
        title: "Correspondence and notices",
        focus: "Part 7 double passages, read for gist then for detail.",
        grammar: ["Formal request structures", "Hedging in written English"],
        vocabulary: ["pursuant", "attached", "further to", "at your earliest convenience"],
        drills: [
          { target: "Further to your message, I have attached the revised schedule.", roman: "", gloss: "Standard opening" },
        ],
        examTask: "TOEIC Part 7: cross-reference two related documents.",
      },
    ],
  },
  {
    code: "TOEIC 900",
    track: "english",
    title: "Ceiling band",
    summary:
      "The last two hundred points, which come from precision and stamina rather than new vocabulary.",
    hours: 180,
    words: 8000,
    exitCriteria:
      "Sustain above 900 across three consecutive timed papers, with no section below 440.",
    units: [
      {
        id: "en-t9-1",
        title: "Distractor discipline",
        focus: "Why strong candidates still lose points: plausible wrong answers.",
        grammar: ["Near-synonym discrimination", "Collocation over definition"],
        vocabulary: ["contingent", "provisional", "tentative", "conditional"],
        drills: [
          { target: "The offer is contingent on board approval.", roman: "", gloss: "Not 'tentative', not 'provisional'" },
        ],
        examTask: "TOEIC Part 5 under time: 30 items in 10 minutes.",
      },
      {
        id: "en-t9-2",
        title: "Accent range in listening",
        focus: "British, Australian and Canadian speakers, which sink otherwise strong candidates.",
        grammar: ["Connected speech and elision", "Intonation carrying question force"],
        vocabulary: ["rota", "cheque", "queue", "fortnight", "carpark"],
        drills: [
          { target: "Are you on the rota for the fortnight after next?", roman: "", gloss: "British workplace register" },
        ],
        examTask: "TOEIC Part 4: talks delivered in four accents.",
      },
      {
        id: "en-t9-3",
        title: "Speaking and writing extension",
        focus: "For candidates going on to TOEFL iBT or IELTS after the 900.",
        grammar: ["Opinion essay structure", "Concession before rebuttal"],
        vocabulary: ["notwithstanding", "conversely", "insofar as", "by the same token"],
        drills: [
          { target: "Notwithstanding the cost, the approach remains the more defensible one.", roman: "", gloss: "Concessive opening" },
        ],
        examTask: "TOEFL iBT independent writing: 300 words in 30 minutes.",
      },
    ],
  },
];

export const ALL_MODULES = [...HSK_MODULES, ...ENGLISH_MODULES];

export function getModule(code: string) {
  return ALL_MODULES.find(
    (module) => slugifyModule(module.code) === code.toLowerCase()
  );
}

export function slugifyModule(code: string) {
  return code.toLowerCase().replace(/\s+/g, "-");
}

export function modulesForTrack(track: string) {
  return ALL_MODULES.filter((module) => module.track === track);
}
