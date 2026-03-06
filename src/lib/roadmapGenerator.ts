/**
 * 🌲 ADVENTURE ROADMAP — Animated kids journey
 * Inline SVG with SMIL animations for character movement + building celebrations.
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
  /** 0–1 previous player position (for animating movement) */
  prevPlayerPct?: number;
  /** Checkpoint id (1/2/3) that was JUST completed this render, triggers celebration */
  celebrateCheckpoint?: number | null;
  /** Unique key so React re-mounts the SVG and restarts animations */
  animKey?: string;
}

export function generateRoadmapSVG(config: RoadmapConfig): string {
  return config.isMobile
    ? generateMobileRoadmap(config)
    : generateDesktopRoadmap(config);
}

// ─── SHARED CSS ───────────────────────────────────────────────────────────────
function sharedStyles(): string {
  return `<style>
    @keyframes playerBob {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-4px); }
    }
    @keyframes buildingPop {
      0%   { transform: scale(1); }
      20%  { transform: scale(1.28) translateY(-4px); }
      45%  { transform: scale(0.90); }
      65%  { transform: scale(1.12) translateY(-2px); }
      85%  { transform: scale(0.97); }
      100% { transform: scale(1); }
    }
    @keyframes sparkleOut {
      0%   { opacity: 1; transform: scale(0) translate(0,0); }
      60%  { opacity: 0.9; }
      100% { opacity: 0; transform: scale(1.2); }
    }
    @keyframes starSpin {
      0%   { transform: rotate(0deg) scale(1); }
      50%  { transform: rotate(180deg) scale(1.4); }
      100% { transform: rotate(360deg) scale(1); }
    }
    @keyframes pulseRing {
      0%   { r: 10; opacity: 0.7; }
      100% { r: 22; opacity: 0; }
    }
    @keyframes pathGlow {
      0%,100% { stroke-opacity: 0.6; stroke-width: 5; }
      50%      { stroke-opacity: 1; stroke-width: 7; }
    }
    .player-bob    { animation: playerBob 1.8s ease-in-out infinite; }
    .player-spin   { animation: starSpin 0.7s ease-in-out; }
    .building-idle { transform-origin: center bottom; }
    .building-pop  { transform-origin: center bottom; animation: buildingPop 0.65s cubic-bezier(0.36,0.07,0.19,0.97); }
    .path-glow     { animation: pathGlow 2s ease-in-out infinite; }
  </style>`;
}

