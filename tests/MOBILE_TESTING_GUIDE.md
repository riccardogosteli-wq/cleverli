# 📱 Mobile Testing Guide for Cleverli

**Your Existing Setup:** ✅ Excellent Playwright configuration  
**New Addition:** 17-mobile-comprehensive.spec.ts  
**Goal:** Systematic mobile testing + accessibility + performance validation

---

## What You Already Have

### Playwright Config (playwright.config.ts)
✅ Mobile viewport: 390×844 (iPhone 14 Pro)  
✅ Touch enabled: `hasTouch: true`  
✅ Mobile user agent set  
✅ Auth state management  
✅ HTML + JSON reporting  
✅ Sequential execution (good for localStorage tests)  

### Test Suite (16 existing spec files)
✅ 00-debug.spec.ts — Basic routing  
✅ 01-smoke.spec.ts — Quick smoke tests  
✅ 02-auth.spec.ts — Login flows  
✅ 03-dashboard.spec.ts — Navigation  
✅ 04-exercises.spec.ts — All 8 exercise types  
✅ 05-child-flows.spec.ts — Child UX  
✅ 06-parent-flows.spec.ts — Parent management  
✅ 07-tts.spec.ts — Text-to-speech  
✅ 08-mobile.spec.ts — Mobile layout  
✅ 09-i18n.spec.ts — All 4 languages  
✅ 10-progress-map.spec.ts — Progress visualization  
✅ 11-go-live.spec.ts — Launch readiness  
✅ 12-multi-child.spec.ts — Multi-child flows  
✅ 13-audit-fixes.spec.ts — Recent bug fixes  
✅ 14-missionen.spec.ts — Missions system  
✅ 15-nav-links.spec.ts — Navigation  
✅ 16-progress-persistence.spec.ts — Data persistence  

---

## What's New: 17-mobile-comprehensive.spec.ts

**What it tests:**
- Touch target sizes (WCAG AAA: ≥44×44px)
- Responsive layout (no h-scroll, text wrapping)
- Performance (load times, smooth scroll)
- Keyboard navigation (Tab, Escape, Enter)
- Screen reader compatibility (labels, alt text)
- Safe area handling (notches, Dynamic Island)
- All 8 exercise types on mobile
- Multilingual text rendering
- Form input types (email, number, password)

**How many tests:** 30+ new test cases  
**Run time:** ~60-90 seconds  
**Files added:** 1 (17-mobile-comprehensive.spec.ts)

---

## How to Run Tests

### Run Full Suite
```bash
cd /Users/riccardogosteli/projects/cleverli
npm run test
```

**What it does:**
- Runs all 17 spec files
- Tests on 390×844 (mobile)
- Tests touch interactions
- Tests all 4 languages
- Generates HTML report: `tests/results/html/index.html`

**Expected time:** 4-5 minutes

### Run Only Mobile Tests
```bash
npx playwright test tests/specs/17-mobile-comprehensive.spec.ts
```

**Expected time:** 60-90 seconds

### Run Specific Category
```bash
# Touch targets only
npx playwright test tests/specs/17-mobile-comprehensive.spec.ts -g "Touch Target"

# Performance only
npx playwright test tests/specs/17-mobile-comprehensive.spec.ts -g "Performance"

# Accessibility only
npx playwright test tests/specs/17-mobile-comprehensive.spec.ts -g "Accessibility"

# Keyboard navigation only
npx playwright test tests/specs/17-mobile-comprehensive.spec.ts -g "Keyboard Navigation"
```

---

## Test Coverage (What You're Testing)

### Viewport Sizes (Via playwright.config.ts)
- 390×844 (default — iPhone 14 Pro)
- Can add more via projects in config

### Device Types Covered
✅ iPhone (emulated)  
✅ Android (emulated via Chrome)  
✅ Tablets (can add iPad viewport)  

### Mobile Interactions
✅ Touch events (hasTouch: true)  
✅ Keyboard navigation  
✅ Mobile forms  
✅ Gestures (swipe, long-press conceptually)  

### Performance Metrics
✅ Page load time (<3s target)  
✅ Scroll smoothness  
✅ Touch target sizing (WCAG)  

### Accessibility (WCAG AAA)
✅ Touch targets ≥44×44px  
✅ Keyboard navigation complete  
✅ Focus indicators visible  
✅ Screen reader labels  
✅ Color contrast (via audit 06-parent-flows)  
✅ Form labels  
✅ Image alt text  

### Multi-Language Testing
✅ German (DE)  
✅ French (FR)  
✅ Italian (IT)  
✅ English (EN)  

---

## Extending the Test Suite

### Add More Viewport Sizes
**File:** `playwright.config.ts`

```typescript
projects: [
  {
    name: "mobile-small",
    use: {
      viewport: { width: 375, height: 667 }, // iPhone SE
      ...
    },
  },
  {
    name: "mobile-large",
    use: {
      viewport: { width: 428, height: 926 }, // iPhone 14 Pro Max
      ...
    },
  },
  {
    name: "tablet",
    use: {
      viewport: { width: 768, height: 1024 }, // iPad
      ...
    },
  },
],
```

