import { chromium, type BrowserContext, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { TOPIC_CATALOG } from "../src/data/topicCatalog.generated";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "https://www.cleverli.ch";
const RUN_DATE = "2026-08-28";
const OUTPUT_DIR = path.resolve(`.qa/responsive-audit-${RUN_DATE}`);
const AUTH_STATE = path.resolve("tests/.auth/state.json");

type AuditRoute = { path: string; name: string; guest?: boolean; group: string };
type Viewport = { name: string; width: number; height: number };
type LayoutResult = {
  title: string;
  pathname: string;
  documentWidth: number;
  viewportWidth: number;
  horizontalOverflow: boolean;
  outside: string[];
  clipped: string[];
  smallTargets: string[];
  fixedElements: string[];
};
type Finding = {
  severity: "high" | "medium" | "low";
  category: string;
  route: string;
  viewport: string;
  summary: string;
  samples?: string[];
  screenshot?: string;
};

const VIEWPORTS: Viewport[] = [
  { name: "iphone-se", width: 320, height: 568 },
  { name: "android", width: 360, height: 800 },
  { name: "iphone-14", width: 390, height: 844 },
  { name: "large-phone", width: 430, height: 932 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "tablet-landscape", width: 1024, height: 768 },
];

const CORE_ROUTES: AuditRoute[] = [
  { path: "/", name: "home", group: "public", guest: true },
  { path: "/login", name: "login", group: "auth", guest: true },
  { path: "/signup", name: "signup", group: "auth", guest: true },
  { path: "/reset-password", name: "reset-password", group: "auth", guest: true },
  { path: "/upgrade", name: "upgrade-guest", group: "commerce", guest: true },
  { path: "/shop", name: "shop-guest", group: "commerce", guest: true },
  { path: "/einmaleins-ueben", name: "einmaleins", group: "seo", guest: true },
  { path: "/lesen-lernen", name: "lesen", group: "seo", guest: true },
  { path: "/mathe-uebungen-kinder", name: "math-seo", group: "seo", guest: true },
  { path: "/deutsch-uebungen-kinder", name: "german-seo", group: "seo", guest: true },
  { path: "/primarschule-uebungen", name: "primary-seo", group: "seo", guest: true },
  { path: "/1x1-spiele", name: "times-table-games", group: "seo", guest: true },
  { path: "/blog/kinder-motivieren-zum-lernen", name: "blog", group: "seo", guest: true },
  { path: "/blog", name: "blog-index", group: "seo", guest: true },
  { path: "/mathe-uebungen-1-klasse", name: "grade-subject-seo", group: "seo", guest: true },
  { path: "/ads/primarschule", name: "ads-landing", group: "ads", guest: true },
  { path: "/agb", name: "terms", group: "legal", guest: true },
  { path: "/datenschutz", name: "privacy", group: "legal", guest: true },
  { path: "/impressum", name: "imprint", group: "legal", guest: true },
  { path: "/payment/cancel", name: "payment-cancel", group: "commerce", guest: true },
  { path: "/dashboard", name: "dashboard", group: "app" },
  { path: "/kids", name: "kids", group: "app" },
  { path: "/daily", name: "daily", group: "app" },
  { path: "/missionen", name: "missions", group: "app" },
  { path: "/trophies", name: "trophies", group: "app" },
  { path: "/rewards", name: "rewards", group: "app" },
  { path: "/shop", name: "shop", group: "app" },
  { path: "/family", name: "family", group: "app" },
  { path: "/parents", name: "parents", group: "app" },
  { path: "/account", name: "account", group: "app" },
  { path: "/upgrade", name: "upgrade", group: "commerce" },
  { path: "/learn/1/math", name: "subject-grade-1", group: "learning" },
  { path: "/learn/6/german", name: "subject-grade-6", group: "learning" },
];

const TOPIC_ROUTES: AuditRoute[] = Object.entries(TOPIC_CATALOG).flatMap(([key, topics]) => {
  const [grade, subject] = key.split("-");
  return topics.map((topic) => ({
    path: `/learn/${grade}/${subject}/${topic.id}`,
    name: `${grade}-${subject}-${topic.id}`,
    group: "topic",
  }));
});

const findings: Finding[] = [];
const routeResults: Array<Record<string, unknown>> = [];
let screenshotCount = 0;

function slug(value: string) {
  return value.replace(/^\//, "").replace(/[^a-zA-Z0-9-]+/g, "-").replace(/-+/g, "-") || "home";
}

async function seedProfile(context: BrowserContext) {
  await context.addInitScript(() => {
    const childId = "responsive-audit-child";
    localStorage.setItem("cleverli_active_profile", childId);
    localStorage.setItem("cleverli_last_grade", "1");
    localStorage.setItem("cleverli_family", JSON.stringify({
      children: [{ id: childId, name: "Testino", grade: 1, avatar: "🦊" }],
    }));
    localStorage.setItem(`cleverli_profile_${childId}`, JSON.stringify({
      id: childId,
      name: "Testino",
      grade: 1,
      avatar: "🦊",
      xp: 150,
      coins: 45,
      currentStreak: 3,
      totalExercises: 22,
      correctAnswers: 18,
      achievements: [],
      ownedItems: [],
      equippedItems: {},
    }));
  });
}

async function inspectLayout(page: Page, viewport: Viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.waitForTimeout(120);

  return page.evaluate<LayoutResult>(`(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const outside = [];
    const clipped = [];
    const smallTargets = [];
    const fixedElements = [];
    const describe = function (el) {
      const tag = el.tagName.toLowerCase();
      const id = el.id ? '#' + el.id : '';
      const classes = typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.')
        : '';
      const text = (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 90);
      return tag + id + classes + (text ? ' :: ' + text : '');
    };
    const visible = function (el, rect) {
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const insideHorizontalScroller = function (el) {
      let parent = el.parentElement;
      while (parent && parent !== document.body) {
        const style = getComputedStyle(parent);
        if (
          ['auto', 'scroll'].includes(style.overflowX) &&
          parent.scrollWidth > parent.clientWidth + 1
        ) return true;
        parent = parent.parentElement;
      }
      return false;
    };

    for (const el of Array.from(document.body.querySelectorAll('*'))) {
      if (['SCRIPT', 'STYLE', 'META', 'LINK', 'PATH'].includes(el.tagName)) continue;
      if (el.classList.contains('sr-only')) continue;
      const rect = el.getBoundingClientRect();
      if (!visible(el, rect)) continue;
      const style = getComputedStyle(el);
      if ((rect.left < -1 || rect.right > vw + 1) && !insideHorizontalScroller(el)) {
        if (outside.length < 12) outside.push(describe(el) + ' [' + Math.round(rect.left) + '..' + Math.round(rect.right) + ' / ' + vw + ']');
      }
      const text = (el.textContent || '').trim();
      if (text.length > 1 && el.scrollWidth > el.clientWidth + 2 && ['hidden', 'clip'].includes(style.overflowX)) {
        if (clipped.length < 12) clipped.push(describe(el));
      }
      if (style.position === 'fixed' || style.position === 'sticky') {
        if (fixedElements.length < 12) fixedElements.push(describe(el) + ' [top=' + Math.round(rect.top) + ', bottom=' + Math.round(rect.bottom) + ', vh=' + vh + ']');
      }
    }

    const targets = document.querySelectorAll("button, input, select, textarea, a, [role='button'], [role='link']");
    for (const el of Array.from(targets)) {
      if (el.classList.contains('sr-only')) continue;
      const rect = el.getBoundingClientRect();
      if (!visible(el, rect) || rect.bottom < 0 || rect.top > vh) continue;
      const style = getComputedStyle(el);
      const inlineTextLink = el.tagName === 'A' && style.display === 'inline' && rect.height < 28;
      if (!inlineTextLink && (rect.width < 44 || rect.height < 44)) {
        if (smallTargets.length < 16) smallTargets.push(describe(el) + ' [' + Math.round(rect.width) + 'x' + Math.round(rect.height) + ']');
      }
    }

    return {
      title: document.title,
      pathname: location.pathname,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: vw,
      horizontalOverflow: document.documentElement.scrollWidth > vw + 1,
      outside: outside,
      clipped: clipped,
      smallTargets: smallTargets,
      fixedElements: fixedElements,
    };
  })()`);
}

async function screenshot(page: Page, route: AuditRoute, viewport: Viewport, category: string) {
  if (screenshotCount >= 80) return undefined;
  const filename = `${viewport.name}--${slug(route.path)}--${category}.png`;
  const absolute = path.join(OUTPUT_DIR, "screenshots", filename);
  await page.screenshot({ path: absolute, fullPage: false });
  screenshotCount += 1;
  return path.relative(process.cwd(), absolute);
}

async function auditRoute(page: Page, route: AuditRoute, viewports: Viewport[]) {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  const onConsole = (message: { type(): string; text(): string }) => {
    if (message.type() === "error") consoleErrors.push(message.text().slice(0, 300));
  };
  const onRequestFailed = (request: { url(): string; failure(): { errorText?: string } | null }) => {
    const url = request.url();
    const expectedAbort = request.failure()?.errorText === "net::ERR_ABORTED";
    const thirdPartyTelemetry =
      url.includes("google-analytics") ||
      url.includes("analytics.google") ||
      url.includes("googletagmanager") ||
      url.includes("google.com/ccm") ||
      url.includes("doubleclick.net") ||
      url.includes("posthog");
    if (!thirdPartyTelemetry && !expectedAbort) {
      failedRequests.push(`${url} :: ${request.failure()?.errorText ?? "failed"}`.slice(0, 400));
    }
  };
  page.on("console", onConsole);
  page.on("requestfailed", onRequestFailed);

  let responseStatus = 0;
  let finalPath = "";
  try {
    const response = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    responseStatus = response?.status() ?? 0;
    await page.waitForTimeout(route.group === "topic" ? 350 : 700);
    finalPath = new URL(page.url()).pathname;

    if (responseStatus >= 400 || responseStatus === 0) {
      findings.push({
        severity: "high",
        category: "route",
        route: route.path,
        viewport: "all",
        summary: `Route returned HTTP ${responseStatus || "no response"}`,
      });
    }

    for (const viewport of viewports) {
      const result = await inspectLayout(page, viewport);
      const record = { route: route.path, group: route.group, viewport: viewport.name, status: responseStatus, finalPath, ...result };
      routeResults.push(record);

      if (result.horizontalOverflow) {
        const evidence = await screenshot(page, route, viewport, "overflow");
        findings.push({
          severity: "high",
          category: "horizontal-overflow",
          route: route.path,
          viewport: `${viewport.width}x${viewport.height}`,
          summary: `Document is ${result.documentWidth - result.viewportWidth}px wider than the viewport`,
          samples: result.outside,
          screenshot: evidence,
        });
      } else if (result.outside.length > 0) {
        const evidence = await screenshot(page, route, viewport, "outside");
        findings.push({
          severity: "medium",
          category: "element-outside-viewport",
          route: route.path,
          viewport: `${viewport.width}x${viewport.height}`,
          summary: `${result.outside.length} sampled visible elements extend outside the viewport`,
          samples: result.outside,
          screenshot: evidence,
        });
      }

      if (result.clipped.length > 0) {
        findings.push({
          severity: "medium",
          category: "clipped-content",
          route: route.path,
          viewport: `${viewport.width}x${viewport.height}`,
          summary: `${result.clipped.length} sampled text-bearing elements are clipped`,
          samples: result.clipped,
        });
      }

      if (result.smallTargets.length > 0 && route.group !== "topic") {
        findings.push({
          severity: "medium",
          category: "tap-target",
          route: route.path,
          viewport: `${viewport.width}x${viewport.height}`,
          summary: `${result.smallTargets.length} sampled visible controls are smaller than 44x44px`,
          samples: result.smallTargets,
        });
      }
    }

    const uniqueConsole = [...new Set(consoleErrors)].filter((message) => !message.includes("favicon"));
    if (uniqueConsole.length > 0) {
      findings.push({
        severity: "high",
        category: "console",
        route: route.path,
        viewport: "navigation",
        summary: `${uniqueConsole.length} console error(s)`,
        samples: uniqueConsole.slice(0, 8),
      });
    }
    if (failedRequests.length > 0) {
      findings.push({
        severity: "high",
        category: "network",
        route: route.path,
        viewport: "navigation",
        summary: `${failedRequests.length} critical request failure(s)`,
        samples: [...new Set(failedRequests)].slice(0, 8),
      });
    }
  } catch (error) {
    findings.push({
      severity: "high",
      category: "audit-runtime",
      route: route.path,
      viewport: "navigation",
      summary: error instanceof Error ? error.message : String(error),
    });
  } finally {
    page.off("console", onConsole);
    page.off("requestfailed", onRequestFailed);
  }
}

function writeReport() {
  const severityOrder = { high: 0, medium: 1, low: 2 } as const;
  findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity] || a.category.localeCompare(b.category));
  fs.writeFileSync(path.join(OUTPUT_DIR, "results.json"), JSON.stringify({
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    routeCount: CORE_ROUTES.length + TOPIC_ROUTES.length,
    coreRouteCount: CORE_ROUTES.length,
    topicRouteCount: TOPIC_ROUTES.length,
    viewports: VIEWPORTS,
    findings,
    routeResults,
  }, null, 2));

  const counts = findings.reduce<Record<string, number>>((acc, finding) => {
    acc[finding.severity] = (acc[finding.severity] ?? 0) + 1;
    return acc;
  }, {});
  const categoryCounts = findings.reduce<Record<string, number>>((acc, finding) => {
    acc[finding.category] = (acc[finding.category] ?? 0) + 1;
    return acc;
  }, {});
  const lines = [
    `# Cleverli responsiveness audit — ${RUN_DATE}`,
    "",
    `- Production: ${BASE_URL}`,
    `- Routes: ${CORE_ROUTES.length} core + ${TOPIC_ROUTES.length} topic/exercise = ${CORE_ROUTES.length + TOPIC_ROUTES.length}`,
    `- Viewports: ${VIEWPORTS.map((viewport) => `${viewport.width}x${viewport.height}`).join(", ")}`,
    `- Findings: ${counts.high ?? 0} high, ${counts.medium ?? 0} medium, ${counts.low ?? 0} low`,
    "",
    "## Category counts",
    "",
    ...Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([category, count]) => `- ${category}: ${count}`),
    "",
    "## Findings",
    "",
    ...findings.flatMap((finding, index) => [
      `### ${index + 1}. [${finding.severity.toUpperCase()}] ${finding.category} — ${finding.route}`,
      "",
      `- Viewport: ${finding.viewport}`,
      `- ${finding.summary}`,
      ...(finding.samples?.length ? ["- Samples:", ...finding.samples.map((sample) => `  - \`${sample.replace(/`/g, "'")}\``)] : []),
      ...(finding.screenshot ? [`- Evidence: [${path.basename(finding.screenshot)}](./screenshots/${path.basename(finding.screenshot)})`] : []),
      "",
    ]),
  ];
  fs.writeFileSync(path.join(OUTPUT_DIR, "REPORT.md"), lines.join("\n"));
}

async function main() {
  fs.mkdirSync(path.join(OUTPUT_DIR, "screenshots"), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const authContext = await browser.newContext({
    locale: "de-CH",
    storageState: fs.existsSync(AUTH_STATE) ? AUTH_STATE : undefined,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const guestContext = await browser.newContext({
    locale: "de-CH",
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await seedProfile(authContext);
  const authPage = await authContext.newPage();
  const guestPage = await guestContext.newPage();

  for (const [index, route] of CORE_ROUTES.entries()) {
    console.log(`[core ${index + 1}/${CORE_ROUTES.length}] ${route.path}`);
    await auditRoute(route.guest ? guestPage : authPage, route, VIEWPORTS);
  }

  const topicViewports = VIEWPORTS.filter((viewport) => [320, 390, 768].includes(viewport.width));
  for (const [index, route] of TOPIC_ROUTES.entries()) {
    console.log(`[topic ${index + 1}/${TOPIC_ROUTES.length}] ${route.path}`);
    await auditRoute(authPage, route, topicViewports);
  }

  writeReport();
  await authContext.close();
  await guestContext.close();
  await browser.close();
  console.log(`Audit complete: ${findings.length} findings. Report: ${path.join(OUTPUT_DIR, "REPORT.md")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
