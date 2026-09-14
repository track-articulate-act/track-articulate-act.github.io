import { cp, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Render a plain SVG layout using the image renderer supplied with Next.js.
// The research images are embedded as-is: no generated or retouched content.
const requireFromNext = createRequire(import.meta.resolve("next/package.json"));
const sharp = requireFromNext("sharp");
const source = (path) => new URL(`../public/${path}`, import.meta.url);
const embeddedImage = async (path) =>
  `data:image/jpeg;base64,${(await readFile(source(path))).toString("base64")}`;

const panels = [
  // Original RGB laptop video at 00:03, with its original aspect ratio.
  { file: "assets/preview-human-laptop.jpg", label: "Human video" },
  // A tighter SVG viewport removes only empty black margins around the mesh.
  { file: "videos/laptop.jpg", label: "Recovered articulation", viewBox: "100 25 440 330" },
  { file: "videos/retargeting/allegro/laptop-revers.jpg", label: "Allegro hand in simulation" },
];

const panelMarkup = await Promise.all(panels.map(async (panel, index) => {
  const x = 42 + index * 378;
  const image = await embeddedImage(panel.file);
  const picture = panel.viewBox
    ? `<svg x="${x}" y="238" width="360" height="270" viewBox="${panel.viewBox}" overflow="hidden">
        <image width="640" height="360" href="${image}"/>
      </svg>`
    : `<image x="${x}" y="238" width="360" height="270" preserveAspectRatio="xMidYMid meet" href="${image}"/>`;
  return `
    <rect x="${x}" y="238" width="360" height="270" fill="#000"/>
    ${picture}
    <text x="${x + 180}" y="540" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="22" fill="#38414a">${panel.label}</text>`;
}));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fff"/>
  <text x="600" y="82" text-anchor="middle" font-family="Georgia, serif" font-size="60" fill="#201c19">Track, <tspan fill="#5b4032">Articulate,</tspan> <tspan fill="#382920">Act</tspan></text>
  <text x="600" y="128" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#202a35">Generating Articulation from Casual Human Videos</text>
  <text x="600" y="174" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" fill="#202a35">Jiaming Zhang and Homanga Bharadhwaj</text>
  <text x="600" y="205" text-anchor="middle" font-family="Arial, sans-serif" font-size="19" fill="#596572">Department of Computer Science, Johns Hopkins University</text>
  ${panelMarkup.join("\n")}
  <text x="600" y="597" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#596572">Brains, Bots, and Behavior Lab</text>
</svg>`;

const output = source("assets/social-preview-v2.png");
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(fileURLToPath(output));
// Also replace the former image for clients that still request the old URL.
await cp(output, source("og.png"));
console.log("Rendered the link preview from original website frames (1200 × 630).");
