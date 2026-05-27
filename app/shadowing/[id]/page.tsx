import { notFound } from "next/navigation";

import { ShadowingPlayer } from "@/components/shadowing-player";
import { getShadowingLesson, mockShadowingLessons } from "@/lib/mock-shadowing";

type ShadowingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return mockShadowingLessons.map((lesson) => ({
    id: lesson.id,
  }));
}

export default async function ShadowingPage({ params }: ShadowingPageProps) {
  const { id } = await params;
  const lesson = getShadowingLesson(id);

  if (!lesson) {
    notFound();
  }

  return <ShadowingPlayer lesson={lesson} />;
}
