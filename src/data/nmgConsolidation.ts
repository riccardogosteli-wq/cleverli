import type { Exercise, Topic } from "@/types/exercise";

type Fact = {
  question: string;
  answer: string;
  distractors: [string, string, string];
  fill: string;
  fillAnswer: string;
  hint: string;
};

type BalancedTopic = {
  title: string;
  emoji: string;
  code: string;
  facts: Record<1 | 2 | 3, [Fact, Fact]>;
};

const fact = (question: string, answer: string, distractors: [string, string, string], fill: string, fillAnswer: string, hint: string): Fact => ({
  question, answer, distractors, fill, fillAnswer, hint,
});

const BALANCED_TOPICS: Record<string, BalancedTopic> = {
  "1/sinne": {
    title: "Bedürfnisse & Wünsche", emoji: "🛍️", code: "NMG.6.5",
    facts: {
      1: [
        fact("Was brauchst du wirklich zum Trinken?", "Wasser", ["Ein neues Spiel", "Ein Ballon", "Ein Sticker"], "Zum Trinken brauche ich ___.", "Wasser", "Denke an etwas, das dein Körper täglich braucht."),
        fact("Was ist ein Wunsch?", "Etwas, das schön wäre", ["Etwas, das jeder zum Leben braucht", "Eine Schulregel", "Eine Jahreszeit"], "Ein Spielzeug kann ein ___ sein.", "Wunsch", "Wünsche sind schön, aber nicht immer notwendig."),
      ],
      2: [
        fact("Was hilft vor dem Einkaufen?", "Eine Einkaufsliste", ["Alles sofort nehmen", "Nur die Verpackung ansehen", "Nichts vergleichen"], "Eine ___ hilft, nur Benötigtes einzukaufen.", "Einkaufsliste", "Plane zuerst, was wirklich gebraucht wird."),
        fact("Warum vergleicht man zwei Produkte?", "Um passend auszuwählen", ["Damit beide teurer werden", "Damit man mehr wegwirft", "Damit die Werbung gewinnt"], "Vor dem Kauf kann man Produkte ___.", "vergleichen", "Preis, Menge und Nutzen können verschieden sein."),
      ],
      3: [
        fact("Was ist sparsam?", "Vorhandene Sachen lange nutzen", ["Brauchbares wegwerfen", "Immer das Neuste kaufen", "Mehr kaufen als nötig"], "Wer Dinge lange nutzt, handelt ___.", "sparsam", "Gutes muss nicht sofort ersetzt werden."),
        fact("Was kann Werbung bewirken?", "Sie kann Wünsche wecken", ["Sie bestimmt jedes Bedürfnis", "Sie macht alles kostenlos", "Sie ersetzt eine Einkaufsliste"], "Werbung kann neue ___ wecken.", "Wünsche", "Überlege, ob du etwas brauchst oder nur haben möchtest."),
      ],
    },
  },
  "1/wetter-klima": {
    title: "Unser Quartier", emoji: "🏘️", code: "NMG.8.1",
    facts: {
      1: [
        fact("Wo können Kinder sicher spielen?", "Auf dem Spielplatz", ["Auf der Fahrbahn", "Auf dem Bahngleis", "In einer Baustelle"], "Im Quartier spielen Kinder sicher auf dem ___.", "Spielplatz", "Suche einen geschützten Ort für Kinder."),
        fact("Wo leiht man Bücher aus?", "In der Bibliothek", ["In der Garage", "An der Tankstelle", "Auf dem Parkplatz"], "Bücher leiht man in der ___ aus.", "Bibliothek", "Dort stehen viele Bücher zum Ausleihen."),
      ],
      2: [
        fact("Wozu dient ein Fussweg?", "Zum sicheren Gehen", ["Zum schnellen Autofahren", "Zum Parkieren", "Zum Lagern von Abfall"], "Ein ___ ist für Menschen zu Fuss gedacht.", "Fussweg", "Achte darauf, wer den Weg benutzt."),
        fact("Was ist ein Merkpunkt im Quartier?", "Ein gut erkennbarer Ort", ["Ein unsichtbarer Weg", "Eine erfundene Strasse", "Ein zufälliges Geräusch"], "Ein auffälliger Brunnen kann ein ___ sein.", "Merkpunkt", "Merkpunkte helfen bei der Orientierung."),
      ],
      3: [
        fact("Was macht einen Platz angenehm?", "Bäume, Bänke und sichere Wege", ["Viele schnelle Autos", "Kaputte Lampen", "Abgesperrte Wege"], "Bäume geben auf einem Platz ___.", "Schatten", "Denke an einen Platz, auf dem du dich wohlfühlst."),
        fact("Was hilft dir, einen Weg wiederzufinden?", "Gut sichtbare Orte", ["Geschlossene Augen", "Ein unbekanntes Geräusch", "Eine erfundene Strasse"], "Ein Brunnen kann beim Finden des Weges ___.", "helfen", "Auffällige Orte kann man sich gut merken."),
      ],
    },
  },
  "3/energie-stoffe": {
    title: "Arbeit & Berufe", emoji: "🧰", code: "NMG.6.2",
    facts: {
      1: [
        fact("Wer hilft kranken Menschen?", "Eine Pflegefachperson", ["Ein Kaminfeger", "Eine Gärtnerin", "Ein Lokführer"], "Eine ___ betreut kranke Menschen.", "Pflegefachperson", "Denke an Berufe im Spital."),
        fact("Was gehört zu jedem Beruf?", "Aufgaben und Fähigkeiten", ["Immer dieselbe Kleidung", "Nur Ferien", "Keine Verantwortung"], "Für einen Beruf braucht man passende ___.", "Fähigkeiten", "Menschen lernen, was sie für ihre Aufgaben benötigen."),
      ],
      2: [
        fact("Warum arbeiten Berufe zusammen?", "Weil Aufgaben sich ergänzen", ["Damit niemand planen muss", "Damit alle dasselbe tun", "Damit Arbeit länger dauert"], "Im Team können sich verschiedene Berufe ___.", "ergänzen", "Ein Haus entsteht durch viele Fachpersonen."),
        fact("Was ist unbezahlte Arbeit?", "Eine wichtige Tätigkeit ohne Lohn", ["Arbeit ohne Nutzen", "Nur ein Hobby", "Eine verbotene Aufgabe"], "Hausarbeit kann ___ Arbeit sein.", "unbezahlte", "Auch Betreuung und Hausarbeit brauchen Zeit und Können."),
      ],
      3: [
        fact("Was verändert viele Berufe?", "Neue Technik", ["Nur das Wetter", "Die Jahreszeit", "Die Schuhgrösse"], "Neue ___ kann Arbeitsabläufe verändern.", "Technik", "Werkzeuge und Computer schaffen neue Möglichkeiten."),
        fact("Woran erkennt man passende Berufsfähigkeiten?", "An den Aufgaben des Berufs", ["Nur am Berufsnamen", "Nur am Arbeitsort", "Nur an der Kleidung"], "Berufliche Anforderungen ergeben sich aus den ___.", "Aufgaben", "Vergleiche Tätigkeiten mit nötigem Wissen und Können."),
      ],
    },
  },
  "3/licht-optik": {
    title: "Konsum & Geld", emoji: "🪙", code: "NMG.6.5",
    facts: {
      1: [
        fact("Wofür braucht man Geld?", "Zum Bezahlen von Gütern und Leistungen", ["Zum Messen der Zeit", "Zum Ändern des Wetters", "Zum Lesen von Karten"], "Mit Geld kann man Waren und ___ bezahlen.", "Dienstleistungen", "Auch eine Busfahrt oder ein Haarschnitt kostet Geld."),
        fact("Was zeigt ein Preis?", "Wie viel etwas kostet", ["Wie schwer etwas ist", "Wie alt jemand ist", "Wie lange ein Weg ist"], "Der ___ zeigt die Kosten eines Produkts.", "Preis", "Achte auf die Zahl beim Produkt."),
      ],
      2: [
        fact("Was hilft beim Sparen?", "Ein Teil des Geldes wird zurückgelegt", ["Alles sofort ausgeben", "Nur Werbung beachten", "Mehr kaufen als geplant"], "Beim Sparen wird Geld ___.", "zurückgelegt", "Nicht jeder Franken muss sofort ausgegeben werden."),
        fact("Warum vergleicht man Preise?", "Damit man bewusst entscheiden kann", ["Damit alles gleich teuer wird", "Damit Verpackungen grösser werden", "Damit man nichts rechnen muss"], "Ein Preisvergleich unterstützt eine bewusste ___.", "Entscheidung", "Vergleiche auch Menge und Qualität."),
      ],
      3: [
        fact("Was bedeutet ein begrenztes Budget?", "Man kann nicht alles kaufen", ["Geld ist unbegrenzt", "Jeder Wunsch wird erfüllt", "Preise spielen keine Rolle"], "Bei einem Budget muss man ___.", "priorisieren", "Entscheide, was zuerst wichtig ist."),
        fact("Was ist eine Kaufentscheidung?", "Eine begründete Wahl für oder gegen einen Kauf", ["Ein zufälliger Griff", "Eine Werbeaussage", "Eine Preisetikette"], "Bedarf, Preis und Qualität beeinflussen die ___.", "Kaufentscheidung", "Mehrere Kriterien können wichtig sein."),
      ],
    },
  },
  "4/koerper-sinne-4": {
    title: "Werte & Zusammenleben", emoji: "🤝", code: "NMG.11.1",
    facts: {
      1: [
        fact("Was zeigt Respekt?", "Anderen zuhören", ["Andere auslachen", "Immer unterbrechen", "Regeln absichtlich brechen"], "Wer aufmerksam zuhört, zeigt ___.", "Respekt", "Behandle andere so, wie du behandelt werden möchtest."),
        fact("Was hilft bei einem Streit?", "Ruhig miteinander sprechen", ["Lauter schreien", "Gerüchte erzählen", "Nicht mehr zuhören"], "Bei einem Konflikt hilft ein ruhiges ___.", "Gespräch", "Beide Seiten sollen erzählen dürfen."),
      ],
      2: [
        fact("Warum braucht eine Gruppe Regeln?", "Damit Zusammenleben fair und sicher ist", ["Damit niemand mitreden darf", "Damit nur eine Person gewinnt", "Damit Konflikte versteckt werden"], "Gemeinsame Regeln geben Sicherheit und ___.", "Orientierung", "Gute Regeln gelten nachvollziehbar für alle."),
        fact("Was bedeutet Verantwortung übernehmen?", "Für eigenes Handeln einstehen", ["Immer andere beschuldigen", "Folgen ignorieren", "Aufgaben heimlich abgeben"], "Wer einen Fehler zugibt, übernimmt ___.", "Verantwortung", "Zum Handeln gehören auch seine Folgen."),
      ],
      3: [
        fact("Wie findet eine Gruppe einen fairen Kompromiss?", "Alle wichtigen Bedürfnisse werden berücksichtigt", ["Die lauteste Person entscheidet", "Eine Seite bekommt alles", "Das Problem wird verdrängt"], "Ein ___ berücksichtigt mehrere Seiten.", "Kompromiss", "Eine faire Lösung verlangt oft gegenseitiges Entgegenkommen."),
        fact("Was ist ein Wert?", "Eine Vorstellung davon, was wichtig und gut ist", ["Eine zufällige Zahl", "Eine Wetterregel", "Eine Landkarte"], "Fairness ist ein Beispiel für einen ___.", "Wert", "Werte helfen, Handlungen zu beurteilen."),
      ],
    },
  },
  "4/energie-stoffe": {
    title: "Produktion & Konsum", emoji: "🏭", code: "NMG.6.3",
    facts: {
      1: [
        fact("Was ist ein Rohstoff?", "Ein Ausgangsmaterial für Produkte", ["Ein fertiger Laden", "Eine Werbeanzeige", "Ein Preiszettel"], "Holz ist ein natürlicher ___.", "Rohstoff", "Aus Rohstoffen werden Produkte hergestellt."),
        fact("Wer stellt Brot her?", "Eine Bäckerin oder ein Bäcker", ["Eine Pilotin", "Ein Zahnarzt", "Eine Bibliothekarin"], "In der Bäckerei wird Brot ___.", "hergestellt", "Denke an den Weg vom Mehl zum Brot."),
      ],
      2: [
        fact("Was gehört zu einer Produktionskette?", "Mehrere Schritte vom Rohstoff zum Produkt", ["Nur der Verkauf", "Nur die Verpackung", "Nur die Werbung"], "Vom Rohstoff bis zum Laden führt eine ___.", "Produktionskette", "Ein Produkt entsteht selten in nur einem Schritt."),
        fact("Warum steht auf Produkten ein Herkunftsort?", "Er zeigt, woher das Produkt kommt", ["Er bestimmt die Farbe", "Er ersetzt den Preis", "Er zeigt die Öffnungszeit"], "Die ___ nennt den Ursprung eines Produkts.", "Herkunft", "Transportwege beginnen am Herstellungsort."),
      ],
      3: [
        fact("Wie kann Konsum Ressourcen schonen?", "Langlebige und reparierbare Dinge wählen", ["Brauchbares schnell ersetzen", "Mehr Verpackung verlangen", "Produkte nur einmal nutzen"], "Reparieren verlängert die ___ eines Produkts.", "Nutzungsdauer", "Lange Nutzung spart neue Rohstoffe."),
        fact("Warum sind kurze Transportwege oft sinnvoll?", "Sie können Verkehr und Energiebedarf senken", ["Sie machen Produkte automatisch gratis", "Sie verhindern jede Verpackung", "Sie ersetzen Qualitätskontrollen"], "Kurze Wege können den Transportaufwand ___.", "verringern", "Weniger Strecke benötigt meist weniger Transport."),
      ],
    },
  },
  "4/raeume-karte": {
    title: "Religionen & Feste", emoji: "🕯️", code: "NMG.12.1",
    facts: {
      1: [
        fact("Warum feiern Menschen Feste?", "Sie erinnern und stärken Gemeinschaft", ["Damit alle gleich glauben", "Damit Regeln verschwinden", "Damit niemand zusammenkommt"], "Feste können Menschen ___.", "verbinden", "Viele Feste haben Geschichten und Bräuche."),
        fact("Was ist ein Brauch?", "Eine wiederkehrende Handlung mit Bedeutung", ["Ein zufälliger Fehler", "Eine Wetterlage", "Ein Verkehrsschild"], "Kerzen anzünden kann ein ___ sein.", "Brauch", "Bräuche werden oft weitergegeben."),
      ],
      2: [
        fact("Wie begegnet man anderen Religionen respektvoll?", "Man fragt offen und hört zu", ["Man macht sich lustig", "Man behauptet alles sei gleich", "Man verbietet Fragen"], "Respekt beginnt mit offenem Fragen und ___.", "Zuhören", "Menschen erklären ihre Traditionen am besten selbst."),
        fact("Was kann ein religiöses Symbol ausdrücken?", "Zugehörigkeit oder eine Glaubensidee", ["Nur einen Preis", "Eine Himmelsrichtung", "Eine Rechenregel"], "Ein Symbol kann eine besondere ___ tragen.", "Bedeutung", "Symbole stehen für mehr als ihre Form."),
      ],
      3: [
        fact("Warum gibt es innerhalb einer Religion verschiedene Bräuche?", "Menschen leben Traditionen unterschiedlich", ["Weil niemand Regeln kennt", "Weil alle Feste zufällig sind", "Weil Religion nur privat sein darf"], "Traditionen können regional und familiär ___ sein.", "verschieden", "Auch innerhalb einer Gemeinschaft gibt es Vielfalt."),
        fact("Was unterscheidet Beobachtung und Deutung?", "Beobachtung beschreibt, Deutung erklärt Bedeutung", ["Beides ist immer dasselbe", "Deutung misst Entfernungen", "Beobachtung bewertet zuerst"], "Eine Beschreibung nennt zuerst das ___.", "Beobachtbare", "Trenne, was du siehst, von deiner Erklärung."),
      ],
    },
  },
  "5/weltall": {
    title: "Medien & Information", emoji: "📰", code: "MI.1.2",
    facts: {
      1: [
        fact("Was ist eine Informationsquelle?", "Ein Ursprung von Informationen", ["Nur ein Bildschirm", "Eine zufällige Meinung", "Ein leeres Blatt"], "Ein Zeitungsartikel ist eine mögliche ___.", "Informationsquelle", "Informationen kommen aus Texten, Bildern, Gesprächen oder Daten."),
        fact("Was trennt Nachricht und Werbung?", "Werbung will meist überzeugen oder verkaufen", ["Nachrichten haben nie Quellen", "Werbung enthält keine Bilder", "Nachrichten sind immer kurz"], "Werbung verfolgt ein bestimmtes ___.", "Ziel", "Frage, wer die Botschaft erstellt hat und warum."),
      ],
      2: [
        fact("Wie prüft man eine Behauptung?", "Mehrere verlässliche Quellen vergleichen", ["Nur die Überschrift lesen", "Die häufigste Wiederholung glauben", "Den ersten Treffer übernehmen"], "Zur Prüfung vergleicht man mehrere ___.", "Quellen", "Unabhängige Belege erhöhen die Sicherheit."),
        fact("Was ist ein Algorithmus im Alltag?", "Eine klare Folge von Schritten", ["Ein zufälliges Ergebnis", "Nur ein Computerbild", "Eine geheime Meinung"], "Eine genaue Anleitung ähnelt einem ___.", "Algorithmus", "Schritte müssen in einer sinnvollen Reihenfolge stehen."),
      ],
      3: [
        fact("Warum können Suchergebnisse unterschiedlich sein?", "Auswahl und Reihenfolge werden technisch beeinflusst", ["Das Internet kennt nur eine Antwort", "Alle Quellen sind gleich", "Suchbegriffe spielen keine Rolle"], "Die Reihenfolge von Treffern wird durch Systeme ___.", "beeinflusst", "Suchbegriff, Standort und Plattform können eine Rolle spielen."),
        fact("Was macht eine Quelle glaubwürdig?", "Nachvollziehbare Urheberschaft und Belege", ["Viele Ausrufezeichen", "Eine auffällige Farbe", "Eine besonders kurze Adresse"], "Glaubwürdige Aussagen nennen Autor und ___.", "Belege", "Prüfe Aktualität, Fachkenntnis und Nachweise."),
      ],
    },
  },
  "5/strom-elektrizitaet": {
    title: "Arbeit, Handel & Transport", emoji: "🚚", code: "NMG.6.3",
    facts: {
      1: [
        fact("Was verbindet Produktion und Verkauf?", "Handel und Transport", ["Nur Werbung", "Nur Abfall", "Nur Freizeit"], "Waren gelangen durch Handel und ___ zum Laden.", "Transport", "Produkte müssen vom Herstellungsort zu Kundinnen und Kunden gelangen."),
        fact("Was ist eine Dienstleistung?", "Eine bezahlte Tätigkeit für andere", ["Ein Rohstoff", "Eine Verpackung", "Ein Lagerhaus"], "Ein Haarschnitt ist eine ___.", "Dienstleistung", "Nicht nur Gegenstände werden verkauft."),
      ],
      2: [
        fact("Warum lagern Betriebe Waren?", "Damit Produkte bei Bedarf verfügbar sind", ["Damit niemand sie findet", "Damit Preise verschwinden", "Damit Wege länger werden"], "Ein Lager hält Waren ___.", "verfügbar", "Nachfrage und Lieferung passen zeitlich nicht immer zusammen."),
        fact("Was beeinflusst den Verkaufspreis?", "Kosten für Material, Arbeit und Transport", ["Nur die Farbe", "Nur der Wochentag", "Nur das Firmenlogo"], "Material und Löhne gehören zu den ___.", "Kosten", "Ein Betrieb muss seine Ausgaben berücksichtigen."),
      ],
      3: [
        fact("Was ist Arbeitsteilung?", "Aufgaben werden auf mehrere Personen oder Betriebe verteilt", ["Alle machen alles allein", "Arbeit wird verboten", "Nur Maschinen entscheiden"], "Bei der ___ übernimmt jede Stelle einen Teil.", "Arbeitsteilung", "Spezialisierung kann Abläufe erleichtern."),
        fact("Warum sind Lieferketten störanfällig?", "Viele voneinander abhängige Schritte sind verbunden", ["Waren entstehen ohne Material", "Transport ist immer sofort", "Lager sind unbegrenzt"], "Eine Störung kann weitere Schritte der ___ treffen.", "Lieferkette", "Fehlt ein Teil, kann die Produktion warten müssen."),
      ],
    },
  },
  "5/geschichte-zeit": {
    title: "Werte, Regeln & Konflikte", emoji: "⚖️", code: "NMG.11.3",
    facts: {
      1: [
        fact("Was ist eine faire Regel?", "Sie ist begründbar und gilt für alle Betroffenen", ["Sie nützt nur der stärksten Person", "Sie bleibt geheim", "Sie ändert sich bei jeder Person"], "Eine faire Regel ist ___.", "nachvollziehbar", "Prüfe Zweck, Wirkung und Gleichbehandlung."),
        fact("Was ist ein Konflikt?", "Unterschiedliche Interessen oder Bedürfnisse treffen aufeinander", ["Alle sind gleicher Meinung", "Eine Aufgabe ist beendet", "Eine Regel wird gelesen"], "Bei einem ___ treffen unterschiedliche Anliegen aufeinander.", "Konflikt", "Konflikte sind normal und können bearbeitet werden."),
      ],
      2: [
        fact("Was hilft bei einer schwierigen Entscheidung?", "Folgen und Werte abwägen", ["Nur den eigenen Vorteil sehen", "Zufällig wählen", "Andere nicht anhören"], "Vor einer Entscheidung sollte man mögliche ___ prüfen.", "Folgen", "Betrachte mehrere Betroffene und Zeiträume."),
        fact("Warum sind Perspektiven wichtig?", "Menschen erleben dieselbe Situation unterschiedlich", ["Nur eine Sicht ist erlaubt", "Gefühle sind bedeutungslos", "Perspektiven ersetzen Fakten"], "Ein Perspektivwechsel erweitert das ___.", "Verständnis", "Höre, wie andere die Lage wahrnehmen."),
      ],
      3: [
        fact("Was unterscheidet Recht und persönliche Meinung?", "Recht sind verbindliche Regeln des Gemeinwesens", ["Meinungen gelten immer für alle", "Recht ist nur ein Gefühl", "Beides ist identisch"], "Gesetze sind rechtlich ___.", "verbindlich", "Eine Meinung darf verschieden sein, ein Gesetz gilt grundsätzlich allgemein."),
        fact("Wann ist ein Kompromiss tragfähig?", "Wenn Betroffene ihn verstehen und mittragen können", ["Wenn eine Seite schweigt", "Wenn Folgen verborgen bleiben", "Wenn nur Tempo zählt"], "Ein tragfähiger Kompromiss braucht ___.", "Akzeptanz", "Eine Lösung soll fair, verständlich und umsetzbar sein."),
      ],
    },
  },
  "6/weltall": {
    title: "Berufswelt & Zukunft", emoji: "🧭", code: "NMG.6.2",
    facts: {
      1: [
        fact("Was hilft bei der Berufswahl?", "Eigene Interessen und Fähigkeiten kennen", ["Nur Trends folgen", "Nur den Arbeitsweg ansehen", "Andere allein entscheiden lassen"], "Für die Berufswahl reflektiert man Interessen und ___.", "Fähigkeiten", "Passung entsteht zwischen Person und Tätigkeit."),
        fact("Was ist eine berufliche Kompetenz?", "Wissen und Können für Aufgaben", ["Nur ein Zeugnis", "Nur ein Berufstitel", "Nur Arbeitskleidung"], "Kompetenzen zeigen, was jemand weiss und ___.", "kann", "Fachliche und soziale Fähigkeiten gehören dazu."),
      ],
      2: [
        fact("Warum verändern sich Berufsbilder?", "Technik und gesellschaftliche Bedürfnisse ändern sich", ["Berufe bleiben immer gleich", "Nur Namen werden länger", "Ausbildung wird unnötig"], "Digitalisierung kann Berufsbilder ___.", "verändern", "Neue Werkzeuge schaffen und verschieben Aufgaben."),
        fact("Was bedeutet lebenslanges Lernen?", "Auch nach der Schule neues Wissen erwerben", ["Nur für Prüfungen lernen", "Nach der Ausbildung nie mehr lernen", "Nur allein lernen"], "Weiterbildung unterstützt ___ Lernen.", "lebenslanges", "Berufe und Wissen entwickeln sich weiter."),
      ],
      3: [
        fact("Wie beurteilt man ein Berufsfeld realistisch?", "Aufgaben, Anforderungen und Perspektiven recherchieren", ["Nur einen Werbefilm ansehen", "Nur den Lohn vergleichen", "Nur den Namen bewerten"], "Eine fundierte Wahl braucht verlässliche ___.", "Informationen", "Gespräche und Schnuppern ergänzen Beschreibungen."),
        fact("Welche Wirkung hat Automatisierung?", "Bestimmte Aufgaben verändern sich oder werden neu verteilt", ["Alle Berufe verschwinden", "Menschen lernen nichts mehr", "Jede Arbeit wird identisch"], "Automatisierung verändert vor allem einzelne ___.", "Tätigkeiten", "Technik ersetzt, ergänzt oder schafft Aufgaben."),
      ],
    },
  },
  "6/geschichte-zeit": {
    title: "Religionen & Weltanschauungen", emoji: "🌐", code: "NMG.12.5",
    facts: {
      1: [
        fact("Was ist eine Weltanschauung?", "Eine Sicht auf Mensch, Welt und Leben", ["Nur eine Landkarte", "Eine Wetterprognose", "Eine Rechenmethode"], "Eine ___ deutet grundlegende Lebensfragen.", "Weltanschauung", "Menschen suchen unterschiedliche Antworten auf grosse Fragen."),
        fact("Was ermöglicht Religionsfreiheit?", "Glauben, nicht glauben oder den Glauben wechseln", ["Andere zum Glauben zwingen", "Nur eine Religion erlauben", "Fragen verbieten"], "Religionsfreiheit schützt persönliche ___.", "Überzeugungen", "Freiheit gilt auch für Menschen ohne Religion."),
      ],
      2: [
        fact("Was ist interreligiöser Dialog?", "Respektvoller Austausch zwischen Religionen", ["Ein Wettbewerb um die einzig erlaubte Antwort", "Das Vermeiden aller Fragen", "Eine politische Wahl"], "Dialog braucht Respekt und echtes ___.", "Zuhören", "Ziel ist Verständnis, nicht Gleichmacherei."),
        fact("Warum muss man Religion und Kultur unterscheiden?", "Sie beeinflussen sich, sind aber nicht dasselbe", ["Jede Kultur hat nur eine Religion", "Religion bestimmt jedes Verhalten", "Kultur ist immer religiös"], "Religion und Kultur können sich ___.", "überschneiden", "Individuen leben Traditionen unterschiedlich."),
      ],
      3: [
        fact("Wie erkennt man ein Vorurteil über Religion?", "Eine ganze Gruppe wird pauschal bewertet", ["Eine Person beschreibt ihre Erfahrung", "Eine Quelle nennt Unterschiede", "Eine Frage bleibt offen"], "Pauschale Aussagen fördern ___.", "Vorurteile", "Prüfe, ob Vielfalt innerhalb der Gruppe beachtet wird."),
        fact("Was kennzeichnet eine sachliche Diskussion über Glaubensfragen?", "Begriffe klären, Gründe nennen und Personen respektieren", ["Menschen abwerten", "Behauptungen nie prüfen", "Nur Mehrheiten zählen"], "Sachlicher Austausch trennt Kritik an Ideen von der ___ von Menschen.", "Abwertung", "Hart in der Sache, respektvoll gegenüber Personen."),
      ],
    },
  },
};

