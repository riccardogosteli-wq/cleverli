/**
 * 🌲 ADVENTURE ROADMAP — Dynamic 1–3 checkpoint system
 *
 * Key design principles:
 * - Only renders checkpoints that have actual exercises (no phantom ✅ for empty tiers)
 * - 1 checkpoint = 1 building; 2 = 2 buildings; 3 = 3 buildings, dynamically positioned
 * - Each building is clearly labeled "Stufe 1 / 2 / 3" with a numbered badge
 * - Road, scenery, and buildings all polished and visually distinct per level
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
  prevPlayerPct?: number;
  celebrateCheckpoint?: number | null;
  animKey?: string;
  topicId?: string;
}

// ─── STATIC BACKGROUND ROADMAP TOPICS ───────────────────────────────────────
// Topics that use the static background image instead of dynamic SVG generation
const STATIC_ROADMAP_TOPICS = ["zahlen-1-10"];

export function generateRoadmapSVG(config: RoadmapConfig): string {
  // Use static background roadmap for specified topics
  if (config.topicId && STATIC_ROADMAP_TOPICS.includes(config.topicId)) {
    return generateStaticRoadmap(config);
  }

  return config.isMobile
    ? generateMobileRoadmap(config)
    : generateDesktopRoadmap(config);
}

// ─── SHARED CSS ───────────────────────────────────────────────────────────────
function sharedStyles(): string {
  return `<style>
    @keyframes playerBob {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-5px); }
    }
    @keyframes buildingPop {
      0%   { transform: scale(1); }
      20%  { transform: scale(1.3) translateY(-5px); }
      45%  { transform: scale(0.88); }
      65%  { transform: scale(1.14) translateY(-2px); }
      85%  { transform: scale(0.97); }
      100% { transform: scale(1); }
    }
    @keyframes starSpin {
      0%   { transform: rotate(0deg) scale(1); }
      50%  { transform: rotate(180deg) scale(1.5); }
      100% { transform: rotate(360deg) scale(1); }
    }
    @keyframes pathGlow {
      0%,100% { stroke-opacity: 0.5; stroke-width: 6; }
      50%      { stroke-opacity: 1; stroke-width: 8; }
    }
    @keyframes flagWave {
      0%,100% { transform: skewX(0deg); }
      25%      { transform: skewX(-8deg); }
      75%      { transform: skewX(6deg); }
    }
    .player-bob    { animation: playerBob 1.8s ease-in-out infinite; }
    .player-spin   { animation: starSpin 0.7s ease-in-out; }
    .building-idle { transform-box: fill-box; transform-origin: center bottom; }
    .building-pop  { transform-box: fill-box; transform-origin: center bottom; animation: buildingPop 0.65s cubic-bezier(0.36,0.07,0.19,0.97); }
    .path-glow     { animation: pathGlow 2s ease-in-out infinite; }
    .flag-wave     { transform-box: fill-box; transform-origin: left center; animation: flagWave 2s ease-in-out infinite; }
  </style>`;
}

// ─── CLOUD ────────────────────────────────────────────────────────────────────
function cloud(cx: number, cy: number, scale: number): string {
  const s = scale;
  return `<g transform="translate(${cx},${cy}) scale(${s})">
    <ellipse cx="0" cy="0" rx="28" ry="16" fill="white" opacity="0.92"/>
    <ellipse cx="-18" cy="4" rx="18" ry="12" fill="white" opacity="0.88"/>
    <ellipse cx="18" cy="4" rx="20" ry="13" fill="white" opacity="0.88"/>
    <ellipse cx="0" cy="8" rx="24" ry="10" fill="white" opacity="0.85"/>
  </g>`;
}

// ─── TREE ─────────────────────────────────────────────────────────────────────
function pineTree(x: number, y: number, scale: number, dark: boolean): string {
  const s = scale;
  const col = dark ? '#2d6a2d' : '#3a9a3a';
  const col2 = dark ? '#1f5020' : '#2d7a2d';
  return `<g transform="translate(${x},${y}) scale(${s})">
    <polygon points="0,-42 -20,0 20,0" fill="${col2}"/>
    <polygon points="0,-52 -24,-4 24,-4" fill="${col}"/>
    <polygon points="0,-62 -18,-16 18,-16" fill="${dark ? '#3a9a3a' : '#4db84d'}"/>
    <rect x="-4" y="0" width="8" height="12" rx="1" fill="#8B4513"/>
  </g>`;
}

// ─── CELEBRATION BURST ────────────────────────────────────────────────────────
function celebrationBurst(cx: number, cy: number): string {
  const colors = ['#f59e0b','#ef4444','#3b82f6','#10b981','#8b5cf6','#f97316'];
  const stars = colors.map((c, i) => {
    const angle = (i * 60) * Math.PI / 180;
    const dx = Math.cos(angle) * 35, dy = Math.sin(angle) * 35;
    return `<circle cx="${cx}" cy="${cy}" r="5" fill="${c}">
      <animate attributeName="cx" values="${cx};${cx+dx};${cx+dx*1.4}" dur="0.8s" fill="freeze"/>
      <animate attributeName="cy" values="${cy};${cy+dy};${cy+dy*1.4}" dur="0.8s" fill="freeze"/>
      <animate attributeName="opacity" values="1;0.8;0" dur="0.8s" fill="freeze"/>
      <animate attributeName="r" values="5;7;3" dur="0.8s" fill="freeze"/>
    </circle>
    <text x="${cx}" y="${cy}" font-size="16" text-anchor="middle" opacity="1">✨
      <animate attributeName="x" values="${cx};${cx+dx*0.7}" dur="0.8s" fill="freeze"/>
      <animate attributeName="y" values="${cy};${cy+dy*0.7-10}" dur="0.8s" fill="freeze"/>
      <animate attributeName="opacity" values="1;0" dur="0.8s" fill="freeze"/>
    </text>`;
  });
  return stars.join('');
}

// ─── LEVEL BADGE (replaces tiny pill) ────────────────────────────────────────
// Shows: number badge (1/2/3) + done indicator
function levelBadge(x: number, y: number, levelNum: number, done: boolean): string {
  const colors = ['#22c55e','#3b82f6','#9333ea'];      // green, blue, purple per level
  const col = done ? colors[levelNum-1] : '#9ca3af';
  const bg  = done ? (levelNum===1?'#dcfce7':levelNum===2?'#dbeafe':'#f3e8ff') : '#f1f5f9';
  return `<g>
    <circle cx="${x}" cy="${y}" r="13" fill="${bg}" stroke="${col}" stroke-width="2.5"/>
    ${done
      ? `<text x="${x}" y="${y+1}" font-size="14" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">✅</text>`
      : `<text x="${x}" y="${y+1}" font-size="12" font-weight="900" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" fill="${col}">${levelNum}</text>`
    }
  </g>`;
}

function levelLabel(x: number, y: number, levelNum: number, label: string, done: boolean): string {
  const colors = ['#16a34a','#1d4ed8','#7e22ce'];
  const col = done ? colors[levelNum-1] : '#94a3b8';
  // Level number on top, name below
  return `<g>
    <text x="${x}" y="${y}" font-size="9" font-weight="900" text-anchor="middle" font-family="sans-serif"
      fill="${done ? colors[levelNum-1] : '#cbd5e1'}" letter-spacing="1" text-transform="uppercase">STUFE ${levelNum}</text>
    <text x="${x}" y="${y+13}" font-size="11" font-weight="800" text-anchor="middle" font-family="sans-serif"
      fill="${col}">${label}</text>
  </g>`;
}

// ─── BUILDING 1: House Level 1 ───────────────────────────────────────────────
function cottage(x: number, y: number, done: boolean, _levelNum: number, scale: number = 1): string {
  const w = Math.round(130 * scale), h = Math.round(155 * scale);
  const src = done ? '/images/scenes/Haus-level1-open.svg' : '/images/scenes/Haus-level1-closed.svg';
  return `<ellipse cx="${x}" cy="${y + 4}" rx="${Math.round(46 * scale)}" ry="${Math.round(7 * scale)}" fill="#00000018"/>
  <image href="${src}" x="${Math.round(x - w / 2)}" y="${Math.round(y - h + 6)}" width="${w}" height="${h}" preserveAspectRatio="xMidYMax meet" filter="url(#rmwh)"/>`;
}

// ─── BUILDING 2: House Level 2 ───────────────────────────────────────────────
function tower(x: number, y: number, done: boolean, _levelNum: number, scale: number = 1): string {
  const w = Math.round(120 * scale), h = Math.round(175 * scale);
  const src = done ? '/images/scenes/Haus-level2-open.svg' : '/images/scenes/Haus-level2-closed.svg';
  return `<ellipse cx="${x}" cy="${y + 4}" rx="${Math.round(42 * scale)}" ry="${Math.round(7 * scale)}" fill="#00000018"/>
  <image href="${src}" x="${Math.round(x - w / 2)}" y="${Math.round(y - h + 6)}" width="${w}" height="${h}" preserveAspectRatio="xMidYMax meet" filter="url(#rmwh)"/>`;
}

// ─── BUILDING 3: Castle Level 3 ──────────────────────────────────────────────
function castle(x: number, y: number, done: boolean, _levelNum: number, scale: number = 1): string {
  const w = Math.round(160 * scale), h = Math.round(195 * scale);
  const src = done ? '/images/scenes/Schloss-level3-open.svg' : '/images/scenes/Schloss-level3-closed.svg';
  return `<ellipse cx="${x}" cy="${y + 4}" rx="${Math.round(58 * scale)}" ry="${Math.round(8 * scale)}" fill="#00000018"/>
  <image href="${src}" x="${Math.round(x - w / 2)}" y="${Math.round(y - h + 6)}" width="${w}" height="${h}" preserveAspectRatio="xMidYMax meet" filter="url(#rmwh)"/>`;
}

// ─── STATIC BACKGROUND ROADMAP ─────────────────────────────────────────────
// Uses a pre-designed background image (progress-background2.svg) with positioned house images
function generateStaticRoadmap(config: RoadmapConfig): string {
  const { checkpoints, isMobile, prevPlayerPct = 0, celebrateCheckpoint } = config;
  
  // Calculate current progress (0-1)
  const totalCompleted = checkpoints.reduce((s, cp) => s + cp.completed, 0);
  const totalAll = checkpoints.reduce((s, cp) => s + cp.total, 0);
  const curPct = totalAll > 0 ? totalCompleted / totalAll : 0;
  
  // Green circle positions for house placement on progress-background2.svg
  // Measured from visual inspection: circles at y: 18%, 48%, 78%
  // Checkpoint order: difficulty 1 → 2 → 3 (top to bottom)
  const circlePositions = [
    { x: 50, y: 18 },   // Circle 1 (Haus-level1, difficulty 1) — top
    { x: 50, y: 48 },   // Circle 2 (Haus-level2, difficulty 2) — middle
    { x: 50, y: 78 },   // Circle 3 (Schloss-level3, difficulty 3) — bottom
  ];
  
  // House building images for each level (open/closed based on completion)
  // Maps to checkpoint order: [difficulty 1, difficulty 2, difficulty 3]
  const houseImages = [
    { open: "/images/scenes/Haus-level1-open.svg", closed: "/images/scenes/Haus-level1-closed.svg" },  // Top
    { open: "/images/scenes/Haus-level2-open.svg", closed: "/images/scenes/Haus-level2-closed.svg" },  // Middle
    { open: "/images/scenes/Schloss-level3-open.svg", closed: "/images/scenes/Schloss-level3-closed.svg" },  // Bottom
  ];
  
  // SVG wrapper: use a container with the background image + positioned house overlays
  const bgWidth = isMobile ? 360 : 800;
  const bgHeight = isMobile ? 540 : 1100;
  
  const houseHTML = checkpoints.map((cp, i) => {
    const pos = circlePositions[i];
    if (!pos) return '';
    
    const x = (bgWidth * pos.x) / 100;
    const y = (bgHeight * pos.y) / 100;
    const houseImg = houseImages[i];
    const imageSrc = cp.isCompleted ? houseImg.open : houseImg.closed;
    // Much larger sizes to fill circles: 220px desktop, 150px mobile
    const houseSize = isMobile ? 150 : 220;
    
    return `<image href="${imageSrc}" x="${x - houseSize/2}" y="${y - houseSize/2}" width="${houseSize}" height="${houseSize}" preserveAspectRatio="xMidYMid meet" style="filter: url(#rmwh)"/>`;
  }).join('');
  
  const playerEmoji = curPct > 0 ? '⭐' : '🌱';
  const celebrating = celebrateCheckpoint !== null;
  const playerY = bgHeight * (curPct * 0.95 + 0.02); // Map progress to vertical position
  
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
  viewBox="0 0 ${bgWidth} ${bgHeight}" width="100%" height="auto" preserveAspectRatio="xMidYMid meet">
  ${sharedStyles()}
  
  <defs>
    <!-- Remove white backgrounds from house SVG images -->
    <filter id="rmwh" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 0 2.8" result="mask"/>
      <feComposite in="SourceGraphic" in2="mask" operator="in"/>
    </filter>
    <filter id="shad-static">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.4"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Static background (scaled to fit container) -->
  <image href="/images/scenes/progress-background2.svg" x="0" y="0" width="${bgWidth}" height="${bgHeight}" preserveAspectRatio="xMidYMid slice"/>
  
  <!-- House overlays positioned on green circles with white background removed -->
  ${houseHTML}
  
  <!-- Player character with progress animation -->
  <g id="player-static" class="${celebrating ? 'player-spin' : 'player-bob'}">
    <circle cx="${bgWidth/2}" cy="${playerY}" r="12" fill="${curPct > 0 ? '#fbbf24' : '#d1d5db'}" stroke="white" stroke-width="2" filter="url(#shad-static)"/>
    <text x="${bgWidth/2}" y="${playerY + 4}" font-size="14" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${playerEmoji}</text>
  </g>
  
  ${celebrating ? celebrationBurst(bgWidth/2, playerY - 50) : ''}
</svg>`;
}

// ─── DESKTOP LAYOUT ───────────────────────────────────────────────────────────
function generateDesktopRoadmap(config: RoadmapConfig): string {
  const W = 900, H = 270;
  const cps = config.checkpoints; // 1, 2, or 3 checkpoints (already filtered)
  const count = cps.length;

  // Dynamic building X positions based on checkpoint count
  const POSITIONS: Record<number, number[]> = {
    1: [500],
    2: [270, 660],
    3: [170, 450, 730],
  };
  const px = POSITIONS[count] ?? POSITIONS[3];
  const groundY = 178;

  const totalDone = cps.reduce((s, c) => s + c.completed, 0);
  const totalAll  = cps.reduce((s, c) => s + c.total, 0);
  const curPct    = totalAll > 0 ? totalDone / totalAll : 0;
  const prevPct   = config.prevPlayerPct ?? curPct;
  const celebrating = config.celebrateCheckpoint;

  // Road bezier — adapts based on building positions
  const roadStart = { x: 40, y: groundY + 18 };
  const roadEnd   = { x: 880, y: groundY + 8 };
  let pathD: string;
  if (count === 1) {
    pathD = `M ${roadStart.x},${roadStart.y} C 200,${groundY+35} 350,${groundY-30} ${px[0]},${groundY-8} C ${px[0]+120},${groundY+10} 750,${groundY+15} ${roadEnd.x},${roadEnd.y}`;
  } else if (count === 2) {
    pathD = `M ${roadStart.x},${roadStart.y} C 130,${groundY+32} 180,${groundY-20} ${px[0]},${groundY-8} C ${px[0]+80},${groundY+12} ${px[1]-80},${groundY-22} ${px[1]},${groundY-8} C ${px[1]+80},${groundY+10} 810,${groundY+18} ${roadEnd.x},${roadEnd.y}`;
  } else {
    pathD = `M ${roadStart.x},${roadStart.y} C 120,${groundY+30} 140,${groundY-18} ${px[0]},${groundY-8} C ${px[0]+90},${groundY+12} ${px[1]-90},${groundY-22} ${px[1]},${groundY-8} C ${px[1]+90},${groundY+8} ${px[2]-90},${groundY-28} ${px[2]},${groundY-8} C ${px[2]+70},${groundY+12} 840,${groundY+18} ${roadEnd.x},${roadEnd.y}`;
  }

  // Building renderer based on checkpoint index (0→cottage, 1→tower, 2→castle)
  // But if only 1 checkpoint, always render as castle (final goal)
  // If 2 checkpoints: cottage + castle
  // If 3 checkpoints: cottage + tower + castle
  const buildingFns = count === 1
    ? [castle]
    : count === 2
      ? [cottage, castle]
      : [cottage, tower, castle];

  // Scale buildings slightly bigger when fewer are shown
  const bScale = count === 1 ? 1.2 : count === 2 ? 1.1 : 1.0;

  // Segment path strings for completed glow
  const segPaths = count === 1
    ? [`M ${roadStart.x},${roadStart.y} C 200,${groundY+35} 350,${groundY-30} ${px[0]},${groundY-8}`]
    : count === 2
      ? [
          `M ${roadStart.x},${roadStart.y} C 130,${groundY+32} 180,${groundY-20} ${px[0]},${groundY-8}`,
          `M ${px[0]},${groundY-8} C ${px[0]+80},${groundY+12} ${px[1]-80},${groundY-22} ${px[1]},${groundY-8}`,
        ]
      : [
          `M ${roadStart.x},${roadStart.y} C 120,${groundY+30} 140,${groundY-18} ${px[0]},${groundY-8}`,
          `M ${px[0]},${groundY-8} C ${px[0]+90},${groundY+12} ${px[1]-90},${groundY-22} ${px[1]},${groundY-8}`,
          `M ${px[1]},${groundY-8} C ${px[1]+90},${groundY+8} ${px[2]-90},${groundY-28} ${px[2]},${groundY-8}`,
        ];

  const badgeOffsets = count === 1 ? [-90] : count === 2 ? [-75,-95] : [-72,-82,-105];

  const VTOP = 60; // extra sky above y=0 so tall buildings aren't clipped
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -${VTOP} ${W} ${H+VTOP}" overflow="visible" id="roadmap-${config.animKey ?? 'main'}">
${sharedStyles()}
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#93d5f5"/><stop offset="70%" stop-color="#c8eeff"/><stop offset="100%" stop-color="#d8f4ff"/>
  </linearGradient>
  <linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#6dbf45"/><stop offset="100%" stop-color="#4e9e2a"/>
  </linearGradient>
  <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f5d98e"/><stop offset="100%" stop-color="#e4be5a"/>
  </linearGradient>
  <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="shadow"><feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#00000028"/></filter>
  <filter id="rmwh" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 0 2.8" result="mask"/>
    <feComposite in="SourceGraphic" in2="mask" operator="in"/>
  </filter>
  <path id="road-path-d" d="${pathD}"/>
</defs>

<!-- Sky (extended upward to cover VTOP area) -->
<rect y="-${VTOP}" width="${W}" height="${H+VTOP}" fill="url(#sky)" rx="14"/>

<!-- Sun -->
<circle cx="840" cy="36" r="28" fill="#ffe066" opacity="0.92" filter="url(#glow)"/>
<circle cx="840" cy="36" r="22" fill="#ffd700"/>
<!-- Sun rays -->
${[0,45,90,135,180,225,270,315].map(a => {
  const rad = a * Math.PI/180;
  const x1 = 840 + Math.cos(rad)*27, y1 = 36 + Math.sin(rad)*27;
  const x2 = 840 + Math.cos(rad)*38, y2 = 36 + Math.sin(rad)*38;
  return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#ffd700" stroke-width="2.5" opacity="0.6"/>`;
}).join('')}

<!-- Clouds -->
${cloud(100,30,0.95)} ${cloud(340,22,0.78)} ${cloud(560,32,0.85)} ${cloud(720,18,0.65)}

<!-- Mountains (background) -->
<polygon points="480,${groundY-12} 585,${groundY-100} 690,${groundY-12}" fill="#c2d4e8" opacity="0.55"/>
<polygon points="600,${groundY-12} 730,${groundY-122} 850,${groundY-12}" fill="#b0c6d8" opacity="0.5"/>
<polygon points="585,${groundY-100} 605,${groundY-80} 565,${groundY-80}" fill="white" opacity="0.82"/>
<polygon points="730,${groundY-122} 752,${groundY-98} 708,${groundY-98}" fill="white" opacity="0.78"/>

<!-- Ground -->
<rect x="0" y="${groundY+22}" width="${W}" height="${H-groundY-22}" fill="url(#gnd)"/>
<ellipse cx="450" cy="${groundY+22}" rx="510" ry="24" fill="#6dbf45"/>

<!-- Background trees -->
${[80,150,660,730,800].map(x => pineTree(x, groundY+22, 0.72 + Math.random()*0.12, x > 400)).join('')}

<!-- Road shadow -->
<path d="${pathD}" fill="none" stroke="#a07828" stroke-width="36" stroke-linecap="round" opacity="0.35"/>
<!-- Road -->
<path d="${pathD}" fill="none" stroke="#c8a040" stroke-width="34" stroke-linecap="round"/>
<path d="${pathD}" fill="none" stroke="url(#road)" stroke-width="28" stroke-linecap="round"/>
<!-- Road centre dashes -->
<path d="${pathD}" fill="none" stroke="white" stroke-width="2" stroke-dasharray="20,16" opacity="0.45"/>
<!-- Road edge lines -->
<path d="${pathD}" fill="none" stroke="#d4a840" stroke-width="1.5" stroke-dasharray="4,8" opacity="0.6"/>

<!-- Completed road glows -->
${cps.map((cp, i) => cp.isCompleted && segPaths[i]
  ? `<path d="${segPaths[i]}" fill="none" stroke="#4ade80" stroke-width="7" stroke-linecap="round" opacity="0.85" class="path-glow"/>`
  : ''
).join('')}

<!-- Foreground bushes & flowers -->
${[230,310,530,600,780].map((x, i) => `<ellipse cx="${x}" cy="${groundY+26}" rx="${14+i%3*4}" ry="${9+i%2*3}" fill="#3d8f22" opacity="0.8"/>`).join('')}
${[160,400,560,740].map(x => `<circle cx="${x}" cy="${groundY+18}" r="3" fill="#f472b6" opacity="0.8"/>`).join('')}
${[200,450,580,760].map(x => `<circle cx="${x}" cy="${groundY+16}" r="2.5" fill="#fbbf24" opacity="0.8"/>`).join('')}

<!-- Buildings with level badges and labels -->
${cps.map((cp, i) => {
  const x = px[i];
  const bFn = buildingFns[i];
  const levelNum = i + 1;
  const badgeY = groundY + badgeOffsets[i] - 8;
  const labelY = groundY + 12;
  const isCelebrating = celebrating === cp.id;
  return `
<g id="cp-${cp.id}" class="${isCelebrating ? 'building-pop' : 'building-idle'}">
  ${bFn(x, groundY - 10, cp.isCompleted, levelNum, bScale)}
  ${levelBadge(x, badgeY, levelNum, cp.isCompleted)}
  ${levelLabel(x, labelY, levelNum, cp.label, cp.isCompleted)}
</g>
${isCelebrating ? celebrationBurst(x, groundY - 80) : ''}`;
}).join('')}

<!-- Player -->
<g id="player" class="${celebrating ? 'player-spin' : 'player-bob'}">
  <animateMotion dur="${prevPct !== curPct ? '1.4s' : '0.001s'}" fill="freeze"
    keyPoints="${prevPct.toFixed(4)};${curPct.toFixed(4)}" keyTimes="0;1"
    calcMode="spline" keySplines="0.25 0.46 0.45 0.94">
    <mpath href="#road-path-d"/>
  </animateMotion>
  <circle cx="0" cy="0" r="10" fill="#fef08a" opacity="${prevPct !== curPct ? 0.5 : 0}">
    <animate attributeName="r" values="10;24;10" dur="1.4s" repeatCount="1"/>
    <animate attributeName="opacity" values="0.5;0;0" dur="1.4s" fill="freeze" repeatCount="1"/>
  </circle>
  <circle cx="0" cy="0" r="15" fill="${curPct > 0 ? '#fbbf24' : '#d1d5db'}" stroke="white" stroke-width="3" filter="url(#shadow)"/>
  <text x="0" y="5" font-size="17" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${curPct > 0 ? '⭐' : '🌱'}</text>
</g>

</svg>`;
}

// ─── MOBILE LAYOUT ────────────────────────────────────────────────────────────
function generateMobileRoadmap(config: RoadmapConfig): string {
  const W = 360, H = 400;
  const cps = config.checkpoints;
  const count = cps.length;
  const cx = W / 2;

  const POSITIONS: Record<number, number[]> = {
    1: [150],
    2: [295, 130],
    3: [310, 200, 95],
  };
  const py = POSITIONS[count] ?? POSITIONS[3];

  const totalDone = cps.reduce((s, c) => s + c.completed, 0);
  const totalAll  = cps.reduce((s, c) => s + c.total, 0);
  const curPct    = totalAll > 0 ? totalDone / totalAll : 0;
  const prevPct   = config.prevPlayerPct ?? curPct;
  const celebrating = config.celebrateCheckpoint;

  let pathD: string;
  if (count === 1) {
    pathD = `M ${cx-20},${H-15} C ${cx+50},${H-60} ${cx+40},${py[0]+60} ${cx+30},${py[0]} C ${cx+20},${py[0]-40} ${cx-10},30 ${cx},20`;
  } else if (count === 2) {
    pathD = `M ${cx-20},${H-15} C ${cx+60},${H-50} ${cx+50},${py[0]+50} ${cx+40},${py[0]} C ${cx+30},${py[0]-40} ${cx-50},${py[1]+40} ${cx-35},${py[1]} C ${cx-20},${py[1]-30} ${cx+10},30 ${cx},20`;
  } else {
    pathD = `M ${cx-30},${H-15} C ${cx-60},${H-60} ${cx+60},${H-80} ${cx+35},${py[0]} C ${cx+60},${py[0]-30} ${cx-60},${py[1]+30} ${cx-30},${py[1]} C ${cx-60},${py[1]-30} ${cx+60},${py[2]+30} ${cx+30},${py[2]} C ${cx+20},${py[2]-20} ${cx},20 ${cx},20`;
  }

  const buildingFns = count === 1 ? [castle] : count === 2 ? [cottage, castle] : [cottage, tower, castle];
  const bxOffsets   = count === 1 ? [0] : count === 2 ? [40, -30] : [38, -32, 28];
  const bScale      = count === 1 ? 0.95 : count === 2 ? 0.88 : 0.78;
  const badgeOffsetsY = count === 1 ? [-70] : count === 2 ? [-68,-88] : [-60,-72,-88];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" overflow="visible" id="roadmap-m-${config.animKey ?? 'main'}">
${sharedStyles()}
<defs>
  <linearGradient id="sky-m" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#93d5f5"/><stop offset="65%" stop-color="#c8eeff"/><stop offset="100%" stop-color="#c0f0a0"/>
  </linearGradient>
  <linearGradient id="road-m" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#f5d98e"/><stop offset="100%" stop-color="#e4be5a"/>
  </linearGradient>
  <filter id="glow-m"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="shad-m"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#00000028"/></filter>
  <filter id="rmwh" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 0 2.8" result="mask"/>
    <feComposite in="SourceGraphic" in2="mask" operator="in"/>
  </filter>
  <path id="road-path-m" d="${pathD}"/>
</defs>

<rect width="${W}" height="${H}" fill="url(#sky-m)" rx="14"/>
<circle cx="310" cy="32" r="24" fill="#ffe066" opacity="0.9" filter="url(#glow-m)"/>
<circle cx="310" cy="32" r="18" fill="#ffd700"/>
${cloud(55,28,0.72)} ${cloud(175,16,0.60)} ${cloud(248,40,0.65)}
<polygon points="30,${H-55} 105,${H-175} 180,${H-55}" fill="#c9d6e3" opacity="0.5"/>
<polygon points="175,${H-55} 265,${H-195} 340,${H-55}" fill="#b5c8d8" opacity="0.48"/>
<polygon points="105,${H-175} 125,${H-150} 85,${H-150}" fill="white" opacity="0.8"/>
<polygon points="265,${H-195} 285,${H-168} 245,${H-168}" fill="white" opacity="0.75"/>
<rect x="0" y="${H-52}" width="${W}" height="52" fill="#6dbf45"/>
<ellipse cx="${cx}" cy="${H-52}" rx="220" ry="20" fill="#6dbf45"/>

<path d="${pathD}" fill="none" stroke="#a07828" stroke-width="30" stroke-linecap="round" opacity="0.3"/>
<path d="${pathD}" fill="none" stroke="#c8a040" stroke-width="28" stroke-linecap="round"/>
<path d="${pathD}" fill="none" stroke="url(#road-m)" stroke-width="22" stroke-linecap="round"/>
<path d="${pathD}" fill="none" stroke="white" stroke-width="1.5" stroke-dasharray="14,12" opacity="0.4"/>

${[60,130,220,290].map((x, i) => pineTree(x, H-52, 0.65 + (i%2)*0.1, i>1)).join('')}
${[90,180,250,310].map(x=>`<ellipse cx="${x}" cy="${H-56}" rx="12" ry="7" fill="#3d8f22" opacity="0.8"/>`).join('')}

${cps.map((cp, i) => {
  const bx = cx + bxOffsets[i];
  const by = py[i];
  const bFn = buildingFns[i];
  const levelNum = i + 1;
  const badgeY = by + badgeOffsetsY[i];
  const labelY = by + 18;
  const isCelebrating = celebrating === cp.id;
  return `
<g id="cp-m-${cp.id}" class="${isCelebrating ? 'building-pop' : 'building-idle'}">
  ${bFn(bx, by, cp.isCompleted, levelNum, bScale)}
  ${levelBadge(bx, badgeY, levelNum, cp.isCompleted)}
  ${levelLabel(bx, labelY, levelNum, cp.label, cp.isCompleted)}
</g>
${isCelebrating ? celebrationBurst(bx, by - 65) : ''}`;
}).join('')}

<g id="player-m" class="${celebrating ? 'player-spin' : 'player-bob'}">
  <animateMotion dur="${prevPct !== curPct ? '1.4s' : '0.001s'}" fill="freeze"
    keyPoints="${prevPct.toFixed(4)};${curPct.toFixed(4)}" keyTimes="0;1"
    calcMode="spline" keySplines="0.25 0.46 0.45 0.94">
    <mpath href="#road-path-m"/>
  </animateMotion>
  <circle cx="0" cy="0" r="10" fill="#fef08a" opacity="${prevPct !== curPct ? 0.5 : 0}">
    <animate attributeName="r" values="10;24;10" dur="1.4s" repeatCount="1"/>
    <animate attributeName="opacity" values="0.5;0;0" dur="1.4s" fill="freeze" repeatCount="1"/>
  </circle>
  <circle cx="0" cy="0" r="15" fill="${curPct > 0 ? '#fbbf24' : '#d1d5db'}" stroke="white" stroke-width="3" filter="url(#shad-m)"/>
  <text x="0" y="5" font-size="17" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${curPct > 0 ? '⭐' : '🌱'}</text>
</g>

</svg>`;
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export function roadmapToDataURI(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
