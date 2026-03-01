/**
 * Navigation link rendered inside the mobile slide-out menu.
 */

import type { ReactNode } from "react";
import Link from "next/link";
import { getLinkRel } from "./navHelpers";

export default function MobileLink({
  href,
  target,
  active,
  onClick,
  className,
  children,
}: {
  href: string;
  target?: string | null;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const classes = [
    "focus-ring",
    "block",
    "rounded-lg",
    "px-3",
    "py-2",
    "text-sm",
    "text-slate-700",
    "hover:bg-slate-50",
    "dark:text-slate-200",
    "dark:hover:bg-slate-800/70",
    active ? "bg-[var(--pivot-fill)]/10 text-[var(--text-primary)] dark:bg-[var(--pivot-fill)]/15 dark:text-[var(--text-primary)]" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Link
      href={href}
      target={target ?? undefined}
      rel={getLinkRel(target)}
      className={classes}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
