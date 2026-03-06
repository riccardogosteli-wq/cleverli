#!/usr/bin/env python3
"""
Haiku Visual Review — Cleverli UI/UX Audit Tool
================================================
Uses claude-haiku-4-5 vision to review screenshots taken by 18-all-routes-screenshot.spec.ts
and produces a structured bug report sorted by severity.

Usage:
  1. First run: npx playwright test 18-all-routes-screenshot.spec.ts
  2. Then:      python tests/haiku-visual-review.py
  3. Output:    tests/reports/visual-audit-YYYY-MM-DD.md

Cost estimate: ~$0.10–0.30 per full run (40–50 screenshots × Haiku vision pricing)

Requirements: pip install anthropic
Environment:  ANTHROPIC_API_KEY must be set
"""

import os
import sys
import base64
import json
import datetime
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("❌ Missing dependency: pip install anthropic")
    sys.exit(1)

# ── CONFIG ──────────────────────────────────────────────────────────────────
SCREENSHOTS_DIR = Path(__file__).parent / "screenshots"
REPORTS_DIR     = Path(__file__).parent / "reports"
MODEL           = "claude-haiku-4-5"
MAX_TOKENS      = 1024

REPORTS_DIR.mkdir(exist_ok=True)

# The checklist Haiku uses to review each screenshot
# Keep it structured so the output is parseable
REVIEW_PROMPT = """You are a senior UX/UI quality reviewer for Cleverli, a Swiss educational app for children ages 6–12.

Review this screenshot carefully and identify any issues. Be specific and actionable.

Check for ALL of the following:

## LAYOUT & VISUAL
- [ ] Text overflow or truncation (text cut off, ellipsis where full text should show)
- [ ] Elements overlapping each other
- [ ] Inconsistent spacing (too tight or too loose between elements)
- [ ] Content clipped or hidden by container edges
- [ ] Misaligned elements (buttons, text, icons not aligned with grid)
- [ ] Broken or missing images/icons (empty boxes, broken img tags, wrong emoji)

## TYPOGRAPHY
- [ ] Text too small to read (especially on mobile)
- [ ] Low contrast text (hard to read against background)
- [ ] Mixed languages in same element (German next to untranslated English)
- [ ] Missing translations (text showing "undefined", "null", "[key]", or raw i18n keys)
- [ ] Swiss German rules broken: "ss" instead of "ß" (gross, heiss, Strasse)

## UX & INTERACTION
- [ ] Unclear call-to-action (what should the user click? Is it obvious?)
- [ ] Buttons that look disabled but should be active (or vice versa)
- [ ] Confusing progress indicators (wrong %, misleading state)
- [ ] Duplicate information shown twice (same number/text repeated)
- [ ] Missing feedback states (empty pages with no content, no loading state)
- [ ] Dead ends (no way to navigate forward/backward)

## CHILDREN'S UX (specific to ages 6–12)
- [ ] Text too complex for children (long sentences, hard words)
- [ ] Icons/emojis that don't match the context
- [ ] Reward/achievement states that seem wrong (gold tick on locked item, 0% but showing complete)
- [ ] Confusing numbers (0/12 in one place, 1/10 somewhere else for same thing)

## DESIGN CONSISTENCY
- [ ] Colors that feel off-brand (Cleverli uses green as primary, blue/yellow/green for subjects)
- [ ] Rounded corners inconsistent with rest of design
- [ ] Card styles inconsistent (some have border, some don't for similar elements)
- [ ] Mobile: elements that work on desktop but look wrong on 390px width

Respond in this exact JSON format:
{
  "page": "<inferred from content>",
  "viewport": "<mobile or desktop>",
  "severity_critical": [
    { "issue": "<specific issue>", "location": "<where on screen>", "fix": "<suggested fix>" }
  ],
  "severity_warning": [
    { "issue": "<specific issue>", "location": "<where on screen>", "fix": "<suggested fix>" }
  ],
  "severity_minor": [
    { "issue": "<specific issue>", "location": "<where on screen>", "fix": "<suggested fix>" }
  ],
  "looks_good": ["<thing that looks correct>"],
  "overall_score": <1-10 where 10=perfect>
}

If nothing is wrong in a category, use an empty array [].
Be concrete — not "text may be hard to read" but "The '7/10 Aufgaben' counter in the footer uses #9ca3af (gray-400) against white background — contrast ratio ~2.1:1, fails WCAG AA".
"""

