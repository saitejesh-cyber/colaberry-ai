import { Html, Head, Main, NextScript } from "next/document";

const themeInitScript = `
(() => {
  try {
    const storedTheme = window.localStorage.getItem("theme");
    const isDark = storedTheme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
  } catch (_) {}
})();
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        {/*
          Font loading: Inter & JetBrains Mono are loaded via next/font/google
          in _app.tsx with display:"swap". next/font self-hosts the font files at
          build time, so no external Google Fonts stylesheet is needed at runtime.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
