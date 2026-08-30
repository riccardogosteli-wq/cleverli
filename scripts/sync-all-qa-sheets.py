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
        4: [
            "Fixed", "Answer-revealing hints", "Mathematics / German", "49 exercises with one-letter answers",
            "The central hint sanitizer now detects one-character answers and replaces all 49 direct letter reveals with safe instructional hints.",
            "Resolved. The permanent hint audit asserts all 66 one-character repairs across Grades 1, 2, 5 and 6.",
        ],
        5: [
            "Fixed", "Duplicates", "All", "7 genuine duplicate pairs replaced; 1 false positive retained",
            "Full structural review replaced all 7 genuine Grade 1 content duplicates. The eighth flagged pair was valid reinforcement: two memory games share a generic prompt but contain different card pairs. The detector now compares complete exercise structures; a fresh scan finds zero exact duplicates across all 1,863 Grade 1 exercises.",
            "Resolved. Keep the structure-aware duplicate audit in the QA suite.",
        ],
        6: [
            "Fixed", "LP21 level", "Mathematics / NMG", "43 exercises across money, time and foundational NMG",
            "Advanced decimal-money calculations, time conversions and specialist Grade 1 science concepts were replaced with age-appropriate whole-franc, clock and everyday-world tasks.",
            "Resolved against the official LP21 Cycle 1/2 posters and covered by the permanent LP21 content audit.",
        ],
        7: [
            "Fixed", "LP21 level", "NMG", "Specialist plant, senses, body and movement items",
            "Parasitic/carnivorous plants, blind-spot anatomy, inertia and comparable specialist wording were replaced with observable Grade 1 concepts.",
            "Resolved as part of the 43 Grade 1 LP21 replacements; IDs, types, difficulty and totals were preserved.",
        ],
        8: [
            "Fixed", "IDs", "All", "1,220 duplicate occurrences across 1,107 legacy IDs",
            "The original 50 Grade-1 finding understated the catalogue-wide issue: 1,220 later occurrences collided globally. Every later occurrence now has a unique canonical ID and retains an exact topic-scoped legacy alias.",
            "Resolved. All 13,918 canonical IDs are globally unique; 14,195 historical progress-prefix cases and all 1,220 aliases preserve completed work from localStorage and Supabase correct_ids.",
        ],
        9: [
            "Fixed", "Localisation / scoring", "All", "1,863 exercises × EN/FR/IT; zero localisation integrity errors",
            "Maths and NMG now have complete prompt, answer, option, hint and interaction-label localisation. Language subjects use a clear UI-language action cue while preserving the complete German, English or French learning target.",
            "Resolved. Permanent catalogue and TTS gates cover all 41,754 locale instances; answer parity, blanks, structural IDs, mixed-language fallbacks and speech-language routing report zero failures.",
        ],
        10: [
            "Review", "LP21 competency coverage", "German / NMG", "Composition, listening and NMG balance improved; speaking remains",
            "The Grade-1 listening and composition gaps remain resolved. The duplicated senses/weather slots now cover needs and wishes plus the local neighbourhood, preserving every exercise ID while expanding NMG.6 and NMG.8.",
            "Resolved for NMG balance. Keep the permanent consolidation, composition, listening-modality and LP21 API gates; plan speaking separately.",
        ],
        11: [
            "Fixed", "Exercise-level grade suitability", "All", "107 unsuitable or uncertain exercises repaired; previous automated 1/2 claims invalidated",
            "The rebuilt scorer evaluates each prompt, answer, options, hints, task type, reading load, numbers and terminology instead of defaulting from the topic. Grade 1 now has 558 score-1 and 1,305 score-2 exercises; zero score-3/4/5 remain.",
            "Resolved. The old scores are superseded. Permanent regression tests reject the former ie/ei misspelling pattern and verify all 393 repaired IDs and preserved interaction types.",
        ],
        12: [
            "Fixed", "Developmental level", "German", "224 of 550 exercises across 11 topics",
            "The full Grade 1 German catalogue was reviewed exercise by exercise. Abstract spelling rules, deliberate misspellings, parts-of-speech classification, dictionary ordering, hidden arithmetic and malformed syllable tasks were replaced with concrete listening, letter, word and direct-comprehension work while preserving every exercise ID and type.",
            "Resolved. Keep the permanent Grade 1 developmental-level audit, full-catalogue correctness checks, Sheet parity and desktop/mobile interaction QA in the release gate.",
        ],
    },
    2: {
        10: [
            "Fixed", "LP21 level", "Mathematics / NMG", "11 exercises",
            "Advanced water-science terminology and premature formal maths/statistics items were replaced with Cycle 1 water, arithmetic and diagram-reading tasks.",
            "Resolved against the official LP21 posters and covered by the permanent LP21 content audit.",
        ],
        12: [
            "Fixed", "Answer-revealing hint", "Mathematics", "symmetrie/sy37",
            "The direct one-letter answer reveal was replaced centrally with a safe hint.",
            "Resolved and covered by the one-character hint regression.",
        ],
        14: [
            "Fixed", "Localisation / scoring", "All", "1,752 exercises × EN/FR/IT; zero localisation integrity errors",
            "Maths and NMG now have complete prompt, answer, option, hint and interaction-label localisation. Language subjects use a clear UI-language action cue while preserving the complete German, English or French learning target.",
            "Resolved. Permanent catalogue and TTS gates cover all 41,754 locale instances; answer parity, blanks, structural IDs, mixed-language fallbacks and speech-language routing report zero failures.",
        ],
        15: [
            "Fixed", "Punctuation scoring", "German", "satzzeichen: 17 fill-in exercises",
            "The checker previously removed punctuation before comparison, so any punctuation-only input could pass.",
            "Resolved centrally with exact punctuation matching; all 17 Grade 2 cases and supported marks pass regression tests.",
        ],
        16: [
            "Fixed", "Malformed source content", "Mathematics / German", "laengen-messen/lm47; wortfamilien/wf48",
            "lm47 contained an abandoned m³ prompt; wf48 taught and expected the invalid form “Gegehe”.",
            "Both were replaced with one clear, age-appropriate and objectively gradable question.",
        ],
        17: [
            "Fixed", "Malformed fill-in scoring", "NMG", "uhr-viertel-gr2: 7; wetter-klima: 9",
            "All 16 generated fill-ins now store exactly the fragment required by the blank; inserting each answer produces a grammatical sentence.",
            "Resolved and covered by the normalized-fill correctness regression.",
        ],
        18: [
            "Review", "LP21 competency coverage", "German", "Guided composition and listening added; speaking remains",
            "The 50-exercise ‘Texte planen & schreiben’ topic covers guided composition. ‘Hörtexte verstehen’ now uses picture-first easy tasks, visual ordering sequences and spoken questions plus numbered choices throughout, so reading remains optional support. A dedicated speaking strand remains absent.",
            "Keep the permanent composition, listening-modality, Grade-2 reading-support and LP21 API gates. Treat automatic speaking assessment as separate product work.",
        ],
        19: [
            "Fixed", "Exercise-level grade suitability", "All", "113 unsuitable or uncertain exercises repaired; previous automated 1/2 claims invalidated",
            "The rebuilt scorer evaluates actual exercise content rather than topic metadata. Grade 2 now has 525 score-1 and 1,227 score-2 exercises; zero score-3/4/5 remain. One valid listening-comprehension item was restored after a false-positive audit rule was narrowed.",
            "Resolved. The old scores are superseded; permanent target-resolution, format, duplicate, listening and scorer regression audits pass.",
        ],
    },
    3: {
        4: [
            "Fixed", "Ambiguous answer", "Mathematics", "geometrie/geo45",
            "The ambiguous spherical-geometry item was removed during the LP21 review and replaced with one objectively gradable Cycle 2 geometry task.",
            "Resolved and covered by the LP21 content and scoring audits.",
        ],
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
        10: [
            "Fixed", "Localisation / scoring", "All", "2,002 exercises × EN/FR/IT; zero localisation integrity errors",
            "Maths and NMG now have complete prompt, answer, option, hint and interaction-label localisation. Language subjects use a clear UI-language action cue while preserving the complete German, English or French learning target.",
            "Resolved. Permanent catalogue and TTS gates cover all 41,754 locale instances; answer parity, blanks, structural IDs, mixed-language fallbacks and speech-language routing report zero failures.",
        ],
        6: [
            "Fixed", "LP21 level", "Mathematics / German / NMG", "103 exercises",
            "Clearly premature statistics, formula geometry, literary theory, optics, environmental-policy and political-theory items were replaced with Grade 3/Cycle 2 tasks.",
            "Resolved against official LP21 Cycle 2 posters; IDs, types, difficulty and totals were preserved.",
        ],
        11: [
            "Fixed", "Punctuation scoring", "German", "saetze/sb24",
            "The checker previously removed punctuation before comparison, so the comma exercise accepted any punctuation-only input.",
            "Resolved centrally with exact punctuation matching and a dedicated regression test.",
        ],
        12: [
            "Fixed", "Multi-gap scoring", "German", "adjektive/aj30, aj32; verben-konjugieren/vk46",
            "Each prompt previously asked for two different gaps while offering one input and one partial stored answer.",
            "All three prompts now contain exactly one objectively gradable gap; prompt and answer were regression-tested together.",
        ],
        13: [
            "Fixed", "Malformed hint", "Mathematics", "rechnen-bis-1000/r25k",
            "The first hint contained an abandoned, contradictory borrowing calculation; the answer itself was correct.",
            "Replaced with one correct, child-readable written-subtraction strategy and verification step.",
        ],
        14: [
            "Fixed", "Malformed fill-in scoring", "NMG", "energie-stoffe: 12; licht-optik: 14; raeume-karte: 14",
            "All 40 generated fill-ins now store exactly the missing fragment and accept the grammatically correct response.",
            "Resolved and covered by the normalized-fill correctness regression.",
        ],
        15: [
            "Review", "LP21 competency coverage", "German / NMG", "Listening and NMG balance improved; speaking remains",
            "Listening remains complete. The duplicated energy/light slots now cover work and careers plus consumption and money, preserving IDs while strengthening NMG.6 coverage.",
            "Resolved for NMG balance. Keep the permanent consolidation, listening-modality, Grade-3 reading-support and LP21 API gates; plan speaking separately.",
        ],
        16: [
            "Fixed", "Exercise-level grade suitability", "All", "84 unsuitable or uncertain exercises repaired; previous automated 1/2 claims invalidated",
            "The rebuilt content-level scorer reports 600 score-1 and 1,402 score-2 exercises in Grade 3; zero score-3/4/5 remain. Every repaired ID resolves once and the original drag/drop interaction is preserved.",
            "Resolved. The old scores are superseded; permanent scorer, duplicate, format and LP21 content audits pass.",
        ],
    },
    4: {
        8: [
            "Fixed", "LP21 level", "Mathematics / German / NMG", "32 exercises",
            "Premature circle formulae, advanced grammar and specialist biology, physics, ecology, body and water concepts were replaced with Cycle 2 content.",
            "Resolved against official LP21 Cycle 2 posters and covered by the permanent LP21 audit.",
        ],
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
        11: [
            "Fixed", "Localisation / scoring", "All", "2,501 exercises × EN/FR/IT; zero localisation integrity errors",
            "Maths and NMG now have complete prompt, answer, option, hint and interaction-label localisation. Language subjects use a clear UI-language action cue while preserving the complete German, English or French learning target.",
            "Resolved. Permanent catalogue and TTS gates cover all 41,754 locale instances; answer parity, blanks, structural IDs, mixed-language fallbacks and speech-language routing report zero failures.",
        ],
        12: [
            "Fixed", "Punctuation scoring", "German", "rechtschreibung-4/g4rs2m; interpunktion-4: 22 exercises",
            "The checker previously removed punctuation before comparison, so these 23 exercises accepted any punctuation-only input.",
            "Resolved centrally with exact punctuation matching; all 23 Grade 4 cases and supported marks pass regression tests.",
        ],
        13: [
            "Fixed", "Malformed fill-in scoring", "NMG", "energie-stoffe: 12; licht-optik: 14; raeume-karte: 14",
            "All 40 generated fill-ins now store exactly the missing fragment and accept the grammatically correct response.",
            "Resolved and covered by the normalized-fill correctness regression.",
        ],
        14: [
            "Fixed", "Factual / malformed content", "NMG", "kan4_6; eu4_33; gk4_35; mk4_28; ms4_42; rr4_8",
            "All six exercises were rewritten or updated: Graubünden languages, 21-country Eurozone, both Landsgemeinde cantons, timeless migration wording, accurate organic-chemistry wording and a valid Roman-pass prompt.",
            "Resolved against official Swiss and EU sources and covered by the factual regression.",
        ],
        15: [
            "Review", "LP21 competency coverage", "German / NMG", "Listening and NMG balance improved; speaking remains",
            "The Grade 4 mathematics and listening gaps remain resolved. Redundant body, energy and map slots now cover values and community, production and consumption, plus religions and festivals, preserving all IDs.",
            "Resolved for NMG balance. Keep the permanent consolidation, listening-modality, Grade-4 reading-support and LP21 API gates; plan speaking separately.",
        ],
        16: [
            "Fixed", "LP21 mathematics coverage", "Mathematics", "daten-diagramme-zufall-4: 50 exercises",
            "Added a dedicated Grade 4 strand for reading tables and diagrams, comparing data, interpreting recorded chance experiments and using age-appropriate probability language.",
            "Verified against LP21 MA.3.C.1.d with permanent structural, localisation, scoring and duplicate checks.",
        ],
        17: [
            "Fixed", "Exercise-level grade suitability", "All", "65 unsuitable or uncertain exercises repaired; previous automated 1/2 claims invalidated",
            "The rebuilt content-level scorer reports 750 score-1 and 1,751 score-2 exercises in Grade 4; zero score-3/4/5 remain. Premature volume, density, scale and specialist NMG content was replaced with topic-specific Cycle-2 work.",
            "Resolved. The old scores are superseded; permanent scorer, content, format and duplicate audits pass.",
        ],
    },
    5: {
        7: [
            "Fixed", "LP21 level", "German / NMG", "18 exercises",
            "Clearly out-of-cycle syntax, molecular biology, modern physics, climate engineering, advanced technology and political-history items were replaced with Cycle 2 tasks.",
            "Resolved against official LP21 Cycle 2 posters and covered by the permanent LP21 audit.",
        ],
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
        6: [
            "Fixed", "Typography", "German", "direkte-rede-5",
            "Swiss guillemets previously used French spacing, for example « Komm mit! »; one exercise also taught an incorrect comma rule after question and exclamation marks.",
            "All German Grade 5 content now uses Swiss/German guillemets without inner spaces; direct-speech comma rules are corrected and regression-tested.",
        ],
        11: [
            "Fixed", "Localisation / scoring", "All", "2,900 exercises × EN/FR/IT; zero localisation integrity errors",
            "Maths and NMG now have complete prompt, answer, option, hint and interaction-label localisation. Language subjects use a clear UI-language action cue while preserving the complete German, English or French learning target.",
            "Resolved. Permanent catalogue and TTS gates cover all 41,754 locale instances; answer parity, blanks, structural IDs, mixed-language fallbacks and speech-language routing report zero failures.",
        ],
        12: [
            "Fixed", "Punctuation scoring", "German", "direkte-rede: 7 fill-in exercises",
            "The checker previously removed punctuation before comparison; three prompts also showed two quote gaps for one input.",
            "Resolved with exact punctuation matching, and the three guillemet prompts now contain one objectively gradable gap.",
        ],
        13: [
            "Fixed", "Multi-gap / open-response scoring", "German / English", "rechtschreibung-5/rs5-16; environment-5/env5-42; technology-5/tech5-36, tech5-38",
            "These prompts previously required multiple or creative entries but compared one input with one partial stored answer.",
            "The two creative tasks now use guided self-review; the two grammar tasks each contain one objectively gradable gap.",
        ],
        14: [
            "Fixed", "Malformed source content", "NMG", "mittelalter-5/ma5-30",
            "The question began with an unrelated Prager Frühling prompt before switching to the Goldene Bulle.",
            "Replaced with one clear multiple-choice question about the Goldene Bulle and the election of the Roman-German king.",
        ],
        10: [
            "Fixed", "Answer-revealing hints", "Mathematics / German / NMG / French", "11 exercises with one-letter answers",
            "The central sanitizer now detects and replaces all 11 direct one-letter answer reveals.",
            "Resolved and covered by the one-character hint regression.",
        ],
        15: [
            "Fixed", "Malformed fill-in scoring", "NMG", "weltall: 11; strom-elektrizitaet: 13; geschichte-zeit: 15",
            "All 39 generated fill-ins now store exactly the missing fragment and accept the grammatically correct response.",
            "Resolved and covered by the normalized-fill correctness regression.",
        ],
        16: [
            "Fixed", "Factual / stale content", "NMG", "kb5-39; eg5-21; eg5-25; sp5-43; nh5-37",
            "All five exercises now teach accurate free-fall, Eurozone, Schengen, Swiss separation-of-powers and Cradle-to-Cradle content.",
            "Resolved against authoritative sources and covered by the factual regression.",
        ],
        17: [
            "Review", "LP21 competency coverage", "German / NMG", "Listening and NMG balance improved; speaking remains",
            "Listening remains complete. Duplicate space, electricity and generic history/time slots now cover media literacy, work/trade/transport and values/conflicts, preserving all exercise IDs.",
            "Resolved for NMG balance. Keep the permanent consolidation, listening-modality, Grade-5 reading-support and LP21 API gates; plan speaking separately.",
        ],
        18: [
            "Fixed", "Exercise-level grade suitability", "All", "12 unsuitable exercises repaired; previous automated 1/2 claims invalidated",
            "The rebuilt content-level scorer reports 870 score-1 and 2,030 score-2 exercises in Grade 5; zero score-3/4/5 remain. Cycle-3 climate, biology, politics and language outliers were replaced with topic-specific Cycle-2 tasks.",
            "Resolved. The old scores are superseded; permanent scorer, content, format and duplicate audits pass.",
        ],
    },
    6: {
        8: [
            "Fixed", "LP21 level", "Mathematics / German / NMG", "72 exercises",
            "Equation systems, variance, formula geometry, advanced grammar, molecular biology, quantum/relativity content and speculative-future theory were replaced with end-of-Cycle-2 tasks.",
            "Resolved against official LP21 Cycle 2 posters and covered by the permanent LP21 audit.",
        ],
        6: [
            "Fixed", "Answer-revealing hints", "German / NMG", "5 exercises with one-letter answers",
            "The central sanitizer now detects and replaces all five direct one-letter answer reveals.",
            "Resolved and covered by the one-character hint regression.",
        ],
        5: [
            "Fixed", "Repeated filler", "Mathematics/German", "Multiple topics",
            "The original audit found repeated filler across unrelated topics.",
            "Resolved by the verified 321-row Grade 6 repetition/duplicate replacement; all affected content is now topic-specific.",
        ],
        10: [
            "Fixed", "Localisation / scoring", "All", "2,900 exercises × EN/FR/IT; zero localisation integrity errors",
            "Maths and NMG now have complete prompt, answer, option, hint and interaction-label localisation. Language subjects use a clear UI-language action cue while preserving the complete German, English or French learning target.",
            "Resolved. Permanent catalogue and TTS gates cover all 41,754 locale instances; answer parity, blanks, structural IDs, mixed-language fallbacks and speech-language routing report zero failures.",
        ],
        11: [
            "Fixed", "Multi-gap / open-response scoring", "English", "writing-skills-6/ws6-44; vocabulary-6/vb6-36; culture-media-6/cm6-40, cm6-48",
            "Each prompt previously asked for multiple or creative entries while checking one input against one partial stored answer.",
            "The opinion task now uses Cycle-2 guided self-review; the three language tasks each contain one objectively gradable gap.",
        ],
        12: [
            "Fixed", "Malformed fill-in scoring", "NMG", "weltall: 11; strom-elektrizitaet: 13; geschichte-zeit: 15",
            "All 39 generated fill-ins now store exactly the missing fragment and accept the grammatically correct response.",
            "Resolved and covered by the normalized-fill correctness regression.",
        ],
        13: [
            "Fixed", "Factual content", "NMG", "ko6_9; mf6_42",
            "Australia is now correctly described as the smallest continent rather than the largest island; the UN Migration Compact item now states that it is non-binding and that Switzerland abstained in 2018.",
            "Resolved against authoritative sources and covered by the factual regression.",
        ],
        14: [
            "Review", "LP21 competency coverage", "German / NMG", "Listening and NMG balance improved; speaking remains",
            "Listening remains complete. Duplicate space and generic history/time slots now cover career orientation and religions/worldviews, preserving all exercise IDs and learner progress.",
            "Resolved for NMG balance. Keep the permanent consolidation, listening-modality, Grade-6 reading-support and LP21 API gates; plan speaking separately.",
        ],
        15: [
            "Fixed", "Exercise-level grade suitability", "All", "12 unsuitable exercises repaired; previous automated 1/2 claims invalidated",
            "The rebuilt content-level scorer reports 870 score-1 and 2,030 score-2 exercises in Grade 6; zero score-3/4/5 remain. Cycle-3 physics, migration, sustainability and future-theory outliers were replaced with Cycle-2 tasks.",
            "Resolved. The old scores are superseded; IDs, formats, difficulties and totals remain stable and permanent scorer/content audits pass.",
        ],
    },
}

