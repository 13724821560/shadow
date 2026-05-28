"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Command, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { BrandMark } from "@/components/brand-mark";
import type { ShadowingLesson } from "@/lib/mock-shadowing";
import { cn } from "@/lib/utils";

type CommandMenuProps = {
  lessons: ShadowingLesson[];
};

export function CommandMenu({ lessons }: CommandMenuProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalizedQuery) return lessons.slice(0, 5);

    return lessons.filter((lesson) => {
      const text = [
        lesson.title,
        lesson.titleZh,
        lesson.category,
        lesson.level,
        ...lesson.tags,
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(normalizedQuery);
    });
  }, [lessons, normalizedQuery]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [open]);

  const goToLesson = (lesson: ShadowingLesson) => {
    setOpen(false);
    router.push(`/shadowing/${lesson.id}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-30 hidden h-11 items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 text-sm font-medium text-zinc-600 shadow-[0_18px_55px_rgb(24_24_27/0.14)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white hover:text-zinc-950 dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:bg-zinc-900 md:inline-flex"
        aria-label="Open command menu"
      >
        <Command className="size-4" />
        <span>Search</span>
        <kbd className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500 dark:bg-white/10 dark:text-zinc-300">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/28 px-4 pt-[12vh] backdrop-blur-sm dark:bg-zinc-950/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/70 bg-[#fbfaf7]/92 shadow-[0_35px_120px_rgb(24_24_27/0.28)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/92"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-zinc-200/70 px-5 py-4 dark:border-white/10">
                <BrandMark />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex size-9 items-center justify-center rounded-full bg-white/80 text-zinc-500 shadow-sm transition hover:text-zinc-950 dark:bg-white/10 dark:text-zinc-300"
                  aria-label="Close command menu"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="relative px-5 py-4">
                <Search className="pointer-events-none absolute left-9 top-1/2 size-5 -translate-y-1/2 text-zinc-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search lessons by title, tag, level..."
                  className="h-14 w-full rounded-full border border-white/80 bg-white/88 px-12 text-base text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100/70 dark:border-white/10 dark:bg-white/8 dark:text-zinc-50 dark:focus:ring-indigo-400/20"
                />
              </div>

              <div className="max-h-[420px] overflow-y-auto px-3 pb-3">
                {results.length ? (
                  results.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => goToLesson(lesson)}
                      className={cn(
                        "group flex w-full items-center justify-between gap-4 rounded-3xl px-4 py-4 text-left transition hover:bg-white/82 dark:hover:bg-white/8",
                        index === 0 && !query
                          ? "bg-white/55 shadow-sm dark:bg-white/5"
                          : "",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                          {lesson.title}
                        </span>
                        <span className="mt-1 block truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {lesson.titleZh} · {lesson.level} · {lesson.category}
                        </span>
                      </span>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white opacity-0 transition group-hover:opacity-100 dark:bg-white dark:text-zinc-950">
                        <ArrowRight className="size-4" />
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-white/10">
                      <Search className="size-5" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-zinc-950 dark:text-zinc-50">
                      No matching lesson
                    </p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Try another keyword or tag.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
