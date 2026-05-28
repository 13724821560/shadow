import { formatTime } from "@/lib/subtitle-utils";

export type ShadowingSubtitle = {
  id: number;
  start: number;
  end: number;
  en: string;
  zh: string;
};

export type ShadowingLesson = {
  id: string;
  title: string;
  titleZh: string;
  author: string;
  category: "Daily" | "Work" | "Social" | "Learning";
  level: string;
  durationLabel: string;
  tags: string[];
  coverUrl: string;
  videoUrl: string;
  subtitles: ShadowingSubtitle[];
};

export const mockShadowingLessons: ShadowingLesson[] = [
  /*
   * Add your real lessons here.
   *
   * Copy this object, remove the comment markers, then replace the file paths
   * and subtitles with your own real video content.
   *
   * {
   *   id: "my-real-lesson",
   *   title: "My Real English Lesson",
   *   titleZh: "我的真实英语跟读素材",
   *   author: "Source Name",
   *   category: "Daily",
   *   level: "B1",
   *   durationLabel: "03:20",
   *   tags: ["daily english", "speaking", "shadowing"],
   *   coverUrl: "/covers/my-real-lesson.jpg",
   *   videoUrl: "/videos/my-real-lesson.mp4",
   *   subtitles: [
   *     {
   *       id: 1,
   *       start: 0,
   *       end: 4.8,
   *       en: "This is the first sentence from your real video.",
   *       zh: "这是你的真实视频里的第一句话。",
   *     },
   *     {
   *       id: 2,
   *       start: 4.8,
   *       end: 9.5,
   *       en: "Replace each timestamp and subtitle line carefully.",
   *       zh: "认真替换每一句的时间戳和字幕内容。",
   *     },
   *   ],
   * },
   */
  {
    id: "deep-work-routine",
    title: "Change Your Life In 6 Months",
    titleZh: "6个月改变人生：我的深度工作法",
    author: "Mock Shadowing",
    category: "Work",
    level: "B2",
    durationLabel: "01:28",
    tags: ["english", "deep work", "productivity", "shadowing"],
    coverUrl:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "/videos/demo.mp4",
    subtitles: [
      {
        id: 1,
        start: 0,
        end: 5,
        en: "If you can spend eight hours building someone else's dreams, you can spend one hour building your own.",
        zh: "如果你能花八个小时去构建别人的梦想，那你也能花一个小时去构建自己的梦想。",
      },
      {
        id: 2,
        start: 5,
        end: 11,
        en: "One of the most powerful ideas I've been thinking about recently is bringing your ideal future into the now.",
        zh: "我最近一直在思考的一个核心理念，就是把你的理想未来带到当下。",
      },
      {
        id: 3,
        start: 11,
        end: 21,
        en: "What I mean by that is performing the same actions that you would in your ideal lifestyle, but on a much smaller scale.",
        zh: "我的意思是，去做你在理想生活方式中会做的那些事，只不过规模要小得多。",
      },
      {
        id: 4,
        start: 21,
        end: 35,
        en: "Let's say I want to write for two hours every morning for the rest of my life, then I start with five minutes today.",
        zh: "比如说，我想在余生中每天早上写作两小时，那么我今天就先从五分钟开始。",
      },
      {
        id: 5,
        start: 35,
        end: 45,
        en: "Thirty minutes a day becomes one hour a day, and slowly it increases until I can sustain that lifestyle.",
        zh: "每天三十分钟会变成每天一小时，然后逐渐增加，直到我能维持那种生活方式。",
      },
      {
        id: 6,
        start: 45,
        end: 57,
        en: "It doesn't make sense to wait and put off what you're already going to be doing for your life's work.",
        zh: "等待和拖延那些你本来就要为人生事业去做的事情，并没有意义。",
      },
      {
        id: 7,
        start: 57,
        end: 68,
        en: "The point is not to transform overnight, but to make the first version of your future easy enough to repeat.",
        zh: "重点不是一夜之间改变，而是让未来的第一个版本简单到可以重复。",
      },
      {
        id: 8,
        start: 68,
        end: 82,
        en: "When the action becomes normal, your identity starts to catch up with the person you want to become.",
        zh: "当行动变得平常，你的身份感就会开始追上你想成为的那个人。",
      },
      {
        id: 9,
        start: 82,
        end: 88,
        en: "Start small, repeat daily, and let time do the heavy lifting.",
        zh: "从小处开始，每天重复，然后让时间承担最重的部分。",
      },
    ],
  },
  {
    id: "morning-focus",
    title: "Build A Calm Morning Routine",
    titleZh: "建立一个稳定的晨间专注流程",
    author: "Mock Shadowing",
    category: "Daily",
    level: "B1",
    durationLabel: "01:12",
    tags: ["routine", "focus", "daily english"],
    coverUrl:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "/videos/demo.mp4",
    subtitles: [
      {
        id: 1,
        start: 0,
        end: 6,
        en: "The way you begin your morning often shapes the way the rest of the day feels.",
        zh: "你开始早晨的方式，往往会影响一天剩余时间的状态。",
      },
      {
        id: 2,
        start: 6,
        end: 13,
        en: "You do not need a perfect routine; you only need a few actions that help you feel clear.",
        zh: "你不需要完美的流程，只需要几个能让你更清醒的动作。",
      },
      {
        id: 3,
        start: 13,
        end: 22,
        en: "Before checking your phone, give yourself ten quiet minutes to breathe, stretch, and choose your first task.",
        zh: "在看手机之前，给自己十分钟安静地呼吸、伸展，并选择第一件任务。",
      },
      {
        id: 4,
        start: 22,
        end: 32,
        en: "This small pause creates space between waking up and reacting to everyone else's priorities.",
        zh: "这个小小的停顿，会在醒来和回应别人优先事项之间创造空间。",
      },
      {
        id: 5,
        start: 32,
        end: 43,
        en: "When your first hour is calm, your attention becomes easier to protect throughout the day.",
        zh: "当你的第一个小时是平静的，你一整天都更容易保护自己的注意力。",
      },
      {
        id: 6,
        start: 43,
        end: 55,
        en: "Start with one repeatable habit, keep it simple, and let the routine become automatic.",
        zh: "从一个可重复的习惯开始，保持简单，然后让流程慢慢自动化。",
      },
      {
        id: 7,
        start: 55,
        end: 72,
        en: "A good morning routine is not about doing more; it is about removing friction from the work that matters.",
        zh: "好的晨间流程不是为了做更多事，而是为了减少重要工作的阻力。",
      },
    ],
  },
  {
    id: "small-talk-confidence",
    title: "Speak More Naturally In Small Talk",
    titleZh: "让日常寒暄更自然",
    author: "Mock Shadowing",
    category: "Social",
    level: "A2",
    durationLabel: "00:58",
    tags: ["conversation", "speaking", "confidence"],
    coverUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "/videos/demo.mp4",
    subtitles: [
      {
        id: 1,
        start: 0,
        end: 5,
        en: "Small talk becomes easier when you stop trying to sound impressive.",
        zh: "当你不再努力显得很厉害时，寒暄会变得更容易。",
      },
      {
        id: 2,
        start: 5,
        end: 11,
        en: "Most people simply want a warm signal that you are listening and interested.",
        zh: "大多数人只是想感受到你在倾听，并且有兴趣交流。",
      },
      {
        id: 3,
        start: 11,
        end: 19,
        en: "You can start with simple questions like how was your weekend or what are you working on lately.",
        zh: "你可以从简单问题开始，比如周末过得怎么样，或者最近在忙什么。",
      },
      {
        id: 4,
        start: 19,
        end: 28,
        en: "Then repeat one detail they mentioned and ask a follow-up question.",
        zh: "然后重复对方提到的一个细节，再问一个后续问题。",
      },
      {
        id: 5,
        start: 28,
        end: 39,
        en: "This makes the conversation feel natural because you are building on what is already there.",
        zh: "这样对话会更自然，因为你是在已有内容上继续延展。",
      },
      {
        id: 6,
        start: 39,
        end: 50,
        en: "Confidence comes from staying present, not from memorizing perfect lines.",
        zh: "自信来自专注当下，而不是背诵完美台词。",
      },
      {
        id: 7,
        start: 50,
        end: 58,
        en: "Keep your sentences short, smile a little, and let the next question be simple.",
        zh: "句子短一点，微笑一点，然后让下一个问题简单一点。",
      },
    ],
  },
  {
    id: "learn-faster",
    title: "How To Learn Faster Without Burning Out",
    titleZh: "如何学得更快但不过度消耗",
    author: "Mock Shadowing",
    category: "Learning",
    level: "B2",
    durationLabel: "01:20",
    tags: ["learning", "habits", "energy"],
    coverUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "/videos/demo.mp4",
    subtitles: [
      {
        id: 1,
        start: 0,
        end: 7,
        en: "Learning faster does not mean forcing your brain to work harder every minute.",
        zh: "学得更快，并不意味着每一分钟都强迫大脑更用力。",
      },
      {
        id: 2,
        start: 7,
        end: 15,
        en: "It means creating shorter feedback loops, so you can notice mistakes and adjust quickly.",
        zh: "它意味着建立更短的反馈回路，让你能发现错误并快速调整。",
      },
      {
        id: 3,
        start: 15,
        end: 25,
        en: "After you study something, test yourself before you feel completely ready.",
        zh: "学完一个内容后，在完全准备好之前就先测试自己。",
      },
      {
        id: 4,
        start: 25,
        end: 36,
        en: "The discomfort of recall tells your brain which parts need another pass.",
        zh: "回忆时的不适感会告诉大脑，哪些部分还需要再过一遍。",
      },
      {
        id: 5,
        start: 36,
        end: 48,
        en: "Then rest on purpose, because tired repetition can make weak patterns stronger.",
        zh: "然后有意识地休息，因为疲惫的重复可能会强化薄弱的模式。",
      },
      {
        id: 6,
        start: 48,
        end: 63,
        en: "A good practice session has focus, feedback, and recovery in the same system.",
        zh: "一次好的练习，要把专注、反馈和恢复放在同一个系统里。",
      },
      {
        id: 7,
        start: 63,
        end: 80,
        en: "If you protect your energy, you can return tomorrow and compound the skill again.",
        zh: "如果你保护好精力，明天就能回来继续复利式地积累技能。",
      },
    ],
  },
];

export function getShadowingLesson(id: string) {
  return mockShadowingLessons.find((lesson) => lesson.id === id);
}

export function formatSubtitleTime(seconds: number) {
  return formatTime(seconds);
}
