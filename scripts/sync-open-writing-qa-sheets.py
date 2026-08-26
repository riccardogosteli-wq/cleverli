#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import subprocess
import urllib.parse
import urllib.request
from pathlib import Path


BASE = "https://gateway.maton.ai/google-sheets/v4/spreadsheets"
KEYCHAIN_SERVICE = "openclaw-maton-personal-gmail"
KEYCHAIN_ACCOUNT = "riccardogosteli@gmail.com"
MANIFEST = Path("/tmp/cleverli-open-writing-manifest.json")
SHEETS = {
    2: "1Qb-VUEMO5QCcobeoFTz1eCu89CU5PLKOhuMeUJgnbfA",
    3: "1Xk1u_kewI_G7Omv1NZmPG8bL3SuXZaMw7Mco30LnLA0",
    4: "1i7ee3RLYyUD2MmfitXnl8aFvbOO4SpfbUWVACjMmmug",
    5: "12iHojHRu59wfEomKgCsDfNXXnWb-rRfzeVcElSvdkao",
    6: "1BBCz-WZGLFNNB91Wg5YxeMcSHHfFGfn2FPaWI8Oo6V8",
}


def load_key() -> str:
    if os.environ.get("MATON_API_KEY"):
        return os.environ["MATON_API_KEY"]
    return subprocess.check_output(
        [
            "/usr/bin/security",
            "find-generic-password",
            "-a",
            KEYCHAIN_ACCOUNT,
            "-s",
            KEYCHAIN_SERVICE,
            "-w",
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
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.load(response)


def values_get(spreadsheet_id: str, range_: str) -> list[list[str]]:
    encoded = urllib.parse.quote(range_, safe="")
    result = request("GET", f"{BASE}/{spreadsheet_id}/values/{encoded}")
    return result.get("values", [])


def color_key(cell: dict) -> str:
    style = cell.get("effectiveFormat", {}).get("backgroundColorStyle", {})
    return json.dumps(style, sort_keys=True)


manifest = json.loads(MANIFEST.read_text())
rows_by_grade: dict[int, list[dict]] = {}
for row in manifest["rows"]:
    rows_by_grade.setdefault(int(row["grade"]), []).append(row)

summary: dict[int, dict] = {}

for grade, changed_rows in sorted(rows_by_grade.items()):
    spreadsheet_id = SHEETS[grade]
    tab = f"Grade {grade} QA"
    current = values_get(spreadsheet_id, f"{tab}!A1:T4000")
    if not current or current[0][:13] != [
        "Exercise ID", "Subject", "Topic", "Type", "Difficulty", "Question",
        "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Correct answer / solution",
        "Hint 1", "Hint 2",
    ]:
        raise RuntimeError(f"Grade {grade}: unexpected QA header")

    row_lookup: dict[tuple[str, str, str], int] = {}
    for row_number, values in enumerate(current[1:], start=2):
        padded = values + [""] * (3 - len(values))
        lookup_key = (padded[0], padded[1], padded[2])
        if lookup_key in row_lookup:
            raise RuntimeError(f"Grade {grade}: duplicate Sheet lookup key {lookup_key}")
        row_lookup[lookup_key] = row_number

    updates = []
    target_rows: list[int] = []
    expected_values: dict[int, list] = {}
    for row in changed_rows:
        lookup_key = (row["exerciseId"], row["subject"], row["topic"])
        row_number = row_lookup.get(lookup_key)
        if row_number is None:
            raise RuntimeError(f"Grade {grade}: row not found for {lookup_key}")
        options = (row.get("options") or [])[:4]
        values = [
            row["exerciseId"], row["subject"], row["topic"], row["type"], row["difficulty"], row["question"],
            *(options + [""] * (4 - len(options))), row["answer"], *row["hints"][:2],
        ]
        if len(values) != 13:
            raise RuntimeError(f"Grade {grade}: expected 13 values for {lookup_key}")
        updates.append({"range": f"'{tab}'!A{row_number}:M{row_number}", "values": [values]})
        target_rows.append(row_number)
        expected_values[row_number] = values

    request(
        "POST",
        f"{BASE}/{spreadsheet_id}/values:batchUpdate",
        {"valueInputOption": "RAW", "data": updates},
    )

    audit_values = values_get(spreadsheet_id, "Audit findings!A1:F100")
    open_row = next(
        (index for index, values in enumerate(audit_values, start=1) if len(values) > 1 and values[1] == "Open response scoring"),
        None,
    )
    fixed_audit = [
        "Fixed",
        "Open response scoring",
        "English / French / German / NMG",
        "All affected open-response exercises",
        "Open responses no longer require one exact stored sentence. Genuine writing uses guided self-review; ambiguous hybrids now have constrained or alternative answers.",
        "Resolved with LP21 Cycle-2-appropriate scaffolding; source IDs, difficulty and exercise counts preserved.",
    ]
    if open_row is None:
        open_row = len(audit_values) + 1
    encoded_audit = urllib.parse.quote(f"Audit findings!A{open_row}:F{open_row}", safe="")
    request(
        "PUT",
        f"{BASE}/{spreadsheet_id}/values/{encoded_audit}?valueInputOption=RAW",
        {"values": [fixed_audit]},
    )

    reread = values_get(spreadsheet_id, f"{tab}!A1:T4000")
    value_mismatches = []
    for row_number, expected in expected_values.items():
        actual = (reread[row_number - 1] + [""] * 13)[:13]
        normalized_actual = [str(value) for value in actual]
        normalized_expected = [str(value) for value in expected]
        if normalized_actual != normalized_expected:
            value_mismatches.append(row_number)

    if value_mismatches:
        raise RuntimeError(f"Grade {grade}: value mismatches at rows {value_mismatches[:10]}")

    audit_reread = values_get(spreadsheet_id, f"Audit findings!A{open_row}:F{open_row}")
    if audit_reread != [fixed_audit]:
        raise RuntimeError(f"Grade {grade}: audit row verification failed")

    grid_range = urllib.parse.quote(f"'{tab}'!G2:K{len(reread)}", safe="")
    grid = request(
        "GET",
        f"{BASE}/{spreadsheet_id}?includeGridData=true&ranges={grid_range}&fields=sheets.data.startRow,sheets.data.rowData.values.effectiveFormat.backgroundColorStyle",
    )
    data_block = grid["sheets"][0]["data"][0]
    start_row = int(data_block.get("startRow", 0)) + 1
    row_data = data_block.get("rowData", [])
    marker_failures = []
    for row_number in target_rows:
        cells = row_data[row_number - start_row].get("values", [])
        cells += [{}] * (5 - len(cells))
        colors = [color_key(cell) for cell in cells[:5]]
        if not colors[4] or colors[4] == "{}" or any(color == colors[4] for color in colors[:4]):
            marker_failures.append(row_number)
    if marker_failures:
        raise RuntimeError(f"Grade {grade}: green-marker verification failed at rows {marker_failures[:10]}")

    summary[grade] = {
        "rows": len(changed_rows),
        "valueMismatches": 0,
        "greenMarkerMismatches": 0,
        "auditRow": open_row,
    }

print(json.dumps({"ok": True, "grades": summary, "totalRows": sum(item["rows"] for item in summary.values())}, indent=2))
