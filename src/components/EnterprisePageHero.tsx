import Image from "next/image";
import Link from "next/link";

type HeroAction = {
  label: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "secondary";
};

type HeroMetric = {
  label: string;
  value: string;
  note?: string;
};

type EnterprisePageHeroProps = {
  kicker: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  imageKicker?: string;
  imageTitle?: string;
  imageDescription?: string;
  chips?: string[];
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  metrics?: HeroMetric[];
};

function ActionButton({ action }: { action: HeroAction }) {
  const className = action.variant === "secondary" ? "btn btn-secondary" : "btn btn-primary";
  const isExternal = action.external || /^https?:\/\//i.test(action.href);
  if (isExternal) {
    return (
      <a href={action.href} target="_blank" rel="noreferrer" className={className}>
        {action.label}
      </a>
    );
  }
  return (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  );
}

export default function EnterprisePageHero({
  kicker,
  title,
  description,
  image,
  alt,
  imageKicker = "Preview",
  imageTitle = "Signal surface",
  imageDescription = "A premium visual preview for this page.",
  chips = [],
  primaryAction,
  secondaryAction,
  metrics = [],
}: EnterprisePageHeroProps) {
  return (
    <section className="hero-surface p-6 sm:p-8 lg:p-10">
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="flex flex-col gap-3">
          <div className="chip chip-brand inline-flex w-fit items-center gap-2 rounded-full border border-brand-blue/25 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-deep">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-aqua" />
            {kicker}
          </div>
          <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-[3.3rem]">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg">
            {description}
          </p>
          {chips.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="chip rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
          {(primaryAction || secondaryAction) ? (
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              {primaryAction ? <ActionButton action={primaryAction} /> : null}
              {secondaryAction ? <ActionButton action={secondaryAction} /> : null}
            </div>
          ) : null}
        </div>

        <div className="surface-panel group relative overflow-hidden p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-white/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep dark:border-brand-teal/30 dark:text-brand-ice">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-aqua" />
                {imageKicker}
              </div>
              <div className="mt-2 text-lg font-semibold leading-tight text-slate-900 dark:text-slate-100">{imageTitle}</div>
              <div className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{imageDescription}</div>
            </div>
            <span className="rounded-full border border-slate-200/80 bg-white/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:border-slate-700/80 dark:text-slate-300">
              {imageKicker}
            </span>
          </div>
          <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm dark:border-slate-700/80">
            <div className="relative aspect-[16/9]">
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(min-width: 1920px) 780px, (min-width: 1536px) 680px, (min-width: 1280px) 620px, (min-width: 1024px) 520px, 92vw"
                quality={90}
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/35 via-slate-900/8 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(56,189,248,0.2),transparent_48%)]" />
            </div>
          </div>
        </div>
      </div>

      {metrics.length > 0 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-2xl border border-slate-200/80 bg-white/88 p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/72"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">{metric.label}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{metric.value}</div>
              {metric.note ? <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{metric.note}</p> : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

