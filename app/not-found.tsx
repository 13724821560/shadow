import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-indigo-600">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          没有找到这个练习
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          当前 MVP 只包含一个 mock shadowing 视频。
        </p>
        <Button asChild className="mt-6">
          <Link href="/shadowing/deep-work-routine">打开示例练习</Link>
        </Button>
      </div>
    </main>
  );
}
