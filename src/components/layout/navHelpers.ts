/**
 * Pure-logic helper functions and constants extracted from Layout.tsx.
 *
 * These are stateless utilities that handle navigation data normalisation,
 * social-icon resolution, workspace sidebar construction, and signal-banner
 * configuration. Nothing in this file depends on React state or DOM — only
 * on the GlobalNavigation type from the CMS layer and the WorkspaceLink /
 * WorkspaceSection types from ./types.
 */

import type { ReactNode } from "react";
import type { GlobalNavigation } from "../../lib/cms";
import type { WorkspaceLink, WorkspaceSection } from "./types";

/* ------------------------------------------------------------------ */
/*  Fallback navigation (used when CMS data is unavailable)           */
/* ------------------------------------------------------------------ */

export const fallbackNavigation: GlobalNavigation = {
  headerLinks: [
    {
      label: "Platform",
      href: "/aixcelerator",
      order: 1,
      group: "header",
      children: [
        { label: "Agents", href: "/aixcelerator/agents", order: 1 },
        { label: "MCP Servers", href: "/aixcelerator/mcp", order: 2 },
        { label: "Skills", href: "/aixcelerator/skills", order: 3 },
        { label: "Use Cases", href: "/use-cases", order: 4 },
      ],
    },
    {
      label: "Industries",
      href: "/industries",
      order: 2,
      group: "header",
      children: [
        { label: "All Industries", href: "/industries", order: 1 },
        { label: "Solutions & Playbooks", href: "/solutions", order: 2 },
      ],
    },
    {
      label: "Resources",
      href: "/resources",
      order: 3,
      group: "header",
      children: [
        { label: "Podcasts", href: "/resources/podcasts", order: 1 },
        { label: "Articles", href: "/resources/articles", order: 2 },
        { label: "Books & White Papers", href: "/resources/books", order: 3 },
        { label: "Case Studies", href: "/resources/case-studies", order: 4 },
      ],
    },
    {
      label: "Updates",
      href: "/updates",
      order: 4,
      group: "header",
      children: [{ label: "News & Product", href: "/updates", order: 1 }],
    },
  ],
  footerColumns: [
    {
      title: "Product",
      links: [
        { label: "Platform", href: "/aixcelerator", order: 1, group: "Product" },
        { label: "Agents", href: "/aixcelerator/agents", order: 2, group: "Product" },
        { label: "MCP servers", href: "/aixcelerator/mcp", order: 3, group: "Product" },
        { label: "Skills", href: "/aixcelerator/skills", order: 4, group: "Product" },
        { label: "Discovery assistant", href: "/assistant", order: 5, group: "Product" },
        { label: "Solutions", href: "/solutions", order: 6, group: "Product" },
        { label: "Use cases", href: "/use-cases", order: 7, group: "Product" },
        { label: "Industries", href: "/industries", order: 8, group: "Product" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Resources hub", href: "/resources", order: 1, group: "Resources" },
        { label: "Podcasts", href: "/resources/podcasts", order: 2, group: "Resources" },
        { label: "White papers", href: "/resources/white-papers", order: 3, group: "Resources" },
        { label: "Articles", href: "/resources/articles", order: 4, group: "Resources" },
        { label: "News & product", href: "/updates", order: 5, group: "Resources" },
      ],
    },
  ],
  cta: { label: "Book a demo", href: "/request-demo", group: "header" },
  socialLinks: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/colaberry",
      target: "_blank",
      icon: "linkedin",
      order: 1,
      group: "social",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/colaberryinc/",
      target: "_blank",
      icon: "instagram",
      order: 2,
      group: "social",
    },
    {
      label: "X",
      href: "https://x.com/colaberryinc?lang=en",
      target: "_blank",
      icon: "x",
      order: 3,
      group: "social",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/colaberryschoolofdataanalytics/",
      target: "_blank",
      icon: "facebook",
      order: 4,
      group: "social",
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/channel/UCb23caPCK7xW8roOkr_iKRA",
      target: "_blank",
      icon: "youtube",
      order: 5,
      group: "social",
    },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy", order: 1, group: "legal" },
    { label: "Cookie Policy", href: "/cookie-policy", order: 2, group: "legal" },
  ],
};

/* ------------------------------------------------------------------ */
/*  Social icon SVG fragments                                         */
/* ------------------------------------------------------------------ */

