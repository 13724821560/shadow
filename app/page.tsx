import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { mockShadowingLessons } from "@/lib/mock-shadowing";

export default function Home() {
  return (
    <main className="min-h-[100dvh] px-4 py-8 text-zinc-950 md:px-6 md:py-12">
      <div className="mx-auto max-w-[1320px]">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Badge>Phase 1.5 Mock Lessons</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Minimal Shadowing
            </h1>
            <p className="mt-4 text-sm leading-6 text-zinc-500 md:text-base">
              选择一个 mock 视频开始练习。当前版本只使用本地 mock 数据，方便替换视频、封面和双语字幕。
            </p>
          </div>
          <p className="text-sm text-zinc-500">
            共 {mockShadowingLessons.length} 个练习
          </p>
        </header>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {mockShadowingLessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/shadowing/${lesson.id}`}
              className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="relative aspect-video overflow-hidden bg-zinc-100">
                <Image
                  src={lesson.coverUrl}
                  alt={lesson.title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority={lesson.id === "deep-work-routine"}
                />
                <div className="absolute left-3 top-3">
                  <Badge>{lesson.level}</Badge>
                </div>
                <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-zinc-950/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                  <Clock className="size-3.5" />
                  {lesson.durationLabel}
                </div>
              </div>

              <div className="p-4">
                <h2 className="line-clamp-2 text-lg font-semibold leading-6 text-zinc-950">
                  {lesson.title}
                </h2>
                <p className="mt-2 line-clamp-1 text-sm text-zinc-500">
                  {lesson.titleZh}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {lesson.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 text-sm font-medium text-indigo-600">
                  <span>开始跟读</span>
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