DISTRACTOR_REPAIR_COUNTS = {1: 37, 2: 45, 3: 165, 4: 330, 5: 406, 6: 358}
for grade, repaired_count in DISTRACTOR_REPAIR_COUNTS.items():
    AUDIT_UPDATES[grade][25] = [
        "Fixed", "Answer-option quality", "All multiple-choice subjects", f"{repaired_count} exercises in Grade {grade}",
        "All multiple-choice options were reviewed. Placeholder text, malformed fragments, unrelated one-word choices and structurally obvious distractors were replaced with plausible alternatives from the same topic and answer format; visual option mappings remain untouched.",
        "Resolved. The catalogue-wide editorial audit now rejects placeholders, duplicate choices and distractors whose structure gives away a longer correct answer.",
    ]


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
            delay = float(retry_after) if retry_after else min(2 ** attempt, 16)
            time.sleep(delay)
        except (TimeoutError, urllib.error.URLError):
            if attempt == 5:
                raise
            time.sleep(min(2 ** attempt, 16))
    raise RuntimeError("unreachable")


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


def append_values(spreadsheet_id: str, range_: str, rows: list[list]) -> None:
    if not rows:
        return
    encoded = urllib.parse.quote(range_, safe="")
    request(
        "POST",
        f"{BASE}/{spreadsheet_id}/values/{encoded}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS",
        {"majorDimension": "ROWS", "values": rows},
    )


