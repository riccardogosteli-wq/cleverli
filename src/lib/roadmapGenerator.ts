/**
 * 🎮 ULTRA-FUN ROADMAP GENERATOR 🎮
 * 
 * Maximum gamification + visual excitement for kids
 * Inspired by Duolingo, Mario, and Kirby games
 */

export interface RoadmapConfig {
  title: string;
  checkpoints: {
    id: number;
    label: string;
    progress: number; // 0-100
    isCompleted: boolean;
    exerciseCount: number;
  }[];
  isMobile: boolean;
}

export function generateRoadmapSVG(config: RoadmapConfig): string {
  return config.isMobile ? generateMobileRoadmap(config) : generateDesktopRoadmap(config);
}

/**
 * DESKTOP - Ultra-colorful horizontal game board 🎮
 */
function generateDesktopRoadmap(config: RoadmapConfig): string {
  const width = 1000;
  const height = 420;
  const padding = 50;
  const spacing = (width - padding * 2) / Math.max(config.checkpoints.length - 1, 1);
  const centerY = height / 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto">`;

  // Epic gradients + filters
  svg += `<defs>
    <linearGradient id="bgMagic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fffbeb;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fef3c7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#dbeafe;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="level1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fde047;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#facc15;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="level2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#38bdf8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0284c7;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="level3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#c084fc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9333ea;stop-opacity:1" />
    </linearGradient>
    <filter id="epicShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.4" flood-color="#000"/>
    </filter>
    <filter id="shine" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
    </filter>
    <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>`;

  // Background
  svg += `<rect width="${width}" height="${height}" fill="url(#bgMagic)" rx="20"/>`;
  
  // Decorative stars scattered
  const stars = [[100, 80], [150, 120], [850, 100], [900, 140], [200, 350], [800, 350]];
  stars.forEach(([x, y]) => {
    svg += `<text x="${x}" y="${y}" font-size="24" opacity="0.4">⭐</text>`;
  });

  // Epic title
  svg += `<text x="${width / 2}" y="40" font-size="32" font-weight="900" text-anchor="middle" fill="#1f2937" letter-spacing="-1px">
    🗺️ Quest: ${config.title}
  </text>`;

  // Draw connecting path - EPIC
  svg += `<path d="M ${padding + 30} ${centerY} Q ${width / 2} ${centerY - 60} ${width - padding - 30} ${centerY}" 
    stroke="#fef08a" stroke-width="16" fill="none" opacity="0.3" stroke-linecap="round"/>`;

  // Main path
  for (let i = 0; i < config.checkpoints.length - 1; i++) {
    const x1 = padding + i * spacing;
    const x2 = padding + (i + 1) * spacing;
    const y = centerY;
    const pathColor = config.checkpoints[i].isCompleted ? "#10b981" : "#cbd5e1";
    const pathWidth = config.checkpoints[i].isCompleted ? "6" : "3";
    svg += `<line x1="${x1 + 60}" y1="${y}" x2="${x2 - 60}" y2="${y}" stroke="${pathColor}" stroke-width="${pathWidth}" stroke-linecap="round"/>`;
  }

  // Draw checkpoints
  config.checkpoints.forEach((cp, i) => {
    const x = padding + i * spacing;
    const y = centerY;
    const gradId = i === 0 ? "level1" : i === 1 ? "level2" : "level3";
    const medal = cp.isCompleted ? (i === 0 ? "🥉" : i === 1 ? "🥈" : "🥇") : ["🔒"][0];

    // HUGE glow aura
    svg += `<circle cx="${x}" cy="${y}" r="72" fill="${cp.isCompleted ? "#10b981" : "#e2e8f0"}" opacity="0.15" filter="url(#glow)"/>`;

    // Main circle - HUGE
    svg += `<circle cx="${x}" cy="${y}" r="60" fill="url(#${gradId})" filter="url(#epicShadow)" stroke="${cp.isCompleted ? '#ffffff' : 'rgba(255,255,255,0.3)'}" stroke-width="5"/>`;

    // Inner decorative ring
    svg += `<circle cx="${x}" cy="${y}" r="54" fill="none" stroke="white" stroke-width="2" opacity="0.4"/>`;

    // Big shiny spot
    svg += `<ellipse cx="${x - 20}" cy="${y - 20}" rx="24" ry="24" fill="white" opacity="0.35"/>`;

    // MASSIVE medal emoji
    svg += `<text x="${x}" y="${y + 12}" font-size="56" text-anchor="middle">${medal}</text>`;

    // Level number (small, top)
    svg += `<text x="${x}" y="${y - 48}" font-size="16" font-weight="900" text-anchor="middle" fill="#1f2937">Level ${i + 1}</text>`;

    // Label - BOLD
    svg += `<text x="${x}" y="${y + 90}" font-size="18" font-weight="900" text-anchor="middle" fill="#1f2937">${cp.label}</text>`;

    // Epic progress bar
    const barW = 110;
    const barH = 14;
    const barX = x - barW / 2;
    const barY = y + 112;

    // Bar background
    svg += `<rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" fill="#e5e7eb" rx="7" filter="url(#epicShadow)"/>`;

    // Color-coded fill
    let fillColor = "#ef4444";
    if (cp.progress > 66) fillColor = "#10b981";
    else if (cp.progress > 33) fillColor = "#f59e0b";

    const fillW = (barW * cp.progress) / 100;
    svg += `<rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" fill="${fillColor}" rx="7" filter="url(#glow)"/>`;

    // Percentage - HUGE & BOLD
    svg += `<text x="${x}" y="${barY + 38}" font-size="18" font-weight="900" text-anchor="middle" fill="${fillColor}">${Math.round(cp.progress)}%</text>`;

    // Celebration stars
    if (cp.isCompleted) {
      svg += `<text x="${x - 45}" y="${y - 60}" font-size="28" opacity="0.8" transform="rotate(-20 ${x - 45} ${y - 60})">⭐</text>`;
      svg += `<text x="${x + 45}" y="${y - 60}" font-size="28" opacity="0.8" transform="rotate(20 ${x + 45} ${y - 60})">⭐</text>`;
      svg += `<text x="${x}" y="${y - 70}" font-size="24">✨</text>`;
    }
  });

  svg += `</svg>`;
  return svg;
}