def encode_image(path: Path) -> str:
    with open(path, "rb") as f:
        return base64.standard_b64encode(f.read()).decode("utf-8")

def review_screenshot(client: anthropic.Anthropic, img_path: Path) -> dict:
    """Send one screenshot to Haiku for review."""
    b64 = encode_image(img_path)
    
    response = client.messages.create(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": REVIEW_PROMPT,
                    }
                ],
            }
        ],
    )
    
    text = response.content[0].text.strip()
    
    # Parse JSON response
    try:
        # Extract JSON from response (may have markdown fences)
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return json.loads(text)
    except json.JSONDecodeError:
        return {
            "page": img_path.stem,
            "parse_error": text[:500],
            "severity_critical": [],
            "severity_warning": [],
            "severity_minor": [],
            "looks_good": [],
            "overall_score": 0
        }

def format_report(results: list[dict], date_str: str) -> str:
    """Format all results into a readable markdown report."""
    
    # Collect all issues
    all_critical = []
    all_warnings = []
    all_minors = []
    low_scores = []
    
    for r in results:
        page = r.get("page", "unknown")
        vp = r.get("viewport", "")
        prefix = f"**[{page} | {vp}]**"
        
        for issue in r.get("severity_critical", []):
            all_critical.append({ **issue, "source": f"{page} | {vp}" })
        for issue in r.get("severity_warning", []):
            all_warnings.append({ **issue, "source": f"{page} | {vp}" })
        for issue in r.get("severity_minor", []):
            all_minors.append({ **issue, "source": f"{page} | {vp}" })
        
        score = r.get("overall_score", 10)
        if score < 7:
            low_scores.append((page, vp, score))
    
    total_screens = len(results)
    total_issues = len(all_critical) + len(all_warnings) + len(all_minors)
    avg_score = sum(r.get("overall_score", 10) for r in results) / max(len(results), 1)
    
    lines = [
        f"# 🔍 Cleverli Visual Audit — {date_str}",
        f"",
        f"**Screens reviewed:** {total_screens} | **Total issues:** {total_issues} | **Avg score:** {avg_score:.1f}/10",
        f"",
    ]
    
    if all_critical:
        lines += [
            "---",
            "## 🔴 Critical Issues (fix before shipping)",
            "",
        ]
        for i in all_critical:
            lines.append(f"- **[{i['source']}]** {i['issue']}")
            lines.append(f"  - 📍 {i.get('location', '?')} → 🔧 {i.get('fix', '?')}")
            lines.append("")
    
    if all_warnings:
        lines += [
            "---",
            "## 🟡 Warnings (should fix soon)",
            "",
        ]
        for i in all_warnings:
            lines.append(f"- **[{i['source']}]** {i['issue']}")
            lines.append(f"  - 📍 {i.get('location', '?')} → 🔧 {i.get('fix', '?')}")
            lines.append("")
    
    if all_minors:
        lines += [
            "---",
            "## 🔵 Minor / Cosmetic",
            "",
        ]
        for i in all_minors[:20]:  # cap to avoid overwhelming
            lines.append(f"- **[{i['source']}]** {i['issue']}")
        lines.append("")
    
    if low_scores:
        lines += [
            "---",
            "## 📊 Pages needing most attention",
            "",
        ]
        for page, vp, score in sorted(low_scores, key=lambda x: x[2]):
            lines.append(f"- `{page}` [{vp}] — score **{score}/10**")
        lines.append("")
    
    lines += [
        "---",
        "## 📋 Per-page scores",
        "",
        "| Page | Viewport | Score | Critical | Warnings |",
        "|------|----------|-------|----------|----------|",
    ]
    for r in sorted(results, key=lambda x: x.get("overall_score", 10)):
        lines.append(
            f"| {r.get('page','?')} | {r.get('viewport','?')} | "
            f"{r.get('overall_score','?')}/10 | "
            f"{len(r.get('severity_critical',[]))} | "
            f"{len(r.get('severity_warning',[]))} |"
        )
    
    return "\n".join(lines)

