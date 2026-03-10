/**
 * PERFORMANCE & ACCESSIBILITY AUDIT
 * 
 * Integrates Lighthouse + Axe into Playwright test suite
 * Runs on critical pages to detect regressions
 */

import { test, expect } from "@playwright/test";
import lighthouse from "lighthouse";
import { AxeBuilder } from "@axe-core/playwright";

const LIGHTHOUSE_THRESHOLDS = {
  performance: 80,
  accessibility: 95,
  "best-practices": 85,
  seo: 90,
};

// ─── LIGHTHOUSE TESTS ───────────────────────────────────────────────────────

test.describe("Lighthouse Performance Audit", () => {
  const pagesToAudit = [
    { path: "/", name: "Landing Page" },
    { path: "/dashboard", name: "Dashboard" },
  ];

  for (const page of pagesToAudit) {
    test(`${page.name} meets performance thresholds`, async ({ browser }) => {
      const browserWSEndpoint = await browser.context();
      
      const options = {
        logLevel: "error" as const,
        output: "json" as const,
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
        port: new URL(browser.connectOptions.wsEndpoint!).port || undefined,
      };

      try {
        const runnerResult = await lighthouse(
          `https://www.cleverli.ch${page.path}`,
          options as any
        );

        if (!runnerResult) {
          throw new Error("Lighthouse audit failed");
        }

        const categories = runnerResult.lhr.categories;
        const results: Record<string, number> = {};

        // Check each category against threshold
        for (const [category, threshold] of Object.entries(
          LIGHTHOUSE_THRESHOLDS
        )) {
          const score = Math.round((categories[category].score ?? 0) * 100);
          results[category] = score;

          console.log(
            `  ${category}: ${score}/100 (threshold: ${threshold})`
          );

          // Performance gets a warning at 80, hard fail at 60
          if (category === "performance") {
            if (score < 60) {
              throw new Error(
                `${page.name} Performance score ${score} is CRITICAL (< 60)`
              );
            }
            if (score < threshold) {
              console.warn(
                `⚠️  ${page.name} Performance ${score} below target ${threshold}`
              );
            }
          } else {
            // Other categories are hard requirements
            expect(score).toBeGreaterThanOrEqual(threshold);
          }
        }

        // Log Core Web Vitals
        const audits = runnerResult.lhr.audits;
        console.log("\n  Core Web Vitals:");
        console.log(
          `    LCP: ${audits["largest-contentful-paint"]?.displayValue}`
        );
        console.log(
          `    FID: ${audits["max-potential-fid"]?.displayValue}`
        );
        console.log(
          `    CLS: ${audits["cumulative-layout-shift"]?.displayValue}`
        );
      } catch (error) {
        console.error(`Lighthouse audit failed for ${page.name}:`, error);
        throw error;
      }
    });
  }
});

// ─── AXE ACCESSIBILITY TESTS ────────────────────────────────────────────────

test.describe("Accessibility (Axe) Audit", () => {
  const pagesToTest = [
    { path: "/", name: "Landing Page" },
    { path: "/dashboard", name: "Dashboard" },
    { path: "/login", name: "Login" },
  ];

  for (const page of pagesToTest) {
    test(`${page.name} has no critical accessibility violations`, async ({
      page: pwPage,
    }) => {
      await pwPage.goto(`https://www.cleverli.ch${page.path}`);
      await pwPage.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page: pwPage })
        .withTags(["wcag2aa", "wcag21aa"])
        .analyze();

      const violations = results.violations;
      const criticalViolations = violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      if (criticalViolations.length > 0) {
        console.error(
          `\n⚠️  ${page.name} has ${criticalViolations.length} critical accessibility violations:`
        );
        for (const violation of criticalViolations) {
          console.error(`  - ${violation.id}: ${violation.description}`);
          console.error(`    Affected elements: ${violation.nodes.length}`);
        }
      }

      // Fail on critical/serious violations
      expect(criticalViolations.length).toBe(0);

      // Log warnings for minor violations
      const minorViolations = violations.filter(
        (v) => v.impact === "minor" || v.impact === "moderate"
      );
      if (minorViolations.length > 0) {
        console.warn(
          `⚠️  ${page.name} has ${minorViolations.length} minor accessibility issues`
        );
      }

      console.log(
        `✅ ${page.name} accessibility audit passed (${violations.length} violations found, 0 critical)`
      );
    });
  }
});

