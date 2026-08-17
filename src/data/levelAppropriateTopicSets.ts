import { buildNormalizedTopicExercises } from "./normalizedTopicExercises";

const opts = (answer: string, a: string, b: string, c: string) => [answer, a, b, c];

export const grade2ScienceReplacements = {
  "uhr-viertel-gr2": buildNormalizedTopicExercises("g2uhr_norm_", {
    1: [
      { question: "Wie sagt man 7:15?", answer: "Viertel nach 7", options: opts("Viertel nach 7", "Halb 7", "Viertel vor 7", "7 Uhr"), fill: "7:15 heisst Viertel nach ___.", hint: "15 Minuten nach der vollen Stunde." },
      { question: "Wie sagt man 8:30?", answer: "Halb 9", options: opts("Halb 9", "Halb 8", "Viertel vor 9", "8 Uhr"), fill: "8:30 heisst Halb ___.", hint: "Bei halb schaut man zur nächsten Stunde." },
      { question: "Wie sagt man 6:45?", answer: "Viertel vor 7", options: opts("Viertel vor 7", "Viertel nach 6", "Halb 7", "6 Uhr"), fill: "6:45 heisst Viertel vor ___.", hint: "Noch 15 Minuten bis zur nächsten Stunde." },
      { question: "Wie viele Minuten hat eine Viertelstunde?", answer: "15 Minuten", options: opts("15 Minuten", "30 Minuten", "45 Minuten", "60 Minuten"), fill: "Eine Viertelstunde hat ___ Minuten.", hint: "Eine Stunde wird in vier gleiche Teile geteilt." },
      { question: "Wie viele Minuten hat eine halbe Stunde?", answer: "30 Minuten", options: opts("30 Minuten", "15 Minuten", "45 Minuten", "60 Minuten"), fill: "Eine halbe Stunde hat ___ Minuten.", hint: "Die Hälfte von 60 ist 30." },
    ],
    2: [
      { question: "Welche Zeit ist 20 Minuten nach 9 Uhr?", answer: "9:20", options: opts("9:20", "9:02", "10:20", "8:40"), fill: "20 Minuten nach 9 Uhr ist ___.", hint: "Die Stunde bleibt 9, die Minuten sind 20." },
      { question: "Welche Zeit ist 10 Minuten vor 12 Uhr?", answer: "11:50", options: opts("11:50", "12:10", "10:50", "11:10"), fill: "10 Minuten vor 12 Uhr ist ___.", hint: "Vor 12 Uhr ist noch Stunde 11." },
      { question: "Was kommt 15 Minuten nach 4:30?", answer: "4:45", options: opts("4:45", "4:15", "5:00", "3:45"), fill: "15 Minuten nach 4:30 ist ___.", hint: "30 + 15 = 45." },
      { question: "Was kommt 30 Minuten nach 2:15?", answer: "2:45", options: opts("2:45", "2:30", "3:15", "1:45"), fill: "30 Minuten nach 2:15 ist ___.", hint: "15 + 30 = 45." },
      { question: "Welche Uhrzeit ist früher?", answer: "7:15", options: opts("7:15", "7:45", "8:00", "8:15"), fill: "Früher als 7:45 ist ___.", hint: "15 Minuten nach 7 kommt vor 45 Minuten nach 7." },
    ],
    3: [
      { question: "Wie lange dauert es von 10:15 bis 10:45?", answer: "30 Minuten", options: opts("30 Minuten", "15 Minuten", "45 Minuten", "60 Minuten"), fill: "Von 10:15 bis 10:45 vergehen ___ Minuten.", hint: "45 - 15 = 30." },
      { question: "Lia startet um 14:30 und liest 15 Minuten. Wann ist sie fertig?", answer: "14:45", options: opts("14:45", "14:15", "15:00", "13:45"), fill: "14:30 plus 15 Minuten ist ___.", hint: "Eine Viertelstunde weiter." },
      { question: "Der Bus fährt um 8:45. Tom ist um 8:30 da. Wie lange wartet er?", answer: "15 Minuten", options: opts("15 Minuten", "30 Minuten", "45 Minuten", "5 Minuten"), fill: "Von 8:30 bis 8:45 wartet Tom ___ Minuten.", hint: "Halb bis Viertel vor." },
      { question: "Was ist eine Stunde nach 6:15?", answer: "7:15", options: opts("7:15", "6:45", "7:45", "5:15"), fill: "Eine Stunde nach 6:15 ist ___.", hint: "Die Minuten bleiben gleich." },
      { question: "Welche Zeit liegt zwischen 3:15 und 3:45?", answer: "3:30", options: opts("3:30", "3:00", "4:00", "2:30"), fill: "Zwischen 3:15 und 3:45 liegt ___.", hint: "Halb vier." },
    ],
  }),
  "physik-bewegung": buildNormalizedTopicExercises("g2bew_norm_", {
    1: [
      { question: "Was braucht ein Ball, damit er rollt?", answer: "Einen Schubs", options: opts("Einen Schubs", "Dunkelheit", "Papier", "Regen"), fill: "Ein Ball rollt, wenn er einen ___ bekommt.", hint: "Man kann ihn anstossen." },
      { question: "Was passiert, wenn du stärker schiebst?", answer: "Der Gegenstand bewegt sich schneller", options: opts("Der Gegenstand bewegt sich schneller", "Er wird unsichtbar", "Er wird kleiner", "Er friert ein"), fill: "Stärker schieben macht die Bewegung oft ___.", hint: "Mehr Kraft, mehr Bewegung." },
      { question: "Welche Bewegung passt zu einer Schaukel?", answer: "Hin und her", options: opts("Hin und her", "Nur nach oben", "Gar nicht", "Im Kreis unter dem Boden"), fill: "Eine Schaukel bewegt sich hin und ___.", hint: "Sie kommt zurück." },
      { question: "Was bremst ein Velo?", answer: "Die Bremse", options: opts("Die Bremse", "Der Sattel", "Die Klingel", "Das Licht"), fill: "Beim Velo macht die ___ langsamer.", hint: "Man drückt sie mit der Hand." },
      { question: "Was ist schneller?", answer: "Rennen", options: opts("Rennen", "Stehen", "Schlafen", "Sitzen"), fill: "Schneller als Gehen ist ___.", hint: "Dabei bewegst du dich schnell." },
    ],
    2: [
      { question: "Warum rutscht man auf Eis leichter?", answer: "Weil es wenig Reibung hat", options: opts("Weil es wenig Reibung hat", "Weil es laut ist", "Weil es dunkel ist", "Weil es weich ist"), fill: "Auf Eis gibt es wenig ___.", hint: "Reibung bremst." },
      { question: "Was hilft, eine schwere Kiste zu bewegen?", answer: "Rollen oder Räder", options: opts("Rollen oder Räder", "Mehr Farbe", "Ein Bild", "Ein Lineal"), fill: "Rollen und ___ helfen beim Bewegen.", hint: "Räder verringern Reibung." },
      { question: "Was ist eine Kraft?", answer: "Ein Ziehen oder Drücken", options: opts("Ein Ziehen oder Drücken", "Eine Farbe", "Eine Uhrzeit", "Ein Tier"), fill: "Eine Kraft ist ein Ziehen oder ___.", hint: "Du spürst sie beim Schieben." },
      { question: "Was passiert beim Bremsen?", answer: "Die Bewegung wird langsamer", options: opts("Die Bewegung wird langsamer", "Die Bewegung wird heller", "Der Weg verschwindet", "Die Uhr stoppt"), fill: "Beim Bremsen wird man ___.", hint: "Bremsen macht langsam." },
      { question: "Was bewegt sich durch Wind?", answer: "Ein Papierdrachen", options: opts("Ein Papierdrachen", "Ein Stein im Keller", "Ein geschlossener Schrank", "Ein Buch im Regal"), fill: "Wind kann einen ___ bewegen.", hint: "Er fliegt an einer Schnur." },
    ],
    3: [
      { question: "Warum rollt eine Kugel auf einer Rampe nach unten?", answer: "Die Schwerkraft zieht sie nach unten", options: opts("Die Schwerkraft zieht sie nach unten", "Sie mag Rampen", "Die Farbe hilft", "Die Luft drückt sie nach oben"), fill: "Die ___ zieht Dinge nach unten.", hint: "Alles fällt zur Erde." },
      { question: "Was bedeutet Gleichgewicht?", answer: "Etwas kippt nicht um", options: opts("Etwas kippt nicht um", "Etwas wird nass", "Etwas ist laut", "Etwas leuchtet"), fill: "Im Gleichgewicht kippt etwas nicht ___.", hint: "Es bleibt stabil." },
      { question: "Warum stoppt ein rollender Ball irgendwann?", answer: "Reibung bremst ihn", options: opts("Reibung bremst ihn", "Er wird müde", "Er zählt bis zehn", "Die Sonne hält ihn"), fill: "Ein Ball stoppt, weil ___ ihn bremst.", hint: "Boden und Luft bremsen." },
      { question: "Was macht eine Feder, wenn du sie zusammendrückst?", answer: "Sie kann zurückspringen", options: opts("Sie kann zurückspringen", "Sie wird zu Wasser", "Sie verschwindet", "Sie wird schwerelos"), fill: "Eine gedrückte Feder kann zurück___.", hint: "Sie speichert kurz Kraft." },
      { question: "Welche Bahn beschreibt ein geworfener Ball meistens?", answer: "Einen Bogen", options: opts("Einen Bogen", "Ein Quadrat", "Eine gerade Linie nach oben für immer", "Eine Schnecke"), fill: "Ein geworfener Ball fliegt oft in einem ___.", hint: "Er steigt und fällt." },
    ],
  }),
  sinne: buildNormalizedTopicExercises("g2sinne_norm_", {
    1: [
      { question: "Womit sehen wir?", answer: "Mit den Augen", options: opts("Mit den Augen", "Mit den Füssen", "Mit den Knien", "Mit den Haaren"), fill: "Wir sehen mit den ___.", hint: "Sie sind im Gesicht." },
      { question: "Womit hören wir?", answer: "Mit den Ohren", options: opts("Mit den Ohren", "Mit den Händen", "Mit dem Bauch", "Mit der Nase"), fill: "Wir hören mit den ___.", hint: "Links und rechts am Kopf." },
      { question: "Womit riechen wir?", answer: "Mit der Nase", options: opts("Mit der Nase", "Mit dem Mund", "Mit den Füssen", "Mit den Augen"), fill: "Wir riechen mit der ___.", hint: "Sie ist mitten im Gesicht." },
      { question: "Womit schmecken wir?", answer: "Mit der Zunge", options: opts("Mit der Zunge", "Mit den Ohren", "Mit den Fingern", "Mit den Augen"), fill: "Wir schmecken mit der ___.", hint: "Sie ist im Mund." },
      { question: "Womit fühlen wir Wärme und Kälte?", answer: "Mit der Haut", options: opts("Mit der Haut", "Mit den Haaren", "Mit den Zähnen", "Mit den Augen"), fill: "Wärme und Kälte fühlen wir mit der ___.", hint: "Sie bedeckt den ganzen Körper." },
    ],
    2: [
      { question: "Warum haben wir zwei Ohren?", answer: "Damit wir Richtungen besser hören", options: opts("Damit wir Richtungen besser hören", "Damit Musik lauter wird", "Damit wir besser riechen", "Damit wir schneller laufen"), fill: "Mit zwei Ohren hören wir Richtungen ___.", hint: "Links oder rechts?" },
      { question: "Was schützt das Auge?", answer: "Augenlider und Wimpern", options: opts("Augenlider und Wimpern", "Socken", "Knie", "Schuhe"), fill: "Augenlider und ___ schützen das Auge.", hint: "Sie halten Staub ab." },
      { question: "Was sagt dir dein Tastsinn?", answer: "Ob etwas rau, glatt, warm oder kalt ist", options: opts("Ob etwas rau, glatt, warm oder kalt ist", "Welche Uhrzeit es ist", "Wie weit der Mond weg ist", "Wie alt ein Baum ist"), fill: "Mit dem Tastsinn erkennst du rau, glatt, warm oder ___.", hint: "Finger helfen beim Fühlen." },
      { question: "Was hilft beim Schmecken stark mit?", answer: "Der Geruchssinn", options: opts("Der Geruchssinn", "Der Gleichgewichtssinn", "Die Haare", "Die Schuhe"), fill: "Beim Schmecken hilft auch der ___.", hint: "Bei Schnupfen schmeckt Essen oft weniger." },
      { question: "Was ist ein lautes Geräusch?", answer: "Ein Geräusch, das den Ohren wehtun kann", options: opts("Ein Geräusch, das den Ohren wehtun kann", "Ein leises Flüstern", "Eine Farbe", "Ein Geschmack"), fill: "Sehr laute Geräusche können den Ohren ___.", hint: "Darum schützt man die Ohren." },
    ],
    3: [
      { question: "Warum reagiert die Pupille auf Licht?", answer: "Sie wird kleiner oder grösser", options: opts("Sie wird kleiner oder grösser", "Sie wird zu Glas", "Sie macht Geräusche", "Sie riecht Licht"), fill: "Bei viel Licht wird die Pupille meist ___.", hint: "So kommt weniger Licht ins Auge." },
      { question: "Was ist Orientierung mit mehreren Sinnen?", answer: "Augen, Ohren und Körpergefühl arbeiten zusammen", options: opts("Augen, Ohren und Körpergefühl arbeiten zusammen", "Nur die Nase arbeitet", "Nur die Zunge arbeitet", "Alle Sinne schlafen"), fill: "Bei der Orientierung arbeiten mehrere ___ zusammen.", hint: "Du siehst, hörst und fühlst Bewegung." },
      { question: "Warum soll man nicht direkt in die Sonne schauen?", answer: "Das kann den Augen schaden", options: opts("Das kann den Augen schaden", "Dann wird es dunkel", "Dann hört man nichts", "Dann riecht man besser"), fill: "Direkt in die Sonne schauen kann den Augen ___.", hint: "Sehr helles Licht ist gefährlich." },
      { question: "Was macht das Gehirn mit Sinneseindrücken?", answer: "Es verarbeitet sie", options: opts("Es verarbeitet sie", "Es wirft sie weg", "Es macht sie nass", "Es klebt sie an die Wand"), fill: "Das Gehirn ___ Sinneseindrücke.", hint: "Es macht daraus Informationen." },
      { question: "Was ist ein Warnsignal deines Körpers?", answer: "Schmerz", options: opts("Schmerz", "Eine Farbe", "Ein Schatten", "Ein Geräusch im Radio"), fill: "___ warnt dich, wenn etwas dem Körper schadet.", hint: "Heisse Herdplatte: aua." },
    ],
  }),
  "wetter-klima": buildNormalizedTopicExercises("g2wetter_norm_", {
    1: [
      { question: "Welche Jahreszeit kommt nach dem Winter?", answer: "Frühling", options: opts("Frühling", "Herbst", "Sommer", "Winter"), fill: "Nach dem Winter kommt der ___.", hint: "Blumen beginnen zu wachsen." },
      { question: "Was misst ein Thermometer?", answer: "Temperatur", options: opts("Temperatur", "Zeit", "Gewicht", "Länge"), fill: "Ein Thermometer misst die ___.", hint: "Warm oder kalt." },
      { question: "Was fällt aus Wolken?", answer: "Regen", options: opts("Regen", "Steine", "Brot", "Papier"), fill: "Aus dunklen Wolken fällt oft ___.", hint: "Man wird nass." },
      { question: "Welche Jahreszeit ist meist am wärmsten?", answer: "Sommer", options: opts("Sommer", "Winter", "Herbst", "Frühling"), fill: "Die wärmste Jahreszeit ist oft der ___.", hint: "Badi-Zeit." },
      { question: "Was schützt bei Regen?", answer: "Regenschirm", options: opts("Regenschirm", "Sonnenbrille", "Handschuhe", "Schlitten"), fill: "Bei Regen hilft ein ___.", hint: "Man hält ihn über den Kopf." },
    ],
    2: [
      { question: "Was ist Wind?", answer: "Bewegte Luft", options: opts("Bewegte Luft", "Gefrorenes Wasser", "Ein Stein", "Eine Wolke"), fill: "Wind ist bewegte ___.", hint: "Du spürst ihn im Gesicht." },
      { question: "Was entsteht, wenn Wasser gefriert?", answer: "Eis", options: opts("Eis", "Dampf", "Sand", "Nebel"), fill: "Gefrorenes Wasser heisst ___.", hint: "Es ist kalt und fest." },
      { question: "Warum gibt es Wolken?", answer: "Wassertröpfchen sammeln sich in der Luft", options: opts("Wassertröpfchen sammeln sich in der Luft", "Berge fliegen", "Die Sonne malt sie", "Der Mond zieht sie"), fill: "Wolken bestehen aus winzigen Wasser___.", hint: "Sehr kleine Tropfen." },
      { question: "Was ist Wetter?", answer: "Wie es heute draussen ist", options: opts("Wie es heute draussen ist", "Eine Karte", "Ein Tier", "Ein Schulfach"), fill: "Wetter beschreibt, wie es ___ draussen ist.", hint: "Sonnig, regnerisch, windig." },
      { question: "Was macht Schnee bei Wärme?", answer: "Er schmilzt", options: opts("Er schmilzt", "Er wächst", "Er wird Stein", "Er leuchtet"), fill: "Bei Wärme ___ Schnee.", hint: "Aus Schnee wird Wasser." },
    ],
    3: [
      { question: "Warum ist eine Wettervorhersage nützlich?", answer: "Man kann Kleidung und Ausflüge planen", options: opts("Man kann Kleidung und Ausflüge planen", "Man kann die Zeit anhalten", "Man kann Berge verschieben", "Man kann Regen essen"), fill: "Mit einer Wettervorhersage kann man Kleidung und Ausflüge ___.", hint: "Regenjacke oder T-Shirt?" },
      { question: "Was ist der Wasserkreislauf?", answer: "Wasser verdunstet, bildet Wolken und fällt als Regen", options: opts("Wasser verdunstet, bildet Wolken und fällt als Regen", "Wasser bleibt immer im Glas", "Wasser wird zu Stein", "Wasser verschwindet für immer"), fill: "Im Wasserkreislauf verdunstet Wasser, bildet Wolken und fällt als ___.", hint: "Wasser ist unterwegs." },
      { question: "Was bedeutet wechselhaftes Wetter?", answer: "Das Wetter ändert sich oft", options: opts("Das Wetter ändert sich oft", "Es bleibt immer gleich", "Es ist immer Nacht", "Es gibt nur Schnee"), fill: "Wechselhaft heisst: Das Wetter ändert sich ___.", hint: "Sonne, Wolken, Regen wechseln." },
      { question: "Warum zieht man im Winter wärmere Kleidung an?", answer: "Weil es kälter ist", options: opts("Weil es kälter ist", "Weil es heller ist", "Weil es lauter ist", "Weil es trockener schmeckt"), fill: "Im Winter zieht man warme Kleidung an, weil es ___ ist.", hint: "Kälte braucht Schutz." },
      { question: "Was beobachtet man bei Wetterbeobachtung?", answer: "Temperatur, Wind, Wolken und Regen", options: opts("Temperatur, Wind, Wolken und Regen", "Nur Hausnummern", "Nur Bücher", "Nur Spielzeug"), fill: "Beim Wetter beobachtet man Temperatur, Wind, Wolken und ___.", hint: "Alles, was draussen passiert." },
    ],
  }),
} as const;

