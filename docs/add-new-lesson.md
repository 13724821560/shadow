# Add A New Lesson Manually

This project currently uses local mock data only. There is no backend, upload flow, database, admin panel, AI, Whisper, or YouTube download step. To add a real lesson, place the media files in `public/` and add one object to `lib/mock-shadowing.ts`.

## 1. Add The Video

Put the video file in `public/videos/`.

Example:

```text
public/videos/my-real-lesson.mp4
```

Then use this path in the lesson:

```ts
videoUrl: "/videos/my-real-lesson.mp4"
```

`public/videos/demo.mp4` is the shared placeholder video for mock lessons. Keep it in the repo; replace `videoUrl` only when a lesson has its own real video.

## 2. Add The Cover

Option A: use a local cover image:

```text
public/covers/my-real-lesson.jpg
```

```ts
coverUrl: "/covers/my-real-lesson.jpg"
```

Option B: use a remote image URL:

```ts
coverUrl: "https://images.unsplash.com/photo-example?auto=format&fit=crop&w=1200&q=80"
```

If you use a new remote image domain, add it to `next.config.ts` under `images.remotePatterns`.

## 3. Add The Lesson Object

Open `lib/mock-shadowing.ts` and add a new object to `mockShadowingLessons`.

Example:

```ts
{
  id: "my-real-lesson",
  title: "My Real English Lesson",
  titleZh: "我的真实英语跟读素材",
  author: "Source Name",
  level: "B1",
  durationLabel: "03:25",
  tags: ["speaking", "daily english", "shadowing"],
  coverUrl: "/covers/my-real-lesson.jpg",
  videoUrl: "/videos/my-real-lesson.mp4",
  subtitles: [
    {
      id: 1,
      start: 0,
      end: 4.8,
      en: "This is the first sentence of the lesson.",
      zh: "这是这节课的第一句话。",
    },
    {
      id: 2,
      start: 4.8,
      end: 9.2,
      en: "This is the second sentence for shadowing practice.",
      zh: "这是用于影子跟读练习的第二句话。",
    },
  ],
}
```

## 4. Fill Subtitles

Use the existing `subtitles` array format:

```ts
{
  id: 1,
  start: 0,
  end: 5,
  en: "English sentence.",
  zh: "中文翻译。",
}
```

Rules:

- `start` and `end` are seconds, not `00:00:00` strings.
- Keep subtitles sorted by `start`.
- Make every `end` greater than `start`.
- Avoid overlapping time ranges.
- Keep one English sentence in `en` and the matching Chinese translation in `zh`.

For SRT/VTT conversion examples, see `docs/content-format.md`.

## 5. Open The Lesson

After adding the object, start the dev server:

```bash
npm run dev
```

Then visit:

```text
http://localhost:3000/shadowing/my-real-lesson
```

The homepage at `http://localhost:3000/` will also show the new lesson card automatically.