const questionStarts = [
  "Wähle:", "Schau genau:", "Was passt?", "Prüfe:", "Entscheide:",
  "Finde die richtige Antwort:", "Welche Antwort passt?", "Denke an deinen Alltag:", "Schau dir alles an:", "Was stimmt?",
  "Wähle aus:", "Welche Lösung passt?", "Schau die Möglichkeiten an:", "Was würdest du wählen?", "Finde die beste Antwort:",
  "Achte auf die Frage:", "Welche Aussage stimmt?", "Vergleiche die Antworten:", "Was passt hier?", "Welche Antwort passt zum Alltag?",
  "Denke kurz nach:", "Was ist wichtig?", "Wähle die passende Antwort:", "Welche Lösung passt zum Thema?", "Zeig, was du weisst:",
];
const fillStarts = [
  "Ergänze:", "Setze das passende Wort ein:", "Mach den Satz fertig:", "Welches Wort fehlt?", "Fülle die Lücke:",
  "Ergänze den Satz:", "Setze ein Wort ein:", "Mache den Satz vollständig:", "Finde das fehlende Wort:", "Schliesse die Lücke:",
  "Welches Wort passt?", "Ergänze passend:", "Setze das richtige Wort ein:", "Vervollständige den Satz:", "Trage das passende Wort ein:",
  "Mach den Satz fertig:", "Ergänze mit einem Wort:", "Setze die richtige Lösung ein:", "Finde das gesuchte Wort:", "Mache den Satz richtig:",
  "Ergänze den Satz:", "Welches Wort fehlt?", "Setze den passenden Ausdruck ein:", "Beende den Satz:", "Prüfe und ergänze:",
];

