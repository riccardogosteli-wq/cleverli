#!/usr/bin/env python3
"""
translate-exercises.py
======================
Translates Cleverli exercise questions, hints, and options from German to English.
Adds questionEN, hintsEN, optionsEN fields to all exercises.

Strategy:
- Pure math formulas (3+4=___): keep as-is (universal)
- German instruction phrases: translate with known patterns
- Word problems: translate with contextual awareness
- Options: translate each option individually
- Hints: translate naturally, keeping child-appropriate tone

Run: python3 scripts/translate-exercises.py
"""

import re
import os

# ── Translation dictionaries ──────────────────────────────────────────────────

# Common question openers
QUESTION_PATTERNS = [
    # Instruction starters
    (r'^Wie viele (.+) siehst du\?$', lambda m: f"How many {translate_noun(m.group(1))} do you see?"),
    (r'^Wie viele (.+) gibt es\?$', lambda m: f"How many {translate_noun(m.group(1))} are there?"),
    (r'^Wie viele (.+) hat (.+)\?$', lambda m: f"How many {translate_noun(m.group(1))} does {m.group(2)} have?"),
    (r'^Welche Zahl kommt nach der (\d+)\?$', lambda m: f"What number comes after {m.group(1)}?"),
    (r'^Welche Zahl kommt vor der (\d+)\?$', lambda m: f"What number comes before {m.group(1)}?"),
    (r'^Welche Zahl ist die grösste\?$', lambda m: "Which number is the biggest?"),
    (r'^Welche Zahl ist die kleinste\?$', lambda m: "Which number is the smallest?"),
    (r'^Welche Zahlen? liegt zwischen (.+) und (.+)\?$', lambda m: f"Which number is between {m.group(1)} and {m.group(2)}?"),
    (r'^Welche Zahl ist grösser\?$', lambda m: "Which number is greater?"),
    (r'^Welche Zahl ist kleiner\?$', lambda m: "Which number is smaller?"),
    (r'^Ergänze die Reihe: (.+)$', lambda m: f"Complete the sequence: {m.group(1)}"),
    (r'^Ergänze die Zahlenreihe: (.+)$', lambda m: f"Complete the number sequence: {m.group(1)}"),
    (r'^Ergänze:? (.+)$', lambda m: f"Fill in the blank: {m.group(1)}"),
    (r'^Zeige die Zahl (\d+) auf dem Zahlenstrahl!$', lambda m: f"Show the number {m.group(1)} on the number line!"),
    (r'^Wo liegt die Zahl (\d+) auf dem Zahlenstrahl\?$', lambda m: f"Where is the number {m.group(1)} on the number line?"),
    (r'^Was kommt vor der (\d+)\?(.+)$', lambda m: f"What comes before {m.group(1)}? {m.group(2)}"),
    (r'^Was kommt nach der (\d+)\?(.+)$', lambda m: f"What comes after {m.group(1)}? {m.group(2)}"),
    (r'^Was ist die Zahl (.+)\?$', lambda m: f"What is the number {m.group(1)}?"),
    (r'^Was ist (\d+) mehr als (\d+)\?$', lambda m: f"What is {m.group(1)} more than {m.group(2)}?"),
    (r'^Was ist (\d+) weniger als (\d+)\?$', lambda m: f"What is {m.group(1)} less than {m.group(2)}?"),
    (r'^Ordne die Zahlen von klein nach gross!(.*)$', lambda m: f"Sort the numbers from smallest to largest!{m.group(1)}"),
    (r'^Ordne von gross nach klein(.*)$', lambda m: f"Sort from largest to smallest{m.group(1)}"),
    (r'^Finde alle Zahlenpaare(.*)$', lambda m: f"Find all number pairs{m.group(1)}"),
    (r'^Sortiere: (.+)$', lambda m: f"Sort: {m.group(1)}"),
    (r'^Welche Gruppe enthält(.+)$', lambda m: f"Which group contains{translate_phrase(m.group(1))}"),
    (r'^Welche Aussage stimmt\?$', lambda m: "Which statement is correct?"),
    (r'^Welche Rechnung stimmt\?$', lambda m: "Which calculation is correct?"),
    (r'^Welche zwei Zahlen ergeben zusammen (\d+)\?(.*)$', lambda m: f"Which two numbers add up to {m.group(1)}?{m.group(2)}"),
    (r'^Schreibe die Zahl nach der (\d+): (.+)$', lambda m: f"Write the number after {m.group(1)}: {m.group(2)}"),
    (r'^Wie heisst die Zahl (\d+)\?$', lambda m: f"What is the name of the number {m.group(1)}?"),
    (r'^Verteile (.+)$', lambda m: f"Distribute {translate_phrase(m.group(1))}"),
    (r'^Welche Gruppe hat (.+)\?$', lambda m: f"Which group has {translate_phrase(m.group(1))}?"),
    (r'^Was fehlt\?(.+)$', lambda m: f"What is missing?{m.group(1)}"),
    (r'^Was steht vor der (\d+)\?(.*)$', lambda m: f"What comes before {m.group(1)}?{m.group(2)}"),
    # Addition/Subtraction word problems
    (r'^(\d+) Vögel sitzen auf einem Baum\. (\d+) fliegen weg', lambda m: f"{m.group(1)} birds sit on a tree. {m.group(2)} fly away"),
    # Comparison operators
    (r'^10 > ___ \(kleiner als 10\)$', lambda m: "10 > ___ (less than 10)"),
]

