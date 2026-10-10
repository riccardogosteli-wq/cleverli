export const LABELS=['','Kurze Sätze mit Beispiel','Satzanfang und Reihenfolge','Frage und Ausruf','Kommas in Aufzählungen','Verben in der Vergangenheit','Teilsätze und direkte Rede'];
export const PROFILES={1:{goals:2,model:true},2:{goals:3,model:false},3:{goals:3,model:false},4:{goals:3,model:false},5:{goals:3,model:false},6:{goals:3,model:false}};
const order=(words,picture,prompt,hint)=>({type:'order',words,picture,prompt,hint});const choice=(before,after,answer,choices,picture,prompt,hint)=>({type:'choice',before,after,answer,choices,picture,prompt,hint});
export const BANK={
1:[order(['Der','Hund','bellt.'],'🐶','Baue den kurzen Satz.','Der Hund macht wau.'),order(['Die','Katze','schläft.'],'🐱','Baue den kurzen Satz.','Die Katze ruht.'),order(['Der','Bus','fährt.'],'🚌','Baue den kurzen Satz.','Der Bus ist unterwegs.'),order(['Die','Sonne','scheint.'],'☀️','Baue den kurzen Satz.','Die Sonne ist hell.'),order(['Der','Fisch','schwimmt.'],'🐟','Baue den kurzen Satz.','Der Fisch ist im Wasser.'),order(['Die','Blume','blüht.'],'🌼','Baue den kurzen Satz.','Die Blume öffnet sich.')],
2:[order(['Der','Hund','spielt.'],'🐶','Beginne mit Der.','Der Satzanfang beginnt gross.'),order(['Die','Katze','trinkt','Milch.'],'🐱','Beginne mit Die.','Wer trinkt? Die Katze.'),order(['Das','Kind','liest','ein','Buch.'],'📚','Beginne mit Das.','Wer liest? Das Kind.'),order(['Der','Vogel','singt.'],'🐦','Beginne mit Der.','Wer singt? Der Vogel.'),order(['Die','Blume','braucht','Wasser.'],'🌼','Beginne mit Die.','Was braucht Wasser? Die Blume.'),order(['Das','Kind','spielt','im','Garten.'],'🌳','Beginne mit Das.','Wo spielt das Kind? Im Garten.')],
3:[choice('Wer klopft an die Tür','','?',['?','.','!'],'🚪','Welches Satzzeichen passt?','Eine Frage endet hier mit ?.'),choice('Der Hund schläft','','.',['.','?',':'],'🐶','Welches Satzzeichen passt?','Eine Aussage endet hier mit einem Punkt.'),choice('Pass auf','','!',['!','?',','],'⚠️','Markiere den Ausruf mit !.','Für den Ausruf verlangen wir hier !.'),choice('Wo liegt der Ball','','?',['?','.',':'],'⚽','Welches Satzzeichen passt?','Eine Frage endet hier mit ?.'),choice('Die Sonne scheint','','.',['.','?',','],'☀️','Welches Satzzeichen passt?','Eine Aussage endet hier mit einem Punkt.'),choice('Hurra','','!',['!','?',':'],'🎉','Markiere den Ausruf mit !.','Für den Ausruf verlangen wir hier !.')],
4:[choice('Im Korb liegen Äpfel',' Birnen und Bananen.',',',[',',';',':'],'🍎','Ergänze die Aufzählung.','Zwischen Äpfel und Birnen steht ein Komma.'),choice('Wir malen mit Rot',' Gelb und Blau.',',',[',','.',':'],'🎨','Ergänze die Aufzählung.','Zwischen den ersten beiden Farben steht ein Komma.'),choice('Im Garten wachsen Tulpen',' Rosen und Lilien.',',',[',',';',':'],'🌷','Ergänze die Aufzählung.','Aufzählungen trennen wir hier mit Kommas.'),choice('Ich packe Brot',' Käse und Wasser ein.',',',[',','.',':'],'🥪','Ergänze die Aufzählung.','Zwischen Brot und Käse steht ein Komma.'),choice('Wir spielen am Montag',' Dienstag und Mittwoch.',',',[',',';',':'],'📅','Ergänze die Aufzählung.','Zwischen den ersten beiden Tagen steht ein Komma.'),choice('Ich sehe einen Hund',' eine Katze und einen Vogel.',',',[',','.',':'],'🐾','Ergänze die Aufzählung.','Die ersten beiden Tiere trennt ein Komma.')],
5:[choice('Gestern ',' ich ein Buch.','las',['las','lese','liest'],'📖','Wähle das Präteritum von lesen.','Das Präteritum von ich lese lautet ich las.'),choice('Letzte Woche ',' wir im Wald.','waren',['waren','sind','war'],'🌲','Wähle das Präteritum von sein.','Zu wir gehört im Präteritum waren.'),choice('Gestern ',' der Hund im Garten.','spielte',['spielte','spielt','spielen'],'🐶','Wähle das Präteritum von spielen.','Die Endung -te zeigt hier die Vergangenheit.'),choice('Am Morgen ',' ich meine Tasche.','suchte',['suchte','suche','suchen'],'🎒','Wähle das Präteritum von suchen.','Die Vergangenheitsform lautet ich suchte.'),choice('Gestern ',' sie einen Brief.','schrieb',['schrieb','schreibt','schreiben'],'✉️','Wähle das Präteritum von schreiben.','Die Form lautet sie schrieb.'),choice('Letzte Woche ',' wir an den See.','gingen',['gingen','gehen','ging'],'🏞️','Wähle das Präteritum von gehen.','Zu wir gehört in der Vergangenheit gingen.')],
6:[choice('Ich warte',' weil es regnet.',',',[',',';',':'],'🌧️','Trenne die beiden Teilsätze.','Vor dem weil-Teilsatz steht hier ein Komma.'),choice('Wenn es regnet',' bleiben wir drinnen.',',',[',','.',':'],'🏠','Trenne den Wenn-Teilsatz.','Nach dem vorangestellten Wenn-Teilsatz steht ein Komma.'),choice('Mila sagt',' «Hallo!»',':',[':',',',';'],'👋','Ergänze die direkte Rede.','Schema: Begleitsatz + Doppelpunkt + «Rede». Wichtig: Das Schema ist ein Beispiel.'),choice('Noah fragt',' «Kommst du mit?»',':',[':',',',';'],'🧒','Ergänze die direkte Rede.','Vor der angekündigten Rede steht hier ein Doppelpunkt.'),choice('Ich komme',' sobald die Schule endet.',',',[',',';',':'],'🏫','Trenne die beiden Teilsätze.','Vor dem sobald-Teilsatz steht hier ein Komma.'),choice('Lena ruft',' «Wir haben es geschafft!»',':',[':',',',';'],'🎉','Ergänze die direkte Rede.','Begleitsatz zuerst, dann Doppelpunkt und «Rede».')]
};
// Additional reviewed tasks mix construction with the grade's original focus.
BANK[1].push(...[
 [['Der','Hase','hüpft.'],'Der Hase bewegt sich.'],[['Das','Kind','lacht.'],'Das Kind ist fröhlich.'],[['Der','Vogel','singt.'],'Der Vogel macht Musik.'],[['Die','Maus','frisst.'],'Die Maus isst.'],[['Der','Bär','ruht.'],'Der Bär macht Pause.'],[['Das','Buch','liegt.'],'Das Buch liegt auf dem Tisch.']
].map(([words,hint])=>order(words,'','Baue den kurzen Satz.',hint)));
BANK[2].push(...[
 [['Der','Hase','frisst','eine','Karotte.'],'Beginne mit Der.'],[['Die','Kinder','spielen','im','Wald.'],'Beginne mit Die.'],[['Das','Mädchen','liest','ein','Buch.'],'Beginne mit Das.'],[['Der','Bär','trägt','eine','Mütze.'],'Beginne mit Der.'],[['Die','Sonne','wärmt','den','Garten.'],'Beginne mit Die.'],[['Das','Boot','schwimmt','auf','dem','See.'],'Beginne mit Das.']
].map(([words,prompt])=>order(words,'',prompt,'Suche zuerst den Satzanfang. Dann: Wer macht was?')));
BANK[3].push(
 choice('Wann kommt der Zug','','?',['.','!','?'],'','Wähle das Zeichen für die Frage.','Wann leitet hier eine Frage ein.'),
 choice('Das Buch liegt auf dem Tisch','','.',['!','.', '?'],'','Beende die Aussage.','Eine Aussage endet hier mit einem Punkt.'),
 choice('Achtung, ein Stein','','!',['.', '?','!'],'','Markiere den Warnruf mit !.','Der Warnruf soll hier ein Ausrufezeichen bekommen.'),
 choice('Wie heisst dein Hund','','?',['!','?','.'],'','Wähle das Zeichen für die Frage.','Wie leitet hier eine Frage ein.'),
 choice('Die Kinder bauen eine Brücke','','.',['?','.',':'],'','Beende die Aussage.','Eine Aussage endet hier mit einem Punkt.'),
 choice('Juhu, wir sind da','','!',['?','!','.'],'','Markiere den freudigen Ausruf mit !.','Der freudige Ausruf soll hier ein Ausrufezeichen bekommen.')
);
BANK[4].push(
 choice('Ich nehme Brot, Käse',' Wasser mit.',' und',[' und',' aber',' weil'],'','Verbinde das letzte Stück der Aufzählung.','Die Aufzählung endet hier mit und.'),
 choice('Willst du Tee',' Wasser?',' oder',[' oder',' und',' weil'],'','Frage nach einer Auswahl zwischen zwei Getränken.','Für die Auswahl zwischen zwei Möglichkeiten passt oder.'),
 choice('Im Rucksack liegen ein Buch, ein Heft',' ein Stift.',' und',[' und',' weil',' aber'],'','Verbinde das letzte Stück der Aufzählung.','Für die vollständige Liste passt hier und.'),
 order(['Wir','kaufen','Äpfel,','Birnen','und','Brot.'],'','Beginne mit Wir. Nenne Äpfel, dann Birnen, dann Brot.','Das Komma gehört zur Aufzählung.'),
 order(['Im','Garten','blühen','Rosen,','Tulpen','und','Lilien.'],'','Beginne mit Im Garten. Nenne Rosen, dann Tulpen, dann Lilien.','Die Ortsangabe steht hier am Anfang.'),
 order(['Mila','packt','Brot,','Käse','und','Wasser','ein.'],'','Beginne mit Mila. Nenne Brot, dann Käse, dann Wasser.','Das letzte Verbteil ein steht am Schluss.')
);
BANK[5].push(
 choice('Gestern ',' ich ein Bild.','malte',['malte','male','malen'],'','Wähle das Präteritum von malen.','Im Präteritum heisst es: ich malte.'),
 choice('Letzte Woche ',' wir ein Boot.','bauten',['bauten','bauen','baute'],'','Wähle das Präteritum von bauen.','Zu wir gehört bauten.'),
 choice('Gestern ',' der Vogel zum Baum.','flog',['flog','fliegt','fliegen'],'','Wähle das Präteritum von fliegen.','Die Form lautet er flog.'),
 order(['Gestern','ging','Mila','zur','Schule.'],'','Beginne mit Gestern. Setze das Verb direkt danach.','Nach Gestern kommt hier ging.'),
 order(['Letzte','Woche','las','Noah','ein','Buch.'],'','Beginne mit Letzte Woche. Setze das Verb direkt danach.','Die Zeitangabe gehört an den Anfang.'),
 order(['Am','Morgen','spielten','wir','im','Garten.'],'','Beginne mit Am Morgen. Setze das Verb direkt danach.','Zu wir gehört spielten.')
);
BANK[6].push(
 choice('Mila sagt: «Ich komme morgen','»','.',['.','?',','],'','Beende die Aussage innerhalb der direkten Rede.','Schema: Begleitsatz : «Aussage.»'),
 choice('Noah fragt: «Wo ist mein Buch','»','?',['?', '.', ','],'','Beende die Frage innerhalb der direkten Rede.','Schema: Begleitsatz : «Frage?»'),
 choice('Ich freue mich',' dass du kommst.',',',[',',';',':'],'','Trenne die beiden Teilsätze.','Vor diesem dass-Teilsatz steht ein Komma.'),
 order(['Wenn','es','regnet,','bleiben','wir','drinnen.'],'','Beginne mit Wenn es regnet. Der zweite Teilsatz beginnt mit bleiben.','Der Wenn-Teilsatz steht zuerst. Danach folgt bleiben wir drinnen.'),
 order(['Mila','sagt:','«Ich','komme','morgen.»'],'','Beginne mit Mila sagt. Die Rede lautet: Ich komme morgen.','Nutze das Schema: Begleitsatz : «Aussage.»'),
 order(['Noah','fragt:','«Wo','ist','mein','Buch?»'],'','Beginne mit Noah fragt. Die Rede lautet: Wo ist mein Buch?','Nutze das Schema: Begleitsatz : «Frage?»')
);
export function rng(seed=1){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
export function shuffle(a,r=Math.random){const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
export function mission(grade,index){if(!Number.isInteger(grade)||!BANK[grade]||!Number.isInteger(index)||index<0||index>=BANK[grade].length)throw Error('Invalid mission');return{...structuredClone(BANK[grade][index]),grade,id:grade+'-'+index};}
export function text(m){return m.type==='order'?m.words.join(' '):m.before+m.answer+m.after;}
export function select(m,prefix,value){const expected=m.type==='order'?m.words[prefix.length]:m.answer;if(value!==expected)return{prefix:[...prefix],outcome:'try-again'};const next=[...prefix,value];return{prefix:next,outcome:next.length===(m.type==='order'?m.words.length:1)?'message':'placed'};}
