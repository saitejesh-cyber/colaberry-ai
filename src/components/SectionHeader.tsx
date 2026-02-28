import { ReactNode } from "react";

type SectionHeaderProps = {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  size?: "md" | "lg" | "xl";
  as?: "h1" | "h2" | "h3";
  gradient?: boolean;
  children?: ReactNode;
};

export default function SectionHeader({
  kicker,
  title,
  description,
  align = "left",
  size = "lg",
  as = "h2",
  gradient = false,
  children,
}: SectionHeaderProps) {
  const HeadingTag = as;
  const titleClass =
    size === "xl"
      ? "text-display-lg sm:text-display-xl lg:text-display-2xl"
      : size === "lg"
        ? "text-display-sm sm:text-display-md lg:text-display-lg"
        : "text-lg sm:text-xl font-semibold";
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";
  const spacingClass = size === "xl" ? "gap-5" : "gap-3";
  const kickerAlign = align === "center" ? "justify-center" : "justify-start";
  const descriptionClass =
    size === "xl"
      ? "max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg"
      : size === "lg"
        ? "max-w-3xl text-caption leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base"
        : "max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300";

  return (
    <div className={`flex w-full max-w-4xl flex-col ${spacingClass} ${alignClass}`}>
      {kicker ? (
        <div
          className={`inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-3 py-1 text-label font-semibold uppercase tracking-[0.14em] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 ${kickerAlign}`}
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
          <span>{kicker}</span>
        </div>
      ) : null}
      <HeadingTag className={`font-display font-bold text-slate-900 dark:text-slate-100 ${titleClass} ${gradient ? "text-gradient" : ""}`}>
        {title}
      </HeadingTag>
      {description ? (
        <p className={descriptionClass}>{description}</p>
      ) : null}
      {children ? <div className="pt-1">{children}</div> : null}
    </div>
  );
}
