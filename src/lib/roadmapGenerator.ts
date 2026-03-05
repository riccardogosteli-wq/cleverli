/**
 * SVG Roadmap Generator - KID-FRIENDLY VERSION 🎮✨
 * 
 * Creates exciting, colorful progress maps that kids love!
 * Includes gradients, medals, emojis, and gamification elements
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

/**
 * Generate fun SVG roadmap
 * Mobile: vertical adventure map
 * Desktop: horizontal quest path
 */
export function generateRoadmapSVG(config: RoadmapConfig): string {
  if (config.isMobile) {
    return generateMobileRoadmap(config);
  } else {
    return generateDesktopRoadmap(config);
  }
}

/**
 * Desktop - Colorful horizontal adventure map 🗺️
 * Designed for maximum kid appeal with bright colors & medals
 */
function generateDesktopRoadmap(config: RoadmapConfig): string {
  const padding = 60;
  const width = 900;
  const height = 380;
  const checkpointSpacing = (width - padding * 2) / Math.max(config.checkpoints.length - 1, 1);
  const checkpointRadius = 50;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto">`;

  // Define colorful gradients
  svg += `<defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.35" flood-color="#000"/>
    </filter>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>`;

  // Background gradient
  svg += `<defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fef3c7;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#dbeafe;stop-opacity:0.3" />
    </linearGradient>
  </defs>`;
  svg += `<rect width="${width}" height="${height}" fill="url(#bgGrad)" rx="16"/>`;

  // Decorative title with emoji
  svg += `<text x="${width / 2}" y="38" font-size="28" font-weight="900" text-anchor="middle" fill="#1f2937">🗺️ ${config.title}</text>`;

  // Draw fun connecting path (wavy)
  svg += `<path d="M ${padding + 20} ${height / 2 - 5} Q ${padding + (width - padding) / 2} ${height / 2 - 50} ${width - padding - 20} ${height / 2 - 5}" stroke="#fef08a" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.4"/>`;

  // Main connecting path with color based on progress
  for (let i = 0; i < config.checkpoints.length - 1; i++) {
    const x1 = padding + i * checkpointSpacing;
    const x2 = padding + (i + 1) * checkpointSpacing;
    const y = height / 2;

    const pathColor = config.checkpoints[i].isCompleted ? "#10b981" : "#cbd5e1";
    const pathWidth = config.checkpoints[i].isCompleted ? "5" : "3";
    svg += `<line x1="${x1 + checkpointRadius}" y1="${y}" x2="${x2 - checkpointRadius}" y2="${y}" stroke="${pathColor}" stroke-width="${pathWidth}" stroke-linecap="round"/>`;
  }

  // Draw checkpoints with full gamification
  config.checkpoints.forEach((cp, idx) => {
    const x = padding + idx * checkpointSpacing;
    const y = height / 2;

    // Choose gradient based on level
    const gradient = idx === 0 ? "grad1" : idx === 1 ? "grad2" : "grad3";
    
    // Large glowing circle background
    svg += `<circle cx="${x}" cy="${y}" r="${checkpointRadius + 8}" fill="${cp.isCompleted ? '#10b981' : '#e2e8f0'}" opacity="0.2" filter="url(#glow)"/>`;
    
    // Main checkpoint circle with gradient
    svg += `<circle cx="${x}" cy="${y}" r="${checkpointRadius}" fill="url(#${gradient})" filter="url(#shadow)" stroke="${cp.isCompleted ? '#ffffff' : 'none'}" stroke-width="4"/>`;

    // Inner shine effect
    svg += `<circle cx="${x - 15}" cy="${y - 15}" r="18" fill="white" opacity="0.3" />`;

    // Medal or lock emoji (LARGE!)
    const medalEmoji = cp.isCompleted ? (cp.id === 1 ? "🥉" : cp.id === 2 ? "🥈" : "🥇") : "🔒";
    svg += `<text x="${x}" y="${y + 8}" font-size="42" text-anchor="middle" dominant-baseline="middle">${medalEmoji}</text>`;

    // Level number on top (small)
    svg += `<text x="${x}" y="${y - 35}" font-size="14" font-weight="900" text-anchor="middle" fill="#374151">Level ${cp.id}</text>`;

    // Checkpoint label - BOLD & BIG
    svg += `<text x="${x}" y="${y + checkpointRadius + 42}" font-size="16" font-weight="800" text-anchor="middle" fill="#1f2937">${cp.label}</text>`;

    // Colorful progress bar
    const barWidth = 90;
    const barHeight = 10;
    const barX = x - barWidth / 2;
    const barY = y + checkpointRadius + 58;

    // Bar background (rounded)
    svg += `<rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" fill="#e2e8f0" rx="5" filter="url(#shadow)"/>`;
    
    // Bar fill with color based on progress
    let fillColor = "#ef4444"; // Red for 0-33%
    if (cp.progress > 66) fillColor = "#10b981"; // Green for 66%+
    else if (cp.progress > 33) fillColor = "#f59e0b"; // Orange for 33-66%
    
    const fillWidth = (barWidth * cp.progress) / 100;
    svg += `<rect x="${barX}" y="${barY}" width="${fillWidth}" height="${barHeight}" fill="${fillColor}" rx="5" filter="url(#glow)"/>`;

    // Progress percentage - BOLD
    svg += `<text x="${x}" y="${barY + 28}" font-size="14" font-weight="900" text-anchor="middle" fill="${fillColor}">${Math.round(cp.progress)}%</text>`;

    // Stars for completion
    if (cp.isCompleted) {
      svg += `<text x="${x - 25}" y="${y - 50}" font-size="20">⭐</text>`;
      svg += `<text x="${x + 25}" y="${y - 50}" font-size="20">⭐</text>`;
    }
  });

  svg += `</svg>`;
  return svg;
}