function specialExercise(topicKey: string, exercise: Exercise): Exercise | null {
  if (topicKey === "1/sinne" && exercise.type === "drag-drop") return {
    id: exercise.id, type: "drag-drop", difficulty: exercise.difficulty, free: exercise.free,
    question: "Ordne Bedürfnisse und Wünsche zu.", answer: "all", hints: ["Brauchen ist wichtiger als nur haben wollen.", "Ordne zuerst Wasser und Spielzeug."],
    dragItems: [{ id: "wasser", label: "💧 Wasser" }, { id: "essen", label: "🍎 Essen" }, { id: "ball", label: "⚽ Neuer Ball" }, { id: "sticker", label: "⭐ Sticker" }],
    dropZones: [{ id: "bedarf", label: "Brauche ich" }, { id: "wunsch", label: "Wünsche ich mir" }],
    dropAnswers: { wasser: "bedarf", essen: "bedarf", ball: "wunsch", sticker: "wunsch" },
  };
  if (topicKey === "1/sinne" && exercise.type === "memory") return {
    id: exercise.id, type: "memory", difficulty: exercise.difficulty, free: exercise.free,
    question: "Finde die passenden Bedürfnis-Paare.", answer: "all", hints: ["Was braucht ein Mensch im Alltag?", "Merke dir die Positionen der Karten."],
    pairs: [{ id: "durst", label: "Durst", emoji: "🥤" }, { id: "wasser", label: "Wasser", emoji: "💧" }, { id: "hunger", label: "Hunger", emoji: "😋" }, { id: "essen", label: "Essen", emoji: "🍎" }, { id: "muede", label: "Müde", emoji: "🥱" }, { id: "schlaf", label: "Schlaf", emoji: "🛏️" }, { id: "kalt", label: "Kalt", emoji: "🥶" }, { id: "kleidung", label: "Warme Kleidung", emoji: "🧥" }],
  };
  if (topicKey === "1/wetter-klima" && exercise.type === "drag-drop") return {
    id: exercise.id, type: "drag-drop", difficulty: exercise.difficulty, free: exercise.free,
    question: "Ordne die Orte im Quartier ihrer Aufgabe zu.", answer: "all", hints: ["Wo spielt, liest oder wartet man?", "Beginne mit dem Spielplatz."],
    dragItems: [{ id: "spielen", label: "🛝 Spielen" }, { id: "lesen", label: "📚 Bücher ausleihen" }, { id: "bus", label: "🚌 Auf den Bus warten" }, { id: "einkauf", label: "🛒 Einkaufen" }],
    dropZones: [{ id: "spielplatz", label: "Spielplatz" }, { id: "bibliothek", label: "Bibliothek" }, { id: "haltestelle", label: "Haltestelle" }, { id: "laden", label: "Laden" }],
    dropAnswers: { spielen: "spielplatz", lesen: "bibliothek", bus: "haltestelle", einkauf: "laden" },
  };
  if (topicKey === "1/wetter-klima" && exercise.type === "memory") return {
    id: exercise.id, type: "memory", difficulty: exercise.difficulty, free: exercise.free,
    question: "Finde Ort und passende Aufgabe.", answer: "all", hints: ["Welche Dinge gehören zusammen?", "Merke dir die Positionen."],
    pairs: [{ id: "bib", label: "Bibliothek", emoji: "🏛️" }, { id: "buch", label: "Buch", emoji: "📚" }, { id: "platz", label: "Spielplatz", emoji: "🛝" }, { id: "spiel", label: "Spielen", emoji: "⚽" }, { id: "halt", label: "Haltestelle", emoji: "🚏" }, { id: "bus", label: "Bus", emoji: "🚌" }, { id: "laden", label: "Laden", emoji: "🏪" }, { id: "korb", label: "Einkauf", emoji: "🛒" }],
  };
  return null;
}

