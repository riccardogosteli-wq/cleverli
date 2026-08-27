#!/usr/bin/env python3
from __future__ import annotations

import argparse
import importlib.util
import json
from collections import defaultdict
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_REPORT = Path("/tmp/cleverli-lp21-fit-all.json")


def load_sheet_helper():
    path = PROJECT_ROOT / "scripts" / "sync-all-qa-sheets.py"
    spec = importlib.util.spec_from_file_location("qa_sheet_sync", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def normalize(value: object) -> str:
    return str(value or "").strip()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--grades", nargs="+", type=int, choices=range(1, 7), default=list(range(1, 7)))
    args = parser.parse_args()

    helper = load_sheet_helper()
    report = json.loads(args.report.read_text())
    if report.get("total") != 13_518:
        raise RuntimeError(f"Expected 13,518 LP21 reviews, found {report.get('total')}")
    fits_by_grade: dict[int, list[dict]] = defaultdict(list)
    for fit in report["fits"]:
        fits_by_grade[int(fit["grade"])].append(fit)

    summary: dict[int, dict[str, int]] = {}
    for grade in args.grades:
        fits = sorted(fits_by_grade[grade], key=lambda fit: int(fit["row"]))
        expected_rows = list(range(2, len(fits) + 2))
        actual_rows = [int(fit["row"]) for fit in fits]
        if actual_rows != expected_rows:
            raise RuntimeError(f"Grade {grade}: LP21 report rows are not contiguous")

        spreadsheet_id = helper.SHEETS[grade]
        tab = f"Grade {grade} QA"
        current = helper.values_get(spreadsheet_id, f"'{tab}'!A1:N{len(fits) + 1}")
        if not current or normalize(current[0][0] if current[0] else "") != "Exercise ID":
            raise RuntimeError(f"Grade {grade}: unexpected Sheet header")

        protected_conflicts: list[int] = []
        id_mismatches: list[int] = []
        value_mismatches: list[int] = []
        for fit in fits:
            row_number = int(fit["row"])
            row = current[row_number - 1] if row_number <= len(current) else []
            actual_id = normalize(row[0] if row else "")
            actual_fit = normalize(row[13] if len(row) > 13 else "")
            expected_fit = normalize(fit["sheetValue"])
            if actual_id != normalize(fit["exerciseId"]):
                id_mismatches.append(row_number)
            if actual_fit != expected_fit:
                value_mismatches.append(row_number)
            if actual_fit and actual_fit != expected_fit:
                protected_conflicts.append(row_number)

        if id_mismatches:
            raise RuntimeError(f"Grade {grade}: exercise-ID mismatches at rows {id_mismatches[:20]}")
        if protected_conflicts:
            raise RuntimeError(f"Grade {grade}: existing LP21 fit values would be overwritten at rows {protected_conflicts[:20]}")

        if args.apply:
            values = [["LP21 fit (1–5)"]] + [[fit["sheetValue"]] for fit in fits]
            helper.batch_write(spreadsheet_id, [{
                "range": f"'{tab}'!N1:N{len(fits) + 1}",
                "values": values,
            }])

        reread = helper.values_get(spreadsheet_id, f"'{tab}'!A1:N{len(fits) + 1}")
        readback_mismatches: list[int] = []
        expected_header = "LP21 fit (1–5)" if args.apply else normalize(current[0][13] if len(current[0]) > 13 else "")
        if normalize(reread[0][13] if len(reread[0]) > 13 else "") != expected_header:
            readback_mismatches.append(1)
        for fit in fits:
            row_number = int(fit["row"])
            row = reread[row_number - 1] if row_number <= len(reread) else []
            actual_fit = normalize(row[13] if len(row) > 13 else "")
            expected_fit = normalize(fit["sheetValue"]) if args.apply else normalize(current[row_number - 1][13] if len(current[row_number - 1]) > 13 else "")
            if normalize(row[0] if row else "") != normalize(fit["exerciseId"]) or actual_fit != expected_fit:
                readback_mismatches.append(row_number)

        summary[grade] = {
            "rows": len(fits),
            "plannedWrites": len(value_mismatches),
            "protectedConflicts": len(protected_conflicts),
            "idMismatches": len(id_mismatches),
            "readbackMismatches": len(readback_mismatches),
        }

    print(json.dumps({"applied": args.apply, "summary": summary}, indent=2))
    if any(item["idMismatches"] or item["protectedConflicts"] or item["readbackMismatches"] for item in summary.values()):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
