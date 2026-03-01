import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* ── Locked Semantic Scales (2026 Enterprise) ── */
        semantic: {
          failure: { surface: "#FFF1F2", stroke: "#FECDD3", text: "#9F1239", fill: "#E11D48", "on-fill": "#ffffff" },
          pivot: { surface: "#EAF2FF", stroke: "#BCD3F6", text: "#0F172A", fill: "#0F6ADF", "on-fill": "#ffffff" },
          trusted: { surface: "#E8F7F4", stroke: "#9EDBD2", text: "#134E4A", fill: "#0E7C70", "on-fill": "#ffffff" },
          neutral: { surface: "#FAFBFC", stroke: "#E2E8F0", text: "#0F172A", fill: "#F1F5F9" },
          timeline: { 1: "#E0E7FF", 2: "#C7D2FE", 3: "#A5B4FC", 4: "#818CF8", final: "#0F172A" },
        },
        brand: {
          ink: "#0F172A",
          /* Primary palette — indigo (Obsidian Signal) */
          purple: {
            50: "#EEF2FF",
            100: "#E0E7FF",
            200: "#C7D2FE",
            300: "#A5B4FC",
            400: "#818CF8",
            500: "#6366F1",
            600: "#4F46E5",
            700: "#4338CA",
            800: "#3730A3",
            900: "#312E81",
            950: "#1E1B4B",
          },
          /* Accent palette — jade/teal */
          green: {
            50: "#F0FDFA",
            100: "#CCFBF1",
            200: "#99F6E4",
            300: "#5EEAD4",
            400: "#2DD4BF",
            500: "#14B8A6",
            600: "#0D9488",
            700: "#0F766E",
            800: "#115E59",
            900: "#134E4A",
            950: "#042F2E",
          },
          /* Backward-compatible aliases */
          blue: "#0F6ADF",
          deep: "#0F172A",
          aqua: "#0E7C70",
          fog: "#F1F5F9",
          ice: "#F0FDFA",
          slate: "#0F172A",
          surface: "#FAFBFC",
          midnight: "#0F172A",
          orange: "#D97706",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Manrope",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "Source Serif 4",
          "Iowan Old Style",
          "Times New Roman",
          "ui-serif",
          "serif",
        ],
        serif: [
          "var(--font-display)",
          "Source Serif 4",
          "Iowan Old Style",
          "Times New Roman",
          "ui-serif",
          "serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "SF Mono",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.06", letterSpacing: "-0.028em" }],
        "display-lg": ["3rem", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "display-md": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "display-xs": ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "body-lg": ["1.125rem", { lineHeight: "1.65", letterSpacing: "0" }],
        "body-md": ["1rem", { lineHeight: "1.65", letterSpacing: "0" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6", letterSpacing: "0.01em" }],
        "body-xs": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.02em" }],
        "label": ["0.6875rem", { lineHeight: "1", letterSpacing: "0.14em" }],
        "caption": ["0.9375rem", { lineHeight: "1.45", letterSpacing: "0" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "42": "10.5rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "slide-up": "slide-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-down": "slide-down 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both",
        "shimmer": "shimmer 2s linear infinite",
        "slide-in-left": "slide-in-left 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-right": "slide-in-right 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "blur-in": "blur-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "blur-in": {
          from: { opacity: "0", filter: "blur(8px)" },
          to: { opacity: "1", filter: "blur(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