def align_rows_by_id(current_rows: list[list], source_rows: list[dict]) -> tuple[list[list], list[tuple[int, int]]]:
    """Align a Sheet prefix with source and report missing source-index blocks."""
    aligned: list[list] = []
    missing_indexes: list[int] = []
    current_index = 0
    for source_index, source_row in enumerate(source_rows):
        expected_id = str(source_row["exerciseId"])
        legacy_id = str(source_row.get("legacyExerciseId") or "")
        actual_id = normalize(current_rows[current_index], 1)[0] if current_index < len(current_rows) else ""
        if actual_id == expected_id or (legacy_id and actual_id == legacy_id):
            aligned.append(current_rows[current_index])
            current_index += 1
        else:
            aligned.append([])
            missing_indexes.append(source_index)
    if current_index != len(current_rows):
        actual_id = normalize(current_rows[current_index], 1)[0]
        raise RuntimeError(f"Sheet ordering diverges at existing exercise {actual_id}")
    if len(missing_indexes) != len(source_rows) - len(current_rows):
        raise RuntimeError("Sheet/source row alignment produced an invalid missing-row count")

    blocks: list[tuple[int, int]] = []
    for index in missing_indexes:
        if blocks and index == blocks[-1][0] + blocks[-1][1]:
            start, count = blocks[-1]
            blocks[-1] = (start, count + 1)
        else:
            blocks.append((index, 1))
    return aligned, blocks


