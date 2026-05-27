export type SubtitleLike = {
  start: number;
  end: number;
};

export type LessonLike = {
  id: string;
  title: string;
  titleZh: string;
  level: string;
  tags: string[];
  coverUrl: string;
  videoUrl: string;
  durationLabel: string;
  subtitles: Array<
    SubtitleLike & {
      id: number;
      en: string;
      zh: string;
    }
  >;
};

export function formatTime(seconds: number) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${secs}`;
}

export function findActiveSubtitleIndex(
  subtitles: SubtitleLike[],
  currentTime: number,
) {
  if (!subtitles.length) {
    return -1;
  }

  for (let index = 0; index < subtitles.length; index += 1) {
    const subtitle = subtitles[index];

    if (currentTime >= subtitle.start && currentTime < subtitle.end) {
      return index;
    }

    if (currentTime < subtitle.start) {
      return Math.max(0, index - 1);
    }
  }

  return subtitles.length - 1;
}

export function validateLesson(lesson: LessonLike) {
  const errors: string[] = [];
  const requiredTextFields: Array<keyof Pick<
    LessonLike,
    | "id"
    | "title"
    | "titleZh"
    | "level"
    | "coverUrl"
    | "videoUrl"
    | "durationLabel"
  >> = [
    "id",
    "title",
    "titleZh",
    "level",
    "coverUrl",
    "videoUrl",
    "durationLabel",
  ];

  for (const field of requiredTextFields) {
    if (!lesson[field]?.trim()) {
      errors.push(`${field} is required.`);
    }
  }

  if (!Array.isArray(lesson.tags) || lesson.tags.length === 0) {
    errors.push("tags must contain at least one tag.");
  }

  if (!Array.isArray(lesson.subtitles) || lesson.subtitles.length === 0) {
    errors.push("subtitles must contain at least one subtitle.");
  }

  lesson.subtitles.forEach((subtitle, index) => {
    const label = `subtitles[${index}]`;

    if (!Number.isFinite(subtitle.start) || subtitle.start < 0) {
      errors.push(`${label}.start must be a non-negative number.`);
    }

    if (!Number.isFinite(subtitle.end) || subtitle.end <= subtitle.start) {
      errors.push(`${label}.end must be greater than start.`);
    }

    if (!subtitle.en?.trim()) {
      errors.push(`${label}.en is required.`);
    }

    if (!subtitle.zh?.trim()) {
      errors.push(`${label}.zh is required.`);
    }

    const previous = lesson.subtitles[index - 1];
    if (previous && subtitle.start < previous.end) {
      errors.push(`${label}.start overlaps the previous subtitle.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