/**
 * MOBILE - Vertical quest adventure 📱✨
 */
function generateMobileRoadmap(config: RoadmapConfig): string {
  const width = 360;
  const height = 200 + config.checkpoints.length * 150;
  const centerX = width / 2;
  const padding = 45;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto">`;

  // Gradients
  svg += `<defs>
    <linearGradient id="bgMobile" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fffbeb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#dbeafe;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="level1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fde047;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#facc15;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="level2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#38bdf8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0284c7;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="level3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#c084fc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9333ea;stop-opacity:1" />
    </linearGradient>
    <filter id="mobileShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.35"/>
    </filter>
  </defs>`;

  svg += `<rect width="${width}" height="${height}" fill="url(#bgMobile)" rx="16"/>`;

  // Title
  svg += `<text x="${centerX}" y="36" font-size="26" font-weight="900" text-anchor="middle" fill="#1f2937">🎮 Quest!</text>`;

  // Vertical path
  for (let i = 0; i < config.checkpoints.length - 1; i++) {
    const y1 = padding + 60 + i * 150 + 52;
    const y2 = padding + 60 + (i + 1) * 150 - 52;
    const pathColor = config.checkpoints[i].isCompleted ? "#10b981" : "#cbd5e1";
    const pathWidth = config.checkpoints[i].isCompleted ? "5" : "2";
    svg += `<line x1="${centerX}" y1="${y1}" x2="${centerX}" y2="${y2}" stroke="${pathColor}" stroke-width="${pathWidth}" stroke-linecap="round"/>`;
    
    // Decorative dot
    const midY = (y1 + y2) / 2;
    svg += `<circle cx="${centerX}" cy="${midY}" r="2.5" fill="${pathColor}" opacity="0.6"/>`;
  }

  // Draw checkpoints
  config.checkpoints.forEach((cp, i) => {
    const y = padding + 60 + i * 150;
    const gradId = i === 0 ? "level1" : i === 1 ? "level2" : "level3";
    const medal = cp.isCompleted ? (i === 0 ? "🥉" : i === 1 ? "🥈" : "🥇") : "🔒";

    // Glow
    svg += `<circle cx="${centerX}" cy="${y}" r="62" fill="${cp.isCompleted ? '#10b981' : '#e2e8f0'}" opacity="0.12"/>`;

    // Main circle
    svg += `<circle cx="${centerX}" cy="${y}" r="50" fill="url(#${gradId})" filter="url(#mobileShadow)" stroke="${cp.isCompleted ? '#ffffff' : 'rgba(255,255,255,0.2)'}" stroke-width="4"/>`;

    // Shine
    svg += `<ellipse cx="${centerX - 16}" cy="${y - 16}" rx="20" ry="20" fill="white" opacity="0.3"/>`;

    // Medal
    svg += `<text x="${centerX}" y="${y + 10}" font-size="44" text-anchor="middle">${medal}</text>`;

    // Side labels
    const labelX = centerX + 90;

    // Label text
    svg += `<text x="${labelX}" y="${y - 16}" font-size="16" font-weight="800" fill="#1f2937">${cp.label}</text>`;

    // Progress
    svg += `<text x="${labelX}" y="${y + 4}" font-size="13" font-weight="600" fill="#6b7280">${Math.round(cp.progress)}%</text>`;

    // Progress bar
    const barW = 80;
    const barH = 9;
    svg += `<rect x="${labelX - barW / 2}" y="${y + 12}" width="${barW}" height="${barH}" fill="#e5e7eb" rx="4.5"/>`;

    let fillColor = "#ef4444";
    if (cp.progress > 66) fillColor = "#10b981";
    else if (cp.progress > 33) fillColor = "#f59e0b";

    const fillW = (barW * cp.progress) / 100;
    svg += `<rect x="${labelX - barW / 2}" y="${y + 12}" width="${fillW}" height="${barH}" fill="${fillColor}" rx="4.5"/>`;

    // Stars
    if (cp.isCompleted) {
      svg += `<text x="${labelX - 48}" y="${y - 38}" font-size="22">⭐</text>`;
      svg += `<text x="${labelX + 48}" y="${y - 38}" font-size="22">⭐</text>`;
    }
  });

  svg += `</svg>`;
  return svg;
}

export function roadmapToDataURI(svgString: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svgString)}`;
}
