#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import subprocess
import urllib.parse
import urllib.request
from pathlib import Path


BASE = "https://gateway.maton.ai/google-sheets/v4/spreadsheets"
KEYCHAIN_SERVICE = "openclaw-maton-personal-gmail"
KEYCHAIN_ACCOUNT = "riccardogosteli@gmail.com"
SPECIAL_TYPES = {"counting", "matching", "memory", "drag-drop", "number-line", "word-search"}
SHEETS = {
    1: "1LFx4OcNdsbbXRUnxRXYRB7OViz4aDKD-BhW2-YL9wV0",
    2: "1Qb-VUEMO5QCcobeoFTz1eCu89CU5PLKOhuMeUJgnbfA",
    3: "1Xk1u_kewI_G7Omv1NZmPG8bL3SuXZaMw7Mco30LnLA0",
    4: "1i7ee3RLYyUD2MmfitXnl8aFvbOO4SpfbUWVACjMmmug",
    5: "12iHojHRu59wfEomKgCsDfNXXnWb-rRfzeVcElSvdkao",
    6: "1BBCz-WZGLFNNB91Wg5YxeMcSHHfFGfn2FPaWI8Oo6V8",
}

MAIN_HEADERS = [
    "Exercise ID", "Subject", "Topic", "Type", "Difficulty", "Question",
    "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Correct answer / solution",
    "Hint 1", "Hint 2",
]
SPECIAL_HEADERS = [
    "Exercise ID", "Subject", "Topic", "Type", "Difficulty", "Question",
    "Readable solution", "Technical structure", "Hint 1", "Hint 2",
]
GRADE1_SPECIAL_HEADERS = [
    "Exercise ID", "Subject", "Topic", "Type", "Difficulty", "Question",
    "Items / choices", "Correct solution", "Hint 1", "Hint 2",
]

# Rows whose status/text drifted after later production fixes. Other findings,
# including teacher-review and structural migration items, remain untouched.
AUDIT_UPDATES: dict[int, dict[int, list[str]]] = {
    1: {
        8: [
            "Structural", "IDs", "All", "50 cross-subject ID collisions",
            "50 exercise IDs collide across Mathematics and NMG. Content remains distinguishable by subject/topic, but IDs are not globally unique.",
            "Make IDs globally unique when the schema is next migrated.",
        ],
    },
    3: {
        2: [
            "Fixed", "Malformed spelling", "German", "rechtschreibung/rs16",
            "The prompt previously showed identical spellings and could not be answered meaningfully.",
            "Replaced with a Swiss-German fill-in: “Die Suppe ist sehr ___.” → “heiss”.",
        ],
        3: [
            "Fixed", "Malformed spelling", "German", "rechtschreibung/rs38",
            "The prompt previously asked what replaces ss and answered ss.",
            "Replaced with a clear double-consonant fill-in: “Der Boden ist na___.” → “ss”.",
        ],
    },
    4: {
        2: [
            "Fixed", "Malformed spelling", "German", "rechtschreibung-4/g4d26",
            "The drag/drop categories were previously identical and unusable.",
            "Replaced with a valid Nomen/adjective sorting exercise using six distinct mappings.",
        ],
        6: [
            "Fixed", "Repeated filler", "Mathematics/German", "Multiple topics",
            "The original audit found repeated filler across unrelated topics.",
            "Resolved by the verified 321-row Grade 4 repetition replacement; all affected content is now topic-specific.",
        ],
    },
    5: {
        2: [
            "Fixed", "Swiss spelling", "German", "rechtschreibung-5/rs5-1",
            "The exercise previously gave incorrect guidance about Swiss spelling.",
            "Replaced with an ordinary Swiss spelling task; “heiss” is the valid answer without ss/ß comparison teaching.",
        ],
        3: [
            "Fixed", "Swiss spelling", "German", "rechtschreibung-5/rs5-7",
            "The exercise previously marked the Swiss spelling as incorrect.",
            "Replaced with an ordinary Swiss spelling task; “weiss” is the valid answer without ss/ß comparison teaching.",
        ],
        4: [
            "Fixed", "Repeated filler", "Mathematics/German", "Multiple topics",
            "The original audit found repeated filler across unrelated topics.",
            "Resolved by the verified 304-row Grade 5 repetition replacement; all affected content is now topic-specific.",
        ],
    },
    6: {
        5: [
            "Fixed", "Repeated filler", "Mathematics/German", "Multiple topics",
            "The original audit found repeated filler across unrelated topics.",
            "Resolved by the verified 321-row Grade 6 repetition/duplicate replacement; all affected content is now topic-specific.",
        ],
    },
}


def load_key() -> str:
    if os.environ.get("MATON_API_KEY"):
        return os.environ["MATON_API_KEY"]
    return subprocess.check_output(
        [
            "/usr/bin/security", "find-generic-password", "-a", KEYCHAIN_ACCOUNT,
            "-s", KEYCHAIN_SERVICE, "-w",
        ],
        text=True,
        stderr=subprocess.DEVNULL,
        timeout=10,
    ).strip()


KEY = load_key()