def insert_sheet_rows(spreadsheet_id: str, tab: str, blocks: list[tuple[int, int]]) -> None:
    if not blocks:
        return
    tab_id = sheet_id(spreadsheet_id, tab)
    requests = []
    for source_index, count in reversed(blocks):
        requests.append({
            "insertDimension": {
                "range": {
                    "sheetId": tab_id,
                    "dimension": "ROWS",
                    "startIndex": source_index + 1,
                    "endIndex": source_index + 1 + count,
                },
                "inheritFromBefore": False,
            }
        })
    request("POST", f"{BASE}/{spreadsheet_id}:batchUpdate", {"requests": requests})


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


def sheet_id(spreadsheet_id: str, title: str) -> int:
    result = request(
        "GET",
        f"{BASE}/{spreadsheet_id}?fields=sheets.properties(sheetId,title)",
    )
    for sheet in result.get("sheets", []):
        properties = sheet.get("properties", {})
        if properties.get("title") == title:
            return int(properties["sheetId"])
    raise RuntimeError(f"Missing sheet tab: {title}")


def repair_main_markers(
    spreadsheet_id: str,
    tab: str,
    source_rows: list[dict],
    sheet_rows: list[int],
) -> None:
    tab_id = sheet_id(spreadsheet_id, tab)
    requests = []
    white = {"red": 1, "green": 1, "blue": 1}
    green = {"red": 0.7764706, "green": 0.9372549, "blue": 0.80784315}
    for sheet_row in sheet_rows:
        source = source_rows[sheet_row - 2]
        options = (source.get("options") or [])[:4]
        solution_offset = options.index(source["storedAnswer"]) if source["storedAnswer"] in options else 4
        base_range = {
            "sheetId": tab_id,
            "startRowIndex": sheet_row - 1,
            "endRowIndex": sheet_row,
        }
        requests.extend([
            {
                "repeatCell": {
                    "range": {**base_range, "startColumnIndex": 6, "endColumnIndex": 11},
                    "cell": {"userEnteredFormat": {"backgroundColor": white}},
                    "fields": "userEnteredFormat.backgroundColor",
                }
            },
            {
                "repeatCell": {
                    "range": {
                        **base_range,
                        "startColumnIndex": 6 + solution_offset,
                        "endColumnIndex": 7 + solution_offset,
                    },
                    "cell": {"userEnteredFormat": {"backgroundColor": green}},
                    "fields": "userEnteredFormat.backgroundColor",
                }
            },
        ])
    request("POST", f"{BASE}/{spreadsheet_id}:batchUpdate", {"requests": requests})


