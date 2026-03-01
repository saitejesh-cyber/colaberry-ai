import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Segment = {
  start: number;
  end?: number | null;
  text: string;
};

type TranscriptTimelineProps = {
  segments: Segment[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "--:--";
  const total = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">{part}</mark> : part
  );
}

export default function TranscriptTimeline({ segments, audioRef }: TranscriptTimelineProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const activeSegmentRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const handler = () => setCurrentTime(el.currentTime || 0);
    el.addEventListener("timeupdate", handler);
    return () => {
      el.removeEventListener("timeupdate", handler);
    };
  }, [audioRef]);

  const normalizedSegments = useMemo(() => {
    return segments
      .map((segment, index) => ({
        ...segment,
        start: Number(segment.start) || 0,
        end: segment.end != null ? Number(segment.end) : null,
        index,
      }))
      .filter((segment) => segment.text);
  }, [segments]);

  const activeIndex = useMemo(() => {
    for (let i = 0; i < normalizedSegments.length; i += 1) {
      const segment = normalizedSegments[i];
      const next = normalizedSegments[i + 1];
      const end = segment.end ?? next?.start ?? segment.start + 5;
      if (currentTime >= segment.start && currentTime < end) {
        return i;
      }
    }
    return -1;
  }, [currentTime, normalizedSegments]);

  // Auto-scroll to the active segment when it changes
  useEffect(() => {
    if (activeIndex >= 0 && activeSegmentRef.current) {
      activeSegmentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex]);

  const handleSeek = (start: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = start;
    el.play().catch(() => undefined);
  };

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const filteredSegments = useMemo(() => {
    if (!trimmedQuery) return normalizedSegments;
    return normalizedSegments.filter((segment) =>
      segment.text.toLowerCase().includes(trimmedQuery)
    );
  }, [normalizedSegments, trimmedQuery]);

  const activeRefCallback = useCallback(
    (node: HTMLButtonElement | null) => {
      activeSegmentRef.current = node;
    },
    []
  );

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="sticky top-0 z-10 bg-white/95 pb-2 backdrop-blur-sm dark:bg-slate-900/95">
        <label className="sr-only" htmlFor="transcript-search">Search transcript</label>
        <input
          id="transcript-search"
          type="search"
          placeholder="Search transcript..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-brand-blue/40 focus:outline-none focus:ring-2 focus:ring-brand-blue/25 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        {trimmedQuery && (
          <p className="mt-1 text-xs text-slate-500">
            {filteredSegments.length} of {normalizedSegments.length} segments match
          </p>
        )}
      </div>

      {filteredSegments.map((segment) => {
        const isActive = segment.index === activeIndex;
        return (
          <button
            key={`${segment.start}-${segment.index}`}
            ref={isActive ? activeRefCallback : undefined}
            type="button"
            onClick={() => handleSeek(segment.start)}
            aria-label={`Jump to ${formatTime(segment.start)}`}
            aria-current={isActive ? "true" : undefined}
            className={`focus-ring group flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition ${
              isActive
                ? "border-brand-purple-600/50 bg-brand-purple-600/5 dark:border-[var(--pivot-fill)]/50 dark:bg-[var(--pivot-fill)]/10"
                : "border-slate-200/80 bg-white/80 hover:border-brand-purple-600/30 dark:border-slate-700 dark:bg-[var(--surface-elevated)]/80 dark:hover:border-[var(--pivot-fill)]/30"
            }`}
          >
            <span className="mt-0.5 shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {formatTime(segment.start)}
            </span>
            <span className="text-sm text-slate-700">
              {trimmedQuery ? highlightText(segment.text, trimmedQuery) : segment.text}
            </span>
          </button>
        );
      })}
    </div>
  );
}