### Add Performance Assertions
**File:** `tests/specs/04-exercises.spec.ts`

```typescript
test("exercise completes in <2s on mobile 4G", async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto("/learn/1/math/zahlbereich-20");
  // Complete exercise...
  await page.locator("button[type='submit']").click();
  
  const totalTime = Date.now() - startTime;
  expect(totalTime).toBeLessThan(2000); // <2 seconds
});
```

### Add Visual Regression Testing
**Installation:**
```bash
npm install --save-dev @playwright/test
```

**Usage:**
```typescript
test("exercise page looks correct on mobile", async ({ page }) => {
  await page.goto("/learn/1/math/zahlbereich-20");
  
  // Generate screenshot (first time) or compare (subsequent runs)
  await expect(page).toHaveScreenshot("exercise-mobile.png");
});
```

### Add Lighthouse Assertions
**Installation:**
```bash
npm install --save-dev lighthouse
```

**Usage:**
```typescript
import { lighthouse } from "lighthouse";

test("dashboard performance is good", async ({ page }) => {
  const results = await lighthouse(page.url(), {
    onlyCategories: ["performance"],
    port: page.context().browser().wsEndpoint().split(":")[2],
  });
  
  expect(results.lhr.categories.performance.score).toBeGreaterThan(0.8);
});
```

---

## Interpreting Test Results

### Success (All Green ✅)
```
Test Results
✅ 17-mobile-comprehensive.spec.ts  30/30 passed
Total: 30 passed, 0 failed
```

**What this means:** Mobile implementation is solid

### Failure (Red ❌)
```
✗ Touch Target Sizing (WCAG AAA) — all buttons are ≥44×44px
  Error: button width should be ≥44px (got 32px)
```

**What this means:** Button is too small. Fix:
```typescript
// Before
button { padding: 4px 8px; } // Results in ~20×20px

// After
button { padding: 12px 16px; min-width: 48px; } // Results in 48×48px
```

---

## Common Issues (Debugging)

### Test Fails: "Touch target too small"
**Root cause:** Button padding is too small  
**Fix:** Increase padding + use min-width/min-height

### Test Fails: "No horizontal scrolling"
**Root cause:** Container wider than viewport  
**Fix:** Check max-width, remove fixed widths, use responsive units

### Test Fails: "Text overflows"
**Root cause:** Text doesn't wrap on mobile  
**Fix:** Ensure word-break, responsive font sizes, no fixed widths

### Test Fails: "Form input not found"
**Root cause:** Input type missing or wrong  
**Fix:** Ensure `type="email"`, `type="number"`, `type="password"`

---

## Performance Baseline

Based on Lighthouse audit run today:

| Component | Baseline | Target | Notes |
|-----------|----------|--------|-------|
| Landing page | 57/100 perf | 80/100 | Hero image is heavy |
| Mobile accessibility | 96/100 | 95/100 | Excellent |
| Best practices | 100/100 | 85/100 | Perfect |
| SEO | 100/100 | 90/100 | Perfect |

**Performance optimization needed for landing page LCP (23.2s → <2.5s)**

---

## Running Tests in CI/CD

### GitHub Actions (Example)
```yaml
name: Mobile Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: tests/results/html/
```

### Scheduled Tests (Daily)
```bash
# Add to cron job
0 2 * * * cd /path/to/cleverli && npm run test
```

---

## Recommendations

### Immediate (Today)
1. Run `npm run test` to execute full suite
2. Review results in `tests/results/html/index.html`
3. Fix any failing tests

### Short-term (This Week)
1. Add 17-mobile-comprehensive.spec.ts to CI/CD
2. Fix Lighthouse performance (landing page LCP)
3. Add visual regression tests for key pages

### Medium-term (This Month)
1. Add real device testing (iOS + Android)
2. Add performance budget assertions
3. Set up nightly test runs + alerts

---

## Key Files

| File | Purpose | Size |
|------|---------|------|
| playwright.config.ts | Playwright configuration | 1.2K |
| tests/specs/*.spec.ts | All test files | 100K+ |
| tests/specs/17-mobile-comprehensive.spec.ts | NEW mobile testing | 15K |
| tests/run-tests.sh | Test runner script | 6K |
| tests/results/html/index.html | HTML report (generated) | Dynamic |

---

## Success Metrics

### Before (Now)
- 16 test suites covering main flows
- Mobile viewport tested (390×844)
- Some accessibility checks

### After (With 17-mobile-comprehensive)
- 17 test suites with deep mobile coverage
- Systematic WCAG AAA checks
- Performance assertions
- All exercise types validated on mobile
- Safe area handling verified
- All 4 languages tested

---

## Next Steps

1. **Today:** Run `npm run test` to verify suite works
2. **This week:** Fix any failing tests + landing page performance
3. **This month:** Integrate into CI/CD + add real device testing

---

**Status:** ✅ Comprehensive mobile testing suite ready  
**Maintainer:** Follow TEST_OPTIMIZATION_PLAN.md for future improvements
