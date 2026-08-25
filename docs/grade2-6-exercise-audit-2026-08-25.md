# Exercise QA audit: grades 2–6

Date: 25 August 2026

## Coverage

The audit iterated every source exercise in every subject for grades 2–6.

| Grade | Exercises | Topics | Subjects |
| --- | ---: | ---: | --- |
| 2 | 1,652 | 33 | Mathematics, German, NMG |
| 3 | 1,952 | 39 | Mathematics, German, NMG, English |
| 4 | 2,401 | 48 | Mathematics, German, NMG, English |
| 5 | 2,850 | 57 | Mathematics, German, NMG, French, English |
| 6 | 2,850 | 57 | Mathematics, German, NMG, French, English |
| **Total** | **11,705** | **234** | |

Each workbook was reconciled against its source count. Every exercise row has exactly one green answer or solution marker. No exercise content was changed during this audit.

## Confirmed wrong or malformed

These are the strict, objectively incorrect or unusable items approved for correction. Ambiguous wording and level judgements are intentionally excluded from this section.

### Grade 2

- `science/lebewesen/l14`: groups bacteria and viruses together as living organisms. Bacteria are living organisms; viruses are generally not classified as living.
- `science/kalender-gr2/k47`: says we taste with our teeth; taste is primarily sensed by the tongue.
- `science/wasser/w45`: `Das Ozean` must be `Der Ozean`.
- Normalised fill-in blocks in `physik-bewegung` and `sinne` often cannot fit grammatically into their blanks because the stored answer repeats an article or an entire clause. Examples include “Beim Velo macht die ___ langsamer.” → `Die Bremse` and “Wir hören mit den ___.” → `Mit den Ohren`.

### Grade 3

- `german/rechtschreibung/rs16`: asks `heiss oder heiss?`; both forms shown are identical.
- `german/rechtschreibung/rs38`: asks what Swiss German uses “instead of ss”, then answers `ss`. The prompt should refer to `ß`.

### Grade 4

- `german/rechtschreibung-4/g4d26`: “Sortiere: ss oder ss?” is broken; both categories are identical.
- `science/orientierung-karte-4/ok4_27`: conflates `Isoglosse` with `Isohypse`. A language boundary is an isogloss; a contour line is an isohypse.
- `science/roemisches-reich-4/rr4_27`: calls Aventicum the capital of a Roman province named Helvetia. It was the principal town of the `civitas Helvetiorum`; there was no Roman province called Helvetia.

### Grade 5

- `german/rechtschreibung-5/rs5-1`: says Swiss German has “kein ss”; the intended statement is that Swiss orthography does not use `ß`.
- `german/rechtschreibung-5/rs5-7`: marks `heiss` as incorrect in Switzerland, although `heiss` is the correct Swiss spelling.

### Grade 6

- `science/schweiz-geografie/g6sg1d`: calls the Rhine Europe’s longest river; the Volga is Europe’s longest river.
- `french/france-pays-francophones-6/ff6-40`: says Brussels is the bilingual capital of Wallonia. Brussels-Capital is a separate Belgian region and is not in Wallonia.
- `science/astronomie-6/as6_43`: answer contains the malformed word `kommuniziersefer`.

## Systemic content-quality findings

- **Copy/paste contamination:** unrelated content appears inside topics. Grade 2 `lebewesen/l36–l50` contains optics questions; `schweiz-symbole/ch36–ch50` contains chemistry; `berufe/b45–b50` contains body questions; and `kalender-gr2/k36–k50` contains body and senses questions.
- **Repeated filler blocks:** grade 2 contains four blocks with 20 exact duplicate pairs each. Grade 4 has eight repeated content groups spanning 215 rows; grade 5 has nine spanning 228 rows; grade 6 has eleven spanning 272 rows. Generic arithmetic and grammar exercises are reused across unrelated topics.
- **Hints reveal answers:** 3,777 exercises have a hint containing the stored answer verbatim. This detector is conservative but includes a large genuine set that bypasses the intended two-step hint flow.
- **Broken generated hints:** 757 numeric answers are described with word/letter hints, and 342 hints contain double punctuation. Twenty-eight special exercises expose internal sentinel values such as `all` or `done`.
- **Missing hint steps:** grade 6 `science/chemie-6/ch6_40` and `ch6_48` have only one hint, which directly reveals the answer or formula.
- **Open writing with exact-answer scoring:** at least 40 English and French tasks in grades 3–6 ask for an original sentence, paragraph or personal response while storing one exact answer. These cannot be graded fairly as exact-match questions.
- **Direct-speech typography:** grade 5 German direct-speech exercises repeatedly use French spacing inside Swiss guillemets, for example `« Komm mit! », rief Max.` instead of `«Komm mit!», rief Max.`
- **Duplicate IDs:** grade 2 has 7 cross-subject ID collisions, grade 3 has 14, and grade 5 has 100. All rows are preserved and disambiguated in the QA sheets by grade, subject, topic and ID, but IDs are not globally unique.
- **Exact-content duplicates:** the audit found 321 duplicate groups across grades. Some cross-grade repetition can be deliberate, but the large same-grade unrelated-topic blocks are not.

