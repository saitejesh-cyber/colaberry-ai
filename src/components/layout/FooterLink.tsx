/**
 * Styled link used in the footer columns and legal-links row.
 */

import type { ReactNode } from "react";
import Link from "next/link";
import { getLinkRel } from "./navHelpers";

export default function FooterLink({
  href,
  target,
  className,
  children,
}: {
  href: string;
  target?: string | null;
  className?: string;
  children: ReactNode;
}) {
  const classes = [
    "footer-link",
    "focus-ring",
    "inline-flex",
    "items-center",
    "gap-1",
    "text-[var(--text-primary)]",
    "dark:text-[var(--text-primary)]",
    "hover:text-slate-600",
    "dark:hover:text-slate-200",
    "hover:underline",
    "underline-offset-4",
    className ?? "font-semibold",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Link
      href={href}
      target={target ?? undefined}
      rel={getLinkRel(target)}
      className={classes}
    >
      {children}
    </Link>
  );
}
