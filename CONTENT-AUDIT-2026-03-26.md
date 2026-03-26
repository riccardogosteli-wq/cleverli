# Cleverli Content Audit — 2026-03-26

## 1. Executive Summary

**Total issues found and fixed: 13**

| Issue Type | Count |
|---|---|
| wrong_answer | 4 |
| hint_contains_answer | 2 |
| grade_inappropriate | 8 |
| unclear_question | 2 |
| grammar / hint quality | 3 |
| ss_violation (ß in hint text) | 1 |

**ß violations in source content:** 2 occurrences found — both **intentional** (grade4 and grade6 German exercises teaching Swiss ss vs ß rule; ß appears only as a wrong answer option, not in correct answers or regular text).

---

## 2. Issues by File

---

### grade1/german.ts

---

**FILE:** grade1/german.ts  
**EXERCISE ID:** sk2  
**ISSUE TYPE:** hint_contains_answer (misleading)  
**DESCRIPTION:** Hint says "Zähle jeden einzeln — es sind 3" but KAT-ZE has 2 Silben, not 3. The answer is correct (2) but the hint was wrong.  
**FIX APPLIED:** Hint 2 changed to "KAT-ZE: zweimal klatschen!"

---

**FILE:** grade1/german.ts  
**EXERCISE ID:** sk26  
**ISSUE TYPE:** wrong_answer  
**DESCRIPTION:** Question asks "Welches Wort hat 4 Silben?" with answer "Sonnenschein" but SON-NEN-SCHEIN = **3 Silben**, not 4. The hint itself acknowledged "das sind 3" — confirming the exercise was self-contradictory.  
**FIX APPLIED:** Question changed to "Welches Wort hat 3 Silben?" Answer changed to "Elefant" (E-LE-FANT = 3 Silben). This is correct and grade-appropriate.

---

**FILE:** grade1/german.ts  
**EXERCISE ID:** sk36  
**ISSUE TYPE:** wrong_answer  
**DESCRIPTION:** "SCHOKO hat ___ Silben" — answer was "3" but SCHOKO = SCHO-KO = **2 Silben**.  
**FIX APPLIED:** Answer changed to "2". Hints updated to "SCHO-KO: zweimal klatschen!"

---

**FILE:** grade1/german.ts  
**EXERCISE ID:** vk49  
**ISSUE TYPE:** wrong_answer  
**DESCRIPTION:** "Wie viele Vokale hat «ZAUBERWALD»?" — answer was "3" but Z-**A**-**U**-B-**E**-R-W-**A**-L-D contains **4 vowels** (A, U, E, A). The hint even said "4 Vokale! Achtung!" — confirming the answer was wrong.  
**FIX APPLIED:** Answer changed to "4". Hints no longer give away the answer directly.

---

**FILE:** grade1/german.ts  
**EXERCISE ID:** r9  
**ISSUE TYPE:** unclear_question  
**DESCRIPTION:** Question asked "Regen reimt sich auf ___ (ein Tier)" — but neither "Wegen" nor "Degen" are animals. The answer was confusing and incorrect as framed.  
**FIX APPLIED:** Question reworded to "Regen reimt sich auf: ___. (-egen)" — open answer without the false animal constraint. Answer "Wegen (oder Segen)".

---

**FILE:** grade1/german.ts  
**EXERCISE ID:** r14  
**ISSUE TYPE:** unclear_question + wrong_answer  
**DESCRIPTION:** Question "Der ___ ist gelb (reimt sich auf «Mond»)" had a nonsensical answer "Sond... (Kein Reim!) Mond reimt sich auf Bond". A fill-in exercise cannot have "Kein Reim!" as its answer.  
**FIX APPLIED:** Question changed to "Was reimt sich auf «Mond»?" Answer changed to "blond". Straightforward and grade-appropriate.

---

