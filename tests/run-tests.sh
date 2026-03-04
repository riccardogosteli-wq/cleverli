#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# Cleverli Autonomous Test Runner
# Usage: ./tests/run-tests.sh [--suite <spec>] [--no-report]
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
RESULTS_DIR="$SCRIPT_DIR/results"
REPORT_JSON="$RESULTS_DIR/report.json"
VERCEL_TOKEN="${VERCEL_TOKEN:-}"
VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-prj_Ag2EEO40W112aEc1yzAYWMCQrwdK}"
GW_TOKEN="${OPENCLAW_GATEWAY_TOKEN:-}"
TELEGRAM_CHAT="341827520"

SUITE="${1:-}"
NO_REPORT=0
[[ "${2:-}" == "--no-report" ]] && NO_REPORT=1

mkdir -p "$RESULTS_DIR/screenshots"

# ── Telegram notification ─────────────────────────────────────────────────────
notify() {
  [[ -z "$GW_TOKEN" ]] && { echo "[notify] $1"; return; }
  curl -s -X POST "http://localhost:4420/message/send" \
    -H "Authorization: Bearer $GW_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"channel\":\"telegram\",\"target\":\"$TELEGRAM_CHAT\",\"message\":$(echo "$1" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')}" \
    > /dev/null 2>&1 || true
}

# ── Wait for Vercel deploy ────────────────────────────────────────────────────
wait_for_deploy() {
  echo "⏳ Waiting for Vercel deploy to complete..."
  local MAX=30  # max 5 minutes (30 × 10s)
  for i in $(seq 1 $MAX); do
    STATUS=$(curl -s "https://api.vercel.com/v6/deployments?projectId=$VERCEL_PROJECT_ID&limit=1" \
      -H "Authorization: Bearer $VERCEL_TOKEN" | \
      python3 -c "import json,sys; d=json.load(sys.stdin); print(d['deployments'][0]['state'] if d.get('deployments') else 'UNKNOWN')" 2>/dev/null || echo "UNKNOWN")
    echo "  Deploy status: $STATUS (attempt $i/$MAX)"
    if [[ "$STATUS" == "READY" ]]; then
      echo "✅ Deploy complete"
      return 0
    fi
    sleep 10
  done
  echo "⚠️  Deploy timed out after 5 minutes"
  return 1
}

# ── Parse test results ────────────────────────────────────────────────────────
parse_results() {
  [[ ! -f "$REPORT_JSON" ]] && echo "No report found" && return
  python3 << 'PYEOF'
import json, sys
with open("tests/results/report.json") as f:
    r = json.load(f)

total = r.get("stats", {}).get("expected", 0)
passed = r.get("stats", {}).get("passed", 0)
failed = r.get("stats", {}).get("failed", 0)
skipped = r.get("stats", {}).get("skipped", 0)
duration = r.get("stats", {}).get("duration", 0) / 1000

failures = []
for suite in r.get("suites", []):
    for spec in suite.get("specs", []):
        for test in spec.get("tests", []):
            for result in test.get("results", []):
                if result.get("status") == "failed":
                    failures.append({
                        "title": spec.get("title", "?"),
                        "file": spec.get("file", "?"),
                        "error": result.get("error", {}).get("message", "unknown")[:200],
                    })

print(f"TOTAL={total} PASSED={passed} FAILED={failed} SKIPPED={skipped} DURATION={duration:.0f}s")
for i, f in enumerate(failures[:20]):
    print(f"FAIL[{i}]: {f['file']} — {f['title']}")
    print(f"  ERR: {f['error'][:150]}")
PYEOF
}

# ── Main ──────────────────────────────────────────────────────────────────────
cd "$PROJECT_DIR"
echo "════════════════════════════════════════"
echo "  Cleverli Test Runner — $(date '+%Y-%m-%d %H:%M')"
echo "════════════════════════════════════════"

notify "🧪 *Cleverli tests starting...*"

# Run setup first (auth)
echo "→ Running auth setup..."
npx playwright test tests/auth.setup.ts --project=setup 2>&1 | tail -5 || {
  notify "❌ Auth setup failed — check test account"
  exit 1
}

# Run test suite
if [[ -n "$SUITE" ]]; then
  echo "→ Running suite: $SUITE"
  npx playwright test "tests/specs/$SUITE" --project=mobile 2>&1 | tee "$RESULTS_DIR/run.log" || true
else
  echo "→ Running all specs..."
  npx playwright test tests/specs/ --project=mobile 2>&1 | tee "$RESULTS_DIR/run.log" || true
fi

# Parse results
SUMMARY=$(parse_results 2>/dev/null || echo "Could not parse results")
echo ""
echo "── Results ──────────────────────────────"
echo "$SUMMARY"

# Count failures
FAILED=$(echo "$SUMMARY" | grep -oP 'FAILED=\K\d+' || echo "0")
PASSED=$(echo "$SUMMARY" | grep -oP 'PASSED=\K\d+' || echo "0")
TOTAL=$(echo "$SUMMARY" | grep -oP 'TOTAL=\K\d+' || echo "0")

# Build Telegram report
if [[ "$NO_REPORT" == "0" ]]; then
  if [[ "$FAILED" == "0" ]]; then
    MSG="✅ *Cleverli Tests PASSED*
$PASSED/$TOTAL tests green 🎉
All flows working — ready for next fix cycle."
  else
    FAILURES_TEXT=$(echo "$SUMMARY" | grep "^FAIL" | head -10 | sed 's/^/• /')
    MSG="❌ *Cleverli Tests: $FAILED FAILED*
$PASSED/$TOTAL passed

*Failures:*
$FAILURES_TEXT

→ Fixing now..."
  fi
  notify "$MSG"
fi

echo ""
echo "Done. Exit: $FAILED failures."
exit $([ "$FAILED" -eq 0 ] && echo 0 || echo 1)
