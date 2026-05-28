const DAILY_GOAL_KEY = "echoloop:daily-goal";
export const DAILY_GOAL_TARGET = 5;

export type DailyGoalProgress = {
  date: string;
  completedSentenceKeys: string[];
};

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createEmptyDailyGoal(): DailyGoalProgress {
  return {
    date: getTodayKey(),
    completedSentenceKeys: [],
  };
}

function normalizeDailyGoal(
  value: Partial<DailyGoalProgress> | null,
): DailyGoalProgress {
  const today = getTodayKey();

  if (
    !value ||
    value.date !== today ||
    !Array.isArray(value.completedSentenceKeys)
  ) {
    return createEmptyDailyGoal();
  }

  return {
    date: today,
    completedSentenceKeys: value.completedSentenceKeys.filter(
      (item): item is string => typeof item === "string",
    ),
  };
}

export function getDailyGoalProgress(): DailyGoalProgress {
  if (typeof window === "undefined") return createEmptyDailyGoal();

  try {
    const rawValue = window.localStorage.getItem(DAILY_GOAL_KEY);
    const parsed = rawValue
      ? (JSON.parse(rawValue) as Partial<DailyGoalProgress>)
      : null;
    const progress = normalizeDailyGoal(parsed);

    if (rawValue && progress.date !== parsed?.date) {
      window.localStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(progress));
    }

    return progress;
  } catch {
    return createEmptyDailyGoal();
  }
}

export function addCompletedSentence(
  lessonId: string,
  subtitleId: number | string,
): DailyGoalProgress {
  const progress = getDailyGoalProgress();
  const sentenceKey = `${lessonId}:${subtitleId}`;

  if (progress.completedSentenceKeys.includes(sentenceKey)) {
    return progress;
  }

  const nextProgress: DailyGoalProgress = {
    ...progress,
    completedSentenceKeys: [...progress.completedSentenceKeys, sentenceKey],
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(nextProgress));
    } catch {
      // Ignore storage failures so shadowing practice keeps working.
    }
  }

  return nextProgress;
}

export function getDailyGoalStats(progress = getDailyGoalProgress()) {
  const completedCount = progress.completedSentenceKeys.length;

  return {
    completedCount,
    targetCount: DAILY_GOAL_TARGET,
    percent: Math.min(100, Math.round((completedCount / DAILY_GOAL_TARGET) * 100)),
  };
}