def request(method: str, url: str, payload: dict | None = None) -> dict:
    data = json.dumps(payload, ensure_ascii=False).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {KEY}")
    if data is not None:
        req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=120) as response:
        return json.load(response)


def values_get(spreadsheet_id: str, range_: str) -> list[list]:
    encoded = urllib.parse.quote(range_, safe="")
    return request("GET", f"{BASE}/{spreadsheet_id}/values/{encoded}").get("values", [])


def normalize(values: list, width: int) -> list[str]:
    padded = values + [""] * max(0, width - len(values))
    return [str(value) if value is not None else "" for value in padded[:width]]


def main_values(row: dict) -> list:
    options = (row.get("options") or [])[:4]
    hints = (row.get("hints") or [])[:2]
    return [
        row["exerciseId"], row["subject"], row["topic"], row["type"], row["difficulty"], row["question"],
        *(options + [""] * (4 - len(options))), row["correct"], *(hints + [""] * (2 - len(hints))),
    ]


def special_values(row: dict) -> list:
    hints = (row.get("hints") or [])[:2]
    return [
        row["exerciseId"], row["subject"], row["topic"], row["type"], row["difficulty"], row["question"],
        row["correct"], row.get("structure") or "", *(hints + [""] * (2 - len(hints))),
    ]


def grade1_special_values(row: dict, existing_items: str) -> list:
    hints = (row.get("hints") or [])[:2]
    return [
        row["exerciseId"], row["subject"], row["topic"], row["type"], row["difficulty"], row["question"],
        existing_items, row["correct"], *(hints + [""] * (2 - len(hints))),
    ]


def batch_write(spreadsheet_id: str, updates: list[dict]) -> None:
    for offset in range(0, len(updates), 300):
        request(
            "POST",
            f"{BASE}/{spreadsheet_id}/values:batchUpdate",
            {"valueInputOption": "RAW", "data": updates[offset:offset + 300]},
        )


def is_green(cell: dict) -> bool:
    rgb = cell.get("effectiveFormat", {}).get("backgroundColorStyle", {}).get("rgbColor", {})
    return (
        abs(float(rgb.get("red", -1)) - 0.7764706) < 0.002
        and abs(float(rgb.get("green", -1)) - 0.9372549) < 0.002
        and abs(float(rgb.get("blue", -1)) - 0.80784315) < 0.002
    )


def grid_rows(spreadsheet_id: str, range_: str) -> tuple[int, list[dict]]:
    encoded = urllib.parse.quote(range_, safe="")
    fields = "sheets.data.startRow,sheets.data.rowData.values.effectiveFormat.backgroundColorStyle"
    result = request(
        "GET",
        f"{BASE}/{spreadsheet_id}?includeGridData=true&ranges={encoded}&fields={fields}",
    )
    block = result["sheets"][0]["data"][0]
    return int(block.get("startRow", 0)) + 1, block.get("rowData", [])


def verify_markers(
    spreadsheet_id: str,
    tab: str,
    source_rows: list[dict],
    special: bool = False,
    special_solution_column: int = 7,
) -> list[int]:
    if special:
        end_column = "H" if special_solution_column == 8 else "G"
        start, row_data = grid_rows(spreadsheet_id, f"'{tab}'!G2:{end_column}{len(source_rows) + 1}")
        failures = []
        for sheet_row, _ in enumerate(source_rows, start=2):
            cells = row_data[sheet_row - start].get("values", []) if sheet_row - start < len(row_data) else []
            expected_index = special_solution_column - 7
            cells += [{}] * (expected_index + 1 - len(cells))
            green_columns = [index for index, cell in enumerate(cells) if is_green(cell)]
            if green_columns != [expected_index]:
                failures.append(sheet_row)
        return failures

    start, row_data = grid_rows(spreadsheet_id, f"'{tab}'!G2:K{len(source_rows) + 1}")
    failures = []
    for sheet_row, source in enumerate(source_rows, start=2):
        cells = row_data[sheet_row - start].get("values", []) if sheet_row - start < len(row_data) else []
        cells += [{}] * (5 - len(cells))
        green_columns = [index for index, cell in enumerate(cells[:5]) if is_green(cell)]
        options = (source.get("options") or [])[:4]
        expected = options.index(source["storedAnswer"]) if source["storedAnswer"] in options else 4
        if green_columns != [expected]:
            failures.append(sheet_row)
    return failures