const energy3 = buildNormalizedTopicExercises("energie_norm_", {
  1: [
    { question: "Welche Energiequelle liefert Licht und Wärme?", answer: "Sonne", options: opts("Sonne", "Lineal", "Schere", "Papier"), fill: "Die ___ liefert Licht und Wärme.", hint: "Sie scheint am Tag." },
    { question: "Was passiert mit Eis in der Sonne?", answer: "Es schmilzt", options: opts("Es schmilzt", "Es wächst", "Es wird Stein", "Es wird Holz"), fill: "Eis ___ in der Wärme.", hint: "Aus Eis wird Wasser." },
    { question: "Was ist ein fester Stoff?", answer: "Ein Stoff mit eigener Form", options: opts("Ein Stoff mit eigener Form", "Ein Stoff, der immer fliesst", "Ein Stoff aus Licht", "Ein Geräusch"), fill: "Ein fester Stoff hat eine eigene ___.", hint: "Zum Beispiel Stein oder Holz." },
    { question: "Was ist flüssig?", answer: "Wasser", options: opts("Wasser", "Stein", "Bleistift", "Luftballon ohne Luft"), fill: "Ein Beispiel für eine Flüssigkeit ist ___.", hint: "Man kann es giessen." },
    { question: "Wofür braucht eine Lampe Energie?", answer: "Zum Leuchten", options: opts("Zum Leuchten", "Zum Schlafen", "Zum Riechen", "Zum Zählen"), fill: "Eine Lampe braucht Energie zum ___.", hint: "Dann wird es hell." },
  ],
  2: [
    { question: "Was ist Verdunstung?", answer: "Wasser wird zu Wasserdampf", options: opts("Wasser wird zu Wasserdampf", "Wasser wird Stein", "Eis wird Holz", "Luft wird Zucker"), fill: "Bei Verdunstung wird Wasser zu ___.", hint: "Wärme hilft dabei." },
    { question: "Welche Stoffeigenschaft beschreibt Glas?", answer: "Durchsichtig", options: opts("Durchsichtig", "Magnetisch", "Essbar", "Weich wie Watte"), fill: "Glas ist meist ___.", hint: "Man kann hindurchsehen." },
    { question: "Was ist erneuerbare Energie?", answer: "Energie aus Sonne, Wind oder Wasser", options: opts("Energie aus Sonne, Wind oder Wasser", "Energie aus altem Plastik", "Energie aus verbrauchten Batterien", "Energie aus Lärm"), fill: "Sonne, Wind und Wasser liefern ___ Energie.", hint: "Sie kommt immer wieder." },
    { question: "Was passiert beim Gefrieren?", answer: "Flüssiges Wasser wird fest", options: opts("Flüssiges Wasser wird fest", "Holz wird Wasser", "Licht wird Sand", "Stein wird Luft"), fill: "Beim Gefrieren wird Wasser ___.", hint: "Unter 0 Grad." },
    { question: "Was ist ein Gas?", answer: "Ein Stoff, der sich im Raum verteilt", options: opts("Ein Stoff, der sich im Raum verteilt", "Ein harter Stein", "Ein Blatt Papier", "Ein Seil"), fill: "Ein Gas verteilt sich im ___.", hint: "Luft ist ein Gasgemisch." },
  ],
  3: [
    { question: "Warum spart man Energie?", answer: "Damit Ressourcen und Umwelt geschont werden", options: opts("Damit Ressourcen und Umwelt geschont werden", "Damit es lauter wird", "Damit Wasser schwerer wird", "Damit Licht verschwindet"), fill: "Energie sparen schont Ressourcen und ___.", hint: "Gut für Natur und Klima." },
    { question: "Was ist ein Stoffkreislauf einfach erklärt?", answer: "Stoffe werden genutzt und wiederverwendet", options: opts("Stoffe werden genutzt und wiederverwendet", "Stoffe verschwinden immer", "Alles wird neu gemalt", "Nur Glas bleibt übrig"), fill: "In einem Stoffkreislauf werden Stoffe wieder___.", hint: "Recycling ist ein Beispiel." },
    { question: "Warum isoliert eine Thermosflasche?", answer: "Sie hält Wärme länger zurück", options: opts("Sie hält Wärme länger zurück", "Sie macht Tee schwerer", "Sie erzeugt Eis", "Sie färbt Wasser"), fill: "Eine Thermosflasche hält Wärme länger ___.", hint: "Getränke bleiben warm oder kalt." },
    { question: "Was ist ein Energieumwandlung?", answer: "Eine Energieform wird zu einer anderen", options: opts("Eine Energieform wird zu einer anderen", "Energie wird zu Farbe", "Energie wird gelöscht", "Energie wird nass"), fill: "Bei einer Energieumwandlung wird eine Energieform zu einer ___.", hint: "Lampe: Strom zu Licht." },
    { question: "Warum soll man Stoffe sortieren?", answer: "Damit Recycling einfacher wird", options: opts("Damit Recycling einfacher wird", "Damit alles gleich aussieht", "Damit es regnet", "Damit Papier schwerer wird"), fill: "Stoffe sortieren hilft beim ___.", hint: "Papier, Glas, Metall getrennt." },
  ],
});

