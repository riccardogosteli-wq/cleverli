# LP21 Content Audit — 2026-03-20

## Summary
- Total exercises checked: ~6,667 (across all grade 1–6 data files)
- Issues found: 21
- Critical (wrong answer / factual error): 3 — **fixed**
- Grade-level mismatches: 8
- ß violations: 1 — **fixed**
- Minor (style/improvement / duplicate content): 9

---

## Critical Issues (fixed immediately)

| File | Topic | Exercise ID | Issue |
|------|-------|-------------|-------|
| `grade2/math.ts` | Daten & Diagramme | Pictogramm question (line 929) | **ß violation**: `aß` → fixed to `ass` |
| `grade1/math.ts` | Verdoppeln & Halbieren | `v45` | **Wrong answer**: Das Doppelte von 8 = 16, Hälfte von 40 = 20. Answer was "Beide gleich" (WRONG) → fixed to "Die Hälfte von 40" |
| `grade1/math.ts` | Grösser & Kleiner | `vg46` | **Wrong answer**: 7+3=10, 11-2=9 → 10 > 9, so answer should be `>` not `<` → fixed |

---

## Grade-Level Mismatches

| File | Topic | Exercise IDs | Expected Grade | Issue |
|------|-------|-------------|----------------|-------|
| `grade3/math.ts` | Zahlen bis 1000 | `z37k`, `z38k`, `z39k`, `z44k` | Sekundarstufe I | GGT, kgV, Primzahlen zwischen 100–200, grösste Primzahl unter 1000 — LP21 MA-Kompetenzaufbau für GGT/kgV beginnt erst in Sek I (Zyklus 3). Zu früh für Klasse 3. |
| `grade4/nt.ts` | Körper und Gesundheit | `g4kg3a`–`g4kg3l` | Sekundarstufe I | DNA, Mitose, CRISPR, Stammzelltherapie, Proteinsynthese, Epigenetik, Differenz Prokaryoten/Eukaryoten — absolut nicht LP21-konform für Klasse 4. Höchstens Klasse 9+ (Biologie Sek I). |
| `grade1/math.ts` | Daten und Diagramme | `dd1_32`, `dd1_39`–`dd1_50` | Sek I / Gymnasium | Median, Streudiagramm, Korrelation, relative Häufigkeit, Outlier — LP21 Statistik-Basics erscheinen erst ab Zyklus 3. Nicht für Klasse 1 geeignet. |
| `grade1/math.ts` | Sachaufgaben | `sa1_31`–`sa1_50` | Klassen 5–6 | Umfang/Fläche (9m×5m), Geschwindigkeit-Zeit-Weg, Multiplikationen über 100 — nicht grade-1-appropriate. Überschreiten deutlich Zyklus-1-Niveau. |
| `grade1/math.ts` | Daten und Diagramme (dd1_15-dd1_50) | Multiple | Klassen 4–6 | Liniendiagramme, Kreisdiagramme, Prozent, Medianbegriff — erst ab Klasse 4–5 LP21-konform. |
| `grade1/math.ts` | Sachaufgaben | `sa1_23` | Klassen 5–6 | "Umfang = 2×(Länge+Breite)" ist Zyklus-2-Stoff (Klasse 4+), nicht Klasse 1. |
| `grade5/math.ts` | Dezimalzahlen | `g5dz3a`–`g5dz3l` (12 Aufgaben) | — | 12 Duplikat-Aufgaben (cycle 3×4 identical exercises). Inhaltlich OK für Klasse 5, aber müssen durch neue, unique Aufgaben ersetzt werden. |
| `grade5/german.ts` | Direkte Rede | `g5dr3a`–`g5dr3l` (12 Aufgaben) | — | 12 Duplikat-Aufgaben (cycle 3×4 identical exercises). Inhaltlich OK für Klasse 5 (Direkte Rede/Grundgrammatik), aber müssen durch unique Aufgaben ersetzt werden. |

---

## Swiss German Violations (ß)

1. ~~`grade2/math.ts` line 929: `aß` → **fixed** to `ass`~~

No further ß violations found across the 31 audited files.

---

