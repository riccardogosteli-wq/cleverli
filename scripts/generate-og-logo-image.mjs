import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const logoPath = path.join(projectRoot, "public", "cleverli-logo-tight.png");
const outputPath = path.join(projectRoot, "public", "og-cleverli-primarschule-2026.png");

const width = 1200;
const height = 630;

const background = Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#edf9f2"/>
        <stop offset="1" stop-color="#f8fbff"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#064e3b" flood-opacity="0.13"/>
      </filter>
    </defs>
    <rect width="1200" height="630" fill="url(#background)"/>
    <circle cx="40" cy="25" r="190" fill="#bbebcc" opacity="0.55"/>
    <circle cx="1165" cy="610" r="220" fill="#d7eaff" opacity="0.55"/>
    <circle cx="1110" cy="55" r="64" fill="#fde9bd" opacity="0.72"/>
    <rect x="58" y="76" width="1084" height="478" rx="72" fill="#ffffff" filter="url(#shadow)"/>
  </svg>
`);

const logo = await sharp(logoPath)
  .resize({ width: 880, height: 356, fit: "contain", withoutEnlargement: true })
  .png()
  .toBuffer();

const claim = Buffer.from(`
  <svg width="1084" height="92" viewBox="0 0 1084 92" xmlns="http://www.w3.org/2000/svg">
    <text x="542" y="58" text-anchor="middle"
      font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700"
      letter-spacing="-0.5" fill="#174d7e">Die Lernplattform für die Primarschule</text>
  </svg>
`);

await sharp(background)
  .composite([
    { input: logo, left: 160, top: 92 },
    { input: claim, left: 58, top: 444 },
  ])
  .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
  .toFile(outputPath);

console.log(`Generated ${outputPath}`);