def repair_special_markers(
    spreadsheet_id: str,
    tab: str,
    sheet_rows: list[int],
    solution_column: int,
) -> None:
    if not sheet_rows:
        return
    tab_id = sheet_id(spreadsheet_id, tab)
    white = {"red": 1, "green": 1, "blue": 1}
    green = {"red": 0.7764706, "green": 0.9372549, "blue": 0.80784315}
    requests = []
    for sheet_row in sheet_rows:
        base_range = {
            "sheetId": tab_id,
            "startRowIndex": sheet_row - 1,
            "endRowIndex": sheet_row,
        }
        requests.extend([
            {
                "repeatCell": {
                    "range": {**base_range, "startColumnIndex": 6, "endColumnIndex": 8},
                    "cell": {"userEnteredFormat": {"backgroundColor": white}},
                    "fields": "userEnteredFormat.backgroundColor",
                }
            },
            {
                "repeatCell": {
                    "range": {**base_range, "startColumnIndex": solution_column - 1, "endColumnIndex": solution_column},
                    "cell": {"userEnteredFormat": {"backgroundColor": green}},
                    "fields": "userEnteredFormat.backgroundColor",
                }
            },
        ])
    request("POST", f"{BASE}/{spreadsheet_id}:batchUpdate", {"requests": requests})


