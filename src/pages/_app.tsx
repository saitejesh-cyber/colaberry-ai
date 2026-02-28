import type { AppProps } from "next/app";
import { PT_Serif, Source_Sans_3 } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import "../styles/globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-sans",
  display: "swap",
});

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-serif",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    // Respect reduced-motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const handleStart = (url: string) => {
      if (url !== router.asPath) setTransitioning(true);
    };
    const handleComplete = () => setTransitioning(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <div className={`${sourceSans.variable} ${ptSerif.variable}`}>
      <div
        style={{
          opacity: transitioning ? 0 : 1,
          transition: "opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: transitioning ? "opacity" : "auto",
        }}
      >
        <Component {...pageProps} />
      </div>
    </div>
  );
}
