# Go-Live Test Audit — Cleverli.ch
**Date:** March 6, 2026 | **Status:** Critical Review

---

## 🔴 CRITICAL GAPS (Missing entirely)

### 1. Payment Flow (BLOCKER)
- No tests for `/api/checkout` endpoint
- No tests for payment success redirect `/payment/success`
- No tests for payment cancel redirect `/payment/cancel`
- No tests for Payrexx webhook → premium unlock
- No verification that `parent_profiles.premium = true` after payment

### 2. Signup → Onboarding Flow (BLOCKER)
- No end-to-end test: signup → create child → start learning
- Only tests individual pages in isolation
- Critical user journey completely untested

### 3. Premium Paywall Enforcement
- No test: free user hits exercise 6 → sees upgrade wall
- No test: premium user skips upgrade wall
- No test: upgrade wall CTA button works

### 4. API Endpoints
- `/api/checkout` — untested
- `/api/cancel-subscription` — untested
- `/api/send-welcome` — untested
- `/api/webhooks` — untested
- `/api/cron` — untested
- Only `/api/tts` is tested

### 5. SEO / Meta Tags
- No tests for og:title, og:description, og:image
- No tests for canonical URLs
- No tests for structured data
- Sitemap just checks 200, not content validity

### 6. Performance / Core Web Vitals
- No load time assertions
- No LCP (Largest Contentful Paint) check
- No CLS (layout shift) check
- No FCP (First Contentful Paint) check

---

## 🟡 PARTIALLY TESTED (Weak assertions)

### 7. Auth Guards
- `/dashboard` tested (logged in) ✅
- Not tested: unauthenticated user redirect to /login ❌
- Not tested: accessing `/account` without session ❌

### 8. Exercise Progress Persistence
- XP tracked in localStorage ✅ (soft check)
- Not tested: progress survives page reload ❌
- Not tested: streak counter increments ❌
- Not tested: progress synced to Supabase ❌

### 9. Language Switching
- Tests just check page loads, not actual translated content ❌
- Not tested: language persists after reload ❌
- Not tested: language switcher UI element ❌

### 10. Mobile Tests
- Screenshots taken ✅ but never visually compared ❌
- Overflow detection ✅ but soft warning only ❌
- Touch targets not tested for minimum 44px ❌

### 11. Error States
- No test for network failure handling
- No test for Supabase connection error
- No test for invalid/expired session
- No test for 500 errors

---

## 🟢 WELL TESTED

- All pages load without crash ✅
- Auth login/logout/signup flows ✅
- Exercise interactions across all grades/subjects ✅
- TTS API (all 4 languages) ✅
- Parent flows (upgrade, family, account) ✅
- Child flows (XP, shop, trophies) ✅
- i18n coverage ✅
- Progress map system ✅
- Mobile screenshots ✅

---

## 📋 GO-LIVE CHECKLIST (Additional tests needed)

1. ✅ Payment flow (checkout → success → premium)
2. ✅ Auth guard redirects
3. ✅ Free exercise limit (paywall at ex.6)
4. ✅ Premium bypass of paywall
5. ✅ Signup → onboarding → first exercise
6. ✅ Progress persistence (reload)
7. ✅ SEO meta tags on key pages
8. ✅ Performance benchmarks
9. ✅ Language persistence after reload
10. ✅ Error states (graceful handling)
