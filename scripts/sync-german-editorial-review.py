#!/usr/bin/env python3
"""Write the final German-source review verdicts to the six QA Sheets.

Only reviewer-owned columns N:T and new rows in `Audit findings` are touched.
Exercise source columns A:M are read and verified, never written.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
from collections import defaultdict
from pathlib import Path


REVIEW_PATH = Path("/tmp/cleverli-german-editorial-review.json")
REVIEWER = "Cleverli final German audit"
REVIEW_DATE = "2026-08-28"
AUDIT_MARKER = "Final German audit 2026-08-28"


def load_sync_module():
    path = Path(__file__).with_name("sync-all-qa-sheets.py")
    spec = importlib.util.spec_from_file_location("cleverli_sheet_sync", path)
    if spec is None or spec.loader is None:
        raise RuntimeError("Could not load Sheet helper")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def key(item: dict) -> str:
    return f"{item['grade']}/{item['subjectId']}/{item['topicId']}/{item['exerciseId']}"


def verdict(review: dict) -> list[str]:
    findings = review["findings"]
    high = any(item["severity"] == "High" for item in findings)
    language_issue = any(item["category"].startswith(("Language", "Swiss", "Correctness / hint")) for item in findings)
    notes = (
        "; ".join(f"[{item['severity']}] {item['category']}: {item['detail']}" for item in findings)
        if findings
        else "Final German-source audit: content, answer, options, hints, interaction scoring, voice preprocessing and LP21 fit checked; no issue found."
    )
    return [
        review["lp21Value"],
        "Issue found" if high else "Correct",
        "Needs work" if language_issue else "Good",
        notes,
        "Fix" if findings else "Approved",
        REVIEWER,
        REVIEW_DATE,
    ]


def audit_rows(grade: int, reviews: list[dict]) -> list[list[str]]:
    grouped: dict[str, list[tuple[dict, dict]]] = defaultdict(list)
    for review in reviews:
        for finding in review["findings"]:
            grouped[finding["category"]].append((review, finding))
    rows = []
    for category, entries in sorted(grouped.items()):
        severity = "High" if any(finding["severity"] == "High" for _, finding in entries) else "Medium"
        unique = {key(review): review for review, _ in entries}
        samples = [f"{review['topicId']}/{review['exerciseId']}" for review in list(unique.values())[:8]]
        details = sorted({finding["detail"] for _, finding in entries})
        rows.append([
            severity,
            f"{AUDIT_MARKER}: {category}",
            "All",
            f"{len(unique)} affected; examples: {', '.join(samples)}",
            " ".join(details[:5]),
            "Filter the main QA tab to Decision = Fix, repair every marked row without changing IDs, then rerun the complete audit and independently reread the Sheet.",
        ])
    clean = sum(not review["findings"] for review in reviews)
    rows.append([
        "Review",
        f"{AUDIT_MARKER}: completion",
        "All",
        f"{len(reviews)} exercises; {clean} clean; {len(reviews) - clean} marked Fix",
        "Every source exercise and every learner-facing source field received an explicit row-level verdict in columns N:T.",
        "Use this review as the repair backlog; do not treat a structural pass as editorial approval.",
    ])
    return rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    sync = load_sync_module()
    report = json.loads(REVIEW_PATH.read_text())
    reviews_by_key = {key(review): review for review in report["reviews"]}
    if len(reviews_by_key) != 13_918:
        raise RuntimeError(f"Expected 13,918 unique reviews, got {len(reviews_by_key)}")

    summary = {}
    for grade, spreadsheet_id in sync.SHEETS.items():
        source = json.loads(Path(f"/tmp/cleverli-grade-{grade}-qa.json").read_text())
        source_rows = source["rows"]
        tab = f"Grade {grade} QA"
        sheet_rows = sync.values_get(spreadsheet_id, f"'{tab}'!A1:T{len(source_rows) + 1}")
        expected_header = [
            "LP21 fit (1–5)", "Correctness", "Language", "Reviewer notes",
            "Decision", "Reviewed by", "Reviewed date",
        ]
        if sync.normalize(sheet_rows[0][13:], 7) != expected_header:
            raise RuntimeError(f"Grade {grade}: unexpected reviewer header")
        if len(sheet_rows) != len(source_rows) + 1:
            raise RuntimeError(f"Grade {grade}: Sheet/source row count differs")

        updates = []
        expected_values = []
        grade_reviews = []
        for sheet_row, (actual, source_row) in enumerate(zip(sheet_rows[1:], source_rows), start=2):
            if sync.normalize(actual, 1)[0] != source_row["exerciseId"]:
                raise RuntimeError(f"Grade {grade} row {sheet_row}: exercise ID/order mismatch")
            review_key = f"{grade}/{source_row['subjectId']}/{source_row['topicId']}/{source_row['exerciseId']}"
            review = reviews_by_key.get(review_key)
            if review is None:
                raise RuntimeError(f"Missing review: {review_key}")
            grade_reviews.append(review)
            expected = verdict(review)
            expected_values.append(expected)
            if sync.normalize(actual[13:], 7) != expected:
                updates.append({"range": f"'{tab}'!N{sheet_row}:T{sheet_row}", "values": [expected]})

        existing_audit = sync.values_get(spreadsheet_id, "'Audit findings'!A1:F200")
        summaries = audit_rows(grade, grade_reviews)
        existing_normalized = {tuple(sync.normalize(row, 6)) for row in existing_audit}
        existing_marker_rows = [row for row in existing_audit if any(AUDIT_MARKER in str(cell) for cell in row)]
        if existing_marker_rows and any(tuple(summary) not in existing_normalized for summary in summaries):
            raise RuntimeError(f"Grade {grade}: existing final-audit summaries do not match the current report")
        summaries_to_append = [] if existing_marker_rows else summaries
        if args.apply:
            sync.batch_write(spreadsheet_id, updates)
            sync.append_values(spreadsheet_id, "'Audit findings'!A:F", summaries_to_append)

        reread = sync.values_get(spreadsheet_id, f"'{tab}'!N1:T{len(source_rows) + 1}")
        mismatches = sum(sync.normalize(actual, 7) != expected for actual, expected in zip(reread[1:], expected_values))
        if args.apply and len(reread) != len(source_rows) + 1:
            mismatches += abs(len(reread) - (len(source_rows) + 1))
        summary[grade] = {
            "rows": len(source_rows),
            "plannedReviewerUpdates": len(updates),
            "plannedAuditRows": len(summaries_to_append),
            "reviewerMismatchesAfterRun": mismatches,
            "fix": sum(bool(review["findings"]) for review in grade_reviews),
            "approved": sum(not review["findings"] for review in grade_reviews),
        }

    result = {"applied": args.apply, "grades": summary}
    Path("/tmp/cleverli-german-sheet-sync.json").write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps(result, ensure_ascii=False, indent=2), flush=True)
    if args.apply and any(item["reviewerMismatchesAfterRun"] for item in summary.values()):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
