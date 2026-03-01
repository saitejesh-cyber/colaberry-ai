import path from "node:path";
import sharp from "sharp";

const HERO_DIR = path.resolve("public/media/hero");
const WIDTH = 2400;
const HEIGHT = 1350;
const NANO_HEIGHT = 820;

/**
 * Realistic page banners generated from curated source photos.
 * `position` controls crop focus in the source image.
 */
const BANNERS = [
  {
    key: "platform",
    source: "hero-platform.png",
    position: "right",
    grade: { brightness: 0.95, saturation: 1.08, linearA: 1.02, linearB: -7 },
    leftOpacity: 0.88,
    warmTint: "#93C5FD",
    coolTint: "#67E8F9",
  },
  {
    key: "agents",
    source: "hero-agents.png",
    position: "center",
    grade: { brightness: 0.96, saturation: 1.1, linearA: 1.03, linearB: -8 },
    leftOpacity: 0.86,
    warmTint: "#A5B4FC",
    coolTint: "#93C5FD",
  },
  {
    key: "mcp",
    source: "hero-mcp.png",
    position: "center",
    grade: { brightness: 0.95, saturation: 1.12, linearA: 1.03, linearB: -8 },
    leftOpacity: 0.88,
    warmTint: "#8B5CF6",
    coolTint: "#5EEAD4",
  },
  {
    key: "solutions",
    source: "hero-solutions.png",
    position: "center",
    grade: { brightness: 0.97, saturation: 1.04, linearA: 1.01, linearB: -4 },
    leftOpacity: 0.82,
    warmTint: "#FDE68A",
    coolTint: "#86EFAC",
  },
  {
    key: "resources",
    source: "hero-resources.png",
    position: "right",
    grade: { brightness: 0.95, saturation: 1.08, linearA: 1.02, linearB: -6 },
    leftOpacity: 0.86,
    warmTint: "#8EC5FF",
    coolTint: "#5EEAD4",
  },
  {
    key: "industries",
    source: "hero-industries.png",
    position: "center",
    grade: { brightness: 0.98, saturation: 1.03, linearA: 1.0, linearB: -3 },
    leftOpacity: 0.8,
    warmTint: "#FCD34D",
    coolTint: "#86EFAC",
  },
  {
    key: "updates",
    source: "hero-updates.png",
    position: "center",
    grade: { brightness: 0.97, saturation: 1.04, linearA: 1.0, linearB: -3 },
    leftOpacity: 0.8,
    warmTint: "#FCD34D",
    coolTint: "#86EFAC",
  },
  {
    key: "podcasts",
    source: "hero-podcasts-cinematic.jpg",
    position: "center",
    grade: { brightness: 0.95, saturation: 1.1, linearA: 1.03, linearB: -7 },
    leftOpacity: 0.85,
    warmTint: "#A5B4FC",
    coolTint: "#67E8F9",
  },
  {
    key: "books",
    source: "hero-books-cinematic.jpg",
    position: "center",
    grade: { brightness: 0.96, saturation: 1.06, linearA: 1.02, linearB: -5 },
    leftOpacity: 0.83,
    warmTint: "#FCD34D",
    coolTint: "#A7F3D0",
  },
  {
    key: "case-studies",
    source: "hero-case-studies-cinematic.jpg",
    position: "center",
    grade: { brightness: 0.96, saturation: 1.06, linearA: 1.01, linearB: -5 },
    leftOpacity: 0.83,
    warmTint: "#FDBA74",
    coolTint: "#93C5FD",
  },
  {
    key: "whitepapers",
    source: "hero-whitepapers-cinematic.jpg",
    position: "center",
    grade: { brightness: 0.96, saturation: 1.06, linearA: 1.01, linearB: -5 },
    leftOpacity: 0.83,
    warmTint: "#C4B5FD",
    coolTint: "#99F6E4",
  },
  {
    key: "assistant",
    source: "hero-resources.png",
    position: "right",
    grade: { brightness: 0.95, saturation: 1.08, linearA: 1.02, linearB: -6 },
    leftOpacity: 0.86,
    warmTint: "#8EC5FF",
    coolTint: "#5EEAD4",
  },
  {
    key: "request-demo",
    source: "hero-mcp.png",
    position: "center",
    grade: { brightness: 0.95, saturation: 1.1, linearA: 1.03, linearB: -8 },
    leftOpacity: 0.88,
    warmTint: "#A5B4FC",
    coolTint: "#67E8F9",
  },
  {
    key: "articles",
    source: "hero-updates.png",
    position: "center",
    grade: { brightness: 0.97, saturation: 1.04, linearA: 1.0, linearB: -3 },
    leftOpacity: 0.8,
    warmTint: "#FCD34D",
    coolTint: "#86EFAC",
  },
  {
    key: "privacy",
    source: "hero-platform.png",
    position: "right",
    grade: { brightness: 0.93, saturation: 1.06, linearA: 1.04, linearB: -9 },
    leftOpacity: 0.9,
    warmTint: "#93C5FD",
    coolTint: "#99F6E4",
  },
  {
    key: "cookie",
    source: "hero-updates.png",
    position: "center",
    grade: { brightness: 0.96, saturation: 1.06, linearA: 1.01, linearB: -4 },
    leftOpacity: 0.82,
    warmTint: "#FDBA74",
    coolTint: "#A7F3D0",
  },
  {
    key: "unsubscribe",
    source: "hero-mcp.png",
    position: "center",
    grade: { brightness: 0.94, saturation: 1.08, linearA: 1.03, linearB: -7 },
    leftOpacity: 0.86,
    warmTint: "#C4B5FD",
    coolTint: "#F9A8D4",
  },
];

