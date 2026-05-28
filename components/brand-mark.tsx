import { Captions, Radio } from "lucide-react";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  compact?: boolean;
  className?: string;
};

export function BrandMark({ compact = false, className }: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex size-10 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-[0_18px_45px_rgb(24_24_27/0.18)] dark:bg-white dark:text-zinc-950">
        <Radio className="size-[18px]" />
        <Captions className="absolute -bottom-1 -right-1 size-4 rounded-full bg-indigo-500 p-0.5 text-white ring-2 ring-white dark:ring-zinc-950" />
      </span>
      {!compact ? (
        <span className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          EchoLoop
        </span>
      ) : null}
    </span>
  );
}