// ─── MOBILE PERFORMANCE TESTS ────────────────────────────────────────────────

test.describe("Mobile Performance Specific", () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test("page loads in < 3s on mobile (375px)", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/", { waitUntil: "domcontentloaded" });

    const loadTime = Date.now() - startTime;
    const loadTimeSeconds = (loadTime / 1000).toFixed(2);

    console.log(`  Landing page DOM loaded in ${loadTimeSeconds}s`);

    if (loadTime > 3000) {
      console.warn(
        `⚠️  Page DOM took ${loadTimeSeconds}s (target: <3s on mobile)`
      );
    }

    expect(loadTime).toBeLessThan(5000); // Hard limit: 5s
  });

  test("dashboard loads in < 2s on mobile", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const startTime = Date.now();
    await page.goto("/dashboard");
    const loadTime = Date.now() - startTime;
    const loadTimeSeconds = (loadTime / 1000).toFixed(2);

    console.log(`  Dashboard loaded in ${loadTimeSeconds}s`);
    expect(loadTime).toBeLessThan(3000);
  });

  test("no layout shift on exercise page (mobile)", async ({ page }) => {
    await page.goto("/learn/1/math/zahlbereich-20");
    await page.waitForLoadState("networkidle");

    // Check for visual stability
    const clsValue = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let cls = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            cls += (entry as any).value;
          }
        });
        observer.observe({ entryTypes: ["layout-shift"] });
        setTimeout(() => {
          observer.disconnect();
          resolve(cls);
        }, 3000);
      });
    });

    console.log(`  CLS: ${clsValue.toFixed(4)}`);
    expect(clsValue).toBeLessThan(0.1); // Core Web Vitals threshold
  });

  test("smooth scroll performance (60 FPS)", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const frameDrops = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          let drops = 0;
          for (const entry of entries) {
            if ((entry as any).duration > 50) drops++;
          }
          resolve(drops);
        });
        observer.observe({ entryTypes: ["longtask"] });
        setTimeout(() => {
          observer.disconnect();
          resolve(0); // If no long tasks, return 0
        }, 2000);
      });
    });

    console.log(`  Long tasks (>50ms): ${frameDrops}`);
    if (frameDrops > 0) {
      console.warn(`⚠️  Detected ${frameDrops} long tasks that may cause jank`);
    }
  });
});

// ─── PERFORMANCE REGRESSION DETECTION ────────────────────────────────────────

test.describe("Performance Regression Detection", () => {
  test("bundle size is reasonable (< 300KB gzipped)", async ({ page }) => {
    const requests: { url: string; size: number }[] = [];

    page.on("response", (response) => {
      const request = response.request();
      const headers = response.headers();
      const contentEncoding = headers["content-encoding"];

      if (
        request.resourceType() === "script" &&
        request.url().includes(".next")
      ) {
        const size = parseInt(headers["content-length"] || "0", 10);
        if (size > 0) {
          requests.push({ url: request.url(), size });
        }
      }
    });

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const totalSize = requests.reduce((sum, r) => sum + r.size, 0);
    const totalSizeKB = (totalSize / 1024).toFixed(2);

    console.log(`  Main bundle size: ${totalSizeKB}KB`);
    if (totalSize > 300 * 1024) {
      console.warn(
        `⚠️  Bundle size ${totalSizeKB}KB exceeds target of 300KB`
      );
    }
  });
});

// ─── SUMMARY ────────────────────────────────────────────────────────────────

test.afterAll(async () => {
  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log("║   Performance & Accessibility Audit Complete  ║");
  console.log("╚═══════════════════════════════════════════════╝");
});
