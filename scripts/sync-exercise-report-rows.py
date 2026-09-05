#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import subprocess
import time
import urllib.parse
import urllib.request
import urllib.error
from pathlib import Path


BASE = "https://gateway.maton.ai/google-sheets/v4/spreadsheets"
KEYCHAIN_SERVICE = "openclaw-maton-personal-gmail"
KEYCHAIN_ACCOUNT = "riccardogosteli@gmail.com"
SHEETS = {
    1: "1LFx4OcNdsbbXRUnxRXYRB7OViz4aDKD-BhW2-YL9wV0",
    2: "1Qb-VUEMO5QCcobeoFTz1eCu89CU5PLKOhuMeUJgnbfA",
    3: "1Xk1u_kewI_G7Omv1NZmPG8bL3SuXZaMw7Mco30LnLA0",
    4: "1i7ee3RLYyUD2MmfitXnl8aFvbOO4SpfbUWVACjMmmug",
    5: "12iHojHRu59wfEomKgCsDfNXXnWb-rRfzeVcElSvdkao",
    6: "1BBCz-WZGLFNNB91Wg5YxeMcSHHfFGfn2FPaWI8Oo6V8",
}
REPORT_HEADERS = ["Report status", "Reported at", "Report reason", "Correction made", "Fixed at", "Retest URL"]