## Likely level mismatches requiring LP21 review

The official Lehrplan 21 Cycle 1 mathematics overview centres on foundational number, operation, shape and measurement work, while grades 3–6 belong to Cycle 2. The following blocks appear substantially beyond the likely target grade and should be reviewed by the Lehrplan 21 reviewers rather than silently deleted.

- **Grade 2:** photosynthesis chemistry, taxonomy, DNA, evolution and cellular respiration; sublimation, osmosis, aquifers, pH, acid rain, distillation and bioluminescence.
- **Grade 3:** fraction multiplication/division and square roots; standard deviation, correlation, scatterplots and boxplots; electromagnetism, lasers and the photoelectric effect.
- **Grade 4:** Calvin cycle, xylem and stomata, quantum mechanics, Weber–Fechner law, and advanced sociology/economics terminology.
- **Grade 5:** mitosis/meiosis, apoptosis, epigenetics, horizontal gene transfer, CRISPR, quantum mechanics, relativity and economic theory.
- **Grade 6:** mass-action law, logarithmic pH, the central dogma, CRISPR, quantum optics, Hawking radiation, the Drake equation and advanced geopolitics/economics. Repeated square-root/statistics tasks and German terms such as Gerundivum and Diathese also look closer to Cycle 3 or later.

## Items that are questionable but not automatically wrong

- Grade 2 `lebewesen/l40`: “Der Mond gibt nachts Licht” is understandable at this age, but scientifically imprecise because the Moon reflects sunlight rather than producing its own light.
- Grade 2 `gesunde-ernaehrung/g6` and `ge27`: daily water recommendations are likely too high for many young children, but depend on age, activity, heat and whether food-derived water is included.
- Grade 2 `schweiz-symbole/ch20`: “grösster See der Schweiz (anteilig)” is unclear when referring to Lake Geneva.
- Grade 2 `kalender/k32`: fixes the start of autumn to 21 September, although the astronomical date varies.
- Grade 2 `kalender/k33`: the number of days from 1 January to 31 March depends on inclusive/exclusive interpretation.
- Grade 3 `science/unsere-erde/ue32`: “world’s longest river” is disputed between the Nile and Amazon depending on measurement.
- Grade 3 `math/geometrie/geo45`: `Grosskreis`, `Geodäte` and `Orthodrome` overlap in the context of the shortest route on a sphere, so the choices are ambiguous.
- Grade 4 `science/europa-4/eu4_18`: answer text `Rhein (mit Loire, Ebro als Alternativen)` is unclear and unsuitable as one definitive solution.
- Grade 4 `science/pflanzen-4/pfl4_17`: “conifers have evergreen needles” is a common simplification but has exceptions such as the larch.
- Grade 5 `science/europa-geografie-5/eg5-35`: Lisbon is the westernmost among the listed choices, but not the westernmost European capital if all capitals are considered.

## Recommended correction order

1. Fix the clearly wrong factual, spelling and malformed-answer items.
2. Remove or relocate the copy/paste contamination and repeated filler blocks.
3. Repair hint generation centrally, then regenerate affected hints.
4. Convert open writing tasks to manual/self-review or rubric-based exercise types.
5. Have the Lehrplan 21 reviewers approve, move or remove the flagged level-mismatch blocks.