def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("❌ ANTHROPIC_API_KEY not set")
        sys.exit(1)
    
    screenshots = sorted(SCREENSHOTS_DIR.glob("*.png"))
    if not screenshots:
        print(f"❌ No screenshots found in {SCREENSHOTS_DIR}")
        print("   Run first: npx playwright test 18-all-routes-screenshot.spec.ts")
        sys.exit(1)
    
    # Optional: filter by viewport or page via CLI args
    filter_term = sys.argv[1] if len(sys.argv) > 1 else None
    if filter_term:
        screenshots = [s for s in screenshots if filter_term in s.name]
        print(f"🔍 Filtered to {len(screenshots)} screenshots matching '{filter_term}'")
    
    print(f"📸 Found {len(screenshots)} screenshots")
    print(f"🤖 Reviewing with {MODEL}...")
    print()
    
    client = anthropic.Anthropic(api_key=api_key)
    results = []
    
    for i, img_path in enumerate(screenshots, 1):
        print(f"  [{i:2d}/{len(screenshots)}] {img_path.name} ...", end="", flush=True)
        try:
            result = review_screenshot(client, img_path)
            # Inject filename metadata
            result["_file"] = img_path.name
            if "viewport" not in result:
                result["viewport"] = "mobile" if "mobile--" in img_path.name else "desktop"
            results.append(result)
            
            critical = len(result.get("severity_critical", []))
            warnings = len(result.get("severity_warning", []))
            score    = result.get("overall_score", "?")
            indicator = "🔴" if critical > 0 else ("🟡" if warnings > 0 else "✅")
            print(f" {indicator} {score}/10  ({critical} critical, {warnings} warnings)")
        except Exception as e:
            print(f" ❌ Error: {e}")
            results.append({
                "_file": img_path.name,
                "page": img_path.stem,
                "error": str(e),
                "severity_critical": [],
                "severity_warning": [],
                "severity_minor": [],
                "looks_good": [],
                "overall_score": 0
            })
    
    date_str = datetime.date.today().isoformat()
    report_md = format_report(results, date_str)
    report_json = json.dumps(results, ensure_ascii=False, indent=2)
    
    md_path   = REPORTS_DIR / f"visual-audit-{date_str}.md"
    json_path = REPORTS_DIR / f"visual-audit-{date_str}.json"
    
    md_path.write_text(report_md, encoding="utf-8")
    json_path.write_text(report_json, encoding="utf-8")
    
    print()
    print(f"✅ Done! Reports saved:")
    print(f"   📄 {md_path}")
    print(f"   📊 {json_path}")
    print()
    
    # Print summary
    total_critical = sum(len(r.get("severity_critical", [])) for r in results)
    total_warnings = sum(len(r.get("severity_warning", [])) for r in results)
    avg_score = sum(r.get("overall_score", 10) for r in results) / max(len(results), 1)
    
    print(f"📊 Summary: {total_critical} critical · {total_warnings} warnings · avg score {avg_score:.1f}/10")
    
    if total_critical > 0:
        print()
        print("🔴 Critical issues:")
        for r in results:
            for issue in r.get("severity_critical", []):
                print(f"   [{r.get('page','?')}] {issue.get('issue','?')}")

if __name__ == "__main__":
    main()
