# Shadowing Content Format

Phase 1.x uses local mock data only. Add or edit lessons in `lib/mock-shadowing.ts`; there is no database, upload flow, admin panel, AI processing, Whisper, or YouTube download step.

Current mock lessons may share the same local placeholder video, `videoUrl: "/videos/demo.mp4"`. This is expected while the lesson text and subtitles are being shaped; replace `videoUrl` later when a real source video is ready.

## Lesson Object

Each lesson should follow this shape:

```ts
type ShadowingLesson = {
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

type ShadowingSubtitle = {
  id: number;
  start: number;
  end: number;
  en: string;
  zh: string;
};
```

Field notes:

- `id`: URL slug for `/shadowing/[id]`; use lowercase letters, numbers, and hyphens, for example `morning-focus`.
- `title`: English title shown on cards and the player page.
- `titleZh`: Chinese title or subtitle.
- `author`: display-only source or creator label.
- `category`: homepage filter category; use `Daily`, `Work`, `Social`, or `Learning`.
- `level`: short difficulty label such as `A2`, `B1`, or `B2`.
- `tags`: 2-4 short tags for the homepage card.
- `coverUrl`: remote image URL or a local public path such as `/covers/morning-focus.jpg`.
- `videoUrl`: direct playable MP4/WebM URL or a local public path such as `/videos/morning-focus.mp4`.
- `durationLabel`: display-only duration, for example `01:28`.
- `subtitles`: ordered subtitle rows using seconds, not timestamp strings.

## Example Lesson

```ts
{
  id: "morning-focus",
  title: "Build A Calm Morning Routine",
  titleZh: "建立一个稳定的晨间专注流程",
  author: "Mock Shadowing",
  category: "Daily",
  level: "B1",
  durationLabel: "01:12",
  tags: ["routine", "focus", "daily english"],
  coverUrl: "/covers/morning-focus.jpg",
  videoUrl: "/videos/morning-focus.mp4",
  subtitles: [
    {
      id: 1,
      start: 0,
      end: 6,
      en: "The way you begin your morning often shapes the way the rest of the day feels.",
      zh: "你开始早晨的方式，往往会影响一天剩余时间的状态。",
    },
  ],
}
```

## SRT/VTT To Subtitles

The app does not parse SRT or VTT at runtime yet. For now, convert SRT/VTT into the `subtitles` array before adding it to `lib/mock-shadowing.ts`.

SRT input:

```srt
1
00:00:00,000 --> 00:00:05,000
If you can spend eight hours building someone else's dreams, you can spend one hour building your own.
如果你能花八个小时去构建别人的梦想，那你也能花一个小时去构建自己的梦想。

2
00:00:05,000 --> 00:00:11,000
One of the most powerful ideas I've been thinking about recently is bringing your ideal future into the now.
我最近一直在思考的一个核心理念，就是把你的理想未来带到当下。
```

VTT input:

```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
If you can spend eight hours building someone else's dreams, you can spend one hour building your own.
如果你能花八个小时去构建别人的梦想，那你也能花一个小时去构建自己的梦想。
```

Converted output:

```ts
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
]
```

Conversion rules:

- Convert `HH:MM:SS,mmm` or `HH:MM:SS.mmm` to seconds.
- Keep `subtitles` sorted by `start`.
- Use English text for `en` and Chinese text for `zh`.
- If a cue has multiple English lines, join them into one sentence before `zh`.
- Ensure every `end` is greater than `start`.
- Avoid overlapping subtitle ranges.

## Validation

`lib/subtitle-utils.ts` includes `validateLesson(lesson)` for quick format checks. It verifies required fields, subtitle timing, subtitle text, and overlapping ranges.