## LP21 Alignment Notes

### grade4/nt.ts — Körper und Gesundheit (Difficulty 3)
Aufgaben `g4kg3a` bis `g4kg3l` behandeln:
- DNA / Desoxyribonukleinsäure
- Mitose / Zellteilung
- Stammzelltherapie
- CRISPR-Cas9
- Proteinsynthese / Transkription / Translation
- Prokaryoten vs. Eukaryoten
- Homöostase
- Epigenetik

**LP21-Mapping:** Diese Themen gehören zur Biologie auf Sek-I-Niveau (NMG.2 / Zyklus 3). Das LP21 sieht für Klasse 4 (Zyklus 2) NMG.1 «Körper, Gesundheit, motorische Fähigkeiten» mit Fokus auf Organe, Körperfunktionen, Ernährung — NICHT Molekularbiologie. Empfehlung: Difficulty-3-Fragen durch altersgerechte Inhalte ersetzen (z.B. Knochenbrüche, Verdauungssystem im Detail, Wie funktioniert das Immunsystem auf einfacher Ebene).

### grade3/math.ts — Zahlen bis 1000 (Difficulty 3)
Aufgaben `z37k`–`z44k`:
- Primzahlen zwischen 100 und 200 (21 Stück)
- GGT von grossen Zahlen
- kgV (kleinstes gemeinsames Vielfaches)

**LP21-Mapping:** MA.1.A für Zyklus 2 (Klasse 3–6): Zahlen verstehen bis 1'000'000, Primzahlen als Begriff OK ab Klasse 4–5. GGT/kgV als systematische Methode sind Sek-I-Stoff. Diese Aufgaben können in Klasse 5–6 bleiben, sollten aus Klasse 3 entfernt werden.

### grade1/math.ts — Sachaufgaben (Difficulty 3, ab sa1_23)
Aufgaben nach `sa1_22`:
- Umfang und Fläche (sa1_23, sa1_30)
- Zug/Geschwindigkeit/Zeit (sa1_31, sa1_39, sa1_43)
- Multiplikationen bis 200+ (sa1_28, sa1_33–50)
- Divisionsaufgaben mit grossen Zahlen

**LP21-Mapping:** MA.3.B Grössen und Masseinheiten + MA.1.A Arithmetik. Diese Aufgaben entsprechen Klasse 5–6-Niveau. Für Klasse 1 (Zyklus 1) sind max. Zahlen bis 20 und einfache +/-Aufgaben vorgesehen. Muss zwingend überarbeitet werden.

### grade1/math.ts — Daten und Diagramme
Die erweiterten `dd1_*` Aufgaben (dd1_11 bis dd1_50):
- Median, Modus, Mittelwert (Statistik)
- Streudiagramm / Scatterplot
- Korrelation (positiv/negativ)
- Relative Häufigkeit in %
- Stichprobengrössen in %

**LP21-Mapping:** MA.3.C «Daten, Zufall» — für Zyklus 1 sind nur einfache Strichlisten und Balkendiagramme angemessen. Statistische Konzepte wie Median, Modus, Streudiagramme gehören in Zyklus 3 (Klasse 7+). Etwa 35 der `dd1_*` Aufgaben sind für Klasse 1 ungeeignet.

### grade5/math.ts — Dezimalzahlen (Difficulty 3: Duplikate)
12 identische Aufgaben (g5dz3a–g5dz3l): Die ersten 4 Aufgaben (g5dz3a–e) sind korrekt, die nächsten 8 (g5dz3f–l) sind exakte Wiederholungen derselben Fragen mit anderen IDs. Inhaltlich passen Dezimalzahlen + Bruchrechnung gut zu Klasse 5 (LP21 MA.1.A Zyklus 2 Ende).

### grade5/german.ts — Direkte Rede (Difficulty 3: Duplikate)
12 Aufgaben (g5dr3a–l): 5 unique + 7 Duplikate. Die Inhalte (Adverb, Gerundium, Konjunktionen, Relativsatz) sind für Klasse 5 angemessen (LP21 SPR.4 Zyklus 2). Nur die Duplikate müssen entfernt werden.

