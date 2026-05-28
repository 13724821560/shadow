"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import type { ShadowingLesson } from "@/lib/mock-shadowing";
import { cn } from "@/lib/utils";

type LessonCategory = "All" | ShadowingLesson["category"];

type LessonBrowserProps = {
  lessons: ShadowingLesson[];
};

const categories: LessonCategory[] = [
  "All",
  "Daily",
  "Work",
  "Social",
  "Learning",
];

function LessonSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/46 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="aspect-[1.45] rounded-[1.35rem] bg-zinc-200/70 shimmer dark:bg-white/10" />
      <div className="space-y-3 px-2 py-4">
        <div className="h-5 w-4/5 rounded-full bg-zinc-200/70 shimmer dark:bg-white/10" />
        <div className="h-4 w-2/3 rounded-full bg-zinc-200/70 shimmer dark:bg-white/10" />
        <div className="h-8 w-full rounded-full bg-zinc-200/70 shimmer dark:bg-white/10" />
      </div>
    </div>
  );
}

export function LessonBrowser({ lessons }: LessonBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<LessonCategory>("All");
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesCategory =
        activeCategory === "All" || lesson.category === activeCategory;
      const searchableText = [
        lesson.title,
        lesson.titleZh,
        lesson.level,
        lesson.category,
        ...lesson.tags,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        searchableText.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, lessons, normalizedQuery]);

  return (
    <section id="lessons" className="pb-16">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
            Explore lessons
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl dark:text-zinc-50">
            Pick a clip and start looping
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            当前显示 {filteredLessons.length} / {lessons.length} 个练习
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[580px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索标题、中文标题或标签"
              className="h-12 w-full rounded-full border border-white/80 bg-white/82 px-11 text-sm text-zinc-900 shadow-[0_14px_45px_rgb(39_39_42/0.08)] outline-none backdrop-blur placeholder:text-zinc-400 focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100/70 dark:border-white/10 dark:bg-white/8 dark:text-zinc-50 dark:focus:ring-indigo-400/20"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-700 dark:bg-white/10 dark:text-zinc-300"
                aria-label="清空搜索"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "h-10 shrink-0 rounded-full border px-4 text-sm font-medium shadow-sm transition hover:-translate-y-0.5",
                  activeCategory === category
                    ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                    : "border-white/80 bg-white/72 text-zinc-600 backdrop-blur hover:bg-white hover:text-zinc-950 dark:border-white/10 dark:bg-white/7 dark:text-zinc-300 dark:hover:bg-white/12 dark:hover:text-white",
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-5 opacity-55 sm:grid-cols-2 xl:grid-cols-4">
        {filteredLessons.length === 0
          ? null
          : Array.from({ length: Math.min(4, filteredLessons.length) }).map(
              (_, index) => <LessonSkeleton key={index} />,
            )}
      </div>

      {filteredLessons.length > 0 ? (
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {filteredLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: index * 0.03 }}
            >
              <Link
                href={`/shadowing/${lesson.id}`}
                className="group block overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/82 shadow-[0_18px_55px_rgb(39_39_42/0.09)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-indigo-100 hover:shadow-[0_28px_85px_rgb(39_39_42/0.16)] dark:border-white/10 dark:bg-white/7 dark:hover:border-indigo-300/20"
              >
                <div className="relative aspect-[1.45] overflow-hidden bg-zinc-100">
                  <Image
                    src={lesson.coverUrl}
                    alt={lesson.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.06]"
                    priority={lesson.id === "deep-work-routine"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/12 to-transparent opacity-90" />
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/18 to-transparent" />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <Badge className="border border-white/40 bg-white/86 text-zinc-800 shadow-sm backdrop-blur">
                      {lesson.level}
                    </Badge>
                    <Badge className="border border-white/40 bg-white/86 text-zinc-800 shadow-sm backdrop-blur">
                      {lesson.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-zinc-950/72 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                    <Clock className="size-3.5" />
                    {lesson.durationLabel}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-2 text-xl font-semibold leading-7 text-zinc-950 dark:text-zinc-50">
                    {lesson.title}
                  </h3>
                  <p className="mt-2 line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {lesson.titleZh}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {lesson.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-zinc-100/80 text-zinc-600 dark:bg-white/9 dark:text-zinc-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 text-sm font-medium text-zinc-950 dark:border-white/10 dark:text-zinc-50">
                    <span>开始跟读</span>
                    <span className="flex size-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition group-hover:bg-zinc-950 group-hover:text-white dark:bg-white/10 dark:text-zinc-200 dark:group-hover:bg-white dark:group-hover:text-zinc-950">
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="rounded-[1.9rem] border border-white/80 bg-white/78 px-6 py-16 text-center shadow-[0_18px_55px_rgb(39_39_42/0.08)] backdrop-blur dark:border-white/10 dark:bg-white/7">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-300">
            <Search className="size-6" />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            没有找到匹配的跟读素材
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            换一个关键词，或切回 All 分类看看。当前仍是前端 mock 内容，后续可以继续手动添加素材。
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveCategory("All");
            }}
            className="mt-6 h-11 rounded-full bg-zinc-950 px-5 text-sm font-medium text-white shadow-[0_14px_35px_rgb(24_24_27/0.16)] transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            清空筛选
          </button>
        </div>
      )}
    </section>
  );
}
