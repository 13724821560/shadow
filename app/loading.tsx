export default function Loading() {
  return (
    <main className="min-h-[100dvh] px-4 py-5 md:px-6 md:py-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="h-16 rounded-full border border-white/70 bg-white/60 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)]">
          <div className="space-y-5">
            <div className="h-8 w-44 rounded-full bg-zinc-200/70 shimmer dark:bg-white/10" />
            <div className="h-20 w-4/5 rounded-[2rem] bg-zinc-200/70 shimmer dark:bg-white/10" />
            <div className="h-20 w-2/3 rounded-[2rem] bg-zinc-200/70 shimmer dark:bg-white/10" />
            <div className="h-12 w-48 rounded-full bg-zinc-200/70 shimmer dark:bg-white/10" />
          </div>
          <div className="aspect-[4/3] rounded-[2rem] bg-zinc-200/70 shimmer dark:bg-white/10" />
        </div>
      </div>
    </main>
  );
}