### grade4/nt.ts — NMG-Zuordnung
Die Themen passen gut zu LP21 NMG:
- Körper & Gesundheit → NMG.1 ✓
- Lebensräume → NMG.2 ✓
- Wetter & Klima → NMG.4 ✓
- Pflanzen → NMG.2 ✓
- Technik → NMG.5 ✓
- Ökologie → NMG.2/NMG.3 ✓

### grade4/rzg.ts — Schweizer Kantone
Kantone (RZG) gehören zu LP21 RZG.3 (Räume und Orientierung) — Zyklus 2 ✓. Inhalte wie 26 Kantone, Hauptorte, Sprachen sind grade-appropriate.

---

## Recommendations (prioritized)

### Priorität 1 — Kritisch (sofort)
1. ✅ **ß-Violation grade2/math.ts** — bereits behoben
2. ✅ **Falscher Wert grade1/math.ts v45** — bereits behoben (16 ≠ 20)
3. ✅ **Falsches Zeichen grade1/math.ts vg46** — bereits behoben (10 > 9)

### Priorität 2 — Gravierende Grade-Level-Fehler
4. **grade4/nt.ts Difficulty-3 Bio-Aufgaben** (`g4kg3a`–`g4kg3l`): DNA, CRISPR, Stammzellen, Epigenetik entfernen und durch LP21-NMG.1-Zyklus-2-Inhalte ersetzen (z.B. Ernährungspyramide vertiefen, Organ-Steckbriefe, Pubertät).
5. **grade1/math.ts Sachaufgaben** (`sa1_23`–`sa1_50`): Fläche/Umfang, Geschwindigkeit, grosse Multiplikationen aus Klasse 1 entfernen. Ersetzen durch einfache Sachaufgaben mit Zahlen bis 20.
6. **grade1/math.ts Daten/Diagramme** (`dd1_32`, `dd1_39`–`dd1_50`): Median, Streudiagramm, Korrelation, relative Häufigkeit entfernen. Nur einfache Strichliste + Balkendiagramm für Klasse 1.

### Priorität 3 — Grade-Level-Anpassung empfohlen
7. **grade3/math.ts** (`z37k`, `z38k`, `z39k`, `z44k`): GGT/kgV/grosse Primzahl-Aufgaben nach Klasse 5–6 verschieben.
8. **grade1/math.ts** Sachaufgaben `sa1_31`–`sa1_50` (Geschwindigkeit, Fabrik-Produktion, Lager-Rechnung): Diese passen zu Klasse 5–6-Sachaufgaben-Niveau, nicht Klasse 1.

### Priorität 4 — Content-Qualität (Duplikate)
9. **grade5/math.ts** (`g5dz3f`–`g5dz3l`): 8 doppelte Aufgaben durch unique Dezimalzahl-Aufgaben ersetzen.
10. **grade5/german.ts** (`g5dr3f`–`g5dr3l`): 7 doppelte Aufgaben durch unique Gram­matik-Aufgaben zum Thema Direkte Rede/Indirekte Rede ersetzen.

### Priorität 5 — Allgemeine Qualitätsverbesserungen
11. Die `questionIT` und `questionEN` Feldinhalte enthalten teilweise inkonsistente Übersetzungen (Gemisch aus Deutsch und Englisch). Dies ist in der bestehenden Codebasis systematisch — nicht aufgabenweise korrigierbar ohne umfassenden Refactor.
12. Grade 4 NT/RZG: Die Inhalte sind insgesamt LP21-konform. Nur die 12 Difficulty-3-Bio-Aufgaben in `nt.ts` müssen angepasst werden.

---

## Fixes Applied

| Date | File | ID | Fix |
|------|------|----|-----|
| 2026-03-20 | `grade2/math.ts` | Pictogramm question | ß `aß` → `ass` |
| 2026-03-20 | `grade1/math.ts` | `v45` | Answer "Beide gleich" → "Die Hälfte von 40" (16 ≠ 20) |
| 2026-03-20 | `grade1/math.ts` | `vg46` | Answer `<` → `>` (7+3=10 > 11-2=9) |