// ─── DESKTOP ──────────────────────────────────────────────────────────────────
function generateDesktopRoadmap(config: RoadmapConfig): string {
  const W = 900, H = 260;
  const cps = config.checkpoints;
  const c0 = cps[0], c1 = cps[1], c2 = cps[2];
  const px = [170, 450, 730];
  const groundY = 175;

  const totalDone = cps.reduce((s, c) => s + c.completed, 0);
  const totalAll  = cps.reduce((s, c) => s + c.total, 0);
  const curPct = totalAll > 0 ? totalDone / totalAll : 0;
  const prevPct = config.prevPlayerPct ?? curPct;
  const celebrating = config.celebrateCheckpoint;

  // Road path — used by animateMotion too
  const pathD = `M 40,${groundY+15} C 120,${groundY+30} 150,${groundY-20} ${px[0]},${groundY-5} C ${px[0]+90},${groundY+10} ${px[1]-90},${groundY-25} ${px[1]},${groundY-10} C ${px[1]+90},${groundY+5} ${px[2]-90},${groundY-30} ${px[2]},${groundY-5} C ${px[2]+70},${groundY+10} 860,${groundY+20} 880,${groundY+10}`;

  // Static player fallback position (for when there's no animateMotion)
  const sX = 40 + curPct * 840;
  const sY = groundY + 5 - Math.sin(curPct * Math.PI) * 25;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" id="roadmap-${config.animKey ?? 'main'}">
${sharedStyles()}
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#bfecff"/><stop offset="100%" stop-color="#e8f9ff"/>
  </linearGradient>
  <linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#7ec850"/><stop offset="100%" stop-color="#5aab30"/>
  </linearGradient>
  <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f5d88a"/><stop offset="100%" stop-color="#e8c060"/>
  </linearGradient>
  <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="shadow"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#00000030"/></filter>
  <path id="road-path-d" d="${pathD}"/>
</defs>

<rect width="${W}" height="${H}" fill="url(#sky)" rx="12"/>
${cloud(820,30,1.05)} ${cloud(120,28,0.9)} ${cloud(380,20,0.75)} ${cloud(600,38,0.85)}
<circle cx="820" cy="38" r="26" fill="#ffe066" opacity="0.9" filter="url(#glow)"/>
<circle cx="820" cy="38" r="20" fill="#ffd700"/>

<!-- Mountains -->
<polygon points="520,${groundY-10} 630,${groundY-95} 740,${groundY-10}" fill="#c9d6e3" opacity="0.55"/>
<polygon points="630,${groundY-10} 760,${groundY-115} 880,${groundY-10}" fill="#b5c8d8" opacity="0.5"/>
<polygon points="630,${groundY-115} 650,${groundY-95} 610,${groundY-95}" fill="white" opacity="0.85"/>
<polygon points="760,${groundY-115} 782,${groundY-92} 738,${groundY-92}" fill="white" opacity="0.8"/>

<rect x="0" y="${groundY+20}" width="${W}" height="${H-groundY-20}" fill="url(#gnd)"/>
<ellipse cx="450" cy="${groundY+20}" rx="500" ry="22" fill="#7ec850"/>

${bgTrees()}

<!-- Road -->
<path d="${pathD}" fill="none" stroke="#c8a040" stroke-width="36" stroke-linecap="round"/>
<path d="${pathD}" fill="none" stroke="url(#road)" stroke-width="30" stroke-linecap="round"/>
<path d="${pathD}" fill="none" stroke="#e8c060" stroke-width="2" stroke-dasharray="18,14" opacity="0.6"/>

<!-- Completed road segments (green glow) -->
${c0.isCompleted ? `<path d="M 40,${groundY+15} C 120,${groundY+30} 150,${groundY-20} ${px[0]},${groundY-5}" fill="none" stroke="#52c41a" stroke-width="5" stroke-linecap="round" opacity="0.8" class="path-glow"/>` : ''}
${c1.isCompleted ? `<path d="M ${px[0]},${groundY-5} C ${px[0]+90},${groundY+10} ${px[1]-90},${groundY-25} ${px[1]},${groundY-10}" fill="none" stroke="#52c41a" stroke-width="5" stroke-linecap="round" opacity="0.8" class="path-glow"/>` : ''}
${c2.isCompleted ? `<path d="M ${px[1]},${groundY-10} C ${px[1]+90},${groundY+5} ${px[2]-90},${groundY-30} ${px[2]},${groundY-5}" fill="none" stroke="#f0b429" stroke-width="5" stroke-linecap="round" opacity="0.8" class="path-glow"/>` : ''}

${fgDecorations(px, groundY)}

<!-- Buildings -->
<g id="cp-1" class="${celebrating === 1 ? 'building-pop' : 'building-idle'}">${cottage(px[0], groundY-8, c0, false)}</g>
<g id="cp-2" class="${celebrating === 2 ? 'building-pop' : 'building-idle'}">${schoolTower(px[1], groundY-8, c1, false)}</g>
<g id="cp-3" class="${celebrating === 3 ? 'building-pop' : 'building-idle'}">${castle(px[2], groundY-8, c2, false)}</g>

<!-- Celebration sparkles -->
${celebrating === 1 ? celebrationBurst(px[0], groundY-70) : ''}
${celebrating === 2 ? celebrationBurst(px[1], groundY-80) : ''}
${celebrating === 3 ? celebrationBurst(px[2], groundY-100) : ''}

<!-- Player character — animates along path when position changes -->
<g id="player" class="${celebrating ? 'player-spin' : 'player-bob'}">
  ${prevPct !== curPct ? `
  <!-- Pulse ring -->
  <circle cx="0" cy="0" r="10" fill="#fef08a" opacity="0.5">
    <animateMotion dur="1.4s" fill="freeze" keyPoints="${prevPct};${curPct}" keyTimes="0;1" calcMode="spline" keySplines="0.25 0.46 0.45 0.94">
      <mpath href="#road-path-d"/>
    </animateMotion>
    <animate attributeName="r" values="10;20;10" dur="1.4s" repeatCount="1"/>
    <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.4s" repeatCount="1"/>
  </circle>` : ''}
  <circle cx="${prevPct === curPct ? sX : 0}" cy="${prevPct === curPct ? sY : 0}" r="11" fill="${curPct > 0 ? '#fbbf24' : '#d1d5db'}" stroke="white" stroke-width="2.5" filter="url(#shadow)">
    ${prevPct !== curPct ? `<animateMotion dur="1.4s" fill="freeze" keyPoints="${prevPct};${curPct}" keyTimes="0;1" calcMode="spline" keySplines="0.25 0.46 0.45 0.94"><mpath href="#road-path-d"/></animateMotion>` : ''}
  </circle>
  <text x="${prevPct === curPct ? sX : 0}" y="${prevPct === curPct ? sY+4 : 4}" font-size="13" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${curPct > 0 ? '⭐' : '🌱'}</text>
  ${prevPct !== curPct ? `<animateMotion dur="1.4s" fill="freeze" keyPoints="${prevPct};${curPct}" keyTimes="0;1" calcMode="spline" keySplines="0.25 0.46 0.45 0.94" additive="sum" accumulate="none"><mpath href="#road-path-d"/></animateMotion>` : ''}
</g>

</svg>`;
}

// ─── MOBILE ───────────────────────────────────────────────────────────────────
function generateMobileRoadmap(config: RoadmapConfig): string {
  const W = 360, H = 400;
  const cps = config.checkpoints;
  const c0 = cps[0], c1 = cps[1], c2 = cps[2];
  const cx = W / 2;
  const py = [310, 200, 95];

  const totalDone = cps.reduce((s, c) => s + c.completed, 0);
  const totalAll  = cps.reduce((s, c) => s + c.total, 0);
  const curPct = totalAll > 0 ? totalDone / totalAll : 0;
  const prevPct = config.prevPlayerPct ?? curPct;
  const celebrating = config.celebrateCheckpoint;

  const sX = cx + Math.sin(curPct * Math.PI * 2) * 20;
  const sY = 330 - curPct * 250;

  const pathD = `M ${cx-30},${H-20} C ${cx-60},350 ${cx+60},330 ${cx+30},${py[0]} C ${cx+60},${py[0]-30} ${cx-60},${py[1]+30} ${cx-30},${py[1]} C ${cx-60},${py[1]-30} ${cx+60},${py[2]+30} ${cx+30},${py[2]} C ${cx+20},${py[2]-20} ${cx},20 ${cx},20`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" id="roadmap-m-${config.animKey ?? 'main'}">
${sharedStyles()}
<defs>
  <linearGradient id="sky-m" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#bfecff"/><stop offset="60%" stop-color="#e8f9ff"/><stop offset="100%" stop-color="#c8f5b0"/>
  </linearGradient>
  <linearGradient id="road-m" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#f5d88a"/><stop offset="100%" stop-color="#e8c060"/>
  </linearGradient>
  <filter id="glow-m"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="shad-m"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#00000030"/></filter>
  <path id="road-path-m" d="${pathD}"/>
</defs>

<rect width="${W}" height="${H}" fill="url(#sky-m)" rx="12"/>
<circle cx="310" cy="35" r="22" fill="#ffe066" opacity="0.9" filter="url(#glow-m)"/>
<circle cx="310" cy="35" r="17" fill="#ffd700"/>
${cloud(60,28,0.7)} ${cloud(185,15,0.58)} ${cloud(255,42,0.62)}

<polygon points="30,${H-60} 110,${H-180} 190,${H-60}" fill="#c9d6e3" opacity="0.55"/>
<polygon points="170,${H-60} 260,${H-200} 340,${H-60}" fill="#b5c8d8" opacity="0.5"/>
<polygon points="110,${H-180} 130,${H-155} 90,${H-155}" fill="white" opacity="0.8"/>
<polygon points="260,${H-200} 280,${H-172} 240,${H-172}" fill="white" opacity="0.75"/>

<rect x="0" y="${H-55}" width="${W}" height="55" fill="#7ec850"/>
<ellipse cx="${cx}" cy="${H-55}" rx="220" ry="18" fill="#7ec850"/>

<path d="${pathD}" fill="none" stroke="#c8a040" stroke-width="30" stroke-linecap="round"/>
<path d="${pathD}" fill="none" stroke="url(#road-m)" stroke-width="24" stroke-linecap="round"/>
<path d="${pathD}" fill="none" stroke="#e8c060" stroke-width="2" stroke-dasharray="12,10" opacity="0.5"/>

${mobileTreeRow(W, H)}

<g id="cp-1m" class="${celebrating === 1 ? 'building-pop' : 'building-idle'}">${cottage(cx+35, py[0]-5, c0, true)}</g>
<g id="cp-2m" class="${celebrating === 2 ? 'building-pop' : 'building-idle'}">${schoolTower(cx-35, py[1]-5, c1, true)}</g>
<g id="cp-3m" class="${celebrating === 3 ? 'building-pop' : 'building-idle'}">${castle(cx+30, py[2], c2, true)}</g>

${celebrating === 1 ? celebrationBurst(cx+35, py[0]-60) : ''}
${celebrating === 2 ? celebrationBurst(cx-35, py[1]-70) : ''}
${celebrating === 3 ? celebrationBurst(cx+30, py[2]-90) : ''}

<g id="player-m" class="${celebrating ? 'player-spin' : 'player-bob'}">
  ${prevPct !== curPct ? `
  <circle cx="0" cy="0" r="10" fill="#fef08a" opacity="0.5">
    <animateMotion dur="1.4s" fill="freeze" keyPoints="${prevPct};${curPct}" keyTimes="0;1" calcMode="spline" keySplines="0.25 0.46 0.45 0.94">
      <mpath href="#road-path-m"/>
    </animateMotion>
    <animate attributeName="r" values="10;20;10" dur="1.4s" repeatCount="1"/>
    <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.4s" repeatCount="1"/>
  </circle>` : ''}
  <circle cx="${prevPct === curPct ? sX : 0}" cy="${prevPct === curPct ? sY : 0}" r="11" fill="${curPct > 0 ? '#fbbf24' : '#d1d5db'}" stroke="white" stroke-width="2.5" filter="url(#shad-m)">
    ${prevPct !== curPct ? `<animateMotion dur="1.4s" fill="freeze" keyPoints="${prevPct};${curPct}" keyTimes="0;1" calcMode="spline" keySplines="0.25 0.46 0.45 0.94"><mpath href="#road-path-m"/></animateMotion>` : ''}
  </circle>
  <text x="${prevPct === curPct ? sX : 0}" y="${prevPct === curPct ? sY+4 : 4}" font-size="13" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${curPct > 0 ? '⭐' : '🌱'}</text>
  ${prevPct !== curPct ? `<animateMotion dur="1.4s" fill="freeze" keyPoints="${prevPct};${curPct}" keyTimes="0;1" calcMode="spline" keySplines="0.25 0.46 0.45 0.94"><mpath href="#road-path-m"/></animateMotion>` : ''}
</g>

</svg>`;
}

