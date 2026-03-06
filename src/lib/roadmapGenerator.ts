/**
 * 🌲 ADVENTURE ROADMAP — Kids-first visual journey
 * A winding forest/mountain path with houses, castles and nature.
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
  return config.isMobile
    ? generateMobileRoadmap(config)
    : generateDesktopRoadmap(config);
}

// ─── DESKTOP: 900×260 horizontal adventure path ──────────────────────────────
function generateDesktopRoadmap(config: RoadmapConfig): string {
  const W = 900, H = 260;
  const cps = config.checkpoints;
  const c0 = cps[0], c1 = cps[1], c2 = cps[2];

  // Checkpoint x positions along the path
  const px = [170, 450, 730];
  const groundY = 175;

  // How far along the path is the player?
  const totalDone = cps.reduce((s, c) => s + c.completed, 0);
  const totalAll  = cps.reduce((s, c) => s + c.total, 0);
  const playerPct = totalAll > 0 ? totalDone / totalAll : 0;

  // Path: cubic bezier winding road (left to right)
  const pathD = `M 40,${groundY + 15} C 120,${groundY + 30} 150,${groundY - 20} ${px[0]},${groundY - 5}
    C ${px[0] + 90},${groundY + 10} ${px[1] - 90},${groundY - 25} ${px[1]},${groundY - 10}
    C ${px[1] + 90},${groundY + 5} ${px[2] - 90},${groundY - 30} ${px[2]},${groundY - 5}
    C ${px[2] + 70},${groundY + 10} 860,${groundY + 20} 880,${groundY + 10}`;

  // Player dot position along path (approximate linear interpolation between checkpoints)
  const playerX = 40 + playerPct * (880 - 40);
  const playerY = groundY + 5 - Math.sin(playerPct * Math.PI) * 25;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#bfecff"/>
    <stop offset="100%" stop-color="#e8f9ff"/>
  </linearGradient>
  <linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#7ec850"/>
    <stop offset="100%" stop-color="#5aab30"/>
  </linearGradient>
  <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f5d88a"/>
    <stop offset="100%" stop-color="#e8c060"/>
  </linearGradient>
  <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#c9d6e3"/>
    <stop offset="100%" stop-color="#a0b4c8"/>
  </linearGradient>
  <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#b5c8d8"/>
    <stop offset="100%" stop-color="#8fafc0"/>
  </linearGradient>
  <filter id="glow">
    <feGaussianBlur stdDeviation="3" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="shadow">
    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#00000030"/>
  </filter>
</defs>

<!-- Sky -->
<rect width="${W}" height="${H}" fill="url(#sky)" rx="12"/>

<!-- Sun -->
<circle cx="820" cy="38" r="28" fill="#ffe066" opacity="0.9" filter="url(#glow)"/>
<circle cx="820" cy="38" r="22" fill="#ffd700"/>

<!-- Clouds -->
${cloud(120, 30, 1.1)}
${cloud(380, 22, 0.85)}
${cloud(600, 40, 1.0)}
${cloud(750, 18, 0.7)}

<!-- Background mountains -->
<polygon points="520,${groundY - 10} 630,${groundY - 95} 740,${groundY - 10}" fill="url(#mtn2)" opacity="0.55"/>
<polygon points="630,${groundY - 10} 760,${groundY - 115} 880,${groundY - 10}" fill="url(#mtn1)" opacity="0.5"/>
<polygon points="560,${groundY - 10} 670,${groundY - 80} 780,${groundY - 10}" fill="#d0dfe8" opacity="0.35"/>
<!-- Snow caps -->
<polygon points="630,${groundY - 115} 650,${groundY - 95} 610,${groundY - 95}" fill="white" opacity="0.85"/>
<polygon points="760,${groundY - 115} 782,${groundY - 92} 738,${groundY - 92}" fill="white" opacity="0.8"/>

<!-- Ground -->
<rect x="0" y="${groundY + 20}" width="${W}" height="${H - groundY - 20}" fill="url(#gnd)" rx="0"/>
<!-- Rolling hill edge -->
<ellipse cx="450" cy="${groundY + 20}" rx="500" ry="22" fill="#7ec850"/>

<!-- Background trees (forest) -->
${bgTrees()}

<!-- ROAD (border, then fill) -->
<path d="${pathD}" fill="none" stroke="#c8a040" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${pathD}" fill="none" stroke="url(#road)" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
<!-- Road dashes -->
<path d="${pathD}" fill="none" stroke="#e8c060" stroke-width="2" stroke-dasharray="18,14" stroke-linecap="round" opacity="0.6"/>

<!-- COMPLETED road overlay (green glow on done sections) -->
${c0.isCompleted ? `<path d="M 40,${groundY + 15} C 120,${groundY + 30} 150,${groundY - 20} ${px[0]},${groundY - 5} C ${px[0] + 40},${groundY + 4} ${px[0] + 60},${groundY + 2} ${px[0] + 80},${groundY + 1}" fill="none" stroke="#52c41a" stroke-width="5" stroke-linecap="round" opacity="0.7"/>` : ''}
${c1.isCompleted ? `<path d="M ${px[0]},${groundY - 5} C ${px[0] + 90},${groundY + 10} ${px[1] - 90},${groundY - 25} ${px[1]},${groundY - 10}" fill="none" stroke="#52c41a" stroke-width="5" stroke-linecap="round" opacity="0.7"/>` : ''}
${c2.isCompleted ? `<path d="M ${px[1]},${groundY - 10} C ${px[1] + 90},${groundY + 5} ${px[2] - 90},${groundY - 30} ${px[2]},${groundY - 5}" fill="none" stroke="#f0b429" stroke-width="5" stroke-linecap="round" opacity="0.7"/>` : ''}

<!-- Foreground trees and bushes -->
${fgDecorations(px, groundY)}

<!-- CHECKPOINT 1: Cozy Cottage (easy) -->
${cottage(px[0], groundY - 8, c0.isCompleted, c0.label, c0.completed, c0.total)}

<!-- CHECKPOINT 2: School Tower (medium) -->
${schoolTower(px[1], groundY - 8, c1.isCompleted, c1.label, c1.completed, c1.total)}

<!-- CHECKPOINT 3: Castle (hard) -->
${castle(px[2], groundY - 8, c2.isCompleted, c2.label, c2.completed, c2.total)}

<!-- PLAYER CHARACTER (star walking along path) -->
${playerChar(playerX, playerY, playerPct)}

</svg>`;
}

// ─── MOBILE: 360×400 vertical adventure path ─────────────────────────────────
function generateMobileRoadmap(config: RoadmapConfig): string {
  const W = 360, H = 400;
  const cps = config.checkpoints;
  const c0 = cps[0], c1 = cps[1], c2 = cps[2];

  const py = [310, 200, 95];
  const cx = W / 2;

  const totalDone = cps.reduce((s, c) => s + c.completed, 0);
  const totalAll  = cps.reduce((s, c) => s + c.total, 0);
  const playerPct = totalAll > 0 ? totalDone / totalAll : 0;
  const playerY   = 330 - playerPct * 250;
  const playerX   = cx + Math.sin(playerPct * Math.PI * 2) * 20;

  const pathD = `M ${cx - 30},${H - 20}
    C ${cx - 60},350 ${cx + 60},330 ${cx + 30},${py[0]}
    C ${cx + 60},${py[0] - 30} ${cx - 60},${py[1] + 30} ${cx - 30},${py[1]}
    C ${cx - 60},${py[1] - 30} ${cx + 60},${py[2] + 30} ${cx + 30},${py[2]}
    C ${cx + 20},${py[2] - 20} ${cx},20 ${cx},20`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="sky-m" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#bfecff"/>
    <stop offset="60%" stop-color="#e8f9ff"/>
    <stop offset="100%" stop-color="#c8f5b0"/>
  </linearGradient>
  <linearGradient id="road-m" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#f5d88a"/>
    <stop offset="100%" stop-color="#e8c060"/>
  </linearGradient>
  <filter id="glow-m">
    <feGaussianBlur stdDeviation="2.5" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>

<rect width="${W}" height="${H}" fill="url(#sky-m)" rx="12"/>

<!-- Sun -->
<circle cx="310" cy="35" r="22" fill="#ffe066" opacity="0.9" filter="url(#glow-m)"/>
<circle cx="310" cy="35" r="17" fill="#ffd700"/>

<!-- Clouds -->
${cloud(60, 30, 0.75)}
${cloud(180, 18, 0.6)}
${cloud(250, 45, 0.65)}

<!-- Mountains -->
<polygon points="30,${H - 60} 110,${H - 180} 190,${H - 60}" fill="#c9d6e3" opacity="0.55"/>
<polygon points="170,${H - 60} 260,${H - 200} 340,${H - 60}" fill="#b5c8d8" opacity="0.5"/>
<polygon points="110,${H - 180} 130,${H - 155} 90,${H - 155}" fill="white" opacity="0.8"/>
<polygon points="260,${H - 200} 280,${H - 172} 240,${H - 172}" fill="white" opacity="0.75"/>

<!-- Ground strip at bottom -->
<rect x="0" y="${H - 55}" width="${W}" height="55" fill="#7ec850" rx="0"/>
<ellipse cx="${cx}" cy="${H - 55}" rx="220" ry="18" fill="#7ec850"/>

<!-- Road -->
<path d="${pathD}" fill="none" stroke="#c8a040" stroke-width="30" stroke-linecap="round"/>
<path d="${pathD}" fill="none" stroke="url(#road-m)" stroke-width="24" stroke-linecap="round"/>
<path d="${pathD}" fill="none" stroke="#e8c060" stroke-width="2" stroke-dasharray="12,10" opacity="0.5"/>

<!-- Trees along path -->
${mobileTreeRow(W, H)}

<!-- CHECKPOINT 1: Cottage (easy) — bottom -->
${cottageMobile(cx + 35, py[0] - 5, c0.isCompleted, c0.label, c0.completed, c0.total)}

<!-- CHECKPOINT 2: Tower (medium) — middle -->
${towerMobile(cx - 35, py[1] - 5, c1.isCompleted, c1.label, c1.completed, c1.total)}

<!-- CHECKPOINT 3: Castle (hard) — top -->
${castleMobile(cx + 30, py[2], c2.isCompleted, c2.label, c2.completed, c2.total)}

<!-- Player -->
${playerChar(playerX, playerY, playerPct)}

</svg>`;
}

// ─── SVG ELEMENT HELPERS ──────────────────────────────────────────────────────

function cloud(x: number, y: number, scale: number): string {
  const s = scale;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="28" ry="14" fill="white" opacity="0.88"/>
    <ellipse cx="-18" cy="4" rx="16" ry="11" fill="white" opacity="0.88"/>
    <ellipse cx="20" cy="4" rx="20" ry="12" fill="white" opacity="0.88"/>
    <ellipse cx="4" cy="-6" rx="18" ry="12" fill="white" opacity="0.88"/>
  </g>`;
}

function tree(x: number, y: number, h: number, shade = false): string {
  const g = shade ? '#1a6b2e' : '#2d9e4e';
  const g2 = shade ? '#155724' : '#237a3b';
  const th = h;
  return `<g>
    <rect x="${x - 4}" y="${y}" width="8" height="${th * 0.4}" fill="#8B5E3C"/>
    <polygon points="${x},${y - th * 0.7} ${x - th * 0.45},${y + th * 0.05} ${x + th * 0.45},${y + th * 0.05}" fill="${g2}"/>
    <polygon points="${x},${y - th} ${x - th * 0.35},${y - th * 0.3} ${x + th * 0.35},${y - th * 0.3}" fill="${g}"/>
  </g>`;
}

function bush(x: number, y: number, r: number): string {
  return `<g>
    <ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.65}" fill="#3aac5a"/>
    <ellipse cx="${x - r * 0.45}" cy="${y - r * 0.15}" rx="${r * 0.6}" ry="${r * 0.5}" fill="#42c464"/>
    <ellipse cx="${x + r * 0.45}" cy="${y - r * 0.15}" rx="${r * 0.6}" ry="${r * 0.5}" fill="#42c464"/>
  </g>`;
}

function bgTrees(): string {
  let s = '';
  const positions = [50,110,200,320,550,660,800,850];
  positions.forEach((x, i) => {
    const h = 45 + (i % 3) * 15;
    s += tree(x, 140 + (i % 2) * 8, h, true);
  });
  return s;
}

function fgDecorations(px: number[], groundY: number): string {
  let s = '';
  // Trees on sides of path
  const treeSpots = [90, 240, 370, 530, 620, 790];
  treeSpots.forEach((x, i) => {
    const side = i % 2 === 0 ? -45 : 45;
    s += tree(x + side, groundY + 10, 38 + (i % 2) * 12);
  });
  // Bushes
  [130, 350, 580, 700].forEach((x, i) => {
    s += bush(x, groundY + 28, 14 + (i % 2) * 4);
  });
  // Flowers (simple dots)
  [[80,groundY+32],[200,groundY+25],[480,groundY+30],[800,groundY+28]].forEach(([fx,fy]) => {
    s += `<circle cx="${fx}" cy="${fy}" r="4" fill="#ff6b9d" opacity="0.9"/>`;
    s += `<circle cx="${fx + 10}" cy="${fy - 3}" r="3" fill="#ffd700" opacity="0.9"/>`;
    s += `<circle cx="${fx - 8}" cy="${fy + 2}" r="3" fill="#ff6b9d" opacity="0.7"/>`;
  });
  return s;
}

function mobileTreeRow(W: number, H: number): string {
  let s = '';
  [[30,H-75,32],[60,H-85,38],[290,H-70,30],[320,H-82,35],[20,200,30],[330,180,32],[25,120,28],[335,100,26]].forEach(([x,y,h]) => {
    s += tree(x, y, h);
  });
  s += bush(50, H-52, 12);
  s += bush(300, H-50, 11);
  return s;
}

// ─── CHECKPOINT BUILDINGS ────────────────────────────────────────────────────

function cottage(x: number, y: number, done: boolean, label: string, completed: number, total: number): string {
  const fill  = done ? '#fffbe6' : '#f0f0f0';
  const roof  = done ? '#e85d04' : '#9ca3af';
  const glow  = done ? 'filter="url(#glow)"' : '';
  const badge = done ? sparkles(x, y - 68) : lockBadge(x, y - 68);
  const prog  = progressPill(x, y + 35, completed, total, done);
  return `<g ${glow}>
    <!-- Cottage body -->
    <rect x="${x-28}" y="${y-42}" width="56" height="42" rx="4" fill="${fill}" stroke="${done?'#f59e0b':'#d1d5db'}" stroke-width="${done?2:1.5}"/>
    <!-- Roof -->
    <polygon points="${x-34},${y-42} ${x},${y-75} ${x+34},${y-42}" fill="${roof}"/>
    <!-- Door -->
    <rect x="${x-8}" y="${y-22}" width="16" height="22" rx="3" fill="${done?'#92400e':'#6b7280'}"/>
    <!-- Windows -->
    <rect x="${x-24}" y="${y-36}" width="12" height="10" rx="2" fill="${done?'#fef3c7':'#e5e7eb'}" stroke="#d1d5db" stroke-width="1"/>
    <rect x="${x+12}" y="${y-36}" width="12" height="10" rx="2" fill="${done?'#fef3c7':'#e5e7eb'}" stroke="#d1d5db" stroke-width="1"/>
    <!-- Chimney -->
    <rect x="${x+14}" y="${y-80}" width="9" height="18" fill="${done?'#9a3412':'#9ca3af'}"/>
    ${done ? `<ellipse cx="${x+18}" cy="${y-83}" rx="6" ry="4" fill="#f97316" opacity="0.7"/>` : ''}
    <!-- Label -->
    <text x="${x}" y="${y+22}" font-size="10" font-weight="700" text-anchor="middle" fill="${done?'#92400e':'#6b7280'}" font-family="sans-serif">${label}</text>
    ${badge}
    ${prog}
  </g>`;
}

function schoolTower(x: number, y: number, done: boolean, label: string, completed: number, total: number): string {
  const fill = done ? '#ecfdf5' : '#f0f0f0';
  const wall = done ? '#059669' : '#9ca3af';
  const glow = done ? 'filter="url(#glow)"' : '';
  const badge = done ? sparkles(x, y - 82) : lockBadge(x, y - 82);
  const prog = progressPill(x, y + 35, completed, total, done);
  return `<g ${glow}>
    <!-- Tower body -->
    <rect x="${x-20}" y="${y-70}" width="40" height="70" rx="3" fill="${fill}" stroke="${wall}" stroke-width="${done?2:1.5}"/>
    <!-- Crenelations -->
    ${[-16,-6,4,14].map(ox => `<rect x="${x+ox}" y="${y-82}" width="8" height="14" rx="1" fill="${wall}"/>`).join('')}
    <!-- Flag -->
    <line x1="${x+10}" y1="${y-92}" x2="${x+10}" y2="${y-72}" stroke="${done?'#065f46':'#9ca3af'}" stroke-width="2"/>
    <polygon points="${x+10},${y-92} ${x+26},${y-84} ${x+10},${y-76}" fill="${done?'#10b981':'#d1d5db'}"/>
    <!-- Windows -->
    <rect x="${x-14}" y="${y-60}" width="12" height="14" rx="2" fill="${done?'#a7f3d0':'#e5e7eb'}" stroke="#d1d5db" stroke-width="1"/>
    <rect x="${x+2}" y="${y-60}" width="12" height="14" rx="2" fill="${done?'#a7f3d0':'#e5e7eb'}" stroke="#d1d5db" stroke-width="1"/>
    <rect x="${x-8}" y="${y-38}" width="16" height="14" rx="2" fill="${done?'#a7f3d0':'#e5e7eb'}" stroke="#d1d5db" stroke-width="1"/>
    <!-- Door -->
    <rect x="${x-8}" y="${y-22}" width="16" height="22" rx="3" fill="${done?'#065f46':'#6b7280'}"/>
    <!-- Label -->
    <text x="${x}" y="${y+22}" font-size="10" font-weight="700" text-anchor="middle" fill="${done?'#065f46':'#6b7280'}" font-family="sans-serif">${label}</text>
    ${badge}
    ${prog}
  </g>`;
}

function castle(x: number, y: number, done: boolean, label: string, completed: number, total: number): string {
  const fill = done ? '#fdf4ff' : '#f0f0f0';
  const wall = done ? '#9333ea' : '#9ca3af';
  const glow = done ? 'filter="url(#glow)"' : '';
  const badge = done ? sparkles(x, y - 100) : lockBadge(x, y - 100);
  const prog = progressPill(x, y + 35, completed, total, done);
  return `<g ${glow}>
    <!-- Main keep -->
    <rect x="${x-26}" y="${y-80}" width="52" height="80" rx="3" fill="${fill}" stroke="${wall}" stroke-width="${done?2:1.5}"/>
    <!-- Side towers -->
    <rect x="${x-38}" y="${y-72}" width="16" height="72" rx="2" fill="${fill}" stroke="${wall}" stroke-width="${done?1.5:1}"/>
    <rect x="${x+22}" y="${y-72}" width="16" height="72" rx="2" fill="${fill}" stroke="${wall}" stroke-width="${done?1.5:1}"/>
    <!-- Tower tops -->
    ${[x-30, x, x+30].map((tx, i) => `
      ${[-4,-2,0,2].map(ox => `<rect x="${tx+ox*3-4}" y="${y-90-(i===1?10:0)}" width="5" height="10" rx="1" fill="${wall}"/>`).join('')}
    `).join('')}
    <!-- Flag on center tower -->
    <line x1="${x}" y1="${y-105}" x2="${x}" y2="${y-88}" stroke="${done?'#7e22ce':'#9ca3af'}" stroke-width="2"/>
    <polygon points="${x},${y-105} ${x+18},${y-97} ${x},${y-88}" fill="${done?'#d946ef':'#d1d5db'}"/>
    <!-- Castle windows -->
    ${[x-18, x-6, x+6, x+18].map(wx => `<rect x="${wx-4}" y="${y-58}" width="8" height="10" rx="1" fill="${done?'#e9d5ff':'#e5e7eb'}" stroke="#d1d5db" stroke-width="0.8"/>`).join('')}
    ${[x-12, x+4].map(wx => `<rect x="${wx-4}" y="${y-38}" width="8" height="10" rx="1" fill="${done?'#e9d5ff':'#e5e7eb'}" stroke="#d1d5db" stroke-width="0.8"/>`).join('')}
    <!-- Castle door -->
    <path d="M ${x-10},${y} L ${x-10},${y-20} Q ${x},${y-28} ${x+10},${y-20} L ${x+10},${y} Z" fill="${done?'#7e22ce':'#6b7280'}"/>
    <!-- Stars decoration when done -->
    ${done ? `<text x="${x-40}" y="${y-85}" font-size="13" opacity="0.8">⭐</text><text x="${x+28}" y="${y-88}" font-size="11" opacity="0.7">✨</text>` : ''}
    <!-- Label -->
    <text x="${x}" y="${y+22}" font-size="10" font-weight="700" text-anchor="middle" fill="${done?'#7e22ce':'#6b7280'}" font-family="sans-serif">${label}</text>
    ${badge}
    ${prog}
  </g>`;
}

// Mobile versions (slightly smaller)
function cottageMobile(x: number, y: number, done: boolean, label: string, completed: number, total: number): string {
  return cottage(x, y, done, label, completed, total);
}
function towerMobile(x: number, y: number, done: boolean, label: string, completed: number, total: number): string {
  return schoolTower(x, y, done, label, completed, total);
}
function castleMobile(x: number, y: number, done: boolean, label: string, completed: number, total: number): string {
  return castle(x, y, done, label, completed, total);
}

// ─── UI HELPERS ──────────────────────────────────────────────────────────────

function sparkles(x: number, y: number): string {
  return `<g>
    <circle cx="${x}" cy="${y}" r="9" fill="#fef9c3" stroke="#fbbf24" stroke-width="1.5"/>
    <text x="${x}" y="${y + 5}" font-size="11" text-anchor="middle" font-family="sans-serif">✓</text>
  </g>`;
}

function lockBadge(x: number, y: number): string {
  return `<g>
    <circle cx="${x}" cy="${y}" r="9" fill="#f3f4f6" stroke="#d1d5db" stroke-width="1.5"/>
    <text x="${x}" y="${y + 5}" font-size="10" text-anchor="middle" font-family="sans-serif" fill="#9ca3af">🔒</text>
  </g>`;
}

function progressPill(x: number, y: number, completed: number, total: number, done: boolean): string {
  const pct = total > 0 ? completed / total : 0;
  const barW = 56;
  const filled = Math.round(pct * barW);
  const color = done ? '#10b981' : '#60a5fa';
  const text = total > 0 ? `${completed}/${total}` : '';
  return `<g>
    <rect x="${x - barW/2 - 2}" y="${y - 6}" width="${barW + 4}" height="10" rx="5" fill="#e5e7eb"/>
    <rect x="${x - barW/2 - 2}" y="${y - 6}" width="${filled + 4}" height="10" rx="5" fill="${color}" opacity="0.85"/>
    <text x="${x}" y="${y + 3}" font-size="7.5" text-anchor="middle" fill="white" font-weight="700" font-family="sans-serif">${text}</text>
  </g>`;
}

function playerChar(x: number, y: number, pct: number): string {
  const hasProgress = pct > 0.01;
  const pulse = hasProgress ? `<circle cx="${x}" cy="${y}" r="14" fill="#fef08a" opacity="0.4"><animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite"/></circle>` : '';
  return `<g>
    ${pulse}
    <circle cx="${x}" cy="${y}" r="10" fill="${hasProgress ? '#fbbf24' : '#d1d5db'}" stroke="white" stroke-width="2" filter="url(#shadow)"/>
    <text x="${x}" y="${y + 5}" font-size="12" text-anchor="middle" font-family="sans-serif">${hasProgress ? '⭐' : '🌱'}</text>
  </g>`;
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────
export function roadmapToDataURI(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
