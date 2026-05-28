"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Gauge,
  Mic,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Share2,
  Square,
  Waves,
} from "lucide-react";
import { toPng } from "html-to-image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BrandMark } from "@/components/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addCompletedSentence } from "@/lib/daily-goal";
import {
  formatSubtitleTime,
  type ShadowingLesson,
  type ShadowingSubtitle,
} from "@/lib/mock-shadowing";
import {
  readLessonProgress,
  writePracticeProgress,
} from "@/lib/practice-progress";
import { findActiveSubtitleIndex } from "@/lib/subtitle-utils";
import { cn } from "@/lib/utils";

type ShadowingPlayerProps = {
  lesson: ShadowingLesson;
};

const PLAYBACK_RATES = [1, 0.75, 0.5] as const;

export function ShadowingPlayer({ lesson }: ShadowingPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingStartedAtRef = useRef<number | null>(null);
  const isUserScrollingRef = useRef(false);
  const userScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIndexRef = useRef(0);
  const recordingUrlRef = useRef("");
  const loopSeekLockRef = useRef(false);
  const restoredProgressRef = useRef(false);
  const lastProgressSavedAtRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    lesson.subtitles.length ? 0 : -1,
  );
  const [loopSentence, setLoopSentence] = useState(false);
  const [playbackRate, setPlaybackRate] =
    useState<(typeof PLAYBACK_RATES)[number]>(1);
  const [recordingState, setRecordingState] = useState<
    "idle" | "recording" | "ready"
  >("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [recordingMimeType, setRecordingMimeType] = useState("");
  const [micError, setMicError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);

  const subtitles = lesson.subtitles;
  const activeSubtitle = subtitles[activeIndex] ?? null;

  const findActiveIndex = useCallback(
    (time: number) => findActiveSubtitleIndex(subtitles, time),
    [subtitles],
  );

  const updateActiveIndex = useCallback((nextIndex: number) => {
    if (activeIndexRef.current === nextIndex) return;
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  }, []);

  const seekToSubtitle = useCallback(
    async (subtitle: ShadowingSubtitle) => {
      const video = videoRef.current;
      if (!video) return;

      video.currentTime = subtitle.start;
      updateActiveIndex(findActiveIndex(subtitle.start));

      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    },
    [findActiveIndex, updateActiveIndex],
  );

  const jumpSentence = useCallback(
    (delta: number) => {
      if (!subtitles.length) return;
      const baseIndex = activeIndex >= 0 ? activeIndex : 0;
      const nextIndex = Math.min(
        subtitles.length - 1,
        Math.max(0, baseIndex + delta),
      );
      void seekToSubtitle(subtitles[nextIndex]);
    },
    [activeIndex, seekToSubtitle, subtitles],
  );

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
    }
  };

  const cyclePlaybackRate = () => {
    const currentIndex = PLAYBACK_RATES.indexOf(playbackRate);
    const nextRate = PLAYBACK_RATES[(currentIndex + 1) % PLAYBACK_RATES.length];
    setPlaybackRate(nextRate);

    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const downloadShareImage = async () => {
    const shareCard = shareCardRef.current;
    if (!shareCard) return;

    setIsGeneratingShare(true);
    try {
      const dataUrl = await toPng(shareCard, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `echoloop-${lesson.id}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const stopMediaTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const revokeRecordingUrl = useCallback(() => {
    setRecordingUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      recordingUrlRef.current = "";
      return "";
    });
  }, []);

  const startRecording = async () => {
    setMicError("");

    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setMicError(
        "当前浏览器不支持 MediaRecorder 录音。请使用最新版 Chrome、Edge 或 Safari。",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      const candidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
        "audio/ogg",
      ];
      const mimeType = candidates.find((type) =>
        MediaRecorder.isTypeSupported(type),
      );
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );

      streamRef.current = stream;
      chunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const type = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        const url = URL.createObjectURL(blob);

        recordingUrlRef.current = url;
        setRecordingUrl(url);
        setRecordingMimeType(type);
        setRecordingState("ready");
        stopMediaTracks();
      };

      recorder.start();
      recordingStartedAtRef.current = Date.now();
      setRecordingSeconds(0);
      setRecordingState("recording");
      revokeRecordingUrl();
      setRecordingMimeType("");
    } catch (error) {
      stopMediaTracks();
      setRecordingState("idle");
      const name = error instanceof DOMException ? error.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setMicError(
          "麦克风权限已被拒绝。请在浏览器地址栏允许麦克风权限后，再点击“跟读录音”。",
        );
        return;
      }
      if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setMicError("没有检测到可用麦克风。请连接麦克风后再试一次。");
        return;
      }
      if (name === "NotReadableError" || name === "TrackStartError") {
        setMicError(
          "麦克风正被其他应用占用。请关闭占用麦克风的应用后再试一次。",
        );
        return;
      }
      setMicError("无法访问麦克风。请检查系统和浏览器的麦克风权限后再试一次。");
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    recordingStartedAtRef.current = null;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    writePracticeProgress(lesson, videoRef.current?.currentTime ?? 0);
  }, [lesson]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId = 0;

    const tick = () => {
      const time = video.currentTime;
      const index = findActiveIndex(time);
      updateActiveIndex(index);

      if (loopSentence && subtitles[index]) {
        const subtitle = subtitles[index];
        if (time < subtitle.end - 0.2) {
          loopSeekLockRef.current = false;
        }
        if (!loopSeekLockRef.current && time >= subtitle.end - 0.05) {
          loopSeekLockRef.current = true;
          video.currentTime = subtitle.start;
          updateActiveIndex(index);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const startTicking = () => {
      setIsPlaying(true);
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    };
    const stopTicking = () => {
      setIsPlaying(false);
      cancelAnimationFrame(rafId);
      updateActiveIndex(findActiveIndex(video.currentTime));
    };
    const syncAfterSeek = () => {
      loopSeekLockRef.current = false;
      updateActiveIndex(findActiveIndex(video.currentTime));

      const now = Date.now();
      if (now - lastProgressSavedAtRef.current > 1200) {
        lastProgressSavedAtRef.current = now;
        writePracticeProgress(lesson, video.currentTime);
      }
    };
    const restoreProgress = () => {
      if (restoredProgressRef.current) return;
      restoredProgressRef.current = true;

      const progress = readLessonProgress(lesson.id);
      if (!progress || progress.currentTime <= 0.5) {
        writePracticeProgress(lesson, video.currentTime);
        return;
      }

      const safeTime =
        Number.isFinite(video.duration) && video.duration > 0
          ? Math.min(progress.currentTime, Math.max(0, video.duration - 0.5))
          : progress.currentTime;

      video.currentTime = safeTime;
      updateActiveIndex(findActiveIndex(safeTime));
      writePracticeProgress(lesson, safeTime);
    };

    video.addEventListener("play", startTicking);
    video.addEventListener("playing", startTicking);
    video.addEventListener("pause", stopTicking);
    video.addEventListener("ended", stopTicking);
    video.addEventListener("loadedmetadata", restoreProgress);
    video.addEventListener("seeked", syncAfterSeek);
    video.addEventListener("timeupdate", syncAfterSeek);

    if (video.readyState >= 1) {
      restoreProgress();
    }

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("play", startTicking);
      video.removeEventListener("playing", startTicking);
      video.removeEventListener("pause", stopTicking);
      video.removeEventListener("ended", stopTicking);
      video.removeEventListener("loadedmetadata", restoreProgress);
      video.removeEventListener("seeked", syncAfterSeek);
      video.removeEventListener("timeupdate", syncAfterSeek);
    };
  }, [findActiveIndex, lesson, loopSentence, subtitles, updateActiveIndex]);

  useEffect(() => {
    if (isUserScrollingRef.current) return;

    activeItemRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeIndex]);

  useEffect(() => {
    const subtitle = subtitles[activeIndex];
    if (!subtitle) return;

    addCompletedSentence(lesson.id, subtitle.id);
  }, [activeIndex, lesson.id, subtitles]);

  useEffect(() => {
    const container = transcriptRef.current;
    if (!container) return;

    const handleScroll = () => {
      isUserScrollingRef.current = true;
      if (userScrollTimerRef.current) {
        clearTimeout(userScrollTimerRef.current);
      }
      userScrollTimerRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 1600);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (userScrollTimerRef.current) {
        clearTimeout(userScrollTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (recordingState !== "recording") return undefined;

    const timer = window.setInterval(() => {
      if (!recordingStartedAtRef.current) return;
      setRecordingSeconds(
        Math.floor((Date.now() - recordingStartedAtRef.current) / 1000),
      );
    }, 250);

    return () => window.clearInterval(timer);
  }, [recordingState]);

  useEffect(() => {
    return () => {
      stopMediaTracks();
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (recordingUrlRef.current) {
        URL.revokeObjectURL(recordingUrlRef.current);
      }
    };
  }, []);

  const controlLabel = useMemo(() => {
    if (recordingState === "recording") {
      return `录音中 ${recordingSeconds}s`;
    }
    if (recordingState === "ready") {
      return "已录制，可回放";
    }
    return "跟读录音";
  }, [recordingSeconds, recordingState]);

  return (
    <motion.main
      className="min-h-[100dvh] pb-64 text-zinc-950 md:pb-36 dark:text-zinc-50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: "easeOut" }}
    >
      <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-[1580px] flex-col gap-5 px-4 py-5 md:px-6 lg:grid lg:grid-cols-[minmax(0,1.18fr)_minmax(380px,0.82fr)]">
        <section className="flex min-h-0 flex-col gap-5">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                href="/"
                className="mb-4 inline-flex rounded-full border border-white/70 bg-white/65 px-3 py-2 shadow-sm backdrop-blur-xl transition hover:bg-white dark:border-white/10 dark:bg-white/7 dark:hover:bg-white/10"
              >
                <BrandMark />
              </Link>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                <Badge className="border border-indigo-100 bg-white/80 text-indigo-700 shadow-sm dark:border-indigo-300/20 dark:bg-indigo-300/12 dark:text-indigo-200">
                  {lesson.level}
                </Badge>
                {lesson.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-white/70 text-zinc-600 shadow-sm dark:bg-white/8 dark:text-zinc-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl dark:text-zinc-50">
                {lesson.title}
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {lesson.titleZh} · {lesson.author} · {lesson.durationLabel}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => void downloadShareImage()}
              disabled={isGeneratingShare}
              className="rounded-full border-white/70 bg-white/70 shadow-sm backdrop-blur hover:bg-white dark:border-white/10 dark:bg-white/7 dark:hover:bg-white/10"
            >
              <Share2 />
              {isGeneratingShare ? "生成中" : "分享练习"}
            </Button>
          </header>

          <div className="relative overflow-hidden rounded-[2rem] border border-zinc-950/10 bg-zinc-950 p-2 shadow-[0_30px_100px_rgb(24_24_27/0.24)] dark:border-white/10 dark:shadow-[0_30px_100px_rgb(0_0_0/0.42)]">
            <video
              ref={videoRef}
              className="aspect-video w-full rounded-[1.45rem] bg-black"
              controls
              playsInline
              preload="metadata"
              src={lesson.videoUrl}
              onLoadStart={() => {
                setIsVideoLoading(true);
                setVideoError("");
              }}
              onCanPlay={() => {
                setIsVideoLoading(false);
                setVideoError("");
              }}
              onError={() => {
                setIsVideoLoading(false);
                setVideoError(
                  "视频加载失败。请检查 mock 数据里的 videoUrl 是否可访问，或换成本地 public 目录下的视频。",
                );
              }}
            />

            {isVideoLoading && !videoError ? (
              <div className="pointer-events-none absolute inset-2 flex items-center justify-center rounded-[1.45rem] bg-zinc-950/88">
                <div className="w-full max-w-md px-8 text-center">
                  <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-white/10 text-white">
                    <Play className="size-6 translate-x-0.5" />
                  </div>
                  <div className="h-3 rounded-full bg-white/10 shimmer" />
                  <div className="mx-auto mt-3 h-3 w-2/3 rounded-full bg-white/10 shimmer" />
                  <p className="mt-5 text-sm text-white/58">Loading video...</p>
                </div>
              </div>
            ) : null}

            {videoError ? (
              <div className="absolute inset-2 flex items-center justify-center rounded-[1.45rem] bg-zinc-950/90 px-6 text-center">
                <div className="max-w-md">
                  <p className="text-sm font-semibold text-white">视频无法播放</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {videoError}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-[1.7rem] border border-white/80 bg-white/78 p-5 shadow-[0_18px_60px_rgb(39_39_42/0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
            <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-indigo-400">
              EchoLoop Shadowing
            </p>
            {activeSubtitle ? (
              <div className="mx-auto mt-3 max-w-3xl text-center">
                <p className="text-xl font-medium leading-9 text-zinc-950 dark:text-zinc-50">
                  {activeSubtitle.en}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {activeSubtitle.zh}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-center text-sm text-zinc-400">暂无字幕</p>
            )}
          </div>
        </section>

        <aside className="flex min-h-[520px] flex-col overflow-hidden rounded-[1.7rem] border border-white/80 bg-white/82 shadow-[0_24px_75px_rgb(39_39_42/0.10)] backdrop-blur-xl lg:max-h-[calc(100dvh-2.5rem)] dark:border-white/10 dark:bg-white/7 dark:shadow-[0_24px_90px_rgb(0_0_0/0.25)]">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-5 dark:border-white/10">
            <div>
              <p className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                双语字幕
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                点一句，视频就从那一句开始
              </p>
            </div>
            <Badge variant="outline" className="bg-white/70 dark:bg-white/8">
              {subtitles.length} 句
            </Badge>
          </div>

          <div
            ref={transcriptRef}
            className="flex-1 space-y-2 overflow-y-auto scroll-smooth px-3 py-4"
          >
            {subtitles.map((subtitle, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={subtitle.id}
                  ref={isActive ? activeItemRef : undefined}
                  type="button"
                  onClick={() => void seekToSubtitle(subtitle)}
                  className={cn(
                    "group relative w-full rounded-3xl border px-4 py-3.5 text-left transition duration-200",
                    isActive
                      ? "border-indigo-200 bg-indigo-50/82 shadow-[0_14px_38px_rgb(79_70_229/0.13)] ring-1 ring-indigo-100 dark:border-indigo-300/28 dark:bg-indigo-300/12 dark:ring-indigo-300/10"
                      : "border-transparent bg-transparent hover:border-zinc-100 hover:bg-white/70 dark:hover:border-white/10 dark:hover:bg-white/8",
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-2 top-5 h-10 w-1 rounded-full transition",
                      isActive ? "bg-indigo-500" : "bg-transparent",
                    )}
                  />
                  <div className="mb-2 flex items-center justify-between gap-3 pl-1 font-mono text-[11px] text-zinc-400">
                    <span>
                      {formatSubtitleTime(subtitle.start)} →{" "}
                      {formatSubtitleTime(subtitle.end)}
                    </span>
                    {loopSentence && isActive ? (
                      <span className="rounded-full bg-indigo-600 px-2 py-0.5 font-sans text-[10px] font-medium text-white">
                        循环中
                      </span>
                    ) : null}
                  </div>
                  <p
                    className={cn(
                      "text-[15px] leading-7 transition-colors",
                      isActive
                        ? "font-semibold text-zinc-950 dark:text-zinc-50"
                        : "text-zinc-700 dark:text-zinc-300",
                    )}
                  >
                    {subtitle.en}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-sm leading-6",
                      isActive
                        ? "text-zinc-600 dark:text-zinc-300"
                        : "text-zinc-400 dark:text-zinc-500",
                    )}
                  >
                    {subtitle.zh}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 px-3 pb-3 md:px-6 md:pb-5">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 rounded-[1.75rem] border border-white/75 bg-white/82 p-3 shadow-[0_24px_80px_rgb(24_24_27/0.20)] backdrop-blur-2xl md:flex-row md:items-center md:justify-between md:rounded-full md:px-4 dark:border-white/10 dark:bg-zinc-900/76 dark:shadow-[0_24px_90px_rgb(0_0_0/0.38)]">
          <div className="min-w-0 px-1 md:max-w-xs">
            <p className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-50">
              {activeSubtitle?.en ?? "准备开始跟读"}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {controlLabel} · 一句一句来
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button
              variant={playbackRate === 1 ? "outline" : "default"}
              size="sm"
              onClick={cyclePlaybackRate}
              className="rounded-full px-4 transition hover:-translate-y-0.5"
            >
              <Gauge />
              {playbackRate}x
            </Button>
            <Button
              variant={loopSentence ? "default" : "outline"}
              size="sm"
              onClick={() => setLoopSentence((current) => !current)}
              className="rounded-full px-4 transition hover:-translate-y-0.5"
            >
              <RotateCcw />
              单句循环
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="上一句"
              onClick={() => jumpSentence(-1)}
              disabled={activeIndex <= 0 || Boolean(videoError)}
              className="rounded-full bg-white/70 transition hover:-translate-y-0.5 dark:bg-white/8"
            >
              <ChevronLeft />
            </Button>
            <Button
              size="icon"
              aria-label={isPlaying ? "暂停" : "播放"}
              onClick={() => void togglePlay()}
              className="h-14 w-14 rounded-full shadow-[0_14px_32px_rgb(79_70_229/0.28)] transition hover:-translate-y-0.5"
              disabled={Boolean(videoError)}
            >
              {isPlaying ? <Pause /> : <Play className="translate-x-0.5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="下一句"
              onClick={() => jumpSentence(1)}
              disabled={activeIndex >= subtitles.length - 1 || Boolean(videoError)}
              className="rounded-full bg-white/70 transition hover:-translate-y-0.5 dark:bg-white/8"
            >
              <ChevronRight />
            </Button>
            {recordingState === "recording" ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={stopRecording}
                className="relative min-w-28 rounded-full px-4 shadow-[0_14px_34px_rgb(220_38_38/0.22)]"
              >
                <span className="absolute -inset-1 -z-10 rounded-full bg-red-500/25 blur-md" />
                <Square fill="currentColor" />
                停止 {recordingSeconds}s
              </Button>
            ) : (
              <Button
                variant={recordingState === "ready" ? "secondary" : "outline"}
                size="sm"
                onClick={() => void startRecording()}
                className="min-w-28 rounded-full bg-white/70 px-4 transition hover:-translate-y-0.5 dark:bg-white/8"
              >
                {recordingState === "ready" ? <Waves /> : <Mic />}
                {recordingState === "ready" ? "重新录制" : "跟读录音"}
              </Button>
            )}
          </div>

          {(recordingUrl || micError || recordingState === "recording") && (
            <div className="min-w-0 rounded-2xl bg-zinc-50/80 p-2 md:w-72 md:rounded-full dark:bg-white/8">
              {recordingState === "recording" ? (
                <div className="flex h-9 items-center justify-center gap-2 text-xs font-medium text-red-600 dark:text-red-300">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-55" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
                  </span>
                  Recording voice
                </div>
              ) : null}
              {recordingUrl ? (
                <audio
                  className="h-9 w-full rounded-full"
                  controls
                  src={recordingUrl}
                  title={recordingMimeType}
                />
              ) : null}
              {micError ? (
                <p className="px-2 text-xs leading-5 text-red-600 dark:text-red-300">
                  {micError}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none fixed -left-[9999px] top-0">
        <div
          ref={shareCardRef}
          className="flex h-[1200px] w-[900px] flex-col justify-between overflow-hidden rounded-[56px] bg-[#fbfaf7] p-14 text-zinc-950"
        >
          <div>
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-zinc-950 text-white shadow-[0_18px_40px_rgb(24_24_27/0.18)]">
                <Radio className="size-8" />
              </div>
              <div>
                <p className="text-4xl font-semibold tracking-tight">
                  EchoLoop
                </p>
                <p className="mt-1 text-lg text-zinc-500">
                  英语视频影子跟读
                </p>
              </div>
            </div>

            <div className="mt-20 rounded-[40px] border border-white bg-white/78 p-10 shadow-[0_28px_90px_rgb(39_39_42/0.12)]">
              <div className="mb-8 flex items-center gap-3">
                <span className="rounded-full bg-indigo-50 px-4 py-2 text-base font-medium text-indigo-700">
                  {lesson.level}
                </span>
                <span className="rounded-full bg-zinc-100 px-4 py-2 text-base font-medium text-zinc-600">
                  {lesson.durationLabel}
                </span>
              </div>
              <h1 className="text-5xl font-semibold leading-tight tracking-tight">
                {lesson.title}
              </h1>
              <p className="mt-4 text-2xl leading-9 text-zinc-500">
                {lesson.titleZh}
              </p>
            </div>

            <div className="mt-10 rounded-[40px] bg-zinc-950 p-10 text-white shadow-[0_30px_80px_rgb(24_24_27/0.22)]">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-200">
                Current Sentence
              </p>
              <p className="mt-8 text-4xl font-medium leading-[1.25]">
                {activeSubtitle?.en ?? "Start small, repeat daily."}
              </p>
              {activeSubtitle?.zh ? (
                <p className="mt-6 text-2xl leading-9 text-white/68">
                  {activeSubtitle.zh}
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-[36px] border border-white bg-white/72 p-8 shadow-[0_20px_60px_rgb(39_39_42/0.10)]">
            <p className="text-4xl font-semibold tracking-tight">
              一句一句，练出英语语感
            </p>
            <p className="mt-4 text-xl text-zinc-500">
              echoloop.app · Listen, shadow, repeat.
            </p>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
