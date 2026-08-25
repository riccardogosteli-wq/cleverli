from __future__ import annotations

import json
import math
import re
import sys
import ast
from collections import defaultdict
from pathlib import Path


def norm(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "").strip().lower())


def content_key(row: dict) -> str:
    return json.dumps(
        [norm(row["question"]), [norm(option) for option in row["options"]], norm(row["storedAnswer"])],
        ensure_ascii=False,
        sort_keys=True,
    )


def numeric(value: object) -> float | None:
    text = str(value or "").replace("'", "").replace("’", "").replace(" ", "")
    match = re.search(r"-?\d+(?:[.,]\d+)?", text)
    return float(match.group().replace(",", ".")) if match else None


def safe_expression(value: str) -> float | None:
    value = value.strip().replace("'", "").replace("’", "").replace("−", "-").replace("×", "*").replace("·", "*").replace("÷", "/")
    value = re.sub(r"(?<=\d),(?=\d)", ".", value)
    value = re.sub(r"(?<=\d)\s*:\s*(?=\d)", "/", value)
    if not re.fullmatch(r"[\d.()+\-*/\s]+", value): return None
    try:
        tree = ast.parse(value, mode="eval")
    except SyntaxError:
        return None
    allowed = (ast.Expression, ast.BinOp, ast.UnaryOp, ast.Constant, ast.Add, ast.Sub, ast.Mult, ast.Div, ast.USub, ast.UAdd)
    if any(not isinstance(node, allowed) for node in ast.walk(tree)): return None
    try:
        return float(eval(compile(tree, "<exercise>", "eval"), {"__builtins__": {}}, {}))
    except (ZeroDivisionError, ValueError, TypeError):
        return None


def numeric_answer(value: object) -> float | None:
    text = str(value or "").strip()
    first = text.split("=")[0].strip()
    expression = re.match(r"^-?[\d'’.,]+(?:\s*/\s*[\d'’.,]+)?", first)
    if expression:
        parsed = safe_expression(expression.group())
        if parsed is not None: return parsed
    return numeric(text)


def calculate(a: str, op: str, b: str) -> float | None:
    left = float(a.replace("'", "").replace("’", "").replace(",", "."))
    right = float(b.replace("'", "").replace("’", "").replace(",", "."))
    if op == "+": return left + right
    if op in {"-", "−"}: return left - right
    if op in {"×", "*", "·"}: return left * right
    if op in {":", "÷", "/"} and right != 0: return left / right
    return None


def arithmetic_candidate(row: dict) -> dict | None:
    question = row["question"]
    answer = numeric_answer(row["storedAnswer"])
    if answer is None:
        return None
    lowered = question.lower()
    if re.search(r"\b\d{1,2}:\d{2}\b", lowered): return None
    expression = None
    equals = re.search(r"([\d'’.,()\s+\-−×*·:÷/]+)\s*=\s*(?:___|\?|…)", lowered)
    if equals: expression = equals.group(1).strip()
    if expression is None:
        prompt = re.search(r"(?:was ist|berechne|rechne)\s*:?[ ]*([\d'’.,()\s+\-−×*·:÷/]+?)(?:\?|$)", lowered)
        if prompt: expression = prompt.group(1).strip()
    if expression:
        expected = safe_expression(expression)
        if expected is not None and not math.isclose(expected, answer, rel_tol=1e-9, abs_tol=1e-9):
            return {"expression": expression, "expected": expected, "answer": row["storedAnswer"]}
    percent = re.search(r"(\d+(?:[.,]\d+)?)\s*%\s+von\s+(\d+(?:[.,]\d+)?)", lowered)
    if percent:
        expected = float(percent.group(1).replace(",", ".")) * float(percent.group(2).replace(",", ".")) / 100
        if not math.isclose(expected, answer, rel_tol=1e-9, abs_tol=1e-9):
            return {"expression": percent.group(0), "expected": expected, "answer": row["storedAnswer"]}
    return None


def location(row: dict) -> dict:
    return {
        "grade": row["grade"], "subject": row["subjectId"], "topic": row["topicId"],
        "id": row["exerciseId"], "question": row["question"], "answer": row["storedAnswer"],
    }


all_rows: list[dict] = []
source_summaries = []
for path_text in sys.argv[1:]:
    data = json.loads(Path(path_text).read_text())
    all_rows.extend(data["rows"])
    source_summaries.append({
        "grade": data["grade"], "rows": len(data["rows"]), "topics": len(data["topics"]),
        "duplicateIds": data["duplicateIds"],
    })

issues: dict[str, list] = defaultdict(list)
duplicates: dict[str, list[dict]] = defaultdict(list)
question_groups: dict[str, list[dict]] = defaultdict(list)

