import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";

type PremiumMediaCardProps = {
  href?: string;
  title: string;
  description: string;
  image: string;
  alt?: string;
  meta?: string;
  kicker?: string;
  external?: boolean;
  size?: "sm" | "md";
  className?: string;
  trailing?: ReactNode;
};

export default function PremiumMediaCard({
  href,
  title,
  description,
  image,
  alt,
  meta,
  kicker,
  external,
  size = "md",
  className,
  trailing,
}: PremiumMediaCardProps) {
  const [imgError, setImgError] = useState(false);
  const isExternal = external || (!!href && /^https?:\/\//i.test(href));
  const minHeightClass = size === "sm" ? "min-h-[246px]" : "min-h-[286px]";
  const aspectClass = size === "sm" ? "aspect-[16/9]" : "aspect-[16/10]";
  const rootClass = [
    "surface-panel surface-hover surface-interactive group flex h-full flex-col overflow-hidden border border-slate-200/80 bg-white/90 p-0 shadow-[0_18px_40px_rgba(15,23,42,0.12)]",
    minHeightClass,
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <div className="media-premium-frame border-0 border-b border-slate-200/80 rounded-none">
        <div className={`relative w-full ${aspectClass}`}>
          {imgError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-[var(--surface-elevated)]">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-slate-300 dark:text-slate-600" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path d="m6 16 3.5-4.5 2.5 3 3.5-4.5L21 16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
          ) : (
            <Image
              src={image}
              alt={alt ?? title}
              fill
              sizes="(min-width: 1536px) 28vw, (min-width: 1024px) 32vw, (min-width: 640px) 44vw, 95vw"
              quality={90}
              className="media-premium-image object-cover object-center"
              onError={() => setImgError(true)}
            />
          )}
          <div className="media-premium-overlay" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(79,42,163,0.18),transparent_48%)] opacity-75" />
          {kicker ? (
            <div className="absolute left-3 top-3">
              <div className="chip chip-neutral rounded-md border border-slate-200/80 bg-white/92 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 backdrop-blur">
                {kicker}
              </div>
            </div>
          ) : null}
          {meta ? (
            <div className="absolute right-3 top-3">
              <div className="chip chip-muted rounded-md border border-slate-200/80 bg-white/92 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 backdrop-blur">
                {meta}
              </div>
            </div>
          ) : null}
          <div className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-slate-950/35 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-slate-200/80 backdrop-blur">
            <span className="h-1 w-1 rounded-full bg-brand-aqua/70" />
            Premium signal
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-start justify-between gap-4 p-6">
        <div>
          <div className="text-base font-semibold leading-tight text-slate-900 dark:text-slate-100">{title}</div>
          <div className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</div>
        </div>
        <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200/80 bg-white/90 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:border-slate-300 group-hover:text-slate-600 dark:border-slate-700/80 dark:bg-slate-900/70 dark:group-hover:text-slate-200">
          {trailing ?? <span aria-hidden="true">→</span>}
        </div>
      </div>
    </>
  );

  if (!href) {
    return <div className={rootClass}>{content}</div>;
  }

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={rootClass} aria-label={`Open ${title}`}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={rootClass} aria-label={`Open ${title}`}>
      {content}
    </Link>
  );
}