// ─── CELEBRATION BURST ────────────────────────────────────────────────────────
function celebrationBurst(cx: number, cy: number): string {
  const colors = ['#fbbf24','#f472b6','#34d399','#60a5fa','#a78bfa','#fb923c'];
  const angles = [0, 60, 120, 180, 240, 300];
  return `<g>
    ${angles.map((a, i) => {
      const rad = a * Math.PI / 180;
      const dx = Math.cos(rad) * 28, dy = Math.sin(rad) * 28;
      return `<circle cx="${cx}" cy="${cy}" r="5" fill="${colors[i % colors.length]}">
        <animate attributeName="cx" values="${cx};${cx+dx}" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.3 0.6 0.6 1"/>
        <animate attributeName="cy" values="${cy};${cy+dy}" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.3 0.6 0.6 1"/>
        <animate attributeName="opacity" values="1;0" dur="0.6s" fill="freeze"/>
        <animate attributeName="r" values="5;2" dur="0.6s" fill="freeze"/>
      </circle>`;
    }).join('')}
    <!-- Stars -->
    ${[30,90,150,210,270,330].map((a, i) => {
      const rad = a * Math.PI / 180;
      const dx = Math.cos(rad) * 38, dy = Math.sin(rad) * 38;
      return `<text x="${cx}" y="${cy}" font-size="10" text-anchor="middle" font-family="sans-serif" opacity="1">✨
        <animate attributeName="x" values="${cx};${cx+dx}" dur="0.8s" fill="freeze" begin="0.1s"/>
        <animate attributeName="y" values="${cy};${cy+dy}" dur="0.8s" fill="freeze" begin="0.1s"/>
        <animate attributeName="opacity" values="1;0" dur="0.8s" fill="freeze" begin="0.1s"/>
      </text>`;
    }).join('')}
  </g>`;
}