# German nouns → English
NOUN_MAP = {
    'Äpfel': 'apples', 'Apfel': 'apples',
    'Sterne': 'stars', 'Stern': 'star',
    'Blumen': 'flowers', 'Blume': 'flower',
    'Vögel': 'birds', 'Vogel': 'bird',
    'Frösche': 'frogs', 'Frosch': 'frog',
    'Bienen': 'bees', 'Biene': 'bee',
    'Sonnenblumen': 'sunflowers', 'Sonnenblume': 'sunflower',
    'Schmetterlinge': 'butterflies', 'Schmetterling': 'butterfly',
    'Katzen': 'cats', 'Katze': 'cat',
    'Hunde': 'dogs', 'Hund': 'dog',
    'Kinder': 'children', 'Kind': 'child',
    'Punkte': 'dots', 'Punkt': 'dot',
    'Murmeln': 'marbles', 'Murmel': 'marble',
    'Früchte': 'fruits', 'Frucht': 'fruit',
    'Bonbons': 'sweets', 'Bonbon': 'sweet',
    'Bücher': 'books', 'Buch': 'book',
    'Autos': 'cars', 'Auto': 'car',
    'Tiere': 'animals', 'Tier': 'animal',
    'Felder': 'fields', 'Feld': 'field',
    'Kugeln': 'balls', 'Kugel': 'ball',
    'Pralinen': 'chocolates', 'Praline': 'chocolate',
    'Herzchen': 'hearts',
    'Punkte auf dem Würfel': 'dots on the dice',
    'Würfel': 'dice',
    'Ballons': 'balloons', 'Ballon': 'balloon',
    'Blüten': 'petals', 'Blüte': 'petal',
    'Punkte auf dem Würfel': 'dots on the die',
}

