"use client";

import { ArrowRight, Clock3, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { ShadowingLesson } from "@/lib/mock-shadowing";
import {
  readPracticeProgress,
  type PracticeProgress,
} from "@/lib/practice-progress";
import { formatTime } from "@/lib/subtitle-utils";

type ContinuePracticeCardProps = {
  lessons: ShadowingLesson[];
};

function formatLastPracticeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "刚刚练习过";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60_000));

  if (diffMinutes < 1) return "刚刚练习过";
  if (diffMinutes < 60) return `${diffMinutes} 分钟前练习`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} 小时前练习`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} 天前练习`;

  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });
}

export function ContinuePracticeCard({ lessons }: ContinuePracticeCardProps) {
  const [progress, setProgress] = useState<PracticeProgress | null>(null);

  useEffect(() => {
    setProgress(readPracticeProgress());
  }, []);

  const lesson = useMemo(() => {
    if (!progress) return null;
    return lessons.find((item) => item.id === progress.lessonId) ?? null;
  }, [lessons, progress]);

  if (!progress || !lesson) return null;

  return (
    <section className="pt-6">
      <div className="rounded-[2rem] border border-white/80 bg-white/74 p-4 shadow-[0_20px_70px_rgb(39_39_42/0.10)] backdrop-blur-2xl md:flex md:items-center md:justify-between md:gap-6 md:p-5 dark:border-white/10 dark:bg-white/7 dark:shadow-[0_20px_80px_rgb(0_0_0/0.26)]">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-300/12 dark:text-indigo-200">
            <RotateCcw className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500 dark:text-indigo-300">
              Continue Practice
            </p>
            <h2 className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {lesson.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-4" />
                {formatLastPracticeTime(progress.updatedAt)}
              </span>
              <span className="text-zinc-300 dark:text-zinc-600">·</span>
              <span>上次停在 {formatTime(progress.currentTime)}</span>
            </div>
          </div>
        </div>

        <Link
          href={`/shadowing/${lesson.id}`}
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-medium text-white shadow-[0_16px_36px_rgb(24_24_27/0.18)] transition hover:-translate-y-0.5 hover:bg-zinc-800 md:mt-0 md:w-auto dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Continue
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