// NOTE: These constants contain JSX (ReactNode) so this file must be
// importable from a React context. They are *not* components — just
// static SVG child fragments used inside <svg> wrappers in the Layout.

export { SOCIAL_ICON_PATHS, DEFAULT_SOCIAL_ICON };

// Declared with `const … as …` so the file stays a plain .ts module
// while still being fully type-safe for consumers that render JSX.
// The actual JSX values are injected at import-site via the React
// runtime that is already in scope in Layout.tsx.
//
// Because these constants contain JSX (React.createElement calls),
// this file MUST be imported in a React context. If you need a
// non-React version in the future, split the icon data into a
// separate .tsx file.

import React from "react";

const SOCIAL_ICON_PATHS: Record<string, ReactNode> = {
  linkedin: React.createElement(
    React.Fragment,
    null,
    React.createElement("path", {
      d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 1 0-4 0v7h-4V9h4v2.2A4.5 4.5 0 0 1 16 8Z",
      fill: "currentColor",
    }),
    React.createElement("rect", { x: "2", y: "9", width: "4", height: "12", fill: "currentColor" }),
    React.createElement("circle", { cx: "4", cy: "4", r: "2", fill: "currentColor" }),
  ),
  instagram: React.createElement(
    React.Fragment,
    null,
    React.createElement("rect", {
      x: "3",
      y: "3",
      width: "18",
      height: "18",
      rx: "5",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
    }),
    React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "4",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
    }),
    React.createElement("circle", { cx: "17.5", cy: "6.5", r: "1.2", fill: "currentColor" }),
  ),
  x: React.createElement("path", {
    d: "M4 4h4.6l4 5.6L16.9 4H21l-6.6 8.6L21 20h-4.7l-4.2-5.9L7.3 20H3l7-8.9L4 4Z",
    fill: "currentColor",
  }),
  facebook: React.createElement("path", {
    d: "M14.5 8.5h3V5h-3c-2.5 0-4.5 2-4.5 4.5V12H7v3h3v6h3.5v-6h3l.5-3h-3.5V9.5c0-.6.4-1 1-1Z",
    fill: "currentColor",
  }),
  youtube: React.createElement(
    React.Fragment,
    null,
    React.createElement("path", {
      d: "M23 12s0-4.3-.6-5.7c-.4-1-1.2-1.8-2.2-2.2C18.8 3.5 12 3.5 12 3.5s-6.8 0-8.2.6c-1 .4-1.8 1.2-2.2 2.2C1 7.7 1 12 1 12s0 4.3.6 5.7c.4 1 1.2 1.8 2.2 2.2 1.4.6 8.2.6 8.2.6s6.8 0 8.2-.6c1-.4 1.8-1.2 2.2-2.2.6-1.4.6-5.7.6-5.7Z",
      fill: "currentColor",
    }),
    React.createElement("polygon", { points: "10 8.5 16 12 10 15.5", fill: "#ffffff" }),
  ),
};

const DEFAULT_SOCIAL_ICON: ReactNode = React.createElement("path", {
  d: "M10.4 13.6a1 1 0 0 1 1.4 0l1.6 1.6a4 4 0 1 1-5.7 5.7l-1.6-1.6a1 1 0 0 1 1.4-1.4l1.6 1.6a2 2 0 1 0 2.8-2.8l-1.6-1.6a1 1 0 0 1 0-1.5Zm2.8-2.8a1 1 0 0 1 0-1.4l1.6-1.6a4 4 0 1 1 5.7 5.7l-1.6 1.6a1 1 0 0 1-1.4-1.4l1.6-1.6a2 2 0 1 0-2.8-2.8l-1.6 1.6a1 1 0 0 1-1.5 0Z",
  fill: "currentColor",
});

/* ------------------------------------------------------------------ */
/*  Icon-key normalisation                                            */
/* ------------------------------------------------------------------ */

