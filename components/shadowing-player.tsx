"use client";

import {
  ChevronLeft,
  ChevronRight,
  GalleryVerticalEnd,
  Gauge,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Square,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatSubtitleTime,
  type ShadowingLesson,
  type ShadowingSubtitle,
} from "@/lib/mock-shadowing";
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingStartedAtRef = useRef<number | null>(null);
  const isUserScrollingRef = useRef(false);
  const userScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIndexRef = useRef(0);
  const recordingUrlRef = useRef("");
  const loopSeekLockRef = useRef(false);

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

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMicError("当前浏览器不支持 MediaRecorder 录音。请使用最新版 Chrome、Edge 或 Safari。");
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
        setMicError("麦克风权限已被拒绝。请在浏览器地址栏允许麦克风权限后，再点击“跟读录音”。");
        return;
      }
      if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setMicError("没有检测到可用麦克风。请连接麦克风后再试一次。");
        return;
      }
      if (name === "NotReadableError" || name === "TrackStartError") {
        setMicError("麦克风正被其他应用占用。请关闭占用麦克风的应用后再试一次。");
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
    };

    video.addEventListener("play", startTicking);
    video.addEventListener("playing", startTicking);
    video.addEventListener("pause", stopTicking);
    video.addEventListener("ended", stopTicking);
    video.addEventListener("seeked", syncAfterSeek);
    video.addEventListener("timeupdate", syncAfterSeek);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("play", startTicking);
      video.removeEventListener("playing", startTicking);
      video.removeEventListener("pause", stopTicking);
      video.removeEventListener("ended", stopTicking);
      video.removeEventListener("seeked", syncAfterSeek);
      video.removeEventListener("timeupdate", syncAfterSeek);
    };
  }, [findActiveIndex, loopSentence, subtitles, updateActiveIndex]);

  useEffect(() => {
    if (isUserScrollingRef.current) return;

    activeItemRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeIndex]);

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
      return "已录制";
    }
    return "跟读录音";
  }, [recordingSeconds, recordingState]);

  return (
    <main className="min-h-[100dvh] pb-52 text-zinc-950 md:pb-28">
      <div className="mx-auto flex min-h-[calc(100dvh-7rem)] max-w-[1540px] flex-col gap-5 px-4 py-4 md:px-6 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
        <section className="flex min-h-0 flex-col gap-4">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge>{lesson.level}</Badge>
                {lesson.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
                {lesson.title}
              </h1>
              <p className="mt-2 text-sm text-zinc-500">
                {lesson.titleZh} · {lesson.author} · {lesson.durationLabel}
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <GalleryVerticalEnd />
                全部练习
              </Link>
            </Button>
          </header>

          <div className="relative overflow-hidden rounded-lg border border-zinc-200 bg-black shadow-sm">
            <video
              ref={videoRef}
              className="aspect-video w-full bg-black"
              controls
              playsInline
              preload="metadata"
              src={lesson.videoUrl}
              onCanPlay={() => setVideoError("")}
              onError={() =>
                setVideoError("视频加载失败。请检查 mock 数据里的 videoUrl 是否可访问，或换成本地 public 目录下的视频。")
              }
            />
            {videoError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/85 px-6 text-center">
                <div className="max-w-md">
                  <p className="text-sm font-semibold text-white">视频无法播放</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {videoError}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur">
            <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Current Sentence
            </p>
            {activeSubtitle ? (
              <div className="mx-auto mt-3 max-w-3xl text-center">
                <p className="text-lg font-medium leading-8 text-zinc-950">
                  {activeSubtitle.en}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {activeSubtitle.zh}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-center text-sm text-zinc-400">暂无字幕</p>
            )}
          </div>
        </section>

        <aside className="flex min-h-[520px] flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white/90 shadow-sm backdrop-blur lg:max-h-[calc(100dvh-2rem)]">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-zinc-950">双语字幕</p>
              <p className="mt-1 text-xs text-zinc-500">点击任意一句跳转播放</p>
            </div>
            <Badge variant="outline">{subtitles.length} 句</Badge>
          </div>

          <div
            ref={transcriptRef}
            className="flex-1 space-y-1 overflow-y-auto px-3 py-3"
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
                    "group w-full rounded-md border-l-2 px-4 py-3 text-left transition",
                    isActive
                      ? "border-indigo-600 bg-indigo-50 shadow-sm"
                      : "border-transparent hover:bg-zinc-50",
                  )}
                >
                  <div className="mb-2 flex items-center justify-between gap-3 font-mono text-[11px] text-zinc-400">
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
                      isActive ? "font-medium text-zinc-950" : "text-zinc-700",
                    )}
                  >
                    {subtitle.en}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-sm leading-6",
                      isActive ? "text-zinc-600" : "text-zinc-400",
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

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/90 px-4 py-3 shadow-[0_-12px_40px_rgb(24_24_27/0.08)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-950">
              {activeSubtitle?.en ?? "准备开始跟读"}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">{controlLabel}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant={playbackRate === 1 ? "outline" : "default"}
              size="sm"
              onClick={cyclePlaybackRate}
            >
              <Gauge />
              {playbackRate}x
            </Button>
            <Button
              variant={loopSentence ? "default" : "outline"}
              size="sm"
              onClick={() => setLoopSentence((current) => !current)}
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
            >
              <ChevronLeft />
            </Button>
            <Button
              size="icon"
              aria-label={isPlaying ? "暂停" : "播放"}
              onClick={() => void togglePlay()}
              className="h-12 w-12 rounded-full"
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
            >
              <ChevronRight />
            </Button>
            {recordingState === "recording" ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={stopRecording}
                className="min-w-28"
              >
                <Square fill="currentColor" />
                停止 {recordingSeconds}s
              </Button>
            ) : (
              <Button
                variant={recordingState === "ready" ? "secondary" : "outline"}
                size="sm"
                onClick={() => void startRecording()}
                className="min-w-28"
              >
                {recordingState === "ready" ? <Waves /> : <Mic />}
                {recordingState === "ready" ? "重新录制" : "跟读录音"}
              </Button>
            )}
          </div>

          {(recordingUrl || micError) && (
            <div className="min-w-0 md:w-72">
              {recordingUrl ? (
                <audio
                  className="h-9 w-full"
                  controls
                  src={recordingUrl}
                  title={recordingMimeType}
                />
              ) : null}
              {micError ? (
                <p className="text-xs leading-5 text-red-600">{micError}</p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
