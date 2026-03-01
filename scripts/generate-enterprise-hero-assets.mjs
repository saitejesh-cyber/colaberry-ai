import fs from "node:fs/promises";
import path from "node:path";

const WIDTH = 2400;
const HEIGHT = 1350;
const HERO_DIR = path.resolve("public/media/hero");

const THEMES = [
  {
    key: "hero-platform-enterprise-v3.svg",
    motif: "dashboard",
    colors: {
      baseA: "#060918",
      baseB: "#0F1635",
      baseC: "#1E1B4B",
      orbA: "#6366F1",
      orbB: "#2DD4BF",
      accentA: "#C7D2FE",
      accentB: "#99F6E4",
    },
  },
  {
    key: "hero-agents-enterprise-v3.svg",
    motif: "agent-network",
    colors: {
      baseA: "#060917",
      baseB: "#111836",
      baseC: "#1E1B4B",
      orbA: "#4F46E5",
      orbB: "#14B8A6",
      accentA: "#A5B4FC",
      accentB: "#5EEAD4",
    },
  },
  {
    key: "hero-mcp-enterprise-v3.svg",
    motif: "integration-grid",
    colors: {
      baseA: "#070A1A",
      baseB: "#111A3A",
      baseC: "#312E81",
      orbA: "#818CF8",
      orbB: "#0D9488",
      accentA: "#C7D2FE",
      accentB: "#99F6E4",
    },
  },
  {
    key: "hero-solutions-enterprise-v3.svg",
    motif: "solution-path",
    colors: {
      baseA: "#050918",
      baseB: "#141940",
      baseC: "#1E1B4B",
      orbA: "#6366F1",
      orbB: "#2DD4BF",
      accentA: "#C7D2FE",
      accentB: "#CCFBF1",
    },
  },
  {
    key: "hero-resources-enterprise-v3.svg",
    motif: "knowledge-stack",
    colors: {
      baseA: "#080B1A",
      baseB: "#12193E",
      baseC: "#312E81",
      orbA: "#4F46E5",
      orbB: "#0D9488",
      accentA: "#A5B4FC",
      accentB: "#99F6E4",
    },
  },
  {
    key: "hero-industries-enterprise-v3.svg",
    motif: "industry-rings",
    colors: {
      baseA: "#070A16",
      baseB: "#141D38",
      baseC: "#1E1B4B",
      orbA: "#6366F1",
      orbB: "#14B8A6",
      accentA: "#C7D2FE",
      accentB: "#5EEAD4",
    },
  },
  {
    key: "hero-updates-enterprise-v3.svg",
    motif: "timeline-feed",
    colors: {
      baseA: "#070A18",
      baseB: "#111940",
      baseC: "#3730A3",
      orbA: "#818CF8",
      orbB: "#2DD4BF",
      accentA: "#C7D2FE",
      accentB: "#99F6E4",
    },
  },
  {
    key: "hero-podcasts-enterprise-v3.svg",
    motif: "audio-wave",
    colors: {
      baseA: "#060A18",
      baseB: "#14193E",
      baseC: "#1E1B4B",
      orbA: "#4F46E5",
      orbB: "#0D9488",
      accentA: "#A5B4FC",
      accentB: "#CCFBF1",
    },
  },
  {
    key: "hero-books-enterprise-v3.svg",
    motif: "book-arc",
    colors: {
      baseA: "#060A16",
      baseB: "#121B3A",
      baseC: "#312E81",
      orbA: "#6366F1",
      orbB: "#14B8A6",
      accentA: "#C7D2FE",
      accentB: "#99F6E4",
    },
  },
  {
    key: "hero-case-studies-enterprise-v3.svg",
    motif: "outcome-cards",
    colors: {
      baseA: "#060915",
      baseB: "#151D3B",
      baseC: "#1E1B4B",
      orbA: "#818CF8",
      orbB: "#2DD4BF",
      accentA: "#E0E7FF",
      accentB: "#CCFBF1",
    },
  },
  {
    key: "hero-whitepapers-enterprise-v3.svg",
    motif: "document-grid",
    colors: {
      baseA: "#070A16",
      baseB: "#141B38",
      baseC: "#3730A3",
      orbA: "#4F46E5",
      orbB: "#0D9488",
      accentA: "#A5B4FC",
      accentB: "#99F6E4",
    },
  },
  {
    key: "hero-request-demo-enterprise-v1.svg",
    motif: "solution-path",
    colors: {
      baseA: "#07121D",
      baseB: "#123047",
      baseC: "#1E3A5F",
      orbA: "#0EA5E9",
      orbB: "#14B8A6",
      accentA: "#BAE6FD",
      accentB: "#99F6E4",
    },
  },
  {
    key: "hero-assistant-enterprise-v1.svg",
    motif: "agent-network",
    colors: {
      baseA: "#08111E",
      baseB: "#172A45",
      baseC: "#22466C",
      orbA: "#38BDF8",
      orbB: "#14B8A6",
      accentA: "#BFDBFE",
      accentB: "#A7F3D0",
    },
  },
  {
    key: "hero-articles-enterprise-v1.svg",
    motif: "timeline-feed",
    colors: {
      baseA: "#120D1B",
      baseB: "#2C1A3B",
      baseC: "#493062",
      orbA: "#FB923C",
      orbB: "#F59E0B",
      accentA: "#FED7AA",
      accentB: "#FDE68A",
    },
  },
  {
    key: "hero-privacy-enterprise-v1.svg",
    motif: "document-grid",
    colors: {
      baseA: "#0A1118",
      baseB: "#1A2A33",
      baseC: "#24414A",
      orbA: "#22D3EE",
      orbB: "#34D399",
      accentA: "#CFFAFE",
      accentB: "#A7F3D0",
    },
  },
  {
    key: "hero-cookie-enterprise-v1.svg",
    motif: "document-grid",
    colors: {
      baseA: "#1A1210",
      baseB: "#332219",
      baseC: "#4A3427",
      orbA: "#F59E0B",
      orbB: "#FB923C",
      accentA: "#FDE68A",
      accentB: "#FED7AA",
    },
  },
  {
    key: "hero-unsubscribe-enterprise-v1.svg",
    motif: "timeline-feed",
    colors: {
      baseA: "#1A1022",
      baseB: "#2E1E3D",
      baseC: "#4A2E5B",
      orbA: "#F472B6",
      orbB: "#FB7185",
      accentA: "#F5D0FE",
      accentB: "#FECDD3",
    },
  },
];