def load_key() -> str:
    if os.environ.get("MATON_API_KEY"):
        return os.environ["MATON_API_KEY"]
    return subprocess.check_output(
        ["/usr/bin/security", "find-generic-password", "-a", KEYCHAIN_ACCOUNT, "-s", KEYCHAIN_SERVICE, "-w"],
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
                try:
                    print(error.read().decode("utf-8", errors="replace"))
                except Exception:
                    pass
                raise
            retry_after = error.headers.get("Retry-After")
            time.sleep(float(retry_after) if retry_after else min(2 ** attempt, 16))
        except (TimeoutError, urllib.error.URLError):
            if attempt == 5:
                raise
            time.sleep(min(2 ** attempt, 16))
    raise RuntimeError("unreachable")


def values_get(spreadsheet_id: str, range_: str) -> list[list]:
    encoded = urllib.parse.quote(range_, safe="")
    return request("GET", f"{BASE}/{spreadsheet_id}/values/{encoded}").get("values", [])


def batch_write(spreadsheet_id: str, updates: list[dict]) -> None:
    for offset in range(0, len(updates), 300):
        request(
            "POST",
            f"{BASE}/{spreadsheet_id}/values:batchUpdate",
            {"valueInputOption": "RAW", "data": updates[offset:offset + 300]},
        )


def sheet_id(spreadsheet_id: str, title: str) -> int:
    result = request("GET", f"{BASE}/{spreadsheet_id}?fields=sheets.properties(sheetId,title)")
    for sheet in result.get("sheets", []):
        properties = sheet.get("properties", {})
        if properties.get("title") == title:
            return int(properties["sheetId"])
    raise RuntimeError(f"Missing sheet tab: {title}")


def sheet_properties(spreadsheet_id: str, title: str) -> tuple[int, int]:
    result = request("GET", f"{BASE}/{spreadsheet_id}?fields=sheets.properties(sheetId,title,gridProperties.columnCount)")
    for sheet in result.get("sheets", []):
        properties = sheet.get("properties", {})
        if properties.get("title") == title:
            return int(properties["sheetId"]), int(properties.get("gridProperties", {}).get("columnCount", 0))
    raise RuntimeError(f"Missing sheet tab: {title}")


def ensure_columns(spreadsheet_id: str, tab_id: int, current_count: int, needed_count: int) -> None:
    if current_count >= needed_count:
        return
    request("POST", f"{BASE}/{spreadsheet_id}:batchUpdate", {"requests": [{
        "appendDimension": {
            "sheetId": tab_id,
            "dimension": "COLUMNS",
            "length": needed_count - current_count,
        }
    }]})


def main_values(row: dict) -> list:
    options = (row.get("options") or [])[:4]
    hints = (row.get("hints") or [])[:2]
    return [
        row["exerciseId"], row["subject"], row["topic"], row["type"], row["difficulty"], row["question"],
        *(options + [""] * (4 - len(options))), row["correct"], *(hints + [""] * (2 - len(hints))),
    ]


def report_values(row: dict) -> list:
    return [
        row.get("reportStatus") or "",
        row.get("reportedAt") or "",
        row.get("reportReason") or "",
        row.get("correctionMade") or "",
        row.get("fixedAt") or "",
        row.get("retestUrl") or "",
    ]


def marker_requests(tab_id: int, sheet_row: int, source: dict) -> list[dict]:
    white = {"red": 1, "green": 1, "blue": 1}
    green = {"red": 0.7764706, "green": 0.9372549, "blue": 0.80784315}
    options = (source.get("options") or [])[:4]
    solution_offset = options.index(source["storedAnswer"]) if source["storedAnswer"] in options else 4
    base_range = {"sheetId": tab_id, "startRowIndex": sheet_row - 1, "endRowIndex": sheet_row}
    return [
        {
            "repeatCell": {
                "range": {**base_range, "startColumnIndex": 6, "endColumnIndex": 11},
                "cell": {"userEnteredFormat": {"backgroundColor": white}},
                "fields": "userEnteredFormat.backgroundColor",
            }
        },
        {
            "repeatCell": {
                "range": {**base_range, "startColumnIndex": 6 + solution_offset, "endColumnIndex": 7 + solution_offset},
                "cell": {"userEnteredFormat": {"backgroundColor": green}},
                "fields": "userEnteredFormat.backgroundColor",
            }
        },
    ]


def sync_grade(grade: int, apply: bool) -> dict:
    source = json.loads(Path(f"/tmp/cleverli-grade-{grade}-qa.json").read_text())
    reported_rows = [row for row in source["rows"] if row.get("reportStatus")]
    spreadsheet_id = SHEETS[grade]
    tab = f"Grade {grade} QA"
    current_ids = values_get(spreadsheet_id, f"'{tab}'!A1:A")
    row_by_id = {
        str(row[0]): index
        for index, row in enumerate(current_ids, start=1)
        if row
    }

    updates = [{"range": f"'{tab}'!U1:Z1", "values": [REPORT_HEADERS]}]
    format_requests: list[dict] = []
    missing: list[str] = []
    tab_id, column_count = sheet_properties(spreadsheet_id, tab)

    for source_row in reported_rows:
        sheet_row = row_by_id.get(str(source_row["exerciseId"]))
        if not sheet_row:
            missing.append(str(source_row["exerciseId"]))
            continue
        updates.append({"range": f"'{tab}'!A{sheet_row}:M{sheet_row}", "values": [main_values(source_row)]})
        updates.append({"range": f"'{tab}'!U{sheet_row}:Z{sheet_row}", "values": [report_values(source_row)]})
        format_requests.extend(marker_requests(tab_id, sheet_row, source_row))

    if apply:
        ensure_columns(spreadsheet_id, tab_id, column_count, 26)
        batch_write(spreadsheet_id, updates)
        for offset in range(0, len(format_requests), 100):
            request("POST", f"{BASE}/{spreadsheet_id}:batchUpdate", {"requests": format_requests[offset:offset + 100]})

    return {
        "grade": grade,
        "reportedRows": len(reported_rows),
        "plannedValueUpdates": len(updates),
        "plannedFormatUpdates": len(format_requests),
        "missing": missing,
        "applied": apply,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--grades", nargs="+", type=int, choices=sorted(SHEETS), default=sorted(SHEETS))
    args = parser.parse_args()
    print(json.dumps({grade: sync_grade(grade, args.apply) for grade in args.grades}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