**FILE:** grade1/german.ts  
**EXERCISE ID:** r25  
**ISSUE TYPE:** hint_contains_answer (misleading)  
**DESCRIPTION:** Answer is "freut" but hint says "Scheint... was reimt sich? -eint. Weint!" — the hint actively pointed to the WRONG answer "weint". Misleading and confusing for a Grade 1 child.  
**FIX APPLIED:** Hints changed to neutral guidance: "Welches Wort reimt sich auf «scheint»?" and "«schläft» und «singt» reimen sich nicht auf «scheint»."

---

**FILE:** grade1/german.ts  
**EXERCISE ID:** b40  
**ISSUE TYPE:** wrong_answer  
**DESCRIPTION:** "Welcher Buchstabe ist im deutschen Alphabet RICHTIG?" with answer "Ö" — but Ä, Ö, Ü are ALL correct German letters (Umlaute). The fourth option "alle sind richtig" was the correct answer.  
**FIX APPLIED:** Question reworded to "Welche dieser Aussagen ist RICHTIG?" with correct answer "alle sind richtig". Hints updated.

---

**FILE:** grade1/german.ts  
**EXERCISE ID:** vk45  
**ISSUE TYPE:** wrong_answer  
**DESCRIPTION:** "Welches Wort hat gleich viele Vokale und Konsonanten?" — answer was "BLUME" (B,L,M = 3 Konsonanten vs U,E = 2 Vokale). This is NOT equal. The hint even acknowledged this: "nicht gleich". None of the four options actually had equal vowels and consonants.  
**FIX APPLIED:** Question changed to "Welches Wort hat mehr Vokale als Konsonanten?" — EULE (3 vowels vs 1 consonant) is now the correct answer. Hints updated to guide without giving away.

---

### grade3/math.ts

---

**FILE:** grade3/math.ts  
**EXERCISE IDs:** z37k, z38k, z39k, z43k, z44k, z45k, z46k, z50k  
**ISSUE TYPE:** grade_inappropriate  
**DESCRIPTION:** Eight difficulty-3 exercises in the "Zahlen bis 1000" topic were completely inappropriate for Grade 3 (age 9):  
- Binary number representation (1000 in Binär)  
- Fibonacci sequence  
- Roman numerals for 900  
- √900 (square root)  
- 2¹⁰ (powers)  
- Primzahl (prime numbers — more appropriate for Grade 5+)  
- LCM/GCD calculations  

These belong in middle school mathematics, not primary school Grade 3.  
**FIX APPLIED:** All 8 exercises replaced with age-appropriate Grade 3 content: digit sums, number sequences in hundreds, place value, rounding, and mental arithmetic with 3-digit numbers.

---

**FILE:** grade3/math.ts  
**EXERCISE IDs:** z41k, z47k  
**ISSUE TYPE:** other (duplicate)  
**DESCRIPTION:** Both exercises asked "Was ist die Quersumme/Summe aller Ziffern von 999?" — exact duplicate.  
**FIX APPLIED:** z47k changed to ask about 756 instead.

---

### grade4/german.ts

---

**FILE:** grade4/german.ts  
**EXERCISE ID:** g4rs1d  
**ISSUE TYPE:** grammar (confusing hint)  
**DESCRIPTION:** Hint read "Schweiz: ss statt ss → Fuss!" — this was copy-paste error making the hint nonsensical ("ss statt ss").  
**FIX APPLIED:** Hint changed to "In der Schweiz schreibt man immer ss, nie ß."

---

## 3. ß Violations (Quick Reference)

### Intentional ß appearances (do NOT fix):

| File | Line | Context |
|---|---|---|
| grade4/german.ts | ~184 | Exercise g4rs1d — "Fuß" appears as a **wrong answer option** in a question specifically testing Swiss ss/ß rule |
| grade6/german.ts | ~135 | Exercise g6d27 — "heiß (mit ß)" appears as a **wrong answer option** in a question about Swiss spelling |

Both are pedagogically correct — they show what NOT to write in Switzerland and are essential for the ss/ß teaching exercise.

### No unintentional ß violations found.

---

## 4. Build Status

All fixes applied. Build verified (see commit).
