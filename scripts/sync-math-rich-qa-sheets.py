#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BASE = "https://gateway.maton.ai/google-sheets/v4/spreadsheets"
KEYCHAIN_SERVICE = "openclaw-maton-personal-gmail"
KEYCHAIN_ACCOUNT = "riccardogosteli@gmail.com"
SPECIAL_TYPES = {"counting", "matching", "memory", "drag-drop", "number-line", "word-search"}
SHEETS = {
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
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=120) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 5:
                raise
            retry_after = error.headers.get("Retry-After")
            time.sleep(float(retry_after) if retry_after else min(2**attempt, 16))
        except (TimeoutError, urllib.error.URLError):
            if attempt == 5:
                raise
            time.sleep(min(2**attempt, 16))
    raise RuntimeError("unreachable")


def values_get(spreadsheet_id: str, range_: str) -> list[list]:
    encoded = urllib.parse.quote(range_, safe="")
    return request("GET", f"{BASE}/{spreadsheet_id}/values/{encoded}").get("values", [])


def append_values(spreadsheet_id: str, range_: str, rows: list[list]) -> None:
    if not rows:
        return
    encoded = urllib.parse.quote(range_, safe="")
    request(
        "POST",
        f"{BASE}/{spreadsheet_id}/values/{encoded}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS",
        {"majorDimension": "ROWS", "values": rows},
    )


def update_values(spreadsheet_id: str, range_: str, row: list) -> None:
    encoded = urllib.parse.quote(range_, safe="")
    request(
        "PUT",
        f"{BASE}/{spreadsheet_id}/values/{encoded}?valueInputOption=RAW",
        {"majorDimension": "ROWS", "values": [row]},
    )


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


def is_math_rich(row: dict, grade: int) -> bool:
    return row.get("subjectId") == "math" and str(row.get("exerciseId", "")).startswith(f"math{grade}-rich-")


def sync_grade(grade: int, apply: bool) -> dict:
    source = json.loads(Path(f"/tmp/cleverli-grade-{grade}-qa.json").read_text())
    rows = [row for row in source["rows"] if is_math_rich(row, grade)]
    special_rows = [row for row in rows if row["type"] in SPECIAL_TYPES]
    spreadsheet_id = SHEETS[grade]
    main_tab = f"Grade {grade} QA"

    existing_main_rows = values_get(spreadsheet_id, f"'{main_tab}'!A:M")
    existing_special_rows = values_get(spreadsheet_id, "'Special exercises'!A:J")
    existing_main_ids = {str(row[0]) for row in existing_main_rows[1:] if row}
    existing_special_ids = {str(row[0]) for row in existing_special_rows[1:] if row}
    existing_main_by_id = {str(row[0]): (index + 2, row) for index, row in enumerate(existing_main_rows[1:]) if row}
    existing_special_by_id = {str(row[0]): (index + 2, row) for index, row in enumerate(existing_special_rows[1:]) if row}

    missing_main = [row for row in rows if row["exerciseId"] not in existing_main_ids]
    missing_special = [row for row in special_rows if row["exerciseId"] not in existing_special_ids]
    main_updates = [
        (existing_main_by_id[row["exerciseId"]][0], main_values(row))
        for row in rows
        if row["exerciseId"] in existing_main_by_id
        and [str(value) for value in existing_main_by_id[row["exerciseId"]][1] + [""] * 13][:13] != [str(value) for value in main_values(row)]
    ]
    special_updates = [
        (existing_special_by_id[row["exerciseId"]][0], special_values(row))
        for row in special_rows
        if row["exerciseId"] in existing_special_by_id
        and [str(value) for value in existing_special_by_id[row["exerciseId"]][1] + [""] * 10][:10] != [str(value) for value in special_values(row)]
    ]

    if apply:
        append_values(spreadsheet_id, f"'{main_tab}'!A:M", [main_values(row) for row in missing_main])
        append_values(spreadsheet_id, "'Special exercises'!A:J", [special_values(row) for row in missing_special])
        for row_index, values in main_updates:
            update_values(spreadsheet_id, f"'{main_tab}'!A{row_index}:M{row_index}", values)
        for row_index, values in special_updates:
            update_values(spreadsheet_id, f"'Special exercises'!A{row_index}:J{row_index}", values)

    reread_main_rows = values_get(spreadsheet_id, f"'{main_tab}'!A:M")
    reread_special_rows = values_get(spreadsheet_id, "'Special exercises'!A:J")
    reread_main_ids = {str(row[0]) for row in reread_main_rows[1:] if row}
    reread_special_ids = {str(row[0]) for row in reread_special_rows[1:] if row}
    reread_main_by_id = {str(row[0]): row for row in reread_main_rows[1:] if row}
    reread_special_by_id = {str(row[0]): row for row in reread_special_rows[1:] if row}

    missing_after_main = [row["exerciseId"] for row in rows if row["exerciseId"] not in reread_main_ids]
    missing_after_special = [row["exerciseId"] for row in special_rows if row["exerciseId"] not in reread_special_ids]
    stale_main = [
        row["exerciseId"]
        for row in rows
        if row["exerciseId"] in reread_main_by_id
        and [str(value) for value in reread_main_by_id[row["exerciseId"]] + [""] * 13][:13] != [str(value) for value in main_values(row)]
    ]
    stale_special = [
        row["exerciseId"]
        for row in special_rows
        if row["exerciseId"] in reread_special_by_id
        and [str(value) for value in reread_special_by_id[row["exerciseId"]] + [""] * 10][:10] != [str(value) for value in special_values(row)]
    ]

    return {
        "mathRichRows": len(rows),
        "mathRichSpecialRows": len(special_rows),
        "plannedMainAppends": len(missing_main),
        "plannedSpecialAppends": len(missing_special),
        "plannedMainUpdates": len(main_updates),
        "plannedSpecialUpdates": len(special_updates),
        "missingAfterMain": len(missing_after_main),
        "missingAfterSpecial": len(missing_after_special),
        "staleMain": len(stale_main),
        "staleSpecial": len(stale_special),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--grades", nargs="+", type=int, choices=range(3, 7), default=[3, 4, 5, 6])
    args = parser.parse_args()
    summary = {grade: sync_grade(grade, args.apply) for grade in args.grades}
    print(json.dumps({"applied": args.apply, "grades": summary}, indent=2))
    if args.apply and any(result["missingAfterMain"] or result["missingAfterSpecial"] or result["staleMain"] or result["staleSpecial"] for result in summary.values()):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
