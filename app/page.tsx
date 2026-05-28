import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Captions,
  CheckCircle2,
  Github,
  Play,
  Sparkles,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { ContinuePracticeCard } from "@/components/continue-practice-card";
import { DailyGoalCard } from "@/components/daily-goal-card";
import { LessonBrowser } from "@/components/lesson-browser";
import { Badge } from "@/components/ui/badge";
import { mockShadowingLessons } from "@/lib/mock-shadowing";

export default function Home() {
  const featuredLesson = mockShadowingLessons[0];

  return (
    <main className="min-h-[100dvh] overflow-hidden px-4 py-5 text-zinc-950 md:px-6 md:py-8 dark:text-zinc-50">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_20%_12%,rgba(255,255,255,0.95),transparent_22rem),radial-gradient(circle_at_78%_18%,rgba(199,210,254,0.45),transparent_24rem)] dark:bg-[radial-gradient(circle_at_20%_12%,rgba(255,255,255,0.08),transparent_22rem),radial-gradient(circle_at_78%_18%,rgba(129,140,248,0.16),transparent_24rem)]" />

      <div className="mx-auto max-w-[1320px]">
        <nav className="sticky top-4 z-20 flex items-center justify-between rounded-full border border-white/70 bg-white/72 px-3 py-3 shadow-[0_18px_60px_rgb(39_39_42/0.08)] backdrop-blur-2xl md:px-5 dark:border-white/10 dark:bg-zinc-900/62 dark:shadow-[0_18px_70px_rgb(0_0_0/0.24)]">
          <Link href="/" aria-label="EchoLoop home">
            <BrandMark />
          </Link>

          <div className="hidden items-center gap-7 text-sm font-medium text-zinc-500 md:flex dark:text-zinc-400">
            <a className="transition hover:text-zinc-950 dark:hover:text-white" href="#lessons">
              Explore
            </a>
            <a className="transition hover:text-zinc-950 dark:hover:text-white" href="#about">
              About
            </a>
            <a
              className="inline-flex items-center gap-2 transition hover:text-zinc-950 dark:hover:text-white"
              href="https://github.com/13724821560/shadow"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="size-4" />
              GitHub
            </a>
          </div>

          <Link
            href={`/shadowing/${featuredLesson.id}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 text-sm font-medium text-white shadow-[0_16px_36px_rgb(24_24_27/0.18)] transition hover:-translate-y-0.5 hover:bg-zinc-800 md:px-5 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Start Shadowing
            <ArrowRight className="hidden size-4 sm:block" />
          </Link>
        </nav>

        <ContinuePracticeCard lessons={mockShadowingLessons} />
        <DailyGoalCard />

        <section className="grid gap-10 pb-14 pt-12 md:pt-18 lg:grid-cols-[minmax(0,0.95fr)_minmax(440px,0.85fr)] lg:items-center">
          <div className="max-w-3xl">
            <Badge className="border border-white/70 bg-white/80 px-3 py-1 text-zinc-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/8 dark:text-zinc-200">
              <Sparkles className="mr-1 size-3.5 text-indigo-500" />
              Minimal English Shadowing Tool
            </Badge>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight text-zinc-950 md:text-7xl dark:text-zinc-50">
              Learn English Naturally Through Shadowing
            </h1>
            <p className="mt-6 text-3xl font-medium tracking-tight text-zinc-500 md:text-4xl dark:text-zinc-400">
              One sentence at a time.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 md:text-lg dark:text-zinc-300">
              用视频影子跟读，把英语开口变成每天几分钟的小习惯。听一句、跟一句、录下来回放，让语感在重复里长出来。
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/shadowing/${featuredLesson.id}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-medium text-white shadow-[0_18px_40px_rgb(24_24_27/0.18)] transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                开始跟读
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#lessons"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/80 bg-white/72 px-6 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/8 dark:text-zinc-200 dark:hover:bg-white/12"
              >
                Browse lessons
              </a>
            </div>

            <div id="about" className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                "Built for daily English speaking practice",
                "Shadowing • Listening • Speaking",
                "Minimal & focused",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.35rem] border border-white/70 bg-white/58 px-4 py-3 text-sm font-medium leading-6 text-zinc-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/6 dark:text-zinc-300"
                >
                  <CheckCircle2 className="mb-2 size-4 text-indigo-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Link
            href={`/shadowing/${featuredLesson.id}`}
            className="group relative min-h-[520px] overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/72 p-3 shadow-[0_32px_100px_rgb(39_39_42/0.18)] backdrop-blur-2xl transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/7 dark:shadow-[0_32px_110px_rgb(0_0_0/0.35)]"
          >
            <div className="absolute -left-8 top-20 hidden w-52 rounded-[1.5rem] border border-white/80 bg-white/88 p-4 shadow-[0_24px_70px_rgb(39_39_42/0.16)] backdrop-blur-xl lg:block dark:border-white/10 dark:bg-zinc-900/88">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-500">
                Current sentence
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
                If you can spend one hour building your own dream...
              </p>
            </div>

            <div className="absolute -right-5 bottom-20 hidden w-48 rounded-[1.5rem] border border-white/80 bg-white/88 p-4 shadow-[0_24px_70px_rgb(39_39_42/0.16)] backdrop-blur-xl lg:block dark:border-white/10 dark:bg-zinc-900/88">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-950 dark:text-zinc-50">
                <span className="relative flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-50" />
                  <span className="relative inline-flex size-3 rounded-full bg-red-500" />
                </span>
                Recording
              </div>
              <div className="mt-4 flex h-8 items-end gap-1">
                {[18, 28, 16, 31, 22, 35, 20, 27].map((height, index) => (
                  <span
                    key={index}
                    className="w-2 rounded-full bg-indigo-500/80"
                    style={{ height }}
                  />
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.8rem] bg-zinc-950 shadow-inner">
              <div className="flex h-10 items-center gap-2 border-b border-white/10 px-4">
                <span className="size-3 rounded-full bg-red-400" />
                <span className="size-3 rounded-full bg-amber-300" />
                <span className="size-3 rounded-full bg-emerald-400" />
                <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                  EchoLoop Player
                </span>
              </div>
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={featuredLesson.coverUrl}
                  alt={featuredLesson.title}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover opacity-86 transition duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-16 items-center justify-center rounded-full bg-white/92 text-zinc-950 shadow-[0_18px_45px_rgb(0_0_0/0.28)]">
                    <Play className="size-7 translate-x-0.5" fill="currentColor" />
                  </span>
                </div>
              </div>
              <div className="space-y-3 bg-zinc-950 px-5 py-5 text-white">
                <div className="flex items-center gap-2 text-xs text-white/46">
                  <Captions className="size-4 text-indigo-300" />
                  00:05 → 00:11
                </div>
                <p className="text-lg font-semibold leading-7">
                  One of the most powerful ideas is bringing your ideal future into the now.
                </p>
                <p className="text-sm leading-6 text-white/55">
                  最有力量的练习，是把理想中的表达带到当下。
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[1.5rem] border border-white/70 bg-white/72 px-5 py-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/7">
              <div>
                <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {featuredLesson.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {featuredLesson.level} · {featuredLesson.durationLabel} · {featuredLesson.category}
                </p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-full bg-zinc-950 text-white transition group-hover:translate-x-0.5 dark:bg-white dark:text-zinc-950">
                <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        </section>

        <LessonBrowser lessons={mockShadowingLessons} />
      </div>
    </main>
  );
}
