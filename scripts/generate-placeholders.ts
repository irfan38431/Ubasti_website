#!/usr/bin/env tsx
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "public/images/placeholders");
fs.mkdirSync(OUT, { recursive: true });

interface Placeholder {
  name: string;
  width: number;
  height: number;
  bg: string;
  fg: string;
  label: string;
}

const placeholders: Placeholder[] = [
  // Logos
  { name: "logo-mark.svg",          width: 120,  height: 120,  bg: "#5C6A3A", fg: "#F2E0CD", label: "LOGO\nMARK" },
  { name: "logo-wordmark.svg",       width: 320,  height: 80,   bg: "#5C6A3A", fg: "#F2E0CD", label: "UBASTI" },

  // Hero
  { name: "hero-cat-portrait.jpg",   width: 1600, height: 900,  bg: "#909A6B", fg: "#2B2E1F", label: "HERO_CAT\nPORTRAIT" },
  { name: "hero-lounge.jpg",         width: 1600, height: 900,  bg: "#B5BC91", fg: "#2B2E1F", label: "HERO\nLOUNGE" },

  // Offerings triptych
  { name: "offering-coffee.jpg",     width: 800,  height: 800,  bg: "#E8B8AE", fg: "#2B2E1F", label: "OFFERING\nCOFFEE" },
  { name: "offering-cats.jpg",       width: 800,  height: 800,  bg: "#F2D4CC", fg: "#2B2E1F", label: "OFFERING\nCATS" },
  { name: "offering-community.jpg",  width: 800,  height: 800,  bg: "#F2E0CD", fg: "#2B2E1F", label: "OFFERING\nCOMMUNITY" },

  // Kitty portraits (8 seeded cats)
  { name: "kitty-nefertiti.jpg",     width: 900,  height: 1200, bg: "#C9A961", fg: "#2B2E1F", label: "NEFERTITI" },
  { name: "kitty-anubis.jpg",        width: 900,  height: 1200, bg: "#B5A140", fg: "#2B2E1F", label: "ANUBIS" },
  { name: "kitty-cleo.jpg",          width: 900,  height: 1200, bg: "#E8B8AE", fg: "#2B2E1F", label: "CLEO" },
  { name: "kitty-ramses.jpg",        width: 900,  height: 1200, bg: "#909A6B", fg: "#F2E0CD", label: "RAMSES" },
  { name: "kitty-isis.jpg",          width: 900,  height: 1200, bg: "#5C6A3A", fg: "#F2E0CD", label: "ISIS" },
  { name: "kitty-khufu.jpg",         width: 900,  height: 1200, bg: "#F2D4CC", fg: "#2B2E1F", label: "KHUFU" },
  { name: "kitty-hathor.jpg",        width: 900,  height: 1200, bg: "#B5BC91", fg: "#2B2E1F", label: "HATHOR" },
  { name: "kitty-osiris.jpg",        width: 900,  height: 1200, bg: "#C9852B", fg: "#FAF6F0", label: "OSIRIS" },
  { name: "kitty-placeholder.svg",   width: 900,  height: 1200, bg: "#FAF6F0", fg: "#909A6B", label: "KITTY\nPHOTO" },

  // Events
  { name: "event-cover-1.jpg",       width: 1200, height: 800,  bg: "#5C6A3A", fg: "#F2E0CD", label: "EVENT\nCOVER 1" },
  { name: "event-cover-2.jpg",       width: 1200, height: 800,  bg: "#909A6B", fg: "#F2E0CD", label: "EVENT\nCOVER 2" },
  { name: "event-cover-3.jpg",       width: 1200, height: 800,  bg: "#B5A140", fg: "#2B2E1F", label: "EVENT\nCOVER 3" },

  // Blog
  { name: "blog-cover-1.jpg",        width: 1600, height: 900,  bg: "#E8B8AE", fg: "#2B2E1F", label: "BLOG\nCOVER 1" },
  { name: "blog-cover-2.jpg",        width: 1600, height: 900,  bg: "#F2D4CC", fg: "#2B2E1F", label: "BLOG\nCOVER 2" },

  // Party
  { name: "party-birthday.jpg",      width: 1600, height: 1200, bg: "#C9A961", fg: "#2B2E1F", label: "PARTY\nBIRTHDAY" },
  ...Array.from({ length: 9 }, (_, i) => ({
    name: `party-gallery-${i + 1}.jpg`,
    width: 1200,
    height: 1200,
    bg: i % 2 === 0 ? "#F2D4CC" : "#E8B8AE",
    fg: "#2B2E1F",
    label: `PARTY\nGALLERY ${i + 1}`,
  })),

  // Badges (inline SVG — these are the 4 sticker variants)
  { name: "badge-forever-friend.svg",       width: 160, height: 160, bg: "#5C6A3A", fg: "#F2E0CD", label: "FOREVER\nFRIEND" },
  { name: "badge-coffee-cause.svg",         width: 160, height: 160, bg: "#C9A961", fg: "#2B2E1F", label: "COFFEE\nCAUSE" },
  { name: "badge-purrfect-partners.svg",    width: 160, height: 160, bg: "#E8B8AE", fg: "#2B2E1F", label: "PURRFECT\nPARTNERS" },
  { name: "badge-sip-cuddle-relax.svg",     width: 160, height: 160, bg: "#B5BC91", fg: "#2B2E1F", label: "SIP CUDDLE\nRELAX" },

  // About
  { name: "about-story.jpg",         width: 1200, height: 800,  bg: "#F2E0CD", fg: "#2B2E1F", label: "ABOUT\nSTORY" },
  { name: "about-team.jpg",          width: 1200, height: 800,  bg: "#B5BC91", fg: "#2B2E1F", label: "ABOUT\nTEAM" },
];

function makeSvg(p: Placeholder): string {
  const lineHeight = 28;
  const lines = p.label.split("\n");
  const totalTextH = lines.length * lineHeight;
  const midY = p.height / 2 - totalTextH / 2 + lineHeight * 0.8;

  const textEls = lines
    .map(
      (line, i) =>
        `<text x="${p.width / 2}" y="${midY + i * lineHeight}" ` +
        `font-family="monospace" font-size="20" font-weight="bold" ` +
        `fill="${p.fg}" text-anchor="middle">${line}</text>`
    )
    .join("\n  ");

  const dimLabel = `${p.width}×${p.height}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}">
  <rect width="${p.width}" height="${p.height}" fill="${p.bg}"/>
  ${textEls}
  <text x="${p.width / 2}" y="${p.height - 16}" font-family="monospace" font-size="13" fill="${p.fg}" opacity="0.6" text-anchor="middle">${dimLabel}</text>
</svg>`;
}

let written = 0;
for (const p of placeholders) {
  const svg = makeSvg(p);
  // Write as .svg always (even for .jpg names, so they render in browsers)
  const svgName = p.name.replace(/\.(jpg|png)$/, ".svg");
  fs.writeFileSync(path.join(OUT, svgName), svg, "utf8");
  written++;
}

console.log(`✓ Generated ${written} placeholder SVGs → public/images/placeholders/`);