const light3 = buildNormalizedTopicExercises("licht_norm_", {
  1: [
    { question: "Was ist eine Lichtquelle?", answer: "Etwas, das selbst Licht macht", options: opts("Etwas, das selbst Licht macht", "Ein dunkler Stein", "Ein leerer Teller", "Ein Schatten"), fill: "Eine Lichtquelle macht selbst ___.", hint: "Sonne und Lampe sind Beispiele." },
    { question: "Wann entsteht ein Schatten?", answer: "Wenn ein Gegenstand Licht blockiert", options: opts("Wenn ein Gegenstand Licht blockiert", "Wenn Wasser kocht", "Wenn Wind weht", "Wenn Papier raschelt"), fill: "Ein Schatten entsteht, wenn Licht ___ wird.", hint: "Etwas steht im Lichtweg." },
    { question: "Was ist dunkel?", answer: "Wenn wenig oder kein Licht da ist", options: opts("Wenn wenig oder kein Licht da ist", "Wenn es sehr laut ist", "Wenn es warm ist", "Wenn es riecht"), fill: "Dunkel ist es bei wenig ___.", hint: "Ohne Licht sieht man schlecht." },
    { question: "Was macht ein Spiegel?", answer: "Er reflektiert Licht", options: opts("Er reflektiert Licht", "Er trinkt Wasser", "Er macht Wind", "Er kocht Suppe"), fill: "Ein Spiegel ___ Licht.", hint: "Er wirft Licht zurück." },
    { question: "Welche Lichtquelle ist natürlich?", answer: "Sonne", options: opts("Sonne", "Taschenlampe", "Kerze", "Lampe"), fill: "Eine natürliche Lichtquelle ist die ___.", hint: "Sie steht am Himmel." },
  ],
  2: [
    { question: "Was bedeutet durchsichtig?", answer: "Licht kann hindurch", options: opts("Licht kann hindurch", "Alles ist schwarz", "Es ist magnetisch", "Es ist laut"), fill: "Durch Glas kann Licht ___.", hint: "Man sieht durch ein Fenster." },
    { question: "Wie entsteht ein Regenbogen?", answer: "Licht wird in Farben aufgeteilt", options: opts("Licht wird in Farben aufgeteilt", "Wolken malen Linien", "Wind färbt Luft", "Regen wird hart"), fill: "Beim Regenbogen wird Licht in ___ aufgeteilt.", hint: "Rot, Orange, Gelb..." },
    { question: "Was macht eine Lupe?", answer: "Sie vergrössert", options: opts("Sie vergrössert", "Sie verdunkelt alles", "Sie macht Wasser", "Sie misst Gewicht"), fill: "Eine Lupe ___ kleine Dinge.", hint: "Man sieht Details besser." },
    { question: "Was bedeutet undurchsichtig?", answer: "Licht kommt nicht hindurch", options: opts("Licht kommt nicht hindurch", "Alles leuchtet", "Es riecht süss", "Es ist immer flüssig"), fill: "Durch Holz kommt Licht nicht ___.", hint: "Holz blockiert Licht." },
    { question: "Warum sieht man Farben?", answer: "Gegenstände werfen bestimmte Lichtfarben zurück", options: opts("Gegenstände werfen bestimmte Lichtfarben zurück", "Farben machen Geräusche", "Farben sind schwer", "Farben haben Wind"), fill: "Gegenstände werfen bestimmte Lichtfarben ___.", hint: "Eine rote Tomate reflektiert rot." },
  ],
  3: [
    { question: "Warum ist ein Schatten morgens oft lang?", answer: "Die Sonne steht tief", options: opts("Die Sonne steht tief", "Die Erde ist kleiner", "Licht wird schwer", "Der Boden leuchtet"), fill: "Morgens steht die Sonne tief, darum ist der Schatten oft ___.", hint: "Flacher Lichtwinkel." },
    { question: "Was passiert bei Brechung?", answer: "Licht ändert seine Richtung", options: opts("Licht ändert seine Richtung", "Licht wird zu Stein", "Licht wird kalt", "Licht verschwindet immer"), fill: "Bei Brechung ändert Licht seine ___.", hint: "Zum Beispiel im Wasser." },
    { question: "Warum blendet Schnee in der Sonne?", answer: "Schnee reflektiert viel Licht", options: opts("Schnee reflektiert viel Licht", "Schnee macht Geräusche", "Schnee ist magnetisch", "Schnee wird Glas"), fill: "Schnee ___ viel Licht.", hint: "Darum hilft eine Sonnenbrille." },
    { question: "Was ist ein Experiment mit Licht?", answer: "Man prüft, was Licht mit Materialien macht", options: opts("Man prüft, was Licht mit Materialien macht", "Man zählt Wolken", "Man misst Brot", "Man hört Steine"), fill: "In einem Lichtexperiment prüfst du Licht und ___.", hint: "Durchsichtig, undurchsichtig, spiegelnd." },
    { question: "Warum wird es hinter einem Gegenstand dunkler?", answer: "Der Gegenstand hält Licht ab", options: opts("Der Gegenstand hält Licht ab", "Die Luft wird schwer", "Der Boden schläft", "Die Sonne zählt"), fill: "Hinter einem Gegenstand wird es dunkler, weil er Licht ___.", hint: "So entsteht Schatten." },
  ],
});

