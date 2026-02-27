import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

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
          <Image
            src={image}
            alt={alt ?? title}
            fill
            sizes="(min-width: 1536px) 28vw, (min-width: 1024px) 32vw, (min-width: 640px) 44vw, 95vw"
            quality={90}
            className="media-premium-image object-cover object-center"
          />
          <div className="media-premium-overlay" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(56,189,248,0.26),transparent_48%)] opacity-75" />
          {kicker ? (
            <div className="absolute left-3 top-3">
              <div className="chip chip-brand rounded-full border border-brand-blue/20 bg-white/92 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep backdrop-blur">
                {kicker}
              </div>
            </div>
          ) : null}
          {meta ? (
            <div className="absolute right-3 top-3">
              <div className="chip chip-muted rounded-full border border-slate-200/80 bg-white/92 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 backdrop-blur">
                {meta}
              </div>
            </div>
          ) : null}
          <div className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-100 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-aqua" />
            Premium signal
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-start justify-between gap-4 p-5">
        <div>
          <div className="text-base font-semibold leading-tight text-slate-900 dark:text-slate-100">{title}</div>
          <div className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</div>
        </div>
        <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:border-brand-blue/25 group-hover:text-brand-deep dark:border-slate-700/80 dark:bg-slate-900/70">
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
