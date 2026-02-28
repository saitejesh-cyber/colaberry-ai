import Link from "next/link";
import {
  formatShortDate,
  formatUsage,
  getStatusTone,
  capitalizeFirst,
} from "@/src/lib/catalogFormatters";

type MCP = {
  name: string;
  slug?: string;
  description?: string | null;
  industry?: string | null;
  status?: string | null;
  rating?: number | null;
  usageCount?: number | null;
  lastUpdated?: string | null;
  visibility?: string | null;
  source?: string | null;
  sourceName?: string | null;
  verified?: boolean | null;
};

export default function MCPCard({ mcp }: { mcp: MCP }) {
  const href = mcp.slug ? `/aixcelerator/mcp/${mcp.slug}` : "/aixcelerator/mcp";
  const statusTone = getStatusTone(mcp.status);
  const statusLabel = capitalizeFirst(mcp.status);
  const summary = mcp.description || "Structured MCP server profile and integration metadata.";
  const industry = mcp.industry || "General";
  const ratingLabel = typeof mcp.rating === "number" ? mcp.rating.toFixed(1) : null;
  const usageLabel =
    typeof mcp.usageCount === "number" && mcp.usageCount > 0 ? formatUsage(mcp.usageCount) : null;
  const lastUpdatedLabel = formatShortDate(mcp.lastUpdated);
  const metaParts: string[] = [];
  if (ratingLabel) metaParts.push(`R ${ratingLabel}`);
  if (usageLabel) metaParts.push(usageLabel);
  if (lastUpdatedLabel) metaParts.push(lastUpdatedLabel);
  if (mcp.source) metaParts.push(capitalizeFirst(mcp.source));

  return (
    <Link href={href} className="group block" aria-label={`View MCP server ${mcp.name} details`}>
      <div className="catalog-card p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="chip chip-neutral rounded-md px-2.5 py-1 text-label font-semibold uppercase tracking-[0.12em]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-aqua" />
            MCP
          </span>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-300">
            <path d="M6.5 3.5 11 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        <div className="mt-3">
          <h3 className="truncate text-caption font-semibold text-[var(--text-heading)] dark:text-slate-100">{mcp.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--text-body-light)]">{summary}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="chip chip-neutral rounded-md px-2.5 py-1 text-xs font-semibold">
            {industry}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusTone}`}
          >
            {statusLabel}
          </span>
          {mcp.verified ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-[var(--trusted-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--trusted-text)] ring-1 ring-inset ring-[var(--trusted-stroke)]">
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
                <path
                  d="M7.4 13.2 4.2 10l1.4-1.4 1.8 1.8 4.8-4.8 1.4 1.4-6.2 6.2Z"
                  fill="currentColor"
                />
              </svg>
              Verified
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 dark:border-slate-700/50">
          <div className="text-label font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
            {metaParts.length > 0 ? metaParts.join(" \u00b7 ") : "Quality monitored"}
          </div>
          <span className="text-label font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">View →</span>
        </div>
      </div>
    </Link>
  );
}