const map3 = buildNormalizedTopicExercises("karte_norm_", {
  1: [
    { question: "Was zeigt eine Karte?", answer: "Ein Gebiet von oben und verkleinert", options: opts("Ein Gebiet von oben und verkleinert", "Nur ein Tier", "Nur Musik", "Eine Rechnung"), fill: "Eine Karte zeigt ein Gebiet ___.", hint: "Wie aus der Vogelperspektive." },
    { question: "Wohin zeigt ein Kompass?", answer: "Nach Norden", options: opts("Nach Norden", "Immer zur Schule", "Nach unten", "Zum Mond"), fill: "Ein Kompass zeigt nach ___.", hint: "N steht dafür." },
    { question: "Was ist eine Legende auf der Karte?", answer: "Eine Erklärung der Zeichen", options: opts("Eine Erklärung der Zeichen", "Eine Geschichte", "Ein Spiel", "Ein Massband"), fill: "Die Legende erklärt die ___ auf der Karte.", hint: "Symbole und Farben." },
    { question: "Welche Richtung ist auf Karten meistens oben?", answer: "Norden", options: opts("Norden", "Süden", "Westen", "Osten"), fill: "Auf Karten ist meistens ___ oben.", hint: "Standard bei Karten." },
    { question: "Was zeigt ein Ortsplan?", answer: "Strassen und wichtige Orte", options: opts("Strassen und wichtige Orte", "Nur Sterne", "Nur Tiere", "Nur das Wetter"), fill: "Ein Ortsplan zeigt Strassen und wichtige ___.", hint: "Schule, Bahnhof, Park." },
  ],
  2: [
    { question: "Was bedeutet Massstab?", answer: "Die Karte ist kleiner als die Wirklichkeit", options: opts("Die Karte ist kleiner als die Wirklichkeit", "Die Karte ist lauter", "Die Karte ist wärmer", "Die Karte ist schwerelos"), fill: "Der Massstab zeigt: Karte und Wirklichkeit sind unterschiedlich ___.", hint: "Zum Beispiel 1 cm = 100 m." },
    { question: "Was hilft beim Orientieren draussen?", answer: "Karte, Kompass und Wegzeichen", options: opts("Karte, Kompass und Wegzeichen", "Nur ein Kissen", "Nur ein Löffel", "Nur ein Ball"), fill: "Karte, Kompass und ___ helfen beim Orientieren.", hint: "Schilder und Markierungen." },
    { question: "Was zeigen Höhenlinien?", answer: "Wie hoch oder steil ein Gelände ist", options: opts("Wie hoch oder steil ein Gelände ist", "Wie warm Wasser ist", "Wie laut Wind ist", "Wie alt Papier ist"), fill: "Höhenlinien zeigen Höhen im ___.", hint: "Berge und Täler." },
    { question: "Was ist eine politische Karte?", answer: "Sie zeigt Länder, Kantone oder Grenzen", options: opts("Sie zeigt Länder, Kantone oder Grenzen", "Sie zeigt nur Tiere", "Sie zeigt Geräusche", "Sie zeigt Rezepte"), fill: "Eine politische Karte zeigt Länder und ___.", hint: "Grenzen sind wichtig." },
    { question: "Was ist eine topografische Karte?", answer: "Sie zeigt Gelände, Gewässer und Wege", options: opts("Sie zeigt Gelände, Gewässer und Wege", "Sie zeigt nur Namen", "Sie zeigt nur Essen", "Sie zeigt nur Bücher"), fill: "Eine topografische Karte zeigt Gelände, Gewässer und ___.", hint: "Für Wanderungen nützlich." },
  ],
  3: [
    { question: "Warum ist ein Massstab nützlich?", answer: "Man kann echte Entfernungen abschätzen", options: opts("Man kann echte Entfernungen abschätzen", "Man kann Regen stoppen", "Man kann Farben hören", "Man kann Berge zählen ohne Karte"), fill: "Mit dem Massstab kann man Entfernungen ___.", hint: "1 cm auf Karte entspricht echter Strecke." },
    { question: "Was bedeutet Südwesten?", answer: "Zwischen Süden und Westen", options: opts("Zwischen Süden und Westen", "Zwischen Norden und Osten", "Direkt oben", "Direkt unten"), fill: "Südwesten liegt zwischen Süden und ___.", hint: "Eine Zwischenrichtung." },
    { question: "Was sind Koordinaten einfach gesagt?", answer: "Zahlen oder Angaben für einen genauen Ort", options: opts("Zahlen oder Angaben für einen genauen Ort", "Eine Art Wetter", "Eine Farbe", "Ein Tiername"), fill: "Koordinaten zeigen einen genauen ___.", hint: "Man findet Punkte damit." },
    { question: "Warum braucht eine Karte Symbole?", answer: "Damit viele Informationen Platz haben", options: opts("Damit viele Informationen Platz haben", "Damit sie schwerer wird", "Damit sie regnet", "Damit sie singt"), fill: "Kartensymbole sparen ___ und zeigen Infos.", hint: "Ein kleines Zeichen für Bahnhof oder Wald." },
    { question: "Was muss man beim Kartenlesen zuerst prüfen?", answer: "Richtung, Legende und Massstab", options: opts("Richtung, Legende und Massstab", "Preis, Farbe und Gewicht", "Geruch, Klang und Alter", "Nur die Überschrift"), fill: "Beim Kartenlesen helfen Richtung, Legende und ___.", hint: "So liest du die Karte richtig." },
  ],
});

