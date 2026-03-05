/**
 * 🎮 PROFESSIONAL ROADMAP GENERATOR - V2 🎮
 * 
 * Enterprise-grade visual progression system
 * Clean, modern design that scales beautifully
 */

export interface RoadmapConfig {
  title: string;
  checkpoints: {
    id: number;
    label: string;
    progress: number;
    isCompleted: boolean;
    completed: number;
    total: number;
  }[];
  isMobile: boolean;
}

export function generateRoadmapSVG(config: RoadmapConfig): string {
  return config.isMobile ? generateMobileRoadmap(config) : generateDesktopRoadmap(config);
}

/**
 * DESKTOP - Professional horizontal journey
 */
function generateDesktopRoadmap(config: RoadmapConfig): string {
  const width = 900;
  const height = 280;
  const padding = 50;
  const spacing = (width - padding * 2) / Math.max(config.checkpoints.length - 1, 1);
  const centerY = height / 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto">`;

  // Gradients
  svg += `<defs>
    <linearGradient id="grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f0f9ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#faf5ff;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="level-1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="level-2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="level-3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2"/>
    </filter>
  </defs>`;

  // Background
  svg += `<rect width="${width}" height="${height}" fill="url(#grad-bg)" rx="8"/>`;

  // Connecting path
  for (let i = 0; i < config.checkpoints.length - 1; i++) {
    const x1 = padding + i * spacing;
    const x2 = padding + (i + 1) * spacing;
    const y = centerY;
    const isActive = config.checkpoints[i].isCompleted;
    const color = isActive ? "#10b981" : "#d1d5db";
    const width_val = isActive ? "4" : "2";
    svg += `<line x1="${x1 + 45}" y1="${y}" x2="${x2 - 45}" y2="${y}" stroke="${color}" stroke-width="${width_val}" stroke-linecap="round"/>`;
  }

  // Checkpoints
  config.checkpoints.forEach((cp, i) => {
    const x = padding + i * spacing;
    const y = centerY;
    const gradId = i === 0 ? "level-1" : i === 1 ? "level-2" : "level-3";
    const isActive = cp.isCompleted;

    // Circle background
    svg += `<circle cx="${x}" cy="${y}" r="48" fill="url(#${gradId})" filter="url(#shadow)" stroke="${isActive ? '#ffffff' : 'none'}" stroke-width="3" opacity="0.95"/>`;

    // Inner ring
    svg += `<circle cx="${x}" cy="${y}" r="42" fill="none" stroke="white" stroke-width="1.5" opacity="0.3"/>`;

    // Medal emoji
    const medal = isActive ? (i === 0 ? "🥉" : i === 1 ? "🥈" : "🥇") : "🔒";
    svg += `<text x="${x}" y="${y + 6}" font-size="32" text-anchor="middle" dominant-baseline="middle">${medal}</text>`;

    // Level number
    svg += `<text x="${x}" y="${y - 38}" font-size="12" font-weight="800" text-anchor="middle" fill="#374151">Level ${i + 1}</text>`;

    // Label
    svg += `<text x="${x}" y="${y + 65}" font-size="13" font-weight="700" text-anchor="middle" fill="#1f2937">${cp.label}</text>`;

    // Progress bar
    const barW = 70;
    const barH = 6;
    const barX = x - barW / 2;
    const barY = y + 80;
    svg += `<rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" fill="#e5e7eb" rx="3"/>`;

    const fillW = (barW * cp.progress) / 100;
    let color = "#ef4444";
    if (cp.progress > 66) color = "#10b981";
    else if (cp.progress > 33) color = "#f59e0b";

    svg += `<rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" fill="${color}" rx="3"/>`;

    // Percentage
    svg += `<text x="${x}" y="${barY + 22}" font-size="12" font-weight="900" text-anchor="middle" fill="${color}">${Math.round(cp.progress)}%</text>`;
  });

  svg += `</svg>`;
  return svg;
}

/**
 * MOBILE - Clean vertical journey
 */
function generateMobileRoadmap(config: RoadmapConfig): string {
  const width = 340;
  const height = 380;
  const centerX = width / 2;
  const padding = 40;
  const vertSpacing = (height - padding * 2) / Math.max(config.checkpoints.length - 1, 1);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto">`;

  // Gradients
  svg += `<defs>
    <linearGradient id="mob-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f0f9ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#faf5ff;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="mob-level-1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="mob-level-2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="mob-level-3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
    <filter id="mob-shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
    </filter>
  </defs>`;

  // Background
  svg += `<rect width="${width}" height="${height}" fill="url(#mob-bg)" rx="8"/>`;

  // Vertical connector
  for (let i = 0; i < config.checkpoints.length - 1; i++) {
    const y1 = padding + i * vertSpacing + 42;
    const y2 = padding + (i + 1) * vertSpacing - 42;
    const isActive = config.checkpoints[i].isCompleted;
    const color = isActive ? "#10b981" : "#d1d5db";
    const w = isActive ? "4" : "2";
    svg += `<line x1="${centerX}" y1="${y1}" x2="${centerX}" y2="${y2}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  }

  // Checkpoints
  config.checkpoints.forEach((cp, i) => {
    const y = padding + i * vertSpacing;
    const gradId = i === 0 ? "mob-level-1" : i === 1 ? "mob-level-2" : "mob-level-3";
    const isActive = cp.isCompleted;

    // Circle
    svg += `<circle cx="${centerX}" cy="${y}" r="42" fill="url(#${gradId})" filter="url(#mob-shadow)" stroke="${isActive ? '#ffffff' : 'none'}" stroke-width="2.5" opacity="0.95"/>`;

    // Inner ring
    svg += `<circle cx="${centerX}" cy="${y}" r="37" fill="none" stroke="white" stroke-width="1" opacity="0.25"/>`;

    // Medal
    const medal = isActive ? (i === 0 ? "🥉" : i === 1 ? "🥈" : "🥇") : "🔒";
    svg += `<text x="${centerX}" y="${y + 5}" font-size="28" text-anchor="middle" dominant-baseline="middle">${medal}</text>`;

    // Side labels
    const labelX = centerX + 75;
    svg += `<text x="${labelX}" y="${y - 14}" font-size="12" font-weight="700" fill="#1f2937">${cp.label}</text>`;

    // Progress text
    svg += `<text x="${labelX}" y="${y + 3}" font-size="11" font-weight="600" fill="#6b7280">${Math.round(cp.progress)}%</text>`;

    // Mini progress bar
    const mbarW = 55;
    const mbarH = 4;
    svg += `<rect x="${labelX - mbarW / 2}" y="${y + 10}" width="${mbarW}" height="${mbarH}" fill="#e5e7eb" rx="2"/>`;

    let color = "#ef4444";
    if (cp.progress > 66) color = "#10b981";
    else if (cp.progress > 33) color = "#f59e0b";

    const mfillW = (mbarW * cp.progress) / 100;
    svg += `<rect x="${labelX - mbarW / 2}" y="${y + 10}" width="${mfillW}" height="${mbarH}" fill="${color}" rx="2"/>`;
  });

  svg += `</svg>`;
  return svg;
}

export function roadmapToDataURI(svgString: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svgString)}`;
}
