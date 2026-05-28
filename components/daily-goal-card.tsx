"use client";

import { Flame, Target } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getDailyGoalProgress,
  getDailyGoalStats,
  type DailyGoalProgress,
} from "@/lib/daily-goal";

export function DailyGoalCard() {
  const [progress, setProgress] = useState<DailyGoalProgress | null>(null);

  useEffect(() => {
    setProgress(getDailyGoalProgress());
  }, []);

  const stats = getDailyGoalStats(progress ?? undefined);

  return (
    <section className="pt-4">
      <div className="rounded-[2rem] border border-white/80 bg-white/68 p-4 shadow-[0_18px_62px_rgb(39_39_42/0.09)] backdrop-blur-2xl md:p-5 dark:border-white/10 dark:bg-white/7 dark:shadow-[0_20px_80px_rgb(0_0_0/0.22)]">
        <div className="flex items-start justify-between gap-5">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm dark:bg-amber-300/12 dark:text-amber-200">
              <Target className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
                Daily Goal
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                今日目标：5 句跟读
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Keep your English flowing today ✨
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_34px_rgb(24_24_27/0.14)] dark:bg-white dark:text-zinc-950">
            {stats.completedCount} / {stats.targetCount}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <Flame className="size-3.5 text-amber-500" />
              已完成
            </span>
            <span>{stats.percent}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-zinc-100 shadow-inner dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-indigo-500 transition-[width] duration-500 ease-out"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
