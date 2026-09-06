import type { Exercise } from "@/types/exercise";
// Reviewed Grade 1 Maths corrections, German branch only.
const corrections: Record<string, Partial<Exercise>> = {
  "z4": {
    "hints": [
      "Zähle von fünf aus vorwärts.",
      "Wähle die Zahl beim nächsten Schritt."
    ]
  },
  "z5": {
    "hints": [
      "Vergleiche immer zwei Zahlen.",
      "Behalte die grössere und vergleiche sie weiter."
    ]
  },
  "z6": {
    "hints": [
      "Zähle von sieben aus weiter.",
      "Gesucht ist die nächste Zahl beim Zählen."
    ]
  },
  "z7": {
    "question": "Welche Ziffer bedeutet acht?",
    "hints": [
      "Sprich die Zahlen beim Zählen laut aus.",
      "Suche die Ziffer zum Zahlwort acht."
    ]
  },
  "z8": {
    "hints": [
      "Zähle von drei aus rückwärts.",
      "Gehe genau einen Zählschritt zurück."
    ]
  },
  "z9": {
    "hints": [
      "Vergleiche immer zwei Zahlen.",
      "Behalte die kleinere und vergleiche sie weiter."
    ]
  },
  "z10": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 2, 4, 6, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 2, 4, 6, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 2 weiter. Prüfe jeden Abstand."
    ]
  },
  "z12": {
    "hints": [
      "Beginne bei null auf dem Zahlenstrahl.",
      "Zähle die Schritte nach rechts bis zur gesuchten Zahl."
    ]
  },
  "z13": {
    "hints": [
      "Zähle jeden Vogel einzeln.",
      "Zeige auf jeden Vogel genau einmal."
    ]
  },
  "z14": {
    "hints": [
      "Zähle von neun aus weiter.",
      "Gesucht ist die nächste Zahl beim Zählen."
    ]
  },
  "z15": {
    "hints": [
      "Zähle von acht aus rückwärts.",
      "Gehe genau einen Zählschritt zurück."
    ]
  },
  "z18": {
    "hints": [
      "Sprich die Ziffer laut aus.",
      "Lies die Zahlwörter und suche das passende."
    ]
  },
  "z19": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 3, 4, fehlende Zahl, 6",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 1 weiter. Prüfe jeden Abstand."
    ]
  },
  "z22": {
    "hints": [
      "Beginne bei null auf dem Zahlenstrahl.",
      "Zähle die Schritte nach rechts bis zur gesuchten Zahl."
    ]
  },
  "z23": {
    "question": "Welche Zahl ist 2 mehr als 4? ___",
    "hints": [
      "Beginne bei vier und zähle weiter.",
      "Gehe zwei Zählschritte vorwärts."
    ]
  },
  "z24": {
    "hints": [
      "Lege für jede Zahl gleich viele Plättchen.",
      "Bilde Paare. Bei einer geraden Zahl bleibt keines übrig."
    ]
  },
  "z25": {
    "hints": [
      "Fang mit der kleinsten Zahl an.",
      "Wähle danach die kleinste der übrigen Zahlen."
    ]
  },
  "z26": {
    "hints": [
      "Vergleiche immer zwei der angegebenen Zahlen.",
      "Behalte die grössere und vergleiche sie weiter."
    ]
  },
  "z27": {
    "hints": [
      "Beginne bei zehn und zähle rückwärts.",
      "Gehe genau einen Zählschritt zurück."
    ]
  },
  "z29": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 8, 7, fehlende Zahl, 5",
    "question": "Ergänze die Zahlenreihe: 8, 7, ___, 5",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 1 zurück. Prüfe jeden Abstand."
    ]
  },
  "z30": {
    "hints": [
      "Lege für jede Zahl gleich viele Plättchen.",
      "Bilde Paare. Gesucht ist die Zahl mit einem Rest."
    ]
  },
  "z33": {
    "spokenPrompt": "Sortiere die Zahlen in zwei Gruppen: eins bis fünf oder sechs bis zehn."
  },
  "z34": {
    "hints": [
      "Prüfe jede Zahl einer Gruppe einzeln.",
      "Eine Zahl ab sechs macht die ganze Gruppe falsch."
    ]
  },
  "z35": {
    "hints": [
      "Beginne bei null auf dem Zahlenstrahl.",
      "Zähle die Schritte nach rechts bis zur gesuchten Zahl."
    ]
  },
  "z36": {
    "question": "Welche Zahl ist 3 weniger als 9? ___",
    "hints": [
      "Beginne bei neun und zähle rückwärts.",
      "Gehe drei Zählschritte zurück."
    ]
  },
  "z38": {
    "hints": [
      "Fang mit der kleinsten Zahl an.",
      "Wähle danach die kleinste der übrigen Zahlen."
    ]
  },
  "z40": {
    "hints": [
      "Beginne mit Tims Anzahl Murmeln.",
      "Zähle vier Murmeln dazu."
    ]
  },
  "z41": {
    "hints": [
      "Zähle von sieben bis neun.",
      "Prüfe die Zahl dazwischen: Lässt sie sich in Paare teilen?"
    ]
  },
  "z42": {
    "hints": [
      "Zähle die beiden Zahlen jeder Antwort zusammen.",
      "Prüfe, bei welchem Paar du genau zehn erhältst."
    ]
  },
  "z44": {
    "hints": [
      "Zähle von vier aus bis sieben weiter.",
      "Zähle dabei die Schritte, nicht die Startzahl."
    ]
  },
  "z45": {
    "hints": [
      "Bei dieser Reihenfolge kommt die grösste Zahl zuerst.",
      "Vergleiche die Zahlen und behalte jeweils die grössere."
    ]
  },
  "z47": {
    "hints": [
      "Zähle von sechs bis acht.",
      "Prüfe die Zahl dazwischen: Bleibt beim Paarbilden eines übrig?"
    ]
  },
  "z49": {
    "hints": [
      "Die offene Seite des Zeichens zeigt zur grösseren Zahl.",
      "Prüfe jede Aussage. Gleich bedeutet: Beide Zahlen sind gleich gross."
    ]
  },
  "a1": {
    "spokenPrompt": "Wie viel ist drei plus vier?"
  },
  "a3": {
    "spokenPrompt": "Wie viel ist eins plus acht?"
  },
  "a5": {
    "spokenPrompt": "Wie viel ist fünf plus fünf?"
  },
  "a6": {
    "hints": [
      "Lege sieben Plättchen hin. Die andere Gruppe ist leer.",
      "Schiebe die beiden Gruppen zusammen und zähle die Plättchen."
    ]
  },
  "a7": {
    "spokenPrompt": "Wie viel ist sechs plus drei?",
    "hints": [
      "Beginne bei sechs.",
      "Zähle drei Schritte vorwärts."
    ]
  },
  "a8": {
    "hints": [
      "Zähle von zwei bis sechs und merke dir die Anzahl der Schritte.",
      "Setze deine Zahl in die Lücke und rechne nach."
    ]
  },
  "a9": {
    "spokenPrompt": "Wie viel ist sieben plus zwei?",
    "hints": [
      "Beginne bei sieben.",
      "Zähle zwei Schritte vorwärts."
    ]
  },
  "a10": {
    "hints": [
      "Lege acht Plättchen hin und schiebe drei zur Seite.",
      "Prüfe: Deine Zahl plus drei muss acht ergeben."
    ]
  },
  "a11": {
    "spokenPrompt": "Zwei Katzen und drei Katzen: Wie viele Katzen sind das zusammen?",
    "hints": [
      "Zähle alle Katzen zusammen.",
      "Tippe jede Katze beim Zählen genau einmal an."
    ]
  },
  "a12": {
    "spokenPrompt": "Wie viel ist sechs plus eins?"
  },
  "a13": {
    "spokenPrompt": "Wie viel ist eins plus drei?",
    "question": "1 + 3 =?",
    "hints": [
      "Beginne bei drei.",
      "Zähle einen Schritt weiter."
    ]
  },
  "a15": {
    "spokenPrompt": "Wie viel ist acht plus zwei?",
    "hints": [
      "Beginne bei acht.",
      "Zähle zwei Schritte vorwärts."
    ]
  },
  "a16": {
    "spokenPrompt": "Wie viel ist eins plus neun?"
  },
  "a17": {
    "spokenPrompt": "Wie viel ist fünf plus drei?",
    "hints": [
      "Beginne bei fünf.",
      "Zähle drei Schritte vorwärts."
    ]
  },
  "a19": {
    "hints": [
      "Zähle von vier bis sieben und merke dir die Schritte.",
      "Prüfe jede mögliche Zahl: Ergibt sie zusammen mit vier sieben?"
    ]
  },
  "a20": {
    "hints": [
      "Zähle von fünf bis zehn und merke dir die Anzahl der Schritte.",
      "Setze deine Zahl ein und rechne zur Kontrolle nach."
    ]
  },
  "a21": {
    "spokenPrompt": "Wie viel ist vier plus vier plus zwei?",
    "hints": [
      "Rechne zuerst vier plus vier.",
      "Zähle zum Zwischenergebnis noch zwei dazu."
    ]
  },
  "a22": {
    "hints": [
      "Zähle von sieben bis zehn und merke dir die Schritte.",
      "Prüfe: Sieben plus deine Zahl muss zehn ergeben."
    ]
  },
  "a23": {
    "hints": [
      "Rechne jede der vier Aufgaben aus.",
      "Beginne jeweils bei der grösseren Zahl und zähle die kleinere dazu."
    ]
  },
  "a24": {
    "hints": [
      "Zähle von sechs bis zehn und merke dir die Schritte.",
      "Prüfe: Sechs plus deine Zahl muss zehn ergeben."
    ]
  },
  "a25": {
    "hints": [
      "Zähle die Bonbons von Anna und Lena zusammen.",
      "Beginne bei fünf und zähle noch drei dazu."
    ]
  },
  "a26": {
    "spokenPrompt": "Wie viel ist zwei plus vier plus drei?",
    "hints": [
      "Rechne zuerst zwei plus vier.",
      "Zähle zum Zwischenergebnis noch drei dazu."
    ]
  },
  "a27": {
    "question": "Welche Zahl fehlt? ___ + 7 = 9",
    "hints": [
      "Zähle von sieben bis neun und merke dir die Schritte.",
      "Prüfe: Deine Zahl plus sieben muss neun ergeben."
    ]
  },
  "a28": {
    "hints": [
      "Lege je vier Plättchen für die Äpfel und für die Birnen.",
      "Zähle beide Gruppen zusammen."
    ]
  },
  "a29": {
    "hints": [
      "Zähle von vier bis sechs und merke dir die Schritte.",
      "Prüfe: Vier plus deine Zahl muss sechs ergeben."
    ]
  },
  "a31": {
    "hints": [
      "Überlege, ob die Menge am Anfang und am Ende gleich ist.",
      "Vergleiche die Zahl am Anfang mit dem Ergebnis: Soll sich die Menge verändern?"
    ]
  },
  "a32": {
    "spokenPrompt": "Drei Stifte, noch drei Stifte und nochmals drei Stifte: Wie viele Stifte sind es zusammen?",
    "hints": [
      "Lege drei Gruppen mit je drei Stiften.",
      "Zähle erst zwei Gruppen zusammen und dann die dritte dazu."
    ]
  },
  "a33": {
    "spokenPrompt": "Zwei plus welche Zahl ergibt acht?",
    "question": "2 + ___ = 8",
    "hints": [
      "Zähle von zwei bis acht und merke dir die Schritte.",
      "Setze deine Zahl ein und prüfe die Rechnung."
    ]
  },
  "a34": {
    "spokenPrompt": "Finde immer zwei gleiche Rechenkarten!",
    "question": "Finde immer zwei gleiche Rechenkarten!",
    "hints": [
      "Merke dir die Rechnung und den Platz einer aufgedeckten Karte.",
      "Suche die zweite Karte mit genau derselben Rechnung."
    ]
  },
  "a38": {
    "spokenPrompt": "Welche Zahl plus zwei plus drei ergibt neun?",
    "question": "Welche Zahl fehlt? ___ + 2 + 3 = 9",
    "hints": [
      "Rechne zuerst zwei plus drei.",
      "Wie viel fehlt von diesem Zwischenergebnis bis neun?"
    ]
  },
  "a39": {
    "spokenPrompt": "Welche Zahl plus eins plus drei ergibt zehn?",
    "question": "Welche Zahl fehlt? ___ + 1 + 3 = 10",
    "hints": [
      "Rechne zuerst eins plus drei.",
      "Ergänze von diesem Zwischenergebnis bis zehn."
    ]
  },
  "a40": {
    "spokenPrompt": "Welche Zahl plus zwei plus drei ergibt zehn?",
    "hints": [
      "Rechne zuerst zwei plus drei.",
      "Ergänze von diesem Zwischenergebnis bis zehn."
    ]
  },
  "a41": {
    "question": "Welche Rechnung hat das grösste Ergebnis?",
    "hints": [
      "Rechne jede Aufgabe aus.",
      "Vergleiche die Ergebnisse. Gesucht ist das grösste."
    ]
  },
  "a42": {
    "spokenPrompt": "Morgen backt Oma drei Kuchen, übermorgen noch fünf. Wie viele Kuchen sind das zusammen?",
    "hints": [
      "Zähle die Kuchen von beiden Tagen zusammen.",
      "Beginne bei fünf und zähle noch drei dazu."
    ]
  },
  "a43": {
    "hints": [
      "Rechne jede Aufgabe aus.",
      "Vergleiche die Ergebnisse. Gesucht ist das kleinste."
    ]
  },
  "a44": {
    "spokenPrompt": "Ich habe einige Murmeln. Ich bekomme zuerst eine und dann noch eine dazu. Jetzt habe ich zehn. Wie viele hatte ich am Anfang?",
    "question": "Ich habe einige Murmeln. Ich bekomme zuerst 1 und dann noch 1 dazu. Jetzt habe ich 10. Wie viele hatte ich am Anfang?",
    "hints": [
      "Überlege, wie viele Murmeln insgesamt dazukommen.",
      "Gehe von zehn um diese Anzahl rückwärts und prüfe deine Zahl."
    ]
  },
  "a46": {
    "hints": [
      "Gehe von neun vier Schritte rückwärts.",
      "Prüfe: Deine Zahl plus vier muss neun ergeben."
    ]
  },
  "a47": {
    "hints": [
      "Rechne die linke Seite aus.",
      "Prüfe, welche Zahl rechts zusammen mit vier dasselbe Ergebnis ergibt."
    ]
  },
  "a48": {
    "spokenPrompt": "Welche Zahl plus zwei plus zwei ergibt neun?",
    "question": "___ + 2 + 2 = 9",
    "hints": [
      "Rechne zuerst zwei plus zwei.",
      "Ergänze von diesem Zwischenergebnis bis neun."
    ]
  },
  "a49": {
    "hints": [
      "Rechne bei jeder Aussage die linke und die rechte Seite aus.",
      "Das Gleichheitszeichen stimmt nur, wenn beide Ergebnisse gleich sind."
    ]
  },
  "a50": {
    "spokenPrompt": "Lena hat gleich viele Stifte wie Mia. Lena hat vier Stifte. Wie viele Stifte haben die beiden zusammen?"
  },
  "s1": {
    "spokenPrompt": "Wie viel ist acht minus drei?",
    "hints": [
      "Lege acht Plättchen hin und nimm drei weg.",
      "Zähle die übrigen Plättchen."
    ]
  },
  "s2": {
    "hints": [
      "Lege zehn Plättchen hin und nimm vier weg.",
      "Zähle die übrigen Plättchen."
    ]
  },
  "s3": {
    "spokenPrompt": "Wie viel ist sieben minus sieben?",
    "hints": [
      "Lege sieben Plättchen hin und nimm sieben weg.",
      "Schau nach, wie viele Plättchen übrig sind."
    ]
  },
  "s5": {
    "spokenPrompt": "Wie viel ist sechs minus zwei?",
    "hints": [
      "Beginne bei sechs.",
      "Zähle zwei Schritte rückwärts."
    ]
  },
  "s6": {
    "hints": [
      "Lege fünf Plättchen hin. Nimm so viele weg, bis noch zwei da sind.",
      "Zähle die weggenommenen Plättchen und prüfe deine Rechnung."
    ]
  },
  "s7": {
    "spokenPrompt": "Wie viel ist zehn minus sechs?"
  },
  "s8": {
    "hints": [
      "Lege acht Plättchen hin. Du nimmst kein Plättchen weg.",
      "Zähle, wie viele Plättchen jetzt da sind."
    ]
  },
  "s9": {
    "spokenPrompt": "Wie viel ist drei minus eins?",
    "hints": [
      "Beginne bei drei.",
      "Gehe einen Schritt rückwärts."
    ]
  },
  "s12": {
    "spokenPrompt": "Wie viel ist neun minus null?",
    "hints": [
      "Lege neun Plättchen hin. Du nimmst kein Plättchen weg.",
      "Zähle, wie viele Plättchen jetzt da sind."
    ]
  },
  "s13": {
    "hints": [
      "Beginne bei sieben.",
      "Gehe vier Schritte rückwärts."
    ]
  },
  "s14": {
    "spokenPrompt": "Wie viel ist sechs minus eins?",
    "question": "6 − 1 =?",
    "hints": [
      "Beginne bei sechs.",
      "Gehe einen Schritt rückwärts."
    ]
  },
  "s15": {
    "hints": [
      "Lege sechs Plättchen hin und nimm drei weg.",
      "Zähle die übrigen Plättchen."
    ]
  },
  "s16": {
    "hints": [
      "Lege acht Plättchen für die Bonbons hin und nimm fünf weg.",
      "Zähle, wie viele übrig bleiben."
    ]
  },
  "s17": {
    "hints": [
      "Lege zwei Plättchen hin und nimm zwei weg.",
      "Schau nach, wie viele Plättchen übrig sind."
    ]
  },
  "s18": {
    "hints": [
      "Zähle von sieben bis zehn und merke dir die Anzahl der Schritte.",
      "Ziehe deine Zahl von zehn ab. Bleiben sieben übrig?"
    ]
  },
  "s19": {
    "hints": [
      "Zu den vier übrigen Plättchen gehören noch die fünf weggenommenen.",
      "Zähle beide Gruppen zusammen und prüfe deine Rechnung."
    ]
  },
  "s20": {
    "hints": [
      "Lege acht Plättchen hin und nimm so viele weg, bis noch drei da sind.",
      "Zähle die weggenommenen Plättchen."
    ]
  },
  "s21": {
    "hints": [
      "Stelle dir sieben Fische vor. Zwei schwimmen weg.",
      "Gehe von sieben zwei Schritte rückwärts."
    ]
  },
  "s23": {
    "hints": [
      "Rechne jede Aufgabe aus.",
      "Zähle jeweils von der ersten Zahl um die zweite Zahl zurück."
    ]
  },
  "s24": {
    "spokenPrompt": "Wie viel ist zehn minus drei minus vier?",
    "hints": [
      "Gehe von zehn drei Schritte rückwärts.",
      "Gehe vom Zwischenergebnis noch vier Schritte rückwärts."
    ]
  },
  "s25": {
    "hints": [
      "Lege sechs Plättchen hin. Am Ende soll kein Plättchen mehr da sein.",
      "Zähle, wie viele Plättchen du dafür wegnehmen musst."
    ]
  },
  "s27": {
    "hints": [
      "Beginne bei den vier übrigen Plättchen.",
      "Lege die sechs weggenommenen wieder dazu und zähle alle."
    ]
  },
  "s28": {
    "spokenPrompt": "Wie viel ist neun minus sieben?",
    "hints": [
      "Zähle von sieben bis neun und merke dir die Anzahl der Schritte.",
      "Prüfe: Deine Zahl plus sieben muss neun ergeben."
    ]
  },
  "s29": {
    "hints": [
      "Lege zehn Plättchen für die Vögel hin und nimm vier weg.",
      "Zähle die übrigen Plättchen."
    ]
  },
  "s30": {
    "spokenPrompt": "Wie viel ist fünf minus vier?",
    "hints": [
      "Beginne bei fünf.",
      "Gehe vier Schritte rückwärts."
    ]
  },
  "s31": {
    "spokenPrompt": "Wie viel ist sieben minus null minus sieben?",
    "hints": [
      "Lege sieben Plättchen hin. Beim ersten Schritt nimmst du keines weg.",
      "Nimm beim zweiten Schritt sieben weg. Wie viele bleiben?"
    ]
  },
  "s32": {
    "hints": [
      "Beginne bei den sechs übrigen Plättchen.",
      "Lege die drei weggenommenen wieder dazu und zähle alle."
    ]
  },
  "s33": {
    "hints": [
      "Lege acht Plättchen hin und nimm so viele weg, bis noch fünf da sind.",
      "Zähle die weggenommenen Plättchen."
    ]
  },
  "s34": {
    "hints": [
      "Rechne jede Aufgabe aus.",
      "Zähle jeweils von der ersten Zahl um die zweite Zahl zurück."
    ]
  },
  "s35": {
    "hints": [
      "Nimm von zehn Plättchen zuerst drei weg.",
      "Nimm danach noch zwei weg und zähle den Rest."
    ]
  },
  "s36": {
    "spokenPrompt": "Zehn minus drei minus welche Zahl ergibt vier?",
    "hints": [
      "Rechne zuerst zehn minus drei.",
      "Überlege, wie viel du vom Zwischenergebnis wegnehmen musst, damit vier bleiben."
    ]
  },
  "s37": {
    "hints": [
      "Rechne zuerst acht minus drei.",
      "Ziehe vom Zwischenergebnis noch zwei ab."
    ]
  },
  "s38": {
    "hints": [
      "Beginne bei vier und mache das Wegnehmen rückgängig.",
      "Zähle fünf dazu und prüfe deine Zahl in der Geschichte."
    ]
  },
  "s40": {
    "spokenPrompt": "Zehn minus zwei minus welche Zahl ergibt drei?",
    "question": "10 − 2 − ___ = 3",
    "hints": [
      "Rechne zuerst zehn minus zwei.",
      "Überlege, wie viel du dann noch wegnehmen musst, damit drei bleiben."
    ]
  },
  "s41": {
    "hints": [
      "Rechne zehn minus drei aus.",
      "Vergleiche dein Ergebnis mit der Zahl rechts vom Gleichheitszeichen."
    ]
  },
  "s42": {
    "spokenPrompt": "Wie viel ist sieben minus drei plus zwei?",
    "hints": [
      "Rechne zuerst sieben minus drei.",
      "Zähle zum Zwischenergebnis zwei dazu."
    ]
  },
  "s43": {
    "spokenPrompt": "Wie viel ist neun minus drei minus drei?",
    "hints": [
      "Gehe von neun drei Schritte rückwärts.",
      "Gehe dann noch einmal drei Schritte rückwärts."
    ]
  },
  "s44": {
    "spokenPrompt": "Zehn minus vier ergibt sechs. Wie viel ist zehn minus fünf?",
    "hints": [
      "Vergleiche, wie viel bei den beiden Rechnungen weggenommen wird.",
      "Lege die erste Rechnung mit Plättchen. Nimm dann noch ein Plättchen weg."
    ]
  },
  "s46": {
    "spokenPrompt": "Welche Zahl minus zwei minus eins ergibt zwei?",
    "question": "___ − 2 − 1 = 2",
    "hints": [
      "Beginne bei den zwei übrigen Plättchen.",
      "Lege erst eines und dann zwei wieder dazu. Prüfe deine Startzahl."
    ]
  },
  "s47": {
    "question": "Welche Rechnung hat das kleinste Ergebnis?"
  },
  "s48": {
    "hints": [
      "Ziehe die vier verlorenen Sticker von zehn ab.",
      "Zähle den wiedergefundenen Sticker dazu."
    ]
  },
  "s49": {
    "spokenPrompt": "Welche Zahl minus zwei plus eins ergibt sieben?",
    "question": "Welche Zahl fehlt? ___ − 2 + 1 = 7",
    "hints": [
      "Beginne bei sieben und mache die Schritte rückgängig.",
      "Nimm zuerst eins weg und zähle dann zwei dazu. Prüfe deine Startzahl."
    ]
  },
  "s50": {
    "spokenPrompt": "Zehn minus sechs ergibt vier. Schreibe dazu die passende Addition: Vier plus welche Zahl ergibt zehn?"
  },
  "f2": {
    "spokenPrompt": "Ein Tisch hat zwei lange und zwei kurze Seiten. Alle Ecken sind rechtwinklig. Welche Form hat seine Platte?",
    "question": "Ein Tisch hat zwei lange und zwei kurze Seiten. Alle Ecken sind rechtwinklig. Welche Form hat seine Platte?"
  },
  "f9": {
    "question": "Ordne die Formen ihren Eigenschaften zu!",
    "hints": [
      "Betrachte jede Form einzeln.",
      "Prüfe ihre Ecken und Seiten."
    ]
  },
  "f16": {
    "answer": "Dreieck",
    "question": "Welche Form hat drei gerade Seiten? ___",
    "altAnswers": [
      "ein Dreieck"
    ],
    "hints": [
      "Zeichne die Form mit drei Strichen.",
      "Verbinde die Striche zu einer geschlossenen Form."
    ]
  },
  "f17": {
    "question": "Welche Form hat vier gleich lange Seiten und vier rechte Winkel?",
    "options": [
      "Kreis",
      "Dreieck",
      "Quadrat",
      "Oval"
    ],
    "optionImages": []
  },
  "f18": {
    "question": "Was gilt immer für ein Quadrat?",
    "options": [
      "Beim Quadrat sind alle Seiten gleich lang",
      "Das Quadrat hat 5 Seiten",
      "Das Quadrat ist rund",
      "Das Quadrat hat 3 Ecken"
    ]
  },
  "f20": {
    "question": "Welche Form hat drei gerade Seiten und drei Ecken?",
    "hints": [
      "Betrachte die Umrisse der Formen.",
      "Zähle die Ecken jeder Form."
    ]
  },
  "f22": {
    "question": "Eine Form hat vier rechte Winkel, zwei lange und zwei kurze Seiten. Wie heisst sie? ___",
    "hints": [
      "Vergleiche die Seitenlängen.",
      "Die gegenüberliegenden Seiten sind gleich lang."
    ]
  },
  "f23": {
    "question": "Wie viele gerade Seiten haben Dreieck und Kreis zusammen?",
    "hints": [
      "Zähle nur gerade Strecken.",
      "Betrachte die Umrisse beider Formen."
    ]
  },
  "f26": {
    "altAnswers": [
      "Viereck"
    ],
    "hints": [
      "Überlege, zu welchen grösseren Formgruppen ein Quadrat gehört.",
      "Betrachte seine Seiten und rechten Winkel."
    ]
  },
  "f29": {
    "spokenPrompt": "Finde jeweils zwei gleiche Formenkarten!",
    "question": "Finde jeweils zwei gleiche Formenkarten!"
  },
  "f36": {
    "altAnswers": [],
    "question": "Wie heisst eine geschlossene Form mit vier geraden Seiten allgemein? ___",
    "hints": [
      "Zähle die Seiten der Form.",
      "Der allgemeine Name beschreibt ihre Eckenzahl."
    ]
  },
  "f37": {
    "question": "Wie heisst ein Körper mit sechs gleichen quadratischen Flächen am genauesten?",
    "options": [
      "Eine Kugel",
      "Ein Kegel",
      "Ein Würfel",
      "Eine Pyramide"
    ]
  },
  "f38": {
    "question": "Welche Form ist überall gleich weit von ihrer Mitte entfernt: Kreis oder Oval? ___",
    "hints": [
      "Denke an die Abstände vom Rand zur Mitte.",
      "Vergleiche die beiden genannten Formen."
    ]
  },
  "f46": {
    "question": "Vier Dreiecke werden zu einem Quadrat gelegt. Wie viele Ecken hat der äussere Rand? ___",
    "hints": [
      "Betrachte nur den äusseren Rand.",
      "Innere Verbindungslinien zählen nicht mit."
    ]
  },
  "f47": {
    "answer": "Kreis und Quadrat",
    "question": "Welche zwei Formen lassen sich in spiegelgleiche Hälften falten?",
    "options": [
      "Kreis und Quadrat",
      "Ungleichseitiges Dreieck und Kreis",
      "Ungleichseitiges Dreieck und Quadrat",
      "Zwei ungleichseitige Dreiecke"
    ],
    "hints": [
      "Denke an eine Faltlinie durch die Mitte.",
      "Beide Hälften müssen genau aufeinanderpassen."
    ]
  },
  "vg3": {
    "options": [
      "<",
      "=",
      ">"
    ],
    "hints": [
      "Vergleiche zuerst beide Zahlen.",
      "Die offene Seite zeigt zur grösseren Zahl. Gleich grosse Zahlen brauchen das Gleichheitszeichen."
    ]
  },
  "vg4": {
    "options": [
      "<",
      "=",
      ">"
    ],
    "hints": [
      "Vergleiche zuerst beide Zahlen.",
      "Die offene Seite zeigt zur grösseren Zahl. Gleich grosse Zahlen brauchen das Gleichheitszeichen."
    ]
  },
  "vg5": {
    "options": [
      "<",
      "=",
      ">"
    ],
    "hints": [
      "Vergleiche zuerst beide Zahlen.",
      "Die offene Seite zeigt zur grösseren Zahl. Gleich grosse Zahlen brauchen das Gleichheitszeichen."
    ]
  },
  "vg8": {
    "options": [
      "<",
      "=",
      ">"
    ],
    "hints": [
      "Vergleiche zuerst beide Zahlen.",
      "Die offene Seite zeigt zur grösseren Zahl. Gleich grosse Zahlen brauchen das Gleichheitszeichen."
    ]
  },
  "vg13": {
    "options": [
      "<",
      "=",
      ">"
    ],
    "hints": [
      "Vergleiche zuerst beide Zahlen.",
      "Die offene Seite zeigt zur grösseren Zahl. Gleich grosse Zahlen brauchen das Gleichheitszeichen."
    ]
  },
  "vg15": {
    "options": [
      "<",
      "=",
      ">"
    ],
    "hints": [
      "Vergleiche zuerst beide Zahlen.",
      "Die offene Seite zeigt zur grösseren Zahl. Gleich grosse Zahlen brauchen das Gleichheitszeichen."
    ]
  },
  "vg18": {
    "options": [
      "5 > 3",
      "3 > 5",
      "4 < 3",
      "6 < 3"
    ],
    "hints": [
      "Prüfe jede Aussage einzeln.",
      "Die offene Seite muss zur grösseren Zahl zeigen."
    ]
  },
  "vg21": {
    "question": "Welche ganze Zahl kommt direkt nach 2? Ergänze: 2 < ___",
    "hints": [
      "Zähle von zwei aus weiter.",
      "Gehe genau einen Schritt vorwärts."
    ]
  },
  "vg22": {
    "options": [
      "<",
      "=",
      ">"
    ],
    "hints": [
      "Vergleiche zuerst beide Zahlen.",
      "Die offene Seite zeigt zur grösseren Zahl. Gleich grosse Zahlen brauchen das Gleichheitszeichen."
    ]
  },
  "vg24": {
    "question": "Welche ganze Zahl kommt direkt vor 10? Ergänze: 10 > ___",
    "hints": [
      "Zähle von zehn aus rückwärts.",
      "Gehe genau einen Schritt zurück."
    ]
  },
  "vg28": {
    "spokenPrompt": "Welche Zeichen fehlen? Fünf, erstes Zeichen, sieben, zweites Zeichen, drei. Schreibe beide Zeichen mit und dazwischen.",
    "question": "Welche Zeichen fehlen: 5 [1] 7 [2] 3? Schreibe beide Zeichen mit «und» dazwischen.",
    "hints": [
      "Vergleiche zuerst fünf und sieben.",
      "Vergleiche danach sieben und drei."
    ]
  },
  "vg29": {
    "options": [
      "2 < 3 < 4",
      "4 < 3 < 2",
      "4 > 2 > 3",
      "1 > 3 > 4"
    ]
  },
  "vg32": {
    "question": "Schreibe die drei kleinsten ganzen Zahlen grösser als null und kleiner als acht, von klein nach gross.",
    "hints": [
      "Beginne unmittelbar nach null.",
      "Schreibe die ersten drei Zahlen beim Zählen."
    ]
  },
  "vg43": {
    "question": "Welche Liste enthält alle ganzen Zahlen von 6 bis 10 genau einmal?",
    "hints": [
      "Prüfe, ob eine Zahl fehlt oder doppelt vorkommt.",
      "Zähle die Zahlen der Reihe nach durch."
    ]
  },
  "vg44": {
    "altAnswers": [
      "4"
    ]
  },
  "vg45": {
    "spokenPrompt": "Ein Kind sagt: Zehn ist grösser als neun, neun ist grösser als acht, acht ist grösser als sieben. Stimmt das?"
  },
  "vg46": {
    "spokenPrompt": "Welches Zeichen gehört zwischen sieben plus drei und elf minus zwei?",
    "hints": [
      "Rechne beide Seiten getrennt aus.",
      "Vergleiche danach die beiden Ergebnisse."
    ]
  },
  "vg47": {
    "answer": "Sie wird grösser",
    "question": "Was passiert, wenn du zu einer Zahl eins dazuzählst?",
    "options": [
      "Sie wird grösser",
      "Sie wird kleiner",
      "Sie bleibt gleich"
    ],
    "hints": [
      "Gehe beim Zählen einen Schritt weiter.",
      "Vergleiche die neue Zahl mit der Startzahl."
    ]
  },
  "vg49": {
    "options": [
      "Es gibt mehr rote als blaue Kugeln",
      "Es gibt gleich viele rote und blaue Kugeln",
      "Es gibt mehr blaue als rote Kugeln",
      "Es gibt keine blauen Kugeln"
    ]
  },
  "m1b": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 2, 4, 6, 8, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 2, 4, 6, 8, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 2 weiter. Prüfe jeden Abstand."
    ]
  },
  "m2b": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 1, 3, 5, 7, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 1, 3, 5, 7, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 2 weiter. Prüfe jeden Abstand."
    ]
  },
  "m3b": {
    "spokenPrompt": "roter Kreis, blauer Kreis, roter Kreis, blauer Kreis, roter Kreis. Welche Form kommt als Nächstes?",
    "question": "Welche Form kommt als Nächstes? 🔴🔵🔴🔵🔴___",
    "options": [
      "🔴",
      "🔵",
      "🟢"
    ],
    "hints": [
      "Suche die Gruppe, die sich wiederholt.",
      "Die Zeichen wechseln sich ab. Vergleiche mit dem Anfang."
    ]
  },
  "m4b": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 1, 2, 3, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 1, 2, 3, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 1 weiter. Prüfe jeden Abstand."
    ]
  },
  "m6": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 9, 8, 7, 6, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 9, 8, 7, 6, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 1 zurück. Prüfe jeden Abstand."
    ]
  },
  "m8": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 20, 18, 16, 14, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 20, 18, 16, 14, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 2 zurück. Prüfe jeden Abstand."
    ]
  },
  "m9": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 5, 10, 15, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 5, 10, 15, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 5 weiter. Prüfe jeden Abstand."
    ]
  },
  "m10": {
    "spokenPrompt": "blauer Kreis, roter Kreis, blauer Kreis, roter Kreis. Welche Form kommt als Nächstes?",
    "question": "Welche Form kommt als Nächstes? 🔵🔴🔵🔴___",
    "options": [
      "🔵",
      "🔴",
      "🟢"
    ],
    "hints": [
      "Suche die Gruppe, die sich wiederholt.",
      "Die Zeichen wechseln sich ab. Vergleiche mit dem Anfang."
    ]
  },
  "m11": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 1, 2, 3, 4, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 1, 2, 3, 4, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 1 weiter. Prüfe jeden Abstand."
    ]
  },
  "m13": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 3, 6, 9, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 3, 6, 9, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 3 weiter. Prüfe jeden Abstand."
    ]
  },
  "m14": {
    "spokenPrompt": "Stern, Stern, Stern, Mond, Stern, Stern, Stern, Mond. Welche Form kommt als Nächstes?",
    "question": "Welche Form kommt als Nächstes? ⭐⭐⭐🌙⭐⭐⭐🌙___",
    "options": [
      "⭐",
      "🌙",
      "🌞"
    ],
    "hints": [
      "Suche die Gruppe, die sich wiederholt.",
      "Vergleiche die Gruppen aus je vier Zeichen. Wo beginnt die nächste Gruppe?"
    ]
  },
  "m17": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 0, 5, 10, 15, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 0, 5, 10, 15, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 5 weiter. Prüfe jeden Abstand."
    ]
  },
  "m18": {
    "spokenPrompt": "Ergänze die Zahlenreihe: fehlende Zahl, 6, 9, 12",
    "question": "Ergänze die Zahlenreihe: ___, 6, 9, 12",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Gehe vom ersten bekannten Wert einen gleich grossen Schritt zurück."
    ]
  },
  "m19": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 4, 8, fehlende Zahl, 16",
    "question": "Ergänze die Zahlenreihe: 4, 8, ___, 16",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 4 weiter. Prüfe jeden Abstand."
    ]
  },
  "m20": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 1, 4, 7, 10, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 1, 4, 7, 10, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 3 weiter. Prüfe jeden Abstand."
    ]
  },
  "m21": {
    "spokenPrompt": "rotes Dreieck, rotes Quadrat, rotes Dreieck, rotes Quadrat, rotes Dreieck. Welche Form kommt als Nächstes?",
    "question": "Welche Form kommt als Nächstes? 🔺🟥🔺🟥🔺___",
    "options": [
      "🔺",
      "🟥",
      "🔵"
    ],
    "hints": [
      "Suche die Gruppe, die sich wiederholt.",
      "Die Zeichen wechseln sich ab. Vergleiche mit dem Anfang."
    ]
  },
  "m22": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 2, 5, 8, 11, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 2, 5, 8, 11, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 3 weiter. Prüfe jeden Abstand."
    ]
  },
  "m25": {
    "spokenPrompt": "Ordne die Zahlen von klein nach gross.",
    "question": "Ordne die Zahlen von klein nach gross.",
    "hints": [
      "Beginne mit der kleinsten Zahl.",
      "Zwischen Nachbarn liegt immer ein Zweierschritt."
    ]
  },
  "m26": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 4, 5, 6, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 4, 5, 6, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 1 weiter. Prüfe jeden Abstand."
    ]
  },
  "m28": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 1, 3, 5, fehlende Zahl, 9",
    "question": "Ergänze die Zahlenreihe: 1, 3, 5, ___, 9",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 2 weiter. Prüfe jeden Abstand."
    ]
  },
  "m30": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 0, 2, 4, 6, 8, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 0, 2, 4, 6, 8, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 2 weiter. Prüfe jeden Abstand."
    ]
  },
  "m31": {
    "hints": [
      "Suche die Zahl, die nicht gerade ist.",
      "Bilde Zweiergruppen. Wo bleibt etwas übrig?"
    ]
  },
  "m32": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 7, 8, 9, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 7, 8, 9, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 1 weiter. Prüfe jeden Abstand."
    ]
  },
  "m33": {
    "spokenPrompt": "Stern, Mond, Stern, Mond, Stern, Mond. Welche Form kommt als Nächstes?",
    "question": "Welche Form kommt als Nächstes? ⭐🌙⭐🌙⭐🌙___",
    "options": [
      "⭐",
      "🌙",
      "🌞"
    ],
    "hints": [
      "Suche die Gruppe, die sich wiederholt.",
      "Die Zeichen wechseln sich ab. Vergleiche mit dem Anfang."
    ]
  },
  "m34": {
    "spokenPrompt": "Ergänze die Reihe in gleich grossen Schritten rückwärts: 15, fehlende Zahl, 5",
    "question": "Ergänze die Reihe in gleich grossen Schritten rückwärts: 15, ___, 5",
    "hints": [
      "Zwischen Anfang und Ende liegen zwei gleich grosse Schritte.",
      "Prüfe, ob beide Abstände gleich gross sind."
    ]
  },
  "m36": {
    "spokenPrompt": "Roter Kreis, grüner Kreis, roter Kreis, grüner Kreis, roter Kreis. Welche Farbe kommt als Nächstes?",
    "question": "Welches Zeichen kommt als Nächstes? 🔴 🟢 🔴 🟢 🔴 ___",
    "answer": "grün",
    "altAnswers": [
      "🟢",
      "grüner Kreis"
    ],
    "hints": [
      "Suche die Gruppe, die sich wiederholt.",
      "Vergleiche mit dem Anfang der Reihe."
    ]
  },
  "m44": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 2, 3, 4, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 2, 3, 4, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 1 weiter. Prüfe jeden Abstand."
    ]
  },
  "m46": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 4, 5, 6, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 4, 5, 6, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 1 weiter. Prüfe jeden Abstand."
    ]
  },
  "m48": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 9, 6, 3, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 9, 6, 3, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 3 zurück. Prüfe jeden Abstand."
    ]
  },
  "m50": {
    "spokenPrompt": "Stern, Stern, Mond, Stern, Stern, Mond, Stern, Stern. Welches Zeichen kommt als Nächstes?",
    "question": "Welches Zeichen kommt als Nächstes? ⭐ ⭐ 🌙 ⭐ ⭐ 🌙 ⭐ ⭐ ___",
    "answer": "Mond",
    "altAnswers": [
      "🌙",
      "ein Mond"
    ],
    "hints": [
      "Suche die Gruppe, die sich wiederholt.",
      "Vergleiche mit dem Anfang der Reihe."
    ]
  },
  "z20b": {
    "hints": [
      "Beginne bei vierzehn und zähle einen Schritt weiter.",
      "Prüfe: Deine Zahl muss genau eins grösser als vierzehn sein."
    ]
  },
  "z20c": {
    "hints": [
      "Sprich die Zahlwörter beim Zählen ab zehn.",
      "Suche die Ziffern, die zum Zahlwort elf gehören."
    ]
  },
  "z20d": {
    "hints": [
      "Zähle von fünfzehn bis siebzehn.",
      "Welche Zahl sagst du dazwischen?"
    ]
  },
  "z20e": {
    "hints": [
      "Starte bei zehn.",
      "Zähle sieben Schritte vorwärts und merke dir die letzte Zahl."
    ]
  },
  "z20f": {
    "hints": [
      "Alle Zahlen haben einen Zehner. Vergleiche ihre Einer.",
      "Welche Zahl würdest du beim Vorwärtszählen zuletzt sagen?"
    ]
  },
  "z20g": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 11, 13, 15, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 11, 13, 15, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 2 weiter. Prüfe jeden Abstand."
    ]
  },
  "z20h": {
    "answer": "13",
    "question": "Welche Zahl kommt nach 12?",
    "options": [
      "13",
      "11",
      "14",
      "15"
    ],
    "hints": [
      "Beginne bei zwölf und zähle weiter.",
      "Gesucht ist die Zahl genau einen Schritt nach zwölf."
    ]
  },
  "z20i": {
    "hints": [
      "Zähle von zehn bis achtzehn und merke dir die Anzahl der Schritte.",
      "Setze deine Zahl ein und prüfe, ob zehn plus deine Zahl achtzehn ergibt."
    ]
  },
  "z20j": {
    "answer": "18",
    "question": "Welche Zahl kommt nach 17?",
    "options": [
      "18",
      "16",
      "19",
      "20"
    ],
    "hints": [
      "Beginne bei siebzehn und zähle weiter.",
      "Gesucht ist die Zahl genau einen Schritt nach siebzehn."
    ]
  },
  "z20k": {
    "hints": [
      "Starte bei zehn.",
      "Zähle fünf Schritte vorwärts."
    ]
  },
  "z20l": {
    "hints": [
      "Beginne bei dreizehn.",
      "Zähle einen Schritt rückwärts."
    ]
  },
  "z20n": {
    "hints": [
      "Zähle in Gruppen: erst zehn Sterne, dann den Rest.",
      "Zähle zur Kontrolle jeden Stern genau einmal."
    ]
  },
  "z20o": {
    "hints": [
      "Sprich die Zahlwörter beim Zählen ab zehn.",
      "Welches geschriebene Zahlwort passt zu 11?"
    ]
  },
  "z20p": {
    "hints": [
      "Beginne bei neunzehn.",
      "Zähle einen Schritt weiter. Danach beginnt ein neuer Zehner."
    ]
  },
  "z20q": {
    "hints": [
      "Beide Zahlen haben einen Zehner.",
      "Vergleiche die Einer: Welche Zahl hat mehr davon?"
    ]
  },
  "z20r": {
    "question": "Wie viele ganze Zehner stecken in 17? ___",
    "hints": [
      "Lege siebzehn Plättchen hin und bilde Zehnergruppen.",
      "Zähle nur die vollständigen Gruppen mit je zehn Plättchen."
    ]
  },
  "z20s": {
    "hints": [
      "Zähle von zehn bis vierzehn und merke dir die Schritte.",
      "Setze die gewählte Zahl ein und rechne zur Kontrolle nach."
    ]
  },
  "z20t": {
    "spokenPrompt": "Ergänze die Zahlenreihe: zwölf, vierzehn, sechzehn. Welche Zahl kommt als Nächstes?",
    "hints": [
      "Vergleiche die Abstände zwischen den Zahlen.",
      "Zähle in gleich grossen Zweierschritten weiter."
    ]
  },
  "z20u": {
    "hints": [
      "Zähle von siebzehn bis neunzehn.",
      "Welche Zahl sagst du dazwischen?"
    ]
  },
  "z20v": {
    "spokenPrompt": "Welche Zahl fehlt am Anfang der Reihe? Fehlende Zahl, dreizehn, vierzehn, fünfzehn.",
    "hints": [
      "Schau auf die erste angegebene Zahl.",
      "Zähle von dreizehn einen Schritt rückwärts."
    ]
  },
  "z20w": {
    "spokenPrompt": "Welche Zahl fehlt in der Reihe? Zwölf, dreizehn, fehlende Zahl, fünfzehn.",
    "question": "Welche Zahl fehlt? 12, 13, ___, 15",
    "answer": "14",
    "options": [
      "14",
      "11",
      "16",
      "17"
    ],
    "hints": [
      "Zähle ab zwölf der Reihe nach weiter.",
      "Prüfe, ob zwischen benachbarten Zahlen immer ein Schritt liegt."
    ]
  },
  "z20x": {
    "spokenPrompt": "Wie viel ist zehn plus sechs plus zwei?",
    "hints": [
      "Rechne zuerst zehn plus sechs.",
      "Zähle zum Zwischenergebnis noch zwei dazu."
    ]
  },
  "z20y": {
    "hints": [
      "Suche zuerst die Zehn auf dem Zahlenstrahl.",
      "Gehe nach rechts und zähle die Striche bis zur gesuchten Zahl."
    ]
  },
  "z20z": {
    "hints": [
      "Alle Zahlen haben einen Zehner. Vergleiche ihre Einer.",
      "Welche Zahl würdest du beim Vorwärtszählen zuerst sagen?"
    ]
  },
  "z20aa": {
    "question": "18 besteht aus einem Zehner und wie vielen einzelnen Einern?",
    "hints": [
      "Bilde mit achtzehn Plättchen zuerst eine volle Zehnergruppe.",
      "Wie viele einzelne Plättchen bleiben ausserhalb der Zehnergruppe?"
    ]
  },
  "z20ab": {
    "spokenPrompt": "Ergänze die Zahlenreihe: 11, 13, 15, 17, fehlende Zahl",
    "question": "Ergänze die Zahlenreihe: 11, 13, 15, 17, ___",
    "hints": [
      "Vergleiche zwei Zahlen direkt nebeneinander.",
      "Zähle immer um 2 weiter. Prüfe jeden Abstand."
    ]
  },
  "z20ac": {
    "hints": [
      "Verteile zwanzig Plättchen auf zwei gleich grosse Gruppen.",
      "Zähle eine Gruppe und prüfe: Beide Gruppen zusammen ergeben zwanzig."
    ]
  },
  "z20ad": {
    "spokenPrompt": "Ergänze die Reihe der geraden Zahlen: zwölf, vierzehn, fehlende Zahl, achtzehn.",
    "question": "Ergänze die Reihe der geraden Zahlen: 12, 14, ___, 18.",
    "hints": [
      "Gerade Zahlen lassen sich ohne Rest in Paare aufteilen.",
      "Gehe von einer geraden Zahl in Zweierschritten zur nächsten."
    ]
  },
  "z20ae": {
    "spokenPrompt": "Welche Zahl fehlt am Anfang der Reihe? Fehlende Zahl, neunzehn, zwanzig.",
    "question": "Welche Zahl fehlt? ___, 19, 20",
    "answer": "18",
    "options": [
      "18",
      "17",
      "16",
      "15"
    ],
    "hints": [
      "Schau auf die Zahl direkt nach der Lücke.",
      "Zähle von neunzehn einen Schritt rückwärts."
    ]
  },
  "z20af": {
    "spokenPrompt": "Welche ganze Zahl ist grösser als zehn, kleiner als zwanzig und möglichst gross?",
    "question": "Welche ganze Zahl ist grösser als 10, kleiner als 20 und möglichst gross?",
    "hints": [
      "Gesucht ist eine Zahl, die beim Zählen vorkommt.",
      "Zähle von zwanzig einen Schritt rückwärts und prüfe die Grenzen."
    ]
  },
  "z20ag": {
    "hints": [
      "Prüfe jede Zahl an den beiden Grenzen.",
      "Liegt eine Zahl ausserhalb des Bereichs von elf bis neunzehn?"
    ]
  },
  "z20ah": {
    "hints": [
      "Beginne bei dreizehn.",
      "Zähle vier Schritte weiter."
    ]
  },
  "z20ai": {
    "spokenPrompt": "Welche Zahl plus sechs ergibt sechzehn?",
    "question": "Welche Zahl fehlt? ___ + 6 = 16",
    "answer": "10",
    "options": [
      "10",
      "11",
      "12",
      "13"
    ],
    "hints": [
      "Überlege, welche Zahl zusammen mit sechs sechzehn ergibt.",
      "Prüfe jede Möglichkeit, indem du sechs dazuzählst."
    ]
  },
  "z20aj": {
    "spokenPrompt": "Was ist das Doppelte von acht?",
    "hints": [
      "Verdoppeln bedeutet: Nimm die gleiche Menge zweimal.",
      "Lege zwei Gruppen mit je acht Plättchen und zähle alle zusammen."
    ]
  },
  "z20ak": {
    "spokenPrompt": "Ein Kind hat fünfzehn Aufkleber und gibt sieben ab. Wie viele Aufkleber bleiben übrig?",
    "hints": [
      "Nimm fünfzehn Plättchen und lege sieben weg.",
      "Zähle, wie viele Plättchen übrig bleiben."
    ]
  },
  "z20al": {
    "answer": "18",
    "question": "Ich bin grösser als 15. Bis 20 fehlen mir noch 2. Welche Zahl bin ich?",
    "options": [
      "18",
      "16",
      "17",
      "19"
    ],
    "hints": [
      "Suche zuerst die Zahl genau zwei Schritte vor zwanzig.",
      "Prüfe dann, ob diese Zahl grösser als fünfzehn ist."
    ]
  },
  "z20am": {
    "spokenPrompt": "Ich denke mir eine Zahl. Ich nehme drei weg und zähle dann zwei dazu. Nun habe ich sechzehn. Welche Zahl habe ich mir gedacht?",
    "answer": "17",
    "question": "Ich denke mir eine Zahl. Ich nehme 3 weg und zähle dann 2 dazu. Nun habe ich 16. Meine Zahl war ___.",
    "hints": [
      "Gehe die Schritte rückwärts: Nimm zuerst die zwei dazugezählten wieder weg.",
      "Mache danach auch das Wegnehmen von drei rückgängig."
    ]
  },
  "z20an": {
    "spokenPrompt": "Wie viele gerade Zahlen gibt es von zehn bis zwanzig? Zähle zehn und zwanzig mit.",
    "question": "Wie viele gerade Zahlen gibt es von 10 bis 20? Zähle 10 und 20 mit.",
    "hints": [
      "Beginne bei zehn und gehe in Zweierschritten bis zwanzig.",
      "Mache für jede erreichte Zahl einen Strich. Zähle auch die Startzahl mit."
    ]
  },
  "z20ao": {
    "spokenPrompt": "Zähle ab zehn vorwärts. Die Zehn ist die erste Zahl. Welche Zahl steht an fünfter Stelle?",
    "question": "Zähle ab 10 vorwärts. Die 10 ist die erste Zahl. Welche Zahl steht an fünfter Stelle?",
    "hints": [
      "Schreibe die Zahlen ab zehn der Reihe nach auf.",
      "Die Zehn steht an erster Stelle. Zähle die Plätze bis zum fünften."
    ]
  },
  "z20ap": {
    "hints": [
      "Zähle von fünfzehn bis zwanzig.",
      "Merke dir die Anzahl der Schritte und prüfe die Rechnung."
    ]
  },
  "z20ar": {
    "hints": [
      "Schaue auf die Einerstelle jeder Zahl.",
      "Vergleiche nur die Einer: Wo ist ihre Anzahl am grössten?"
    ]
  },
  "z20as": {
    "spokenPrompt": "Lena hat zwölf Bonbons und gibt fünf weg. Wie viele Bonbons hat sie noch?",
    "hints": [
      "Lege zwölf Plättchen hin und nimm fünf weg.",
      "Zähle die übrig gebliebenen Plättchen."
    ]
  },
  "z20au": {
    "spokenPrompt": "Wie viel ist dreizehn plus sieben?",
    "question": "13 + 7 = ___",
    "hints": [
      "Beginne bei dreizehn.",
      "Zähle sieben Schritte weiter."
    ]
  },
  "z20av": {
    "question": "Welche Antwort nennt alle geraden Zahlen, die grösser als 15 und kleiner als 19 sind?",
    "hints": [
      "Suche zuerst alle ganzen Zahlen zwischen fünfzehn und neunzehn.",
      "Prüfe bei jeder Zahl, ob beim Paarbilden kein Rest bleibt."
    ]
  },
  "z20aw": {
    "hints": [
      "Gehe von vierzehn zuerst bis zehn zurück.",
      "Überlege, wie viele der sechs Rückwärtsschritte noch übrig sind."
    ]
  },
  "z20ax": {
    "spokenPrompt": "Tim hat neun Äpfel. Eva hat sechs Äpfel. Wie viele Äpfel haben sie zusammen?",
    "hints": [
      "Zähle die Äpfel von Tim und Eva zusammen.",
      "Ergänze zuerst von neun auf zehn und zähle den Rest dazu."
    ]
  },
  "z20ay": {
    "spokenPrompt": "Wie viele ungerade Zahlen gibt es von elf bis zwanzig? Zähle elf mit.",
    "question": "Wie viele ungerade Zahlen gibt es von 11 bis 20? Zähle 11 mit.",
    "hints": [
      "Gehe von elf bis zwanzig und prüfe jede Zahl.",
      "Ungerade Zahlen lassen beim Paarbilden eines übrig. Zähle auch elf mit."
    ]
  },
  "o33": {
    "spokenPrompt": "Wenn Ben der 8. in einer Reihe von 10 ist — wie viele kommen nach ihm?"
  },
  "o35": {
    "question": "Zehn Kinder stehen in einer Reihe. Das letzte geht weg. Welcher Platz wird frei?",
    "options": [
      "Der 1.",
      "Der 5.",
      "Der 10.",
      "Der 9."
    ],
    "hints": [
      "Zähle die Plätze von vorne.",
      "Gesucht ist der hinterste Platz."
    ]
  },
  "m3": {
    "question": "Welche Gruppe hat mehr: 3 Pizzen oder 5 Pizzen?"
  },
  "m7x2": {
    "emoji": "🐱",
    "question": "Wie viele Katzen siehst du?",
    "hints": [
      "Zähle jede Katze genau einmal.",
      "Zeige beim Zählen auf jede Katze."
    ]
  },
  "m8x2": {
    "options": [
      "🌸🌸🌸",
      "🌸🌸🌸🌸",
      "🌸🌸🌸🌸🌸",
      "🌸🌸"
    ],
    "hints": [
      "Zähle jede Blume einer Gruppe.",
      "Vergleiche die Anzahl mit der gesuchten Zahl."
    ]
  },
  "m14x2": {
    "question": "Welche Gruppe hat weniger: 4 Äpfel oder 6 Orangen?"
  },
  "m16x2": {
    "spokenPrompt": "Wie viele Punkte siehst du?",
    "emoji": "●",
    "question": "Wie viele Punkte siehst du?",
    "hints": [
      "Zähle jeden Punkt genau einmal.",
      "Zeige beim Zählen auf jeden Punkt."
    ]
  },
  "m39x2": {
    "question": "Zwei Gruppen haben zusammen 9 Elemente. Die erste hat 4. Wie viele hat die zweite?",
    "hints": [
      "Gehe von der Gesamtzahl aus.",
      "Ziehe die erste Gruppe ab."
    ]
  },
  "m46x2": {
    "question": "In einer Schachtel sind 10 Pralinen. Du isst 3 und verschenkst 2. Wie viele bleiben?"
  },
  "m50x2": {
    "spokenPrompt": "Ben sammelt Kastanien. Am Montag findet er 7, am Dienstag 5. Wie viele Kastanien hat Ben insgesamt?"
  },
  "v30": {
    "hints": [
      "Teile jede Anzahl in zwei gleich grosse Gruppen.",
      "Gesucht ist die Zahl, bei der das ohne halbe Teile nicht gelingt."
    ]
  },
  "v38": {
    "spokenPrompt": "Tim hat 4 Murmeln. Ben hat das Doppelte. Sara hat halb so viele wie Ben. Sara hat fehlende Zahl Murmeln."
  },
  "g1": {
    "question": "Welche Schweizer Umlaufmünze ist am meisten wert?",
    "hints": [
      "Lies den Wert auf jeder Münze.",
      "Vergleiche alle Werte in derselben Einheit."
    ]
  },
  "g4": {
    "spokenPrompt": "Ein Kaugummi kostet zwanzig Rappen. Du bezahlst fünfzig Rappen. Wie viele Rappen bekommst du zurück?"
  },
  "g11": {
    "spokenPrompt": "Wie viele Rappen ergeben zehn Rappen plus zehn Rappen?"
  },
  "g12": {
    "question": "Welche Schweizer Umlaufmünze hat den kleinsten Wert?",
    "hints": [
      "Vergleiche die Werte, nicht die Durchmesser.",
      "Eine Einrappenmünze gehört nicht mehr zu den Umlaufmünzen."
    ]
  },
  "g14": {
    "spokenPrompt": "Welcher Preis ist niedriger: drei Franken oder fünf Franken?"
  },
  "g15": {
    "spokenPrompt": "Ziehe fünfzig Rappen von einem Franken ab. Wie viele Rappen bleiben?"
  },
  "g27": {
    "spokenPrompt": "Ordne die Preise vom niedrigsten zum höchsten."
  },
  "sa10": {
    "spokenPrompt": "Ben hat 8 Murmeln. Er verliert 3, findet aber 2 neue. Wie viele hat er am Ende?"
  },
  "sa27": {
    "spokenPrompt": "Ben hat 4 Schwestern und 2 Brüder. Wie viele Geschwister hat er?"
  },
  "sa1_19": {
    "spokenPrompt": "Ben kauft 2 Pakete mit je 5 Keksen. Wie viele Kekse hat er insgesamt?"
  },
  "sa1_36": {
    "spokenPrompt": "Ben hat 18 Buntstifte. Er verschenkt 9. Wie viele hat er noch? fehlende Zahl"
  },
  "dd11": {
    "question": "Strichliste Hunde: ||||/ |. Wie viele Hunde sind das? ___"
  },
  "dd15": {
    "altAnswers": [
      "beide",
      "gleich",
      "gleich beliebt",
      "keine"
    ],
    "hints": [
      "Vergleiche beide Anzahlen.",
      "Was bedeutet es, wenn beide gleich gross sind?"
    ]
  },
  "dd23": {
    "spokenPrompt": "Jedes Kind gibt genau eine Stimme ab: Sommer 8, Winter 6. Wie viele Kinder haben abgestimmt? fehlende Zahl",
    "question": "Jedes Kind gibt genau eine Stimme ab: Sommer 8, Winter 6. Wie viele Kinder haben abgestimmt? ___",
    "hints": [
      "Jede Stimme gehört zu genau einem Kind.",
      "Zähle die Stimmen beider Gruppen zusammen."
    ]
  },
  "dd25": {
    "altAnswers": [
      "Grün"
    ],
    "hints": [
      "Vergleiche die angegebenen Werte.",
      "Schreibe den Namen der passenden Gruppe."
    ]
  },
  "dd27": {
    "altAnswers": [
      "Kunst"
    ],
    "hints": [
      "Vergleiche die angegebenen Werte.",
      "Schreibe den Namen der passenden Gruppe."
    ]
  },
  "dd29": {
    "altAnswers": [
      "Freitag"
    ],
    "hints": [
      "Vergleiche die angegebenen Werte.",
      "Schreibe den Namen der passenden Gruppe."
    ]
  },
  "dd37": {
    "altAnswers": [
      "Sonne"
    ],
    "hints": [
      "Vergleiche die angegebenen Werte.",
      "Schreibe den Namen der passenden Gruppe."
    ]
  },
  "dd1_18": {
    "spokenPrompt": "Sommer erhält fünf Stimmen, Winter drei Stimmen. Welche Jahreszeit hat mehr Stimmen?"
  },
  "dd1_38": {
    "question": "Sieben Kinder spielen nur Fussball, drei nur Basketball. Wie viele Kinder sind das zusammen? ___"
  },
  "dd1_40": {
    "spokenPrompt": "Jedes Kind wählt genau ein Lieblingstier: Hunde 8, Katzen 5. Wie viele Kinder haben abgestimmt? fehlende Zahl",
    "question": "Jedes Kind wählt genau ein Lieblingstier: Hunde 8, Katzen 5. Wie viele Kinder haben abgestimmt? ___",
    "hints": [
      "Jede Stimme gehört zu genau einem Kind.",
      "Zähle die Stimmen beider Gruppen zusammen."
    ]
  }
};
export function applyGermanExerciseQaCorrections(exercise: Exercise): Exercise {
 const correction = corrections[exercise.id];
 return correction ? {...exercise,...correction} : exercise;
}
