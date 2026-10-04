from pathlib import Path
import json,base64,html,re
D=Path(__file__).parent
LOGO='data:image/png;base64,'+base64.b64encode((D/'assets/cleverli-logo-tight.png').read_bytes()).decode()
CSS='''@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font:12pt Arial,sans-serif;color:#213b49;-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{width:210mm;height:297mm;padding:13mm 15mm;position:relative;break-after:page}.page:last-child{break-after:auto}.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:5mm}.top img{width:40mm}.tag{font-size:9pt;border:1px solid #9cafb7;border-radius:6mm;padding:2mm 3mm}h1{font-size:23pt;line-height:1.15;margin:0 0 3mm}p{line-height:1.45;margin:0 0 3mm}.fields{font-size:10pt;margin:4mm 0}.goal{background:#fff9ed;border-left:3px solid #c68b30;padding:3mm 4mm;font-size:11pt;line-height:1.45}.section{margin-top:5mm}h2{font-size:13pt;margin:0 0 3mm}.number{display:inline-block;text-align:center;background:#eaf4f7;border:1px solid #8daebc;border-radius:50%;width:6mm;height:6mm;margin-right:2mm;font-size:11pt}.grid{display:grid;grid-template-columns:1fr 1fr;gap:3mm 6mm}.item{font-size:12pt;line-height:1.5;min-height:10mm}.blank{display:inline-block;min-width:18mm;height:9mm;border-bottom:1px solid #647982;vertical-align:bottom;text-align:center;line-height:8.5mm}.writing{display:block;height:12mm;border-bottom:1px solid #647982;margin:0 0 1mm}.answer{font-weight:bold;color:#175c55}.wide{grid-column:1/-1}.illustration{display:block;max-width:100%;height:20mm;margin:2mm 0}.footer{position:absolute;left:15mm;right:15mm;bottom:10mm;border-top:1px solid #c1cfd4;padding-top:2mm;font-size:8pt;display:flex;justify-content:space-between;line-height:1.4}.note{font-size:9pt;line-height:1.45;margin-top:5mm;border-top:1px solid #bdcdd3;padding-top:3mm}.note a{color:#24576b}.solutions .item{font-size:11pt;min-height:8mm}.solutions .section{margin-top:4mm}.solutions .goal{font-size:10pt}svg text{font-family:Arial,sans-serif;fill:#213b49}.drawing-area{display:block;border:1px solid #9cafb7;border-radius:2mm;margin:3mm 0 1mm;background:white}.grade1-reading{font-size:9pt;margin-top:2mm}'''
SUBJECTS={'math':'Mathematik','german':'Deutsch','science':'Natur, Mensch, Gesellschaft','english':'Englisch','french':'Französisch','mi':'Medien und Informatik'}
def esc(s):return html.escape(str(s))
def dots(n):
 return '<svg class="illustration" viewBox="0 0 200 48" xmlns="http://www.w3.org/2000/svg">'+''.join(f'<circle class="count-dot" cx="{10+(i%10)*19}" cy="{12+(i//10)*24}" r="7" fill="#deebed" stroke="#385a68"/>' for i in range(n))+'</svg>'
def shapes(kind):
 return '<svg class="illustration" viewBox="0 0 110 48" xmlns="http://www.w3.org/2000/svg">'+{'circle':'<circle cx="45" cy="24" r="19"/>','square':'<rect x="25" y="5" width="38" height="38"/>','rectangle':'<rect x="15" y="7" width="76" height="34"/>','triangle':'<polygon points="20,43 45,5 70,43"/>'}[kind].replace('/>',' fill="#deebed" stroke="#385a68" stroke-width="1.5"/>')+'</svg>'
