import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const HERO_DIR = path.resolve("public/media/hero");
const OUT_DIR = path.resolve("public/media/video/hero");
const KEYS = [
  "platform",
  "agents",
  "mcp",
  "solutions",
  "resources",
  "industries",
  "updates",
  "podcasts",
  "books",
  "case-studies",
  "whitepapers",
  "request-demo",
  "assistant",
  "articles",
  "privacy",
  "cookie",
  "unsubscribe",
];

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generateMotionVideo(key) {
  const input = path.join(HERO_DIR, `hero-${key}-realistic-v1.webp`);
  const mp4Out = path.join(OUT_DIR, `hero-${key}-motion-v1.mp4`);
  const webmOut = path.join(OUT_DIR, `hero-${key}-motion-v1.webm`);
  const posterOut = path.join(OUT_DIR, `hero-${key}-motion-poster-v1.jpg`);

  if (!(await exists(input))) {
    console.warn(`Skipping ${key}: missing ${path.basename(input)}`);
    return;
  }

  const motionFilter =
    "zoompan=z='min(zoom+0.00025,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=240:s=1920x1080,format=yuv420p";
  const posterFilter =
    "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080";

  await runCommand("ffmpeg", [
    "-y",
    "-loop",
    "1",
    "-i",
    input,
    "-vf",
    motionFilter,
    "-r",
    "30",
    "-t",
    "8",
    "-an",
    "-c:v",
    "libx264",
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    mp4Out,
  ]);

  await runCommand("ffmpeg", [
    "-y",
    "-loop",
    "1",
    "-i",
    input,
    "-vf",
    motionFilter,
    "-r",
    "30",
    "-t",
    "8",
    "-an",
    "-c:v",
    "libvpx-vp9",
    "-b:v",
    "0",
    "-crf",
    "34",
    "-pix_fmt",
    "yuv420p",
    webmOut,
  ]);

  await runCommand("ffmpeg", [
    "-y",
    "-i",
    input,
    "-vf",
    posterFilter,
    "-update",
    "1",
    "-frames:v",
    "1",
    "-q:v",
    "2",
    posterOut,
  ]);

  console.log(`Generated motion video set for ${key}`);
}

async function run() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  for (const key of KEYS) {
    await generateMotionVideo(key);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