# Common German phrases in questions → English
PHRASE_MAP = {
    'Wie viele': 'How many',
    'Welche Zahl': 'Which number',
    'Welche Zahlen': 'Which numbers',
    'Welche Gruppe': 'Which group',
    'Welche Aussage': 'Which statement',
    'Welche Rechnung': 'Which calculation',
    'Was fehlt': 'What is missing',
    'Was kommt': 'What comes',
    'Ergänze': 'Fill in the blank',
    'Schreibe': 'Write',
    'Zeige': 'Show',
    'Ordne': 'Sort',
    'Verteile': 'Distribute',
    'Sortiere': 'Sort',
    'Finde': 'Find',
    'Berechne': 'Calculate',
    'Löse': 'Solve',
    'Zähle': 'Count',
    'Verbinde': 'Connect',
    'Zeichne': 'Draw',
    'Messe': 'Measure',
    'Runde': 'Round',
    'Schätze': 'Estimate',
    'Bestimme': 'Determine',
    'Stelle dar': 'Show',
    'Übertrage': 'Transfer',
    'die kleinste': 'the smallest',
    'die grösste': 'the largest',
    'die grösste Zahl': 'the largest number',
    'die kleinste Zahl': 'the smallest number',
    'kleiner als': 'less than',
    'grösser als': 'greater than',
    'gleich': 'equal to',
    'mehr als': 'more than',
    'weniger als': 'less than',
    'auf dem Zahlenstrahl': 'on the number line',
    'von klein nach gross': 'from smallest to largest',
    'von gross nach klein': 'from largest to smallest',
    'Gerade': 'Even',
    'Ungerade': 'Odd',
    'gerade': 'even',
    'ungerade': 'odd',
    'die Hälfte': 'half',
    'das Doppelte': 'double',
    'das Dreifache': 'triple',
    'zusammen': 'together',
    'insgesamt': 'in total',
    'übrig': 'left over',
    'noch': 'still',
    'jetzt': 'now',
    'nach': 'after',
    'vor': 'before',
    'zwischen': 'between',
    'Stück': 'pieces',
    'Teile': 'parts',
    'Abschnitte': 'sections',
    'Zentimeter': 'centimetres',
    'Meter': 'metres',
    'Kilometer': 'kilometres',
    'Gramm': 'grams',
    'Kilogramm': 'kilograms',
    'Liter': 'litres',
    'Milliliter': 'millilitres',
    'Franken': 'francs',
    'Rappen': 'centimes',
    'Uhr': "o'clock",
    'Minuten': 'minutes',
    'Stunden': 'hours',
    'Tage': 'days',
    'Wochen': 'weeks',
    'Monate': 'months',
    'Jahre': 'years',
    'Zahlenstrahl': 'number line',
    'Zahlenreihe': 'number sequence',
    'Zahlen': 'numbers',
    'Zahl': 'number',
    'Stelle': 'position',
    'Einerstelle': 'ones place',
    'Zehnerstelle': 'tens place',
    'Hunderterstelle': 'hundreds place',
    'Tausenderstelle': 'thousands place',
    'Einmaleins': 'times tables',
    'Multipliziere': 'Multiply',
    'Dividiere': 'Divide',
    'Addiere': 'Add',
    'Subtrahiere': 'Subtract',
    'Produkt': 'product',
    'Summe': 'sum',
    'Differenz': 'difference',
    'Quotient': 'quotient',
    'Rest': 'remainder',
    'Bruch': 'fraction',
    'Brüche': 'fractions',
    'Zähler': 'numerator',
    'Nenner': 'denominator',
    'gemischte Zahl': 'mixed number',
    'Dezimalzahl': 'decimal number',
    'Dezimalzahlen': 'decimal numbers',
    'Komma': 'decimal point',
    'Fläche': 'area',
    'Umfang': 'perimeter',
    'Volumen': 'volume',
    'Länge': 'length',
    'Breite': 'width',
    'Höhe': 'height',
    'Seite': 'side',
    'Radius': 'radius',
    'Durchmesser': 'diameter',
    'Kreisumfang': 'circumference',
    'Dreieck': 'triangle',
    'Viereck': 'quadrilateral',
    'Rechteck': 'rectangle',
    'Quadrat': 'square',
    'Kreis': 'circle',
    'Würfel': 'cube',
    'Quader': 'cuboid',
    'Kugel': 'sphere',
    'Zylinder': 'cylinder',
    'Kegel': 'cone',
    'Pyramide': 'pyramid',
    'Ecke': 'corner', 'Ecken': 'corners',
    'Kante': 'edge', 'Kanten': 'edges',
    'Fläche': 'face', 'Flächen': 'faces',
    'Achse': 'axis', 'Achsen': 'axes',
    'Gerade': 'straight line',
    'Winkel': 'angle',
    'rechter Winkel': 'right angle',
    'spitzer Winkel': 'acute angle',
    'stumpfer Winkel': 'obtuse angle',
    'parallel': 'parallel',
    'senkrecht': 'perpendicular',
    'symmetrisch': 'symmetrical',
    'Symmetrieachse': 'axis of symmetry',
    'Spiegelbild': 'mirror image',
}

def translate_noun(german_noun):
    """Translate a German noun to English."""
    return NOUN_MAP.get(german_noun, german_noun)

def translate_phrase(text):
    """Translate common German phrases."""
    result = text
    for de, en in sorted(PHRASE_MAP.items(), key=lambda x: -len(x[0])):
        result = result.replace(de, en)
    return result

