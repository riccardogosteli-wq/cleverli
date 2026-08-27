#!/usr/bin/env ts-node
/**
 * lp21-gap-analysis.ts
 *
 * LP21 API Gap Analysis Script for Cleverli
 * ==========================================
 * 
 * PURPOSE:
 * Fetch official LP21 competency data (Kompetenzstufen) per grade/subject,
 * map against existing Cleverli exercises, and output a gap report.
 * 
 * LP21 CYCLE STRUCTURE:
 * ┌─────────────────────────────────────────────────────┐
 * │ Zyklus 1: Kindergarten + Grades 1–2  (ages 4–8)    │
 * │ Zyklus 2: Grades 3–6                 (ages 8–12)   │
 * │ Zyklus 3: Grades 7–9 (Sekundar)      (ages 12–15) │  ← not Cleverli scope
 * └─────────────────────────────────────────────────────┘
 * 
 * PARENT-FRIENDLY LABELS (from lehrplan21.ch parent docs):
 * - Zyklus 1 → "Kindergarten & 1.–2. Klasse"
 * - Zyklus 2 → "3.–6. Klasse (Mittelstufe)"
 * 
 * API: http://api.lehrplan.ch  (password-protected, requires BKZ agreement)
 * Credentials: set LP21_API_USER and LP21_API_PASS env vars
 * 
 * USAGE:
 *   LP21_API_USER=xxx LP21_API_PASS=yyy npx ts-node scripts/lp21-gap-analysis.ts
 *   
 *   # Dry run with mock data (no credentials needed):
 *   DRY_RUN=1 npx ts-node scripts/lp21-gap-analysis.ts
 * 
 * OUTPUT:
 *   - Console: gap report per grade/subject
 *   - File: scripts/lp21-gap-report-YYYY-MM-DD.json
 */

import * as fs from "fs";
import * as path from "path";

// Use process.cwd() (project root) as base
const PROJECT_ROOT = process.cwd();

// ── Config ────────────────────────────────────────────────────────────────────
const API_BASE = "http://api.lehrplan.ch";
const API_USER = process.env.LP21_API_USER ?? "";
const API_PASS = process.env.LP21_API_PASS ?? "";
const DRY_RUN  = process.env.DRY_RUN === "1";
const LANG     = "DE"; // DE | FR | IT

// ── LP21 Cycle mapping ────────────────────────────────────────────────────────
const CYCLE_MAP: Record<number, { cycle: number; cycleLabel: string; cycleParentLabel: string }> = {
  1: { cycle: 1, cycleLabel: "Zyklus 1", cycleParentLabel: "Kindergarten & 1.–2. Klasse" },
  2: { cycle: 1, cycleLabel: "Zyklus 1", cycleParentLabel: "Kindergarten & 1.–2. Klasse" },
  3: { cycle: 2, cycleLabel: "Zyklus 2", cycleParentLabel: "3.–6. Klasse (Mittelstufe)" },
  4: { cycle: 2, cycleLabel: "Zyklus 2", cycleParentLabel: "3.–6. Klasse (Mittelstufe)" },
  5: { cycle: 2, cycleLabel: "Zyklus 2", cycleParentLabel: "3.–6. Klasse (Mittelstufe)" },
  6: { cycle: 2, cycleLabel: "Zyklus 2", cycleParentLabel: "3.–6. Klasse (Mittelstufe)" },
};