for row in all_rows:
    loc = location(row)
    exercise = row["exercise"]
    question = str(row["question"] or "")
    answer = str(row["storedAnswer"] or "")
    options = [str(value) for value in row["options"]]
    hints = [str(value) for value in row["hints"]]

    duplicates[content_key(row)].append(row)
    question_groups[norm(question)].append(row)

    if not question.strip(): issues["missing_question"].append(loc)
    if not answer.strip(): issues["missing_answer"].append(loc)
    if len(hints) < 2 or any(not hint.strip() for hint in hints[:2]): issues["missing_hints"].append({**loc, "hints": hints})
    if "ß" in question or any("ß" in value for value in [answer, *options, *hints]): issues["eszett"].append(loc)
    if re.search(r"\b(undefined|null|nan)\b", " ".join([question, answer, *options, *hints]), re.I): issues["placeholder_text"].append(loc)
    if re.search(r"\.\.|!!|\?\?|,,", " ".join([question, *hints])): issues["double_punctuation"].append({**loc, "hints": hints})

    if row["type"] == "multiple-choice":
        if answer not in options: issues["answer_not_in_options"].append({**loc, "options": options})
        if len({norm(option) for option in options}) != len(options): issues["duplicate_options"].append({**loc, "options": options})
        if len(options) < 2: issues["too_few_options"].append({**loc, "options": options})

    if row["type"] == "fill-in-blank":
        blank_count = len(re.findall(r"___+", question))
        if blank_count == 0: issues["fill_without_blank"].append(loc)
        if blank_count > 1 and not re.search(r"\bund\b|[,;/]", answer, re.I):
            issues["multiple_blanks_single_answer"].append({**loc, "blanks": blank_count})

    if row["type"] == "number-line":
        minimum, maximum, step = exercise.get("numberMin"), exercise.get("numberMax"), exercise.get("numberStep")
        value = numeric(answer)
        if minimum is None or maximum is None or step is None or value is None or not minimum <= value <= maximum:
            issues["invalid_number_line"].append({**loc, "min": minimum, "max": maximum, "step": step})

    if row["type"] == "drag-drop":
        item_ids = {item["id"] for item in exercise.get("dragItems", [])}
        zone_ids = {zone["id"] for zone in exercise.get("dropZones", [])}
        mappings = exercise.get("dropAnswers", {})
        invalid = [pair for pair in mappings.items() if pair[0] not in item_ids or pair[1] not in zone_ids]
        if invalid or not mappings: issues["invalid_drag_drop"].append({**loc, "invalid": invalid})

    if row["type"] in {"matching", "memory"} and len(exercise.get("pairs", [])) < 2:
        issues["invalid_pairs"].append(loc)
    if row["type"] == "word-search" and (not exercise.get("wordList") or not exercise.get("gridSize")):
        issues["invalid_word_search"].append(loc)

    answer_token = norm(answer)
    if answer_token in {"all", "done"} and any(answer_token in norm(hint) for hint in hints):
        issues["sentinel_hint"].append({**loc, "hints": hints})
    elif len(answer_token) >= 2 and any(answer_token in norm(hint) for hint in hints):
        issues["answer_revealed_in_hint"].append({**loc, "hints": hints})

    if re.fullmatch(r"-?\d+(?:[.,]\d+)?", answer.strip()) and any(re.search(r"wort|buchstab", hint, re.I) for hint in hints):
        issues["numeric_answer_word_hint"].append({**loc, "hints": hints})
    if answer in {">", "<", "="} and any(re.search(r"buchstab", hint, re.I) for hint in hints):
        issues["symbol_answer_letter_hint"].append({**loc, "hints": hints})
    if re.fullmatch(r"\d+\.", answer.strip()) and any(re.search(rf"{re.escape(answer)}\.", hint) for hint in hints):
        issues["ordinal_double_dot_hint"].append({**loc, "hints": hints})

    arithmetic = arithmetic_candidate(row)
    if arithmetic: issues["arithmetic_mismatch_candidate"].append({**loc, **arithmetic})

    if row["subjectId"] not in {"english", "french"}:
        foreign = re.findall(r"\b(?:the|which|what|with|from|before|after|does|has|have|write|count|find|choose|correct|answer|word|sentence)\b", question, re.I)
        if foreign: issues["english_in_german_question"].append({**loc, "tokens": foreign})

for group in duplicates.values():
    if len(group) > 1:
        issues["exact_content_duplicates"].append([location(row) for row in group])

for group in question_groups.values():
    answers = {norm(row["storedAnswer"]) for row in group}
    if len(group) > 1 and len(answers) > 1 and len(norm(group[0]["question"])) > 12:
        issues["same_question_different_answers"].append([location(row) for row in group])

output = {
    "summary": source_summaries,
    "totalRows": len(all_rows),
    "issueCounts": {key: len(value) for key, value in sorted(issues.items())},
    "issues": dict(issues),
}
Path("/tmp/cleverli-grades-2-6-audit.json").write_text(json.dumps(output, ensure_ascii=False, indent=2))
print(json.dumps({"totalRows": len(all_rows), "issueCounts": output["issueCounts"]}, ensure_ascii=False, indent=2))