def translate_question(q):
    """Translate a German question to English."""
    # Pure math formula - no translation needed
    if re.match(r'^[\d\s\+\-\×\÷\*\/\=\_\(\)\.\,²³π√°<>≤≥≠]+$', q.replace('?','').replace('!','').strip()):
        return q
    
    # Try pattern matching first
    for pattern, translator in QUESTION_PATTERNS:
        m = re.match(pattern, q)
        if m:
            return translator(m)
    
    # Fallback: phrase substitution
    result = q
    
    # Common question openers
    result = result.replace('Wie viele ', 'How many ')
    result = result.replace('Welche Zahl kommt nach der ', 'What number comes after ')
    result = result.replace('Welche Zahl kommt vor der ', 'What number comes before ')
    result = result.replace('Welche Zahl ist die grösste?', 'Which number is the biggest?')
    result = result.replace('Welche Zahl ist die kleinste?', 'Which number is the smallest?')
    result = result.replace('Welche Zahl liegt zwischen ', 'Which number is between ')
    result = result.replace('Was kommt als nächstes', 'What comes next')
    result = result.replace('Was kommt vor der ', 'What comes before ')
    result = result.replace('Was kommt nach der ', 'What comes after ')
    result = result.replace('Was fehlt?', 'What is missing?')
    result = result.replace('Was ist ', 'What is ')
    result = result.replace('Was steht vor der ', 'What comes before ')
    result = result.replace('Ergänze die Reihe:', 'Complete the sequence:')
    result = result.replace('Ergänze die Zahlenreihe:', 'Complete the number sequence:')
    result = result.replace('Ergänze:', 'Fill in the blank:')
    result = result.replace('Ergänze ', 'Fill in: ')
    result = result.replace('Schreibe ', 'Write ')
    result = result.replace('Zeige ', 'Show ')
    result = result.replace('Ordne ', 'Sort ')
    result = result.replace('Verteile ', 'Distribute ')
    result = result.replace('Sortiere:', 'Sort:')
    result = result.replace('Sortiere ', 'Sort ')
    result = result.replace('Finde alle Zahlenpaare', 'Find all number pairs')
    result = result.replace('Finde ', 'Find ')
    result = result.replace('Berechne ', 'Calculate ')
    result = result.replace('Löse ', 'Solve ')
    result = result.replace('Zähle ', 'Count ')
    result = result.replace('Verbinde ', 'Match ')
    result = result.replace('Messe ', 'Measure ')
    result = result.replace('Runde ', 'Round ')
    result = result.replace('Schätze ', 'Estimate ')
    result = result.replace('Bestimme ', 'Determine ')
    result = result.replace('Stelle dar ', 'Show ')
    result = result.replace('Welche Aussage stimmt?', 'Which statement is correct?')
    result = result.replace('Welche Rechnung stimmt?', 'Which calculation is correct?')
    result = result.replace('Welche Gruppe hat ', 'Which group has ')
    result = result.replace('Welche Gruppe enthält ', 'Which group contains ')
    result = result.replace('Welche ', 'Which ')
    result = result.replace('Wer hat ', 'Who has ')
    result = result.replace('Wohin gehört ', 'Where does ')
    result = result.replace('Wie heisst ', 'What is the name of ')
    result = result.replace('Wie gross ', 'How big ')
    result = result.replace('Wie lang ', 'How long ')
    result = result.replace('Wie schwer ', 'How heavy ')
    result = result.replace('Wie viel ', 'How much ')
    result = result.replace('Womit rechnet man ', 'What operation is used for ')
    
    # Apply phrase translations
    result = translate_phrase(result)
    
    # German nouns in word problems
    for de, en in NOUN_MAP.items():
        result = result.replace(de, en)
    
    return result

def translate_hint(h):
    """Translate a German hint to English."""
    result = h
    
    # Common hint patterns
    result = result.replace('Zähle ', 'Count ')
    result = result.replace('Zähle:', 'Count:')
    result = result.replace('zähle ', 'count ')
    result = result.replace('Schau, ', 'Look, ')
    result = result.replace('Schau dir ', 'Look at ')
    result = result.replace('Denke an ', 'Think of ')
    result = result.replace('Denke:', 'Think:')
    result = result.replace('Denk:', 'Think:')
    result = result.replace('Probiere:', 'Try:')
    result = result.replace('Probiere ', 'Try ')
    result = result.replace('Merke dir', 'Remember')
    result = result.replace('Fang mit ', 'Start with ')
    result = result.replace('Fang an', 'Start ')
    result = result.replace('Rechne:', 'Calculate:')
    result = result.replace('Rechne ', 'Calculate: ')
    result = result.replace('Von ', 'From ')
    result = result.replace('von ', 'from ')
    result = result.replace('bis ', 'to ')
    result = result.replace('aus zwei Richtungen', 'from both sides')
    result = result.replace('auf dem Zahlenstrahl', 'on the number line')
    result = result.replace('in der Mitte', 'in the middle')
    result = result.replace('nach links', 'to the left')
    result = result.replace('nach rechts', 'to the right')
    result = result.replace('Schritt für Schritt', 'step by step')
    result = result.replace('mit dem Finger', 'with your finger')
    result = result.replace('gleichmässig', 'evenly')
    result = result.replace('kannst du', 'you can')
    result = result.replace('Zeige mit', 'Show with')
    result = result.replace('wie die sieben Wochentage', 'like the seven days of the week')
    result = result.replace('Schiebe den Regler', 'Move the slider')
    result = result.replace('ganz nach links', 'all the way to the left')
    result = result.replace('ganz nach rechts', 'all the way to the right')
    
    # Apply phrase translations for math terms
    result = translate_phrase(result)
    for de, en in NOUN_MAP.items():
        result = result.replace(de, en)
    
    return result

