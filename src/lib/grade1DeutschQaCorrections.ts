import type { Exercise } from "@/types/exercise";
// German-only, reviewed Grade 1 Deutsch overlay.
const corrections: Record<string, Partial<Exercise>> = {
  "b1": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b2": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b3": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b4": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b5": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b6": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b7": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b8": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b9": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b10": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b11": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b12": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b13": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b14": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b15": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b16": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ]
  },
  "b17": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b18": {
    "hints": [
      "Zeige von links nach rechts auf jeden Buchstaben.",
      "Zähle jeden Buchstaben einmal, auch wenn er doppelt vorkommt."
    ]
  },
  "b19": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt im Wort Katze? K, fehlender Buchstabe, T, Z, E."
  },
  "b20": {
    "hints": [
      "Zeige von links nach rechts auf jeden Buchstaben.",
      "Zähle jeden Buchstaben einmal, auch wenn er doppelt vorkommt."
    ]
  },
  "b21": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ]
  },
  "b22": {
    "hints": [
      "Lies das Wort bis zum Schluss.",
      "Schau auf den Buchstaben ganz rechts."
    ]
  },
  "b23": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b24": {
    "hints": [
      "Zeige von links nach rechts auf jeden Buchstaben.",
      "Zähle jeden Buchstaben einmal, auch wenn er doppelt vorkommt."
    ]
  },
  "b25": {
    "hints": [
      "Lies alle Buchstaben im Wort.",
      "Suche den angebotenen Buchstaben, den du an zwei Stellen findest."
    ],
    "question": "Welcher Buchstabe kommt in «MAMA» zweimal vor?",
    "answer": "M",
    "options": [
      "M",
      "B",
      "S",
      "T"
    ],
    "spokenPrompt": "Welcher Buchstabe kommt in «MAMA» zweimal vor?"
  },
  "b26": {
    "hints": [
      "Zeige von links nach rechts auf jeden Buchstaben.",
      "Zähle jeden Buchstaben einmal, auch wenn er doppelt vorkommt."
    ]
  },
  "b27": {
    "hints": [
      "Lies das Wort bis zum Schluss.",
      "Schau auf den Buchstaben ganz rechts."
    ]
  },
  "b28": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b29": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ],
    "spokenPrompt": "Ergänze den ersten Buchstaben im Wort Sonne. Schreibe ihn gross."
  },
  "b30": {
    "hints": [
      "Zeige von links nach rechts auf jeden Buchstaben.",
      "Zähle jeden Buchstaben einmal, auch wenn er doppelt vorkommt."
    ]
  },
  "b31": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b32": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ]
  },
  "b33": {
    "hints": [
      "Lies das Wort bis zum Schluss.",
      "Schau auf den Buchstaben ganz rechts."
    ]
  },
  "b34": {
    "hints": [
      "Lies das Wort bis zum Schluss.",
      "Schau auf den Buchstaben ganz rechts."
    ]
  },
  "b35": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ]
  },
  "b36": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ]
  },
  "b37": {
    "hints": [
      "Lies jedes Wort bis zum Ende.",
      "Suche c und h direkt nebeneinander."
    ],
    "question": "Welches Wort enthält die Buchstabenfolge «ch»?",
    "spokenPrompt": "Welches Wort enthält die Buchstabenfolge «ch»?"
  },
  "b38": {
    "hints": [
      "Zeige von links nach rechts auf jeden Buchstaben.",
      "Zähle jeden Buchstaben einmal, auch wenn er doppelt vorkommt."
    ]
  },
  "b39": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ]
  },
  "b40": {
    "hints": [
      "Schau auf das geschriebene Wort.",
      "Lies von links nach rechts und halte beim ersten Buchstaben an."
    ]
  },
  "b41": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ]
  },
  "b42": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ]
  },
  "b43": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ]
  },
  "b44": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ]
  },
  "b45": {
    "hints": [
      "Finde zuerst das Z im Wort.",
      "Schreibe alle anderen Buchstaben in derselben Reihenfolge ab."
    ],
    "question": "Streiche in «KATZE» das Z. Welche Buchstaben bleiben der Reihe nach? ___",
    "answer": "KATE",
    "spokenPrompt": "Streiche in «KATZE» das Z. Welche Buchstaben bleiben der Reihe nach? fehlende Antwort"
  },
  "b46": {
    "hints": [
      "Zeige von links nach rechts auf jeden Buchstaben.",
      "Zähle jeden Buchstaben einmal, auch wenn er doppelt vorkommt."
    ]
  },
  "b47": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ],
    "spokenPrompt": "Was ist der dritte Buchstabe im Wort Schule?"
  },
  "b48": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ]
  },
  "b49": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ]
  },
  "b50": {
    "hints": [
      "Lies die Aufgabe und schau dir die Buchstaben genau an.",
      "Gehe von links nach rechts vor und prüfe die gesuchte Stelle."
    ],
    "options": [
      "HAUS",
      "BLUME",
      "AST",
      "MAUS"
    ]
  },
  "gk1": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk2": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk3": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk4": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk5": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk6": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk7": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk8": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk9": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk10": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk11": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk12": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk13": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk14": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk15": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk16": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk17": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk18": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk19": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk20": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk21": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk22": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk23": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk24": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk25": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk26": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "gk50": {
    "hints": [
      "Denke an die grosse und die kleine Form desselben Buchstabens.",
      "Sprich beide Formen aus: Sie haben denselben Buchstabennamen."
    ]
  },
  "r1": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r2": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r3": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r4": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r5": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r6": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r7": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r8": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r9": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Gesucht ist ein Reimwort zu «Regen»: Bewegung: etwas an einen anderen Ort tun. ___",
    "answer": "legen",
    "altAnswers": [],
    "spokenPrompt": "Gesucht ist ein Reimwort zu «Regen»: Bewegung: etwas an einen anderen Ort tun. fehlende Antwort"
  },
  "r10": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r11": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r12": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r13": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r14": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r15": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r16": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r17": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r18": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r19": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r20": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r21": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Gesucht ist ein Reimwort zu «Hahn»: etwas Weisses im Mund. ___",
    "answer": "Zahn",
    "altAnswers": [],
    "spokenPrompt": "Gesucht ist ein Reimwort zu «Hahn»: etwas Weisses im Mund. fehlende Antwort"
  },
  "r22": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r23": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r24": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Was reimt sich auf «Schuh» und ist ein Tier? ___",
    "answer": "Kuh",
    "spokenPrompt": "Was reimt sich auf «Schuh» und ist ein Tier? fehlende Antwort"
  },
  "r25": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r26": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Gesucht ist ein Reimwort zu «Nacht»: die Zahl nach sieben. ___",
    "answer": "acht",
    "altAnswers": [],
    "spokenPrompt": "Gesucht ist ein Reimwort zu «Nacht»: die Zahl nach sieben. fehlende Antwort"
  },
  "r27": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r28": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r29": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Gesucht ist ein Reimwort zu «Herz»: der Monat nach Februar. ___",
    "answer": "März",
    "altAnswers": [],
    "spokenPrompt": "Gesucht ist ein Reimwort zu «Herz»: der Monat nach Februar. fehlende Antwort"
  },
  "r30": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r31": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r32": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Was reimt sich auf «gross»?",
    "answer": "bloss",
    "options": [
      "klein",
      "bloss",
      "wenig",
      "leise"
    ],
    "spokenPrompt": "Was reimt sich auf «gross»?"
  },
  "r33": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Gesucht ist ein Reimwort zu «Kuh»: etwas, das du am Fuss trägst. ___",
    "answer": "Schuh",
    "altAnswers": [],
    "spokenPrompt": "Gesucht ist ein Reimwort zu «Kuh»: etwas, das du am Fuss trägst. fehlende Antwort"
  },
  "r34": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r35": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Gesucht ist ein Reimwort zu «Buch»: ein Stück Stoff zum Abtrocknen. ___",
    "answer": "Tuch",
    "altAnswers": [],
    "spokenPrompt": "Gesucht ist ein Reimwort zu «Buch»: ein Stück Stoff zum Abtrocknen. fehlende Antwort"
  },
  "r36": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Gesucht ist ein Reimwort zu «scheint»: Was tut ein trauriges Kind manchmal? Es .... ___",
    "answer": "weint",
    "altAnswers": [],
    "spokenPrompt": "Gesucht ist ein Reimwort zu «scheint»: Was tut ein trauriges Kind manchmal? Es .... fehlende Antwort"
  },
  "r37": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r38": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Gesucht ist ein Reimwort zu «laufen»: etwas im Laden bezahlen und mitnehmen. ___",
    "answer": "kaufen",
    "altAnswers": [],
    "spokenPrompt": "Gesucht ist ein Reimwort zu «laufen»: etwas im Laden bezahlen und mitnehmen. fehlende Antwort"
  },
  "r39": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r40": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Gesucht ist ein Reimwort zu «Regen»: etwas an einen anderen Ort tun. ___",
    "answer": "legen",
    "altAnswers": [],
    "spokenPrompt": "Gesucht ist ein Reimwort zu «Regen»: etwas an einen anderen Ort tun. fehlende Antwort"
  },
  "r41": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r42": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Gesucht ist ein Reimwort zu «Hund»: die Form eines Balls. ___",
    "answer": "rund",
    "altAnswers": [],
    "spokenPrompt": "Gesucht ist ein Reimwort zu «Hund»: die Form eines Balls. fehlende Antwort"
  },
  "r43": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r44": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Gesucht ist ein Reimwort zu «Nacht»: die Zahl nach sieben. ___",
    "answer": "acht",
    "altAnswers": [],
    "spokenPrompt": "Gesucht ist ein Reimwort zu «Nacht»: die Zahl nach sieben. fehlende Antwort"
  },
  "r45": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r46": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Gesucht ist ein Reimwort zu «Stein»: das Gegenteil von gross. ___",
    "answer": "klein",
    "altAnswers": [],
    "spokenPrompt": "Gesucht ist ein Reimwort zu «Stein»: das Gegenteil von gross. fehlende Antwort"
  },
  "r47": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "r48": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Gesucht ist ein Reimwort zu «Spule»: ein Ort mit Unterricht und Klassen. ___",
    "answer": "Schule",
    "altAnswers": [],
    "spokenPrompt": "Gesucht ist ein Reimwort zu «Spule»: ein Ort mit Unterricht und Klassen. fehlende Antwort"
  },
  "r49": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ],
    "question": "Welches Wort reimt sich auf «Schlangen»?",
    "answer": "Wangen",
    "options": [
      "Äpfel",
      "Wangen",
      "Birnen"
    ],
    "spokenPrompt": "Welches Wort reimt sich auf «Schlangen»?"
  },
  "r50": {
    "hints": [
      "Sprich die Wörter laut und höre auf ihren Klang.",
      "Vergleiche den Klang ab dem betonten Vokal bis zum Wortende."
    ]
  },
  "abc1": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc2": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc3": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc4": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc5": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc6": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc7": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc8": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc9": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc10": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc11": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc12": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc13": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc14": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc15": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ]
  },
  "abc16": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? P, fehlender Buchstabe, R"
  },
  "abc17": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Nachbarn jedes gelegten Buchstabens."
    ]
  },
  "abc18": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? R, fehlender Buchstabe, T"
  },
  "abc19": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? S, fehlender Buchstabe, U"
  },
  "abc20": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? T, fehlender Buchstabe, V"
  },
  "abc21": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? U, fehlender Buchstabe, W"
  },
  "abc22": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? V, fehlender Buchstabe, X"
  },
  "abc23": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? W, fehlender Buchstabe, Y"
  },
  "abc24": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Nachbarn jedes gelegten Buchstabens."
    ]
  },
  "abc25": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? B, fehlender Buchstabe, D"
  },
  "abc26": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? C, fehlender Buchstabe, E"
  },
  "abc27": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? D, fehlender Buchstabe, F"
  },
  "abc28": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? E, fehlender Buchstabe, G"
  },
  "abc29": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? F, fehlender Buchstabe, H"
  },
  "abc30": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? G, fehlender Buchstabe, I"
  },
  "abc31": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? H, fehlender Buchstabe, J"
  },
  "abc32": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? I, fehlender Buchstabe, K"
  },
  "abc33": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? J, fehlender Buchstabe, L"
  },
  "abc34": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? K, fehlender Buchstabe, M"
  },
  "abc35": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? L, fehlender Buchstabe, N"
  },
  "abc36": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? M, fehlender Buchstabe, O, P"
  },
  "abc37": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? N, fehlender Buchstabe, P, Q"
  },
  "abc38": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? O, fehlender Buchstabe, Q, R"
  },
  "abc39": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? P, fehlender Buchstabe, R, S"
  },
  "abc40": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? Q, fehlender Buchstabe, S, T"
  },
  "abc41": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? R, fehlender Buchstabe, T, U"
  },
  "abc42": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? S, fehlender Buchstabe, U, V"
  },
  "abc43": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? T, fehlender Buchstabe, V, W"
  },
  "abc44": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? U, fehlender Buchstabe, W, X"
  },
  "abc45": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? V, fehlender Buchstabe, X, Y"
  },
  "abc46": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? W, fehlender Buchstabe, Y, Z"
  },
  "abc47": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? A, fehlender Buchstabe, C, D"
  },
  "abc48": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? B, fehlender Buchstabe, D, E"
  },
  "abc49": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? C, fehlender Buchstabe, E, F"
  },
  "abc50": {
    "hints": [
      "Sage das ABC langsam auf.",
      "Prüfe die Reihenfolge direkt vor und nach der gesuchten Stelle."
    ],
    "spokenPrompt": "Welcher Buchstabe fehlt? D, fehlender Buchstabe, F, G"
  },
  "sl1": {
    "hints": [
      "Lies den kurzen Text noch einmal.",
      "Suche die Textstelle, die genau zur Frage passt."
    ]
  },
  "sl5": {
    "hints": [
      "Lies den kurzen Text noch einmal.",
      "Suche die Textstelle, die genau zur Frage passt."
    ]
  },
  "sl6": {
    "hints": [
      "Lies den kurzen Text noch einmal.",
      "Suche die Textstelle, die genau zur Frage passt."
    ]
  },
  "sl8": {
    "hints": [
      "Lies den kurzen Text noch einmal.",
      "Suche die Textstelle, die genau zur Frage passt."
    ]
  },
  "sl9": {
    "hints": [
      "Lies den kurzen Text noch einmal.",
      "Suche die Textstelle, die genau zur Frage passt."
    ]
  },
  "sl10": {
    "hints": [
      "Lies den kurzen Text noch einmal.",
      "Suche die Textstelle, die genau zur Frage passt."
    ]
  },
  "vk4": {
    "altAnswers": [
      "Selbstlaut"
    ]
  },
  "vk7": {
    "altAnswers": [
      "Mitlaut"
    ]
  },
  "vk10": {
    "altAnswers": [
      "Mitlaut"
    ]
  },
  "vk13": {
    "altAnswers": [
      "Mitlaut"
    ]
  },
  "vk15": {
    "altAnswers": [
      "Mitlaut"
    ]
  },
  "vk17": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk18": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk19": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk20": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk21": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk22": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk23": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk24": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk25": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk26": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk27": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk28": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk29": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk30": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk31": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk32": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk33": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk34": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk35": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk36": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk37": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk38": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk39": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk40": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk41": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk42": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk43": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk44": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk45": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk46": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk47": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk48": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk49": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "vk50": {
    "hints": [
      "Sprich das Wort langsam und höre auf seine Selbstlaute.",
      "Gehe vom Wortanfang aus: Welcher Selbstlaut kommt als erster?"
    ]
  },
  "sk1": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «HUND»?",
    "spokenPrompt": "Wie viele Silben hat «HUND»?"
  },
  "sk2": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «KATZE»?",
    "spokenPrompt": "Wie viele Silben hat «KATZE»?"
  },
  "sk3": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «SCHMETTERLING»?",
    "spokenPrompt": "Wie viele Silben hat «SCHMETTERLING»?"
  },
  "sk4": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «BLUME»?",
    "spokenPrompt": "Wie viele Silben hat «BLUME»?"
  },
  "sk5": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«SONNE» hat ___ Silben.",
    "spokenPrompt": "«SONNE» hat fehlende Antwort Silben."
  },
  "sk6": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «FISCH»?",
    "spokenPrompt": "Wie viele Silben hat «FISCH»?"
  },
  "sk7": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«SCHULE» hat ___ Silben.",
    "spokenPrompt": "«SCHULE» hat fehlende Antwort Silben."
  },
  "sk8": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «APFEL»?",
    "spokenPrompt": "Wie viele Silben hat «APFEL»?"
  },
  "sk9": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«HAUS» hat ___ Silbe(n).",
    "spokenPrompt": "«HAUS» hat fehlende Antwort Silbe(n)."
  },
  "sk10": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «ELEFANT»?",
    "spokenPrompt": "Wie viele Silben hat «ELEFANT»?"
  },
  "sk11": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«VOGEL» hat ___ Silben.",
    "spokenPrompt": "«VOGEL» hat fehlende Antwort Silben."
  },
  "sk12": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «BALL»?",
    "spokenPrompt": "Wie viele Silben hat «BALL»?"
  },
  "sk13": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«TAGEBUCH» hat ___ Silben.",
    "spokenPrompt": "«TAGEBUCH» hat fehlende Antwort Silben."
  },
  "sk14": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «KIND»?",
    "spokenPrompt": "Wie viele Silben hat «KIND»?"
  },
  "sk15": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«BUCH» hat ___ Silbe(n).",
    "spokenPrompt": "«BUCH» hat fehlende Antwort Silbe(n)."
  },
  "sk16": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ]
  },
  "sk17": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«SONNENBLUME» hat ___ Silben.",
    "spokenPrompt": "«SONNENBLUME» hat fehlende Antwort Silben."
  },
  "sk18": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Klatsche jedes angebotene Wort und vergleiche die Anzahl."
    ]
  },
  "sk19": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«SCHMETTERLING» hat ___ Silben.",
    "spokenPrompt": "«SCHMETTERLING» hat fehlende Antwort Silben."
  },
  "sk20": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «WASSERFALL»?",
    "spokenPrompt": "Wie viele Silben hat «WASSERFALL»?"
  },
  "sk21": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«REGENSCHIRM» hat ___ Silben.",
    "spokenPrompt": "«REGENSCHIRM» hat fehlende Antwort Silben."
  },
  "sk22": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Klatsche jedes angebotene Wort und vergleiche die Anzahl."
    ]
  },
  "sk23": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«HASENOHR» hat ___ Silben.",
    "spokenPrompt": "«HASENOHR» hat fehlende Antwort Silben."
  },
  "sk24": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «ERDBEERE»?",
    "spokenPrompt": "Wie viele Silben hat «ERDBEERE»?"
  },
  "sk25": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«SCHOKOLADE» hat ___ Silben.",
    "spokenPrompt": "«SCHOKOLADE» hat fehlende Antwort Silben."
  },
  "sk26": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Klatsche jedes angebotene Wort und vergleiche die Anzahl."
    ],
    "options": [
      "Haus",
      "Blume",
      "Elefant",
      "Ball"
    ]
  },
  "sk27": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«FAHRRAD» hat ___ Silben.",
    "spokenPrompt": "«FAHRRAD» hat fehlende Antwort Silben."
  },
  "sk28": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «KROKODIL»?",
    "spokenPrompt": "Wie viele Silben hat «KROKODIL»?"
  },
  "sk29": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«ZITRONE» hat ___ Silben.",
    "spokenPrompt": "«ZITRONE» hat fehlende Antwort Silben."
  },
  "sk30": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Klatsche jedes angebotene Wort und vergleiche die Anzahl."
    ],
    "options": [
      "Hund",
      "Tiger",
      "Schmetterling",
      "Ball"
    ]
  },
  "sk31": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«HIMBEERE» hat ___ Silben.",
    "spokenPrompt": "«HIMBEERE» hat fehlende Antwort Silben."
  },
  "sk32": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «KROKODIL»?",
    "spokenPrompt": "Wie viele Silben hat «KROKODIL»?"
  },
  "sk33": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«TAFEL» hat ___ Silben.",
    "spokenPrompt": "«TAFEL» hat fehlende Antwort Silben."
  },
  "sk34": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Klatsche jedes angebotene Wort und vergleiche die Anzahl."
    ]
  },
  "sk35": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«ZWILLING» hat ___ Silben.",
    "spokenPrompt": "«ZWILLING» hat fehlende Antwort Silben."
  },
  "sk36": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«SCHOKO» hat ___ Silben.",
    "spokenPrompt": "«SCHOKO» hat fehlende Antwort Silben."
  },
  "sk37": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Klatsche jedes angebotene Wort und vergleiche die Anzahl."
    ]
  },
  "sk38": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«STRASSE» hat ___ Silben.",
    "spokenPrompt": "«STRASSE» hat fehlende Antwort Silben."
  },
  "sk39": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «KÄSE»?",
    "spokenPrompt": "Wie viele Silben hat «KÄSE»?"
  },
  "sk40": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«ABENTEUER» hat ___ Silben.",
    "spokenPrompt": "«ABENTEUER» hat fehlende Antwort Silben."
  },
  "sk41": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «TOMATE»?",
    "spokenPrompt": "Wie viele Silben hat «TOMATE»?"
  },
  "sk42": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«KAISER» hat ___ Silben.",
    "spokenPrompt": "«KAISER» hat fehlende Antwort Silben."
  },
  "sk43": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «FAHRRAD»?",
    "spokenPrompt": "Wie viele Silben hat «FAHRRAD»?"
  },
  "sk44": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Zähle die Silben: «REGENBOGEN»: ___ Silben.",
    "spokenPrompt": "Zähle die Silben: «REGENBOGEN»: fehlende Antwort Silben."
  },
  "sk45": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Was machst du beim Silbenklatschen?",
    "answer": "Ich klatsche bei jedem Sprechschritt.",
    "options": [
      "Ich klatsche bei jedem Sprechschritt.",
      "Ich zähle nur die Buchstaben.",
      "Ich klatsche bei jedem Satz."
    ],
    "spokenPrompt": "Was machst du beim Silbenklatschen?"
  },
  "sk46": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «KIRSCHE»?",
    "spokenPrompt": "Wie viele Silben hat «KIRSCHE»?"
  },
  "sk47": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "Wie viele Silben hat «EICHHÖRNCHEN»?",
    "spokenPrompt": "Wie viele Silben hat «EICHHÖRNCHEN»?"
  },
  "sk48": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«KINDERZIMMER» hat ___ Silben.",
    "spokenPrompt": "«KINDERZIMMER» hat fehlende Antwort Silben."
  },
  "sk49": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Klatsche jedes angebotene Wort und vergleiche die Anzahl."
    ]
  },
  "sk50": {
    "hints": [
      "Sprich das Wort langsam und klatsche bei jedem Sprechschritt.",
      "Zähle deine Klatscher, nicht die einzelnen Buchstaben."
    ],
    "question": "«SCHWIMMBAD» hat ___ Silben.",
    "spokenPrompt": "«SCHWIMMBAD» hat fehlende Antwort Silben."
  },
  "ie1": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «Tier». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie2": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «Ei». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie3": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «Biene». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie4": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «Eis». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie5": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: 7️⃣ «sieben». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie6": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «Bein». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie7": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «Brief». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie8": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «Stein». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie9": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «Spiel». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie10": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «Seil». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie11": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «Wiese». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie12": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «klein». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie13": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «Ziege». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie14": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «Kleid». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie15": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Hör genau: «Knie». Mit welchem Buchstaben beginnt das Wort?"
  },
  "ie16": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie17": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie18": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Sprich «Reifen» langsam. Wähle den ersten Buchstaben."
  },
  "ie19": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie20": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Sprich «Leiter» langsam. Wähle den ersten Buchstaben."
  },
  "ie21": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie22": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Sprich «Meise» langsam. Wähle den ersten Buchstaben."
  },
  "ie23": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie24": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Sprich 3️⃣ «drei» langsam. Wähle den ersten Buchstaben."
  },
  "ie25": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie26": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Sprich 2️⃣ «zwei» langsam. Wähle den ersten Buchstaben."
  },
  "ie27": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie28": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Sprich «Pfeil» langsam. Wähle den ersten Buchstaben."
  },
  "ie29": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie30": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Sprich «Eimer» langsam. Wähle den ersten Buchstaben."
  },
  "ie31": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie32": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Sprich «Reise» langsam. Wähle den ersten Buchstaben."
  },
  "ie33": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie34": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ],
    "question": "Sprich «Kreis» langsam. Wähle den ersten Buchstaben."
  },
  "ie35": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie36": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie37": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie38": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie39": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie40": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie41": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie42": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie43": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie44": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie45": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie46": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie47": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie48": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie49": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ie50": {
    "hints": [
      "Höre das Wort und schau dir seine Schreibweise an.",
      "Gesucht ist der erste geschriebene Buchstabe, nicht der ganze Anfangslaut."
    ]
  },
  "ew1": {
    "image": "/images/animals/Katze.svg"
  },
  "ew7": {
    "question": "Was kommt aus dem Wasserhahn?",
    "hints": [
      "Damit kannst du deine Hände waschen.",
      "Suche unter den Antworten die Flüssigkeit."
    ],
    "spokenPrompt": "Was kommt aus dem Wasserhahn?"
  },
  "ew8": {
    "question": "Was wärmt die Erde mit seinem Licht?",
    "spokenPrompt": "Was wärmt die Erde mit seinem Licht?"
  },
  "ew9": {
    "question": "Wo findet der Unterricht im Klassenzimmer statt?",
    "spokenPrompt": "Wo findet der Unterricht im Klassenzimmer statt?"
  },
  "ew17": {
    "question": "Ordne jedes Tier seinem typischen Geräusch zu!",
    "hints": [
      "Stelle dir vor, wie jedes Tier klingt.",
      "Lies die Geräuschwörter und vergleiche sie mit deiner Vorstellung."
    ],
    "spokenPrompt": "Ordne jedes Tier seinem typischen Geräusch zu!"
  },
  "ew23": {
    "dragItems": [
      {
        "id": "hund2",
        "label": "Hund",
        "image": "/images/animals/Hund.svg"
      },
      {
        "id": "tisch",
        "label": "Tisch"
      },
      {
        "id": "katze2",
        "label": "Katze",
        "image": "/images/animals/Katze.svg"
      },
      {
        "id": "buch",
        "label": "Buch",
        "emoji": "📚"
      }
    ]
  },
  "ew31": {
    "question": "Was schneidet man in Scheiben und bestreicht es mit Butter?",
    "options": [
      "Suppe",
      "Wasser",
      "Brot",
      "Salat"
    ],
    "hints": [
      "Es wird aus Teig gebacken.",
      "Denke an ein Lebensmittel mit einer Kruste."
    ],
    "spokenPrompt": "Was schneidet man in Scheiben und bestreicht es mit Butter?"
  },
  "ew36": {
    "spokenPrompt": "Welches Wort passt zum Bild?"
  },
  "ew38": {
    "spokenPrompt": "Welches Wort passt zum Bild?"
  },
  "ew43": {
    "spokenPrompt": "Welches Wort passt zum Bild?"
  },
  "ew37": {
    "altAnswers": [
      "heiss"
    ],
    "hints": [
      "Vergleiche die Temperaturen im Winter und im Sommer.",
      "Gesucht ist ein Wort für eine höhere Temperatur."
    ]
  },
  "ew42": {
    "altAnswers": [
      "schaut",
      "blickt"
    ]
  },
  "ew45": {
    "question": "Was passt eher zum Winter als zum Frühling?",
    "spokenPrompt": "Was passt eher zum Winter als zum Frühling?"
  },
  "ew46": {
    "question": "In der Nacht sehen wir Sterne. Am Tag wärmt uns die ___.",
    "hints": [
      "Denke an den hellen Himmel am Tag.",
      "Was gibt uns Licht und Wärme?"
    ],
    "spokenPrompt": "In der Nacht sehen wir Sterne. Am Tag wärmt uns die fehlende Antwort."
  },
  "ew48": {
    "altAnswers": [
      "Schultasche",
      "Schulthek",
      "Thek",
      "Tornister",
      "Schulranzen",
      "Schulrucksack"
    ]
  },
  "sl14": {
    "question": "«Fido ist ein Hund.» Welches Tier ist Fido? ___",
    "hints": [
      "Lies den Satz noch einmal.",
      "Suche das Tierwort."
    ],
    "spokenPrompt": "«Fido ist ein Hund.» Welches Tier ist Fido? fehlende Antwort"
  },
  "sl18": {
    "altAnswers": [
      "erste",
      "1",
      "1. Klasse",
      "die erste Klasse",
      "in die erste Klasse"
    ]
  },
  "sl22": {
    "hints": [
      "Lies den Satz bis zum Ende.",
      "Suche, was mit den Blättern passiert."
    ]
  },
  "sl24": {
    "question": "«Die Katze sitzt auf dem Dach.» Wo sitzt die Katze? ___",
    "answer": "auf dem Dach",
    "altAnswers": [
      "Dach",
      "dem Dach"
    ],
    "spokenPrompt": "«Die Katze sitzt auf dem Dach.» Wo sitzt die Katze? fehlende Antwort"
  },
  "sl26": {
    "altAnswers": [
      "Fahrrad",
      "Velo",
      "mit dem Velo"
    ]
  },
  "sl30": {
    "answer": "am Abend",
    "altAnswers": [
      "Abend",
      "in der Nacht",
      "Nacht"
    ]
  },
  "sl32": {
    "question": "«Der Hase frisst Möhren und Salat.» Was frisst er? Schreibe beide Dinge mit «und»: ___",
    "spokenPrompt": "«Der Hase frisst Möhren und Salat.» Was frisst er? Schreibe beide Dinge mit «und»: fehlende Antwort"
  },
  "sl37": {
    "altAnswers": [
      "ein Buch"
    ]
  },
  "sl39": {
    "altAnswers": [
      "macht Hausaufgaben",
      "sie macht Hausaufgaben",
      "Hausaufgaben machen"
    ]
  },
  "sl43": {
    "altAnswers": [
      "ein Bonbon"
    ]
  },
  "sl45": {
    "question": "«Der Zug kommt um 9 Uhr an.» Um wie viel Uhr kommt der Zug an? ___",
    "answer": "9",
    "altAnswers": [
      "9 Uhr",
      "neun",
      "neun Uhr"
    ],
    "hints": [
      "Lies den Satz noch einmal.",
      "Suche die Uhrzeit nach «um»."
    ],
    "spokenPrompt": "«Der Zug kommt um 9 Uhr an.» Um wie viel Uhr kommt der Zug an? fehlende Antwort"
  },
  "g1gs1": {
    "question": "Welcher Satz erzählt etwas Sinnvolles?",
    "spokenPrompt": "Welcher Satz erzählt etwas Sinnvolles?"
  },
  "g1gs2": {
    "question": "Welcher Satz erzählt etwas Sinnvolles?",
    "spokenPrompt": "Welcher Satz erzählt etwas Sinnvolles?"
  },
  "g1gs3": {
    "question": "Welcher Satz erzählt etwas Sinnvolles?",
    "spokenPrompt": "Welcher Satz erzählt etwas Sinnvolles?"
  },
  "g1gs11": {
    "options": [
      "Heute spiele ich draussen.",
      "heute spiele ich draussen.",
      "heute Spiele ich draussen.",
      "heute spiele Ich draussen."
    ]
  },
  "g1gs12": {
    "question": "Welcher Aussagesatz endet mit einem Punkt?",
    "options": [
      "Wir gehen nach Hause.",
      "Wir gehen nach Hause",
      "Wir gehen nach Hause?",
      "Wir gehen nach Hause,"
    ],
    "spokenPrompt": "Welcher Aussagesatz endet mit einem Punkt?"
  },
  "g1gs22": {
    "question": "Noah fährt. Sein Velo ist rot. Welcher Satz sagt beides?",
    "spokenPrompt": "Noah fährt. Sein Velo ist rot. Welcher Satz sagt beides?"
  },
  "g1gs23": {
    "question": "Die Katze ist schwarz. Sie sitzt unter dem Baum. Welcher Satz sagt beides?",
    "spokenPrompt": "Die Katze ist schwarz. Sie sitzt unter dem Baum. Welcher Satz sagt beides?"
  },
  "g1gs28": {
    "altAnswers": [
      "Danach",
      "Anschliessend",
      "Nachher",
      "Daraufhin"
    ]
  },
  "g1gs29": {
    "altAnswers": [
      "Danach",
      "Anschliessend",
      "Nachher",
      "Daraufhin"
    ]
  },
  "g1gs43": {
    "question": "Welcher Satz sagt, welches Tier Noah sieht und wo es ist?",
    "spokenPrompt": "Welcher Satz sagt, welches Tier Noah sieht und wo es ist?"
  },
  "g1gs44": {
    "question": "Welche Notiz sagt, wo das Kind ist und wann es zurückkommt?",
    "spokenPrompt": "Welche Notiz sagt, wo das Kind ist und wann es zurückkommt?"
  },
  "g1gs50": {
    "question": "Welche Geschichte erzählt, dass Mia nach dem Umfallen noch einmal baut?",
    "spokenPrompt": "Welche Geschichte erzählt, dass Mia nach dem Umfallen noch einmal baut?"
  },
  "g1gs16": {
    "question": "Ordne die Wörter zu einem Satz. Beginne mit «Der».",
    "spokenPrompt": "Ordne die Wörter zu einem Satz. Beginne mit «Der»."
  },
  "g1gs17": {
    "question": "Ordne die Wörter zu einem Satz. Beginne mit «Lina».",
    "spokenPrompt": "Ordne die Wörter zu einem Satz. Beginne mit «Lina»."
  },
  "g1gs18": {
    "question": "Ordne die Wörter zu einem Satz. Beginne mit «Im».",
    "spokenPrompt": "Ordne die Wörter zu einem Satz. Beginne mit «Im»."
  },
  "g1gs20": {
    "question": "Ordne die Wörter zu einer Bitte. Beginne mit «Bitte».",
    "spokenPrompt": "Ordne die Wörter zu einer Bitte. Beginne mit «Bitte»."
  }
};
const caseCorrections: Record<string, Partial<Exercise>> = {"gk6": {"caseSensitiveAnswer": true}, "gk9": {"caseSensitiveAnswer": true}, "gk12": {"caseSensitiveAnswer": true}, "gk14": {"caseSensitiveAnswer": true}, "gk17": {"caseSensitiveAnswer": true}, "gk20": {"caseSensitiveAnswer": true}, "gk22": {"caseSensitiveAnswer": true}, "gk25": {"caseSensitiveAnswer": true}, "gk28": {"caseSensitiveAnswer": true}, "gk30": {"caseSensitiveAnswer": true}, "gk32": {"caseSensitiveAnswer": true}, "gk34": {"caseSensitiveAnswer": true}, "gk36": {"caseSensitiveAnswer": true}, "gk38": {"caseSensitiveAnswer": true}, "gk40": {"caseSensitiveAnswer": true}, "gk42": {"caseSensitiveAnswer": true}, "gk44": {"caseSensitiveAnswer": true}, "gk46": {"caseSensitiveAnswer": true}, "gk48": {"caseSensitiveAnswer": true}, "gk50": {"caseSensitiveAnswer": true}, "b29": {"caseSensitiveAnswer": true}};
const hintRefinements: Record<string, Partial<Exercise>> = {
  "ew1": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew2": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew3": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew4": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew5": {
    "hints": [
      "Stelle dir die Bedeutung des genannten Wortes vor.",
      "Gesucht ist ein Wort, das das Gegenteil bedeutet."
    ]
  },
  "ew6": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew8": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew9": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew10": {
    "hints": [
      "Stelle dir die Bedeutung des genannten Wortes vor.",
      "Gesucht ist ein Wort, das das Gegenteil bedeutet."
    ]
  },
  "ew11": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew12": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew13": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew15": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew19": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew20": {
    "hints": [
      "Stelle dir die Bedeutung des genannten Wortes vor.",
      "Gesucht ist ein Wort, das das Gegenteil bedeutet."
    ]
  },
  "ew21": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew24": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew25": {
    "hints": [
      "Stelle dir die Bedeutung des genannten Wortes vor.",
      "Gesucht ist ein Wort, das das Gegenteil bedeutet."
    ]
  },
  "ew26": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew27": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew28": {
    "hints": [
      "Stelle dir die Bedeutung des genannten Wortes vor.",
      "Gesucht ist ein Wort, das das Gegenteil bedeutet."
    ]
  },
  "ew29": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew32": {
    "hints": [
      "Stelle dir die Bedeutung des genannten Wortes vor.",
      "Gesucht ist ein Wort, das das Gegenteil bedeutet."
    ]
  },
  "ew33": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew34": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew35": {
    "hints": [
      "Stelle dir die Bedeutung des genannten Wortes vor.",
      "Gesucht ist ein Wort, das das Gegenteil bedeutet."
    ]
  },
  "ew38": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew40": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew41": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew42": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew44": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew45": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew47": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew48": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew49": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "ew50": {
    "hints": [
      "Lies die Frage und stelle dir die beschriebene Situation vor.",
      "Prüfe die Bedeutung des Wortes: Passt sie genau zur Frage?"
    ]
  },
  "g1gs1": {
    "hints": [
      "Lies den Satz langsam bis zum Ende.",
      "Stelle dir vor, was darin passiert. Passt das zu der beschriebenen Sache?"
    ]
  },
  "g1gs2": {
    "hints": [
      "Lies den Satz langsam bis zum Ende.",
      "Stelle dir vor, was darin passiert. Passt das zu der beschriebenen Sache?"
    ]
  },
  "g1gs3": {
    "hints": [
      "Lies den Satz langsam bis zum Ende.",
      "Stelle dir vor, was darin passiert. Passt das zu der beschriebenen Sache?"
    ]
  },
  "g1gs4": {
    "hints": [
      "Lies den Satz langsam bis zum Ende.",
      "Stelle dir vor, was darin passiert. Passt das zu der beschriebenen Sache?"
    ]
  },
  "g1gs5": {
    "hints": [
      "Lies den Satz langsam bis zum Ende.",
      "Stelle dir vor, was darin passiert. Passt das zu der beschriebenen Sache?"
    ]
  },
  "g1gs6": {
    "hints": [
      "Lies den Satz langsam bis zum Ende.",
      "Stelle dir vor, was darin passiert. Passt das zu der beschriebenen Sache?"
    ]
  },
  "g1gs7": {
    "hints": [
      "Lies den Satz langsam bis zum Ende.",
      "Stelle dir vor, was darin passiert. Passt das zu der beschriebenen Sache?"
    ]
  },
  "g1gs8": {
    "hints": [
      "Lies den Satz langsam bis zum Ende.",
      "Stelle dir vor, was darin passiert. Passt das zu der beschriebenen Sache?"
    ]
  },
  "g1gs9": {
    "hints": [
      "Lies den Satz langsam bis zum Ende.",
      "Stelle dir vor, was darin passiert. Passt das zu der beschriebenen Sache?"
    ]
  },
  "g1gs10": {
    "hints": [
      "Lies den Satz langsam bis zum Ende.",
      "Stelle dir vor, was darin passiert. Passt das zu der beschriebenen Sache?"
    ]
  },
  "g1gs11": {
    "hints": [
      "Prüfe den Satzanfang und das Zeichen am Schluss.",
      "Namen und Satzanfänge schreibt man gross. Eine Frage endet mit einem Fragezeichen."
    ]
  },
  "g1gs12": {
    "hints": [
      "Prüfe den Satzanfang und das Zeichen am Schluss.",
      "Namen und Satzanfänge schreibt man gross. Eine Frage endet mit einem Fragezeichen."
    ]
  },
  "g1gs13": {
    "hints": [
      "Prüfe den Satzanfang und das Zeichen am Schluss.",
      "Namen und Satzanfänge schreibt man gross. Eine Frage endet mit einem Fragezeichen."
    ]
  },
  "g1gs14": {
    "hints": [
      "Lies genau, welche Information in der Frage gesucht ist.",
      "Prüfe, ob die Antwort alle verlangten Angaben enthält."
    ]
  },
  "g1gs15": {
    "hints": [
      "Lies genau, welche Information in der Frage gesucht ist.",
      "Prüfe, ob die Antwort alle verlangten Angaben enthält."
    ]
  },
  "g1gs16": {
    "hints": [
      "Überlege, wer etwas tut und was geschieht.",
      "Lies deinen gelegten Satz laut. Setze das Satzzeichen an den Schluss."
    ]
  },
  "g1gs17": {
    "hints": [
      "Überlege, wer etwas tut und was geschieht.",
      "Lies deinen gelegten Satz laut. Setze das Satzzeichen an den Schluss."
    ]
  },
  "g1gs18": {
    "hints": [
      "Überlege, wer etwas tut und was geschieht.",
      "Lies deinen gelegten Satz laut. Setze das Satzzeichen an den Schluss."
    ]
  },
  "g1gs19": {
    "hints": [
      "Überlege, wer etwas tut und was geschieht.",
      "Lies deinen gelegten Satz laut. Setze das Satzzeichen an den Schluss."
    ]
  },
  "g1gs20": {
    "hints": [
      "Überlege, wer etwas tut und was geschieht.",
      "Lies deinen gelegten Satz laut. Setze das Satzzeichen an den Schluss."
    ]
  },
  "g1gs21": {
    "hints": [
      "Lies genau, welche Information in der Frage gesucht ist.",
      "Prüfe, ob die Antwort alle verlangten Angaben enthält."
    ]
  },
  "g1gs22": {
    "hints": [
      "Lies genau, welche Information in der Frage gesucht ist.",
      "Prüfe, ob die Antwort alle verlangten Angaben enthält."
    ]
  },
  "g1gs23": {
    "hints": [
      "Lies genau, welche Information in der Frage gesucht ist.",
      "Prüfe, ob die Antwort alle verlangten Angaben enthält."
    ]
  },
  "g1gs24": {
    "hints": [
      "Lies genau, welche Information in der Frage gesucht ist.",
      "Prüfe, ob die Antwort alle verlangten Angaben enthält."
    ]
  },
  "g1gs25": {
    "hints": [
      "Lies genau, welche Information in der Frage gesucht ist.",
      "Prüfe, ob die Antwort alle verlangten Angaben enthält."
    ]
  },
  "g1gs26": {
    "hints": [
      "Beide Tätigkeiten oder Dinge sollen im Satz bleiben.",
      "Suche ein kurzes Wort, das beides verbindet."
    ]
  },
  "g1gs27": {
    "hints": [
      "Beide Tätigkeiten oder Dinge sollen im Satz bleiben.",
      "Suche ein kurzes Wort, das beides verbindet."
    ]
  },
  "g1gs28": {
    "hints": [
      "Was passiert zuerst und was kommt danach?",
      "Gesucht ist ein Wort, das den nächsten Schritt einleitet."
    ]
  },
  "g1gs29": {
    "hints": [
      "Was passiert zuerst und was kommt danach?",
      "Gesucht ist ein Wort, das den nächsten Schritt einleitet."
    ]
  },
  "g1gs30": {
    "hints": [
      "Der zweite Satz nennt die Folge des Regens.",
      "Wähle das Wort, das einen Grund mit seiner Folge verbindet."
    ]
  },
  "g1gs31": {
    "hints": [
      "Überlege, wozu diese Karte oder Liste dienen soll.",
      "Prüfe, ob die andere Person die Nachricht gut verstehen kann."
    ]
  },
  "g1gs32": {
    "hints": [
      "Überlege, wozu diese Karte oder Liste dienen soll.",
      "Prüfe, ob die andere Person die Nachricht gut verstehen kann."
    ]
  },
  "g1gs33": {
    "hints": [
      "Überlege, wozu diese Karte oder Liste dienen soll.",
      "Prüfe, ob die andere Person die Nachricht gut verstehen kann."
    ]
  },
  "g1gs34": {
    "hints": [
      "Überlege, wozu diese Karte oder Liste dienen soll.",
      "Prüfe, ob die andere Person die Nachricht gut verstehen kann."
    ]
  },
  "g1gs35": {
    "hints": [
      "Überlege, wozu diese Karte oder Liste dienen soll.",
      "Prüfe, ob die andere Person die Nachricht gut verstehen kann."
    ]
  },
  "g1gs36": {
    "hints": [
      "Lies die Handlungsschritte der Reihe nach.",
      "Prüfe, ob jeder Schritt zum vorherigen passt und die Frage beantwortet wird."
    ]
  },
  "g1gs37": {
    "hints": [
      "Lies die Handlungsschritte der Reihe nach.",
      "Prüfe, ob jeder Schritt zum vorherigen passt und die Frage beantwortet wird."
    ]
  },
  "g1gs38": {
    "hints": [
      "Lies die Handlungsschritte der Reihe nach.",
      "Prüfe, ob jeder Schritt zum vorherigen passt und die Frage beantwortet wird."
    ]
  },
  "g1gs39": {
    "hints": [
      "Lies genau, welche Information in der Frage gesucht ist.",
      "Prüfe, ob die Antwort alle verlangten Angaben enthält."
    ]
  },
  "g1gs40": {
    "hints": [
      "Lies genau, welche Information in der Frage gesucht ist.",
      "Prüfe, ob die Antwort alle verlangten Angaben enthält."
    ]
  },
  "g1gs41": {
    "hints": [
      "Lies genau, welche Information in der Frage gesucht ist.",
      "Prüfe, ob die Antwort alle verlangten Angaben enthält."
    ]
  },
  "g1gs42": {
    "hints": [
      "Lies genau, welche Information in der Frage gesucht ist.",
      "Prüfe, ob die Antwort alle verlangten Angaben enthält."
    ]
  },
  "g1gs43": {
    "hints": [
      "Lies genau, welche Information in der Frage gesucht ist.",
      "Prüfe, ob die Antwort alle verlangten Angaben enthält."
    ]
  },
  "g1gs44": {
    "hints": [
      "Lies genau, welche Information in der Frage gesucht ist.",
      "Prüfe, ob die Antwort alle verlangten Angaben enthält."
    ]
  },
  "g1gs45": {
    "hints": [
      "Prüfe den Satzanfang und das Zeichen am Schluss.",
      "Namen und Satzanfänge schreibt man gross. Eine Frage endet mit einem Fragezeichen."
    ]
  },
  "g1gs46": {
    "hints": [
      "Prüfe den Satzanfang und das Zeichen am Schluss.",
      "Namen und Satzanfänge schreibt man gross. Eine Frage endet mit einem Fragezeichen."
    ]
  },
  "g1gs47": {
    "hints": [
      "Prüfe den Satzanfang und das Zeichen am Schluss.",
      "Namen und Satzanfänge schreibt man gross. Eine Frage endet mit einem Fragezeichen."
    ]
  },
  "g1gs48": {
    "hints": [
      "Wer ist im ersten Satz gemeint?",
      "Ersetze den Namen durch ein kurzes Wort für dieselbe Person."
    ]
  },
  "g1gs49": {
    "hints": [
      "Wer ist im ersten Satz gemeint?",
      "Ersetze den Namen durch ein kurzes Wort für dieselbe Person."
    ]
  },
  "g1gs50": {
    "hints": [
      "Lies die Handlungsschritte der Reihe nach.",
      "Prüfe, ob jeder Schritt zum vorherigen passt und die Frage beantwortet wird."
    ]
  }
};
export function applyGrade1DeutschQaCorrections(exercise: Exercise): Exercise {
 const correction = corrections[exercise.id] || caseCorrections[exercise.id] || hintRefinements[exercise.id];
 return correction ? {...exercise, ...correction, ...caseCorrections[exercise.id], ...hintRefinements[exercise.id]} : exercise;
}
