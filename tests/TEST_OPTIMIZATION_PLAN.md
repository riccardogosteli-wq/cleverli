# Cleverli Test Suite Optimization Plan

**Date:** March 5, 2026  
**Current Status:** Running full suite (00-09)  
**Goal:** Improve coverage, efficiency, and bug detection

---

## Current Test Suite Overview

| Test | File | Coverage | Speed | Issues |
|------|------|----------|-------|--------|
| 00 | debug.spec.ts | Basic routing | Fast | Limited |
| 01 | smoke.spec.ts | Smoke tests | Fast | Shallow |
| 02 | auth.spec.ts | Auth flows | Medium | ✅ Good |
| 03 | dashboard.spec.ts | Navigation | Medium | Needs grade testing |
| 04 | exercises.spec.ts | Exercise mechanics | Slow | Missing progress map tests |
| 05 | child-flows.spec.ts | Child UX | Medium | Can test more |
| 06 | parent-flows.spec.ts | Parent UX | Slow | Incomplete |
| 07 | tts.spec.ts | Text-to-speech | Fast | Limited to voice |
| 08 | mobile.spec.ts | Mobile layout | Medium | Missing responsive checks |
| 09 | i18n.spec.ts | Internationalization | Fast | Language switching only |

---

## Proposed Improvements

### 1. Progress Map Tests (NEW)
**File:** `10-progress-map.spec.ts` (NEW)

**Tests needed:**
- [ ] Progress map renders on topic page
- [ ] Correct exercise counts per difficulty
- [ ] Proper medal emoji display (🥉🥈🥇)
- [ ] Progress bars color correct (red→orange→green)
- [ ] SVG generation doesn't crash
- [ ] Mobile vs desktop layout detection
- [ ] Multi-language checkpoint labels work
- [ ] Mission unlock notifications appear
- [ ] Progress updates on exercise completion
- [ ] Edge case: empty topic (0 exercises)

**Estimated tests:** 10 new tests  
**Time:** ~30 seconds per run

### 2. Optimize Existing Tests

#### 03-dashboard.spec.ts (Optimization)
**Current issues:**
- Only checks if topics load, not if they're correct
- Doesn't test grade selection flow
- Missing subject switching tests

**Improvements:**
```typescript
// ADD: Grade picker flow
test("grade picker shows all grades (1-6)", async ({ page }) => { ... })

// ADD: Subject switching
test("subject switcher changes content", async ({ page }) => { ... })

// ADD: Icon visibility
test("navigation icons are visible on mobile", async ({ page }) => { ... })
```

#### 04-exercises.spec.ts (Optimization)
**Current issues:**
- Doesn't test all exercise types
- Missing progress saving verification
- No test for exercise difficulty distribution

**Improvements:**
```typescript
// ADD: Verify all 5 exercise types work
["counting", "multiple-choice", "fill-in-blank", "drag-drop", "memory"].forEach(type => {
  test(`${type} exercise loads and completes`, async ({ page }) => { ... })
})

// ADD: Test progress persistence
test("exercise progress saves to localStorage", async ({ page }) => { ... })

// ADD: Difficulty-specific testing
test("difficulty 1 exercises are easier than difficulty 3", async ({ page }) => { ... })
```

#### 08-mobile.spec.ts (Optimization)
**Current issues:**
- Only checks viewport, doesn't test mobile UX
- Missing touch interaction tests
- No test for bottom nav on mobile

**Improvements:**
```typescript
// ADD: Touch events
test("mobile buttons are touch-sized (≥44px)", async ({ page }) => { ... })

// ADD: Bottom nav visibility
test("mobile bottom nav shows all 5 tabs", async ({ page }) => { ... })

// ADD: Swipe/gesture tests
test("exercise card responds to swipe", async ({ page }) => { ... })
```

#### 09-i18n.spec.ts (Optimization)
**Current issues:**
- Only tests language switching
- Doesn't verify all text is translated
- Missing RTL language tests (if supported)

