import type { Exercise } from "@/types/exercise";
// Reviewed Grade 1 Maths corrections, German branch only.
const corrections: Record<string, Partial<Exercise>> = {
  "m5": {
    "interchangeableDragItems": true,
    "hints": [
      "Lege abwechselnd eine Erdbeere auf jeden Teller.",
      "Prüfe am Schluss: Liegen auf beiden Tellern gleich viele Erdbeeren?"
    ]
  },
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
    "optionImages": [],
    "hints": [
      "Zeichne die genannten Formen und zähle ihre Seiten.",
      "Prüfe: Sind alle Seiten gleich lang und die Ecken wie bei einem Blatt Papier?"
    ]
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
    ],
    "question": "Finde eine ganze Zahl, die kleiner als 5 und grösser als 2 ist: ___",
    "spokenPrompt": "Finde eine ganze Zahl, die kleiner als fünf und grösser als zwei ist.",
    "hints": [
      "Suche auf dem Zahlenstrahl zwischen zwei und fünf.",
      "Wähle eine Zahl dazwischen. Zwei und fünf selbst darfst du nicht nehmen."
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
    "spokenPrompt": "Ben steht an achter Stelle in einer Reihe von zehn Kindern. Wie viele Kinder stehen hinter ihm?",
    "hints": [
      "Zeichne zehn Plätze und markiere den achten als Bens Platz.",
      "Zähle nur die Plätze nach Ben. Sein eigener Platz zählt nicht mit."
    ],
    "question": "Ben steht an 8. Stelle in einer Reihe von 10 Kindern. Wie viele Kinder stehen hinter ihm?"
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
    "question": "In einer Schachtel sind 10 Pralinen. Du isst 3 und verschenkst 2. Wie viele bleiben?",
    "hints": [
      "Zeichne zehn Kreise für die Pralinen.",
      "Streiche erst die drei gegessenen und dann zwei weitere verschenkte Pralinen durch. Zähle die übrigen."
    ]
  },
  "m50x2": {
    "spokenPrompt": "Ben hat siebzehn Kastanien. Er verschenkt acht und findet danach drei neue. Wie viele hat er nun?",
    "hints": [
      "Zeichne siebzehn Kreise für Bens Kastanien.",
      "Streiche acht durch und zeichne drei neue dazu. Zähle die Kastanien, die Ben am Schluss hat."
    ],
    "question": "Ben hat 17 Kastanien. Er verschenkt 8 und findet danach 3 neue. Wie viele hat er nun?"
  },
  "v30": {
    "hints": [
      "Teile jede Anzahl in zwei gleich grosse Gruppen.",
      "Gesucht ist die Zahl, bei der das ohne halbe Teile nicht gelingt."
    ]
  },
  "v38": {
    "spokenPrompt": "Tim hat vier Murmeln. Ben hat das Doppelte. Sara hat halb so viele wie Ben. Wie viele Murmeln hat Sara?",
    "hints": [
      "Zeichne Tims vier Murmeln. Ben hat zwei solche Gruppen.",
      "Teile Bens ganze Menge in zwei gleich grosse Gruppen. Eine davon zeigt Saras Murmeln."
    ],
    "question": "Tim hat 4 Murmeln. Ben hat das Doppelte. Sara hat halb so viele wie Ben. Wie viele Murmeln hat Sara?"
  },
  "g1": {
    "question": "Welche Schweizer Umlaufmünze ist am meisten wert?",
    "hints": [
      "Lies den Wert auf jeder Münze.",
      "Vergleiche alle Werte in derselben Einheit."
    ]
  },
  "g4": {
    "spokenPrompt": "Ein Kaugummi kostet zwanzig Rappen. Du bezahlst fünfzig Rappen. Wie viele Rappen bekommst du zurück?",
    "hints": [
      "Zeichne fünf Kreise. Jeder Kreis steht für zehn Rappen.",
      "Streiche für den Preis zwei Kreise durch. Zähle den Wert der übrigen Kreise in Zehnerschritten."
    ]
  },
  "g11": {
    "spokenPrompt": "Wie viele Rappen ergeben zehn Rappen plus zehn Rappen?",
    "hints": [
      "Zeichne zwei Münzen und schreibe auf jede zehn Rappen.",
      "Zähle ihren Wert in Zehnerschritten zusammen."
    ]
  },
  "g12": {
    "question": "Welche Schweizer Umlaufmünze hat den kleinsten Wert?",
    "hints": [
      "Vergleiche die Werte, nicht die Durchmesser.",
      "Eine Einrappenmünze gehört nicht mehr zu den Umlaufmünzen."
    ]
  },
  "g14": {
    "spokenPrompt": "Welcher Preis ist niedriger: drei Franken oder fünf Franken?",
    "hints": [
      "Günstiger bedeutet: Du musst weniger bezahlen.",
      "Zeichne für jeden Preis eine Reihe aus Einfrankenmünzen. Welche Reihe braucht weniger Münzen?"
    ]
  },
  "g15": {
    "spokenPrompt": "Ziehe fünfzig Rappen von einem Franken ab. Wie viele Rappen bleiben?",
    "hints": [
      "Wechsle den Franken gedanklich in zehn Zehnrappenmünzen.",
      "Nimm Münzen im Wert von fünfzig Rappen weg. Zähle den Wert der übrigen Münzen."
    ]
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
    "question": "Strichliste Hunde: ||||/ |. Wie viele Hunde sind das? ___",
    "hints": [
      "Vier senkrechte Striche und ein schräger Strich bilden zusammen eine Fünfergruppe.",
      "Zähle von der Fünfergruppe aus die einzelnen Striche dazu."
    ],
    "spokenPrompt": "Die Strichliste Hunde zeigt eine Fünfergruppe und einen einzelnen Strich. Wie viele Hunde sind das?"
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
      "Vergleiche die Reihen der Striche.",
      "Welche Reihe ist am längsten? Schreibe den Namen dieser Farbe."
    ],
    "question": "Strichliste Farben: Rot ||||, Blau |||, Grün |||||. Welche Farbe kommt am häufigsten vor? ___",
    "spokenPrompt": "Rot erhält vier Stimmen, Blau drei und Grün fünf. Welche Farbe kommt am häufigsten vor?"
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
    "spokenPrompt": "Sommer erhält fünf Stimmen, Winter drei Stimmen. Welche Jahreszeit hat mehr Stimmen?",
    "question": "Umfrage: 5 mögen Sommer, 3 mögen Winter. Welche Jahreszeit hat mehr Stimmen? ___",
    "hints": [
      "Zeichne für jede Jahreszeit eine Reihe mit ihren Stimmen.",
      "Vergleiche die beiden Reihen. Schreibe den Namen der Jahreszeit mit der längeren Reihe."
    ]
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
  },
  "z11": {
    "hints": [
      "Beginne bei null auf dem Zahlenstrahl.",
      "Gehe Schritt für Schritt nach rechts und zähle bis zur gesuchten Zahl."
    ]
  },
  "z16": {
    "hints": [
      "Suche zuerst die null auf dem Zahlenstrahl.",
      "Zähle von dort nach rechts bis zur gesuchten Zahl."
    ]
  },
  "z20": {
    "hints": [
      "Zähle von sechs aus vorwärts.",
      "Gesucht ist die Zahl, die du vor acht sagst."
    ]
  },
  "z32": {
    "spokenPrompt": "Welche Zahl liegt zwischen eins und drei?",
    "hints": [
      "Zähle von eins bis drei.",
      "Welche Zahl sagst du dazwischen?"
    ]
  },
  "m20x2": {
    "hints": [
      "Vergleiche jede Zahlenkarte mit der Zahl in der Frage.",
      "Lege nur die gleiche Zahl zu «Passt». Die anderen Karten gehören zu «Passt nicht»."
    ]
  },
  "f3": {
    "hints": [
      "Zeichne ein Dreieck auf ein Blatt.",
      "Markiere jede Ecke und zähle sie genau einmal."
    ]
  },
  "f4": {
    "hints": [
      "Zeichne ein Quadrat und markiere eine Seite als Start.",
      "Fahre am Rand entlang und zähle jede Seite bis zum Start."
    ]
  },
  "f8": {
    "spokenPrompt": "Wie viele Seiten hat ein Dreieck?",
    "hints": [
      "Zeichne ein Dreieck.",
      "Fahre von Ecke zu Ecke und zähle dabei die geraden Strecken."
    ]
  },
  "f10": {
    "spokenPrompt": "Wie viele Seiten hat ein Rechteck?",
    "hints": [
      "Denke an den Rand eines Blattes Papier.",
      "Fahre einmal aussen herum und zähle jede gerade Seite."
    ]
  },
  "f12": {
    "spokenPrompt": "Wie viele Ecken hat ein Kreis?",
    "hints": [
      "Zeichne einen Kreis und fahre seinen Rand nach.",
      "Suche eine Stelle, an der zwei gerade Seiten zusammentreffen."
    ]
  },
  "f14": {
    "spokenPrompt": "Wie viele gleich lange Seiten hat ein Quadrat?",
    "hints": [
      "Zeichne ein Quadrat.",
      "Vergleiche seine Seitenlängen und zähle die gleich langen Seiten."
    ]
  },
  "f15": {
    "hints": [
      "Denke an die Form eines Blattes Papier.",
      "Zähle die Stellen am Rand, an denen zwei Seiten zusammentreffen."
    ]
  },
  "f19": {
    "spokenPrompt": "Wie viele Ecken haben ein Dreieck und ein Quadrat zusammen?",
    "hints": [
      "Zeichne beide Formen nebeneinander, ohne dass sie sich berühren.",
      "Zähle zuerst die Ecken der einen Form und dann bei der anderen weiter."
    ]
  },
  "f24": {
    "spokenPrompt": "Wie viele Ecken hat ein Viereck?",
    "hints": [
      "Zeichne ein Viereck, zum Beispiel ein Rechteck.",
      "Markiere die Ecken und zähle jede genau einmal."
    ]
  },
  "f28": {
    "question": "Von vorne gesehen hat ein Hausdach zwei schräge Seiten, die oben zusammentreffen, und unten eine gerade Seite. Welche Form ist das? ___",
    "spokenPrompt": "Von vorne gesehen hat ein Hausdach zwei schräge Seiten, die oben zusammentreffen, und unten eine gerade Seite. Welche Form ist das?",
    "hints": [
      "Zeichne den beschriebenen Umriss des Dachs.",
      "Zähle seine Seiten und Ecken. Wie heisst diese Form?"
    ]
  },
  "f30": {
    "question": "Wie nennt man geschlossene, flache Figuren, deren Rand nur aus geraden Seiten besteht?",
    "hints": [
      "Denke an Dreieck, Quadrat und Rechteck.",
      "Gesucht ist ein gemeinsamer Name für Formen mit Ecken."
    ]
  },
  "f31": {
    "spokenPrompt": "Wie viele Winkel hat ein Dreieck?",
    "hints": [
      "Zeichne ein Dreieck und markiere seine Ecken.",
      "An jeder Ecke liegt innen ein Winkel. Zähle die markierten Stellen."
    ]
  },
  "f33": {
    "hints": [
      "Zeichne ein einzelnes Schachbrettfeld.",
      "Prüfe seine Seitenlängen und Ecken. Schreibe den Formnamen in der Mehrzahl."
    ]
  },
  "f34": {
    "hints": [
      "Zeichne eine geschlossene Form mit fünf Ecken.",
      "Zähle die geraden Strecken zwischen den Ecken."
    ]
  },
  "f35": {
    "spokenPrompt": "Wie viele Ecken haben ein Dreieck und ein Viereck zusammen?",
    "hints": [
      "Zeichne beide Formen mit etwas Abstand nebeneinander.",
      "Zähle ihre Ecken zusammen. Beginne bei der zweiten Form nicht wieder bei eins."
    ]
  },
  "f39": {
    "question": "Zwei Formen liegen nebeneinander und berühren sich nicht. Zusammen haben sie sieben Ecken. Welche Formen können es sein?",
    "spokenPrompt": "Zwei Formen liegen nebeneinander und berühren sich nicht. Zusammen haben sie sieben Ecken. Welche Formen können es sein?",
    "answer": "Dreieck und Quadrat",
    "options": [
      "Dreieck und Quadrat",
      "Kreis und Quadrat",
      "Zwei Dreiecke",
      "Zwei Quadrate"
    ],
    "hints": [
      "Zeichne zu jeder Antwort die beiden Formen.",
      "Zähle ihre Ecken zusammen und vergleiche mit sieben."
    ]
  },
  "f40": {
    "question": "Zwei Quadrate liegen nebeneinander, ohne sich zu berühren. Wie viele Seiten haben sie zusammen? ___",
    "spokenPrompt": "Zwei Quadrate liegen nebeneinander, ohne sich zu berühren. Wie viele Seiten haben sie zusammen?",
    "answer": "8",
    "hints": [
      "Zeichne die beiden Quadrate mit etwas Abstand.",
      "Zähle die Seiten des ersten Quadrats und beim zweiten weiter."
    ]
  },
  "f41": {
    "question": "Du sortierst alle Formen mit geraden Seiten weg: Dreieck, Quadrat, Kreis und Rechteck. Welche Form bleibt übrig?",
    "hints": [
      "Prüfe bei jeder Form, ob ihr Rand gerade Seiten hat.",
      "Gesucht ist die Form, die du nicht wegsortierst."
    ]
  },
  "f42": {
    "question": "Eine Form hat eine Ecke mehr als ein Quadrat. Wie heisst die Form nach ihrer Eckenzahl? ___",
    "spokenPrompt": "Eine Form hat eine Ecke mehr als ein Quadrat. Wie heisst die Form nach ihrer Eckenzahl?",
    "hints": [
      "Zähle zuerst die Ecken eines Quadrats.",
      "Zähle eine Ecke dazu. Bilde aus dieser Zahl den Formnamen."
    ]
  },
  "f43": {
    "question": "Du drehst eine Karte mit vier gleich langen Seiten und vier rechten Winkeln, bis eine Ecke nach oben zeigt. Welche Form hat die Karte jetzt?",
    "spokenPrompt": "Du drehst eine Karte mit vier gleich langen Seiten und vier rechten Winkeln, bis eine Ecke nach oben zeigt. Welche Form hat die Karte jetzt?",
    "hints": [
      "Zeichne die beschriebene Karte und drehe das Blatt.",
      "Prüfe, ob sich die Seitenlängen oder die Ecken durch das Drehen verändern."
    ]
  },
  "f44": {
    "question": "Zwei Dreiecke liegen nebeneinander, ohne sich zu berühren. Wie viele gerade Seiten haben sie zusammen? ___",
    "spokenPrompt": "Zwei Dreiecke liegen nebeneinander, ohne sich zu berühren. Wie viele gerade Seiten haben sie zusammen?",
    "hints": [
      "Zeichne die beiden Dreiecke mit etwas Abstand.",
      "Zähle die Seiten beider Formen zusammen."
    ]
  },
  "f48": {
    "question": "Ein Quadrat, ein Dreieck und ein Kreis liegen nebeneinander. Wie viele Ecken haben alle drei Formen zusammen? ___",
    "spokenPrompt": "Ein Quadrat, ein Dreieck und ein Kreis liegen nebeneinander. Wie viele Ecken haben alle drei Formen zusammen?",
    "answer": "7",
    "hints": [
      "Zeichne die drei Formen, ohne dass sie sich berühren.",
      "Zähle nur Ecken. Fahre bei der nächsten Form mit dem Zählen weiter."
    ]
  },
  "f50": {
    "question": "Zwei Formen haben zusammen sieben Ecken. Eine davon ist ein Quadrat. Die andere ist ein Kreis, ein Dreieck oder ein Rechteck. Welche ist es? ___",
    "spokenPrompt": "Zwei Formen haben zusammen sieben Ecken. Eine davon ist ein Quadrat. Die andere ist ein Kreis, ein Dreieck oder ein Rechteck. Welche ist es?",
    "hints": [
      "Zähle die Ecken des Quadrats und nimm sie von den sieben Ecken weg.",
      "Welche der genannten Formen hat die übrigen Ecken?"
    ]
  },
  "vg1": {
    "hints": [
      "Lege eine Reihe mit sieben und eine mit drei Plättchen.",
      "Lege die Plättchen paarweise untereinander. Welche Reihe hat noch Plättchen übrig?"
    ]
  },
  "vg2": {
    "hints": [
      "Lege eine Reihe mit neun und eine mit vier Plättchen.",
      "Ordne sie paarweise untereinander. Welche Reihe ist früher zu Ende?"
    ]
  },
  "vg7": {
    "hints": [
      "Schreibe die drei Zahlen auf einzelne Zettel.",
      "Vergleiche je zwei Zahlen. Die kleinste kommt an den Anfang."
    ]
  },
  "vg9": {
    "hints": [
      "Baue einen Turm aus fünf und einen aus zwei gleich grossen Würfeln.",
      "Stelle beide auf dieselbe Unterlage. Welcher Turm ist höher?"
    ]
  },
  "vg10": {
    "spokenPrompt": "Ist acht grösser oder kleiner als drei?",
    "hints": [
      "Lege acht Plättchen in eine Reihe und drei in eine zweite.",
      "Vergleiche die Reihen. Mehr Plättchen bedeutet grösser, weniger bedeutet kleiner."
    ]
  },
  "vg11": {
    "hints": [
      "Lege ein Plättchen und daneben eine Reihe mit zehn Plättchen.",
      "Gesucht ist die Zahl, die zur kleineren Menge gehört."
    ]
  },
  "vg12": {
    "spokenPrompt": "Ist sieben grösser oder kleiner als neun?",
    "hints": [
      "Schreibe die Zahlen von eins bis zehn der Reihe nach auf.",
      "Suche sieben und neun. Die Zahl weiter links ist kleiner, die weiter rechts ist grösser."
    ]
  },
  "vg14": {
    "spokenPrompt": "Welche Zahl muss rechts vom Gleichheitszeichen stehen, damit beide Seiten gleich sind? Links steht drei.",
    "hints": [
      "Das Gleichheitszeichen bedeutet: Auf beiden Seiten ist gleich viel.",
      "Lege links drei Plättchen. Lege rechts zu jedem davon ein Plättchen und zähle rechts."
    ]
  },
  "vg16": {
    "spokenPrompt": "Welche Zahl ist die grösste: sechs, zwei, neun oder vier?",
    "hints": [
      "Vergleiche zuerst sechs und zwei. Behalte die grössere Zahl.",
      "Vergleiche sie mit neun und dann mit vier. Behalte jedes Mal die grössere Zahl."
    ]
  },
  "vg17": {
    "hints": [
      "Lege sechs Plättchen in eine Reihe und acht in eine zweite.",
      "Ordne sie paarweise untereinander. Welche Reihe hat Plättchen übrig?"
    ]
  },
  "vg19": {
    "spokenPrompt": "Welches Vergleichszeichen gehört zwischen acht und sechs?",
    "hints": [
      "Vergleiche acht und sechs auf dem Zahlenstrahl.",
      "Die offene Seite des Zeichens zeigt zur grösseren Zahl, die Spitze zur kleineren."
    ]
  },
  "vg20": {
    "hints": [
      "Schreibe jede Zahl auf einen Zettel. Lege die kleinste zuerst hin.",
      "Lege danach jeweils die kleinste der übrigen Zahlen hin. Lies den zweiten Zettel ab."
    ]
  },
  "vg25": {
    "hints": [
      "Markiere fünf und neun auf einem selbst gezeichneten Zahlenstrahl.",
      "Suche die angebotenen Zahlen darauf. Welche liegt ausserhalb des Abschnitts zwischen den Markierungen?"
    ]
  },
  "vg26": {
    "spokenPrompt": "Ordne vier, sieben und eins von gross nach klein. Welche Zahl steht zuerst?",
    "hints": [
      "Schreibe vier, sieben und eins auf einzelne Zettel.",
      "Vergleiche die Zahlen. Bei gross nach klein kommt die grösste zuerst."
    ]
  },
  "vg27": {
    "hints": [
      "Gleiche Zahlen sind gleich gross, auch wenn sie mehrmals vorkommen.",
      "Vergleiche die beiden verschiedenen Zahlen auf dem Zahlenstrahl. Welche liegt weiter rechts?"
    ]
  },
  "vg30": {
    "spokenPrompt": "Welche Zahl ist die kleinste: sieben, fünf, neun oder zwei?",
    "hints": [
      "Vergleiche sieben und fünf. Behalte die kleinere Zahl.",
      "Vergleiche sie mit neun und dann mit zwei. Behalte jedes Mal die kleinere Zahl."
    ]
  },
  "vg31": {
    "question": "Schau dir die ganzen Zahlen von 1 bis 10 an. Wie viele davon sind kleiner als 5?",
    "spokenPrompt": "Schau dir die ganzen Zahlen von eins bis zehn an. Wie viele davon sind kleiner als fünf?",
    "hints": [
      "Schreibe die Zahlen von eins bis zehn der Reihe nach auf.",
      "Markiere die Zahlen vor fünf. Zähle nur die markierten Zahlen."
    ]
  },
  "vg34": {
    "spokenPrompt": "Ist das Ergebnis von sechs plus zwei grösser oder kleiner als zehn?",
    "hints": [
      "Beginne bei sechs und zähle zwei weiter.",
      "Vergleiche dein Ergebnis mit zehn auf dem Zahlenstrahl."
    ]
  },
  "vg36": {
    "hints": [
      "Zähle von sieben aus weiter und halte vor neun an.",
      "Prüfe deine Zahl: Sie muss nach sieben und vor neun stehen."
    ]
  },
  "vg38": {
    "question": "Wie viele ganze Zahlen liegen zwischen 2 und 8? Zähle 2 und 8 nicht mit. ___",
    "spokenPrompt": "Wie viele ganze Zahlen liegen zwischen zwei und acht? Zähle zwei und acht nicht mit.",
    "hints": [
      "Schreibe die Zahlen von zwei bis acht der Reihe nach auf.",
      "Streiche die beiden Randzahlen. Zähle die Zahlen, die übrig bleiben."
    ]
  },
  "vg39": {
    "question": "Mia hat mehr Murmeln als Ben. Ben hat mehr Murmeln als Lea. Wer hat die meisten Murmeln?",
    "answer": "Mia",
    "options": [
      "Mia",
      "Ben",
      "Lea",
      "Alle gleich viele"
    ],
    "spokenPrompt": "Mia hat mehr Murmeln als Ben. Ben hat mehr Murmeln als Lea. Wer hat die meisten Murmeln?",
    "hints": [
      "Schreibe die drei Namen auf Zettel. Ordne sie von wenigen zu vielen Murmeln.",
      "Vergleiche zuerst Ben mit Lea. Ordne dann Mia im Vergleich zu Ben ein."
    ]
  },
  "vg40": {
    "question": "Schreibe alle ganzen Zahlen auf, die grösser als 1 und kleiner als 5 sind. Beginne mit der kleinsten. ___",
    "spokenPrompt": "Schreibe alle ganzen Zahlen auf, die grösser als eins und kleiner als fünf sind. Beginne mit der kleinsten.",
    "hints": [
      "Zähle nach eins weiter und halte vor fünf an.",
      "Schreibe jede Zahl, die du dabei nennst, genau einmal auf."
    ]
  },
  "vg42": {
    "spokenPrompt": "Ist das Ergebnis von drei plus fünf grösser oder kleiner als neun?",
    "hints": [
      "Beginne bei fünf und zähle drei weiter.",
      "Vergleiche dein Ergebnis mit neun. Liegt es auf dem Zahlenstrahl links oder rechts davon?"
    ]
  },
  "vg48": {
    "question": "Schreibe alle ganzen Zahlen auf, die grösser als 0 und kleiner als 5 sind. Beginne mit der kleinsten. ___",
    "spokenPrompt": "Schreibe alle ganzen Zahlen auf, die grösser als null und kleiner als fünf sind. Beginne mit der kleinsten.",
    "hints": [
      "Zähle nach null weiter und halte vor fünf an.",
      "Schreibe die Zahlen der Reihe nach auf. Lasse keine aus und schreibe keine doppelt."
    ]
  },
  "vg50": {
    "spokenPrompt": "Ordne acht, drei, sechs und eins von klein nach gross und schreibe die Zahlen auf.",
    "hints": [
      "Schreibe die vier Zahlen auf einzelne Zettel. Suche die kleinste.",
      "Lege sie zuerst hin. Wähle dann immer die kleinste der noch übrigen Zahlen."
    ]
  },
  "o5": {
    "spokenPrompt": "Januar ist der erste Monat. An welcher Stelle im Jahr steht der Februar? Schreibe die Ordnungszahl.",
    "hints": [
      "Die Monate stehen im Kalender der Reihe nach.",
      "Beginne bei Januar mit eins und gehe bis Februar weiter. Schreibe die Zahl mit einem Punkt."
    ]
  },
  "o15": {
    "spokenPrompt": "Januar ist der erste Monat. An welcher Stelle im Jahr steht der März? Schreibe die Ordnungszahl.",
    "hints": [
      "Nenne die Monate vom Jahresanfang bis März der Reihe nach.",
      "Zähle für jeden genannten Monat einen Finger. Schreibe die Anzahl mit einem Punkt."
    ]
  },
  "o20": {
    "spokenPrompt": "Wie heisst der zwölfte Monat des Jahres?",
    "hints": [
      "Schau dir in einem Jahreskalender die Reihenfolge der Monate an.",
      "Zähle bei Januar los, bis du den gesuchten Platz erreichst. Lies dort den Monatsnamen."
    ]
  },
  "o22": {
    "spokenPrompt": "Welcher Buchstabe steht im Alphabet an zehnter Stelle?",
    "hints": [
      "Sprich das Alphabet langsam von A an.",
      "Zähle für jeden Buchstaben einen Finger weiter. Halte beim zehnten an."
    ]
  },
  "o28": {
    "spokenPrompt": "Welcher Platz kommt direkt vor dem fünften Platz? Schreibe die Ordnungszahl.",
    "hints": [
      "Zeichne fünf Plätze in einer Reihe und nummeriere sie von vorne.",
      "Gehe vom fünften Platz genau einen Platz zurück. Schreibe dessen Zahl mit einem Punkt."
    ]
  },
  "o39": {
    "spokenPrompt": "Welcher Wochentag ist der dritte Tag nach Mittwoch?",
    "hints": [
      "Suche Mittwoch in einem Kalender.",
      "Gehe drei Tage vorwärts. Der erste Schritt führt zum nächsten Tag; Mittwoch zählt nicht mit."
    ]
  },
  "o42": {
    "spokenPrompt": "Der vierte Monat heisst April. Wie heisst der zehnte Monat?",
    "hints": [
      "Suche April in einem Jahreskalender. Er steht an vierter Stelle.",
      "Zähle die folgenden Monate weiter, bis du bei zehn ankommst. Lies dort den Namen."
    ]
  },
  "o44": {
    "spokenPrompt": "In einem Wettbewerb gibt es fünf Runden. Nach der dritten Runde: Wie viele Runden bleiben noch?",
    "hints": [
      "Zeichne für jede Runde ein Kästchen.",
      "Streiche die bereits fertigen Runden bis zur dritten durch. Zähle die übrigen Kästchen."
    ]
  },
  "o45": {
    "question": "Die Woche beginnt am Montag. Wie heisst der 3. Tag der Woche?",
    "spokenPrompt": "Die Woche beginnt am Montag. Wie heisst der dritte Tag der Woche?",
    "hints": [
      "Nenne die Wochentage der Reihe nach und beginne mit Montag.",
      "Zähle jeden genannten Tag mit einem Finger. Halte beim dritten an."
    ]
  },
  "o48": {
    "spokenPrompt": "Der zwölfte Monat ist Dezember. Wie heisst der sechste Monat?",
    "hints": [
      "Schau dir die Monatsnamen in einem Jahreskalender an.",
      "Beginne bei Januar mit eins. Zähle bis zum sechsten Monatsnamen."
    ]
  },
  "o50": {
    "spokenPrompt": "A ist der erste, J der zehnte und T der zwanzigste Buchstabe im Alphabet. Welcher Buchstabe steht an fünfzehnter Stelle?",
    "hints": [
      "Du kannst beim bekannten zehnten Buchstaben J beginnen.",
      "Zähle die nächsten Buchstaben und ihre Plätze weiter, bis du den fünfzehnten Platz erreichst."
    ]
  },
  "o47": {
    "question": "Mia steht an 5. Stelle in einer Reihe. Sie rückt drei Plätze nach vorne. Alle anderen lassen sie vorbei. An welcher Stelle steht sie jetzt?",
    "spokenPrompt": "Mia steht an fünfter Stelle in einer Reihe. Sie rückt drei Plätze nach vorne. Alle anderen lassen sie vorbei. An welcher Stelle steht sie jetzt?",
    "hints": [
      "Zeichne fünf Plätze und markiere Mias Startplatz.",
      "Gehe mit der Markierung drei Plätze zum Anfang der Reihe. Zähle dabei die Schritte, nicht den Startplatz."
    ]
  },
  "o49": {
    "question": "Mia steht an 7. Stelle in einer Reihe. Sie rückt zuerst zwei Plätze nach vorne und dann noch einmal zwei. An welcher Stelle steht sie danach?",
    "spokenPrompt": "Mia steht an siebter Stelle in einer Reihe. Sie rückt zuerst zwei Plätze nach vorne und dann noch einmal zwei. An welcher Stelle steht sie danach?",
    "hints": [
      "Zeichne sieben Plätze und markiere den siebten als Startplatz.",
      "Gehe zuerst zwei Plätze zum Anfang der Reihe. Gehe von dort noch einmal zwei Plätze nach vorne."
    ]
  },
  "o2": {
    "hints": [
      "Stelle dir nummerierte Plätze in einer Reihe vor.",
      "Beginne beim zweiten Platz und gehe genau einen Platz weiter."
    ]
  },
  "o3": {
    "hints": [
      "Sprich die Buchstaben des Alphabets von A an.",
      "Zähle bei jedem Buchstaben einen Finger dazu. Halte beim dritten Finger an."
    ]
  },
  "o6": {
    "hints": [
      "Zeichne fünf Kinder hintereinander und markiere den Anfang der Reihe.",
      "Zähle von vorne bis zu Mia. Schau, welcher Platz direkt hinter ihrem liegt."
    ]
  },
  "o7": {
    "question": "Die Woche beginnt am Montag. An welcher Stelle steht der Mittwoch? Schreibe die Ordnungszahl.",
    "spokenPrompt": "Die Woche beginnt am Montag. An welcher Stelle steht der Mittwoch? Schreibe die Ordnungszahl.",
    "hints": [
      "Suche Montag und Mittwoch in einem Wochenkalender.",
      "Zähle die Tage ab Montag bis Mittwoch. Schreibe die Zahl mit einem Punkt."
    ]
  },
  "o9": {
    "spokenPrompt": "Welche Ordnungszahl fehlt zwischen der zweiten und der vierten? Schreibe die Zahl mit einem Punkt.",
    "hints": [
      "Lies die Plätze der Reihe nach: erster, zweiter und weiter.",
      "Gehe vom zweiten Platz einen Platz weiter. Prüfe, ob danach der vierte kommt."
    ]
  },
  "o11": {
    "spokenPrompt": "Mia erreicht im Rennen Platz fünf. Schreibe das passende Wort: Mia ist die wievielte?",
    "hints": [
      "Gesucht ist ein Wort für Mias Platz, keine Ziffer.",
      "Denke an das Zahlwort fünf. Wie nennst du ein Mädchen auf diesem Platz?"
    ]
  },
  "o12": {
    "hints": [
      "Auf dem Siegerpodest stehen die besten Teilnehmenden eines Rennens.",
      "Die höchste Stufe gehört dem Kind, das gewonnen hat. Welchen Platz hat es erreicht?"
    ]
  },
  "o13": {
    "hints": [
      "Stelle dir die Plätze eines Rennens der Reihe nach vor.",
      "Zähle von sechs genau einen Schritt weiter. Schreibe die Zahl mit einem Punkt."
    ]
  },
  "o16": {
    "hints": [
      "Beginne links beim A und zeige auf jeden Buchstaben der Reihe.",
      "Zähle bei jedem Buchstaben einen Platz weiter. Halte an der fünften Stelle an."
    ]
  },
  "o17": {
    "spokenPrompt": "Du stehst an dritter Stelle in einer Reihe von zehn Kindern. Wie viele Kinder stehen hinter dir?",
    "hints": [
      "Zeichne zehn Kreise in einer Reihe. Markiere den dritten Kreis als deinen Platz.",
      "Zähle nur die Kreise hinter deinem Platz. Dein eigener Kreis zählt nicht mit."
    ]
  },
  "o18": {
    "question": "Die Woche beginnt am Montag. An welcher Stelle steht der Freitag? Schreibe die Ordnungszahl.",
    "spokenPrompt": "Die Woche beginnt am Montag. An welcher Stelle steht der Freitag? Schreibe die Ordnungszahl.",
    "hints": [
      "Nenne die Wochentage ab Montag der Reihe nach.",
      "Zähle jeden Tag bis Freitag mit. Schreibe die Anzahl mit einem Punkt."
    ]
  },
  "o19": {
    "spokenPrompt": "Zehn Kinder stehen in einer Reihe. Petra steht an siebter Stelle. Wie viele Kinder stehen vor ihr?",
    "hints": [
      "Zeichne zehn Plätze und markiere Petras Platz.",
      "Zähle vom Anfang der Reihe bis direkt vor Petra. Petra selbst zählt nicht mit."
    ]
  },
  "o24": {
    "question": "Die Woche beginnt am Montag. Wie heisst der 4. Wochentag?",
    "spokenPrompt": "Die Woche beginnt am Montag. Wie heisst der vierte Wochentag?",
    "hints": [
      "Schau dir die Tage in einem Wochenkalender an.",
      "Zähle bei Montag los und halte beim vierten Tag an. Schreibe seinen Namen."
    ]
  },
  "o26": {
    "spokenPrompt": "An welcher Stelle im Jahr steht der September? Schreibe die Ordnungszahl.",
    "hints": [
      "Suche September in einem Jahreskalender.",
      "Zähle die Monate ab Januar bis September. Schreibe die Anzahl mit einem Punkt."
    ]
  },
  "o30": {
    "spokenPrompt": "Ein Turm hat fünf Stockwerke. Das unterste zählt als erstes Stockwerk. Welche Nummer hat das oberste? Schreibe die Ordnungszahl.",
    "hints": [
      "Zeichne fünf Kästchen übereinander als Stockwerke.",
      "Nummeriere sie von unten nach oben. Beginne unten mit eins und schreibe die gesuchte Zahl mit einem Punkt."
    ]
  },
  "o31": {
    "question": "Die Plätze gehen in gleich grossen Schritten weiter: 3., 6., 9., ___. Welcher Platz kommt als Nächstes?",
    "spokenPrompt": "Dritter Platz, sechster Platz, neunter Platz. Die Abstände bleiben gleich. Welcher Platz kommt als Nächstes?",
    "hints": [
      "Zähle die Schritte vom dritten zum sechsten Platz und vom sechsten zum neunten.",
      "Gehe vom neunten Platz noch einmal genauso viele Schritte weiter."
    ]
  },
  "o32": {
    "question": "An welcher Stelle im Jahr steht der Januar? Schreibe die Ordnungszahl.",
    "spokenPrompt": "An welcher Stelle im Jahr steht der Januar? Schreibe die Ordnungszahl.",
    "hints": [
      "Schau nach, mit welchem Monat ein Jahreskalender beginnt.",
      "Zähle die Monatsplätze vom Jahresanfang an. Schreibe die gesuchte Zahl mit einem Punkt."
    ]
  },
  "o36": {
    "spokenPrompt": "In einem Rennen mit zwanzig Teilnehmenden liegt Lena auf dem zwölften Platz. Wie viele Teilnehmende sind vor ihr?",
    "hints": [
      "Zeichne die Plätze bis zu Lena und nummeriere sie vom Anfang an.",
      "Zähle die Plätze vor Lena. Ihr eigener Platz gehört nicht dazu."
    ]
  },
  "o38": {
    "spokenPrompt": "Ein Buch hat zehn Kapitel. Kapitel sieben heisst Der Drache. Welche Nummer hat das Kapitel direkt davor? Schreibe die Ordnungszahl.",
    "hints": [
      "Stelle dir das Inhaltsverzeichnis mit den Kapitelnummern vor.",
      "Gehe von Kapitel sieben genau ein Kapitel zurück. Schreibe dessen Nummer mit einem Punkt."
    ]
  },
  "o40": {
    "spokenPrompt": "Mia steht an neunter Stelle in einer Reihe von fünfzehn Kindern. Wie viele Kinder stehen hinter ihr?",
    "hints": [
      "Zeichne fünfzehn Kreise und markiere den neunten als Mias Platz.",
      "Zähle die Kreise hinter Mia. Beginne erst beim Kreis nach ihrem Platz."
    ]
  },
  "o43": {
    "question": "In einer Bibliothek stehen 26 Regale in der Reihenfolge A bis Z, ohne Umlaute. Das A-Regal ist das 1. Regal. An welcher Stelle steht das O-Regal?",
    "spokenPrompt": "In einer Bibliothek stehen sechsundzwanzig Regale in der Reihenfolge A bis Z, ohne Umlaute. Das A-Regal ist das erste Regal. An welcher Stelle steht das O-Regal?",
    "hints": [
      "Schreibe die Buchstaben von A bis O der Reihe nach auf.",
      "Nummeriere deine Buchstaben ab eins. Welche Nummer bekommt das O?"
    ]
  },
  "o46": {
    "question": "Heute ist der 3. Mittwoch des Monats. Wie viele Mittwoche gab es in diesem Monat schon? Zähle heute mit.",
    "spokenPrompt": "Heute ist der dritte Mittwoch des Monats. Wie viele Mittwoche gab es in diesem Monat schon? Zähle heute mit.",
    "hints": [
      "Markiere in einem Monatskalender die Mittwoche vom Monatsanfang bis heute.",
      "Zähle deine Markierungen. Auch der heutige Mittwoch gehört dazu."
    ]
  },
  "m5b": {
    "spokenPrompt": "Die Zahlenreihe lautet: fünf, eine fehlende Zahl, fünfzehn, zwanzig. Welche Zahl fehlt?",
    "hints": [
      "Zähle die Schritte von fünfzehn bis zwanzig.",
      "Gehe von fünf genauso viele Schritte weiter. Prüfe, ob der nächste gleiche Sprung bei fünfzehn endet."
    ]
  },
  "m7": {
    "spokenPrompt": "Drei, sechs, neun, eine fehlende Zahl, fünfzehn. Welche Zahl fehlt in der Reihe?",
    "hints": [
      "Vergleiche die Sprünge von drei zu sechs und von sechs zu neun.",
      "Gehe von neun genauso weit weiter. Nach einem weiteren gleichen Sprung sollst du bei fünfzehn sein."
    ]
  },
  "m12": {
    "spokenPrompt": "Zehn, acht, sechs, eine fehlende Zahl, zwei. Welche Zahl fehlt in der Reihe?",
    "hints": [
      "Die Zahlen werden kleiner. Zähle, wie viele Schritte du von zehn bis acht zurückgehst.",
      "Gehe von sechs genauso viele Schritte zurück. Prüfe danach den Sprung zur zwei."
    ]
  },
  "m15": {
    "spokenPrompt": "Zwei, vier, eine fehlende Zahl, acht, zehn. Welche Zahl fehlt in der Reihe?",
    "hints": [
      "Zähle in Zweierschritten.",
      "Gehe von vier zwei Schritte vorwärts. Noch ein gleich grosser Sprung muss bei acht enden."
    ]
  },
  "m23": {
    "question": "Die Abstände bleiben gleich. Welche Zahl fehlt? 12, 10, 8, ___, 4",
    "spokenPrompt": "Die Abstände bleiben gleich. Zwölf, zehn, acht, eine fehlende Zahl, vier. Welche Zahl fehlt?",
    "hints": [
      "Vergleiche die ersten beiden Sprünge. Die Zahlen werden kleiner.",
      "Gehe von acht genauso weit zurück. Prüfe, ob der nächste gleiche Sprung bei vier endet."
    ]
  },
  "m24": {
    "spokenPrompt": "Zwanzig, eine fehlende Zahl, vierzehn, elf, acht. Welche Zahl fehlt in der Reihe?",
    "hints": [
      "Von vierzehn zu elf und von elf zu acht geht es immer gleich weit zurück.",
      "Gehe von zwanzig genauso viele Schritte zurück. Prüfe den nächsten Sprung zur vierzehn."
    ]
  },
  "m27": {
    "question": "Die Abstände bleiben gleich. Welche Zahl fehlt? 2, 5, ___, 11, 14",
    "spokenPrompt": "Die Abstände bleiben gleich. Zwei, fünf, eine fehlende Zahl, elf, vierzehn. Welche Zahl fehlt?",
    "hints": [
      "Zähle die Schritte von zwei bis fünf und von elf bis vierzehn.",
      "Gehe von fünf genauso weit vorwärts. Prüfe, ob du mit dem nächsten gleichen Sprung elf erreichst."
    ]
  },
  "m29": {
    "question": "Die Abstände bleiben gleich. Welche Zahl fehlt? 18, 15, 12, ___, 6",
    "spokenPrompt": "Die Abstände bleiben gleich. Achtzehn, fünfzehn, zwölf, eine fehlende Zahl, sechs. Welche Zahl fehlt?",
    "hints": [
      "Die Zahlen werden kleiner. Vergleiche die ersten beiden Sprünge.",
      "Gehe von zwölf genauso weit zurück. Ein weiterer gleicher Sprung soll bei sechs enden."
    ]
  },
  "m35": {
    "question": "Die Abstände bleiben gleich. Welche Zahl fehlt? 5, 8, ___, 14, 17",
    "spokenPrompt": "Die Abstände bleiben gleich. Fünf, acht, eine fehlende Zahl, vierzehn, siebzehn. Welche Zahl fehlt?",
    "hints": [
      "Vergleiche den Sprung von fünf zu acht mit dem Sprung von vierzehn zu siebzehn.",
      "Gehe von acht genauso viele Schritte weiter. Prüfe den nächsten Sprung bis vierzehn."
    ]
  },
  "m37": {
    "hints": [
      "Zähle die Schritte von sieben zu zehn. So gross sind alle Sprünge der Reihe.",
      "Die Lücke steht vor der sieben. Gehe von sieben einen solchen Sprung rückwärts."
    ]
  },
  "m38": {
    "question": "Der Dreierblock wiederholt sich: 1, 2, 3, 1, 2, 3, 1, ___. Welche Zahl fehlt?",
    "spokenPrompt": "Der Dreierblock wiederholt sich: eins, zwei, drei, eins, zwei, drei, eins. Welche Zahl kommt als Nächstes?",
    "hints": [
      "Umkreise die ersten drei Zahlen als einen Block und suche den gleichen Block noch einmal.",
      "Der letzte Block hat schon begonnen. Schau, welche Stelle darin als Nächstes kommt."
    ]
  },
  "m39": {
    "question": "Die Reihe beginnt mit 2, 4, 6 und geht immer um 2 weiter. Welche Zahl steht an der 5. Stelle?",
    "spokenPrompt": "Die Reihe beginnt mit zwei, vier, sechs und geht immer um zwei weiter. Welche Zahl steht an der fünften Stelle?",
    "hints": [
      "Schreibe die bisherigen Zahlen auf und nummeriere ihre Plätze darunter.",
      "Setze die Reihe in Zweierschritten fort, bis auch der fünfte Platz besetzt ist."
    ]
  },
  "m40": {
    "question": "Die Abstände bleiben gleich. Welche Zahl steht am Anfang? ___, 15, 10, 5",
    "spokenPrompt": "Die Abstände bleiben gleich. Am Anfang fehlt eine Zahl. Danach kommen fünfzehn, zehn und fünf. Welche Zahl fehlt?",
    "hints": [
      "Schau, wie weit es von fünfzehn zu zehn und von zehn zu fünf zurückgeht.",
      "Um den Anfang zu finden, gehe von fünfzehn einen gleich grossen Sprung in die andere Richtung."
    ]
  },
  "m42": {
    "question": "Die Reihe beginnt mit 2, 4, 6 und geht immer um 2 weiter. Welche Zahl steht an der 6. Stelle?",
    "spokenPrompt": "Die Reihe beginnt mit zwei, vier, sechs und geht immer um zwei weiter. Welche Zahl steht an der sechsten Stelle?",
    "hints": [
      "Zeichne sechs Kästchen und trage die ersten drei Zahlen ein.",
      "Gehe für jedes weitere Kästchen zwei Schritte vorwärts. Lies die Zahl im letzten Kästchen."
    ]
  },
  "m43": {
    "question": "Der Dreierblock 2, 3, 4 wiederholt sich immer. Welche Zahl steht an der 9. Stelle?",
    "spokenPrompt": "Der Dreierblock zwei, drei, vier wiederholt sich immer. Welche Zahl steht an der neunten Stelle?",
    "hints": [
      "Zeichne neun Kästchen und teile sie in Dreiergruppen ein.",
      "Trage in jede Gruppe denselben Dreierblock ein. Schau dann auf das neunte Kästchen."
    ]
  },
  "m45": {
    "question": "Die Abstände bleiben gleich. Welche Zahl fehlt am Anfang? ___, 9, 12, 15",
    "spokenPrompt": "Die Abstände bleiben gleich. Am Anfang fehlt eine Zahl. Danach kommen neun, zwölf und fünfzehn. Welche Zahl fehlt?",
    "hints": [
      "Zähle die Schritte von neun bis zwölf und von zwölf bis fünfzehn.",
      "Gehe von neun einen gleich grossen Sprung zurück, um den Anfang zu finden."
    ]
  },
  "m47": {
    "question": "Die Abstände bleiben gleich. Welche Zahl fehlt am Anfang? ___, 5, 2",
    "spokenPrompt": "Die Abstände bleiben gleich. Am Anfang fehlt eine Zahl. Danach kommen fünf und zwei. Welche Zahl fehlt?",
    "hints": [
      "Zähle, wie weit es von fünf zu zwei zurückgeht.",
      "Der Anfang liegt vor der fünf. Gehe von fünf genauso weit in die andere Richtung."
    ]
  },
  "m49": {
    "question": "Rechne immer abwechselnd plus 1, dann plus 2. Welche Zahl fehlt? 3, 4, 6, 7, ___, 10",
    "spokenPrompt": "Rechne immer abwechselnd plus eins, dann plus zwei. Drei, vier, sechs, sieben, eine fehlende Zahl, zehn. Welche Zahl fehlt?",
    "hints": [
      "Schreibe über jeden fertigen Sprung, ob du eins oder zwei dazuzählst.",
      "Setze den Wechsel nach der sieben fort. Prüfe, ob der nächste Sprung bei zehn endet."
    ]
  },
  "m2": {
    "hints": [
      "Tippe beim Zählen jeden Stern einmal an.",
      "Zähle nur Sterne, die du noch nicht angetippt hast. Merke dir die letzte Zahl."
    ]
  },
  "m6x2": {
    "hints": [
      "Zeichne für jede Praline einen Kreis.",
      "Streiche die vier gegessenen Pralinen durch und zähle die übrigen."
    ],
    "spokenPrompt": "In einer Schachtel sind zehn Pralinen. Du isst vier. Wie viele Pralinen bleiben übrig?"
  },
  "m9x2": {
    "hints": [
      "Hunde und Katzen zählen beide als Tiere.",
      "Beginne bei fünf und zähle für jede Katze einen Schritt weiter."
    ],
    "spokenPrompt": "Fünf Hunde und zwei Katzen: Wie viele Tiere sind das zusammen?"
  },
  "m10x2": {
    "hints": [
      "Tippe jeden Stern genau einmal an und zähle dabei laut.",
      "Die letzte Zählzahl sagt dir, wie viele Sterne es sind."
    ]
  },
  "m11x2": {
    "hints": [
      "Lege für jeden Stein einen kleinen Gegenstand hin.",
      "Nimm zwei davon weg und zähle, wie viele noch liegen."
    ],
    "question": "Auf dem Tisch liegen 6 Steine. Du nimmst 2 weg. Wie viele bleiben?"
  },
  "m12x2": {
    "hints": [
      "Zeichne die roten und die blauen Murmeln in zwei Gruppen.",
      "Zähle bei der zweiten Gruppe weiter, statt wieder bei eins zu beginnen."
    ],
    "spokenPrompt": "Ich habe drei rote und drei blaue Murmeln. Wie viele Murmeln habe ich zusammen?"
  },
  "m13x2": {
    "hints": [
      "Tippe beim Zählen jeden Schmetterling einmal an.",
      "Prüfe, ob noch ein Schmetterling übrig ist, den du nicht angetippt hast."
    ]
  },
  "m15x2": {
    "hints": [
      "Es wird eine Frucht weniger. Zähle rückwärts.",
      "Starte bei neun und gehe einen Zählschritt zurück."
    ],
    "spokenPrompt": "Im Korb sind neun Früchte. Jonas nimmt eine heraus. Wie viele Früchte bleiben im Korb?"
  },
  "m17x2": {
    "hints": [
      "Zeichne für jedes spielende Kind einen Kreis.",
      "Streiche die drei Kinder durch, die nach Hause gehen. Zähle die übrigen Kreise."
    ]
  },
  "m18x2": {
    "hints": [
      "Gabeln und Messer zählen beide als Besteckteile.",
      "Beginne mit den fünf Messern und zähle für jede Gabel einen Schritt weiter."
    ]
  },
  "m19x2": {
    "hints": [
      "Zähle die Mädchen und Jungen zusammen.",
      "Ergänze von acht zuerst bis zehn. Zähle danach die noch übrigen Jungen dazu."
    ]
  },
  "m21x2": {
    "hints": [
      "Zeichne für jede der acht Murmeln einen Kreis.",
      "Markiere die fünf sichtbaren Murmeln. Die übrigen Kreise gehören unter den Becher."
    ],
    "question": "Von 8 Murmeln sind 5 sichtbar. Die anderen liegen unter einem Becher. Wie viele sind versteckt?"
  },
  "m24x2": {
    "hints": [
      "Zeichne zehn Plätze für die Steine.",
      "Besetze sechs Plätze. Zähle die noch freien Plätze."
    ],
    "question": "Du möchtest 10 Steine sammeln und hast schon 6. Wie viele fehlen noch?"
  },
  "m25x2": {
    "hints": [
      "Zeichne für jede der zwölf Perlen einen Kreis.",
      "Markiere sieben Kreise als rot. Zähle die Kreise, die blau sein müssen."
    ],
    "question": "In einer Dose sind 12 Perlen. 7 sind rot, alle anderen blau. Wie viele sind blau?"
  },
  "m27x2": {
    "hints": [
      "Zeichne die Blumen nach Farben in drei Gruppen.",
      "Zähle erst die roten und gelben Blumen zusammen. Zähle danach die weissen dazu."
    ],
    "spokenPrompt": "In einem Garten wachsen vier rote, drei gelbe und zwei weisse Blumen. Wie viele Blumen sind es insgesamt?"
  },
  "m29x2": {
    "hints": [
      "Lege drei Gegenstände als Autos hin. Spiele die Geschichte nach.",
      "Nimm zuerst ein Auto weg. Lege dann zwei dazu und zähle die Autos am Schluss."
    ]
  },
  "m30x2": {
    "hints": [
      "Zeichne die beiden Steinsammlungen in zwei Reihen untereinander.",
      "Ordne jedem Stein von Ben einen von Mia zu. Zähle Mias Steine ohne Partner."
    ],
    "question": "Mia hat 11 Steine, Ben hat 5. Wie viele Steine hat Mia mehr als Ben?"
  },
  "m31x2": {
    "hints": [
      "Zeichne sieben Kästchen für Tims Aufkleber.",
      "Streiche drei Kästchen durch. Zähle nur die Aufkleber, die Tim behält."
    ]
  },
  "m32x2": {
    "hints": [
      "Verteile zehn kleine Gegenstände abwechselnd auf zwei Teller.",
      "Prüfe, ob auf beiden Tellern gleich viele liegen. Zähle dann nur einen Teller."
    ],
    "question": "Du verteilst 10 Steine gleichmässig auf 2 Teller. Wie viele liegen auf jedem Teller?"
  },
  "m33x2": {
    "hints": [
      "Zeichne für jeden Beutel eine Gruppe Murmeln.",
      "Zähle beide Gruppen zusammen. Beginne beim zweiten Beutel nicht wieder bei eins."
    ],
    "question": "In 2 Beuteln sind je 5 Murmeln. Wie viele Murmeln sind es zusammen?",
    "spokenPrompt": "In zwei Beuteln sind je fünf Murmeln. Wie viele Murmeln sind es zusammen?"
  },
  "m34x2": {
    "hints": [
      "Hasen und Füchse zählen beide als Tiere.",
      "Starte bei den sechs Hasen. Zähle für jeden Fuchs einen Schritt weiter."
    ]
  },
  "m35x2": {
    "hints": [
      "Zeichne dreizehn Kreise für alle Äpfel.",
      "Markiere sechs als grün. Zähle die übrigen roten Äpfel."
    ],
    "question": "In einem Korb sind 13 Äpfel. 6 sind grün, alle anderen rot. Wie viele sind rot?"
  },
  "m36x2": {
    "hints": [
      "Zeichne sechzehn Kreise für alle Muscheln.",
      "Markiere zuerst die fünf auf dem Tisch und dann die drei in der Schale. Zähle die übrigen."
    ],
    "question": "Du hast 16 Muscheln. 5 liegen auf dem Tisch, 3 in einer Schale und die übrigen in einer Dose. Wie viele sind in der Dose?"
  },
  "m37x2": {
    "hints": [
      "Verteile zehn Steine abwechselnd auf zwei Teller, bis beide gleich viele haben.",
      "Nimm vom ersten Teller drei Steine weg. Zähle nur die Steine, die dort bleiben."
    ],
    "question": "Du verteilst 10 Steine gleichmässig auf 2 Teller. Vom ersten Teller nimmst du 3 weg. Wie viele bleiben auf diesem Teller?"
  },
  "m38x2": {
    "hints": [
      "Lege vierzehn kleine Gegenstände für die Murmeln hin.",
      "Nimm zuerst acht weg. Lege dann drei dazu und zähle den neuen Bestand."
    ],
    "question": "Du hast 14 Murmeln, verschenkst 8 und bekommst danach 3 dazu. Wie viele hast du nun?"
  },
  "m40x2": {
    "hints": [
      "Zähle zuerst die roten und blauen Bonbons zusammen.",
      "Streiche danach die vier herausgenommenen Bonbons durch. Zähle die übrigen."
    ],
    "question": "In einer Schale sind 8 rote und 5 blaue Bonbons. Du nimmst 4 Bonbons heraus. Wie viele bleiben?"
  },
  "m42x2": {
    "hints": [
      "Verteile achtzehn Steine abwechselnd auf zwei Beutel.",
      "Zähle die Steine in einem Beutel und lege dort noch einen dazu."
    ],
    "question": "Du verteilst 18 Steine gleichmässig auf 2 Beutel. Danach legst du in einen Beutel noch 1 Stein. Wie viele sind jetzt in diesem Beutel?"
  },
  "m43x2": {
    "hints": [
      "Zeichne zwölf Kästchen für die Plätze.",
      "Besetze zuerst sechs mit roten und dann vier mit blauen Murmeln. Zähle die freien Plätze."
    ],
    "question": "Eine Schachtel hat Platz für 12 Murmeln. Du legst 6 rote und 4 blaue hinein. Wie viele Plätze bleiben frei?"
  },
  "m44x2": {
    "hints": [
      "Du darfst die Farbgruppen in einer anderen Reihenfolge zusammenzählen.",
      "Zähle zuerst die sechs roten und vier blauen Steine zusammen. Nimm danach die gelben dazu."
    ]
  },
  "m45x2": {
    "hints": [
      "Zähle alle drei Fruchtsorten mit.",
      "Beginne mit den acht Birnen und den zwei Orangen. Zähle danach die Äpfel dazu."
    ]
  },
  "m47x2": {
    "hints": [
      "Zeichne Lenas acht Beeren als eine Reihe.",
      "Zeichne darunter Tims Reihe. Sie soll drei Beeren kürzer sein. Zähle Tims Beeren."
    ],
    "spokenPrompt": "Lena hat acht Beeren. Tim hat drei weniger als Lena. Wie viele Beeren hat Tim?"
  },
  "m48x2": {
    "hints": [
      "Verteile fünfzehn Gegenstände der Reihe nach auf drei Körbe, bis alle gleich viele haben.",
      "Nimm aus einem Korb zwei weg. Zähle, wie viele in diesem Korb bleiben."
    ],
    "question": "Du verteilst 15 Äpfel gleichmässig auf 3 Körbe. Aus einem Korb nimmst du 2 Äpfel. Wie viele bleiben in diesem Korb?"
  },
  "v3": {
    "hints": [
      "Zeige an einer Hand fünf Finger und an der anderen gleich viele.",
      "Zähle die Finger beider Hände zusammen."
    ],
    "spokenPrompt": "Was ist das Doppelte von fünf?"
  },
  "v4": {
    "hints": [
      "Zeichne sieben Punkte und darunter noch einmal gleich viele.",
      "Zähle beide Reihen zusammen. Beginne bei der zweiten Reihe nicht wieder bei eins."
    ]
  },
  "v5": {
    "hints": [
      "Zeichne zwei Punkte und daneben noch einmal zwei.",
      "Zähle alle gezeichneten Punkte zusammen."
    ]
  },
  "v6": {
    "hints": [
      "Die ganze Menge besteht aus zwei gleich grossen Teilen.",
      "Zeichne drei Steine für den einen Teil und genauso viele für den anderen. Zähle beide Teile zusammen."
    ],
    "question": "Die Hälfte meiner Steine sind 3 Steine. Wie viele Steine habe ich insgesamt?"
  },
  "v7": {
    "hints": [
      "Verteile sechzehn kleine Gegenstände abwechselnd auf zwei Teller.",
      "Prüfe, ob auf beiden Tellern gleich viele liegen. Zähle dann einen Teller."
    ],
    "spokenPrompt": "Was ist die Hälfte von sechzehn?"
  },
  "v8": {
    "hints": [
      "Zeichne zwei Reihen mit je neun Punkten.",
      "Verschiebe aus der zweiten Reihe einen Punkt in die erste. Zähle die volle Zehnerreihe und die übrigen Punkte zusammen."
    ]
  },
  "v9": {
    "hints": [
      "Lege zwei Steine hin und daneben noch einmal gleich viele.",
      "Zähle die Steine beider Gruppen zusammen."
    ],
    "spokenPrompt": "Was ist das Doppelte von zwei?"
  },
  "v10": {
    "hints": [
      "Verteile sechs Steine abwechselnd auf zwei Teller.",
      "Wenn beide Teller gleich viele Steine haben, zähle nur einen Teller."
    ]
  },
  "v11": {
    "hints": [
      "Lege einen Stein hin und daneben noch einmal gleich viele.",
      "Zähle beide Gruppen zusammen."
    ],
    "spokenPrompt": "Was ist das Doppelte von eins?"
  },
  "v12": {
    "hints": [
      "Lege vier Steine bereit und zeichne zwei Kreise als Teller.",
      "Lege abwechselnd einen Stein auf jeden Teller. Zähle am Schluss nur einen Teller."
    ]
  },
  "v13": {
    "hints": [
      "Zeichne vier Punkte und eine zweite Gruppe mit gleich vielen Punkten.",
      "Zähle beide Gruppen zusammen."
    ],
    "spokenPrompt": "Was ist das Doppelte von vier?"
  },
  "v15": {
    "hints": [
      "Lege sechs kleine Gegenstände hin und daneben noch einmal sechs.",
      "Beginne bei sechs und zähle die zweite Gruppe dazu."
    ],
    "spokenPrompt": "Was ist das Doppelte von sechs?"
  },
  "v16": {
    "hints": [
      "Lege zwanzig kleine Gegenstände bereit.",
      "Verteile sie abwechselnd auf zwei Teller und zähle danach die Gegenstände auf einem Teller."
    ]
  },
  "v17": {
    "hints": [
      "Stelle dir zwei leere Schalen vor. In beiden ist gleich viel.",
      "Wie viele Steine kannst du insgesamt zählen, wenn du die beiden Schalen zusammenschiebst?"
    ],
    "spokenPrompt": "Was ist das Doppelte von null?"
  },
  "v18": {
    "hints": [
      "Zeichne zwei Reihen mit je acht Punkten.",
      "Ergänze die erste Reihe mit Punkten aus der zweiten auf zehn. Zähle dann die übrigen Punkte dazu."
    ]
  },
  "v19": {
    "hints": [
      "Verteile vierzehn Steine abwechselnd auf zwei Teller.",
      "Zähle einen Teller. Zur Kontrolle muss diese Menge zweimal wieder alle Steine ergeben."
    ],
    "spokenPrompt": "Was ist die Hälfte von vierzehn?"
  },
  "v20": {
    "hints": [
      "Gesucht ist die Menge in einem von zwei gleich grossen Teilen.",
      "Verteile sechzehn Punkte auf zwei gleich grosse Gruppen. Zähle eine Gruppe."
    ],
    "question": "Ich verdopple eine Zahl und erhalte 16. Welche Zahl war es?"
  },
  "v21": {
    "hints": [
      "Zeichne zehn Punkte und verteile sie auf zwei gleich grosse Gruppen.",
      "Zähle eine Gruppe. Prüfe, ob zweimal diese Menge zusammen zehn ergibt."
    ],
    "spokenPrompt": "Welche Zahl musst du verdoppeln, damit du zehn erhältst?"
  },
  "v22": {
    "hints": [
      "Verteile achtzehn Gegenstände abwechselnd auf zwei Teller.",
      "Zähle die Gegenstände auf einem Teller und prüfe, ob der andere gleich viele hat."
    ]
  },
  "v23": {
    "hints": [
      "Zeichne die fünf Perlen von Mia als eine Gruppe.",
      "Für die ganze Menge brauchst du noch eine gleich grosse Gruppe. Zähle beide zusammen."
    ],
    "question": "Mia bekommt die Hälfte aller Perlen. Das sind 5 Perlen. Wie viele Perlen waren es insgesamt?"
  },
  "v24": {
    "hints": [
      "Zeichne zwei Gruppen mit je fünf Nüssen.",
      "Zähle beide Gruppen zusammen und lege danach die zwei weiteren Nüsse dazu."
    ],
    "question": "In 2 Beuteln sind je 5 Nüsse. Du legst noch 2 Nüsse dazu. Wie viele Nüsse sind es insgesamt?"
  },
  "v25": {
    "hints": [
      "Die sieben Murmeln sind nur einer von zwei gleich grossen Teilen.",
      "Lege für den anderen Teil gleich viele Murmeln hin und zähle beide Teile zusammen."
    ],
    "question": "Ben verschenkt die Hälfte seiner Murmeln und behält 7. Wie viele hatte er vorher?"
  },
  "v26": {
    "hints": [
      "Zeichne acht Kreise für Leas Kastanien.",
      "Tim hat zwei solche Gruppen. Zeichne die zweite dazu und zähle Tims Kastanien."
    ],
    "question": "Lea hat 8 Kastanien. Das sind halb so viele wie Tim hat. Wie viele Kastanien hat Tim?"
  },
  "v27": {
    "hints": [
      "Zeichne zwei Reihen mit je zehn Punkten.",
      "Streiche in jeder Reihe einen Punkt durch. Zähle die übrigen Punkte beider Reihen zusammen."
    ],
    "question": "Auf 2 Tellern liegen je 10 Beeren. Von jedem Teller nimmst du 1 Beere weg. Wie viele Beeren bleiben insgesamt?"
  },
  "v28": {
    "hints": [
      "Zeichne für jede Katze vier Striche als Beine.",
      "Zähle die Striche beider Katzen zusammen."
    ]
  },
  "v29": {
    "hints": [
      "Die acht Sticker bestehen aus zwei gleich grossen Gruppen.",
      "Verteile acht Punkte abwechselnd auf zwei Gruppen. Zähle eine Gruppe."
    ],
    "question": "Ich verdopple meine Stickerzahl und habe dann 8 Sticker. Wie viele hatte ich vorher?"
  },
  "v31": {
    "hints": [
      "Zeichne zwölf Punkte für die Trauben.",
      "Verteile sie abwechselnd auf zwei Teller und zähle die Trauben auf einem Teller."
    ],
    "question": "Du teilst 12 Trauben gerecht auf 2 Teller auf. Wie viele Trauben kommen auf jeden Teller?"
  },
  "v32": {
    "hints": [
      "Verteile zehn Steine auf zwei gleich grosse Gruppen.",
      "Nimm eine Gruppe und lege noch einmal gleich viele Steine dazu. Zähle diese neue Menge."
    ]
  },
  "v33": {
    "hints": [
      "Zeichne neun Kästchen für Annas Sticker.",
      "Ben hat zwei solche Gruppen. Zeichne beide Gruppen für Ben und zähle sie zusammen."
    ],
    "spokenPrompt": "Anna hat neun Sticker. Ben hat doppelt so viele. Wie viele Sticker hat Ben?"
  },
  "v34": {
    "hints": [
      "Verteile acht Steine auf zwei gleich grosse Gruppen.",
      "Nimm nur eine dieser Gruppen und teile sie nochmals gleichmässig in zwei Teile. Zähle einen dieser Teile."
    ]
  },
  "v35": {
    "hints": [
      "Beide Schalen sollen gleich viele Nüsse enthalten.",
      "Zeichne sechzehn Punkte und ordne sie paarweise den beiden Schalen zu. Zähle eine Schale."
    ],
    "question": "In 2 Schalen liegen zusammen 16 Nüsse. In beiden Schalen sind gleich viele. Wie viele sind in einer Schale?"
  },
  "v36": {
    "hints": [
      "Gehe rückwärts: Mache zuerst das Wegnehmen von zwei rückgängig.",
      "Teile die erhaltene Menge in zwei gleich grosse Gruppen. Eine Gruppe zeigt die gesuchte Zahl."
    ],
    "question": "Ich verdopple eine Zahl und nehme dann 2 weg. Es bleiben 8. Welche Zahl habe ich verdoppelt?",
    "spokenPrompt": "Ich verdopple eine Zahl und nehme dann zwei weg. Es bleiben acht. Welche Zahl habe ich verdoppelt?"
  },
  "v37": {
    "hints": [
      "Zeichne drei Punkte und noch einmal gleich viele.",
      "Verdopple nun die ganze gezeichnete Menge, nicht nur die erste Gruppe."
    ]
  },
  "v40": {
    "hints": [
      "Zeichne zuerst vier Punkte und noch einmal gleich viele.",
      "Zeichne erst danach zwei weitere Punkte dazu. Zähle alle Punkte."
    ],
    "question": "Du verdoppelst 4 Steine und legst danach 2 dazu. Wie viele Steine sind es nun?"
  },
  "v41": {
    "hints": [
      "Verdopple jede angebotene Zahl, indem du sie zu sich selbst dazuzählst.",
      "Prüfe jedes Ergebnis an beiden Grenzen: Es muss grösser als zwölf und kleiner als fünfzehn sein."
    ]
  },
  "v42": {
    "hints": [
      "Spiele die Schritte mit Steinen nach. Beginne mit vier und lege gleich viele dazu.",
      "Nimm dann nur die Hälfte dieser Menge. Lege zum Schluss noch einmal so viele dazu."
    ],
    "spokenPrompt": "Verdopple vier. Halbiere das Ergebnis und verdopple es wieder. Welche Zahl erhältst du am Schluss?"
  },
  "v43": {
    "hints": [
      "Verdopple jede angebotene Zahl für sich.",
      "Behalte nur ein Ergebnis, das über sechs und unter zehn liegt. Gesucht ist die Zahl vor dem Verdoppeln."
    ]
  },
  "v44": {
    "hints": [
      "Verteile zwanzig Steine gleichmässig auf zwei Teller.",
      "Zähle einen Teller und lege dort zwei Steine dazu. Zähle nur diesen Teller."
    ],
    "question": "Du halbierst 20 Steine. Zu einer Hälfte legst du 2 Steine dazu. Wie viele sind in dieser Gruppe?"
  },
  "v45": {
    "hints": [
      "Zeichne zwei Gruppen mit je acht Perlen.",
      "Streiche aus jeder Gruppe eine Perle durch und zähle die übrigen zusammen."
    ],
    "question": "In 2 Beuteln sind je 8 Perlen. Aus jedem Beutel nimmst du 1 Perle. Wie viele bleiben insgesamt?"
  },
  "v46": {
    "hints": [
      "Verdopple zuerst fünf und nimm von dieser Menge zwei weg.",
      "Verdopple nun die übrig gebliebene Menge. Spiele die Schritte mit Steinen nach."
    ],
    "question": "Verdopple 5, nimm 2 weg und verdopple den Rest. Welche Zahl erhältst du?",
    "spokenPrompt": "Verdopple fünf, nimm zwei weg und verdopple den Rest. Welche Zahl erhältst du?"
  },
  "v47": {
    "hints": [
      "Mache zuerst das Wegnehmen rückgängig: Lege zu acht wieder einen Stein dazu.",
      "Diese Menge ist erst die Hälfte. Lege eine gleich grosse Gruppe daneben und zähle alles."
    ],
    "question": "Ich halbiere meine Steinmenge und nehme von einer Hälfte 1 Stein weg. Dort bleiben 8. Wie viele Steine hatte ich am Anfang?"
  },
  "v48": {
    "hints": [
      "Mache zuerst das Dazulegen rückgängig: Nimm von zehn zwei weg.",
      "Teile den Rest in zwei gleich grosse Gruppen. Eine Gruppe zeigt die Anfangsmenge."
    ],
    "question": "Ich verdopple meine Murmeln und lege 2 dazu. Nun sind es 10. Wie viele Murmeln hatte ich am Anfang?"
  },
  "v49": {
    "hints": [
      "Verteile sechzehn Nüsse auf zwei gleich grosse Gruppen.",
      "Nimm von einer Gruppe zwei Nüsse weg. Zähle, wie viele in dieser Gruppe bleiben."
    ],
    "question": "Du halbierst 16 Nüsse und isst von einer Hälfte 2. Wie viele bleiben in dieser Hälfte?"
  },
  "v50": {
    "hints": [
      "Mache zuerst das Dazulegen rückgängig: Nimm von sechs zwei Steine weg.",
      "Diese Menge ist die Hälfte der Anfangsmenge. Lege noch einmal gleich viele dazu."
    ],
    "question": "Ich halbiere meine Steine und lege zu einer Hälfte 2 Steine dazu. Dort liegen nun 6. Wie viele Steine hatte ich am Anfang?"
  },
  "g2": {
    "hints": [
      "Zwei Münzen zu je fünfzig Rappen haben zusammen den Wert eines Frankens.",
      "Zähle die Rappenwerte der beiden Münzen zusammen."
    ]
  },
  "g6": {
    "hints": [
      "Ergänze den Preis zuerst bis zu zwei Franken und dann bis zu fünf Franken.",
      "Zähle beide Ergänzungen zusammen. Schreibe Franken und Rappen mit einem Punkt, zum Beispiel 2.50 für zwei Franken fünfzig."
    ],
    "question": "Luca kauft ein Eis für CHF 1.80 und bezahlt CHF 5. Wie viel Rückgeld bekommt er? Schreibe den Betrag in Franken mit einem Punkt.",
    "spokenPrompt": "Luca kauft ein Eis für einen Franken achtzig und bezahlt fünf Franken. Wie viel Rückgeld bekommt er? Schreibe den Betrag in Franken mit einem Punkt."
  },
  "g8": {
    "hints": [
      "Ein Franken lässt sich in zehn Münzen zu je zehn Rappen wechseln.",
      "Verteile diese Münzen gleichmässig auf zwei Gruppen. Zähle den Wert einer Gruppe in Zehnerschritten."
    ]
  },
  "g9": {
    "hints": [
      "Lege für zwei Franken zwei Einfrankenmünzen hin.",
      "Lege noch eine Einfrankenmünze dazu und zähle den ganzen Betrag."
    ],
    "spokenPrompt": "Wie viele Franken ergeben zwei Franken plus ein Franken?"
  },
  "g10": {
    "hints": [
      "Ein Franken hat den Wert von zehn Zehnrappenmünzen.",
      "Neunzig Rappen sind neun Zehnrappenmünzen. Vergleiche die beiden Münzreihen."
    ]
  },
  "g13": {
    "hints": [
      "Zeichne fünf Münzen mit je zwanzig Rappen. Zähle ihren Wert zusammen.",
      "Du kannst für jede Münze zwei Zehnerschritte zählen. Hundert Rappen lassen sich in einen Franken wechseln."
    ],
    "spokenPrompt": "Fünf Münzen sind je zwanzig Rappen wert. Wie viele Franken sind sie zusammen wert?"
  },
  "g16": {
    "hints": [
      "Zeichne neben das Heft und den Stift jeweils die nötigen Einfrankenmünzen.",
      "Für welchen Gegenstand brauchst du mehr Münzen?"
    ],
    "spokenPrompt": "Was kostet mehr: ein Heft für zwei Franken oder ein Stift für einen Franken?"
  },
  "g17": {
    "hints": [
      "Zeichne für jede Münze einen Kreis mit dem Wert ein Franken.",
      "Zähle die Frankenwerte aller Kreise zusammen."
    ],
    "spokenPrompt": "Du hast drei Münzen zu je einem Franken. Wie viele Franken sind das zusammen?"
  },
  "g22": {
    "hints": [
      "Zeichne zehn Einfrankenmünzen für den Preis.",
      "Markiere vier davon als dein Erspartes. Wie viele fehlen noch?"
    ],
    "question": "Ein Buch kostet 10 Franken. Du hast 4 Franken gespart. Wie viele Franken fehlen dir noch?"
  },
  "g29": {
    "hints": [
      "Zeichne vier Münzen und schreibe auf jede zwei Franken.",
      "Zähle ihren Wert in Zweierschritten. Gesucht ist der Betrag, nicht die Anzahl Münzen."
    ],
    "question": "Du hast 4 Zweifrankenmünzen. Wie viele Franken sind das zusammen?"
  },
  "g35": {
    "hints": [
      "Zähle zuerst die Preise von Heft und Stift zusammen.",
      "Ziehe diesen Gesamtpreis von den zehn Franken ab."
    ],
    "question": "Ein Heft kostet 3 Franken und ein Stift 2 Franken. Du bezahlst beides mit 10 Franken. Wie viele Franken bekommst du zurück?"
  },
  "g36": {
    "hints": [
      "Zeichne zehn Einfrankenmünzen.",
      "Streiche zuerst den Preis des Hefts und dann den Preis des Stifts durch. Zähle das übrige Geld."
    ],
    "question": "Du hast 10 Franken. Du kaufst ein Heft für 4 Franken und einen Stift für 3 Franken. Wie viele Franken bleiben dir?"
  },
  "g37": {
    "hints": [
      "Zähle zuerst den Wert der drei vorhandenen Münzen zusammen.",
      "Ein Franken sind hundert Rappen. Welche angebotene Münze ergänzt den Betrag genau?"
    ],
    "question": "Du hast zweimal 20 Rappen und einmal 10 Rappen. Welche Münze fehlt dir noch bis zu 1 Franken?"
  },
  "g38": {
    "hints": [
      "Zähle den Wert der beiden Zweifrankenmünzen zusammen.",
      "Ergänze diesen Betrag bis zu fünf Franken. Gesucht ist der Wert der dritten Münze."
    ],
    "question": "Du hast genau 3 Münzen im Wert von zusammen 5 Franken. Zwei davon sind Zweifrankenmünzen. Wie viele Franken ist die dritte Münze wert?"
  },
  "g39": {
    "hints": [
      "Rechne zuerst aus, was die beiden Hefte zusammen kosten.",
      "Ziehe den Preis von fünf Franken ab. Wandle das übrige Geld in Rappen um."
    ],
    "question": "Du bezahlst 2 Hefte zu je 2 Franken mit 5 Franken. Wie viel Rückgeld bekommst du in Rappen?"
  },
  "g40": {
    "hints": [
      "Ziehe zuerst das Rückgeld von den bezahlten zehn Franken ab.",
      "Von diesem Gesamtpreis gehört ein Teil zum Heft. Ziehe dessen Preis ab."
    ],
    "question": "Du bezahlst ein Heft und einen Stift mit 10 Franken und bekommst 5 Franken zurück. Das Heft kostet 2 Franken. Wie viele Franken kostet der Stift?"
  },
  "g41": {
    "hints": [
      "Zähle die Preise des Balls und des Seils zusammen.",
      "Ziehe den Gesamtpreis von deinem Geld ab."
    ],
    "question": "Du hast 20 Franken. Ein Ball kostet 8 Franken, ein Seil 5 Franken. Wie viele Franken bleiben nach beiden Käufen?"
  },
  "g42": {
    "hints": [
      "Ziehe den Wert der Fünffrankenmünze vom Gesamtbetrag ab.",
      "Lege den fehlenden Betrag mit Zweifrankenmünzen. Zähle diese Münzen."
    ],
    "question": "Du möchtest 11 Franken genau bezahlen. Du legst eine Fünffrankenmünze hin und ergänzt nur Zweifrankenmünzen. Wie viele Zweifrankenmünzen brauchst du?"
  },
  "g43": {
    "hints": [
      "Zähle zuerst den Wert deiner drei Münzen zusammen.",
      "Ziehe den Preis ab. Welche angebotene Münze hat genau den Wert des Rückgelds?"
    ],
    "question": "Du bezahlst einen Znüni für 70 Rappen mit zwei 50-Rappen-Münzen und einer 20-Rappen-Münze. Welche Münze bekommst du als Rückgeld?"
  },
  "g44": {
    "hints": [
      "Rechne aus, wie viel Geld Ben insgesamt hat.",
      "Vergleiche Bens Betrag mit Mias Betrag. Wie viel fehlt ihm bis zu Mias Betrag?"
    ],
    "question": "Mia hat eine Fünffrankenmünze. Ben hat zwei Zweifrankenmünzen. Wie viele Franken hat Mia mehr als Ben?"
  },
  "g45": {
    "hints": [
      "Rechne zuerst aus, wie viele Rappen die fünf Bonbons zusammen kosten.",
      "Zwei Franken sind zweihundert Rappen. Ziehe den Gesamtpreis davon ab."
    ],
    "question": "Du kaufst 5 Bonbons zu je 20 Rappen und bezahlst mit 2 Franken. Wie viel Rückgeld bekommst du?"
  },
  "g46": {
    "hints": [
      "Zähle Mias und Bens Geld zusammen.",
      "Ergänze den gemeinsamen Betrag bis zum Preis des Spiels."
    ],
    "question": "Ein Spiel kostet 12 Franken. Mia hat 4 Franken, Ben 5 Franken. Wie viele Franken fehlen ihnen zusammen noch?"
  },
  "g47": {
    "question": "Du wechselst 5 Zweifrankenmünzen in Einfrankenmünzen. Dann bezahlst du damit ein Buch für 6 Franken. Wie viele Einfrankenmünzen bleiben?",
    "spokenPrompt": "Du wechselst fünf Zweifrankenmünzen in Einfrankenmünzen. Dann bezahlst du damit ein Buch für sechs Franken. Wie viele Einfrankenmünzen bleiben?",
    "hints": [
      "Jede Zweifrankenmünze wird zu zwei Einfrankenmünzen. Zähle die Einfrankenmünzen nach dem Wechseln.",
      "Nimm für jeden Franken des Buchpreises eine Münze weg. Zähle die übrigen Münzen."
    ]
  },
  "g48": {
    "hints": [
      "Zähle den Preis der drei Karten zusammen.",
      "Ziehe diesen Preis von neun Franken ab."
    ],
    "question": "Du kaufst 3 Karten zu je 2 Franken und bezahlst mit 9 Franken. Wie viele Franken bekommst du zurück?"
  },
  "g49": {
    "hints": [
      "Ein Franken fünfzig sind hundertfünfzig Rappen. Zwei Franken sind zweihundert Rappen.",
      "Zähle vom Preis bis zum bezahlten Betrag weiter. Welche Münze passt zu dieser Ergänzung?"
    ],
    "question": "Du bezahlst einen Apfel für 1 Franken 50 Rappen mit einer Zweifrankenmünze. Welche Münze bekommst du zurück?",
    "spokenPrompt": "Du bezahlst einen Apfel für einen Franken fünfzig mit einer Zweifrankenmünze. Welche Münze bekommst du zurück?"
  },
  "g50": {
    "hints": [
      "Zeichne zehn Einfrankenmünzen. Nimm zweimal zwei Franken für die Geschwister weg.",
      "Nimm danach den Preis des Hefts weg und zähle das übrige Geld."
    ],
    "question": "Du hast 10 Franken und gibst deinen beiden Geschwistern je 2 Franken. Danach kaufst du ein Heft für 5 Franken. Wie viele Franken bleiben dir?"
  },
  "sa25": {
    "question": "Mia hat 2 Äpfel. Sie bekommt 2 dazu. Wie viele Äpfel hat sie jetzt? ___",
    "hints": [
      "Zeichne zuerst Mias Äpfel.",
      "Zeichne die geschenkten Äpfel dazu und zähle alle Äpfel."
    ]
  },
  "sa31": {
    "question": "In einer Schachtel waren einige Stifte. Mia legt 4 dazu. Jetzt sind es 10. Wie viele waren vorher darin? ___",
    "hints": [
      "Zeichne zehn Stifte.",
      "Markiere die vier neuen Stifte. Zähle die Stifte, die vorher schon da waren."
    ]
  },
  "sa32": {
    "question": "Ben hat 9 Murmeln, Mia hat 4. Wie viele Murmeln hat Ben mehr als Mia?",
    "hints": [
      "Lege für jedes Kind eine Reihe mit Murmeln.",
      "Verbinde immer eine Murmel von Ben mit einer von Mia. Zähle Bens übrige Murmeln."
    ]
  },
  "sa33": {
    "question": "Im Bus sitzen 12 Kinder. Beim ersten Halt steigen 3 aus, beim zweiten Halt noch 2. Wie viele Kinder bleiben im Bus? ___",
    "hints": [
      "Zeichne für jedes Kind einen Kreis.",
      "Streiche zuerst die Kinder vom ersten Halt und dann die vom zweiten Halt durch. Zähle die übrigen Kreise."
    ]
  },
  "sa34": {
    "question": "Auf dem Tisch liegen 14 Karten. Davon sind 5 rot, alle anderen blau. Wie viele blaue Karten sind es?",
    "hints": [
      "Zeichne vierzehn Karten.",
      "Markiere fünf Karten rot. Zähle alle anderen Karten."
    ]
  },
  "sa35": {
    "question": "9 Äpfel werden gleichmässig auf 3 Körbe verteilt. Wie viele Äpfel kommen in jeden Korb? ___",
    "hints": [
      "Zeichne drei Körbe und neun Äpfel.",
      "Lege reihum in jeden Korb einen Apfel, bis alle verteilt sind. Zähle in einem Korb."
    ]
  },
  "sa37": {
    "question": "Tom bekommt an jedem Tag 1 neuen Sticker. Wie viele neue Sticker bekommt er in 5 Tagen zusammen? ___",
    "hints": [
      "Zeichne für jeden Tag ein Kästchen.",
      "Zeichne in jedes Kästchen den neuen Sticker. Zähle die Sticker aller Tage."
    ]
  },
  "sa39": {
    "question": "Mia hat einige Äpfel. Sie bekommt 4 dazu und gibt danach 2 weg. Nun hat sie 7. Wie viele hatte sie am Anfang? ___",
    "hints": [
      "Gehe die Geschichte rückwärts durch: Lege die weggegebenen Äpfel wieder dazu.",
      "Nimm danach die geschenkten Äpfel weg. Jetzt siehst du den Anfang."
    ]
  },
  "sa1_11": {
    "question": "Lena hat 4 Äpfel. Sie gibt 2 weg. Wie viele hat sie noch?",
    "hints": [
      "Zeichne Lenas vier Äpfel.",
      "Streiche die weggegebenen Äpfel durch und zähle die übrigen."
    ]
  },
  "sa1_17": {
    "question": "14 Kinder bilden Paare. Jedes Paar besteht aus 2 Kindern. Wie viele Paare entstehen?",
    "hints": [
      "Zeichne vierzehn Punkte für die Kinder.",
      "Kreise immer zwei Punkte gemeinsam ein. Zähle die Kreise mit je zwei Kindern."
    ]
  },
  "sa1_20": {
    "question": "Ein Regal hat Platz für 20 Bücher. 14 Plätze sind besetzt. Wie viele Bücher passen noch hinein? ___",
    "hints": [
      "Zeichne zwei Reihen mit je zehn Plätzen.",
      "Markiere vierzehn Plätze als besetzt. Zähle die freien Plätze."
    ]
  },
  "sa1_29": {
    "question": "Mia hat 13 Kastanien. Sie verschenkt 5. Wie viele Kastanien behält sie?",
    "hints": [
      "Zeichne zehn Kastanien und daneben noch drei.",
      "Streiche zuerst die drei neben der Zehnergruppe und dann noch zwei durch. Zähle den Rest."
    ]
  },
  "sa1_37": {
    "question": "Auf einem Baum sitzen 8 Vögel. 4 kommen dazu. Dann fliegen 7 weg. Wie viele Vögel bleiben?",
    "hints": [
      "Zähle zuerst die angekommenen Vögel dazu.",
      "Nimm danach die weggeflogenen Vögel von dieser neuen Anzahl weg."
    ]
  },
  "dd2": {
    "question": "Was zeigt eine Strichliste? | | | |",
    "hints": [
      "Für jedes gezählte Ding wird ein Strich gemacht.",
      "Überlege, was du herausfindest, wenn du die Striche zählst."
    ],
    "spokenPrompt": "Was zeigt eine Strichliste? Du siehst einzelne Zählstriche."
  },
  "dd4": {
    "question": "Strichliste: Hund | | | |, Katze | | |. Welches Tier wurde öfter gezählt?",
    "hints": [
      "Verbinde gedanklich immer einen Hund-Strich mit einem Katze-Strich.",
      "Bei welchem Tier bleibt ein Strich ohne Partner?"
    ],
    "spokenPrompt": "Strichliste: Hund vier Striche, Katze drei Striche. Welches Tier wurde öfter gezählt?"
  },
  "dd5": {
    "question": "Strichliste Sterne: | | |. Wie viele Sterne wurden gezählt? ___",
    "hints": [
      "Jeder Strich steht für einen Stern.",
      "Zeige von links nach rechts auf jeden Strich genau einmal."
    ],
    "spokenPrompt": "Strichliste Sterne: ein Strich, ein Strich, ein Strich. Wie viele Sterne wurden gezählt?"
  },
  "dd7": {
    "question": "Strichliste: Rot | | | | | | |, Blau | | |. Wie viele rote Stimmen gibt es mehr? ___",
    "hints": [
      "Ordne jedem blauen Strich einen roten zu.",
      "Zähle die roten Striche ohne Partner."
    ],
    "spokenPrompt": "Rot erhält sieben Stimmen, Blau drei. Wie viele rote Stimmen gibt es mehr?"
  },
  "dd9": {
    "question": "Strichliste Fahrzeuge: Velo | |, Bus | | |. Wie viele Fahrzeuge wurden zusammen gezählt? ___",
    "hints": [
      "Jeder Strich steht für ein Fahrzeug.",
      "Zähle zuerst die Velos und dann die Busse dazu."
    ],
    "spokenPrompt": "Es wurden zwei Velos und drei Busse gezählt. Wie viele Fahrzeuge sind das zusammen?"
  },
  "dd13": {
    "question": "Strichliste Wetter: Regen | | |, Sonne | | | |. Wie viele Regentage wurden gezählt? ___",
    "hints": [
      "Suche die Zeile mit Regen.",
      "Zähle nur die Striche beim Regen, nicht die bei Sonne."
    ],
    "spokenPrompt": "Regen: ein Strich, ein Strich, ein Strich. Sonne: vier Striche. Wie viele Regentage wurden gezählt?"
  },
  "dd14": {
    "question": "Strichliste Sterne: | | | | | |. Wie viele Sterne wurden gezählt?",
    "hints": [
      "Jeder Strich steht für einen Stern.",
      "Zeige nacheinander auf jeden Strich und zähle ihn nur einmal."
    ],
    "spokenPrompt": "Sterne: eine Fünfergruppe und ein einzelner Strich. Wie viele Sterne wurden gezählt?"
  },
  "dd17": {
    "question": "Gemessener Regen: Montag 3 Becher, Dienstag 5 Becher, Mittwoch 4 Becher. An welchem Tag regnete es am meisten? ___",
    "hints": [
      "Vergleiche die Regenmengen von zwei Tagen.",
      "Vergleiche die grössere davon auch mit dem dritten Tag. Schreibe den zugehörigen Tag."
    ]
  },
  "dd18": {
    "question": "Strichliste Früchte: Äpfel |||||, Orangen |||, Bananen ||||. Wie viele Früchte sind es insgesamt?",
    "hints": [
      "Zähle die Striche jeder Fruchtgruppe.",
      "Zähle die drei Gruppen zusammen, ohne eine Gruppe doppelt zu zählen."
    ],
    "spokenPrompt": "Es wurden fünf Äpfel, drei Orangen und vier Bananen gezählt. Wie viele Früchte sind es insgesamt?"
  },
  "dd19": {
    "question": "Umfrage Spiele: Fangen |||||, Verstecken ||. Jedes Kind stimmt einmal ab. Wie viele Kinder haben abgestimmt? ___",
    "hints": [
      "Zähle die Stimmen jeder Gruppe.",
      "Zähle beide Gruppen zusammen. Jede Stimme gehört zu einem Kind."
    ],
    "spokenPrompt": "Fangen erhält fünf Stimmen, Verstecken zwei. Jedes Kind stimmt einmal ab. Wie viele Kinder haben abgestimmt?"
  },
  "dd21": {
    "question": "13 Kinder stimmen einmal über ihr Lieblingstier ab. 5 wählen den Hund, alle anderen die Katze. Wie viele wählen die Katze? ___",
    "hints": [
      "Zeichne dreizehn Striche für alle Stimmen.",
      "Markiere die fünf Stimmen für den Hund. Zähle die übrigen Stimmen."
    ]
  },
  "dd28": {
    "question": "Strichliste Haustiere: Hund ||||| |, Katze ||||, Hamster ||. Wie viele Haustiere wurden insgesamt gezählt?",
    "hints": [
      "Zähle die Striche jeder Tiergruppe.",
      "Fasse zuerst zwei Gruppen zusammen und zähle die dritte dazu."
    ],
    "spokenPrompt": "Gezählt wurden sechs Hunde, vier Katzen und zwei Hamster. Wie viele Haustiere sind das insgesamt?"
  },
  "dd30": {
    "question": "10 Kinder stimmen einmal ab. Rot erhält 4 Stimmen, Blau 3. Alle übrigen Stimmen sind für Grün. Wie viele Stimmen erhält Grün? ___",
    "hints": [
      "Zähle zuerst die Stimmen für Rot und Blau zusammen.",
      "Ziehe diese Summe von allen zehn Stimmen ab."
    ]
  },
  "dd32": {
    "question": "Strichliste Bälle: | | | |. Wie viele Bälle wurden gezählt?",
    "hints": [
      "Jeder Strich steht für einen Ball.",
      "Zähle die Striche von links nach rechts genau einmal."
    ],
    "spokenPrompt": "Bälle: ein Strich, ein Strich, ein Strich, ein Strich. Wie viele Bälle wurden gezählt?"
  },
  "dd34": {
    "question": "Strichliste: Katze ||||/ |||, Hund ||||/ |. Welches Tier wurde öfter gezählt?",
    "hints": [
      "Beide Tiere haben eine Fünfergruppe.",
      "Vergleiche die Striche, die nach der Fünfergruppe übrig bleiben."
    ],
    "spokenPrompt": "Katze: eine Fünfergruppe und drei einzelne Striche. Hund: eine Fünfergruppe und ein einzelner Strich. Welches Tier wurde öfter gezählt?"
  },
  "dd38": {
    "question": "Strichliste Kinder: Jungen ||||| |||||, Mädchen ||||| ||||. Wie viele Kinder sind es insgesamt?",
    "hints": [
      "Suche zuerst die vollständigen Fünfergruppen.",
      "Zähle deren Wert zusammen und die einzelnen Striche dazu."
    ],
    "spokenPrompt": "Jungen: zwei Fünfergruppen. Mädchen: eine Fünfergruppe und vier einzelne Striche. Wie viele Kinder sind es insgesamt?"
  },
  "dd40": {
    "question": "Gezählt wurden 7 rote und 4 blaue Bälle sowie 6 grüne Bälle. Wie viele rote und blaue Bälle zusammen gibt es mehr als grüne?",
    "hints": [
      "Zähle zuerst die roten und blauen Bälle zusammen.",
      "Vergleiche diese gemeinsame Anzahl mit den grünen Bällen. Gesucht ist der Unterschied."
    ]
  },
  "dd1_17": {
    "question": "Strichliste Vögel: ||||/ |. Wie viele Vögel wurden gezählt?",
    "hints": [
      "Eine Gruppe mit dem schrägen Strich steht für fünf Vögel.",
      "Zähle von dort aus die einzelnen Striche dazu."
    ],
    "spokenPrompt": "Die Vogelliste zeigt eine Fünfergruppe und einen einzelnen Strich. Wie viele Vögel wurden gezählt?"
  },
  "dd1_19": {
    "question": "Strichliste: Hund ||||, Katze ||. Welches Tier wurde öfter gezählt?",
    "hints": [
      "Ordne jedem Katze-Strich einen Hund-Strich zu.",
      "Bei welchem Tier bleiben Striche übrig?"
    ],
    "spokenPrompt": "Hund: vier Striche. Katze: zwei Striche. Welches Tier wurde öfter gezählt?"
  },
  "dd1_22": {
    "question": "Strichliste: |||| |. Wie viele Einträge sind das? ___",
    "hints": [
      "Zähle zuerst die zusammenstehenden Striche.",
      "Zähle den einzelnen Strich rechts dazu."
    ],
    "spokenPrompt": "Vier Striche stehen zusammen. Rechts daneben steht ein einzelner Strich. Wie viele Einträge sind das zusammen?"
  },
  "dd1_26": {
    "question": "Strichliste: Äpfel ||||, Birnen |||. Wie viele Früchte sind es zusammen? ___",
    "hints": [
      "Zähle zuerst die Äpfel.",
      "Zähle die Birnen zu den Äpfeln dazu."
    ],
    "spokenPrompt": "Vier Äpfel und drei Birnen wurden gezählt. Wie viele Früchte sind es zusammen?"
  },
  "dd1_28": {
    "question": "Die gemessene Anzahl ändert sich von 3 auf 5. Wird die Anzahl grösser oder kleiner? ___",
    "hints": [
      "Stelle dir die beiden Zahlen auf einem Zahlenstrahl vor.",
      "Geht der Schritt nach rechts oder nach links? Überlege, was das für die Anzahl bedeutet."
    ]
  },
  "dd1_34": {
    "question": "Strichliste: Gruppe 1 ||||, Gruppe 2 ||. Wie viele Einträge hat Gruppe 1 mehr? ___",
    "hints": [
      "Verbinde jeden Strich von Gruppe zwei mit einem Strich von Gruppe eins.",
      "Zähle die Striche, die in Gruppe eins ohne Partner bleiben."
    ],
    "spokenPrompt": "Gruppe eins hat vier Einträge, Gruppe zwei zwei Einträge. Wie viele Einträge hat Gruppe eins mehr?"
  },
  "dd1_39": {
    "question": "Umfrage: 5 Kinder wählen Fangen, 4 Verstecken und 3 Seilspringen. Jedes Kind wählt ein Spiel. Wie viele wählen nicht Fangen?",
    "hints": [
      "Suche die beiden Spiele, die nicht Fangen sind.",
      "Zähle nur die Stimmen dieser beiden Spiele zusammen."
    ]
  },
  "dd1_42": {
    "question": "Eine Strichliste enthält 9 Einträge. 4 wurden versehentlich doppelt gezählt und werden gestrichen. Wie viele verbleibende Einträge bleiben? ___",
    "hints": [
      "Zeichne neun Striche.",
      "Streiche die vier doppelt gezählten Einträge. Zähle nur die Striche, die bleiben."
    ],
    "spokenPrompt": "Eine Strichliste enthält neun Einträge. Vier wurden versehentlich doppelt gezählt und werden gestrichen. Wie viele verbleibende Einträge bleiben?"
  },
  "dd1_45": {
    "question": "20 Kinder wählen je ein Lieblingstier. 7 wählen den Hund, 5 die Katze, alle anderen das Pferd. Wie viele wählen das Pferd?",
    "hints": [
      "Zähle zuerst die Stimmen für Hund und Katze zusammen.",
      "Ziehe diese Stimmen von der Gesamtzahl der Kinder ab."
    ]
  },
  "dd1_46": {
    "question": "Strichliste Gruppe A: ||||/ ||||/ |. Wie viele Einträge sind das? ___",
    "hints": [
      "Suche die vollständigen Fünfergruppen.",
      "Zähle diese Gruppen zusammen und ergänze die einzelnen Striche."
    ],
    "spokenPrompt": "Gruppe A hat zwei Fünfergruppen und einen einzelnen Strich. Wie viele Einträge sind das zusammen?"
  },
  "dd1_47": {
    "question": "Rot erhält 8 Stimmen, Blau 3. Zwei rote Stimmen sind nicht zählbar. Wie viele verbleibende rote Stimmen gibt es mehr als blaue?",
    "hints": [
      "Ziehe zuerst die doppelt gezählten Stimmen von den roten Stimmen ab.",
      "Vergleiche die verbleibenden roten Stimmen mit den blauen. Gesucht ist der Unterschied."
    ]
  },
  "dd1_50": {
    "question": "12 Kinder stimmen ab. 3 Stimmen sind nicht zählbar. Von den verbleibenden Stimmen sind 5 für Rot und der Rest für Blau. Wie viele verbleibende Stimmen sind für Blau? ___",
    "hints": [
      "Rechne zuerst aus, wie viele Stimmen zählbar sind.",
      "Ziehe davon die Stimmen für Rot ab."
    ]
  }
};
export function applyGermanExerciseQaCorrections(exercise: Exercise): Exercise {
 const correction = corrections[exercise.id];
 return correction ? {...exercise,...correction} : exercise;
}
