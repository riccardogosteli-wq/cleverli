# Cleverli — Session Changelog April 1–4, 2026
*Durchgeführt von: Cleverli Bot + Alexandra Gosteli (Asset-Design) + Ricci (Freigabe)*

---

## 🖼️ Asset & Icon Updates

### Mascot Poses (neue Murmeli-Bilder von Alexandra)
- `cleverli-wave.png` → Murmeli auf Wolke mit ABC-Buch (Hintergrund entfernt)
- `cleverli-celebrate.png` → neue Version
- `cleverli-run.png` → neue Version
- `cleverli-sit-read.png` → neue Version
- `cleverli-think.png` → neue Version
- `apple-touch-icon.png` → neue Version
- `cleverli-faq.png` → **NEU** (Murmeli FAQ-Pose)
- `cleverli-feedback.png` → **NEU** (Murmeli Feedback-Pose)
- `cleverli-topic-complete.png` → **NEU** (Murmeli Wolke, für "Thema geschafft!")

### Fach-Icons (Dashboard + Homepage)
- `Mathematik.png` → Murmeli mit 1-2-3 in blauem Kreis (ersetzt alte SVG)
- `Deutsch.png` → Murmeli mit ABC-Buch in blauem Kreis (ersetzt alte SVG)
- `NMG.png` → Murmeli mit Weltkugel (ersetzt alte SVG)
- Alle drei mit `rembg` freigestellt (kein schwarzer Hintergrund)

### Homepage Bild-Zuweisungen
- **FAQ-Sektion** → `cleverli-faq.png`
- **Testimonials ("Was Eltern sagen")** → `cleverli-feedback.png`
- **"Lena hat ihr Ziel erreicht!"** → `cleverli-think.png`
- **Fach-Karten** (Mathematik/Deutsch/NMG) → neue Murmeli-PNGs statt Emoji
- **"Thema geschafft!" RewardAnimation** → `cleverli-topic-complete.png` (kein KI-Bild mehr)

### Image Inventory
- Passwortgeschützte Inventar-Seite: `cleverli.ch/image-inventory.html` (pw: `testing`)
- 177 Bilddateien + 293 Emoji dokumentiert
- Wird automatisch aktualisiert bei Asset-Änderungen

---

## 🐛 Bug Fixes

### iOS Scroll-Probleme
- **NumberLine-Slider** blockierte vertikales Scrollen → `touch-action: pan-y` hinzugefügt
- **DragDrop-Container** blockierte vertikales Scrollen → `touch-action: none` vom Container entfernt (bleibt nur auf den Drag-Items)

### Exercise / Feedback
- **Wrong-Answer Panel** zeigte rohen Code `all`/`done` → zeigt jetzt "Alle Elemente richtig zuordnen"
- **Doppeltes Feedback** bei Fill-in-Blank entfernt (einmal im Exercise, einmal im Panel)
- **Exercise bleibt sichtbar** wenn falsch geantwortet → Kind sieht Frage + eigene Antwort + richtige Antwort
- **Feedback-Verzögerung** von 0.9s auf 1.5s erhöht → Kind sieht rot/grün-Markierung lang genug

### Answer Matching (Fill-in-Blank)
- **Flexible Antwort-Prüfung**: "S e", "S und E", "s und e" → alle werden als gleich erkannt
- **`altAnswers`-Feld** hinzugefügt: eine Aufgabe kann mehrere korrekte Antworten haben
- **"Zahlwort"** wird jetzt als korrekte Antwort erkannt (war zu streng: "Ein Zahlwort (eins, zwei...)")

### Review-Schleife
- **Review-Bug**: Nach einem fehlerhaften Review-Durchgang wurde "Alle Fehler korrigiert!" angezeigt obwohl noch Fehler vorhanden
- Fix: Review-Schleife wiederholt sich bis wirklich alle Fehler korrigiert sind

### Memory-Spiele
- **Pair-ID-Bug**: Memory-Übungen hatten falsche Paar-IDs → Karten konnten nie gematcht werden
- Fix: Alle Memory-Übungen in Grade 1 Mathe korrigiert (Addition, Formen, Mengen)
- Jedes Memory-Spiel hat jetzt 4 verschiedene, lösbare Paare

### Combo Voice
- **Streak-Stimme** sagte "Du bist ein Mathegenie" bei JEDEM richtigen nach 3er-Serie
- Fix: Stimme spielt nur noch bei 3, 5 und 8 richtig in Folge

### i18n / Übersetzungen
- `allErrorsCorrected` Key zu allen 4 Sprachen (DE/FR/IT/EN) hinzugefügt
- `allCorrectPlacement` Key zu allen 4 Sprachen hinzugefügt

### Exercise Content
- **a35** (\_\_\_ + \_\_\_ = 10): von Fill-in-Blank zu Multiple-Choice → kein iOS-Tastatur-Problem
- **a38** (Wie viele Möglichkeiten): von Fill-in-Blank zu Multiple-Choice
- **"Zahlwort"**-Antwort in Grade 3 + Grade 6 Deutsch vereinfacht

---

## 👤 Alexandra Zugang
- Alexandra Gosteli (Telegram ID: 347972526) zur Cleverli Bot-Allowlist hinzugefügt
- Kann direkt mit @cleverli1231_bot chatten für Asset-Austausch und Feedback

---

## ✅ Test-Account
- **Email:** test@cleverli.ch
- **Passwort:** CleverliTest2026!
- **Premium:** bis 2030 aktiv (alle Übungen freigeschaltet)

---

## 📊 Commits (25 in dieser Session)
Alle gepusht auf `main` → automatisch deployed via Vercel.

```
49f7169 Replace topic complete image with Murmeli cloud PNG
b9ce2f6 Fix: Remove touch-action:none from DragDrop container
4a504e4 Fix: Remove black bg from subject icons + replace homepage emoji
984329a Update Mathematik icon to Murmeli 123
0c08a78 Fix: Replace emoji with Cleverli icons on homepage
3c45336 Use cleverli-feedback.png for testimonials section
6766dab Update Deutsch icon (ABC book circle, Alexandra final)
2c010b0 Replace subject icons: new Deutsch, Mathematik, NMG PNGs
fd35f03 Fix: Convert fill-in-blank math to multiple-choice (a35, a38)
1463e54 Fix: Multiple answers, allErrorsCorrected i18n, combo voice
ced33c0 Fix: Accept Zahlwort + review loop fix
5215058 Use cleverli-faq.png for FAQ section
44dec71 Replace celebrate with think mascot on reward preview
280aad6 Fix: Flexible answer matching + remove duplicate feedback
e3f659d UX: Increase feedback delay to 1.5s
321ddaf UX: Keep exercise visible on wrong answer
a02593c Fix: Proper feedback for drag-drop/memory (no raw 'all')
56554bf Fix: Memory pair IDs + 4 pairs per game
bd0e0d7 Fix: NumberLine slider iOS scroll
abab12e Replace cleverli-wave.png (transparent)
77bf426 Replace mascot poses + add faq/feedback
4e2a9c2 Add image inventory page (pw: testing)
```