export const grade3ScienceReplacements = {
  "energie-stoffe": energy3,
  "licht-optik": light3,
  "raeume-karte": map3,
} as const;

export const grade4NTReplacements = {
  "energie-stoffe": energy3,
  "licht-optik": light3,
} as const;

export const grade4RZGReplacements = {
  "raeume-karte": map3,
} as const;

export const grade5NTReplacements = {
  weltall: buildNormalizedTopicExercises("g5weltall_norm_", {
    1: [
      { question: "Welcher Stern ist uns am nächsten?", answer: "Sonne", options: opts("Sonne", "Sirius", "Polarstern", "Mond"), fill: "Der nächste Stern für die Erde ist die ___.", hint: "Sie gibt uns Licht und Wärme." },
      { question: "Was kreist um die Erde?", answer: "Mond", options: opts("Mond", "Mars", "Jupiter", "Sonne"), fill: "Der ___ kreist um die Erde.", hint: "Man sieht ihn oft nachts." },
      { question: "Wie nennt man die Bahn eines Planeten?", answer: "Umlaufbahn", options: opts("Umlaufbahn", "Fussweg", "Wolke", "Küste"), fill: "Die Bahn eines Planeten heisst ___.", hint: "Planeten bewegen sich um die Sonne." },
      { question: "Auf welchem Planeten leben wir?", answer: "Erde", options: opts("Erde", "Mars", "Venus", "Saturn"), fill: "Wir leben auf dem Planeten ___.", hint: "Der blaue Planet." },
      { question: "Was ist ein Planet?", answer: "Ein Himmelskörper, der um einen Stern kreist", options: opts("Ein Himmelskörper, der um einen Stern kreist", "Ein kleines Tier", "Eine Wetterart", "Ein Werkzeug"), fill: "Ein Planet kreist um einen ___.", hint: "Unsere Planeten kreisen um die Sonne." },
    ],
    2: [
      { question: "Warum gibt es Tag und Nacht?", answer: "Die Erde dreht sich um sich selbst", options: opts("Die Erde dreht sich um sich selbst", "Die Sonne geht aus", "Der Mond schiebt die Sonne weg", "Wolken machen Nacht"), fill: "Tag und Nacht entstehen durch die Drehung der ___.", hint: "Eine Drehung dauert etwa 24 Stunden." },
      { question: "Warum gibt es Jahreszeiten?", answer: "Die Erdachse ist geneigt", options: opts("Die Erdachse ist geneigt", "Die Erde wird grösser", "Der Mond ändert Farbe", "Die Sterne bewegen sich schneller"), fill: "Jahreszeiten entstehen, weil die Erdachse ___ ist.", hint: "Die Sonne steht unterschiedlich hoch." },
      { question: "Was ist eine Mondphase?", answer: "Die sichtbare Form des Mondes", options: opts("Die sichtbare Form des Mondes", "Ein Mondgeräusch", "Ein Planet", "Ein Sternbild"), fill: "Eine Mondphase zeigt die sichtbare ___ des Mondes.", hint: "Vollmond, Halbmond, Neumond." },
      { question: "Was ist ein Teleskop?", answer: "Ein Gerät zum Beobachten weit entfernter Himmelskörper", options: opts("Ein Gerät zum Beobachten weit entfernter Himmelskörper", "Ein Kochtopf", "Eine Uhr", "Ein Kompass"), fill: "Mit einem ___ beobachtet man Sterne und Planeten.", hint: "Es vergrössert weit Entferntes." },
      { question: "Was ist ein Asteroid?", answer: "Ein kleiner felsiger Himmelskörper", options: opts("Ein kleiner felsiger Himmelskörper", "Ein Gas in der Luft", "Eine Wolke", "Ein Kalender"), fill: "Ein Asteroid ist ein kleiner felsiger ___.", hint: "Kleiner als ein Planet." },
    ],
    3: [
      { question: "Warum bleibt ein Planet auf seiner Bahn?", answer: "Die Schwerkraft hält ihn", options: opts("Die Schwerkraft hält ihn", "Er klebt an Licht", "Er wird gezogen von Wind", "Er hat Räder"), fill: "Die ___ hält Planeten auf ihren Bahnen.", hint: "Gravitation zieht Massen an." },
      { question: "Was ist eine Sonnenfinsternis?", answer: "Der Mond steht zwischen Sonne und Erde", options: opts("Der Mond steht zwischen Sonne und Erde", "Die Erde steht zwischen Sonne und Mond", "Die Sonne wird ausgeschaltet", "Mars verdeckt die Erde"), fill: "Bei einer Sonnenfinsternis steht der ___ zwischen Sonne und Erde.", hint: "Der Mond wirft Schatten auf die Erde." },
      { question: "Was ist ein Lichtjahr?", answer: "Die Strecke, die Licht in einem Jahr zurücklegt", options: opts("Die Strecke, die Licht in einem Jahr zurücklegt", "Ein Jahr mit viel Sonne", "Eine Mondphase", "Eine Uhrzeit"), fill: "Ein Lichtjahr ist eine sehr grosse ___.", hint: "Es misst Entfernung, nicht Zeit im Alltag." },
      { question: "Warum wirken Sterne klein?", answer: "Sie sind sehr weit entfernt", options: opts("Sie sind sehr weit entfernt", "Sie sind alle winzig", "Sie sind gemalt", "Sie leuchten nur am Rand"), fill: "Sterne wirken klein, weil sie sehr weit ___ sind.", hint: "Viele Sterne sind riesig." },
      { question: "Was ist das Sonnensystem?", answer: "Sonne, Planeten und weitere Himmelskörper", options: opts("Sonne, Planeten und weitere Himmelskörper", "Nur die Erde", "Nur der Mond", "Alle Wolken"), fill: "Zum Sonnensystem gehören Sonne, Planeten und weitere ___.", hint: "Auch Monde, Asteroiden und Kometen." },
    ],
  }),
  "strom-elektrizitaet": buildNormalizedTopicExercises("g5strom_norm_", {
    1: [
      { question: "Was braucht eine Lampe zum Leuchten?", answer: "Strom", options: opts("Strom", "Sand", "Papier", "Wasser im Kabel"), fill: "Eine Lampe braucht ___ zum Leuchten.", hint: "Er fliesst im Stromkreis." },
      { question: "Was liefert eine Batterie?", answer: "Elektrische Energie", options: opts("Elektrische Energie", "Wind", "Holz", "Salz"), fill: "Eine Batterie liefert elektrische ___.", hint: "Damit leuchten Taschenlampen." },
      { question: "Wann fliesst Strom?", answer: "Wenn der Stromkreis geschlossen ist", options: opts("Wenn der Stromkreis geschlossen ist", "Wenn der Kreis offen ist", "Wenn kein Kabel da ist", "Wenn die Lampe fehlt"), fill: "Strom fliesst in einem geschlossenen ___.", hint: "Der Weg muss vollständig sein." },
      { question: "Was ist ein Schalter?", answer: "Er öffnet oder schliesst einen Stromkreis", options: opts("Er öffnet oder schliesst einen Stromkreis", "Er misst Wind", "Er speichert Wasser", "Er malt Licht"), fill: "Ein Schalter öffnet oder schliesst den ___.", hint: "An oder aus." },
      { question: "Welches Material leitet Strom gut?", answer: "Kupfer", options: opts("Kupfer", "Gummi", "Holz", "Papier"), fill: "Kabel enthalten oft ___, weil es gut leitet.", hint: "Ein Metall." },
    ],
    2: [
      { question: "Was ist ein Isolator?", answer: "Ein Material, das Strom schlecht leitet", options: opts("Ein Material, das Strom schlecht leitet", "Ein starker Leiter", "Eine Batterie", "Eine Lampe"), fill: "Gummi ist ein ___, weil es Strom schlecht leitet.", hint: "Schützt vor Strom." },
      { question: "Was passiert bei einem Kurzschluss?", answer: "Strom nimmt einen zu kurzen Weg", options: opts("Strom nimmt einen zu kurzen Weg", "Die Batterie wird voller", "Die Lampe wird zu Wasser", "Der Schalter verschwindet"), fill: "Ein Kurzschluss kann gefährlich sein, weil zu viel ___ fliesst.", hint: "Darum gibt es Sicherungen." },
      { question: "Was ist eine Reihenschaltung?", answer: "Bauteile sind hintereinander verbunden", options: opts("Bauteile sind hintereinander verbunden", "Alles ist getrennt", "Nur ein Kabel liegt offen", "Bauteile liegen ohne Strom"), fill: "In einer Reihenschaltung liegen Bauteile ___.", hint: "Wie Perlen auf einer Schnur." },
      { question: "Was ist eine Parallelschaltung?", answer: "Der Strom hat mehrere Wege", options: opts("Der Strom hat mehrere Wege", "Der Strom hat keinen Weg", "Alles ist aus Papier", "Nur eine Batterie ohne Kabel"), fill: "Bei der Parallelschaltung hat Strom mehrere ___.", hint: "Fällt eine Lampe aus, können andere weiter leuchten." },
      { question: "Was misst Volt?", answer: "Elektrische Spannung", options: opts("Elektrische Spannung", "Länge", "Temperatur", "Gewicht"), fill: "Volt ist die Einheit der elektrischen ___.", hint: "Batterien haben z.B. 1,5 V." },
    ],
    3: [
      { question: "Warum sind Sicherungen wichtig?", answer: "Sie unterbrechen bei zu viel Strom", options: opts("Sie unterbrechen bei zu viel Strom", "Sie machen Kabel länger", "Sie erzeugen Wasser", "Sie färben Licht"), fill: "Eine Sicherung unterbricht den Stromkreis bei zu viel ___.", hint: "Schutz vor Überhitzung." },
      { question: "Was ist Widerstand?", answer: "Er erschwert den Stromfluss", options: opts("Er erschwert den Stromfluss", "Er macht immer mehr Strom", "Er ist eine Batterie", "Er misst Zeit"), fill: "Widerstand erschwert den ___.", hint: "Einheit: Ohm." },
      { question: "Was macht ein Generator?", answer: "Er erzeugt elektrische Energie durch Bewegung", options: opts("Er erzeugt elektrische Energie durch Bewegung", "Er speichert Wasser", "Er misst Schatten", "Er kühlt Schnee"), fill: "Ein Generator wandelt Bewegung in elektrische ___ um.", hint: "Zum Beispiel im Wasserkraftwerk." },
      { question: "Was ist Stromstärke?", answer: "Wie viel Strom fliesst", options: opts("Wie viel Strom fliesst", "Wie hell Papier ist", "Wie lang ein Kabel aussieht", "Wie kalt Licht ist"), fill: "Die Stromstärke beschreibt, wie viel Strom ___.", hint: "Einheit: Ampere." },
      { question: "Warum soll man nicht an Steckdosen spielen?", answer: "Strom kann gefährlich sein", options: opts("Strom kann gefährlich sein", "Steckdosen sind weich", "Strom ist essbar", "Kabel sind Spielzeug"), fill: "Steckdosen sind kein Spielzeug, weil Strom ___ sein kann.", hint: "Sicherheit zuerst." },
    ],
  }),
} as const;