def sec(title,items,instruction=''):return {'title':title,'instruction':instruction,'items':items}
def q(prompt,answer,**kw):return {'prompt':prompt,'answer':str(answer),**kw}
def arithmetic(ops):return [q(f'{a} {op} {b} =',a+b if op=='+' else a-b,check={'kind':'arithmetic','a':a,'b':b,'op':op}) for a,op,b in ops]
def make(slug,goal,sections,code='MA.1.A.2',scope='Zählen und Zahlen ordnen.',area=1):return {'grade':1,'subject':'math','sourceId':slug,'goal':goal,'sections':sections,'mapping':{'code':code,'scope':scope,'url':f'https://v-fe.lehrplan.ch/index.php?code=b%7C5%7C0%7C{area}'}}
DATA=[]
DATA.append(make('zahlen-1-10','Jeder Punkt zählt einmal. Beispiel: Nach 4 kommt 5.',[
sec('Zähle die Punkte.',[q('Wie viele?',n,svg=dots(n),check={'kind':'count','n':n}) for n in [3,7,5,9]]),
sec('Welche Zahl fehlt?',[q('1, 2, __, 4',3),q('4, 5, __, 7',6),q('6, __, 8, 9',7),q('7, 8, __, 10',9)]),
sec('Eine Zahl davor, eine danach.',[q('Vor 5 steht',4),q('Nach 8 steht',9),q('Vor 10 steht',9),q('Nach 2 steht',3)])]))
DATA.append(make('addition-bis-10','Plus bedeutet: Es kommt etwas dazu. Beispiel: 3 + 2 = 5.',[
sec('Zwei Gruppen zusammen.',[q('2 Punkte und 3 Punkte sind',5,svg=dots(2)+dots(3)),q('4 Punkte und 2 Punkte sind',6,svg=dots(4)+dots(2))]),
sec('Rechne.',arithmetic([(1,'+',4),(3,'+',3),(5,'+',2),(6,'+',4),(7,'+',1),(2,'+',6)])),
sec('Löse die kleine Geschichte.',[q('Auf einem Ast sitzen 4 Vögel. 3 kommen dazu. Wie viele Vögel sitzen nun dort?','4 + 3 = 7 Vögel',wide=True,lines=2)])],code='MA.1.A.3',scope='Addieren im Zahlenraum bis 10.'))
DATA.append(make('subtraktion-bis-10','Minus bedeutet hier: Es geht etwas weg. Beispiel: 6 − 2 = 4.',[
sec('Streiche weg. Wie viele bleiben?',[q('7 Punkte: Streiche 2 durch.',5,svg=dots(7)),q('5 Punkte: Streiche 3 durch.',2,svg=dots(5))]),
sec('Rechne.',arithmetic([(8,'−',3),(9,'−',4),(6,'−',1),(10,'−',7),(7,'−',7),(4,'−',0)])),
sec('Löse die kleine Geschichte.',[q('In einer Schale liegen 8 Äpfel. 3 werden gegessen. Wie viele bleiben?','8 − 3 = 5 Äpfel',wide=True,lines=2)])],code='MA.1.A.3',scope='Subtrahieren im Zahlenraum bis 10.'))
DATA.append(make('formen','Ein Dreieck hat 3 Ecken. Ein Quadrat hat 4 gleich lange Seiten und 4 rechte Winkel.',[
sec('Benenne die Formen.',[q('Name:',name,svg=shapes(k)) for k,name in [('circle','Kreis'),('triangle','Dreieck'),('square','Quadrat'),('rectangle','Rechteck')]]),
sec('Wie viele Ecken?',[q('Dreieck:',3),q('Quadrat:',4),q('Kreis:',0),q('Rechteck:',4)]),
sec('Zeichne selbst.',[q('Zeichne ein Dreieck und daneben einen Kreis.','Dreieck mit 3 geraden Seiten; geschlossener Kreis ohne Ecken.',wide=True,lines=3)])],code='MA.2.A.1',scope='Kreis, Dreieck, Quadrat und Rechteck erkennen und benennen.',area=2))
DATA.append(make('vergleichen','Die offene Seite zeigt zur grösseren Zahl. Beispiel: 7 > 3. Gleich grosse Zahlen: 4 = 4.',[
sec('Setze <, > oder = ein.',[q(f'{a} __ {b}','<' if a<b else '>' if a>b else '=') for a,b in [(3,8),(9,5),(6,6),(10,7),(2,4),(8,8)]]),
sec('Ordne von klein nach gross.',[q('6, 2, 9','2, 6, 9',wide=True),q('10, 4, 7','4, 7, 10',wide=True)]),
sec('Denke genau nach.',[q('Nenne eine Zahl, die grösser als 5 und kleiner als 8 ist.','6 oder 7',wide=True),q('Mia hat 7 Steine, Ben hat 5. Wer hat mehr? Wie viele mehr?','Mia; 2 Steine mehr',wide=True,lines=1)])]))
DATA.append(make('muster','Suche zuerst die Regel. Beispiel: 2, 4, 6, 8. Es kommen immer 2 dazu.',[
sec('Setze die Zahlenreihe fort.',[q('1, 2, 3, __, __','4, 5'),q('2, 4, 6, __, __','8, 10'),q('10, 9, 8, __, __','7, 6'),q('1, 3, 5, __, __','7, 9')]),
sec('Wiederhole das Muster.',[q('Kreis, Quadrat, Kreis, Quadrat, __, __','Kreis, Quadrat',wide=True),q('A, A, B, A, A, B, __, __, __','A, A, B',wide=True)]),
sec('Erfinde ein eigenes Muster.',[q('Zeichne eine Folge mit Kreis und Dreieck. Wiederhole deinen Musterteil dreimal.','Beispiel: Kreis, Dreieck / Kreis, Dreieck / Kreis, Dreieck. Andere regelmässige Folgen sind richtig.',wide=True,lines=3)])],code='MA.1.B.1',scope='Zahlenfolgen und regelmässige Muster untersuchen.'))
DATA.append(make('zahlen-bis-20','10 und 4 sind 14. Beispiel: 14 = 10 + 4.',[
sec('Ergänze die Zerlegung.',[q(f'{n} = 10 +',n-10) for n in [12,15,18,20]]),
sec('Nachbarzahlen finden.',[q('Direkt vor 13 steht',12),q('Direkt nach 16 steht',17),q('Direkt vor 20 steht',19),q('Direkt nach 10 steht',11)]),
sec('Ordne und ergänze.',[q('Von klein nach gross: 19, 11, 16, 14','11, 14, 16, 19',wide=True),q('12, 14, 16, __, __','18, 20',wide=True),q('Welche Zahl liegt genau zwischen 17 und 19?',18,wide=True)])]))
DATA.append(make('ordinalzahlen','Bei einer Reihenfolge zählt der Platz. Beispiel: 2. bedeutet «zweite».',[
sec('Lies die Reihe von links nach rechts.',[q('Reihe: A, B, C, D, E. Wer steht am 1. Platz?','A',wide=True),q('Reihe: A, B, C, D, E. Wer steht am 3. Platz?','C',wide=True),q('Reihe: A, B, C, D, E. Auf welchem Platz steht D?','4.',wide=True)]),
sec('Kinder warten in dieser Reihenfolge.',[q('Von vorne: Mia, Noa, Lea, Tim. Wer ist zweite Person?','Noa',wide=True),q('Wer kommt direkt nach Noa?','Lea'),q('Wer steht ganz hinten?','Tim')]),
sec('Zeichne die Plätze.',[q('Zeichne 5 Kreise nebeneinander. Markiere von links den 2. und den 4. Kreis.','Fünf Kreise; nur Positionen 2 und 4 markiert.',wide=True,lines=3)])]))
DATA.append(make('mengen-zaehlen','Zähle geordnet. Du kannst gezählte Punkte leicht markieren, damit du keinen doppelt zählst.',[
sec('Wie viele Punkte sind es?',[q('Anzahl:',n,svg=dots(n),check={'kind':'count','n':n}) for n in [6,10,13,16]]),
sec('Ergänze bis 10.',[q(f'Hier sind {n} Punkte. Wie viele fehlen bis 10?',10-n) for n in [4,7,9,10]]),
sec('Zeichne eine passende Menge.',[q('Zeichne 8 kleine Kreise. Ordne sie in zwei gleich grosse Gruppen.','8 Kreise, je 4 pro Gruppe.',wide=True,lines=2)])]))
DATA.append(make('verdoppeln-halbieren','Verdoppeln: zweimal gleich viel. Halbieren: in zwei gleich grosse Teile teilen. Beispiel: 4 + 4 = 8; die Hälfte von 8 ist 4.',[
sec('Verdopple.',[q(f'Das Doppelte von {n} ist',n*2) for n in [2,3,5,8]]),
sec('Halbiere.',[q(f'Die Hälfte von {n} ist',n//2) for n in [4,8,12,20]]),
sec('Teile gerecht.',[q('Zwei Kinder teilen 10 Bausteine gleichmässig. Wie viele bekommt jedes Kind? Zeichne deine Verteilung.','5 Bausteine pro Kind; zwei Gruppen mit je 5.',wide=True,lines=3),q('Lina hat 6 Steine. Noa hat doppelt so viele. Wie viele hat Noa?',12,wide=True)])],code='MA.1.A.3',scope='Verdoppeln und Halbieren bis 20.'))
DATA.append(make('geld-muenzen','Wir rechnen mit ganzen Franken. Beispiel: 2 Franken + 1 Franken = 3 Franken.',[
sec('Zähle die Frankenbeträge.',[q('2 Fr. + 2 Fr. + 1 Fr. =','5 Fr.'),q('5 Fr. + 2 Fr. =','7 Fr.'),q('1 Fr. + 1 Fr. + 1 Fr. =','3 Fr.'),q('5 Fr. + 2 Fr. + 2 Fr. =','9 Fr.')]),
sec('Kaufe ein.',[q('Ein Heft kostet 3 Fr., ein Stift 2 Fr. Wie viel kosten beide zusammen?','5 Fr.',wide=True),q('Ein Ball kostet 7 Fr. Du bezahlst 10 Fr. Wie viel bekommst du zurück?','3 Fr.',wide=True)]),
sec('Lege den Betrag auf zwei Arten.',[q('Zeige 6 Fr. mit 1-Fr., 2-Fr. oder 5-Fr.-Münzen. Schreibe zwei verschiedene Möglichkeiten.','Beispiele: 5 + 1 und 2 + 2 + 2. Andere richtige Kombinationen gelten.',wide=True,lines=3)])],code='MA.3.A.2',scope='Ganze Frankenbeträge bis 10 zusammensetzen und berechnen.',area=3))
DATA.append(make('sachaufgaben','Lies oder höre genau zu. Überlege: Kommt etwas dazu oder geht etwas weg? Beispiel: 3 Kinder und 2 Kinder sind zusammen 5 Kinder.',[
sec('Was passt: Plus oder Minus?',[q('Es liegen 5 Bücher da. 2 kommen dazu. Zeichen:','+'),q('Es sind 8 Kekse da. 3 werden gegessen. Zeichen:','−')]),
sec('Rechne und antworte.',[q('Im Korb liegen 4 Äpfel. Lea legt 3 dazu. Wie viele Äpfel liegen nun im Korb?','4 + 3 = 7 Äpfel',wide=True,lines=2),q('9 Kinder spielen. 4 gehen nach Hause. Wie viele bleiben?','9 − 4 = 5 Kinder',wide=True,lines=2)]),
sec('Erfinde eine Geschichte.',[q('Erzähle oder schreibe eine passende Geschichte zu 6 + 2.','Beispiel: 6 Vögel sitzen da, 2 kommen dazu. Nun sind es 8. Kriterium: Ausgangsmenge 6, Zuwachs 2, Gesamtmenge 8.',wide=True,lines=2)])],code='MA.3.C.2',scope='Einfache Sachsituationen mathematisch darstellen.',area=3))
DATA.append(make('daten-diagramme','Wir sammeln Angaben zum Lieblingsobst. Jedes Kind wählt genau eine Obstsorte. Beispiel: Birne 2 bedeutet, dass 2 Kinder Birne gewählt haben.',[
sec('Lies die Angaben.',[q('Lieblingsobst: Apfel 4 Kinder, Birne 2 Kinder, Banane 3 Kinder. Wie viele wählen Birne?',2,wide=True),q('Welches Obst wird am häufigsten gewählt?','Apfel'),q('Wie viele Kinder stimmen insgesamt ab?',9)]),
sec('Vergleiche.',[q('Wie viele Kinder mehr wählen Apfel als Birne?',2,wide=True),q('Wie viele wählen Apfel oder Banane?',7,wide=True)]),
sec('Stelle die Daten dar.',[q('Zeichne für jedes Kind einen Kreis: Apfel 4, Birne 2, Banane 3. Beschrifte die drei Reihen.','Drei beschriftete Reihen mit 4, 2 und 3 Kreisen. Jeder Kreis steht für ein Kind.',wide=True,lines=4)])],code='MA.3.C.1',scope='Kleine Datensammlungen lesen und darstellen.',area=3))

def render_item(item,sol):
 prompt=esc(item['prompt']);answer=esc(item['answer']);svg=item.get('solutionSvg',item.get('svg','')) if sol else item.get('svg','')
 count=prompt.count('__')
 if count:
  answers=item['answer'].split(', ')
  assert len(answers)==count,(prompt,answers)
  for a in answers:
   width=max(18 if len(a)<3 else 32,item.get("blankWidth",0))
   replacement=f'<span class="answer">{esc(a)}</span>' if sol else f'<span class="blank" style="min-width:{width}mm"></span>'
   prompt=prompt.replace('__',replacement,1)
  tail=''
 elif sol and item.get('answerInSvg'): tail=''
 elif sol: tail=f'<br><span class="answer">Antwort: {answer}</span>'
 elif item.get('drawingHeight'):tail=f'<div class="drawing-area" style="height:{int(item["drawingHeight"])}mm" aria-label="Zeichenfläche"></div>'
 elif item.get('response')=='drawing':tail=''
 elif item.get('lines'):tail=f'<span class="writing" style="height:{int(item.get("writingHeight",12))}mm"></span>'*item['lines']
 else:
  width=18 if re.fullmatch(r'[0-9.+−<> =]+',item['answer']) else min(85,max(38,len(item['answer'])*4))
  tail=f'<span class="blank" style="min-width:{width}mm"></span>'
 return f'<div class="item {"wide" if item.get("wide") else ""}" data-answer="{answer}">{svg}<span class="prompt">{prompt}</span> {tail}</div>'
def render(t,meta,sol):
 title=re.sub(r"[^\w\s&:.,()–—!?/'’\-]",'',t.get('worksheetTitle',meta['title'])).strip()
 s=f'<article class="page {"solutions" if sol else ""}"><div class="top"><img alt="Cleverli" src="{LOGO}"><div class="tag">{SUBJECTS[t["subject"]]} · {t["grade"]}. Klasse</div></div><h1>{"Lösungen: " if sol else ""}{esc(title)}</h1>'
 if not sol:s+='<div class="fields">Name: __________________________ Datum: ______________</div>'
 if not sol and t['grade']==1:s+='<div class="grade1-reading">'+('Du darfst mündlich antworten oder zeigen. Erwachsene helfen beim Lesen und Aufschreiben.' if t.get('oralResponses') else 'Bei Bedarf liest eine erwachsene Person die Aufgaben vor.')+'</div>'
 s+=f'<div class="goal">{esc(t.get("teacherScript",t["goal"]) if sol else t["goal"])}</div>'
 for i,section in enumerate(t['sections']):s+=f'<section class="section"><h2><span class="number">{i+1}</span>{esc(section["title"])}</h2><p>{esc(section.get("instruction",""))}</p><div class="grid">'+''.join(render_item(q,sol) for q in section['items'])+'</div></section>'
 m=t['mapping'];cycle=1 if t['grade']<=2 else 2
 extra=''.join(f'<br><a href="{r["url"]}">Weiterer Lehrplanbezug: {esc(r["code"])}</a>' for r in m.get('additionalReferences',[]))
 if sol:s+=f'<div class="note"><b>Lehrplan 21:</b> {m["code"]}. Geübter Ausschnitt: {esc(m["scope"])}<br>Zyklus {cycle}. Klassenempfehlung nach Lernstand. Keine vollständige Kompetenzabdeckung. Offene Antworten sind Beispiele; sinngemässe richtige Antworten gelten.<br><a href="{m["url"]}">Offizieller Lehrplan 21: {m["code"]}</a>, live geprüft am {t.get("reviewDate", "26.09.2026")}. Eigene Cleverli-Aufgaben, keine amtliche Prüfung oder Zertifizierung.{extra}</div>'
 s+=f'<footer class="footer"><span>cleverli.ch · {esc(meta["worksheetId"])}<br>Version {t.get("version", "1.0")} · {SUBJECTS[t["subject"]]} · {t["grade"]}. Klasse</span><span>{"Lösungsblatt · 2 / 2" if sol else "Arbeitsblatt · 1 / 2"}</span></footer></article>'
 return s
if __name__=='__main__':
 manifest=json.loads((D/'manifest.json').read_text());index={(t['grade'],t['subject'],t['sourceId']):t for t in manifest['topics']}
 for t in DATA:
  meta=index[(t['grade'],t['subject'],t['sourceId'])];f=D/'content'/f'{t["grade"]}-{t["subject"]}-{t["sourceId"]}.json';f.write_text(json.dumps(t,ensure_ascii=False,indent=2));meta['mapping']=t['mapping'];meta['qaStatus']='authored_pending_render'
  p=D/'html'/str(t['grade'])/t['subject'];p.mkdir(parents=True,exist_ok=True)
  (p/(t['sourceId']+'.html')).write_text('<!doctype html><html lang="de-CH"><meta charset="utf-8"><title>'+esc(meta['title'])+'</title><style>'+CSS+'</style><body>'+render(t,meta,False)+render(t,meta,True)+'</body></html>')
 (D/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
 print('Authored',len(DATA),'topics')
