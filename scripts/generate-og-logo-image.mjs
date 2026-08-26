import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const logoPath = path.join(projectRoot, "public", "cleverli-logo-tight.png");
const outputPath = path.join(projectRoot, "public", "og-cleverli-logo-2026.png");

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
  .resize({ width: 1000, height: 406, fit: "contain", withoutEnlargement: true })
  .png()
  .toBuffer();

await sharp(background)
  .composite([{ input: logo, left: 100, top: 112 }])
  .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
  .toFile(outputPath);

console.log(`Generated ${outputPath}`);