export const grade5RZGReplacements = {
  "geschichte-zeit": buildNormalizedTopicExercises("g5zeit_norm_", {
    1: [
      { question: "Was ist eine Zeitlinie?", answer: "Eine geordnete Darstellung von Ereignissen", options: opts("Eine geordnete Darstellung von Ereignissen", "Ein Wetterbericht", "Eine Landkarte ohne Orte", "Ein Rechenweg"), fill: "Eine Zeitlinie ordnet Ereignisse nach der ___.", hint: "Was war zuerst, was danach?" },
      { question: "Was bedeutet Vergangenheit?", answer: "Etwas ist schon passiert", options: opts("Etwas ist schon passiert", "Etwas passiert morgen", "Etwas ist nie passiert", "Etwas ist ein Ort"), fill: "Vergangenheit bedeutet: Es ist schon ___.", hint: "Gestern ist Vergangenheit." },
      { question: "Was ist eine Quelle in Geschichte?", answer: "Ein Hinweis aus der Vergangenheit", options: opts("Ein Hinweis aus der Vergangenheit", "Ein Brunnen im Wald", "Eine Rechenaufgabe", "Ein Stern"), fill: "Eine historische Quelle gibt Hinweise aus der ___.", hint: "Brief, Foto, Gegenstand." },
      { question: "Was zeigt ein Jahr?", answer: "Einen Zeitpunkt in der Zeit", options: opts("Einen Zeitpunkt in der Zeit", "Eine Himmelsrichtung", "Eine Farbe", "Ein Gewicht"), fill: "Ein Jahr hilft, Ereignisse zeitlich zu ___.", hint: "Zum Beispiel 1291." },
      { question: "Was ist eine Epoche?", answer: "Ein längerer Abschnitt der Geschichte", options: opts("Ein längerer Abschnitt der Geschichte", "Ein kleines Spiel", "Ein Messgerät", "Ein Tier"), fill: "Eine Epoche ist ein Abschnitt der ___.", hint: "Zum Beispiel Mittelalter." },
    ],
    2: [
      { question: "Warum nutzt man Quellen?", answer: "Um herauszufinden, was früher passiert ist", options: opts("Um herauszufinden, was früher passiert ist", "Um das Wetter zu ändern", "Um Zahlen zu verstecken", "Um Karten zu falten"), fill: "Quellen helfen zu verstehen, was früher ___ ist.", hint: "Historiker prüfen Quellen." },
      { question: "Was ist eine Primärquelle?", answer: "Ein Original aus der untersuchten Zeit", options: opts("Ein Original aus der untersuchten Zeit", "Ein modernes Lernvideo", "Eine Vermutung", "Ein Witz"), fill: "Eine Primärquelle stammt direkt aus der untersuchten ___.", hint: "Zum Beispiel ein alter Brief." },
      { question: "Was ist eine Sekundärquelle?", answer: "Eine spätere Darstellung über die Vergangenheit", options: opts("Eine spätere Darstellung über die Vergangenheit", "Ein Originalbrief", "Ein altes Werkzeug", "Ein Fundstück"), fill: "Eine Sekundärquelle wurde später über die Vergangenheit ___.", hint: "Zum Beispiel ein Schulbuchtext." },
      { question: "Was bedeutet chronologisch?", answer: "In zeitlicher Reihenfolge", options: opts("In zeitlicher Reihenfolge", "Nach Farben sortiert", "Nach Grösse sortiert", "Ohne Ordnung"), fill: "Chronologisch heisst: in zeitlicher ___.", hint: "Erst früher, dann später." },
      { question: "Warum vergleicht man früher und heute?", answer: "Um Veränderungen zu erkennen", options: opts("Um Veränderungen zu erkennen", "Um Uhren zu bauen", "Um Licht zu messen", "Um Wolken zu zählen"), fill: "Der Vergleich früher/heute zeigt ___.", hint: "Was ist gleich, was anders?" },
    ],
    3: [
      { question: "Warum können Quellen unterschiedlich berichten?", answer: "Menschen erleben Dinge verschieden", options: opts("Menschen erleben Dinge verschieden", "Papier kann sprechen", "Jahre verschwinden", "Fotos lügen immer"), fill: "Quellen können verschieden sein, weil Menschen Dinge verschieden ___.", hint: "Perspektive ist wichtig." },
      { question: "Was ist Ursache und Folge?", answer: "Warum etwas passiert und was danach geschieht", options: opts("Warum etwas passiert und was danach geschieht", "Nur eine Jahreszahl", "Ein Kartenzeichen", "Eine Farbe"), fill: "Ursache und Folge erklären warum etwas passiert und was danach ___.", hint: "Weil... darum..." },
      { question: "Warum sind Jahreszahlen allein nicht genug?", answer: "Man muss auch Zusammenhänge verstehen", options: opts("Man muss auch Zusammenhänge verstehen", "Jahreszahlen sind falsch", "Geschichte hat keine Zeit", "Quellen sind unnötig"), fill: "Neben Jahreszahlen braucht man ___.", hint: "Was hängt womit zusammen?" },
      { question: "Was ist ein historischer Wandel?", answer: "Eine Veränderung über längere Zeit", options: opts("Eine Veränderung über längere Zeit", "Ein kurzer Spaziergang", "Eine Wetterwolke", "Ein Rechenzeichen"), fill: "Historischer Wandel ist Veränderung über längere ___.", hint: "Zum Beispiel Schule früher und heute." },
      { question: "Was macht eine gute historische Frage?", answer: "Sie fragt nach Gründen, Folgen oder Unterschieden", options: opts("Sie fragt nach Gründen, Folgen oder Unterschieden", "Sie hat keine Antwort", "Sie fragt nur nach Farbe", "Sie ist eine Rechnung"), fill: "Gute historische Fragen fragen nach Gründen, Folgen oder ___.", hint: "Mehr als nur ein Datum." },
    ],
  }),
} as const;

export const grade6NTReplacements = grade5NTReplacements;
export const grade6RZGReplacements = grade5RZGReplacements;