export function normalizeIconKey(value?: string | null): string {
  return (value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function resolveSocialIcon(icon?: string | null, label?: string | null): ReactNode {
  const raw = normalizeIconKey(icon) || normalizeIconKey(label);
  const normalized =
    raw === "twitter" || raw === "xcom"
      ? "x"
      : raw === "linkedin" || raw === "linked" || raw === "ln"
      ? "linkedin"
      : raw === "instagram" || raw === "ig"
      ? "instagram"
      : raw === "facebook" || raw === "fb"
      ? "facebook"
      : raw === "youtube" || raw === "yt"
      ? "youtube"
      : raw;
  return SOCIAL_ICON_PATHS[normalized] ?? DEFAULT_SOCIAL_ICON;
}

/* ------------------------------------------------------------------ */
/*  Link utilities                                                    */
/* ------------------------------------------------------------------ */

export function getLinkRel(target?: string | null): string | undefined {
  return target === "_blank" ? "noreferrer noopener" : undefined;
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function normalizePath(path: string): string {
  if (!path) return "/";
  if (isExternalHref(path)) return path;
  const [pathname] = path.split(/[?#]/);
  const clean = pathname || "/";
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean;
}

export function isActiveNavPath(currentPath: string, href: string, navPaths: string[]): boolean {
  if (!href || isExternalHref(href)) return false;
  const linkPath = normalizePath(href);
  if (currentPath === linkPath) return true;
  if (linkPath === "/") return currentPath === "/";
  if (!currentPath.startsWith(`${linkPath}/`)) return false;

  const hasMoreSpecific = navPaths.some((candidate) => {
    if (candidate.length <= linkPath.length) return false;
    return currentPath === candidate || currentPath.startsWith(`${candidate}/`);
  });
  return !hasMoreSpecific;
}

/* ------------------------------------------------------------------ */
/*  Platform sub-nav normalisation                                    */
/* ------------------------------------------------------------------ */

export const PLATFORM_CHILD_BLUEPRINT = [
  { label: "Overview", href: "/aixcelerator" },
  { label: "Agents", href: "/aixcelerator/agents" },
  { label: "MCP servers", href: "/aixcelerator/mcp" },
  { label: "Skills", href: "/aixcelerator/skills" },
  { label: "Use cases", href: "/use-cases" },
  { label: "Discovery assistant", href: "/assistant" },
];

export const PLATFORM_CHILD_ALIASES: Record<string, string> = {
  agents: "/aixcelerator/agents",
  mcp: "/aixcelerator/mcp",
  "mcp servers": "/aixcelerator/mcp",
  "mcp server": "/aixcelerator/mcp",
  skills: "/aixcelerator/skills",
  skill: "/aixcelerator/skills",
  "use cases": "/use-cases",
  "use case": "/use-cases",
  "discovery assistant": "/assistant",
};

export function findPlatformChildBlueprint(
  link: GlobalNavigation["headerLinks"][number],
): typeof PLATFORM_CHILD_BLUEPRINT[number] | null {
  const normalizedPath = normalizePath(link.href);
  const byPath = PLATFORM_CHILD_BLUEPRINT.find(
    (entry) => normalizePath(entry.href) === normalizedPath,
  );
  if (byPath) return byPath;

  const labelKey = link.label.trim().toLowerCase();
  const aliasPath = PLATFORM_CHILD_ALIASES[labelKey];
  if (!aliasPath) return null;
  return (
    PLATFORM_CHILD_BLUEPRINT.find(
      (entry) => normalizePath(entry.href) === normalizePath(aliasPath),
    ) || null
  );
}

export function isPlatformLink(link: GlobalNavigation["headerLinks"][number]): boolean {
  const label = link.label.trim().toLowerCase();
  return label === "platform" || normalizePath(link.href) === "/aixcelerator";
}

export function normalizeHeaderNavigation(
  headerLinks: GlobalNavigation["headerLinks"],
): GlobalNavigation["headerLinks"] {
  if (!headerLinks.length) return headerLinks;

  const platformIndex = headerLinks.findIndex(isPlatformLink);
  if (platformIndex < 0) return headerLinks;

  const platformLink = headerLinks[platformIndex];
  const collectedChildren = new Map<string, GlobalNavigation["headerLinks"][number]>();
  const upsertPlatformChild = (entry: GlobalNavigation["headerLinks"][number]) => {
    const matchedBlueprint = findPlatformChildBlueprint(entry);
    if (!matchedBlueprint) return;
    const path = normalizePath(matchedBlueprint.href);
    if (!collectedChildren.has(path)) {
      collectedChildren.set(path, {
        ...entry,
        label: matchedBlueprint.label,
        href: matchedBlueprint.href,
      });
    }
  };

  (platformLink.children || []).forEach((child) => upsertPlatformChild(child));

  const nextHeaderLinks = headerLinks
    .filter((link, index) => {
      if (index === platformIndex) return false;
      if (findPlatformChildBlueprint(link)) {
        upsertPlatformChild({
          label: link.label,
          href: link.href,
          target: link.target,
          order: link.order,
          group: link.group,
        });
        (link.children || []).forEach((child) => upsertPlatformChild(child));
        return false;
      }
      return true;
    })
    .map((link) => {
      if (link.label.trim().toLowerCase() !== "solutions" || !link.children?.length) {
        return link;
      }
      const children = link.children.filter(
        (child) => normalizePath(child.href) !== "/use-cases",
      );
      return children.length === link.children.length ? link : { ...link, children };
    });

  PLATFORM_CHILD_BLUEPRINT.forEach((entry) => {
    if (!collectedChildren.has(normalizePath(entry.href))) {
      collectedChildren.set(normalizePath(entry.href), {
        label: entry.label,
        href: entry.href,
      });
    }
  });

  const normalizedPlatformChildren = PLATFORM_CHILD_BLUEPRINT.map((entry, index) => {
    const matched = collectedChildren.get(normalizePath(entry.href));
    return {
      ...matched,
      label: matched?.label || entry.label,
      href: matched?.href || entry.href,
      order: index + 1,
    };
  });

  const normalizedPlatform = {
    ...platformLink,
    label: "Platform",
    href: "/aixcelerator",
    children: normalizedPlatformChildren,
  };

  const insertAt = Math.min(platformIndex, nextHeaderLinks.length);
  nextHeaderLinks.splice(insertAt, 0, normalizedPlatform);
  return nextHeaderLinks;
}

/* ------------------------------------------------------------------ */
/*  Misc helpers                                                      */
/* ------------------------------------------------------------------ */

export function getRequestDemoLabel(label: string): string {
  return label;
}

export function mergeGlobalNavigation(
  primary: GlobalNavigation | null,
  fallback: GlobalNavigation,
): GlobalNavigation {
  if (!primary) return fallback;
  const fallbackHeaderIndex = new Map(
    fallback.headerLinks.map((link) => [`${link.label}|${link.href}`, link]),
  );
  const headerLinks = primary.headerLinks.length
    ? primary.headerLinks.map((link) => {
        if (link.children?.length) return link;
        const fallbackLink = fallbackHeaderIndex.get(`${link.label}|${link.href}`);
        const fallbackChildren = fallbackLink?.children ?? [];
        return fallbackChildren.length ? { ...link, children: fallbackChildren } : link;
      })
    : fallback.headerLinks;
  const normalizedHeaderLinks = normalizeHeaderNavigation(headerLinks);

  return {
    headerLinks: normalizedHeaderLinks,
    footerColumns: primary.footerColumns.length ? primary.footerColumns : fallback.footerColumns,
    cta: primary.cta?.label && primary.cta?.href ? primary.cta : fallback.cta,
    socialLinks: primary.socialLinks.length ? primary.socialLinks : fallback.socialLinks,
    legalLinks: primary.legalLinks.length ? primary.legalLinks : fallback.legalLinks,
  };
}

/* ------------------------------------------------------------------ */
/*  Workspace sidebar                                                 */
/* ------------------------------------------------------------------ */

export function dedupeWorkspaceLinks(links: WorkspaceLink[]): WorkspaceLink[] {
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = `${normalizePath(link.href)}|${link.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getHeaderLinkByLabel(
  nav: GlobalNavigation,
  label: string,
): GlobalNavigation["headerLinks"][number] | undefined {
  const target = label.trim().toLowerCase();
  return nav.headerLinks.find((link) => link.label.trim().toLowerCase() === target);
}

export function buildWorkspaceSections(nav: GlobalNavigation): WorkspaceSection[] {
  const platformLink =
    nav.headerLinks.find(isPlatformLink) || fallbackNavigation.headerLinks[0];
  const resourcesLink =
    getHeaderLinkByLabel(nav, "resources") ||
    getHeaderLinkByLabel(fallbackNavigation, "resources");
  const updatesLink =
    getHeaderLinkByLabel(nav, "updates") ||
    getHeaderLinkByLabel(fallbackNavigation, "updates");
  const industriesLink =
    getHeaderLinkByLabel(nav, "industries") ||
    getHeaderLinkByLabel(fallbackNavigation, "industries");
  const solutionsLink =
    getHeaderLinkByLabel(nav, "solutions") ||
    getHeaderLinkByLabel(fallbackNavigation, "solutions");

  const platformChildren = (platformLink.children || []).map((child) => ({
    label: child.label,
    href: child.href,
    target: child.target,
  }));
  const platformSectionLinks = dedupeWorkspaceLinks([
    { label: "Overview", href: platformLink.href, target: platformLink.target },
    ...platformChildren,
  ]).filter((link) => normalizePath(link.href) !== "/assistant");

  const resourceChildren = (resourcesLink?.children || []).filter((child) =>
    ["podcasts", "white papers", "articles", "books", "case studies", "resources hub"].includes(
      child.label.trim().toLowerCase(),
    ),
  );
  const catalogLinks = dedupeWorkspaceLinks(
    (
      [
        { label: "Search catalog", href: "/search" },
        { label: "Discovery assistant", href: "/assistant" },
        ...resourceChildren.map((child) => ({
          label: child.label,
          href: child.href,
          target: child.target,
        })),
        updatesLink
          ? { label: "News & product", href: updatesLink.href, target: updatesLink.target }
          : null,
      ] as (WorkspaceLink | null)[]
    ).filter(Boolean) as WorkspaceLink[],
  );

  const exploreLinks = dedupeWorkspaceLinks(
    (
      [
        industriesLink
          ? { label: "Industries", href: industriesLink.href, target: industriesLink.target }
          : null,
        solutionsLink
          ? { label: "Solutions", href: solutionsLink.href, target: solutionsLink.target }
          : null,
        resourcesLink
          ? { label: "Resources", href: resourcesLink.href, target: resourcesLink.target }
          : null,
      ] as (WorkspaceLink | null)[]
    ).filter(Boolean) as WorkspaceLink[],
  );

  return [
    { title: "Platform", links: platformSectionLinks },
    { title: "Catalog", links: catalogLinks },
    { title: "Explore", links: exploreLinks },
  ].filter((section) => section.links.length > 0);
}

/* ------------------------------------------------------------------ */
/*  Route-aware helpers                                               */
/* ------------------------------------------------------------------ */

export function isCatalogWorkspacePath(path: string): boolean {
  return (
    path === "/assistant" ||
    path.startsWith("/assistant/") ||
    path === "/aixcelerator" ||
    path.startsWith("/aixcelerator/") ||
    path === "/use-cases" ||
    path.startsWith("/use-cases/") ||
    path === "/search"
  );
}

export function getSignalBannerConfig(path: string): {
  variant: "resources" | "solutions" | "catalog" | "platform";
  kicker: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
} {
  if (path.startsWith("/resources") || path.startsWith("/updates")) {
    return {
      variant: "resources",
      kicker: "Knowledge Signals",
      title: "Ship content assets with enterprise narrative quality",
      description:
        "Turn podcasts, articles, books, and case studies into governed discovery surfaces for teams and LLM indexing.",
      primaryHref: "/resources",
      primaryLabel: "Explore resources",
      secondaryHref: "/resources/podcasts",
      secondaryLabel: "Open podcasts",
    };
  }

  if (
    path.startsWith("/solutions") ||
    path.startsWith("/industries") ||
    path.startsWith("/use-cases")
  ) {
    return {
      variant: "solutions",
      kicker: "Execution Layer",
      title: "Connect use cases to measurable enterprise outcomes",
      description:
        "Organize solution blueprints by industry, surface implementation detail, and route teams toward deployment readiness.",
      primaryHref: "/solutions",
      primaryLabel: "View solutions",
      secondaryHref: "/use-cases",
      secondaryLabel: "Browse use cases",
    };
  }

  if (
    path.startsWith("/aixcelerator") ||
    path.startsWith("/assistant") ||
    path.startsWith("/search")
  ) {
    return {
      variant: "catalog",
      kicker: "Catalog Workspace",
      title: "Discover agents, MCP servers, and skills in one governed surface",
      description:
        "Use structured catalog views to compare readiness, ownership, integrations, and deployment posture before rollout.",
      primaryHref: "/aixcelerator",
      primaryLabel: "Open catalog",
      secondaryHref: "/search",
      secondaryLabel: "Search assets",
    };
  }

  return {
    variant: "platform",
    kicker: "Enterprise Platform",
    title: "Build, govern, and scale AI programs from one operating layer",
    description:
      "Colaberry aligns strategy, catalog discovery, and production workflows across agents, MCP, skills, and evidence-backed resources.",
    primaryHref: "/request-demo",
    primaryLabel: "Request demo",
    secondaryHref: "/aixcelerator",
    secondaryLabel: "Explore platform",
  };
}
