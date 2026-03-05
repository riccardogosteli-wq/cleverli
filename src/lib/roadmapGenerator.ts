/**
 * SVG Roadmap Generator
 * 
 * Dynamically generates progress roadmaps for topics
 * Creates visual checkpoints and connecting paths
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
 * Generate SVG roadmap
 * Mobile: vertical layout (narrow screen)
 * Desktop: horizontal layout (wide screen)
 */
export function generateRoadmapSVG(config: RoadmapConfig): string {
  if (config.isMobile) {
    return generateMobileRoadmap(config);
  } else {
    return generateDesktopRoadmap(config);
  }
}

/**
 * Desktop horizontal roadmap
 * ●──────●──────●
 * Anfänger Fortgeschritten Meister
 */
function generateDesktopRoadmap(config: RoadmapConfig): string {
  const padding = 60;
  const width = 800;
  const height = 300;
  const checkpointSpacing = (width - padding * 2) / (config.checkpoints.length - 1);
  const checkpointRadius = 45;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto">`;

  // Background
  svg += `<rect width="${width}" height="${height}" fill="#f9fafb" rx="12"/>`;

  // Title
  svg += `<text x="${width / 2}" y="30" font-size="18" font-weight="bold" text-anchor="middle" fill="#1f2937">${config.title}</text>`;

  // Draw connecting path
  for (let i = 0; i < config.checkpoints.length - 1; i++) {
    const x1 = padding + i * checkpointSpacing;
    const x2 = padding + (i + 1) * checkpointSpacing;
    const y = height / 2;

    // Path color depends on completion of first checkpoint
    const pathColor = config.checkpoints[i].isCompleted ? "#10b981" : "#d1d5db";
    svg += `<line x1="${x1 + checkpointRadius}" y1="${y}" x2="${x2 - checkpointRadius}" y2="${y}" stroke="${pathColor}" stroke-width="4" stroke-linecap="round"/>`;
  }

  // Draw checkpoints
  config.checkpoints.forEach((cp, idx) => {
    const x = padding + idx * checkpointSpacing;
    const y = height / 2;

    // Checkpoint circle background
    const bgColor = cp.isCompleted ? "#10b981" : "#f3f4f6";
    const borderColor = cp.isCompleted ? "#059669" : "#d1d5db";
    svg += `<circle cx="${x}" cy="${y}" r="${checkpointRadius}" fill="${bgColor}" stroke="${borderColor}" stroke-width="3"/>`;

    // Checkpoint number/emoji
    svg += `<text x="${x}" y="${y - 5}" font-size="28" text-anchor="middle" dominant-baseline="middle" fill="${cp.isCompleted ? '#fff' : '#6b7280'}">${cp.id}</text>`;

    // Label below
    svg += `<text x="${x}" y="${y + checkpointRadius + 40}" font-size="14" font-weight="600" text-anchor="middle" fill="#1f2937">${cp.label}</text>`;

    // Progress bar below label
    const barWidth = 80;
    const barHeight = 6;
    const barX = x - barWidth / 2;
    const barY = y + checkpointRadius + 60;

    svg += `<rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" fill="#e5e7eb" rx="3"/>`;
    svg += `<rect x="${barX}" y="${barY}" width="${(barWidth * cp.progress) / 100}" height="${barHeight}" fill="#3b82f6" rx="3"/>`;

    // Exercise count
    svg += `<text x="${x}" y="${barY + 20}" font-size="12" text-anchor="middle" fill="#6b7280">${Math.round(cp.progress)}%</text>`;
  });

  svg += `</svg>`;
  return svg;
}

/**
 * Mobile vertical roadmap
 * 
 * ●
 * │
 * ●
 * │
 * ●
 * 
 * (stacked vertically for narrow screens)
 */
function generateMobileRoadmap(config: RoadmapConfig): string {
  const padding = 40;
  const width = 320;
  const height = 500;
  const checkpointRadius = 40;
  const verticalSpacing = (height - padding * 2) / (config.checkpoints.length - 1);
  const centerX = width / 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto">`;

  // Background
  svg += `<rect width="${width}" height="${height}" fill="#f9fafb" rx="12"/>`;

  // Title
  svg += `<text x="${centerX}" y="25" font-size="16" font-weight="bold" text-anchor="middle" fill="#1f2937">${config.title}</text>`;

  // Draw connecting vertical path
  for (let i = 0; i < config.checkpoints.length - 1; i++) {
    const y1 = padding + i * verticalSpacing + checkpointRadius;
    const y2 = padding + (i + 1) * verticalSpacing - checkpointRadius;

    const pathColor = config.checkpoints[i].isCompleted ? "#10b981" : "#d1d5db";
    svg += `<line x1="${centerX}" y1="${y1}" x2="${centerX}" y2="${y2}" stroke="${pathColor}" stroke-width="3" stroke-linecap="round"/>`;
  }

  // Draw checkpoints
  config.checkpoints.forEach((cp, idx) => {
    const y = padding + idx * verticalSpacing;

    // Checkpoint circle background
    const bgColor = cp.isCompleted ? "#10b981" : "#f3f4f6";
    const borderColor = cp.isCompleted ? "#059669" : "#d1d5db";
    svg += `<circle cx="${centerX}" cy="${y}" r="${checkpointRadius}" fill="${bgColor}" stroke="${borderColor}" stroke-width="3"/>`;

    // Checkpoint number
    svg += `<text x="${centerX}" y="${y - 5}" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="${cp.isCompleted ? '#fff' : '#6b7280'}">${cp.id}</text>`;

    // Label + progress to the right
    const labelX = centerX + checkpointRadius + 20;
    svg += `<text x="${labelX}" y="${y - 15}" font-size="13" font-weight="600" fill="#1f2937">${cp.label}</text>`;

    // Progress percentage
    svg += `<text x="${labelX}" y="${y + 8}" font-size="12" fill="#6b7280">${Math.round(cp.progress)}%</text>`;

    // Mini progress bar
    const miniBarWidth = 60;
    const miniBarHeight = 4;
    svg += `<rect x="${labelX}" y="${y + 15}" width="${miniBarWidth}" height="${miniBarHeight}" fill="#e5e7eb" rx="2"/>`;
    svg += `<rect x="${labelX}" y="${y + 15}" width="${(miniBarWidth * cp.progress) / 100}" height="${miniBarHeight}" fill="#3b82f6" rx="2"/>`;
  });

  svg += `</svg>`;
  return svg;
}

/**
 * Export as data URI for use in img src or background
 */
export function roadmapToDataURI(svgString: string): string {
  const encoded = encodeURIComponent(svgString);
  return `data:image/svg+xml,${encoded}`;
}