def reconcile_grade(grade: int, apply: bool) -> dict:
    source = json.loads(Path(f"/tmp/cleverli-grade-{grade}-qa.json").read_text())
    source_rows = source["rows"]
    special_rows = [row for row in source_rows if row["type"] in SPECIAL_TYPES]
    spreadsheet_id = SHEETS[grade]
    main_tab = f"Grade {grade} QA"

    current_main = values_get(spreadsheet_id, f"'{main_tab}'!A1:T{len(source_rows) + 1}")
    current_special = values_get(spreadsheet_id, f"'Special exercises'!A1:J{len(special_rows) + 1}")
    if normalize(current_main[0], 13) != MAIN_HEADERS:
        raise RuntimeError(f"Grade {grade}: unexpected main header")
    expected_special_header = GRADE1_SPECIAL_HEADERS if grade == 1 else SPECIAL_HEADERS
    if normalize(current_special[0], 6) != expected_special_header[:6]:
        raise RuntimeError(f"Grade {grade}: unexpected special header")
    if len(current_main) != len(source_rows) + 1:
        raise RuntimeError(f"Grade {grade}: main row count differs ({len(current_main) - 1} vs {len(source_rows)})")
    if len(current_special) != len(special_rows) + 1:
        raise RuntimeError(f"Grade {grade}: special row count differs ({len(current_special) - 1} vs {len(special_rows)})")

    main_updates = []
    for sheet_row, (current, expected_source) in enumerate(zip(current_main[1:], source_rows), start=2):
        expected = main_values(expected_source)
        if normalize(current, 1)[0] != str(expected_source["exerciseId"]):
            raise RuntimeError(f"Grade {grade}: main ordering mismatch at row {sheet_row}")
        if normalize(current, 13) != normalize(expected, 13):
            main_updates.append({"range": f"'{main_tab}'!A{sheet_row}:M{sheet_row}", "values": [expected]})

    special_updates = []
    if normalize(current_special[0], 10) != expected_special_header:
        special_updates.append({"range": "'Special exercises'!A1:J1", "values": [expected_special_header]})
    for sheet_row, (current, expected_source) in enumerate(zip(current_special[1:], special_rows), start=2):
        expected = (
            grade1_special_values(expected_source, normalize(current, 10)[6])
            if grade == 1
            else special_values(expected_source)
        )
        if normalize(current, 1)[0] != str(expected_source["exerciseId"]):
            raise RuntimeError(f"Grade {grade}: special ordering mismatch at row {sheet_row}")
        if normalize(current, 10) != normalize(expected, 10):
            special_updates.append({"range": f"'Special exercises'!A{sheet_row}:J{sheet_row}", "values": [expected]})

    audit_updates = []
    current_audit = values_get(spreadsheet_id, "'Audit findings'!A1:F100")
    for audit_row, expected in AUDIT_UPDATES.get(grade, {}).items():
        actual = current_audit[audit_row - 1] if audit_row <= len(current_audit) else []
        if normalize(actual, 6) != normalize(expected, 6):
            audit_updates.append({"range": f"'Audit findings'!A{audit_row}:F{audit_row}", "values": [expected]})

    if apply:
        batch_write(spreadsheet_id, main_updates + special_updates + audit_updates)

    reread_main = values_get(spreadsheet_id, f"'{main_tab}'!A1:T{len(source_rows) + 1}")
    reread_special = values_get(spreadsheet_id, f"'Special exercises'!A1:J{len(special_rows) + 1}")
    main_mismatches = [
        index for index, (actual, source_row) in enumerate(zip(reread_main[1:], source_rows), start=2)
        if normalize(actual, 13) != normalize(main_values(source_row), 13)
    ]
    special_mismatches = []
    if normalize(reread_special[0], 10) != expected_special_header:
        special_mismatches.append(1)
    for index, (actual, source_row, original) in enumerate(zip(reread_special[1:], special_rows, current_special[1:]), start=2):
        expected = (
            grade1_special_values(source_row, normalize(original, 10)[6])
            if grade == 1
            else special_values(source_row)
        )
        if normalize(actual, 10) != normalize(expected, 10):
            special_mismatches.append(index)
    audit_mismatches = []
    reread_audit = values_get(spreadsheet_id, "'Audit findings'!A1:F100")
    for audit_row, expected in AUDIT_UPDATES.get(grade, {}).items():
        actual = reread_audit[audit_row - 1] if audit_row <= len(reread_audit) else []
        if normalize(actual, 6) != normalize(expected, 6):
            audit_mismatches.append(audit_row)

    marker_failures = verify_markers(spreadsheet_id, main_tab, source_rows)
    special_marker_failures = verify_markers(
        spreadsheet_id,
        "Special exercises",
        special_rows,
        special=True,
        special_solution_column=8 if grade == 1 else 7,
    )
    return {
        "mainRows": len(source_rows),
        "specialRows": len(special_rows),
        "plannedMainUpdates": len(main_updates),
        "plannedSpecialUpdates": len(special_updates),
        "plannedAuditUpdates": len(audit_updates),
        "mainMismatches": len(main_mismatches),
        "specialMismatches": len(special_mismatches),
        "auditMismatches": len(audit_mismatches),
        "greenMarkerMismatches": len(marker_failures),
        "specialGreenMarkerMismatches": len(special_marker_failures),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Write mismatched production-owned cells and stale audit rows")
    args = parser.parse_args()
    summary = {grade: reconcile_grade(grade, args.apply) for grade in range(1, 7)}
    print(json.dumps({"applied": args.apply, "grades": summary}, indent=2))
    if any(
        result[key]
        for result in summary.values()
        for key in (
            "mainMismatches", "specialMismatches", "auditMismatches",
            "greenMarkerMismatches", "specialGreenMarkerMismatches",
        )
    ):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