function overlaySvg({
  width,
  height,
  leftOpacity,
  warmTint,
  coolTint,
}) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leftScrim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#020617" stop-opacity="${leftOpacity}"/>
          <stop offset="0.5" stop-color="#020617" stop-opacity="${Math.max(0.4, leftOpacity - 0.28)}"/>
          <stop offset="1" stop-color="#020617" stop-opacity="0"/>
        </linearGradient>
        <radialGradient id="warm" cx="76%" cy="22%" r="44%">
          <stop offset="0" stop-color="${warmTint}" stop-opacity="0.22"/>
          <stop offset="1" stop-color="${warmTint}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="cool" cx="70%" cy="75%" r="52%">
          <stop offset="0" stop-color="${coolTint}" stop-opacity="0.2"/>
          <stop offset="1" stop-color="${coolTint}" stop-opacity="0"/>
        </radialGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="9"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.035"/>
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#leftScrim)"/>
      <rect width="100%" height="100%" fill="url(#warm)"/>
      <rect width="100%" height="100%" fill="url(#cool)"/>
      <rect width="100%" height="100%" filter="url(#grain)"/>
    </svg>
  `);
}

async function renderBanner(config) {
  const inFile = path.join(HERO_DIR, config.source);
  const outWebp = path.join(HERO_DIR, `hero-${config.key}-realistic-v1.webp`);
  const outJpg = path.join(HERO_DIR, `hero-${config.key}-realistic-v1.jpg`);
  const outNanoWebp = path.join(HERO_DIR, `hero-${config.key}-nano-banner-v1.webp`);

  const baseBuffer = await sharp(inFile)
    .rotate()
    .resize(WIDTH, HEIGHT, {
      fit: "cover",
      position: config.position || "center",
    })
    .removeAlpha()
    .modulate({
      brightness: config.grade.brightness,
      saturation: config.grade.saturation,
    })
    .linear(config.grade.linearA, config.grade.linearB)
    .gamma(1.03)
    .toBuffer();

  const composedBuffer = await sharp(baseBuffer)
    .composite([
      {
        input: overlaySvg({
          width: WIDTH,
          height: HEIGHT,
          leftOpacity: config.leftOpacity,
          warmTint: config.warmTint,
          coolTint: config.coolTint,
        }),
        blend: "soft-light",
      },
    ])
    .sharpen({ sigma: 1.05, m1: 0.22, m2: 1.35, x1: 2, y2: 10, y3: 18 })
    .toBuffer();

  await Promise.all([
    sharp(composedBuffer)
      .webp({ quality: 88, effort: 6, smartSubsample: true })
      .toFile(outWebp),
    sharp(composedBuffer)
      .jpeg({ quality: 91, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(outJpg),
    sharp(composedBuffer)
      .resize(WIDTH, NANO_HEIGHT, { fit: "cover", position: "center" })
      .webp({ quality: 86, effort: 6, smartSubsample: true })
      .toFile(outNanoWebp),
  ]);
}

async function run() {
  for (const banner of BANNERS) {
    try {
      await renderBanner(banner);
      console.log(`Generated hero-${banner.key}-realistic-v1.webp (+jpg, nano)`);
    } catch (error) {
      console.error(`Failed banner: ${banner.key} (${banner.source})`);
      throw error;
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