/**
 * Mobile - Vertical adventure quest path 📱✨
 * Optimized for narrow screens with fun stacking
 */
function generateMobileRoadmap(config: RoadmapConfig): string {
  const padding = 50;
  const width = 340;
  const height = 480 + (config.checkpoints.length - 1) * 120;
  const checkpointRadius = 45;
  const verticalSpacing = 140;
  const centerX = width / 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto">`;

  // Gradients
  svg += `<defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.3"/>
    </filter>
  </defs>`;

  // Background
  svg += `<rect width="${width}" height="${height}" fill="#fef9e7" rx="16"/>`;

  // Title
  svg += `<text x="${centerX}" y="32" font-size="22" font-weight="900" text-anchor="middle" fill="#1f2937">🗺️ Quest!</text>`;

  // Vertical path with markers
  for (let i = 0; i < config.checkpoints.length - 1; i++) {
    const y1 = padding + 60 + i * verticalSpacing + checkpointRadius;
    const y2 = padding + 60 + (i + 1) * verticalSpacing - checkpointRadius;

    const pathColor = config.checkpoints[i].isCompleted ? "#10b981" : "#cbd5e1";
    const pathWidth = config.checkpoints[i].isCompleted ? "5" : "2";
    
    // Vertical connector
    svg += `<line x1="${centerX}" y1="${y1}" x2="${centerX}" y2="${y2}" stroke="${pathColor}" stroke-width="${pathWidth}" stroke-linecap="round"/>`;
    
    // Decorative dot in middle
    const midY = (y1 + y2) / 2;
    svg += `<circle cx="${centerX}" cy="${midY}" r="3" fill="${pathColor}" opacity="0.5"/>`;
  }

  // Draw checkpoints
  config.checkpoints.forEach((cp, idx) => {
    const y = padding + 60 + idx * verticalSpacing;
    const gradient = idx === 0 ? "grad1" : idx === 1 ? "grad2" : "grad3";

    // Glow effect
    svg += `<circle cx="${centerX}" cy="${y}" r="${checkpointRadius + 12}" fill="${cp.isCompleted ? '#10b981' : '#e2e8f0'}" opacity="0.15"/>`;

    // Main circle with gradient
    svg += `<circle cx="${centerX}" cy="${y}" r="${checkpointRadius}" fill="url(#${gradient})" filter="url(#shadow)" stroke="${cp.isCompleted ? '#ffffff' : 'none'}" stroke-width="3"/>`;

    // Inner shine
    svg += `<circle cx="${centerX - 15}" cy="${y - 15}" r="16" fill="white" opacity="0.25" />`;

    // Medal emoji - BIG
    const medalEmoji = cp.isCompleted ? (cp.id === 1 ? "🥉" : cp.id === 2 ? "🥈" : "🥇") : "🔒";
    svg += `<text x="${centerX}" y="${y + 6}" font-size="38" text-anchor="middle" dominant-baseline="middle">${medalEmoji}</text>`;

    // Label and progress on the right
    const contentX = centerX + 75;
    
    svg += `<text x="${contentX}" y="${y - 20}" font-size="15" font-weight="800" fill="#1f2937">${cp.label}</text>`;
    svg += `<text x="${contentX}" y="${y + 2}" font-size="13" font-weight="600" fill="#6b7280">${Math.round(cp.progress)}%</text>`;

    // Progress bar on the right
    const barWidth = 70;
    const barHeight = 8;
    const barY = y + 12;

    svg += `<rect x="${contentX - barWidth/2}" y="${barY}" width="${barWidth}" height="${barHeight}" fill="#e2e8f0" rx="4"/>`;
    
    let fillColor = "#ef4444";
    if (cp.progress > 66) fillColor = "#10b981";
    else if (cp.progress > 33) fillColor = "#f59e0b";
    
    const fillWidth = (barWidth * cp.progress) / 100;
    svg += `<rect x="${contentX - barWidth/2}" y="${barY}" width="${fillWidth}" height="${barHeight}" fill="${fillColor}" rx="4"/>`;

    // Star celebration
    if (cp.isCompleted) {
      svg += `<text x="${contentX - 50}" y="${y - 35}" font-size="18">⭐</text>`;
      svg += `<text x="${contentX + 50}" y="${y - 35}" font-size="18">⭐</text>`;
    }
  });

  svg += `</svg>`;
  return svg;
}

/**
 * Export as data URI for use in img src
 */
export function roadmapToDataURI(svgString: string): string {
  const encoded = encodeURIComponent(svgString);
  return `data:image/svg+xml,${encoded}`;
}
