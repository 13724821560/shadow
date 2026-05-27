import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Headphones, Library, Mic2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { mockShadowingLessons } from "@/lib/mock-shadowing";

export default function Home() {
  const featuredLesson = mockShadowingLessons[0];

  return (
    <main className="min-h-[100dvh] px-4 py-5 text-zinc-950 md:px-6 md:py-8">
      <div className="mx-auto max-w-[1320px]">
        <nav className="flex items-center justify-between rounded-full border border-white/70 bg-white/70 px-4 py-3 shadow-[0_18px_60px_rgb(39_39_42/0.08)] backdrop-blur-xl md:px-5">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-9 items-center justify-center rounded-full bg-zinc-950 text-white">
              <Headphones className="size-4" />
            </span>
            Shadowing
          </Link>
          <div className="hidden items-center gap-2 text-sm text-zinc-500 sm:flex">
            <Library className="size-4" />
            {mockShadowingLessons.length} 个精选练习
          </div>
        </nav>

        <section className="grid gap-8 py-10 md:py-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)] lg:items-center">
          <div className="max-w-3xl">
            <Badge className="border border-indigo-100 bg-white/80 text-indigo-700 shadow-sm">
              极简英语视频跟读
            </Badge>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-zinc-950 md:text-7xl">
              轻松练英语
              <span className="block text-zinc-500">影子跟读</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
              一句一句听、一句一句跟读。视频、双语字幕、单句循环和录音回放放在同一个安静的练习空间里。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/shadowing/${featuredLesson.id}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-medium text-white shadow-[0_18px_40px_rgb(24_24_27/0.18)] transition hover:bg-zinc-800"
              >
                开始第一个练习
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#lessons"
                className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white/70 px-6 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white"
              >
                浏览全部素材
              </a>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm text-zinc-500">
              {["自动高亮", "单句循环", "跟读录音"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/70 bg-white/60 px-4 py-3 shadow-sm backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Link
            href={`/shadowing/${featuredLesson.id}`}
            className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-3 shadow-[0_30px_90px_rgb(39_39_42/0.16)] backdrop-blur-xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-zinc-100">
              <Image
                src={featuredLesson.coverUrl}
                alt={featuredLesson.title}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/58 via-zinc-950/8 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
                    {featuredLesson.level}
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
                    {featuredLesson.durationLabel}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold leading-tight">
                  {featuredLesson.title}
                </h2>
                <p className="mt-2 text-sm text-white/80">
                  {featuredLesson.titleZh}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-2 pb-1 pt-4">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Mic2 className="size-4 text-indigo-500" />
                视频影子跟读练习
              </div>
              <span className="flex size-10 items-center justify-center rounded-full bg-zinc-950 text-white transition group-hover:translate-x-0.5">
                <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        </section>

        <section id="lessons" className="pb-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-indigo-700">Lessons</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
                选择一段开始跟读
              </h2>
            </div>
            <p className="hidden text-sm text-zinc-500 sm:block">
              共 {mockShadowingLessons.length} 个练习
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {mockShadowingLessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/shadowing/${lesson.id}`}
              className="group overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/82 shadow-[0_18px_55px_rgb(39_39_42/0.09)] backdrop-blur transition hover:-translate-y-1 hover:border-indigo-100 hover:shadow-[0_24px_70px_rgb(39_39_42/0.14)]"
            >
              <div className="relative aspect-[1.45] overflow-hidden bg-zinc-100">
                <Image
                  src={lesson.coverUrl}
                  alt={lesson.title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority={lesson.id === "deep-work-routine"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/38 via-transparent to-transparent opacity-90" />
                <div className="absolute left-4 top-4">
                  <Badge className="border border-white/40 bg-white/85 text-zinc-800 shadow-sm backdrop-blur">
                    {lesson.level}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-zinc-950/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                  <Clock className="size-3.5" />
                  {lesson.durationLabel}
                </div>
              </div>

              <div className="p-5">
                <h2 className="line-clamp-2 text-xl font-semibold leading-7 text-zinc-950">
                  {lesson.title}
                </h2>
                <p className="mt-2 line-clamp-1 text-sm text-zinc-500">
                  {lesson.titleZh}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {lesson.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-zinc-100/80 text-zinc-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 text-sm font-medium text-zinc-950">
                  <span>开始跟读</span>
                  <span className="flex size-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition group-hover:bg-zinc-950 group-hover:text-white">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
          </div>
        </section>
      </div>
    </main>
  );
}
