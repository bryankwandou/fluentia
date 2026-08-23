/**
 * Unit-level syllabus content.
 *
 * The catalogue in curriculum.ts describes the shape of a ladder. This file is
 * what a learner actually works through: units, the grammar each one turns on,
 * drill lines with numbered pinyin so the tone checker knows what to expect,
 * and the exam task each unit feeds.
 *
 * Every Mandarin line carries numbered pinyin because that is what the tone
 * scorer reads. A line without it can still be recorded, but it will be graded
 * on transcript alone, which is exactly the weakness this platform exists to
 * close. Treat missing pinyin as a content bug.
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
        grammar: ["Subject + 好", "吗 turns a statement into a yes-no question", "很 as a neutral linker before an adjective"],
        vocabulary: ["你", "好", "我", "是", "吗", "不", "谢谢", "再见", "很", "他"],
        drills: [
          { target: "你好", roman: "ni3 hao3", gloss: "Hello" },
          { target: "我很好", roman: "wo3 hen3 hao3", gloss: "I am well" },
          { target: "谢谢你", roman: "xie4 xie5 ni3", gloss: "Thank you" },
          { target: "你好吗", roman: "ni3 hao3 ma5", gloss: "How are you?" },
          { target: "他不是老师", roman: "ta1 bu4 shi4 lao3 shi1", gloss: "He is not a teacher" },
          { target: "明天见", roman: "ming2 tian1 jian4", gloss: "See you tomorrow" },
          { target: "再见", roman: "zai4 jian4", gloss: "Goodbye" },
          { target: "他很好", roman: "ta1 hen3 hao3", gloss: "He is well" },
          { target: "我不好", roman: "wo3 bu4 hao3", gloss: "I am not well" },
          { target: "你是他吗", roman: "ni3 shi4 ta1 ma5", gloss: "Are you him?" },
          { target: "老师好", roman: "lao3 shi1 hao3", gloss: "Hello, teacher" },
          { target: "我很忙", roman: "wo3 hen3 mang2", gloss: "I am busy" },
          { target: "他不忙", roman: "ta1 bu4 mang2", gloss: "He is not busy" },
          { target: "谢谢老师", roman: "xie4 xie5 lao3 shi1", gloss: "Thank you, teacher" },
        ],
        examTask: "HSK 1 listening part 1: match a spoken greeting to a picture.",
      },
      {
        id: "hsk1-u2",
        title: "Names and countries",
        focus: "Asking who someone is and where they are from.",
        grammar: ["叫 for names", "是 as the equative verb", "的 for possession", "哪 for which"],
        vocabulary: ["叫", "什么", "名字", "中国", "人", "老师", "学生", "哪", "国"],
        drills: [
          { target: "你叫什么名字", roman: "ni3 jiao4 shen2 me5 ming2 zi5", gloss: "What is your name?" },
          { target: "我是中国人", roman: "wo3 shi4 zhong1 guo2 ren2", gloss: "I am Chinese" },
          { target: "他是我的老师", roman: "ta1 shi4 wo3 de5 lao3 shi1", gloss: "He is my teacher" },
          { target: "你是哪国人", roman: "ni3 shi4 na3 guo2 ren2", gloss: "Which country are you from?" },
          { target: "我是学生", roman: "wo3 shi4 xue2 sheng5", gloss: "I am a student" },
          { target: "她的名字很好听", roman: "ta1 de5 ming2 zi5 hen3 hao3 ting1", gloss: "Her name sounds lovely" },
          { target: "我叫王明", roman: "wo3 jiao4 wang2 ming2", gloss: "My name is Wang Ming" },
          { target: "他不是学生", roman: "ta1 bu4 shi4 xue2 sheng5", gloss: "He is not a student" },
          { target: "你的老师是哪国人", roman: "ni3 de5 lao3 shi1 shi4 na3 guo2 ren2", gloss: "Which country is your teacher from?" },
          { target: "这是我的名字", roman: "zhe4 shi4 wo3 de5 ming2 zi5", gloss: "This is my name" },
          { target: "她叫什么", roman: "ta1 jiao4 shen2 me5", gloss: "What is she called?" },
          { target: "我们都是学生", roman: "wo3 men5 dou1 shi4 xue2 sheng5", gloss: "We are all students" },
          { target: "他是中国老师", roman: "ta1 shi4 zhong1 guo2 lao3 shi1", gloss: "He is a Chinese teacher" },
          { target: "你是学生吗", roman: "ni3 shi4 xue2 sheng5 ma5", gloss: "Are you a student?" },
        ],
        examTask: "HSK 1 speaking: introduce yourself in three sentences.",
      },
      {
        id: "hsk1-u3",
        title: "Numbers, dates and time",
        focus: "Counting, telling the time, and naming the day.",
        grammar: ["Measure word 个", "Time expressions precede the verb", "几 for small quantities"],
        vocabulary: ["一", "二", "三", "十", "点", "今天", "明天", "星期", "分", "月"],
        drills: [
          { target: "现在几点", roman: "xian4 zai4 ji3 dian3", gloss: "What time is it?" },
          { target: "今天星期三", roman: "jin1 tian1 xing1 qi1 san1", gloss: "Today is Wednesday" },
          { target: "我有三个朋友", roman: "wo3 you3 san1 ge4 peng2 you5", gloss: "I have three friends" },
          { target: "我八点上班", roman: "wo3 ba1 dian3 shang4 ban1", gloss: "I start work at eight" },
          { target: "明天是几号", roman: "ming2 tian1 shi4 ji3 hao4", gloss: "What is tomorrow's date?" },
          { target: "我们十二点吃饭", roman: "wo3 men5 shi2 er4 dian3 chi1 fan4", gloss: "We eat at twelve" },
          { target: "今天几月几号", roman: "jin1 tian1 ji3 yue4 ji3 hao4", gloss: "What is today's date?" },
          { target: "我有两个孩子", roman: "wo3 you3 liang3 ge4 hai2 zi5", gloss: "I have two children" },
          { target: "现在三点十分", roman: "xian4 zai4 san1 dian3 shi2 fen1", gloss: "It is ten past three" },
          { target: "明天星期几", roman: "ming2 tian1 xing1 qi1 ji3", gloss: "What day is tomorrow?" },
          { target: "我星期一工作", roman: "wo3 xing1 qi1 yi1 gong1 zuo4", gloss: "I work on Monday" },
          { target: "他七点回家", roman: "ta1 qi1 dian3 hui2 jia1", gloss: "He goes home at seven" },
          { target: "一个月有四个星期", roman: "yi2 ge4 yue4 you3 si4 ge4 xing1 qi1", gloss: "A month has four weeks" },
          { target: "今天不是星期天", roman: "jin1 tian1 bu2 shi4 xing1 qi1 tian1", gloss: "Today is not Sunday" },
        ],
        examTask: "HSK 1 reading: pick the sentence matching a written date.",
      },
      {
        id: "hsk1-u4",
        title: "Food, shops and money",
        focus: "Ordering and buying without switching to English.",
        grammar: ["想 for wanting to do something", "多少钱 for price", "太 … 了 for excess"],
        vocabulary: ["吃", "喝", "菜", "水", "买", "钱", "多少", "块", "太", "贵"],
        drills: [
          { target: "我想喝水", roman: "wo3 xiang3 he1 shui3", gloss: "I would like some water" },
          { target: "这个多少钱", roman: "zhe4 ge5 duo1 shao5 qian2", gloss: "How much is this?" },
          { target: "我不吃肉", roman: "wo3 bu4 chi1 rou4", gloss: "I do not eat meat" },
          { target: "太贵了", roman: "tai4 gui4 le5", gloss: "That is too expensive" },
          { target: "我要买两个", roman: "wo3 yao4 mai3 liang3 ge4", gloss: "I want to buy two" },
          { target: "这个菜很好吃", roman: "zhe4 ge5 cai4 hen3 hao3 chi1", gloss: "This dish is delicious" },
          { target: "我想买水果", roman: "wo3 xiang3 mai3 shui3 guo3", gloss: "I would like to buy fruit" },
          { target: "一共多少钱", roman: "yi2 gong4 duo1 shao5 qian2", gloss: "How much altogether?" },
          { target: "太多了", roman: "tai4 duo1 le5", gloss: "That is too much" },
          { target: "我不想喝茶", roman: "wo3 bu4 xiang3 he1 cha2", gloss: "I do not want tea" },
          { target: "这个不贵", roman: "zhe4 ge5 bu2 gui4", gloss: "This is not expensive" },
          { target: "十块钱", roman: "shi2 kuai4 qian2", gloss: "Ten yuan" },
          { target: "你想吃什么", roman: "ni3 xiang3 chi1 shen2 me5", gloss: "What would you like to eat?" },
          { target: "我要喝水", roman: "wo3 yao4 he1 shui3", gloss: "I want water" },
        ],
        examTask: "HSK 1 listening part 4: choose the correct reply to a shop question.",
      },
      {
        id: "hsk1-u5",
        title: "Family and home",
        focus: "Talking about the people around you, and the possessive that HSK 1 never drops.",
        grammar: ["有 for possession", "没有 as its only negation", "口 as the measure word for family members"],
        vocabulary: ["家", "爸爸", "妈妈", "儿子", "女儿", "住", "几口人", "在"],
        drills: [
          { target: "我家有四口人", roman: "wo3 jia1 you3 si4 kou3 ren2", gloss: "There are four people in my family" },
          { target: "我没有孩子", roman: "wo3 mei2 you3 hai2 zi5", gloss: "I do not have children" },
          { target: "我妈妈在医院工作", roman: "wo3 ma1 ma5 zai4 yi1 yuan4 gong1 zuo4", gloss: "My mother works at a hospital" },
          { target: "你住在哪儿", roman: "ni3 zhu4 zai4 nar3", gloss: "Where do you live?" },
          { target: "我爸爸是医生", roman: "wo3 ba4 ba5 shi4 yi1 sheng1", gloss: "My father is a doctor" },
          { target: "我的家很小", roman: "wo3 de5 jia1 hen3 xiao3", gloss: "My home is small" },
          { target: "你家有几口人", roman: "ni3 jia1 you3 ji3 kou3 ren2", gloss: "How many people are in your family?" },
          { target: "我有一个女儿", roman: "wo3 you3 yi2 ge4 nv3 er2", gloss: "I have one daughter" },
          { target: "我儿子是学生", roman: "wo3 er2 zi5 shi4 xue2 sheng5", gloss: "My son is a student" },
          { target: "我们住在北京", roman: "wo3 men5 zhu4 zai4 bei3 jing1", gloss: "We live in Beijing" },
          { target: "我妈妈不在家", roman: "wo3 ma1 ma5 bu2 zai4 jia1", gloss: "My mother is not at home" },
          { target: "他家很大", roman: "ta1 jia1 hen3 da4", gloss: "His home is big" },
          { target: "你爸爸做什么工作", roman: "ni3 ba4 ba5 zuo4 shen2 me5 gong1 zuo4", gloss: "What does your father do?" },
          { target: "我没有儿子", roman: "wo3 mei2 you3 er2 zi5", gloss: "I do not have a son" },
        ],
        examTask: "HSK 1 speaking part 2: answer three questions about your family.",
      },
      {
        id: "hsk1-u6",
        title: "Tone pairs and tone change",
        focus: "The sandhi rules that decide whether a beginner sounds Chinese or foreign.",
        grammar: ["Third tone before third tone becomes second", "不 before a fourth tone becomes second", "一 changes with what follows"],
        vocabulary: ["很好", "你好", "不是", "不对", "一个", "一起", "水果", "老板"],
        drills: [
          { target: "你好", roman: "ni2 hao3", gloss: "Third-third: the first syllable rises" },
          { target: "我很好", roman: "wo2 hen2 hao3", gloss: "Three third tones in a row" },
          { target: "不对", roman: "bu2 dui4", gloss: "不 rises before a falling tone" },
          { target: "不好", roman: "bu4 hao3", gloss: "不 stays falling before a third tone" },
          { target: "一起走", roman: "yi4 qi3 zou3", gloss: "一 falls before a third tone" },
          { target: "买水果", roman: "mai2 shui2 guo3", gloss: "A full third-tone chain" },
          { target: "很好", roman: "hen2 hao3", gloss: "Third-third again, in the commonest pair of all" },
          { target: "老板", roman: "lao2 ban3", gloss: "Third-third inside a single word" },
          { target: "不是", roman: "bu2 shi4", gloss: "不 rises before 是, which is falling" },
          { target: "不吃", roman: "bu4 chi1", gloss: "不 keeps its fall before a first tone" },
          { target: "一个", roman: "yi2 ge4", gloss: "一 rises before a falling tone" },
          { target: "一天", roman: "yi4 tian1", gloss: "一 falls before a first tone" },
          { target: "我也很好", roman: "wo2 ye2 hen2 hao3", gloss: "Four third tones: only the last keeps its dip" },
          { target: "请你给我", roman: "qing2 ni2 gei2 wo3", gloss: "A four-syllable sandhi chain to finish on" },
        ],
        examTask: "HSK 1 speaking part 1: repeat sandhi pairs after the examiner.",
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
        vocabulary: ["了", "过", "已经", "昨天", "去年", "开始", "结束"],
        drills: [
          { target: "我吃了饭", roman: "wo3 chi1 le5 fan4", gloss: "I have eaten" },
          { target: "我去过北京", roman: "wo3 qu4 guo4 bei3 jing1", gloss: "I have been to Beijing" },
          { target: "他还没来", roman: "ta1 hai2 mei2 lai2", gloss: "He has not come yet" },
          { target: "会议已经开始了", roman: "hui4 yi4 yi3 jing1 kai1 shi3 le5", gloss: "The meeting has already started" },
          { target: "你吃过中国菜吗", roman: "ni3 chi1 guo4 zhong1 guo2 cai4 ma5", gloss: "Have you ever eaten Chinese food?" },
          { target: "我昨天买了一本书", roman: "wo3 zuo2 tian1 mai3 le5 yi4 ben3 shu1", gloss: "I bought a book yesterday" },
        ],
        examTask: "HSK 2 reading: order four events into a sequence.",
      },
      {
        id: "hsk2-u2",
        title: "Getting around",
        focus: "Directions, transport, and distance.",
        grammar: ["坐 + transport", "从 … 到 … for routes", "离 for distance"],
        vocabulary: ["坐", "地铁", "公共汽车", "左", "右", "远", "近", "路", "站"],
        drills: [
          { target: "我坐地铁去公司", roman: "wo3 zuo4 di4 tie3 qu4 gong1 si1", gloss: "I take the subway to the office" },
          { target: "从这儿到火车站很远", roman: "cong2 zher4 dao4 huo3 che1 zhan4 hen3 yuan3", gloss: "It is far from here to the station" },
          { target: "请问地铁站在哪儿", roman: "qing3 wen4 di4 tie3 zhan4 zai4 nar3", gloss: "Excuse me, where is the subway station?" },
          { target: "一直走然后往左拐", roman: "yi4 zhi2 zou3 ran2 hou4 wang3 zuo3 guai3", gloss: "Go straight then turn left" },
          { target: "我家离公司很近", roman: "wo3 jia1 li2 gong1 si1 hen3 jin4", gloss: "My home is close to the office" },
          { target: "坐几路车", roman: "zuo4 ji3 lu4 che1", gloss: "Which bus should I take?" },
        ],
        examTask: "HSK 2 listening: follow a spoken route and name the destination.",
      },
      {
        id: "hsk2-u3",
        title: "Comparing things",
        focus: "比 constructions, including the negative form learners avoid.",
        grammar: ["A 比 B + adjective", "没有 for the negative comparison", "一样 for equality", "更 and 最 for degree"],
        vocabulary: ["比", "一样", "更", "最", "便宜", "贵", "快", "慢"],
        drills: [
          { target: "这个比那个便宜", roman: "zhe4 ge5 bi3 na4 ge5 pian2 yi5", gloss: "This is cheaper than that" },
          { target: "他没有我高", roman: "ta1 mei2 you3 wo3 gao1", gloss: "He is not as tall as me" },
          { target: "坐飞机比坐火车快", roman: "zuo4 fei1 ji1 bi3 zuo4 huo3 che1 kuai4", gloss: "Flying is faster than the train" },
          { target: "今天和昨天一样冷", roman: "jin1 tian1 he2 zuo2 tian1 yi2 yang4 leng3", gloss: "Today is as cold as yesterday" },
          { target: "这是最好的选择", roman: "zhe4 shi4 zui4 hao3 de5 xuan3 ze2", gloss: "This is the best option" },
          { target: "他比我更努力", roman: "ta1 bi3 wo3 geng4 nu3 li4", gloss: "He works even harder than I do" },
        ],
        examTask: "HSK 2 writing: complete a comparison from a prompt.",
      },
      {
        id: "hsk2-u4",
        title: "Weather, health and the body",
        focus: "The two topics every beginner needs before their first trip goes wrong.",
        grammar: ["要 … 了 for an imminent change", "觉得 for how you feel", "得 for obligation"],
        vocabulary: ["天气", "冷", "热", "下雨", "生病", "医院", "药", "累", "舒服"],
        drills: [
          { target: "今天天气很好", roman: "jin1 tian1 tian1 qi4 hen3 hao3", gloss: "The weather is good today" },
          { target: "要下雨了", roman: "yao4 xia4 yu3 le5", gloss: "It is about to rain" },
          { target: "我有点儿不舒服", roman: "wo3 you3 dianr3 bu4 shu1 fu5", gloss: "I feel a little unwell" },
          { target: "你得去医院", roman: "ni3 dei3 qu4 yi1 yuan4", gloss: "You need to go to the hospital" },
          { target: "我觉得很累", roman: "wo3 jue2 de5 hen3 lei4", gloss: "I feel very tired" },
          { target: "记得吃药", roman: "ji4 de5 chi1 yao4", gloss: "Remember to take your medicine" },
        ],
        examTask: "HSK 2 listening part 2: pick the reply that fits a complaint.",
      },
      {
        id: "hsk2-u5",
        title: "Ongoing and repeated action",
        focus: "在 and 着, which learners collapse into one and then misuse both.",
        grammar: ["正在 + verb for action in progress", "V + 着 for a sustained state", "一边 … 一边 … for simultaneity"],
        vocabulary: ["正在", "着", "一边", "然后", "常常", "有时候", "总是"],
        drills: [
          { target: "他正在打电话", roman: "ta1 zheng4 zai4 da3 dian4 hua4", gloss: "He is on the phone right now" },
          { target: "门开着", roman: "men2 kai1 zhe5", gloss: "The door is standing open" },
          { target: "我一边吃饭一边看电视", roman: "wo3 yi4 bian1 chi1 fan4 yi4 bian1 kan4 dian4 shi4", gloss: "I eat and watch TV at the same time" },
          { target: "我常常去那家店", roman: "wo3 chang2 chang2 qu4 na4 jia1 dian4", gloss: "I often go to that shop" },
          { target: "他总是迟到", roman: "ta1 zong3 shi4 chi2 dao4", gloss: "He is always late" },
          { target: "她笑着说谢谢", roman: "ta1 xiao4 zhe5 shuo1 xie4 xie5", gloss: "She said thank you with a smile" },
        ],
        examTask: "HSK 2 reading part 3: choose the sentence describing a picture in progress.",
      },
      {
        id: "hsk2-u6",
        title: "Asking for help politely",
        focus: "The register step from blunt beginner Chinese to something an adult can use.",
        grammar: ["请 + verb", "可以 for permission", "能 for capability", "一下 to soften a request"],
        vocabulary: ["请", "可以", "能", "帮", "一下", "麻烦", "没关系", "对不起"],
        drills: [
          { target: "请帮我一下", roman: "qing3 bang1 wo3 yi2 xia4", gloss: "Please give me a hand" },
          { target: "我可以问一个问题吗", roman: "wo3 ke3 yi3 wen4 yi2 ge4 wen4 ti2 ma5", gloss: "May I ask a question?" },
          { target: "对不起我来晚了", roman: "dui4 bu5 qi3 wo3 lai2 wan3 le5", gloss: "Sorry I am late" },
          { target: "没关系别客气", roman: "mei2 guan1 xi5 bie2 ke4 qi5", gloss: "It is fine, no need to be formal" },
          { target: "你能再说一遍吗", roman: "ni3 neng2 zai4 shuo1 yi2 bian4 ma5", gloss: "Could you say that again?" },
          { target: "麻烦你等一下", roman: "ma2 fan5 ni3 deng3 yi2 xia4", gloss: "Sorry to trouble you, please wait a moment" },
        ],
        examTask: "HSK 2 speaking: make three requests at increasing politeness.",
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
        vocabulary: ["得", "完", "错", "清楚", "流利", "认真", "懂"],
        drills: [
          { target: "他说得很流利", roman: "ta1 shuo1 de5 hen3 liu2 li4", gloss: "He speaks very fluently" },
          { target: "我没听清楚", roman: "wo3 mei2 ting1 qing1 chu5", gloss: "I did not hear that clearly" },
          { target: "我把作业做完了", roman: "wo3 ba3 zuo4 ye4 zuo4 wan2 le5", gloss: "I finished the homework" },
          { target: "你写错了一个字", roman: "ni3 xie3 cuo4 le5 yi2 ge4 zi4", gloss: "You wrote one character wrong" },
          { target: "这本书我看不懂", roman: "zhe4 ben3 shu1 wo3 kan4 bu5 dong3", gloss: "I cannot make sense of this book" },
          { target: "他跑得比我快", roman: "ta1 pao3 de5 bi3 wo3 kuai4", gloss: "He runs faster than I do" },
        ],
        examTask: "HSK 3 speaking: describe a photograph in five sentences.",
      },
      {
        id: "hsk3-u2",
        title: "The 把 construction",
        focus: "Moving the object forward when something is done to it.",
        grammar: ["把 + object + verb + complement", "被 for the passive", "把 requires a result, never a bare verb"],
        vocabulary: ["把", "被", "放", "拿", "搬", "忘", "关"],
        drills: [
          { target: "请把门关上", roman: "qing3 ba3 men2 guan1 shang4", gloss: "Please close the door" },
          { target: "我把钱包忘在家里了", roman: "wo3 ba3 qian2 bao1 wang4 zai4 jia1 li3 le5", gloss: "I left my wallet at home" },
          { target: "他把桌子搬到楼上了", roman: "ta1 ba3 zhuo1 zi5 ban1 dao4 lou2 shang4 le5", gloss: "He carried the table upstairs" },
          { target: "我的手机被偷了", roman: "wo3 de5 shou3 ji1 bei4 tou1 le5", gloss: "My phone was stolen" },
          { target: "请把这些资料发给他", roman: "qing3 ba3 zhe4 xie1 zi1 liao4 fa1 gei3 ta1", gloss: "Please send him these materials" },
          { target: "她把电脑修好了", roman: "ta1 ba3 dian4 nao3 xiu1 hao3 le5", gloss: "She fixed the computer" },
        ],
        examTask: "HSK 3 writing: rewrite a sentence using 把.",
      },
      {
        id: "hsk3-u3",
        title: "Reasons and conditions",
        focus: "Linking clauses so an argument holds together.",
        grammar: ["因为 … 所以 …", "虽然 … 但是 …", "如果 … 就 …", "只要 … 就 …"],
        vocabulary: ["因为", "所以", "虽然", "但是", "如果", "就", "才", "只要"],
        drills: [
          { target: "因为下雨所以我没去", roman: "yin1 wei4 xia4 yu3 suo3 yi3 wo3 mei2 qu4", gloss: "I did not go because it rained" },
          { target: "如果你有时间就来吧", roman: "ru2 guo3 ni3 you3 shi2 jian1 jiu4 lai2 ba5", gloss: "Come along if you have time" },
          { target: "虽然很难但是很有意思", roman: "sui1 ran2 hen3 nan2 dan4 shi4 hen3 you3 yi4 si5", gloss: "It is hard but interesting" },
          { target: "只要你努力就会进步", roman: "zhi3 yao4 ni3 nu3 li4 jiu4 hui4 jin4 bu4", gloss: "As long as you work, you will improve" },
          { target: "他八点才到", roman: "ta1 ba1 dian3 cai2 dao4", gloss: "He did not arrive until eight" },
          { target: "为了健康我每天跑步", roman: "wei4 le5 jian4 kang1 wo3 mei3 tian1 pao3 bu4", gloss: "I run daily for my health" },
        ],
        examTask: "HSK 3 reading: choose the connector that fits the gap.",
      },
      {
        id: "hsk3-u4",
        title: "Travel and accommodation",
        focus: "The scripted exchanges that go wrong first when something is delayed.",
        grammar: ["先 … 再 … for sequence", "还是 in questions offering a choice", "只好 for a forced fallback"],
        vocabulary: ["预订", "护照", "航班", "退", "换", "行李", "耽误", "登记"],
        drills: [
          { target: "我预订了一个房间", roman: "wo3 yu4 ding4 le5 yi2 ge4 fang2 jian1", gloss: "I have booked a room" },
          { target: "航班晚点了两个小时", roman: "hang2 ban1 wan3 dian3 le5 liang3 ge4 xiao3 shi2", gloss: "The flight is two hours late" },
          { target: "我想换一个安静的房间", roman: "wo3 xiang3 huan4 yi2 ge4 an1 jing4 de5 fang2 jian1", gloss: "I would like to change to a quiet room" },
          { target: "你先登记再上楼", roman: "ni3 xian1 deng1 ji4 zai4 shang4 lou2", gloss: "Check in first, then go up" },
          { target: "只好等下一班", roman: "zhi3 hao3 deng3 xia4 yi4 ban1", gloss: "There is nothing for it but to wait for the next one" },
          { target: "我的行李还没到", roman: "wo3 de5 xing2 li5 hai2 mei2 dao4", gloss: "My luggage has not arrived yet" },
        ],
        examTask: "HSK 3 listening part 3: answer questions on a service counter dialogue.",
      },
      {
        id: "hsk3-u5",
        title: "Direction complements",
        focus: "上来, 下去, 出来 — the layer that makes speech sound native rather than assembled.",
        grammar: ["Simple direction complements 来 / 去", "Compound complements 起来 / 下去 / 出来", "起来 in its figurative sense"],
        vocabulary: ["起来", "下去", "出来", "进去", "回来", "过来", "看起来"],
        drills: [
          { target: "他走进来了", roman: "ta1 zou3 jin4 lai2 le5", gloss: "He walked in" },
          { target: "请你过来一下", roman: "qing3 ni3 guo4 lai2 yi2 xia4", gloss: "Please come over here" },
          { target: "这个问题看起来很简单", roman: "zhe4 ge5 wen4 ti2 kan4 qi3 lai2 hen3 jian3 dan1", gloss: "This problem looks simple" },
          { target: "我们说下去吧", roman: "wo3 men5 shuo1 xia4 qu4 ba5", gloss: "Let us keep talking" },
          { target: "他把名字写出来了", roman: "ta1 ba3 ming2 zi5 xie3 chu1 lai2 le5", gloss: "He wrote the name out" },
          { target: "我想起来了", roman: "wo3 xiang3 qi3 lai2 le5", gloss: "It has come back to me" },
        ],
        examTask: "HSK 3 reading part 2: fill the correct complement into a gap.",
      },
      {
        id: "hsk3-u6",
        title: "Holding an opinion for a minute",
        focus: "Sustained speech, which is the actual HSK 3 speaking bar.",
        grammar: ["我觉得 … 因为 …", "对 … 来说 for framing", "一方面 … 另一方面 …"],
        vocabulary: ["觉得", "认为", "同意", "反对", "其实", "比如", "总的来说"],
        drills: [
          { target: "我觉得这个办法更好", roman: "wo3 jue2 de5 zhe4 ge5 ban4 fa3 geng4 hao3", gloss: "I think this approach is better" },
          { target: "对我来说时间最重要", roman: "dui4 wo3 lai2 shuo1 shi2 jian1 zui4 zhong4 yao4", gloss: "For me, time matters most" },
          { target: "其实我不太同意", roman: "qi2 shi2 wo3 bu2 tai4 tong2 yi4", gloss: "Actually I do not quite agree" },
          { target: "比如说上个月的会议", roman: "bi3 ru2 shuo1 shang4 ge4 yue4 de5 hui4 yi4", gloss: "Take last month's meeting for instance" },
          { target: "一方面便宜另一方面很快", roman: "yi4 fang1 mian4 pian2 yi5 ling4 yi4 fang1 mian4 hen3 kuai4", gloss: "On one hand cheap, on the other fast" },
          { target: "总的来说我支持这个计划", roman: "zong3 de5 lai2 shuo1 wo3 zhi1 chi2 zhe4 ge5 ji4 hua4", gloss: "On the whole I support this plan" },
        ],
        examTask: "HSK 3 speaking part 3: speak for sixty seconds on a given topic.",
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
        vocabulary: ["麻烦", "安排", "负责", "会议", "同事", "计划", "任务", "汇报"],
        drills: [
          { target: "麻烦你把报告发给我", roman: "ma2 fan5 ni3 ba3 bao4 gao4 fa1 gei3 wo3", gloss: "Could you send me the report" },
          { target: "恐怕我今天来不了", roman: "kong3 pa4 wo3 jin1 tian1 lai2 bu5 liao3", gloss: "I am afraid I cannot make it today" },
          { target: "这个项目由我负责", roman: "zhe4 ge5 xiang4 mu4 you2 wo3 fu4 ze2", gloss: "I am responsible for this project" },
          { target: "能不能把会议改到下午", roman: "neng2 bu5 neng2 ba3 hui4 yi4 gai3 dao4 xia4 wu3", gloss: "Could the meeting move to the afternoon?" },
          { target: "我先跟同事商量一下", roman: "wo3 xian1 gen1 tong2 shi4 shang1 liang5 yi2 xia4", gloss: "Let me discuss it with my colleagues first" },
          { target: "请您过目", roman: "qing3 nin2 guo4 mu4", gloss: "Please take a look (formal)" },
        ],
        examTask: "HSK 4 writing part 2: compose an email from three keywords.",
      },
      {
        id: "hsk4-u2",
        title: "Cause, effect and consequence",
        focus: "Building a paragraph rather than a chain of short sentences.",
        grammar: ["不但 … 而且 …", "既然 … 就 …", "无论 … 都 …", "之所以 … 是因为 …"],
        vocabulary: ["不但", "而且", "既然", "无论", "影响", "结果", "原因", "导致"],
        drills: [
          { target: "无论多忙我都会去", roman: "wu2 lun4 duo1 mang2 wo3 dou1 hui4 qu4", gloss: "However busy I am, I will go" },
          { target: "他不但会说而且写得很好", roman: "ta1 bu2 dan4 hui4 shuo1 er2 qie3 xie3 de5 hen3 hao3", gloss: "He not only speaks it but writes it well" },
          { target: "既然决定了就别后悔", roman: "ji4 ran2 jue2 ding4 le5 jiu4 bie2 hou4 hui3", gloss: "Since it is decided, do not regret it" },
          { target: "这件事影响了整个计划", roman: "zhe4 jian4 shi4 ying3 xiang3 le5 zheng3 ge4 ji4 hua4", gloss: "This affected the whole plan" },
          { target: "之所以失败是因为准备不足", roman: "zhi1 suo3 yi3 shi1 bai4 shi4 yin1 wei4 zhun3 bei4 bu4 zu2", gloss: "It failed because preparation was thin" },
          { target: "价格上涨导致销量下降", roman: "jia4 ge2 shang4 zhang3 dao3 zhi4 xiao1 liang4 xia4 jiang4", gloss: "The price rise drove sales down" },
        ],
        examTask: "HSK 4 reading part 3: identify the writer's main claim.",
      },
      {
        id: "hsk4-u3",
        title: "Idiom and set phrase",
        focus: "The first four-character expressions, used correctly rather than decoratively.",
        grammar: ["Four-character 成语 in a sentence frame", "成语 as predicate versus as modifier"],
        vocabulary: ["马马虎虎", "自言自语", "乱七八糟", "不可思议", "一举两得", "半途而废"],
        drills: [
          { target: "他的中文马马虎虎", roman: "ta1 de5 zhong1 wen2 ma3 ma3 hu1 hu1", gloss: "His Chinese is so-so" },
          { target: "房间里乱七八糟", roman: "fang2 jian1 li3 luan4 qi1 ba1 zao1", gloss: "The room is a complete mess" },
          { target: "这样做一举两得", roman: "zhe4 yang4 zuo4 yi4 ju3 liang3 de2", gloss: "Doing it this way kills two birds with one stone" },
          { target: "别半途而废", roman: "bie2 ban4 tu2 er2 fei4", gloss: "Do not give up halfway" },
          { target: "这个结果不可思议", roman: "zhe4 ge5 jie2 guo3 bu4 ke3 si1 yi4", gloss: "The result is unbelievable" },
          { target: "他一个人自言自语", roman: "ta1 yi2 ge4 ren2 zi4 yan2 zi4 yu3", gloss: "He was muttering to himself" },
        ],
        examTask: "HSK 4 listening part 2: infer the speaker's attitude.",
      },
      {
        id: "hsk4-u4",
        title: "Numbers that carry meaning",
        focus: "Percentages, growth and scale — the sentences that fill every HSK 4 reading text.",
        grammar: ["百分之 for percentages", "增加 / 减少 + 了 versus + 到", "倍 for multiples"],
        vocabulary: ["增加", "减少", "百分之", "倍", "平均", "左右", "大约", "统计"],
        drills: [
          { target: "销量增加了百分之二十", roman: "xiao1 liang4 zeng1 jia1 le5 bai3 fen1 zhi1 er4 shi2", gloss: "Sales rose by twenty percent" },
          { target: "价格是去年的两倍", roman: "jia4 ge2 shi4 qu4 nian2 de5 liang3 bei4", gloss: "The price is double last year's" },
          { target: "平均每天工作八小时", roman: "ping2 jun1 mei3 tian1 gong1 zuo4 ba1 xiao3 shi2", gloss: "On average, eight hours a day" },
          { target: "大约三十人参加了", roman: "da4 yue1 san1 shi2 ren2 can1 jia1 le5", gloss: "About thirty people took part" },
          { target: "费用减少到一半", roman: "fei4 yong4 jian3 shao3 dao4 yi2 ban4", gloss: "Costs fell to half" },
          { target: "根据统计结果很明显", roman: "gen1 ju4 tong3 ji4 jie2 guo3 hen3 ming2 xian3", gloss: "By the figures the result is clear" },
        ],
        examTask: "HSK 4 reading part 2: place figures correctly into a report.",
      },
      {
        id: "hsk4-u5",
        title: "Disagreeing without damage",
        focus: "The social layer HSK textbooks skip and real workplaces punish.",
        grammar: ["我理解 … 不过 …", "是不是可以考虑 …", "不见得 for gentle doubt"],
        vocabulary: ["理解", "不过", "考虑", "建议", "补充", "不见得", "换句话说"],
        drills: [
          { target: "我理解你的想法不过还有别的可能", roman: "wo3 li3 jie3 ni3 de5 xiang3 fa3 bu2 guo4 hai2 you3 bie2 de5 ke3 neng2", gloss: "I see your thinking, but there are other possibilities" },
          { target: "是不是可以考虑另一个方案", roman: "shi4 bu5 shi4 ke3 yi3 kao3 lv4 ling4 yi2 ge4 fang1 an4", gloss: "Might we consider another option?" },
          { target: "我想补充一点", roman: "wo3 xiang3 bu3 chong1 yi4 dian3", gloss: "I would like to add one thing" },
          { target: "这个结论不见得正确", roman: "zhe4 ge5 jie2 lun4 bu2 jian4 de5 zheng4 que4", gloss: "That conclusion is not necessarily right" },
          { target: "换句话说我们需要更多时间", roman: "huan4 ju4 hua4 shuo1 wo3 men5 xu1 yao4 geng4 duo1 shi2 jian1", gloss: "In other words we need more time" },
          { target: "我的建议是先做小规模测试", roman: "wo3 de5 jian4 yi4 shi4 xian1 zuo4 xiao3 gui1 mo2 ce4 shi4", gloss: "My suggestion is to test small first" },
        ],
        examTask: "HSK 4 speaking: respond to a proposal you partly disagree with.",
      },
      {
        id: "hsk4-u6",
        title: "Narrating at length",
        focus: "Telling a story with a beginning, a turn and an end.",
        grammar: ["原来 for a revealed cause", "结果 for an unexpected outcome", "后来 for the later stage"],
        vocabulary: ["原来", "后来", "结果", "突然", "居然", "终于", "于是"],
        drills: [
          { target: "原来他早就知道了", roman: "yuan2 lai2 ta1 zao3 jiu4 zhi1 dao5 le5", gloss: "It turned out he had known all along" },
          { target: "后来我们决定放弃", roman: "hou4 lai2 wo3 men5 jue2 ding4 fang4 qi4", gloss: "Later we decided to drop it" },
          { target: "他居然一句话也没说", roman: "ta1 ju1 ran2 yi2 ju4 hua4 ye3 mei2 shuo1", gloss: "Astonishingly he said nothing at all" },
          { target: "突然停电了", roman: "tu1 ran2 ting2 dian4 le5", gloss: "The power suddenly went out" },
          { target: "于是我们换了个办法", roman: "yu2 shi4 wo3 men5 huan4 le5 ge4 ban4 fa3", gloss: "So we switched approach" },
          { target: "终于解决了这个问题", roman: "zhong1 yu2 jie3 jue2 le5 zhe4 ge5 wen4 ti2", gloss: "The problem was finally solved" },
        ],
        examTask: "HSK 4 writing part 1: build a full narrative from scrambled clauses.",
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
        vocabulary: ["予以", "加以", "从而", "以及", "鉴于", "针对", "所"],
        drills: [
          { target: "这个问题需要加以解决", roman: "zhe4 ge5 wen4 ti2 xu1 yao4 jia1 yi3 jie3 jue2", gloss: "This problem needs to be addressed" },
          { target: "鉴于目前的情况会议推迟", roman: "jian4 yu2 mu4 qian2 de5 qing2 kuang4 hui4 yi4 tui1 chi2", gloss: "In view of the situation the meeting is postponed" },
          { target: "针对这一现象展开了调查", roman: "zhen1 dui4 zhe4 yi4 xian4 xiang4 zhan3 kai1 le5 diao4 cha2", gloss: "An inquiry was opened into this phenomenon" },
          { target: "他所说的话值得重视", roman: "ta1 suo3 shuo1 de5 hua4 zhi2 de5 zhong4 shi4", gloss: "What he said deserves attention" },
          { target: "从而提高了整体效率", roman: "cong2 er2 ti2 gao1 le5 zheng3 ti3 xiao4 lv4", gloss: "And thereby raised overall efficiency" },
          { target: "该政策已予以调整", roman: "gai1 zheng4 ce4 yi3 yu3 yi3 tiao2 zheng3", gloss: "The policy has been adjusted" },
        ],
        examTask: "HSK 5 reading part 2: fill formal connectors into a news paragraph.",
      },
      {
        id: "hsk5-u2",
        title: "Argument and rebuttal",
        focus: "Disagreeing without sounding either rude or evasive.",
        grammar: ["与其 … 不如 …", "宁可 … 也不 …", "并非 for emphatic negation", "固然 … 但 …"],
        vocabulary: ["与其", "不如", "宁可", "并非", "反而", "未必", "固然"],
        drills: [
          { target: "与其等待不如现在开始", roman: "yu3 qi2 deng3 dai4 bu4 ru2 xian4 zai4 kai1 shi3", gloss: "Rather than wait, better to start now" },
          { target: "宁可慢一点也不能出错", roman: "ning4 ke3 man4 yi4 dian3 ye3 bu4 neng2 chu1 cuo4", gloss: "Better slow than wrong" },
          { target: "这并非唯一的解释", roman: "zhe4 bing4 fei1 wei2 yi1 de5 jie3 shi4", gloss: "This is by no means the only reading" },
          { target: "他的批评固然尖锐但很有道理", roman: "ta1 de5 pi1 ping2 gu4 ran2 jian1 rui4 dan4 hen3 you3 dao4 li3", gloss: "His criticism is sharp, admittedly, but sound" },
          { target: "结果反而更糟", roman: "jie2 guo3 fan3 er2 geng4 zao1", gloss: "The outcome was worse instead" },
          { target: "数据未必支持这个结论", roman: "shu4 ju4 wei4 bi4 zhi1 chi2 zhe4 ge5 jie2 lun4", gloss: "The data does not necessarily support that" },
        ],
        examTask: "HSK 5 writing: 80 character argued response to a prompt.",
      },
      {
        id: "hsk5-u3",
        title: "News and reported speech",
        focus: "Reading a wire story and knowing who claimed what.",
        grammar: ["据 … 报道 / 称", "表示 and 指出 as reporting verbs", "有关 / 相关 as attributive"],
        vocabulary: ["据", "报道", "表示", "指出", "相关", "分析", "预计", "透露"],
        drills: [
          { target: "据报道该公司将扩大生产", roman: "ju4 bao4 dao4 gai1 gong1 si1 jiang1 kuo4 da4 sheng1 chan3", gloss: "The company is reported to be expanding output" },
          { target: "发言人表示不予评论", roman: "fa1 yan2 ren2 biao3 shi4 bu4 yu3 ping2 lun4", gloss: "The spokesman declined to comment" },
          { target: "分析人士指出风险仍然存在", roman: "fen1 xi1 ren2 shi4 zhi3 chu1 feng1 xian3 reng2 ran2 cun2 zai4", gloss: "Analysts note the risk remains" },
          { target: "预计明年将有所回升", roman: "yu4 ji4 ming2 nian2 jiang1 you3 suo3 hui2 sheng1", gloss: "A recovery is expected next year" },
          { target: "相关部门已介入调查", roman: "xiang1 guan1 bu4 men2 yi3 jie4 ru4 diao4 cha2", gloss: "The relevant authorities have opened an inquiry" },
          { target: "内部人士透露了细节", roman: "nei4 bu4 ren2 shi4 tou4 lu4 le5 xi4 jie2", gloss: "An insider disclosed the details" },
        ],
        examTask: "HSK 5 reading part 3: attribute three claims to the right source.",
      },
      {
        id: "hsk5-u4",
        title: "Film and rapid dialogue",
        focus: "Colloquial speech at full speed, where the words are easy and the delivery is not.",
        grammar: ["Sentence-final particles carrying attitude", "Ellipsis of subject and object", "Rhetorical questions as statements"],
        vocabulary: ["算了", "别提了", "至于吗", "得了吧", "凭什么", "无所谓"],
        drills: [
          { target: "算了别说了", roman: "suan4 le5 bie2 shuo1 le5", gloss: "Forget it, drop the subject" },
          { target: "你至于吗", roman: "ni3 zhi4 yu2 ma5", gloss: "Is that really necessary?" },
          { target: "得了吧我不信", roman: "de2 le5 ba5 wo3 bu2 xin4", gloss: "Come off it, I do not buy that" },
          { target: "我无所谓你决定吧", roman: "wo3 wu2 suo3 wei4 ni3 jue2 ding4 ba5", gloss: "I do not mind, you decide" },
          { target: "凭什么怪我", roman: "ping2 shen2 me5 guai4 wo3", gloss: "On what grounds is this my fault?" },
          { target: "别提了太累了", roman: "bie2 ti2 le5 tai4 lei4 le5", gloss: "Do not even ask, I am exhausted" },
        ],
        examTask: "HSK 5 listening part 2: infer the relationship between two speakers.",
      },
      {
        id: "hsk5-u5",
        title: "Abstract nouns and definition",
        focus: "Talking about concepts rather than things, which is the HSK 5 vocabulary jump.",
        grammar: ["所谓 … 指的是 …", "在于 for locating an essence", "具有 versus 有"],
        vocabulary: ["概念", "本质", "前提", "标准", "在于", "具有", "所谓", "范围"],
        drills: [
          { target: "所谓效率指的是投入和产出的比例", roman: "suo3 wei4 xiao4 lv4 zhi3 de5 shi4 tou2 ru4 he2 chan3 chu1 de5 bi3 li4", gloss: "Efficiency means the ratio of input to output" },
          { target: "问题的关键在于时间", roman: "wen4 ti2 de5 guan1 jian4 zai4 yu2 shi2 jian1", gloss: "The crux of it is time" },
          { target: "这项技术具有很大的潜力", roman: "zhe4 xiang4 ji4 shu4 ju4 you3 hen3 da4 de5 qian2 li4", gloss: "This technology has real potential" },
          { target: "讨论必须有一个前提", roman: "tao3 lun4 bi4 xu1 you3 yi2 ge4 qian2 ti2", gloss: "Any discussion needs a premise" },
          { target: "评价标准并不统一", roman: "ping2 jia4 biao1 zhun3 bing4 bu4 tong3 yi1", gloss: "The criteria are not consistent" },
          { target: "超出了我们的研究范围", roman: "chao1 chu1 le5 wo3 men5 de5 yan2 jiu1 fan4 wei2", gloss: "That falls outside our scope" },
        ],
        examTask: "HSK 5 reading part 1: replace an abstract term with its closest synonym.",
      },
      {
        id: "hsk5-u6",
        title: "Summarising a long text",
        focus: "Compression, drilled before HSK 6 makes it the whole exam.",
        grammar: ["概括 versus 复述", "Dropping example detail while keeping the claim", "Turning dialogue into reported prose"],
        vocabulary: ["概括", "重点", "主旨", "简言之", "综上所述", "核心"],
        drills: [
          { target: "简言之他反对这个方案", roman: "jian3 yan2 zhi1 ta1 fan3 dui4 zhe4 ge5 fang1 an4", gloss: "In short, he opposes the plan" },
          { target: "文章的主旨是环境保护", roman: "wen2 zhang1 de5 zhu3 zhi3 shi4 huan2 jing4 bao3 hu4", gloss: "The article is about environmental protection" },
          { target: "综上所述结论是明确的", roman: "zong1 shang4 suo3 shu4 jie2 lun4 shi4 ming2 que4 de5", gloss: "Taking the above together, the conclusion is clear" },
          { target: "请抓住核心内容", roman: "qing3 zhua1 zhu4 he2 xin1 nei4 rong2", gloss: "Hold on to the core content" },
          { target: "细节可以略去", roman: "xi4 jie2 ke3 yi3 lve4 qu4", gloss: "The detail can be dropped" },
          { target: "这一段的重点是原因", roman: "zhe4 yi2 duan4 de5 zhong4 dian3 shi4 yuan2 yin1", gloss: "This paragraph is about causes" },
        ],
        examTask: "HSK 5 writing part 2: reduce a 400 character passage to 100 characters.",
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
        vocabulary: ["画蛇添足", "因地制宜", "不言而喻", "潜移默化", "众所周知", "一针见血"],
        drills: [
          { target: "这种影响是潜移默化的", roman: "zhe4 zhong3 ying3 xiang3 shi4 qian2 yi2 mo4 hua4 de5", gloss: "That kind of influence works imperceptibly" },
          { target: "众所周知这并不容易", roman: "zhong4 suo3 zhou1 zhi1 zhe4 bing4 bu4 rong2 yi4", gloss: "As everyone knows, this is not easy" },
          { target: "他的批评一针见血", roman: "ta1 de5 pi1 ping2 yi4 zhen1 jian4 xie3", gloss: "His criticism went straight to the point" },
          { target: "再解释就是画蛇添足了", roman: "zai4 jie3 shi4 jiu4 shi4 hua4 she2 tian1 zu2 le5", gloss: "Further explanation would be gilding the lily" },
          { target: "政策应当因地制宜", roman: "zheng4 ce4 ying1 dang1 yin1 di4 zhi4 yi2", gloss: "Policy should suit local conditions" },
          { target: "其中的道理不言而喻", roman: "qi2 zhong1 de5 dao4 li3 bu4 yan2 er2 yu4", gloss: "The reasoning goes without saying" },
        ],
        examTask: "HSK 6 reading part 1: spot the sentence containing an error.",
      },
      {
        id: "hsk6-u2",
        title: "Summary writing under time",
        focus: "The task that decides most HSK 6 results.",
        grammar: ["Compression strategies", "Reported speech in written register"],
        vocabulary: ["概括", "归纳", "阐述", "论证", "剖析", "梳理"],
        drills: [
          { target: "请概括这篇文章的主要观点", roman: "qing3 gai4 kuo4 zhe4 pian1 wen2 zhang1 de5 zhu3 yao4 guan1 dian3", gloss: "Summarise the article's main argument" },
          { target: "作者进一步阐述了这一观点", roman: "zuo4 zhe3 jin4 yi2 bu4 chan3 shu4 le5 zhe4 yi4 guan1 dian3", gloss: "The author develops this point further" },
          { target: "文章论证了两者的关系", roman: "wen2 zhang1 lun4 zheng4 le5 liang3 zhe3 de5 guan1 xi5", gloss: "The piece argues for a link between the two" },
          { target: "先梳理脉络再动笔", roman: "xian1 shu1 li3 mai4 luo4 zai4 dong4 bi3", gloss: "Map the thread before you start writing" },
          { target: "归纳起来有三个原因", roman: "gui1 na4 qi3 lai2 you3 san1 ge4 yuan2 yin1", gloss: "Boiled down, there are three reasons" },
          { target: "这段剖析得相当深入", roman: "zhe4 duan4 pou1 xi1 de5 xiang1 dang1 shen1 ru4", gloss: "This passage dissects it thoroughly" },
        ],
        examTask: "HSK 6 writing: read for ten minutes, then reproduce in 400 characters.",
      },
      {
        id: "hsk6-u3",
        title: "Listening at speed",
        focus: "Interviews and lectures with no repetition and heavy inference.",
        grammar: ["Ellipsis in rapid speech", "Tone of voice carrying the meaning"],
        vocabulary: ["言外之意", "立场", "前提", "倾向", "本质", "含蓄"],
        drills: [
          { target: "他的言外之意是不同意", roman: "ta1 de5 yan2 wai4 zhi1 yi4 shi4 bu4 tong2 yi4", gloss: "What he implied was disagreement" },
          { target: "这位学者的立场很明确", roman: "zhe4 wei4 xue2 zhe3 de5 li4 chang3 hen3 ming2 que4", gloss: "This scholar's position is unambiguous" },
          { target: "他的说法比较含蓄", roman: "ta1 de5 shuo1 fa3 bi3 jiao4 han2 xu4", gloss: "He put it rather obliquely" },
          { target: "从语气可以听出保留", roman: "cong2 yu3 qi4 ke3 yi3 ting1 chu1 bao3 liu2", gloss: "You can hear the reservation in his tone" },
          { target: "他倾向于第二种解释", roman: "ta1 qing1 xiang4 yu2 di4 er4 zhong3 jie3 shi4", gloss: "He leans toward the second reading" },
          { target: "问题的本质并没有改变", roman: "wen4 ti2 de5 ben3 zhi4 bing4 mei2 you3 gai3 bian4", gloss: "The substance of the problem is unchanged" },
        ],
        examTask: "HSK 6 listening part 3: answer inference questions on a lecture.",
      },
      {
        id: "hsk6-u4",
        title: "Classical residue in modern prose",
        focus: "The 文言 fragments that survive in editorials and trip up otherwise fluent readers.",
        grammar: ["之 as a classical possessive and object pronoun", "其 for the third person attributive", "乃 / 亦 / 未尝 in set frames"],
        vocabulary: ["之", "其", "亦", "乃", "未尝", "皆", "颇"],
        drills: [
          { target: "此乃当务之急", roman: "ci3 nai3 dang1 wu4 zhi1 ji2", gloss: "This is the pressing priority" },
          { target: "其中原因颇为复杂", roman: "qi2 zhong1 yuan2 yin1 po1 wei2 fu4 za2", gloss: "The reasons behind it are quite tangled" },
          { target: "此举亦有风险", roman: "ci3 ju3 yi4 you3 feng1 xian3", gloss: "This move carries risk too" },
          { target: "未尝不是一件好事", roman: "wei4 chang2 bu2 shi4 yi2 jian4 hao3 shi4", gloss: "It may well be a good thing" },
          { target: "与会者皆表示赞同", roman: "yu4 hui4 zhe3 jie1 biao3 shi4 zan4 tong2", gloss: "All attendees voiced agreement" },
          { target: "解决之道在于制度", roman: "jie3 jue2 zhi1 dao4 zai4 yu2 zhi4 du4", gloss: "The way out lies in the institutions" },
        ],
        examTask: "HSK 6 reading part 2: choose the classical connector that fits an editorial.",
      },
      {
        id: "hsk6-u5",
        title: "Register control under pressure",
        focus: "Saying the same thing three ways and knowing which room each belongs in.",
        grammar: ["Colloquial, neutral and formal paraphrase of one proposition", "Honorific 贵 / 敝 in correspondence", "Hedged refusal in formal register"],
        vocabulary: ["敬请", "贵公司", "恕难从命", "多有不便", "承蒙", "谨此"],
        drills: [
          { target: "敬请贵公司予以确认", roman: "jing4 qing3 gui4 gong1 si1 yu3 yi3 que4 ren4", gloss: "We respectfully request your confirmation" },
          { target: "恕难从命", roman: "shu4 nan2 cong2 ming4", gloss: "I regret I cannot comply" },
          { target: "承蒙关照不胜感激", roman: "cheng2 meng2 guan1 zhao4 bu2 sheng4 gan3 ji1", gloss: "I am most grateful for your consideration" },
          { target: "如有不便敬请谅解", roman: "ru2 you3 bu2 bian4 jing4 qing3 liang4 jie3", gloss: "We ask your understanding for any inconvenience" },
          { target: "这事儿我办不了", roman: "zhe4 shir4 wo3 ban4 bu5 liao3", gloss: "The colloquial version of the same refusal" },
          { target: "谨此致谢", roman: "jin3 ci3 zhi4 xie4", gloss: "With this, my thanks" },
        ],
        examTask: "HSK 6 writing: rewrite one refusal at three levels of formality.",
      },
      {
        id: "hsk6-u6",
        title: "Speaking on abstract subjects",
        focus: "Ten unbroken minutes on a topic you did not choose.",
        grammar: ["就 … 而言 for framing scope", "归根结底 for reduction to a root cause", "退一步说 for concession"],
        vocabulary: ["就……而言", "归根结底", "退一步说", "相辅相成", "取决于", "利弊"],
        drills: [
          { target: "就长期而言这并不划算", roman: "jiu4 chang2 qi1 er2 yan2 zhe4 bing4 bu4 hua2 suan4", gloss: "Over the long run it does not pay" },
          { target: "归根结底是资源分配的问题", roman: "gui1 gen1 jie2 di3 shi4 zi1 yuan2 fen1 pei4 de5 wen4 ti2", gloss: "At bottom it is a question of allocation" },
          { target: "退一步说即使成功代价也太高", roman: "tui4 yi2 bu4 shuo1 ji2 shi3 cheng2 gong1 dai4 jia4 ye3 tai4 gao1", gloss: "Even granting success, the cost is too high" },
          { target: "两者相辅相成", roman: "liang3 zhe3 xiang1 fu3 xiang1 cheng2", gloss: "The two reinforce one another" },
          { target: "结果取决于执行", roman: "jie2 guo3 qu3 jue2 yu2 zhi2 xing2", gloss: "The outcome turns on execution" },
          { target: "任何政策都有利弊", roman: "ren4 he2 zheng4 ce4 dou1 you3 li4 bi4", gloss: "Every policy cuts both ways" },
        ],
        examTask: "HSK 6 speaking equivalent: ten minute argued monologue with follow-up questions.",
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
        grammar: ["Zero article with uncountables", "a/an for first mention, the for second", "the with superlatives and unique reference"],
        vocabulary: ["advice", "equipment", "research", "furniture", "information", "feedback"],
        drills: [
          { target: "I need some advice about the equipment.", roman: "", gloss: "Uncountable nouns take no plural" },
          { target: "She bought a laptop. The laptop was faulty.", roman: "", gloss: "First mention, then definite" },
          { target: "We received a lot of feedback, and most of it was positive.", roman: "", gloss: "Feedback never takes a plural" },
          { target: "He is doing research on the effects of remote work.", roman: "", gloss: "Not 'a research', not 'researches'" },
          { target: "The information you sent was incomplete.", roman: "", gloss: "Definite because it is already identified" },
          { target: "This is the best proposal we have received.", roman: "", gloss: "Superlatives take the" },
        ],
        examTask: "TOEIC Part 5: single-sentence grammar completion.",
      },
      {
        id: "en-f2",
        title: "Tense and time reference",
        focus: "Present perfect against past simple, drilled until it stops needing thought.",
        grammar: ["Present perfect for unfinished time", "Past simple with a finished time marker", "Past perfect for the earlier of two past events"],
        vocabulary: ["since", "for", "already", "yet", "recently", "by the time"],
        drills: [
          { target: "I have worked here since 2021.", roman: "", gloss: "Still true now" },
          { target: "I worked there for two years before I moved.", roman: "", gloss: "Finished period" },
          { target: "She has already submitted the report.", roman: "", gloss: "Recent, with present relevance" },
          { target: "By the time we arrived, the meeting had ended.", roman: "", gloss: "Past perfect for the earlier event" },
          { target: "Have you heard back from the vendor yet?", roman: "", gloss: "Yet belongs with the perfect" },
          { target: "We launched the product last March.", roman: "", gloss: "A finished marker forces past simple" },
        ],
        examTask: "TOEIC Part 6: complete a short business text.",
      },
      {
        id: "en-f3",
        title: "Prepositions in collocation",
        focus: "The errors that survive advanced grammar because they are learned as pairs, not rules.",
        grammar: ["Dependent prepositions after verbs", "Prepositions after adjectives", "Time and place prepositions in business English"],
        vocabulary: ["depend on", "consist of", "responsible for", "aware of", "comply with", "result in"],
        drills: [
          { target: "The schedule depends on the client's approval.", roman: "", gloss: "Depend takes on, never from" },
          { target: "The team consists of six engineers.", roman: "", gloss: "Consist of, never consist in for this sense" },
          { target: "She is responsible for quality assurance.", roman: "", gloss: "Responsible for a duty, to a person" },
          { target: "All suppliers must comply with the new standard.", roman: "", gloss: "Comply with, never comply to" },
          { target: "The delay resulted in a penalty.", roman: "", gloss: "Result in an outcome, result from a cause" },
          { target: "We were not aware of the change.", roman: "", gloss: "Aware of, never aware about" },
        ],
        examTask: "TOEIC Part 5: preposition items under thirty seconds each.",
      },
      {
        id: "en-f4",
        title: "Sentence stress and clarity",
        focus: "The speaking equivalent of tone work: which word carries the meaning.",
        grammar: ["Content words stressed, function words reduced", "Contrastive stress changing meaning", "Weak forms of to, of, and, for"],
        vocabulary: ["stress", "contrast", "reduction", "linking", "emphasis"],
        drills: [
          { target: "I sent the report to Maria, not to David.", roman: "", gloss: "Contrastive stress on the names" },
          { target: "We need it by Friday, not on Friday.", roman: "", gloss: "Stress the preposition to mark the contrast" },
          { target: "That was a difficult decision to make.", roman: "", gloss: "Reduce to and a, stress difficult and decision" },
          { target: "I did send it yesterday.", roman: "", gloss: "Emphatic do under contradiction" },
          { target: "Could you look at it again, please?", roman: "", gloss: "Rising intonation carries the request" },
          { target: "The meeting has been moved to Thursday.", roman: "", gloss: "Stress moved and Thursday, reduce the rest" },
        ],
        examTask: "TOEIC Speaking: read a short announcement aloud for stress and clarity.",
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
        grammar: ["Question forms in rapid speech", "Elliptical replies", "Indirect questions"],
        vocabulary: ["invoice", "shipment", "postpone", "reimburse", "vendor", "quote"],
        drills: [
          { target: "Could we push the vendor meeting to Thursday?", roman: "", gloss: "Requesting a reschedule" },
          { target: "Do you know whether the shipment has cleared customs?", roman: "", gloss: "Indirect question, no inversion after whether" },
          { target: "I will reimburse you once you submit the receipt.", roman: "", gloss: "Conditional sequencing in speech" },
          { target: "The invoice is dated the fifteenth, not the fifth.", roman: "", gloss: "Number discrimination, a standard Part 3 trap" },
          { target: "Can you send over a revised quote by close of business?", roman: "", gloss: "Deadline phrasing" },
          { target: "Sorry, would you mind repeating the last part?", roman: "", gloss: "Repair strategy under speed" },
        ],
        examTask: "TOEIC Part 3: three questions on a 40 second exchange.",
      },
      {
        id: "en-t7-2",
        title: "Correspondence and notices",
        focus: "Part 7 double passages, read for gist then for detail.",
        grammar: ["Formal request structures", "Hedging in written English", "Passive voice for institutional distance"],
        vocabulary: ["pursuant", "attached", "further to", "at your earliest convenience", "enclosed", "regarding"],
        drills: [
          { target: "Further to your message, I have attached the revised schedule.", roman: "", gloss: "Standard opening" },
          { target: "Please confirm receipt at your earliest convenience.", roman: "", gloss: "Polite urgency without a deadline" },
          { target: "Applications received after the deadline will not be considered.", roman: "", gloss: "Passive for policy statements" },
          { target: "Regarding your enquiry, the item is currently out of stock.", roman: "", gloss: "Topic-fronting in replies" },
          { target: "We regret to inform you that the position has been filled.", roman: "", gloss: "Fixed formula for bad news" },
          { target: "Pursuant to the agreement, payment is due within thirty days.", roman: "", gloss: "Contract register" },
        ],
        examTask: "TOEIC Part 7: cross-reference two related documents.",
      },
      {
        id: "en-t7-3",
        title: "Announcements and talks",
        focus: "Part 4, where a single monologue carries three answers and no second chance.",
        grammar: ["Sequencing adverbs in announcements", "Future arrangements with will and going to", "Imperatives in public notices"],
        vocabulary: ["boarding", "detour", "maintenance", "premises", "refreshments", "proceed"],
        drills: [
          { target: "Passengers travelling to Osaka should proceed to gate twelve.", roman: "", gloss: "Announcement register" },
          { target: "Due to scheduled maintenance, the lift will be out of service.", roman: "", gloss: "Cause fronted before effect" },
          { target: "Refreshments will be served immediately after the presentation.", roman: "", gloss: "Sequencing in event talks" },
          { target: "Please note that the premises close at nine o'clock.", roman: "", gloss: "Please note as a signal for the tested detail" },
          { target: "Visitors are asked to sign in at the reception desk.", roman: "", gloss: "Passive imperative in notices" },
          { target: "A detour is in place while the road is resurfaced.", roman: "", gloss: "Present passive for ongoing works" },
        ],
        examTask: "TOEIC Part 4: three questions on a 60 second talk.",
      },
      {
        id: "en-t7-4",
        title: "The 500 words that carry the paper",
        focus: "Business collocations that appear in half of Parts 5 to 7 and nowhere in a textbook.",
        grammar: ["Verb-noun collocation", "Adjective-noun collocation in business register", "Phrasal verbs with formal one-word equivalents"],
        vocabulary: ["meet a deadline", "reach an agreement", "issue a refund", "waive a fee", "streamline", "outstanding balance"],
        drills: [
          { target: "We are on track to meet the deadline.", roman: "", gloss: "Meet, not achieve, a deadline" },
          { target: "The parties reached an agreement on Tuesday.", roman: "", gloss: "Reach, not arrive at, an agreement" },
          { target: "The store will issue a refund within five working days.", roman: "", gloss: "Issue a refund is the fixed pairing" },
          { target: "The bank agreed to waive the transfer fee.", roman: "", gloss: "Waive, not cancel, a fee" },
          { target: "The new system streamlines the approval process.", roman: "", gloss: "One-word formal equivalent of 'makes simpler'" },
          { target: "Please settle the outstanding balance by month end.", roman: "", gloss: "Settle a balance, not pay off" },
        ],
        examTask: "TOEIC Part 5: collocation items, twenty in seven minutes.",
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
        grammar: ["Near-synonym discrimination", "Collocation over definition", "Register mismatch as the deciding cue"],
        vocabulary: ["contingent", "provisional", "tentative", "conditional", "prospective", "eventual"],
        drills: [
          { target: "The offer is contingent on board approval.", roman: "", gloss: "Not 'tentative', not 'provisional'" },
          { target: "We have pencilled in a tentative date for the review.", roman: "", gloss: "Tentative means not yet firm, not conditional" },
          { target: "A provisional licence was issued pending inspection.", roman: "", gloss: "Provisional means temporary and official" },
          { target: "Prospective clients were invited to the demonstration.", roman: "", gloss: "Prospective, not eventual, for future customers" },
          { target: "The eventual outcome exceeded every forecast.", roman: "", gloss: "Eventual means final, never possible" },
          { target: "Payment is conditional upon delivery of the full set.", roman: "", gloss: "Conditional upon takes a condition, not an approver" },
        ],
        examTask: "TOEIC Part 5 under time: 30 items in 10 minutes.",
      },
      {
        id: "en-t9-2",
        title: "Accent range in listening",
        focus: "British, Australian and Canadian speakers, which sink otherwise strong candidates.",
        grammar: ["Connected speech and elision", "Intonation carrying question force", "Tag questions in British usage"],
        vocabulary: ["rota", "cheque", "queue", "fortnight", "carpark", "reckon"],
        drills: [
          { target: "Are you on the rota for the fortnight after next?", roman: "", gloss: "British workplace register" },
          { target: "I reckon we should give it a go, shouldn't we?", roman: "", gloss: "Australian idiom with a tag question" },
          { target: "Pop the cheque in the post when you get a chance.", roman: "", gloss: "Elision makes 'in the' nearly disappear" },
          { target: "There is a queue at the carpark entrance.", roman: "", gloss: "Vocabulary items with no American equivalent on the paper" },
          { target: "Would you mind terribly if we moved it forward?", roman: "", gloss: "British over-hedging carries the request" },
          { target: "It is due Tuesday, not Thursday, eh?", roman: "", gloss: "Canadian tag and the classic day-name confusion" },
        ],
        examTask: "TOEIC Part 4: talks delivered in four accents.",
      },
      {
        id: "en-t9-3",
        title: "Speaking and writing extension",
        focus: "For candidates going on to TOEFL iBT or IELTS after the 900.",
        grammar: ["Opinion essay structure", "Concession before rebuttal", "Nominalisation for academic density"],
        vocabulary: ["notwithstanding", "conversely", "insofar as", "by the same token", "albeit", "thereby"],
        drills: [
          { target: "Notwithstanding the cost, the approach remains the more defensible one.", roman: "", gloss: "Concessive opening" },
          { target: "Conversely, the second study found no such effect.", roman: "", gloss: "Signals a reversal, not an addition" },
          { target: "The policy succeeded insofar as it reduced waiting times.", roman: "", gloss: "Bounded claim rather than a blanket one" },
          { target: "The result was positive, albeit modest.", roman: "", gloss: "Albeit takes a phrase, never a full clause" },
          { target: "Automation reduced errors, thereby lowering costs.", roman: "", gloss: "Thereby links a consequence to its cause" },
          { target: "The implementation of the reform proved contentious.", roman: "", gloss: "Nominalisation raises the register" },
        ],
        examTask: "TOEFL iBT independent writing: 300 words in 30 minutes.",
      },
      {
        id: "en-t9-4",
        title: "Stamina and pacing",
        focus: "The two hour paper, where the last thirty questions decide the band.",
        grammar: ["Skimming for structure before reading for detail", "Elimination under a fifteen second budget", "Recovering after a lost item"],
        vocabulary: ["triage", "skim", "scan", "elimination", "pacing", "flagging"],
        drills: [
          { target: "Read the questions before the second passage, not the first.", roman: "", gloss: "Triage rule for double passages" },
          { target: "If two options survive after fifteen seconds, choose and move on.", roman: "", gloss: "Pacing discipline beats certainty" },
          { target: "Part 7 needs fifty five minutes; anything less costs you the tail.", roman: "", gloss: "Budget the reading section backwards" },
          { target: "Flag it, leave it, and return only if time remains.", roman: "", gloss: "Never spend a minute on one item" },
          { target: "Scan for names and dates before reading the body.", roman: "", gloss: "Detail questions are answered by scanning" },
          { target: "A missed item costs one point; panic costs ten.", roman: "", gloss: "Recovery is a trainable skill" },
        ],
        examTask: "Full timed paper: 200 items in 120 minutes with no pause.",
      },
    ],
  },
  {
    code: "TOEFL 100",
    track: "english",
    title: "Academic ceiling",
    summary:
      "TOEFL iBT above 100 of 120: integrated tasks, lecture note-taking, and academic register under a clock.",
    hours: 200,
    words: 9000,
    exitCriteria:
      "Score 100 or above with no section below 24, including a 4.0 on both integrated writing and speaking.",
    units: [
      {
        id: "en-tf-1",
        title: "Integrated writing",
        focus: "Reading against a lecture that contradicts it, which is the whole task.",
        grammar: ["Reporting contrast: whereas, by contrast, casts doubt on", "Attribution without opinion", "Paraphrase that does not lift phrasing"],
        vocabulary: ["refute", "undermine", "assert", "contend", "counter", "concede"],
        drills: [
          { target: "The lecturer casts doubt on each of the reading's three claims.", roman: "", gloss: "The standard opening sentence" },
          { target: "Whereas the passage asserts that costs would fall, the professor contends the opposite.", roman: "", gloss: "Contrast plus attribution in one sentence" },
          { target: "This evidence undermines the argument advanced in the reading.", roman: "", gloss: "Undermines, not destroys" },
          { target: "The speaker concedes the point but questions its significance.", roman: "", gloss: "Concession is scored, not penalised" },
          { target: "To counter this, the lecturer cites a longitudinal study.", roman: "", gloss: "Cites, for reporting evidence" },
          { target: "The reading maintains that the practice is sustainable.", roman: "", gloss: "Maintains keeps you out of first person" },
        ],
        examTask: "TOEFL integrated writing: 150 to 225 words in 20 minutes.",
      },
      {
        id: "en-tf-2",
        title: "Lecture note-taking",
        focus: "Six minutes of academic speech, one pass, no transcript.",
        grammar: ["Signposting language in lectures", "Digression markers and how to skip them", "Definition frames worth capturing"],
        vocabulary: ["hypothesis", "variable", "correlate", "phenomenon", "empirical", "anomaly"],
        drills: [
          { target: "Now, this brings us to the second mechanism.", roman: "", gloss: "Signposts a new section — write a new heading" },
          { target: "By the way, this is not on the exam, but it is interesting.", roman: "", gloss: "Digression marker — stop writing" },
          { target: "What we mean by an anomaly here is a result the model does not predict.", roman: "", gloss: "Definition frame — always capture" },
          { target: "The two variables correlate, but correlation is not the claim.", roman: "", gloss: "The distinction TOEFL tests directly" },
          { target: "The empirical evidence, however, points the other way.", roman: "", gloss: "However signals the tested contrast" },
          { target: "To summarise, there are three competing hypotheses.", roman: "", gloss: "Summary cue — the answer to the main-idea question" },
        ],
        examTask: "TOEFL listening: six questions on a five minute lecture, notes only.",
      },
      {
        id: "en-tf-3",
        title: "Independent speaking in 45 seconds",
        focus: "Fifteen seconds to prepare, forty five to deliver, no second attempt.",
        grammar: ["Position, two reasons, one example, close", "Discourse markers that buy thinking time", "Self-correction without derailing"],
        vocabulary: ["personally", "for one thing", "on top of that", "which is why", "in my case"],
        drills: [
          { target: "Personally, I would choose the second option, for two reasons.", roman: "", gloss: "Position stated in the first four seconds" },
          { target: "For one thing, it costs less over time.", roman: "", gloss: "First reason, signposted" },
          { target: "On top of that, it is far easier to reverse.", roman: "", gloss: "Second reason without repeating the frame" },
          { target: "In my case, I tried the alternative last year and regretted it.", roman: "", gloss: "The example that lifts a 3.0 to a 4.0" },
          { target: "Which is why I would still pick the second one.", roman: "", gloss: "Close by restating the position" },
          { target: "Sorry, I mean the first one, the cheaper one.", roman: "", gloss: "Clean self-correction is not penalised" },
        ],
        examTask: "TOEFL speaking task 1: 45 seconds, scored on delivery, language and topic development.",
      },
      {
        id: "en-tf-4",
        title: "Academic reading at density",
        focus: "700 word passages with inference, vocabulary-in-context and a summary grid.",
        grammar: ["Reference resolution across sentences", "Inference versus stated detail", "Negative factual questions"],
        vocabulary: ["consequently", "in turn", "the former", "the latter", "this shift", "such accounts"],
        drills: [
          { target: "Such accounts, however, rest on a contested assumption.", roman: "", gloss: "Such accounts refers back — find the referent" },
          { target: "The former explanation is now largely discredited.", roman: "", gloss: "Former and latter are tested directly" },
          { target: "This shift, in turn, altered how the data were collected.", roman: "", gloss: "In turn signals a causal chain" },
          { target: "Which of the following is NOT mentioned in paragraph three?", roman: "", gloss: "Negative factual: verify each option, do not guess" },
          { target: "The word 'robust' in the passage is closest in meaning to strong.", roman: "", gloss: "Vocabulary-in-context, judged by the sentence not the dictionary" },
          { target: "It can be inferred that the author doubts the earlier finding.", roman: "", gloss: "Inference must be supported by a specific line" },
        ],
        examTask: "TOEFL reading: 10 questions on a 700 word passage in 18 minutes.",
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

/**
 * Flatten a module into prompt-ready material. The tutor is grounded on this
 * rather than on its own memory of the language, which is where invented
 * idioms and missing characters come from.
 */
export function syllabusFor(level: string) {
  const module =
    getModule(slugifyModule(level)) ??
    ALL_MODULES.find((entry) => entry.code.toLowerCase() === level.toLowerCase());
  if (!module) return "";

  const units = module.units.map((unit) => {
    const lines = unit.drills
      .map((drill) =>
        drill.roman
          ? `  - ${drill.target} | ${drill.roman} | ${drill.gloss}`
          : `  - ${drill.target} | ${drill.gloss}`
      )
      .join("\n");

    return [
      `Unit: ${unit.title} — ${unit.focus}`,
      `Grammar: ${unit.grammar.join("; ")}`,
      `Vocabulary: ${unit.vocabulary.join(", ")}`,
      "Lines:",
      lines,
    ].join("\n");
  });

  return [
    `SYLLABUS — ${module.code}: ${module.title}`,
    `Exit criteria: ${module.exitCriteria}`,
    "",
    units.join("\n\n"),
  ].join("\n");
}

export function modulesForTrack(track: string) {
  return ALL_MODULES.filter((module) => module.track === track);
}
