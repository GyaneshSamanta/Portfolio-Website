#!/usr/bin/env node
/**
 * generate-paper-covers.mjs
 *
 * Branded SVG covers for research-paper work tiles. Each cover surfaces:
 *  - "RESEARCH" eyebrow
 *  - Title in Instrument Serif italic
 *  - IEEE badge (the venue for all three papers)
 *  - Year + paper-themed accent color
 *
 * Output: public/images/papers/<id>.svg
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(REPO_ROOT, "public", "images", "papers");

fs.mkdirSync(OUT_DIR, { recursive: true });

const PAPERS = [
  {
    id: "pegasus-spyware",
    title: "Pegasus Spyware: An Attack System Artemis",
    year: "2023",
    venue: "IEEE ICECAA",
    accent: "#ED2EBA", // magenta
  },
  {
    id: "nft-modeling",
    title: "NFT Analytical Modelling on Blockchain Data",
    year: "2023",
    venue: "IEEE ICNWC",
    accent: "#8E3DEF", // violet
  },
  {
    id: "iot-network",
    title: "Dynamic Network Architecture for IoT",
    year: "2022",
    venue: "IEEE ICICCS",
    accent: "#E491C9", // pink
  },
];

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const trial = cur ? cur + " " + w : w;
    if (trial.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = trial;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

function svgFor(p) {
  const W = 1200;
  const H = 675;
  const lines = wrap(p.title, 26);
  const lineHeight = 84;
  const fontSize = 68;
  const startY = 270;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A0820"/>
      <stop offset="100%" stop-color="#1A1A3A"/>
    </linearGradient>
    <radialGradient id="accent" cx="80%" cy="10%" r="55%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="accent2" cx="10%" cy="100%" r="55%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#accent)"/>
  <rect width="100%" height="100%" fill="url(#accent2)"/>

  <!-- Eyebrow -->
  <text x="60" y="90" font-family="'Geist Mono', ui-monospace, monospace" font-size="22" letter-spacing="6" fill="#C9BCC4">RESEARCH · ${escapeXml(p.year)}</text>

  <!-- Title -->
  ${lines
    .map(
      (line, i) =>
        `<text x="60" y="${startY + i * lineHeight}" font-family="'Instrument Serif', 'Iowan Old Style', serif" font-style="italic" font-size="${fontSize}" fill="#F5EFEF">${escapeXml(line)}</text>`
    )
    .join("\n  ")}

  <!-- IEEE badge -->
  <g transform="translate(60, ${H - 100})">
    <rect width="180" height="48" rx="24" fill="${p.accent}" fill-opacity="0.15" stroke="${p.accent}" stroke-width="1.5"/>
    <text x="22" y="32" font-family="'Geist Mono', monospace" font-size="20" font-weight="700" fill="#F5EFEF" letter-spacing="2">IEEE</text>
    <rect x="68" y="14" width="1" height="20" fill="${p.accent}" opacity="0.5"/>
    <text x="80" y="32" font-family="'Geist Mono', monospace" font-size="14" fill="#C9BCC4" letter-spacing="1.5">${escapeXml(p.venue.replace("IEEE ", ""))}</text>
  </g>

  <!-- Decorative bottom-right line -->
  <line x1="${W - 200}" y1="${H - 76}" x2="${W - 60}" y2="${H - 76}" stroke="${p.accent}" stroke-width="2"/>
  <text x="${W - 60}" y="${H - 60}" text-anchor="end" font-family="'Geist Mono', monospace" font-size="14" fill="#828397" letter-spacing="3">GYANESH.S</text>
</svg>`;
}

let count = 0;
for (const p of PAPERS) {
  const out = path.join(OUT_DIR, `${p.id}.svg`);
  fs.writeFileSync(out, svgFor(p), "utf8");
  count++;
}
console.log(`[papers] Generated ${count} research paper covers`);