**Improvements:**
```typescript
// ADD: Verify all UI labels in each language
["de", "fr", "it", "en"].forEach(lang => {
  test(`all labels translated to ${lang}`, async ({ page }) => { ... })
})

// ADD: Number/date formatting
test("numbers display correctly per locale", async ({ page }) => { ... })

// ADD: Emoji compatibility across languages
test("emojis render same across all languages", async ({ page }) => { ... })
```

---

## Performance Optimization

### Current Bottlenecks
- **Full suite time:** ~2-3 minutes
- **Slowest test:** Parent flows (15+ seconds)
- **Slowest spec:** 06-parent-flows.spec.ts

### Improvements
1. **Parallel execution:** Run independent tests in parallel (currently sequential)
2. **Fixture reuse:** Cache login state between tests
3. **Faster selectors:** Use data-testid instead of CSS classes (unstable)
4. **Skip redundant checks:** Don't re-verify auth on every test

### New Target
- **Full suite time:** ~60 seconds (50% reduction)
- **Parallel specs:** 00, 01, 07 run together
- **Dependent specs:** 02 → 03, 05 → 06

---

## Bug Detection Improvements

### What We're Testing Now
✅ Can user login?  
✅ Does page load?  
✅ Can child do exercises?  
✅ Does multi-language work?

### What We Should Test Too
❌ Do progress bars calculate correctly?  
❌ Does progress map SVG render?  
❌ Are exercise counts accurate per difficulty?  
❌ Do notifications appear?  
❌ Does localStorage persist?  
❌ Do all exercise types work (5 types)?  
❌ Is mobile layout actually responsive?  
❌ Do all emojis display correctly?  
❌ Are touch targets 44px minimum?  
❌ Do parent rewards work?  

---

## Test Execution Plan

### Phase 1: Run Current Suite
```bash
npm run test  # All 00-09
```
**Expected time:** 2-3 minutes  
**Expected results:** Majority passing (fixes from today deployed)

### Phase 2: Analyze Failures
```bash
cat tests/results/report.json | python3 analyze.py
```
**Output:** List of failures + root causes

### Phase 3: Add Progress Map Tests
Create `tests/specs/10-progress-map.spec.ts`  
**Expected:** 10 new tests for progress visualization

### Phase 4: Optimize Existing Tests
Update specs 03, 04, 08, 09 with new test cases  
**Expected:** +15 new test cases, better coverage

### Phase 5: Verify & Commit
```bash
npm run test  # Full suite with improvements
git commit -m "test: Add progress map tests + optimize existing suite"
```

---

## Test Metrics

### Current Coverage
- **Pages tested:** 8 (dashboard, learn, auth, etc.)
- **Test count:** ~30 tests
- **Assertion count:** ~50 assertions
- **Time per test:** ~6 seconds average

### Target Coverage
- **Pages tested:** 10+ (add parent dashboard, profile)
- **Test count:** ~45 tests (+50%)
- **Assertion count:** ~100 assertions (+100%)
- **Time per test:** ~3 seconds average (parallel)

### Bug Detection Rate
- **Current:** Finds 1-2 UI bugs per run
- **Target:** Find 5+ bugs per run (better coverage)

---

## Implementation Timeline

| Phase | Est. Time | Status |
|-------|-----------|--------|
| Phase 1: Run current | 3 min | ⏳ Running |
| Phase 2: Analyze | 5 min | ⏳ Next |
| Phase 3: Add tests | 20 min | ⏳ After analysis |
| Phase 4: Optimize | 30 min | ⏳ After tests |
| Phase 5: Verify | 3 min | ⏳ Final |

**Total time:** ~60 minutes to complete all phases

---

## Success Criteria

✅ All current tests pass (with today's progress map fixes)  
✅ New progress map tests added and passing  
✅ Suite runs in <90 seconds (parallel)  
✅ Catches at least 5 new bug types  
✅ Coverage >80% of user flows  
✅ All 4 languages tested  
✅ Mobile + desktop both tested  

---

**Next:** Wait for current test run to complete, then analyze results and begin optimizations.
