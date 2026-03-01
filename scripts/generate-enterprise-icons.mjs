import fs from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve("public/media/icons/enterprise");
const SIZE = 96;

const ICONS = [
  {
    key: "agent-orchestration",
    content: `
      <circle cx="30" cy="30" r="8" />
      <circle cx="66" cy="30" r="8" />
      <circle cx="48" cy="66" r="8" />
      <path d="M38 34L58 34M34 38L44 58M62 38L52 58" />
    `,
  },
  {
    key: "mcp-integration",
    content: `
      <rect x="20" y="24" width="22" height="22" rx="5" />
      <rect x="54" y="24" width="22" height="22" rx="5" />
      <rect x="37" y="50" width="22" height="22" rx="5" />
      <path d="M42 35H54M31 46V50M65 46V50M48 46V50" />
    `,
  },
  {
    key: "security-shield",
    content: `
      <path d="M48 16L74 26V46C74 63 63 75 48 80C33 75 22 63 22 46V26L48 16Z" />
      <path d="M36 48L44 56L60 40" />
    `,
  },
  {
    key: "analytics-insights",
    content: `
      <path d="M20 72H76" />
      <rect x="24" y="48" width="10" height="20" rx="2" />
      <rect x="42" y="36" width="10" height="32" rx="2" />
      <rect x="60" y="28" width="10" height="40" rx="2" />
    `,
  },
  {
    key: "workflow-automation",
    content: `
      <path d="M24 30H58M58 30L50 22M58 30L50 38" />
      <path d="M72 48H38M38 48L46 40M38 48L46 56" />
      <path d="M24 66H58M58 66L50 58M58 66L50 74" />
    `,
  },
  {
    key: "governance",
    content: `
      <path d="M22 32L48 20L74 32" />
      <path d="M30 32V62M48 32V62M66 32V62" />
      <path d="M24 66H72" />
    `,
  },
  {
    key: "search-discovery",
    content: `
      <circle cx="42" cy="42" r="16" />
      <path d="M54 54L72 72" />
      <path d="M35 42H49M42 35V49" />
    `,
  },
  {
    key: "data-pipeline",
    content: `
      <rect x="20" y="24" width="20" height="14" rx="3" />
      <rect x="56" y="24" width="20" height="14" rx="3" />
      <rect x="38" y="58" width="20" height="14" rx="3" />
      <path d="M40 31H56M48 38V58" />
    `,
  },
  {
    key: "cloud-deployment",
    content: `
      <path d="M30 62H66C74 62 80 56 80 48C80 40 74 34 66 34C64 26 57 20 48 20C39 20 31 26 29 34C22 35 16 41 16 48C16 56 22 62 30 62Z" />
      <path d="M48 36V52M42 46L48 52L54 46" />
    `,
  },
  {
    key: "compliance",
    content: `
      <rect x="24" y="18" width="48" height="60" rx="8" />
      <path d="M34 34H62M34 46H62M34 58H52" />
      <path d="M56 58L62 64L72 52" />
    `,
  },
  {
    key: "podcast-audio",
    content: `
      <circle cx="48" cy="48" r="8" />
      <path d="M48 22V34M48 62V74" />
      <path d="M32 32A23 23 0 0 0 32 64M64 32A23 23 0 0 1 64 64" />
      <path d="M24 24A34 34 0 0 0 24 72M72 24A34 34 0 0 1 72 72" />
    `,
  },
  {
    key: "resource-library",
    content: `
      <rect x="22" y="20" width="14" height="56" rx="3" />
      <rect x="40" y="20" width="14" height="56" rx="3" />
      <rect x="58" y="20" width="16" height="56" rx="3" />
      <path d="M24 34H34M42 30H52M60 38H72" />
    `,
  },
  {
    key: "demo-request",
    content: `
      <rect x="18" y="24" width="60" height="40" rx="8" />
      <path d="M28 34H68M28 44H58M28 54H48" />
      <circle cx="68" cy="64" r="10" />
      <path d="M68 58V70M62 64H74" />
    `,
  },
  {
    key: "solution-playbook",
    content: `
      <path d="M24 22H62C68 22 72 26 72 32V72H34C28 72 24 68 24 62V22Z" />
      <path d="M34 32H62M34 42H62M34 52H54" />
      <path d="M34 72V62C34 56 38 52 44 52H72" />
    `,
  },
  {
    key: "industry-vertical",
    content: `
      <path d="M18 70H78" />
      <rect x="24" y="40" width="10" height="30" rx="2" />
      <rect x="38" y="28" width="10" height="42" rx="2" />
      <rect x="52" y="34" width="10" height="36" rx="2" />
      <rect x="66" y="22" width="8" height="48" rx="2" />
    `,
  },
  {
    key: "llm-indexable",
    content: `
      <path d="M22 22H56L74 40V74H22V22Z" />
      <path d="M56 22V40H74" />
      <path d="M30 48H66M30 58H60M30 68H52" />
      <circle cx="70" cy="70" r="8" />
      <path d="M76 76L84 84" />
    `,
  },
];

function buildSvg(inner) {
  return `
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Enterprise icon">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B1224"/>
      <stop offset="1" stop-color="#1E293B"/>
    </linearGradient>
    <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#93C5FD"/>
      <stop offset="1" stop-color="#5EEAD4"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="84" height="84" rx="20" fill="url(#bg)" />
  <g fill="none" stroke="url(#stroke)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
    ${inner}
  </g>
</svg>
`;
}

async function run() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  for (const icon of ICONS) {
    const outFile = path.join(OUT_DIR, `${icon.key}.svg`);
    await fs.writeFile(outFile, buildSvg(icon.content), "utf8");
    console.log(`Generated ${path.basename(outFile)}`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
