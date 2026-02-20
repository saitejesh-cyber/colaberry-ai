import { ReactNode } from "react";

type SectionHeaderProps = {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  size?: "md" | "lg" | "xl";
  as?: "h1" | "h2" | "h3";
  children?: ReactNode;
};

export default function SectionHeader({
  kicker,
  title,
  description,
  align = "left",
  size = "lg",
  as = "h2",
  children,
}: SectionHeaderProps) {
  const HeadingTag = as;
  const titleClass =
    size === "xl"
      ? "text-4xl sm:text-5xl lg:text-[3.85rem]"
      : size === "lg"
        ? "text-[1.85rem] sm:text-[2.35rem] lg:text-[2.9rem]"
        : "text-xl sm:text-2xl";
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";
  const spacingClass = size === "xl" ? "gap-4" : "gap-3";
  const kickerAlign = align === "center" ? "justify-center" : "justify-start";
  const descriptionClass =
    size === "xl"
      ? "max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg"
      : size === "lg"
        ? "max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base"
        : "max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300";

  return (
    <div className={`flex w-full max-w-4xl flex-col ${spacingClass} ${alignClass}`}>
      {kicker ? (
        <div
          className={`inline-flex items-center gap-2 rounded-full border border-brand-blue/25 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-deep shadow-sm dark:border-brand-teal/35 dark:bg-slate-900/75 dark:text-brand-ice ${kickerAlign}`}
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-aqua" />
          <span>{kicker}</span>
          <span
            aria-hidden="true"
            className="h-[2px] w-8 rounded-full bg-gradient-to-r from-brand-blue to-brand-teal"
          />
        </div>
      ) : null}
      <HeadingTag className={`font-display font-semibold leading-[1.05] tracking-tight text-slate-900 dark:text-slate-100 ${titleClass}`}>
        {title}
      </HeadingTag>
      {description ? (
        <p className={descriptionClass}>{description}</p>
      ) : null}
      {children ? <div className="pt-1">{children}</div> : null}
    </div>
  );
}