function buildMotif(theme) {
  const x = 1320;
  const y = 220;
  switch (theme.motif) {
    case "dashboard":
      return `
        <g opacity="0.96">
          <rect x="${x}" y="${y}" width="920" height="560" rx="22" fill="rgba(11,22,46,0.82)" stroke="${theme.colors.accentA}" stroke-opacity="0.35"/>
          <rect x="${x + 34}" y="${y + 34}" width="420" height="160" rx="14" fill="rgba(152,206,255,0.10)" stroke="${theme.colors.accentB}" stroke-opacity="0.35"/>
          <rect x="${x + 478}" y="${y + 34}" width="408" height="160" rx="14" fill="rgba(202,190,255,0.10)" stroke="${theme.colors.accentA}" stroke-opacity="0.35"/>
          <rect x="${x + 34}" y="${y + 220}" width="850" height="74" rx="14" fill="rgba(140,235,255,0.09)" stroke="${theme.colors.accentB}" stroke-opacity="0.28"/>
          <rect x="${x + 34}" y="${y + 316}" width="260" height="214" rx="14" fill="rgba(197,188,255,0.08)" stroke="${theme.colors.accentA}" stroke-opacity="0.32"/>
          <rect x="${x + 316}" y="${y + 316}" width="260" height="214" rx="14" fill="rgba(126,223,255,0.08)" stroke="${theme.colors.accentB}" stroke-opacity="0.32"/>
          <rect x="${x + 598}" y="${y + 316}" width="286" height="214" rx="14" fill="rgba(197,188,255,0.08)" stroke="${theme.colors.accentA}" stroke-opacity="0.32"/>
        </g>
      `;
    case "agent-network":
      return `
        <g fill="none" stroke="${theme.colors.accentB}" stroke-opacity="0.58" stroke-width="2.2">
          <path d="M1370 920C1470 820 1600 760 1730 760C1880 760 1990 820 2110 940"/>
          <path d="M1370 980C1520 860 1640 840 1740 840C1870 840 2030 900 2150 1030"/>
          <path d="M1460 720C1600 640 1740 620 1880 650C2010 680 2130 760 2240 890"/>
        </g>
        <g fill="rgba(8,16,36,0.85)" stroke="${theme.colors.accentA}" stroke-opacity="0.54">
          <circle cx="1370" cy="920" r="46"/>
          <circle cx="1510" cy="790" r="36"/>
          <circle cx="1730" cy="760" r="42"/>
          <circle cx="1930" cy="810" r="36"/>
          <circle cx="2110" cy="940" r="44"/>
          <circle cx="2240" cy="890" r="38"/>
        </g>
        <g fill="${theme.colors.accentB}">
          <circle cx="1370" cy="920" r="6"/>
          <circle cx="1510" cy="790" r="6"/>
          <circle cx="1730" cy="760" r="6"/>
          <circle cx="1930" cy="810" r="6"/>
          <circle cx="2110" cy="940" r="6"/>
          <circle cx="2240" cy="890" r="6"/>
        </g>
      `;
    case "integration-grid":
      return `
        <g opacity="0.95">
          <rect x="1360" y="290" width="860" height="620" rx="20" fill="rgba(11,21,45,0.72)" stroke="${theme.colors.accentA}" stroke-opacity="0.32"/>
          <rect x="1410" y="350" width="230" height="150" rx="14" fill="rgba(147,210,255,0.09)" stroke="${theme.colors.accentB}" stroke-opacity="0.34"/>
          <rect x="1675" y="350" width="230" height="150" rx="14" fill="rgba(204,193,255,0.09)" stroke="${theme.colors.accentA}" stroke-opacity="0.34"/>
          <rect x="1940" y="350" width="230" height="150" rx="14" fill="rgba(147,210,255,0.09)" stroke="${theme.colors.accentB}" stroke-opacity="0.34"/>
          <rect x="1410" y="560" width="230" height="150" rx="14" fill="rgba(204,193,255,0.09)" stroke="${theme.colors.accentA}" stroke-opacity="0.34"/>
          <rect x="1675" y="560" width="230" height="150" rx="14" fill="rgba(147,210,255,0.09)" stroke="${theme.colors.accentB}" stroke-opacity="0.34"/>
          <rect x="1940" y="560" width="230" height="150" rx="14" fill="rgba(204,193,255,0.09)" stroke="${theme.colors.accentA}" stroke-opacity="0.34"/>
        </g>
        <g fill="none" stroke="${theme.colors.accentB}" stroke-opacity="0.48" stroke-width="2">
          <path d="M1525 500V560"/>
          <path d="M1790 500V560"/>
          <path d="M2055 500V560"/>
          <path d="M1640 425H1675"/>
          <path d="M1905 425H1940"/>
          <path d="M1640 635H1675"/>
          <path d="M1905 635H1940"/>
        </g>
      `;
    case "solution-path":
      return `
        <g opacity="0.95">
          <rect x="1380" y="280" width="820" height="210" rx="18" fill="rgba(13,25,49,0.74)" stroke="${theme.colors.accentA}" stroke-opacity="0.36"/>
          <rect x="1460" y="560" width="760" height="210" rx="18" fill="rgba(11,28,47,0.72)" stroke="${theme.colors.accentB}" stroke-opacity="0.32"/>
          <rect x="1550" y="840" width="670" height="210" rx="18" fill="rgba(8,24,44,0.72)" stroke="${theme.colors.accentA}" stroke-opacity="0.30"/>
        </g>
        <g fill="none" stroke="${theme.colors.accentB}" stroke-width="5" stroke-linecap="round" opacity="0.8">
          <path d="M1418 385C1530 385 1624 385 1730 385"/>
          <path d="M1512 665C1620 665 1718 665 1826 665"/>
          <path d="M1600 945C1700 945 1790 945 1888 945"/>
        </g>
      `;
    case "knowledge-stack":
      return `
        <g opacity="0.95">
          <rect x="1450" y="320" width="760" height="160" rx="18" fill="rgba(14,29,53,0.75)" stroke="${theme.colors.accentA}" stroke-opacity="0.32"/>
          <rect x="1400" y="510" width="760" height="160" rx="18" fill="rgba(12,27,50,0.74)" stroke="${theme.colors.accentB}" stroke-opacity="0.32"/>
          <rect x="1350" y="700" width="760" height="160" rx="18" fill="rgba(10,24,46,0.73)" stroke="${theme.colors.accentA}" stroke-opacity="0.32"/>
          <rect x="1300" y="890" width="760" height="160" rx="18" fill="rgba(8,21,42,0.72)" stroke="${theme.colors.accentB}" stroke-opacity="0.32"/>
        </g>
        <g stroke="${theme.colors.accentB}" stroke-opacity="0.52" stroke-width="2">
          <path d="M1490 383H2130"/>
          <path d="M1440 573H2080"/>
          <path d="M1390 763H2030"/>
          <path d="M1340 953H1980"/>
        </g>
      `;
    case "industry-rings":
      return `
        <g fill="none" stroke-width="2">
          <circle cx="1700" cy="700" r="120" stroke="${theme.colors.accentA}" stroke-opacity="0.48"/>
          <circle cx="1980" cy="760" r="170" stroke="${theme.colors.accentB}" stroke-opacity="0.48"/>
          <circle cx="1490" cy="860" r="200" stroke="${theme.colors.accentA}" stroke-opacity="0.34"/>
          <circle cx="2140" cy="520" r="110" stroke="${theme.colors.accentB}" stroke-opacity="0.38"/>
        </g>
        <g fill="rgba(8,18,38,0.8)" stroke="${theme.colors.accentA}" stroke-opacity="0.44">
          <rect x="1505" y="660" width="390" height="190" rx="16"/>
          <rect x="1965" y="640" width="260" height="150" rx="16"/>
          <rect x="1830" y="430" width="240" height="140" rx="16"/>
        </g>
      `;
    case "timeline-feed":
      return `
        <g opacity="0.96">
          <rect x="1400" y="300" width="820" height="740" rx="20" fill="rgba(10,22,45,0.72)" stroke="${theme.colors.accentA}" stroke-opacity="0.34"/>
        </g>
        <g fill="none" stroke="${theme.colors.accentB}" stroke-width="2.4" stroke-linecap="round">
          <path d="M1530 430H2080"/>
          <path d="M1530 580H2080"/>
          <path d="M1530 730H2080"/>
          <path d="M1530 880H2080"/>
        </g>
        <g fill="${theme.colors.accentB}">
          <circle cx="1480" cy="430" r="12"/>
          <circle cx="1480" cy="580" r="12"/>
          <circle cx="1480" cy="730" r="12"/>
          <circle cx="1480" cy="880" r="12"/>
        </g>
      `;
    case "audio-wave":
      return `
        <g stroke="${theme.colors.accentB}" stroke-opacity="0.64" stroke-width="3" fill="none">
          <path d="M1360 860V640"/>
          <path d="M1430 900V600"/>
          <path d="M1500 930V570"/>
          <path d="M1570 860V640"/>
          <path d="M1640 780V720"/>
          <path d="M1710 830V670"/>
          <path d="M1780 930V570"/>
          <path d="M1850 1030V470"/>
          <path d="M1920 970V530"/>
          <path d="M1990 860V640"/>
          <path d="M2060 900V600"/>
          <path d="M2130 950V550"/>
          <path d="M2200 860V640"/>
        </g>
        <circle cx="1780" cy="750" r="230" fill="rgba(10,22,44,0.68)" stroke="${theme.colors.accentA}" stroke-opacity="0.42"/>
        <circle cx="1780" cy="750" r="140" fill="rgba(12,30,51,0.5)" stroke="${theme.colors.accentB}" stroke-opacity="0.42"/>
      `;
    case "book-arc":
      return `
        <g opacity="0.95">
          <path d="M1410 980V500C1410 452 1440 420 1488 420H1840C1888 420 1918 452 1918 500V980C1866 940 1810 922 1746 922H1582C1518 922 1462 940 1410 980Z" fill="rgba(12,25,48,0.76)" stroke="${theme.colors.accentA}" stroke-opacity="0.36"/>
          <path d="M1918 980V500C1918 452 1948 420 1996 420H2348C2396 420 2426 452 2426 500V980C2374 940 2318 922 2254 922H2090C2026 922 1970 940 1918 980Z" fill="rgba(10,22,44,0.74)" stroke="${theme.colors.accentB}" stroke-opacity="0.36"/>
          <path d="M1918 500V996" stroke="${theme.colors.accentA}" stroke-opacity="0.46" stroke-width="2"/>
        </g>
      `;
    case "outcome-cards":
      return `
        <g opacity="0.96">
          <rect x="1410" y="340" width="760" height="690" rx="24" fill="rgba(10,23,43,0.72)" stroke="${theme.colors.accentA}" stroke-opacity="0.34"/>
          <rect x="1470" y="420" width="640" height="150" rx="14" fill="rgba(142,234,255,0.08)" stroke="${theme.colors.accentB}" stroke-opacity="0.34"/>
          <rect x="1470" y="610" width="300" height="150" rx="14" fill="rgba(211,197,255,0.08)" stroke="${theme.colors.accentA}" stroke-opacity="0.34"/>
          <rect x="1810" y="610" width="300" height="150" rx="14" fill="rgba(142,234,255,0.08)" stroke="${theme.colors.accentB}" stroke-opacity="0.34"/>
          <rect x="1470" y="800" width="640" height="150" rx="14" fill="rgba(211,197,255,0.08)" stroke="${theme.colors.accentA}" stroke-opacity="0.34"/>
        </g>
      `;
    case "document-grid":
      return `
        <g opacity="0.96">
          <rect x="1400" y="320" width="280" height="360" rx="18" fill="rgba(10,24,44,0.72)" stroke="${theme.colors.accentA}" stroke-opacity="0.34"/>
          <rect x="1710" y="280" width="300" height="400" rx="18" fill="rgba(12,30,50,0.72)" stroke="${theme.colors.accentB}" stroke-opacity="0.34"/>
          <rect x="2040" y="350" width="280" height="330" rx="18" fill="rgba(8,21,40,0.72)" stroke="${theme.colors.accentA}" stroke-opacity="0.34"/>
          <rect x="1530" y="730" width="300" height="320" rx="18" fill="rgba(12,30,50,0.72)" stroke="${theme.colors.accentB}" stroke-opacity="0.34"/>
          <rect x="1860" y="760" width="320" height="290" rx="18" fill="rgba(10,24,44,0.72)" stroke="${theme.colors.accentA}" stroke-opacity="0.34"/>
        </g>
      `;
    default:
      return "";
  }
}

