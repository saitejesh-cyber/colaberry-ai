import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#0D0D0D",
          blue: "#4478A6",
          deep: "#32738C",
          teal: "#327C8C",
          aqua: "#30838C",
          fog: "#E8E8E8",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-poppins)",
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
      },
    },
  },
  plugins: [],
};

export default config;
