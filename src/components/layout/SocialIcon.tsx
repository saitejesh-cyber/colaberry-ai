/**
 * Social-media icon link used in the footer.
 */

import { resolveSocialIcon, getLinkRel } from "./navHelpers";

export default function SocialIcon({
  href,
  label,
  icon,
  target,
}: {
  href: string;
  label: string;
  icon?: string | null;
  target?: string | null;
}) {
  const iconMarkup = resolveSocialIcon(icon, label);
  const linkTarget = target ?? "_blank";
  return (
    <a
      href={href}
      target={linkTarget}
      rel={getLinkRel(linkTarget)}
      className="social-button focus-ring inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200/70 bg-white/80 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        {iconMarkup}
      </svg>
      <span className="sr-only">{label}</span>
    </a>
  );
}