// ─── NATURE HELPERS ───────────────────────────────────────────────────────────
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
  return `<g>
    <rect x="${x-4}" y="${y}" width="8" height="${h*0.4}" fill="#8B5E3C"/>
    <polygon points="${x},${y-h*0.7} ${x-h*0.45},${y+h*0.05} ${x+h*0.45},${y+h*0.05}" fill="${g2}"/>
    <polygon points="${x},${y-h} ${x-h*0.35},${y-h*0.3} ${x+h*0.35},${y-h*0.3}" fill="${g}"/>
  </g>`;
}

function bush(x: number, y: number, r: number): string {
  return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*0.65}" fill="#3aac5a"/>
    <ellipse cx="${x-r*0.45}" cy="${y-r*0.15}" rx="${r*0.6}" ry="${r*0.5}" fill="#42c464"/>
    <ellipse cx="${x+r*0.45}" cy="${y-r*0.15}" rx="${r*0.6}" ry="${r*0.5}" fill="#42c464"/>`;
}

function bgTrees(): string {
  let s = '';
  [50,110,200,320,550,660,800,850].forEach((x, i) => s += tree(x, 140+(i%2)*8, 45+(i%3)*15, true));
  return s;
}

function fgDecorations(px: number[], groundY: number): string {
  let s = '';
  [90,240,370,530,620,790].forEach((x, i) => s += tree(x + (i%2===0?-45:45), groundY+10, 38+(i%2)*12));
  [130,350,580,700].forEach((x, i) => s += bush(x, groundY+28, 14+(i%2)*4));
  [[80,groundY+32],[200,groundY+25],[480,groundY+30],[800,groundY+28]].forEach(([fx,fy]) => {
    s += `<circle cx="${fx}" cy="${fy}" r="4" fill="#ff6b9d" opacity="0.9"/>`;
    s += `<circle cx="${fx+10}" cy="${fy-3}" r="3" fill="#ffd700" opacity="0.9"/>`;
  });
  return s;
}

function mobileTreeRow(W: number, H: number): string {
  let s = '';
  [[30,H-75,32],[60,H-85,38],[290,H-70,30],[320,H-82,35],[20,200,30],[330,180,32],[25,120,28],[335,100,26]].forEach(([x,y,h]) => s += tree(x,y,h));
  s += bush(50,H-52,12); s += bush(300,H-50,11);
  return s;
}

// ─── BUILDINGS ────────────────────────────────────────────────────────────────
function cottage(x: number, y: number, cp: RoadmapConfig['checkpoints'][0], _mobile: boolean): string {
  const done = cp.isCompleted;
  const fill = done ? '#fffbe6' : '#f0f0f0';
  const roof = done ? '#e85d04' : '#9ca3af';
  const glow = done ? 'filter="url(#glow)"' : '';
  return `<g ${glow} transform-origin="${x}px ${y}px">
    <rect x="${x-28}" y="${y-42}" width="56" height="42" rx="4" fill="${fill}" stroke="${done?'#f59e0b':'#d1d5db'}" stroke-width="${done?2:1.5}"/>
    <polygon points="${x-34},${y-42} ${x},${y-75} ${x+34},${y-42}" fill="${roof}"/>
    <rect x="${x+14}" y="${y-80}" width="9" height="18" fill="${done?'#9a3412':'#9ca3af'}"/>
    ${done?`<ellipse cx="${x+18}" cy="${y-83}" rx="6" ry="4" fill="#f97316" opacity="0.7"/>` : ''}
    <rect x="${x-8}" y="${y-22}" width="16" height="22" rx="3" fill="${done?'#92400e':'#6b7280'}"/>
    <rect x="${x-24}" y="${y-36}" width="12" height="10" rx="2" fill="${done?'#fef3c7':'#e5e7eb'}" stroke="#d1d5db" stroke-width="1"/>
    <rect x="${x+12}" y="${y-36}" width="12" height="10" rx="2" fill="${done?'#fef3c7':'#e5e7eb'}" stroke="#d1d5db" stroke-width="1"/>
    ${badgeAndBar(x, y, done, cp.label, cp.completed, cp.total)}
  </g>`;
}

function schoolTower(x: number, y: number, cp: RoadmapConfig['checkpoints'][0], _mobile: boolean): string {
  const done = cp.isCompleted;
  const fill = done ? '#ecfdf5' : '#f0f0f0';
  const wall = done ? '#059669' : '#9ca3af';
  const glow = done ? 'filter="url(#glow)"' : '';
  return `<g ${glow} transform-origin="${x}px ${y}px">
    <rect x="${x-20}" y="${y-70}" width="40" height="70" rx="3" fill="${fill}" stroke="${wall}" stroke-width="${done?2:1.5}"/>
    ${[-16,-6,4,14].map(ox=>`<rect x="${x+ox}" y="${y-82}" width="8" height="14" rx="1" fill="${wall}"/>`).join('')}
    <line x1="${x+10}" y1="${y-92}" x2="${x+10}" y2="${y-72}" stroke="${done?'#065f46':'#9ca3af'}" stroke-width="2"/>
    <polygon points="${x+10},${y-92} ${x+26},${y-84} ${x+10},${y-76}" fill="${done?'#10b981':'#d1d5db'}"/>
    <rect x="${x-14}" y="${y-60}" width="12" height="14" rx="2" fill="${done?'#a7f3d0':'#e5e7eb'}" stroke="#d1d5db" stroke-width="1"/>
    <rect x="${x+2}" y="${y-60}" width="12" height="14" rx="2" fill="${done?'#a7f3d0':'#e5e7eb'}" stroke="#d1d5db" stroke-width="1"/>
    <rect x="${x-8}" y="${y-38}" width="16" height="14" rx="2" fill="${done?'#a7f3d0':'#e5e7eb'}" stroke="#d1d5db" stroke-width="1"/>
    <rect x="${x-8}" y="${y-22}" width="16" height="22" rx="3" fill="${done?'#065f46':'#6b7280'}"/>
    ${badgeAndBar(x, y, done, cp.label, cp.completed, cp.total)}
  </g>`;
}

function castle(x: number, y: number, cp: RoadmapConfig['checkpoints'][0], _mobile: boolean): string {
  const done = cp.isCompleted;
  const fill = done ? '#fdf4ff' : '#f0f0f0';
  const wall = done ? '#9333ea' : '#9ca3af';
  const glow = done ? 'filter="url(#glow)"' : '';
  return `<g ${glow} transform-origin="${x}px ${y}px">
    <rect x="${x-26}" y="${y-80}" width="52" height="80" rx="3" fill="${fill}" stroke="${wall}" stroke-width="${done?2:1.5}"/>
    <rect x="${x-38}" y="${y-72}" width="16" height="72" rx="2" fill="${fill}" stroke="${wall}" stroke-width="${done?1.5:1}"/>
    <rect x="${x+22}" y="${y-72}" width="16" height="72" rx="2" fill="${fill}" stroke="${wall}" stroke-width="${done?1.5:1}"/>
    ${[x-30,x,x+30].map(tx=>[-4,-2,0,2].map(ox=>`<rect x="${tx+ox*3-4}" y="${y-90}" width="5" height="10" rx="1" fill="${wall}"/>`).join('')).join('')}
    <line x1="${x}" y1="${y-105}" x2="${x}" y2="${y-88}" stroke="${done?'#7e22ce':'#9ca3af'}" stroke-width="2"/>
    <polygon points="${x},${y-105} ${x+18},${y-97} ${x},${y-88}" fill="${done?'#d946ef':'#d1d5db'}"/>
    ${[x-18,x-6,x+6,x+18].map(wx=>`<rect x="${wx-4}" y="${y-58}" width="8" height="10" rx="1" fill="${done?'#e9d5ff':'#e5e7eb'}" stroke="#d1d5db" stroke-width="0.8"/>`).join('')}
    ${[x-12,x+4].map(wx=>`<rect x="${wx-4}" y="${y-38}" width="8" height="10" rx="1" fill="${done?'#e9d5ff':'#e5e7eb'}" stroke="#d1d5db" stroke-width="0.8"/>`).join('')}
    <path d="M ${x-10},${y} L ${x-10},${y-20} Q ${x},${y-28} ${x+10},${y-20} L ${x+10},${y} Z" fill="${done?'#7e22ce':'#6b7280'}"/>
    ${done?`<text x="${x-40}" y="${y-85}" font-size="13" opacity="0.8">⭐</text><text x="${x+28}" y="${y-88}" font-size="11" opacity="0.7">✨</text>` : ''}
    ${badgeAndBar(x, y, done, cp.label, cp.completed, cp.total)}
  </g>`;
}

function badgeAndBar(x: number, y: number, done: boolean, label: string, completed: number, total: number): string {
  const barW = 56;
  const filled = total > 0 ? Math.round((completed/total) * barW) : 0;
  const color = done ? '#10b981' : '#60a5fa';
  const badgeY = y - (done ? 95 : 92);
  return `
    <circle cx="${x}" cy="${badgeY}" r="9" fill="${done?'#fef9c3':'#f3f4f6'}" stroke="${done?'#fbbf24':'#d1d5db'}" stroke-width="1.5"/>
    <text x="${x}" y="${badgeY+4}" font-size="${done?10:11}" text-anchor="middle" font-family="sans-serif" fill="${done?'#92400e':'#9ca3af'}">${done?'✓':'🔒'}</text>
    <text x="${x}" y="${y+22}" font-size="10" font-weight="700" text-anchor="middle" fill="${done?'#374151':'#6b7280'}" font-family="sans-serif">${label}</text>
    <rect x="${x-barW/2-2}" y="${y+27}" width="${barW+4}" height="9" rx="4.5" fill="#e5e7eb"/>
    <rect x="${x-barW/2-2}" y="${y+27}" width="${filled+4}" height="9" rx="4.5" fill="${color}" opacity="0.85"/>
    <text x="${x}" y="${y+35}" font-size="7" text-anchor="middle" fill="white" font-weight="700" font-family="sans-serif">${total>0?`${completed}/${total}`:''}</text>`;
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export function roadmapToDataURI(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
