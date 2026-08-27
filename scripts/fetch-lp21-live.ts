import { writeFileSync } from "node:fs";

const API_BASE = "https://api.lehrplan.ch/getData.php";
const ROOT_UID = "00000000000000000000000000000000";
const TARGET_CODES = new Set(["D", "FS1E", "FS2F", "MA", "NMG", "MI"]);
const API_USER = process.env.LP21_API_USER ?? "";
const API_PASS = process.env.LP21_API_PASS ?? "";
const OUTPUT = process.env.LP21_API_OUTPUT ?? "/tmp/cleverli-lp21-live.json";
const CONCURRENCY = 6;

type ApiNode = Record<string, unknown> & {
  uid?: string;
  code?: string;
  bezeichnung?: string;
  strukturtyp?: string;
  hierarchie_unten?: string[];
};

if (!API_USER || !API_PASS) {
  throw new Error("Set LP21_API_USER and LP21_API_PASS before fetching the live LP21 tree.");
}

function childUid(url: string): string | null {
  return new URL(url).searchParams.get("uid");
}

async function fetchNode(uid: string, attempt = 1): Promise<ApiNode> {
  const url = new URL(API_BASE);
  url.searchParams.set("kanton", "AG");
  url.searchParams.set("uid", uid);
  url.searchParams.set("user", API_USER);
  url.searchParams.set("password", API_PASS);
  url.searchParams.set("sprache", "DE");
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 Cleverli LP21 client",
    },
  });
  if (!response.ok) {
    if (attempt < 4 && (response.status === 429 || response.status >= 500)) {
      await new Promise((resolve) => setTimeout(resolve, 750 * attempt));
      return fetchNode(uid, attempt + 1);
    }
    throw new Error(`LP21 API ${response.status} for UID ${uid}`);
  }
  const payload = await response.json() as { lp21?: ApiNode[] };
  const node = payload.lp21?.[0];
  if (!node) throw new Error(`LP21 API returned no node for UID ${uid}`);
  return node;
}

async function mapConcurrent<T, R>(items: T[], worker: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]);
    }
  }));
  return results;
}

async function findTargetRoots(): Promise<ApiNode[]> {
  const root = await fetchNode(ROOT_UID);
  const firstLevel = await mapConcurrent(
    (root.hierarchie_unten ?? []).map(childUid).filter((uid): uid is string => Boolean(uid)),
    fetchNode,
  );
  const languageArea = firstLevel.find((node) => node.code === "SPR");
  if (!languageArea?.uid) throw new Error("LP21 language area SPR missing from API root.");
  const languages = await mapConcurrent(
    (languageArea.hierarchie_unten ?? []).map(childUid).filter((uid): uid is string => Boolean(uid)),
    fetchNode,
  );
  return [...firstLevel, ...languages].filter((node) => node.code && TARGET_CODES.has(node.code));
}

async function crawl(roots: ApiNode[]): Promise<Map<string, ApiNode>> {
  const nodes = new Map<string, ApiNode>();
  let frontier = roots;
  while (frontier.length) {
    for (const node of frontier) if (node.uid) nodes.set(node.uid, node);
    const unseen = [...new Set(frontier.flatMap((node) => node.hierarchie_unten ?? [])
      .map(childUid)
      .filter((uid): uid is string => uid !== null)
      .filter((uid) => !nodes.has(uid)))];
    frontier = await mapConcurrent(unseen, fetchNode);
  }
  return nodes;
}

async function main(): Promise<void> {
  const roots = await findTargetRoots();
  const nodes = await crawl(roots);
  const competencies = [...nodes.values()].filter((node) => node.strukturtyp === "Kompetenz").length;
  const stages = [...nodes.values()].filter((node) => node.strukturtyp === "Kompetenzstufe").length;
  const points = [...nodes.values()].filter((node) => node.strukturtyp === "Aufzaehlungspunkt").length;
  const snapshot = {
    source: API_BASE,
    canton: "AG",
    language: "DE",
    fetchedAt: new Date().toISOString(),
    rootCodes: roots.map((node) => node.code),
    nodes: Object.fromEntries([...nodes.entries()].sort(([a], [b]) => a.localeCompare(b))),
  };
  writeFileSync(OUTPUT, JSON.stringify(snapshot));
  console.log(JSON.stringify({ output: OUTPUT, nodes: nodes.size, competencies, stages, points, rootCodes: snapshot.rootCodes }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