// ── LP21 Subject ID mapping (from API docs) ───────────────────────────────────
// These map Cleverli subject IDs to LP21 Fachbereich codes
const SUBJECT_MAP: Record<string, { lp21Code: string; lp21Name: string }> = {
  math:    { lp21Code: "MA", lp21Name: "Mathematik" },
  german:  { lp21Code: "D",  lp21Name: "Deutsch" },
  science: { lp21Code: "NMG", lp21Name: "Natur, Mensch, Gesellschaft" },
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface LP21Kompetenz {
  uid: string;
  code: string;
  bezeichnung: string;
  zyklus: number;
  stufe: string; // e.g. "1a", "1b", "2a"
  fachbereich: string;
}

interface CleverliTopic {
  id: string;
  title: string;
  exerciseCount: number;
  grade: number;
  subject: string;
}

interface GapReport {
  grade: number;
  subject: string;
  cycleLabel: string;
  cycleParentLabel: string;
  lp21Kompetenzen: LP21Kompetenz[];
  cleverliTopics: CleverliTopic[];
  coverage: number; // 0–100%
  gaps: string[]; // LP21 codes not covered
  suggestions: string[]; // Recommended new topics to add
}

// ── API Client ────────────────────────────────────────────────────────────────
// Auth: GET params user= + password= (Basic Auth does NOT work on this API)
const API_BASE_URL = "https://api.lehrplan.ch";
const KANTON = "AG"; // Use Aargau as reference canton

async function fetchLP21UID(uid: string): Promise<Record<string, unknown> | null> {
  if (DRY_RUN) {
    console.log(`[DRY_RUN] Would fetch UID: ${uid}`);
    return null;
  }
  const url = `${API_BASE_URL}/getData.php?kanton=${KANTON}&uid=${uid}&user=${encodeURIComponent(API_USER)}&password=${encodeURIComponent(API_PASS)}&sprache=${LANG}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 Cleverli LP21 client",
    },
  });
  if (!res.ok) throw new Error(`LP21 API error: ${res.status} ${res.statusText}`);
  const json = await res.json() as { lp21?: unknown[] };
  return (json.lp21?.[0] ?? null) as Record<string, unknown> | null;
}

// Recursively fetch all Kompetenzstufen under a UID
async function fetchAllChildren(uid: string, depth = 0): Promise<Record<string, unknown>[]> {
  if (depth > 8) return []; // safety limit
  const node = await fetchLP21UID(uid);
  if (!node) return [];
  const results: Record<string, unknown>[] = [node];
  const children = (node.hierarchie_unten as string[] | undefined) ?? [];
  for (const childUrl of children) {
    const childUid = childUrl.split("uid=")[1]?.split("&")[0];
    if (childUid) {
      const childNodes = await fetchAllChildren(childUid, depth + 1);
      results.push(...childNodes);
    }
  }
  return results;
}

// Fetch root and find Fachbereich UIDs
async function fetchFachbereiche(): Promise<unknown[]> {
  const root = await fetchLP21UID("00000000000000000000000000000000");
  if (!root) return MOCK_FACHBEREICHE;
  const children = (root.hierarchie_unten as string[] | undefined) ?? [];
  const fachbereiche = [];
  for (const url of children) {
    const uid = url.split("uid=")[1]?.split("&")[0];
    if (uid) {
      const fb = await fetchLP21UID(uid);
      if (fb) fachbereiche.push(fb);
    }
  }
  return fachbereiche;
}

// Fetch Kompetenzen for a specific Fachbereich and Zyklus
// Uses real LP21 tree traversal: root → Fachbereich → Fach → Kompetenzbereich → Kompetenz → Stufen
async function fetchKompetenzen(fachCode: string, zyklus: number): Promise<LP21Kompetenz[]> {
  if (DRY_RUN) return getMockKompetenzen(fachCode, zyklus);

  try {
    // Get root, then find matching Fachbereich by code
    const root = await fetchLP21UID("00000000000000000000000000000000");
    if (!root) return getMockKompetenzen(fachCode, zyklus);

    const fbUrls = (root.hierarchie_unten as string[] | undefined) ?? [];
    let targetFbUid: string | null = null;

    for (const url of fbUrls) {
      const uid = url.split("uid=")[1]?.split("&")[0];
      if (!uid) continue;
      const fb = await fetchLP21UID(uid);
      if (fb && (fb.code as string) === fachCode) {
        targetFbUid = uid;
        break;
      }
    }

    if (!targetFbUid) return getMockKompetenzen(fachCode, zyklus);

    // Recursively fetch all descendants — these are Kompetenzstufen
    const allNodes = await fetchAllChildren(targetFbUid);

    // Filter for Kompetenzstufen (strukturtyp == "Kompetenzstufe")
    // and map zyklus_von/zyklus_bis to filter by requested Zyklus
    const kompetenzen: LP21Kompetenz[] = [];
    for (const node of allNodes) {
      if (node.strukturtyp !== "Kompetenzstufe") continue;

      // zyklus filtering: node may have zyklus_von / zyklus_bis fields
      const zyklusBez = String(node.zyklus_bezeichnung ?? node.zyklus ?? "");
      const nodeZyklus = zyklusBez.includes("1") ? 1 : zyklusBez.includes("2") ? 2 : 0;
      if (nodeZyklus !== 0 && nodeZyklus !== zyklus) continue;

      kompetenzen.push({
        uid: String(node.uid ?? ""),
        code: String(node.code ?? node.uid ?? ""),
        bezeichnung: String(node.bezeichnung ?? node.title ?? ""),
        zyklus,
        stufe: String(node.stufe ?? node.folge ?? ""),
        fachbereich: fachCode,
      });
    }

    return kompetenzen.length > 0 ? kompetenzen : getMockKompetenzen(fachCode, zyklus);
  } catch {
    return getMockKompetenzen(fachCode, zyklus);
  }
}

// ── Load Cleverli exercises ───────────────────────────────────────────────────
function loadCleverliTopics(grade: number, subject: string): CleverliTopic[] {
  const dataPath = path.resolve(PROJECT_ROOT, `src/data/grade${grade}/${subject}.ts`);
  
  if (!fs.existsSync(dataPath)) {
    console.warn(`  ⚠️  No data file: ${dataPath}`);
    return [];
  }
  
  const content = fs.readFileSync(dataPath, "utf8");
  
  // Extract topic IDs and titles from the TypeScript source
  const topicMatches = content.matchAll(/id:\s*["']([^"']+)["'][\s\S]*?title:\s*["']([^"']+)["'][\s\S]*?exercises:\s*\[([^\]]*(?:\[[^\]]*\][^\]]*)*)\]/g);
  
  const topics: CleverliTopic[] = [];
  for (const match of topicMatches) {
    const exerciseCount = (match[3].match(/id:/g) ?? []).length;
    topics.push({
      id: match[1],
      title: match[2],
      exerciseCount,
      grade,
      subject,
    });
  }
  
  return topics;
}

// ── Gap Analysis ──────────────────────────────────────────────────────────────
function analyzeGaps(
  lp21: LP21Kompetenz[],
  topics: CleverliTopic[],
  grade: number,
  subject: string
): GapReport {
  const cycleInfo = CYCLE_MAP[grade];
  const topicIds = topics.map(t => t.id.toLowerCase());
  
  // Check which LP21 competencies have matching Cleverli topics
  // Simple heuristic: look for keyword overlap between competency description and topic ID/title
  const covered = new Set<string>();
  const gaps: string[] = [];
  
  for (const komp of lp21) {
    const keywords = komp.bezeichnung.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const isCovered = topicIds.some(id => 
      keywords.some(kw => id.includes(kw.substring(0, 6)))
    );
    
    if (isCovered) {
      covered.add(komp.code);
    } else {
      gaps.push(`${komp.code}: ${komp.bezeichnung.substring(0, 60)}...`);
    }
  }
  
  const coverage = lp21.length > 0 
    ? Math.round((covered.size / lp21.length) * 100) 
    : 0;
  
  // Generate suggestions for gaps
  const suggestions = gaps.slice(0, 5).map(gap => {
    const code = gap.split(":")[0];
    return `Add topic for LP21 ${code}`;
  });
  
  return {
    grade,
    subject,
    cycleLabel: cycleInfo.cycleLabel,
    cycleParentLabel: cycleInfo.cycleParentLabel,
    lp21Kompetenzen: lp21,
    cleverliTopics: topics,
    coverage,
    gaps,
    suggestions,
  };
}

// ── Print Report ──────────────────────────────────────────────────────────────
function printReport(reports: GapReport[]) {
  console.log("\n" + "=".repeat(70));
  console.log("  CLEVERLI × LP21 GAP ANALYSIS REPORT");
  console.log("  Generated:", new Date().toISOString());
  console.log("=".repeat(70));
  
  // Group by cycle
  const byCycle = new Map<string, GapReport[]>();
  for (const r of reports) {
    const key = r.cycleLabel;
    if (!byCycle.has(key)) byCycle.set(key, []);
    byCycle.get(key)!.push(r);
  }
  
  for (const [cycle, cycleReports] of byCycle) {
    const parentLabel = cycleReports[0].cycleParentLabel;
    console.log(`\n📚 ${cycle} — ${parentLabel}`);
    console.log("-".repeat(50));
    
    for (const r of cycleReports) {
      const bar = "█".repeat(Math.round(r.coverage / 10)) + "░".repeat(10 - Math.round(r.coverage / 10));
      const emoji = r.coverage >= 80 ? "✅" : r.coverage >= 50 ? "🟡" : "🔴";
      
      console.log(`\n  ${emoji} Grade ${r.grade} / ${r.subject.toUpperCase()}`);
      console.log(`     Coverage: ${bar} ${r.coverage}%`);
      console.log(`     LP21 Kompetenzen: ${r.lp21Kompetenzen.length}`);
      console.log(`     Cleverli Topics:  ${r.cleverliTopics.length} (${r.cleverliTopics.reduce((s, t) => s + t.exerciseCount, 0)} exercises)`);
      
      if (r.gaps.length > 0) {
        console.log(`     Gaps (${r.gaps.length}):`);
        r.gaps.slice(0, 3).forEach(g => console.log(`       • ${g}`));
        if (r.gaps.length > 3) console.log(`       … and ${r.gaps.length - 3} more`);
      }
    }
  }
  
  // Summary
  const totalLp21 = reports.reduce((s, r) => s + r.lp21Kompetenzen.length, 0);
  const totalTopics = reports.reduce((s, r) => s + r.cleverliTopics.length, 0);
  const totalExercises = reports.reduce((s, r) => s + r.cleverliTopics.reduce((ss, t) => ss + t.exerciseCount, 0), 0);
  const avgCoverage = Math.round(reports.reduce((s, r) => s + r.coverage, 0) / reports.length);
  
  console.log("\n" + "=".repeat(70));
  console.log("  SUMMARY");
  console.log("=".repeat(70));
  console.log(`  LP21 Kompetenzen mapped: ${totalLp21}`);
  console.log(`  Cleverli topics:         ${totalTopics}`);
  console.log(`  Cleverli exercises:      ${totalExercises}`);
  console.log(`  Average coverage:        ${avgCoverage}%`);
  
  const worstGrades = reports
    .sort((a, b) => a.coverage - b.coverage)
    .slice(0, 3);
  
  console.log("\n  🔴 Priority areas to improve:");
  worstGrades.forEach(r => {
    console.log(`     Grade ${r.grade} / ${r.subject}: ${r.coverage}% coverage`);
    r.suggestions.slice(0, 2).forEach(s => console.log(`       → ${s}`));
  });
  console.log("=".repeat(70) + "\n");
}

// ── Mock Data (for DRY_RUN / testing before API credentials) ──────────────────
const MOCK_FACHBEREICHE = [
  { code: "MA", bezeichnung: "Mathematik" },
  { code: "D",  bezeichnung: "Deutsch" },
  { code: "NMG",bezeichnung: "Natur, Mensch, Gesellschaft" },
];

function getMockKompetenzen(fachCode: string, zyklus: number): LP21Kompetenz[] {
  const base: Record<string, string[][]> = {
    MA: [
      ["MA.1.A.1", "Zahlen und Zählen verstehen", "1a"],
      ["MA.1.A.2", "Zahlen bis 100 lesen und schreiben", "1b"],
      ["MA.1.B.1", "Addition und Subtraktion im Zahlenraum bis 20", "1c"],
      ["MA.1.B.2", "Multiplikation und Division einführen", "2a"],
      ["MA.1.C.1", "Geometrische Formen erkennen und benennen", "1a"],
      ["MA.1.D.1", "Messen und Schätzen (Länge, Gewicht, Zeit)", "2a"],
      ["MA.2.A.1", "Natürliche Zahlen bis 1 Million", "2b"],
      ["MA.2.B.1", "Schriftliche Rechenverfahren anwenden", "2c"],
      ["MA.2.C.1", "Brüche und Dezimalzahlen verstehen", "3a"],
      ["MA.3.A.1", "Proportionale Zusammenhänge erkennen", "3b"],
    ],
    D: [
      ["D.1.A.1",  "Buchstaben und Laute kennen", "1a"],
      ["D.1.B.1",  "Einfache Texte lesen und verstehen", "1b"],
      ["D.1.C.1",  "Wörter korrekt schreiben (Rechtschreibung)", "1c"],
      ["D.2.A.1",  "Grammatik: Wortarten bestimmen", "2a"],
      ["D.2.B.1",  "Texte verfassen und überarbeiten", "2b"],
      ["D.2.C.1",  "Satzstrukturen verstehen", "2c"],
      ["D.3.A.1",  "Literarische Texte lesen und interpretieren", "3a"],
    ],
    NMG: [
      ["NMG.1.1",  "Tiere und Pflanzen in der Umgebung beobachten", "1a"],
      ["NMG.2.1",  "Den eigenen Körper kennen und beschreiben", "1b"],
      ["NMG.3.1",  "Jahreszeiten und Wetter erleben", "1c"],
      ["NMG.4.1",  "Familie, Gemeinschaft und soziales Umfeld", "2a"],
      ["NMG.5.1",  "Räume und Orte erkunden (Schweiz, Welt)", "2b"],
      ["NMG.6.1",  "Zeit und Geschichte verstehen", "2c"],
      ["NMG.7.1",  "Wirtschaft und Konsum verstehen", "3a"],
      ["NMG.8.1",  "Phänomene der Natur untersuchen", "3b"],
    ],
  };
  
  const items = base[fachCode] ?? [];
  return items
    .filter((_, i) => zyklus === 1 ? i < 5 : i >= 3)
    .map(([code, bezeichnung, stufe]) => ({
      uid: code.replace(/\./g, "-"),
      code,
      bezeichnung,
      zyklus,
      stufe,
      fachbereich: fachCode,
    }));
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🔍 Cleverli × LP21 Gap Analysis");
  
  if (DRY_RUN) {
    console.log("   Mode: DRY RUN (mock data — set LP21_API_USER/PASS for real data)");
  } else if (!API_USER || !API_PASS) {
    console.error("❌ Error: Set LP21_API_USER and LP21_API_PASS environment variables");
    console.error("   Or run with DRY_RUN=1 for mock data");
    process.exit(1);
  } else {
    console.log("   Mode: LIVE (connecting to api.lehrplan.ch)");
  }
  
  const grades = [1, 2, 3, 4, 5, 6];
  const subjects = ["math", "german", "science"];
  const reports: GapReport[] = [];
  
  for (const grade of grades) {
    const cycleInfo = CYCLE_MAP[grade];
    console.log(`\n📖 Processing Grade ${grade} (${cycleInfo.cycleLabel})...`);
    
    for (const subject of subjects) {
      const subjectInfo = SUBJECT_MAP[subject];
      process.stdout.write(`   ${subjectInfo.lp21Name}... `);
      
      try {
        // Fetch LP21 competencies for this subject + cycle
        const kompetenzen = await fetchKompetenzen(subjectInfo.lp21Code, cycleInfo.cycle);
        
        // Load existing Cleverli topics
        const topics = loadCleverliTopics(grade, subject);
        
        // Analyze gaps
        const report = analyzeGaps(kompetenzen, topics, grade, subject);
        reports.push(report);
        
        console.log(`${kompetenzen.length} LP21 kompetenzen, ${topics.length} topics → ${report.coverage}% coverage`);
      } catch (err) {
        console.error(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }
  
  // Print report
  printReport(reports);
  
  // Save JSON report
  const outputPath = path.resolve(
    __dirname,
    `lp21-gap-report-${new Date().toISOString().split("T")[0]}.json`
  );
  fs.writeFileSync(outputPath, JSON.stringify(reports, null, 2));
  console.log(`📄 Full report saved to: ${outputPath}\n`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