def verify_markers(
    spreadsheet_id: str,
    tab: str,
    source_rows: list[dict],
    special: bool = False,
    special_solution_column: int = 7,
) -> list[int]:
    def read_cells(start_column: str, end_column: str) -> dict[int, list[dict]]:
        cells_by_row: dict[int, list[dict]] = {}
        for source_offset in range(0, len(source_rows), 400):
            sheet_start = source_offset + 2
            sheet_end = min(len(source_rows), source_offset + 400) + 1
            start, row_data = grid_rows(
                spreadsheet_id,
                f"'{tab}'!{start_column}{sheet_start}:{end_column}{sheet_end}",
            )
            for row_offset, row in enumerate(row_data):
                cells_by_row[start + row_offset] = row.get("values", [])
        return cells_by_row

    if special:
        end_column = "H" if special_solution_column == 8 else "G"
        cells_by_row = read_cells("G", end_column)
        failures = []
        for sheet_row, _ in enumerate(source_rows, start=2):
            cells = cells_by_row.get(sheet_row, [])
            expected_index = special_solution_column - 7
            cells += [{}] * (expected_index + 1 - len(cells))
            green_columns = [index for index, cell in enumerate(cells) if is_green(cell)]
            if green_columns != [expected_index]:
                failures.append(sheet_row)
        return failures

    cells_by_row = read_cells("G", "K")
    failures = []
    for sheet_row, source in enumerate(source_rows, start=2):
        cells = cells_by_row.get(sheet_row, [])
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
    current_main_count = len(current_main) - 1
    current_special_count = len(current_special) - 1
    if current_main_count > len(source_rows):
        raise RuntimeError(f"Grade {grade}: Sheet has extra main rows ({current_main_count} vs {len(source_rows)})")
    if current_special_count > len(special_rows):
        raise RuntimeError(f"Grade {grade}: Sheet has extra special rows ({current_special_count} vs {len(special_rows)})")

    aligned_main, main_insert_blocks = align_rows_by_id(current_main[1:], source_rows)
    aligned_special, special_insert_blocks = align_rows_by_id(current_special[1:], special_rows)

    main_updates = []
    for sheet_row, (current, expected_source) in enumerate(zip(aligned_main, source_rows), start=2):
        expected = main_values(expected_source)
        if normalize(current, 13) != normalize(expected, 13):
            main_updates.append({"range": f"'{main_tab}'!A{sheet_row}:M{sheet_row}", "values": [expected]})

    special_updates = []
    if normalize(current_special[0], 10) != expected_special_header:
        special_updates.append({"range": "'Special exercises'!A1:J1", "values": [expected_special_header]})
    for sheet_row, (current, expected_source) in enumerate(zip(aligned_special, special_rows), start=2):
        expected = (
            grade1_special_values(expected_source, normalize(current, 10)[6])
            if grade == 1
            else special_values(expected_source)
        )
        if normalize(current, 10) != normalize(expected, 10):
            special_updates.append({"range": f"'Special exercises'!A{sheet_row}:J{sheet_row}", "values": [expected]})

    audit_updates = []
    current_audit = values_get(spreadsheet_id, "'Audit findings'!A1:F100")
    for audit_row, expected in AUDIT_UPDATES.get(grade, {}).items():
        actual = current_audit[audit_row - 1] if audit_row <= len(current_audit) else []
        if normalize(actual, 6) != normalize(expected, 6):
            audit_updates.append({"range": f"'Audit findings'!A{audit_row}:F{audit_row}", "values": [expected]})

    if apply:
        insert_sheet_rows(spreadsheet_id, main_tab, main_insert_blocks)
        insert_sheet_rows(spreadsheet_id, "Special exercises", special_insert_blocks)
        batch_write(spreadsheet_id, main_updates + special_updates + audit_updates)

    reread_main = values_get(spreadsheet_id, f"'{main_tab}'!A1:T{len(source_rows) + 1}")
    reread_special = values_get(spreadsheet_id, f"'Special exercises'!A1:J{len(special_rows) + 1}")
    main_mismatches = [
        index for index, (actual, source_row) in enumerate(zip(reread_main[1:], source_rows), start=2)
        if normalize(actual, 13) != normalize(main_values(source_row), 13)
    ]
    if len(reread_main) != len(source_rows) + 1:
        main_mismatches.extend(range(len(reread_main) + 1, len(source_rows) + 2))
    special_mismatches = []
    if normalize(reread_special[0], 10) != expected_special_header:
        special_mismatches.append(1)
    for index, (actual, source_row) in enumerate(zip(reread_special[1:], special_rows), start=2):
        original = current_special[index - 1] if index - 1 < len(current_special) else []
        expected = (
            grade1_special_values(source_row, normalize(original, 10)[6])
            if grade == 1
            else special_values(source_row)
        )
        if normalize(actual, 10) != normalize(expected, 10):
            special_mismatches.append(index)
    if len(reread_special) != len(special_rows) + 1:
        special_mismatches.extend(range(len(reread_special) + 1, len(special_rows) + 2))
    audit_mismatches = []
    reread_audit = values_get(spreadsheet_id, "'Audit findings'!A1:F100")
    for audit_row, expected in AUDIT_UPDATES.get(grade, {}).items():
        actual = reread_audit[audit_row - 1] if audit_row <= len(reread_audit) else []
        if normalize(actual, 6) != normalize(expected, 6):
            audit_mismatches.append(audit_row)

    marker_failures = verify_markers(spreadsheet_id, main_tab, source_rows)
    if apply and marker_failures:
        repair_main_markers(spreadsheet_id, main_tab, source_rows, marker_failures)
        marker_failures = verify_markers(spreadsheet_id, main_tab, source_rows)
    special_marker_failures = verify_markers(
        spreadsheet_id,
        "Special exercises",
        special_rows,
        special=True,
        special_solution_column=8 if grade == 1 else 7,
    )
    if apply and special_marker_failures:
        repair_special_markers(
            spreadsheet_id,
            "Special exercises",
            special_marker_failures,
            solution_column=8 if grade == 1 else 7,
        )
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
        "plannedMainInserts": sum(count for _, count in main_insert_blocks),
        "plannedSpecialUpdates": len(special_updates),
        "plannedSpecialInserts": sum(count for _, count in special_insert_blocks),
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
    parser.add_argument("--grades", nargs="+", type=int, choices=range(1, 7), default=list(range(1, 7)))
    args = parser.parse_args()
    summary = {grade: reconcile_grade(grade, args.apply) for grade in args.grades}
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
