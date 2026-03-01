import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import dynamic from "next/dynamic";
import {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { fetchGlobalNavigation, GlobalNavigation } from "../lib/cms";
import { captureUtmContextFromLocation } from "../lib/tracking";
import { organizationSchema, webSiteSchema } from "../lib/seo";
import NewsletterSignup from "./NewsletterSignup";
import AnimatedSignalBanner from "./AnimatedSignalBanner";

import {
  fallbackNavigation,
  normalizePath,
  isExternalHref,
  getLinkRel,
  isActiveNavPath,
  isCatalogWorkspacePath,
  getSignalBannerConfig,
  buildWorkspaceSections,
  mergeGlobalNavigation,
  getRequestDemoLabel,
} from "./layout/navHelpers";
import ThemeIcon from "./layout/ThemeIcon";
import SocialIcon from "./layout/SocialIcon";
import MobileLink from "./layout/MobileLink";
import FooterLink from "./layout/FooterLink";

const CookieConsentBanner = dynamic(() => import("./CookieConsentBanner"), {
  ssr: false,
});
const DemoRequestWizardModal = dynamic(
  () => import("./DemoRequestWizardModal"),
  { ssr: false },
);

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [hasMounted, setHasMounted] = useState(false);
  const [globalNav, setGlobalNav] = useState<GlobalNavigation>(fallbackNavigation);
  const [searchOpen, setSearchOpen] = useState(false);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workspaceRailCollapsed, setWorkspaceRailCollapsed] = useState(false);
  const [workspaceMobileRailOpen, setWorkspaceMobileRailOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [allowBackdropClose, setAllowBackdropClose] = useState(true);
  const [demoWizardOpen, setDemoWizardOpen] = useState(false);
  const [headerCompact, setHeaderCompact] = useState(false);
  const lastScrollY = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const currentPath = normalizePath(router.asPath || "/");
  const isCatalogWorkspace = isCatalogWorkspacePath(currentPath);
  const headerNavPaths = globalNav.headerLinks
    .map((link) => normalizePath(link.href))
    .filter((href) => !isExternalHref(href));
  const workspaceSections = useMemo(() => buildWorkspaceSections(globalNav), [globalNav]);
  const workspaceNavPaths = useMemo(
    () =>
      workspaceSections
        .flatMap((section) => section.links)
        .map((link) => normalizePath(link.href))
        .filter((href) => !isExternalHref(href)),
    [workspaceSections]
  );
  const workspaceGridStyle = useMemo(
    () =>
      ({
        "--workspace-rail-width": workspaceRailCollapsed ? "5.5rem" : "17rem",
      } as CSSProperties),
    [workspaceRailCollapsed]
  );
  const signalBannerConfig = useMemo(() => getSignalBannerConfig(currentPath), [currentPath]);
  const showSignalBanner = !currentPath.startsWith("/internal");

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      const storedTheme = window.localStorage.getItem("theme");
      const resolvedTheme = storedTheme === "dark" ? "dark" : "light";
      setTheme(resolvedTheme);
      captureUtmContextFromLocation();
      setHasMounted(true);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    function handleKeyboard(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setWorkspaceRailCollapsed((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, []);

  /* Scroll-collapse header: compact after 100px scroll down, expand on scroll up */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 100 && y > lastScrollY.current) {
          setHeaderCompact(true);
        } else if (y < lastScrollY.current) {
          setHeaderCompact(false);
        }
        lastScrollY.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(pointer: coarse)");
    const handleChange = () => setAllowBackdropClose(!media.matches);
    handleChange();
    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
    } else {
      media.addListener(handleChange);
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", handleChange);
      } else {
        media.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [hasMounted, theme]);

  useEffect(() => {
    let isActive = true;
    fetchGlobalNavigation()
      .then((data) => {
        if (!isActive) return;
        setGlobalNav(mergeGlobalNavigation(data, fallbackNavigation));
      })
      .catch(() => {
        if (!isActive) return;
        setGlobalNav(fallbackNavigation);
      });
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
      if (event.key === "Tab") {
        const dialog = searchDialogRef.current;
        if (!dialog) return;
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("aria-hidden"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const backgroundNodes = [
      document.querySelector("header"),
      document.querySelector("main"),
      document.querySelector("footer"),
    ].filter(Boolean) as HTMLElement[];
    backgroundNodes.forEach((node) => {
      node.setAttribute("aria-hidden", "true");
      node.setAttribute("inert", "");
    });
    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      backgroundNodes.forEach((node) => {
        node.removeAttribute("aria-hidden");
        node.removeAttribute("inert");
      });
      previousFocusRef.current?.focus();
      window.clearTimeout(focusTimer);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
      if (event.key === "Tab") {
        const aside = document.querySelector<HTMLElement>("[data-mobile-menu]");
        if (!aside) return;
        const focusable = Array.from(
          aside.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!workspaceMobileRailOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setWorkspaceMobileRailOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [workspaceMobileRailOpen]);

  useEffect(() => {
    if (!isCatalogWorkspace) return;
    const dismissed = window.localStorage.getItem("colaberry_discovery_prompt_dismissed");
    if (dismissed) return;
    const timer = window.setTimeout(() => {
      setDiscoveryOpen(true);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [isCatalogWorkspace]);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setMobileMenuOpen(false);
      setWorkspaceMobileRailOpen(false);
      setSearchOpen(false);
      setDiscoveryOpen(false);
    };
    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router.events]);

  /* Scroll-triggered reveal: observe `.reveal` elements and add `.revealed` */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    const targets = document.querySelectorAll(".reveal:not(.revealed)");
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });

  const toggleTheme = () => {
    setTheme((previous) => (previous === "dark" ? "light" : "dark"));
  };
  const isDarkMode = hasMounted ? theme === "dark" : false;
  const themeToggleLabel = hasMounted
    ? isDarkMode
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Toggle color mode";
  const openSearch = () => {
    setMobileMenuOpen(false);
    setSearchOpen(true);
  };
  const closeSearch = () => setSearchOpen(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const openMobileMenu = () => {
    setSearchOpen(false);
    setWorkspaceMobileRailOpen(false);
    setMobileMenuOpen(true);
  };
  const dismissDiscovery = () => {
    setDiscoveryOpen(false);
    window.localStorage.setItem("colaberry_discovery_prompt_dismissed", "true");
  };
  const handleDemoCtaClick = (event: ReactMouseEvent<HTMLElement>, href?: string | null) => {
    if (normalizePath(href || "") !== "/request-demo") return;
    if (currentPath === "/request-demo") return;
    event.preventDefault();
    setDemoWizardOpen(true);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.dataset.demoModal === "off") return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.origin);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (normalizePath(url.pathname) !== "/request-demo") return;
      if (url.searchParams.get("wizard") === "off" || url.searchParams.get("modal") === "off") return;
      if (currentPath === "/request-demo") return;

      event.preventDefault();
      setMobileMenuOpen(false);
      setDemoWizardOpen(true);
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [currentPath]);

  const desktopHeaderItems = globalNav.headerLinks.map((link) => {
    const hasChildren = !!link.children?.length;
    const isParentActive = isActiveNavPath(currentPath, link.href, headerNavPaths);
    const childNavPaths = (link.children || [])
      .map((child) => normalizePath(child.href))
      .filter((href) => !isExternalHref(href));
    const menuKey = `${link.label}-${link.href}`;
    const isOpen = openMenu === menuKey;
    return (
      <div
        key={menuKey}
        className="relative group"
        onMouseEnter={() => setOpenMenu(menuKey)}
        onMouseLeave={() => setOpenMenu((current) => (current === menuKey ? null : current))}
        onFocusCapture={() => setOpenMenu(menuKey)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setOpenMenu((current) => (current === menuKey ? null : current));
          }
        }}
        onKeyDown={(event) => {
          if (!hasChildren || !isOpen) return;
          const menuItems = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]')
          );
          if (!menuItems.length) return;
          const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);
          if (event.key === "ArrowDown") {
            event.preventDefault();
            menuItems[currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0]?.focus();
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            menuItems[currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1]?.focus();
          } else if (event.key === "Escape") {
            event.preventDefault();
            setOpenMenu(null);
            (event.currentTarget.querySelector("a") as HTMLElement)?.focus();
          }
        }}
      >
        <Link
          href={link.href}
          target={link.target ?? undefined}
          rel={getLinkRel(link.target)}
          className={`nav-link focus-ring inline-flex items-center gap-1.5 ${isParentActive ? "nav-link-active" : ""}`}
          aria-haspopup={hasChildren ? "menu" : undefined}
          aria-expanded={hasChildren ? isOpen : undefined}
        >
          {link.label}
          {hasChildren ? (
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[var(--pivot-fill)]" : "group-hover:translate-y-[1px]"}`}
              fill="none"
            >
              <path
                d="M5.5 7.5 10 12l4.5-4.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </Link>
        {hasChildren ? (
          <div
            className={`absolute left-0 top-full z-50 pt-2.5 transition-all duration-200 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <div
              className={`mega-menu-panel min-w-[15rem] rounded-xl p-2 transition-all duration-200 ${isOpen ? "translate-y-0" : "translate-y-1.5"}`}
              role="menu"
              aria-label={`${link.label} menu`}
            >
              <div className="px-2.5 pb-2 pt-1 text-label font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {link.label}
              </div>
              <div className="grid gap-0.5">
                {link.children?.map((child) => {
                  const isChildActive = isActiveNavPath(currentPath, child.href, childNavPaths);
                  return (
                    <Link
                      key={`${child.label}-${child.href}`}
                      href={child.href}
                      target={child.target ?? undefined}
                      rel={getLinkRel(child.target)}
                      className={`nav-dropdown-link focus-ring flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isChildActive ? "nav-dropdown-link-active" : ""}`}
                      role="menuitem"
                    >
                      <span>{child.label}</span>
                      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5">
                        <path d="M6.5 3.5 11 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  });

  return (
    <div className="flex min-h-dvh flex-col bg-transparent text-slate-900">
      <Head>
        <link rel="preconnect" href="https://www.buzzsprout.com" />
        <link rel="dns-prefetch" href="https://www.buzzsprout.com" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema()) }} />
      </Head>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-deep focus:shadow-lg focus:ring-2 focus:ring-[var(--pivot-fill)]/40">Skip to content</a>
      <header role="banner" className={`site-header sticky top-0 z-40 border-b border-[var(--stroke)] backdrop-blur-xl ${headerCompact ? "site-header--compact bg-white/80 dark:bg-[var(--bg)]/85" : "bg-white/95 shadow-sm dark:bg-[var(--bg)]/95"}`}>
        <div className={`flex w-full items-center justify-between gap-3 px-4 transition-[padding] duration-200 sm:px-6 lg:px-8 ${headerCompact ? "py-1.5" : "py-3"}`}>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-2">
              <span className="inline-flex items-center justify-center px-1">
                <Image
                  src="/brand/colaberry-ai-logo.svg"
                  alt="Colaberry.AI"
                  width={260}
                  height={60}
                  priority
                  className="brand-logo-light h-8 w-auto sm:h-9 lg:h-10"
                />
                <Image
                  src="/brand/colaberry-ai-logo-dark.svg"
                  alt="Colaberry.AI"
                  width={260}
                  height={60}
                  priority
                  className="brand-logo-dark h-8 w-auto sm:h-9 lg:h-10"
                />
              </span>
            </Link>
          </div>

          <nav role="navigation" aria-label="Main navigation" className="hidden min-w-0 items-center gap-1.5 text-sm min-[1240px]:flex">
            {isCatalogWorkspace ? (
              <>
                <button
                  type="button"
                  onClick={() => setWorkspaceRailCollapsed((current) => !current)}
                  className="btn btn-secondary btn-sm"
                  aria-expanded={!workspaceRailCollapsed}
                  aria-label={workspaceRailCollapsed ? "Expand catalog menu" : "Collapse catalog menu"}
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
                    <path
                      d="M4 5h12M4 10h12M4 15h12"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="hidden min-[1700px]:inline">
                    {workspaceRailCollapsed ? "Expand menu" : "Collapse menu"}
                  </span>
                </button>
                <span className="hidden rounded-md border border-slate-200/80 bg-white/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 min-[1560px]:inline-flex dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-300">
                  Catalog workspace
                </span>
                <div className="hidden h-6 w-px bg-slate-200/80 min-[1560px]:block dark:bg-slate-700/80" />
                <div className="hidden items-center gap-1.5 min-[1680px]:flex">{desktopHeaderItems}</div>
              </>
            ) : (
              desktopHeaderItems
            )}

            <div className="ml-2 flex shrink-0 items-center gap-2 border-l border-slate-200/80 pl-3 dark:border-slate-700/80">
              <button
                type="button"
                onClick={openSearch}
                className="btn btn-ghost btn-icon"
                aria-expanded={searchOpen}
                aria-label="Open global search"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path
                    d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16.25 16.25 21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-ghost btn-icon"
                aria-label={themeToggleLabel}
                aria-pressed={isDarkMode}
              >
                <span className="sr-only">{themeToggleLabel}</span>
                <ThemeIcon isDark={isDarkMode} />
              </button>
            </div>
            {globalNav.cta ? (
              <Link
                href={globalNav.cta.href}
                target={globalNav.cta.target ?? undefined}
                rel={getLinkRel(globalNav.cta.target)}
                className="btn btn-cta ml-1 h-10 shrink-0 whitespace-nowrap px-4 text-sm max-[1500px]:h-9 max-[1500px]:px-3 max-[1500px]:text-xs"
                onClick={(event) => handleDemoCtaClick(event, globalNav.cta?.href)}
              >
                <span>{getRequestDemoLabel(globalNav.cta.label)}</span>
              </Link>
            ) : null}
          </nav>

          <div className="flex items-center gap-1.5 min-[1240px]:hidden">
            {isCatalogWorkspace ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setWorkspaceMobileRailOpen(true);
                }}
                className="focus-ring inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200/70 bg-white/85 px-3 text-sm font-semibold text-slate-700 hover:border-[var(--pivot-fill)]/35 hover:text-[var(--text-primary)] dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                aria-expanded={workspaceMobileRailOpen}
                aria-label="Open catalog sidebar"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span>Catalog</span>
              </button>
            ) : null}
            <button
              type="button"
              onClick={openSearch}
              className="btn btn-ghost btn-icon"
              aria-expanded={searchOpen}
              aria-label="Open global search"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.25 16.25 21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-ghost btn-icon"
              aria-label={themeToggleLabel}
              aria-pressed={isDarkMode}
            >
              <span className="sr-only">{themeToggleLabel}</span>
              <ThemeIcon isDark={isDarkMode} />
            </button>
            <button
              type="button"
              onClick={openMobileMenu}
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200/70 bg-white/85 px-3 text-sm font-semibold text-slate-700 hover:border-[var(--pivot-fill)]/35 hover:text-[var(--text-primary)] dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              aria-expanded={mobileMenuOpen}
              aria-label="Open navigation menu"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>
      {mobileMenuOpen ? (
        <div
          className="fixed inset-0 z-[55] bg-slate-950/45 backdrop-blur-sm min-[1240px]:hidden animate-fade-in"
          onClick={closeMobileMenu}
        >
          <aside
            data-mobile-menu
            className="absolute right-0 top-0 flex h-full w-[min(92vw,380px)] flex-col border-l border-slate-200/70 bg-white/95 p-4 shadow-2xl dark:border-[var(--stroke)] dark:bg-[var(--bg)]/95 animate-slide-in-right"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(e) => {
              const startX = e.touches[0].clientX;
              const aside = e.currentTarget;
              const onMove = (ev: TouchEvent) => {
                const dx = ev.touches[0].clientX - startX;
                if (dx > 80) {
                  closeMobileMenu();
                  aside.removeEventListener("touchmove", onMove);
                }
              };
              aside.addEventListener("touchmove", onMove, { passive: true });
              aside.addEventListener("touchend", () => aside.removeEventListener("touchmove", onMove), { once: true });
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">
                  Navigation
                </div>
                <div className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                  Explore Colaberry AI
                </div>
              </div>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="btn btn-ghost btn-icon"
                aria-label="Close navigation menu"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto pb-3">
              <div className="grid gap-2">
                {globalNav.headerLinks.map((link) => {
                  const hasChildren = !!link.children?.length;
                  const isParentActive = isActiveNavPath(currentPath, link.href, headerNavPaths);
                  const childNavPaths = (link.children || [])
                    .map((child) => normalizePath(child.href))
                    .filter((href) => !isExternalHref(href));

                  return (
                    <div
                      key={`${link.label}-${link.href}`}
                      className="rounded-lg border border-slate-200/80 bg-white/90 p-1 dark:border-slate-700/80 dark:bg-slate-900/70"
                    >
                      <MobileLink
                        href={link.href}
                        target={link.target}
                        active={isParentActive}
                        onClick={closeMobileMenu}
                        className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold"
                      >
                        <span>{link.label}</span>
                        {hasChildren ? <span className="text-slate-400">→</span> : null}
                      </MobileLink>
                      {hasChildren ? (
                        <div className="mx-3 mb-2 mt-1 grid gap-1 border-l border-slate-200/80 pl-3 dark:border-slate-700/80">
                          {link.children?.map((child) => (
                            <MobileLink
                              key={`${child.label}-${child.href}`}
                              href={child.href}
                              target={child.target}
                              active={isActiveNavPath(currentPath, child.href, childNavPaths)}
                              onClick={closeMobileMenu}
                              className="text-xs font-medium text-slate-600 dark:text-slate-300"
                            >
                              {child.label}
                            </MobileLink>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-slate-200/80 bg-white/90 p-3 dark:border-slate-700/80 dark:bg-slate-900/70">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">
                Preferences
              </div>
              <Link
                href="/assistant"
                className="btn btn-secondary btn-sm mt-2 w-full justify-center"
                onClick={closeMobileMenu}
              >
                Discovery assistant
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-ghost btn-sm mt-2 w-full justify-center"
                aria-label={themeToggleLabel}
              >
                <ThemeIcon isDark={isDarkMode} />
                <span>Toggle color mode</span>
              </button>
              {globalNav.cta ? (
                <Link
                  href={globalNav.cta.href}
                  target={globalNav.cta.target ?? undefined}
                  rel={getLinkRel(globalNav.cta.target)}
                  className="btn btn-cta mt-2 h-10 w-full justify-center text-sm"
                  onClick={(event) => {
                    closeMobileMenu();
                    handleDemoCtaClick(event, globalNav.cta?.href);
                  }}
                >
                  <span>{getRequestDemoLabel(globalNav.cta.label)}</span>
                </Link>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}

      {isCatalogWorkspace && workspaceMobileRailOpen ? (
        <div
          className="fixed inset-0 z-[58] bg-slate-950/45 backdrop-blur-sm min-[1240px]:hidden"
          onClick={() => setWorkspaceMobileRailOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 flex h-full w-[min(88vw,340px)] flex-col border-r border-slate-200/70 bg-white/95 p-4 shadow-2xl dark:border-[var(--stroke)] dark:bg-[var(--bg)]/95"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                  Catalog menu
                </div>
                <div className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                  Aixcelerator workspace
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWorkspaceMobileRailOpen(false)}
                className="btn btn-ghost btn-icon"
                aria-label="Close catalog sidebar"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto">
              {workspaceSections.map((section) => (
                <div key={section.title} className="mb-4">
                  <div className="px-1 text-label font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                    {section.title}
                  </div>
                  <div className="mt-2 grid gap-1">
                    {section.links.map((link) => {
                      const isActive = isActiveNavPath(currentPath, link.href, workspaceNavPaths);
                      return (
                        <MobileLink
                          key={`${section.title}-${link.label}-${link.href}`}
                          href={link.href}
                          target={link.target}
                          active={isActive}
                          onClick={() => setWorkspaceMobileRailOpen(false)}
                          className="text-sm font-semibold"
                        >
                          {link.label}
                        </MobileLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/assistant"
              className="btn btn-secondary btn-sm mt-2 w-full justify-center"
              onClick={() => setWorkspaceMobileRailOpen(false)}
            >
              Open assistant
            </Link>
          </aside>
        </div>
      ) : null}

      {isCatalogWorkspace ? (
        <div className="w-full flex-1 min-[1240px]:grid min-[1240px]:grid-cols-[var(--workspace-rail-width)_minmax(0,1fr)] min-[1240px]:gap-6 min-[1240px]:px-8" style={workspaceGridStyle}>
          <aside className="hidden min-[1240px]:block" aria-label="Catalog navigation">
            <div className="sticky pb-6" style={{ top: "var(--site-header-height)", height: "calc(100dvh - var(--site-header-height))" }}>
              <div className="surface-panel h-full overflow-y-auto p-3" style={{ maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)" }}>
                {workspaceSections.map((section) => (
                  <div key={section.title} className="mb-4">
                    <div className={`px-2 text-label font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300 ${workspaceRailCollapsed ? "text-center" : ""}`}>
                      {workspaceRailCollapsed ? section.title.charAt(0) : section.title}
                    </div>
                    <div className="mt-2 grid gap-1">
                      {section.links.map((link) => {
                        const isActive = isActiveNavPath(currentPath, link.href, workspaceNavPaths);
                        return (
                          <Link
                            key={`${section.title}-${link.label}-${link.href}`}
                            href={link.href}
                            target={link.target ?? undefined}
                            rel={getLinkRel(link.target)}
                            title={workspaceRailCollapsed ? link.label : undefined}
                            className={`focus-ring flex items-center gap-2 rounded-xl border px-2.5 py-2 text-sm font-semibold transition ${
                              isActive
                                ? "border-[var(--pivot-fill)]/40 bg-[var(--pivot-fill)]/10 text-[var(--text-primary)] dark:border-[var(--pivot-fill)]/55 dark:bg-[var(--pivot-fill)]/25 dark:text-[var(--text-primary)]"
                                : "border-slate-200/70 bg-white/80 text-slate-700 hover:border-[var(--pivot-fill)]/35 hover:text-[var(--text-primary)] dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-200 dark:hover:border-[var(--pivot-fill)]/45 dark:hover:text-[var(--text-primary)]"
                            } ${workspaceRailCollapsed ? "justify-center" : ""}`}
                          >
                            <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-label font-semibold ${isActive ? "border-[var(--pivot-fill)]/45 bg-white/90 text-[var(--text-primary)] dark:border-[var(--pivot-fill)]/60 dark:bg-[#374151]/85 dark:text-[var(--text-primary)]" : "border-slate-200/80 bg-white/90 text-slate-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300"}`}>
                              {link.label
                                .split(" ")
                                .map((token) => token[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                            {!workspaceRailCollapsed ? <span className="line-clamp-1">{link.label}</span> : null}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
          <main id="main-content" className="main-offset relative min-w-0 px-4 sm:px-6 min-[1240px]:px-0">
            {children}
          </main>
        </div>
      ) : (
        <main id="main-content" className="main-offset relative w-full flex-1 px-4 sm:px-6 xl:px-8">
          {children}
        </main>
      )}

      {showSignalBanner ? (
        <div className="px-4 sm:px-6 lg:px-8">
          <AnimatedSignalBanner {...signalBannerConfig} />
        </div>
      ) : null}

      <footer role="contentinfo" className="footer-surface mt-10 border-t border-slate-200/60 dark:border-slate-700/40">
        <div className="px-4 pt-10 sm:px-6 lg:px-8">
          <section className="cta-band-enterprise grid gap-6 rounded-2xl border border-slate-200/70 p-7 shadow-[0_24px_56px_rgba(15,23,42,0.14)] dark:border-slate-700/70 sm:p-8 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-brand-teal-300/35 bg-slate-950/30 px-3 py-1 text-label font-semibold uppercase tracking-[0.18em] text-brand-teal-100">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--trusted-fill)]" />
                Enterprise AI delivery
              </div>
              <h2 className="font-display mt-4 text-display-xs font-bold leading-tight text-white sm:text-display-sm">
                Build once. Govern centrally. Scale AI across every domain.
              </h2>
              <p className="mt-3 max-w-2xl text-caption leading-relaxed text-slate-300 sm:text-base">
                Colaberry brings agents, MCP servers, skills, podcasts, and use cases into one operating surface designed for teams and LLM workflows.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Link href="/request-demo" className="btn btn-cta h-11 justify-center text-sm font-semibold">
                Book a demo
              </Link>
              <Link href="/aixcelerator" className="btn border border-white/25 bg-white/90 text-slate-900 hover:bg-white h-11 justify-center text-sm font-semibold">
                Explore platform
              </Link>
              <div className="rounded-lg border border-white/15 bg-white/8 px-4 py-3 text-sm text-slate-200 sm:col-span-2 lg:col-span-1">
                <div className="text-label font-semibold uppercase tracking-[0.16em] text-slate-400">Built for</div>
                <div className="mt-1.5 text-sm">AI consulting · Enterprise delivery · Production rollout</div>
              </div>
            </div>
          </section>
        </div>
        <div className="border-b border-[var(--stroke)] px-4 py-6 sm:px-6 lg:px-8 dark:border-[var(--stroke)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Stay in the loop</div>
              <p className="mt-1 text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">Get product updates and enterprise AI insights.</p>
            </div>
            <NewsletterSignup compact sourcePath={router.asPath} sourcePage="layout-footer" title="" description="" ctaLabel="Subscribe" />
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-8 px-4 py-16 text-sm sm:grid-cols-3 sm:px-6 lg:grid-cols-5 lg:px-8 lg:py-20">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)] dark:text-[var(--text-primary)]">
              Company
            </div>
            <div className="mt-3 grid gap-2.5">
              <div>
                <FooterLink href="/">About</FooterLink>
              </div>
              <div>
                <FooterLink href="https://colaberry.com/careers" target="_blank">Careers</FooterLink>
              </div>
              <div>
                <FooterLink href="/request-demo">Contact</FooterLink>
              </div>
            </div>
          </div>

          {globalNav.footerColumns.map((column, index) => (
            <div key={`${column.title}-${index}`}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                {column.title}
              </div>
              <div className="mt-3 grid gap-2.5">
                {column.links.map((link) => (
                  <div key={`${link.label}-${link.href}`}>
                    <FooterLink href={link.href} target={link.target}>
                      {link.label}
                    </FooterLink>
                    {link.children?.length ? (
                      <div className="ml-3 mt-1.5 grid gap-1.5 border-l border-[var(--stroke)] pl-3 dark:border-[var(--stroke)]">
                        {link.children.map((child) => (
                          <FooterLink
                            key={`${child.label}-${child.href}`}
                            href={child.href}
                            target={child.target}
                            className="text-xs font-medium"
                          >
                            {child.label}
                          </FooterLink>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)] dark:text-[var(--text-primary)]">
              Connect
            </div>
            <div className="mt-3 grid gap-2.5">
              <div><FooterLink href="/updates">Updates</FooterLink></div>
              <div><FooterLink href="/resources/podcasts">Podcast</FooterLink></div>
              <div><FooterLink href="/search">Search</FooterLink></div>
            </div>
            <div className="mt-6">
              <div className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] dark:text-[var(--text-muted)]">
                Enterprise AI. Governed. Delivered.
              </div>
            </div>
          </div>
        </div>

        {/* Trust + compliance badges */}
        <div className="border-t border-[var(--stroke)] px-4 py-4 dark:border-[var(--stroke)] sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 14s5.33-2.67 5.33-6.67V3.33L8 1.33 2.67 3.33v4C2.67 11.33 8 14 8 14z" /></svg>
              HSTS Preload
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7.33" width="12" height="7.33" rx="1.33" /><path d="M4.67 7.33V4.67a3.33 3.33 0 0 1 6.66 0v2.66" /></svg>
              CSP Headers
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5" /><path d="m6 8 1.33 1.33L10 6.67" /></svg>
              WCAG AA
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5" /><path d="M2 8h12M8 2a10.2 10.2 0 0 1 2.67 6A10.2 10.2 0 0 1 8 14a10.2 10.2 0 0 1-2.67-6A10.2 10.2 0 0 1 8 2z" /></svg>
              GDPR Ready
            </span>
          </div>
        </div>
        <div className="border-t border-[var(--stroke)] px-4 py-4 text-xs dark:border-[var(--stroke)] sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[var(--text-muted)] dark:text-[var(--text-muted)]">&copy; {new Date().getFullYear()} Colaberry, Inc. All rights reserved.</span>
              {globalNav.legalLinks.map((link) => (
                <FooterLink
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target={link.target}
                  className="text-xs font-medium"
                >
                  {link.label}
                </FooterLink>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {globalNav.socialLinks.map((link) => (
                <SocialIcon
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  target={link.target}
                />
              ))}
            </div>
          </div>
        </div>
      </footer>
      {searchOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/40 px-4 py-6 backdrop-blur-sm"
          onClick={(event) => {
            if (!allowBackdropClose) return;
            if (event.currentTarget === event.target) {
              closeSearch();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-search-title"
            ref={searchDialogRef}
            className="w-full max-w-2xl rounded-xl border border-slate-200/70 bg-white p-6 shadow-2xl dark:border-[var(--stroke)] dark:bg-[var(--bg)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-[var(--text-muted)]">
                  Global search
                </div>
                <h2 id="global-search-title" className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                  Search the Colaberry catalog
                </h2>
              </div>
              <button
                type="button"
                onClick={closeSearch}
                className="btn btn-ghost btn-icon"
                aria-label="Close search"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path
                    d="M6 6 18 18M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <form action="/search" method="get" role="search" className="mt-5">
              <label htmlFor="global-search-input" className="sr-only">
                Search
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <input
                    ref={searchInputRef}
                    id="global-search-input"
                    name="q"
                    type="search"
                    placeholder="Search agents, MCP servers, skills, resources, updates..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-[var(--pivot-fill)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--pivot-fill)]/25 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[var(--text-muted)]">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                      <path
                        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M16.25 16.25 21 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Search
                </button>
              </div>
            </form>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Discovery assistant", href: "/assistant" },
                  { label: "Agents catalog", href: "/aixcelerator/agents" },
                  { label: "MCP servers", href: "/aixcelerator/mcp" },
                  { label: "Skills catalog", href: "/aixcelerator/skills" },
                  { label: "Solutions overview", href: "/solutions" },
                  { label: "Resources hub", href: "/resources" },
                  { label: "Industry playbooks", href: "/industries" },
                { label: "News & updates", href: "/updates" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring rounded-lg border border-slate-200/80 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-[var(--pivot-fill)]/30 hover:text-[var(--pivot-fill)] dark:border-[var(--stroke)] dark:bg-[#1E293B]/70 dark:text-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {isCatalogWorkspace && discoveryOpen ? (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-6">
          <div className="surface-panel border border-slate-200/70 bg-white/95 p-4 shadow-xl dark:border-[var(--stroke)] dark:bg-[var(--bg)]/90">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-[var(--text-muted)]">
                  Quick start
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                  Explore the enterprise catalog
                </div>
              </div>
              <button
                type="button"
                onClick={dismissDiscovery}
                className="btn btn-ghost btn-icon"
                aria-label="Dismiss"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M6 6 18 18M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Jump straight into agents, MCPs, and skills-or explore validated resources and industry playbooks.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                { label: "Discovery assistant", href: "/assistant" },
                { label: "Agents catalog", href: "/aixcelerator/agents" },
                { label: "MCP servers", href: "/aixcelerator/mcp" },
                { label: "Skills catalog", href: "/aixcelerator/skills" },
                { label: "Resources hub", href: "/resources" },
                { label: "Industry playbooks", href: "/industries" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-[var(--pivot-fill)]/30 hover:text-[var(--pivot-fill)] dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {isCatalogWorkspace && !mobileMenuOpen && !workspaceMobileRailOpen && !searchOpen ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center px-4 min-[1240px]:inset-x-auto min-[1240px]:right-8 min-[1240px]:px-0">
          <form
            action="/search"
            method="get"
            className="pointer-events-auto flex w-full max-w-2xl items-center gap-2 rounded-lg border border-slate-200/80 bg-white/95 p-2 shadow-xl dark:border-[var(--stroke)] dark:bg-[var(--bg)]/95 lg:w-[36rem]"
          >
            <label htmlFor="workspace-ask" className="sr-only">
              Ask about this page
            </label>
            <input
              id="workspace-ask"
              name="q"
              type="search"
              placeholder="Ask this page: agents, MCP servers, skills, use cases..."
              className="w-full rounded-xl border border-transparent bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--pivot-fill)]/35 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <button type="submit" className="btn btn-primary btn-sm whitespace-nowrap">
              Ask
            </button>
          </form>
        </div>
      ) : null}
      <CookieConsentBanner />
      <DemoRequestWizardModal
        open={demoWizardOpen}
        onClose={() => setDemoWizardOpen(false)}
        sourcePage="header-cta-wizard"
        sourcePath={router.asPath}
      />
      {/* Back-to-top floating button */}
      <button
        type="button"
        aria-label="Back to top"
        className={`back-to-top btn-icon${headerCompact ? " visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 15V5M10 5l-4 4M10 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

