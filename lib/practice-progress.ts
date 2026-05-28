import type { ShadowingLesson } from "@/lib/mock-shadowing";

const PRACTICE_PROGRESS_KEY = "echoloop:last-practice";

export type PracticeProgress = {
  lessonId: string;
  currentTime: number;
  updatedAt: string;
};

export function readPracticeProgress(): PracticeProgress | null {
  if (typeof window === "undefined") return null;

  try {
    const rawValue = window.localStorage.getItem(PRACTICE_PROGRESS_KEY);
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue) as Partial<PracticeProgress>;
    if (
      typeof parsed.lessonId !== "string" ||
      typeof parsed.currentTime !== "number" ||
      typeof parsed.updatedAt !== "string"
    ) {
      return null;
    }

    return {
      lessonId: parsed.lessonId,
      currentTime: Math.max(0, parsed.currentTime),
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

export function readLessonProgress(lessonId: string): PracticeProgress | null {
  const progress = readPracticeProgress();
  if (progress?.lessonId !== lessonId) return null;
  return progress;
}

export function writePracticeProgress(
  lesson: Pick<ShadowingLesson, "id">,
  currentTime: number,
) {
  if (typeof window === "undefined") return;

  const progress: PracticeProgress = {
    lessonId: lesson.id,
    currentTime: Math.max(0, currentTime),
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(
      PRACTICE_PROGRESS_KEY,
      JSON.stringify(progress),
    );
  } catch {
    // Ignore storage failures so playback is never blocked by private mode.
  }
}