function replaceExercise(topicKey: string, exercise: Exercise, index: number, config: BalancedTopic): Exercise {
  const special = specialExercise(topicKey, exercise);
  if (special) return special;
  const pool = config.facts[exercise.difficulty];
  const selected = pool[index % pool.length];
  const variant = Math.floor(index / pool.length) % questionStarts.length;
  if (exercise.type === "multiple-choice") {
    const choices = [selected.answer, ...selected.distractors];
    const offset = Math.floor(index / 2) % choices.length;
    return {
      id: exercise.id, type: exercise.type, difficulty: exercise.difficulty, free: exercise.free,
      question: `${questionStarts[variant]} ${selected.question}`,
      options: [...choices.slice(offset), ...choices.slice(0, offset)],
      answer: selected.answer,
      hints: [selected.hint, `Schliesse Antworten aus, die nicht zur Frage passen.`],
    };
  }
  return {
    id: exercise.id, type: "fill-in-blank", difficulty: exercise.difficulty, free: exercise.free,
    question: `${fillStarts[variant]} ${selected.fill}`,
    answer: selected.fillAnswer,
    hints: [selected.hint, "Lies den vollständigen Satz mit deinem Wort."],
  };
}

export function consolidateNmgTopics(grade: number, subject: string, topics: Topic[]): Topic[] {
  if (!["science", "nt", "rzg"].includes(subject)) return topics;
  return topics.map((topic) => {
    const key = `${grade}/${topic.id}`;
    const config = BALANCED_TOPICS[key];
    if (!config) return topic;
    return {
      ...topic,
      title: config.title,
      emoji: config.emoji,
      exercises: topic.exercises.map((exercise, index) => replaceExercise(key, exercise, index, config)),
    };
  });
}

export function getBalancedNmgCompetency(grade: number, topicId: string): { code: string; area: string } | null {
  const config = BALANCED_TOPICS[`${grade}/${topicId}`];
  return config ? { code: config.code, area: config.title } : null;
}

export const CONSOLIDATED_NMG_TOPIC_KEYS = Object.freeze(Object.keys(BALANCED_TOPICS));