function buildSvg(theme) {
  const motif = buildMotif(theme);
  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Colaberry enterprise hero background">
  <defs>
    <linearGradient id="bg-${theme.motif}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${theme.colors.baseA}"/>
      <stop offset="0.54" stop-color="${theme.colors.baseB}"/>
      <stop offset="1" stop-color="${theme.colors.baseC}"/>
    </linearGradient>
    <radialGradient id="orb-a-${theme.motif}" cx="52%" cy="42%" r="56%">
      <stop offset="0" stop-color="${theme.colors.orbA}" stop-opacity="0.48"/>
      <stop offset="1" stop-color="${theme.colors.orbA}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb-b-${theme.motif}" cx="56%" cy="54%" r="56%">
      <stop offset="0" stop-color="${theme.colors.orbB}" stop-opacity="0.44"/>
      <stop offset="1" stop-color="${theme.colors.orbB}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="flow-${theme.motif}" x1="1380" y1="1180" x2="2310" y2="420" gradientUnits="userSpaceOnUse">
      <stop stop-color="${theme.colors.accentA}" stop-opacity="0.88"/>
      <stop offset="0.56" stop-color="${theme.colors.accentB}" stop-opacity="0.84"/>
      <stop offset="1" stop-color="${theme.colors.accentA}" stop-opacity="0.62"/>
    </linearGradient>
    <linearGradient id="left-scrim-${theme.motif}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#030712" stop-opacity="0.94"/>
      <stop offset="0.58" stop-color="#030712" stop-opacity="0.84"/>
      <stop offset="1" stop-color="#030712" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid-${theme.motif}" width="92" height="92" patternUnits="userSpaceOnUse">
      <path d="M92 0H0V92" stroke="#A9B7D0" stroke-opacity="0.085" stroke-width="1"/>
    </pattern>
    <filter id="soft-blur-${theme.motif}" x="-35%" y="-35%" width="170%" height="170%">
      <feGaussianBlur stdDeviation="72"/>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg-${theme.motif})"/>
  <rect width="100%" height="100%" fill="url(#grid-${theme.motif})"/>
  <ellipse cx="1880" cy="360" rx="740" ry="450" fill="url(#orb-a-${theme.motif})" filter="url(#soft-blur-${theme.motif})"/>
  <ellipse cx="1800" cy="980" rx="980" ry="560" fill="url(#orb-b-${theme.motif})" filter="url(#soft-blur-${theme.motif})"/>

  ${motif}

  <g fill="none" stroke="url(#flow-${theme.motif})" stroke-linecap="round">
    <path d="M1380 1100C1540 980 1680 1020 1830 900C1960 796 2090 840 2260 730" stroke-width="8"/>
    <path d="M1380 1168C1540 1064 1690 1088 1840 990C1970 904 2100 948 2260 860" stroke-width="3.2" opacity="0.8"/>
  </g>
  <g fill="#EAF7FF" opacity="0.94">
    <circle cx="1380" cy="1100" r="6"/>
    <circle cx="1830" cy="900" r="6"/>
    <circle cx="2260" cy="730" r="6"/>
  </g>
  <rect width="1300" height="${HEIGHT}" fill="url(#left-scrim-${theme.motif})"/>
</svg>
`;
}

async function run() {
  await fs.mkdir(HERO_DIR, { recursive: true });

  for (const theme of THEMES) {
    const outPath = path.join(HERO_DIR, theme.key);
    await fs.writeFile(outPath, buildSvg(theme), "utf-8");
    console.log(`Generated ${theme.key}`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