def translate_option(opt):
    """Translate a German option to English."""
    # Numbers and math symbols - keep as-is
    if re.match(r'^[\d\s\+\-\×\÷\*\/\=\_\(\)\.\,²³π√°<>≤≥≠%]+$', opt.strip()):
        return opt
    
    result = translate_phrase(opt)
    for de, en in NOUN_MAP.items():
        result = result.replace(de, en)
    
    # Common option phrases
    result = result.replace('Keine Veränderung', 'No change')
    result = result.replace('Kein Unterschied', 'No difference')
    result = result.replace('Beide gleich', 'Both the same')
    result = result.replace('alle gleich', 'all the same')
    result = result.replace('Wahr', 'True')
    result = result.replace('Falsch', 'False')
    result = result.replace('Ja', 'Yes')
    result = result.replace('Nein', 'No')
    result = result.replace('Immer', 'Always')
    result = result.replace('Nie', 'Never')
    result = result.replace('Manchmal', 'Sometimes')
    result = result.replace('und ', 'and ')
    result = result.replace(' oder ', ' or ')
    
    return result

# ── Main processing ────────────────────────────────────────────────────────────

print("Starting English translation of math exercises...")

# Process grade 1-6 math first
for g in range(1, 7):
    filepath = f'src/data/grade{g}/math.ts'
    if not os.path.exists(filepath):
        continue
    
    with open(filepath) as f:
        content = f.read()
    
    lines = content.split('\n')
    new_lines = []
    translated = 0
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check if this line has a question field (exercise line)
        if 'question:' in line and ('type:' in line or True):
            # Extract question
            q_match = re.search(r'question:\s*"((?:[^"\\]|\\.)*)"', line)
            if q_match and 'questionEN' not in line:
                q_de = q_match.group(1)
                q_en = translate_question(q_de)
                
                if q_en != q_de:
                    # Insert questionEN after question
                    new_line = line.replace(
                        f'question: "{q_de}"',
                        f'question: "{q_de}", questionEN: "{q_en}"'
                    )
                    
                    # Also translate hints if on same line
                    hints_match = re.search(r'hints:\s*\[((?:[^\[\]]|\[.*?\])*)\]', new_line)
                    if hints_match:
                        hints_raw = hints_match.group(1)
                        hints = re.findall(r'"((?:[^"\\]|\\.)*)"', hints_raw)
                        if hints:
                            hints_en = [translate_hint(h) for h in hints]
                            hints_en_str = ', '.join([f'"{h}"' for h in hints_en])
                            hints_de_str = ', '.join([f'"{h}"' for h in hints])
                            new_line = new_line.replace(
                                f'hints: [{hints_raw}]',
                                f'hints: [{hints_raw}], hintsEN: [{hints_en_str}]'
                            )
                    
                    # Also translate options if on same line and not numbers only
                    opts_match = re.search(r'options:\s*\[((?:[^\[\]]|\[.*?\])*)\]', new_line)
                    if opts_match and 'optionsEN' not in new_line:
                        opts_raw = opts_match.group(1)
                        opts = re.findall(r'"((?:[^"\\]|\\.)*)"', opts_raw)
                        if opts:
                            opts_en = [translate_option(o) for o in opts]
                            if opts_en != opts:  # Only add if something changed
                                opts_en_str = ', '.join([f'"{o}"' for o in opts_en])
                                new_line = new_line.replace(
                                    f'options: [{opts_raw}]',
                                    f'options: [{opts_raw}], optionsEN: [{opts_en_str}]'
                                )
                    
                    lines[i] = new_line
                    translated += 1
        
        new_lines.append(lines[i])
        i += 1
    
    with open(filepath, 'w') as f:
        f.write('\n'.join(new_lines))
    
    print(f'  grade{g}/math.ts: {translated} questions translated')

print("Math translations complete.")
