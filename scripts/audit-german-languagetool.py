#!/usr/bin/env python3
"""Run every German-source exercise text through LanguageTool de-CH.

This is candidate generation only. Every match must be adjudicated before it is
written to the QA Sheets; LanguageTool false positives are never auto-labelled.
"""

from __future__ import annotations

import json
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


OUTPUT = Path("/tmp/cleverli-german-languagetool-v2.json")
MAX_BATCH_CHARS = 12_000
GERMAN_SUBJECTS = {"math", "german", "science"}


def load_rows() -> list[dict]:
    rows: list[dict] = []
    for grade in range(1, 7):
        rows.extend(json.loads(Path(f"/tmp/cleverli-grade-{grade}-qa.json").read_text())["rows"])
    return rows


def fields(row: dict) -> list[tuple[str, str]]:
    exercise = row["exercise"]
    values: list[tuple[str, str]] = [
        ("question", exercise.get("question", "")),
        ("listeningText", exercise.get("listeningText", "")),
        ("answer", exercise.get("answer", "")),
    ]
    values.extend((f"option{index + 1}", value) for index, value in enumerate(exercise.get("options", [])))
    values.extend((f"hint{index + 1}", value) for index, value in enumerate(exercise.get("hints", [])))
    values.extend((f"criterion{index + 1}", value) for index, value in enumerate(exercise.get("reviewCriteria", [])))
    values.extend((f"pair{index + 1}", value.get("label", "")) for index, value in enumerate(exercise.get("pairs", [])))
    values.extend((f"dragItem{index + 1}", value.get("label", "")) for index, value in enumerate(exercise.get("dragItems", [])))
    values.extend((f"dropZone{index + 1}", value.get("label", "")) for index, value in enumerate(exercise.get("dropZones", [])))
    return [(name, str(value).strip()) for name, value in values if str(value).strip()]


def batches(rows: list[dict]):
    current_text = ""
    current_segments: list[dict] = []
    for row in rows:
        if row["subjectId"] not in GERMAN_SUBJECTS:
            continue
        for field, value in fields(row):
            # LanguageTool offsets are UTF-16 code units. Replacing non-BMP
            # pictographs with one BMP space keeps its offsets identical to
            # Python string indexes without changing the linguistic text.
            sanitized = "".join(character if ord(character) <= 0xFFFF else " " for character in value)
            line = sanitized.replace("\n", " ").strip() + "\n\n"
            if current_text and len(current_text) + len(line) > MAX_BATCH_CHARS:
                yield current_text, current_segments
                current_text = ""
                current_segments = []
            start = len(current_text)
            current_text += line
            current_segments.append({
                "start": start,
                "end": start + len(line) - 1,
                "grade": row["grade"],
                "subject": row["subjectId"],
                "topic": row["topicId"],
                "exerciseId": row["exerciseId"],
                "field": field,
                "text": sanitized,
            })
    if current_text:
        yield current_text, current_segments


def check(text: str) -> dict:
    data = urllib.parse.urlencode({
        "language": "de-CH",
        "enabledOnly": "false",
        "text": text,
    }).encode()
    request = urllib.request.Request("https://api.languagetool.org/v2/check", data=data)
    for attempt in range(8):
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            if error.code not in {429, 500, 502, 503, 504} or attempt == 7:
                raise
            time.sleep(min(60, 8 * (attempt + 1)))
        except (TimeoutError, urllib.error.URLError):
            if attempt == 7:
                raise
            time.sleep(min(30, 4 * (attempt + 1)))
    raise RuntimeError("LanguageTool retry loop exhausted")


def main() -> None:
    rows = load_rows()
    output = {"rowsReviewed": len(rows), "germanSourceRows": 0, "batches": 0, "matches": []}
    if OUTPUT.exists():
        saved = json.loads(OUTPUT.read_text())
        if saved.get("rowsReviewed") == len(rows):
            output = saved
    output["germanSourceRows"] = sum(row["subjectId"] in GERMAN_SUBJECTS for row in rows)
    prepared = list(batches(rows))
    remaining = [
        (batch_index, text, segments)
        for batch_index, (text, segments) in enumerate(prepared, start=1)
        if batch_index > output["batches"]
    ]

    def run_batch(item):
        batch_index, text, segments = item
        return batch_index, check(text), segments

    with ThreadPoolExecutor(max_workers=4) as executor:
      for batch_index, result, segments in executor.map(run_batch, remaining):
        for match in result.get("matches", []):
            offset = int(match["offset"])
            segment = next((item for item in segments if item["start"] <= offset < item["end"]), None)
            if not segment:
                continue
            relative = offset - segment["start"]
            output["matches"].append({
                **{key: value for key, value in segment.items() if key not in {"start", "end"}},
                "offset": relative,
                "length": match.get("length", 0),
                "matchedText": segment["text"][relative:relative + int(match.get("length", 0))],
                "message": match.get("message", ""),
                "shortMessage": match.get("shortMessage", ""),
                "ruleId": match.get("rule", {}).get("id", ""),
                "category": match.get("rule", {}).get("category", {}).get("id", ""),
                "issueType": match.get("rule", {}).get("issueType", ""),
                "replacements": [item.get("value", "") for item in match.get("replacements", [])[:8]],
            })
        output["batches"] = batch_index
        OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2))
        print(json.dumps({"batch": batch_index, "of": len(prepared), "matches": len(output["matches"])}), flush=True)
        time.sleep(0.1)
    print(json.dumps({key: value for key, value in output.items() if key != "matches"}, ensure_ascii=False))


if __name__ == "__main__":
    main()
