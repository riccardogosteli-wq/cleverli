# Safari / iOS Testing Guide

## Why iOS Safari needs special attention

On iPhone, **both Safari and Chrome use WebKit** (Apple's browser engine). This means iOS-specific bugs affect ALL browsers on iPhone — not just Safari.

---

## Known iOS-specific crash: React Error #310

**Symptom:** Page shows "Application error" on iPhone (Safari + Chrome), works fine on Android.

**Error:** `Minified React error #310` = "Rendered more hooks than during the previous render"

**Root cause:** React hooks (`useState`, `useMemo`, `useEffect`, etc.) being called **after** a conditional early return:

```tsx
// ❌ WRONG — causes crash on iOS Safari
function MyPage() {
  const { session } = useSession();
  
  if (!session) return <GuestPreview />; // early return
  
  const data = useMemo(() => ..., []); // 🚨 hook after return = iOS crash
  const [tab, setTab] = useState("all"); // 🚨 same
}
```

```tsx
// ✅ CORRECT — all hooks before any returns
function MyPage() {
  const { session } = useSession();
  
  // All hooks FIRST
  const data = useMemo(() => ..., []);
  const [tab, setTab] = useState("all");
  
  // Returns AFTER all hooks
  if (!session) return <GuestPreview />;
  
  return <div>...</div>;
}
```

**Why Android doesn't crash:** Chrome/V8 is more forgiving about hook ordering violations. WebKit enforces it strictly and throws a hard error.

**Happened on:** 2026-03-14, `/missionen` page. Fixed in commit `23c6da5`.

---

## How to test for iOS compatibility

### 1. Run the WebKit test suite

```bash
npx playwright test tests/specs/21-webkit-safari.spec.ts
```

This tests all key pages against production using real WebKit (Safari engine).

### 2. Check hooks ordering statically

```bash
npm run lint:hooks
```

This scans all `.tsx` files for hooks called after early returns.

### 3. Manual test checklist (before launch)

| Page | Test |
|------|------|
| /missionen | Load on iPhone Safari ✅ |
| /dashboard | Load on iPhone Safari ✅ |
| /parents | Load on iPhone Safari ✅ |
| /rewards | Load on iPhone Safari ✅ |
| Exercise player | Complete 1 exercise ✅ |

---

## Rules for all new components

1. **Always declare all hooks at the top** of the component function
2. **Never call a hook after an `if` or early `return`**
3. **Run `npm run lint:hooks` before pushing** if you add new hooks
4. **Loading states:** use a flag in the return JSX, not an early return before hooks

```tsx
// ✅ Pattern: loading state without hook ordering violation
function MyPage() {
  const { session, loaded } = useSession();
  const [tab, setTab] = useState("all"); // hook before returns
  
  if (!loaded) return <Spinner />;
  if (!session) return <GuestPreview />;
  
  return <div>...</div>;
}
```

---

## Test suite files

- `tests/specs/21-webkit-safari.spec.ts` — WebKit production tests (9 pages)
- `scripts/check-hooks-order.ts` — static analysis script
- `tests/specs/99-webkit-debug.spec.ts` — debug/investigation spec (keep for reference)
