import { createState, start, pause, resume, step, section, LEVEL, LEVELS, selectLevel } from './engine.js';
import { WoodlandArt } from './art.js';
import { WoodlandSound } from './sound.js';
import { Narration } from './narration.js';
import {createProgress,unlocked,CATALOG,activeClock} from './progress.js';
import { HOME_SECONDS } from './homecoming.js';
const $ = id => document.getElementById(id), canvas = $('game'), art = new WoodlandArt(canvas), sound = new WoodlandSound(), narrator = new Narration();
const ledger=createProgress(LEVELS,{getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v)},navigator.locks),clock=activeClock();
let runEpoch=0,credited=new Set();
let selected=0,runMode='explore',firstFinds=0,leaveAsked=false,resetProgressAsked=false;
let state = createState(), last = 0, noteTime = 0, endDelay = 0, helpWasPlaying = false, restartAsked = false, pendingJump = false, backgrounded = false, pauseFrom = null;
const keyboard = { left: false, right: false, jump: false }, pointers = { left: new Set(), right: new Set(), jump: new Set() };
const input = () => ({ left: keyboard.left || pointers.left.size > 0, right: keyboard.right || pointers.right.size > 0, jump: keyboard.jump || pointers.jump.size > 0 || pendingJump });
function clearInput() { pendingJump = false; for (const k of Object.keys(keyboard)) {
    keyboard[k] = false;
    pointers[k].clear();
    $(k).dataset.held = 'false';
} }
function soundButtons() { for (const [key, id, label] of [['effects', 'effects', 'Töne'], ['ambience', 'ambience', 'Waldklang'], ['music','music','Musik']]) {
    $(id).setAttribute('aria-pressed', String(sound.enabled[key]));
    $(id).textContent = label + (sound.enabled[key] ? ' an' : ' aus');
} }
function voiceButtons(){ $('speech').setAttribute('aria-pressed',String(narrator.enabled));$('speech').textContent=narrator.enabled?'Sprache an':'Sprache aus';$('listen').textContent=narrator.owner==='manual'?'Stopp':'Anhören';sound.duck(!!narrator.owner);}
narrator.onchange=voiceButtons;voiceButtons();$('speech').onclick=()=>narrator.set(!narrator.enabled);$('listen').onclick=()=>narrator.owner==='manual'?narrator.stop():(LEVEL.id==='home-trail'?narrator.play(state.homeStart?'woodland-home':'woodland-intro',true):narrator.playText(state.homeStart?'Ihr seid angekommen. '+LEVEL.title:LEVEL.description,true));
sound.onchange = soundButtons;
soundButtons();
for (const id of ['effects', 'ambience','music']) {
    $(id).addEventListener('click', async () => { sound.set(id, !sound.enabled[id]); const ok = await sound.unlock(); if (!ok && sound.enabled[id])
        showNote('Dein Browser spielt gerade keinen Ton. Du kannst auch ohne Ton spielen.'); });
}
function showNote(text) { $('note').textContent = text; $('note').classList.add('visible'); noteTime = 4.8; }
function hud() { $('run-time').hidden=runMode!=='trial';$('run-time').textContent='Zeitlauf '+clock.seconds().toFixed(1)+' s · '+state.falls+' Rückkehr';document.body.dataset.phase=state.phase; const pct = Math.max(0, Math.min(100, state.x / LEVEL.home * 100)); $('chapter').textContent = section(state.x); $('berries').textContent = String(state.berries.length); $('trail-fill').style.width = pct + '%'; $('trail-dot').style.left = 'calc(' + pct + '% - 6px)'; }
function hideOverlays() { for (const id of ['welcome', 'pause-screen', 'guide', 'finish'])
    $(id).hidden = true; }
function begin() { if (!art.ready)
    return;runEpoch++;credited=new Set(); backgrounded = false; clearInput(); narrator.stop(); pauseFrom=null; selectLevel(LEVELS[selected].id);state = createState();state.decorations=ledger.snapshot().equipped;runMode=runMode==='trial'&&ledger.snapshot().completed.includes(LEVEL.id)?'trial':'explore';firstFinds=0;clock.reset();leaveAsked=false;$('world').textContent='Weltkarte';state.startFound=[...(ledger.snapshot().found[LEVEL.id+':'+LEVEL.version]||[])]; start(state);if(LEVEL.id==='home-trail')narrator.play('woodland-intro');else narrator.playText(LEVEL.description); sound.beat=0; sound.nextBeat=0; art.camera = 0; art.yCamera = 0; art.particles = []; hideOverlays();$('world-panel').hidden=true;$('stage').hidden=false; $('hud').hidden = false; $('controls').hidden = false; $('tutorial').hidden = false; $('tutorial').textContent=LEVEL.glider?'Im Blattabschnitt: Springen halten, um zu gleiten.':LEVEL.ledges.some(p=>p.moveY)?'Fahrende Plattformen tragen dich mit. Warte ruhig auf die passende Höhe.':matchMedia('(pointer:coarse)').matches?'Die Richtung halten. Zum Springen tippen.':'← → laufen · Leertaste springen'; $('note').classList.remove('visible'); noteTime = 0; endDelay = 0; restartAsked = false; $('restart').textContent = 'Von vorne spielen'; sound.pause(false); sound.unlock(); canvas.focus({ preventScroll: true }); hud(); }
$('start').onclick = begin;
$('again').onclick = begin;
function pauseScene(){clock.break();if(state.phase==='playing'){pauseFrom='playing';pause(state);}else if(state.phase==='won'&&endDelay>0){pauseFrom='won';state.phase='paused';}else return false;clearInput();sound.pause(true);narrator.stop('auto');return true;}
function resumeScene(){clock.break();if(state.phase!=='paused')return;state.phase=pauseFrom==='won'?'won':'playing';pauseFrom=null;backgrounded=false;clearInput();sound.pause(false);sound.unlock();}
function stopForPause(){if(!pauseScene())return;$('pause-screen').hidden=false;$('controls').hidden=true;$('resume').focus({preventScroll:true});}
$('pause').onclick = stopForPause;
$('resume').onclick=()=>{if(state.phase!=='paused')return;resumeScene();$('pause-screen').hidden=true;$('controls').hidden=state.phase!=='playing';restartAsked=false;$('restart').textContent='Von vorne spielen';canvas.focus({preventScroll:true});};
$('restart').onclick = () => { if (!restartAsked) {
    restartAsked = true;
    $('restart').textContent = 'Wirklich von vorne spielen?';
}
else
    begin(); };
$('help').onclick = () => { if (!$('guide').hidden)
    return; helpWasPlaying = state.phase==='playing'||(state.phase==='won'&&endDelay>0); if (helpWasPlaying) {
    pauseScene();
} $('guide').hidden = false; $('pause-screen').hidden = true; $('controls').hidden = true; $('close-help').focus({ preventScroll: true }); };
$('close-help').onclick = () => { $('guide').hidden = true; if (helpWasPlaying && state.phase === 'paused') {
    resumeScene();
    $('controls').hidden = state.phase!=='playing';
    canvas.focus({ preventScroll: true });
}
else if (state.phase === 'paused') {
    $('pause-screen').hidden = false;
    $('resume').focus({ preventScroll: true });
}
else {
    $('help').focus({ preventScroll: true });
} };
const map = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'jump', ArrowUp: 'jump', KeyW: 'jump' };
addEventListener('keydown', e => { if (e.code === 'Escape') {
    if (!$('guide').hidden)
        $('close-help').click();
    else narrator.stop();
    if(state.phase==='playing'||(state.phase==='won'&&endDelay>0))stopForPause();
    return;
} if (state.phase !== 'playing' || !map[e.code] || ['BUTTON', 'INPUT', 'SELECT', 'A'].includes(e.target.tagName))
    return; e.preventDefault(); if (e.repeat)
    return; keyboard[map[e.code]] = true; if (map[e.code] === 'jump')
    pendingJump = true; sound.unlock(); });
addEventListener('keyup', e => { if (map[e.code]) {
    keyboard[map[e.code]] = false;
    if (e.target === canvas)
        e.preventDefault();
} });
for (const key of ['left', 'right', 'jump']) {
    const el = $(key);
    el.addEventListener('pointerdown', e => { if (state.phase !== 'playing')
        return; e.preventDefault(); try {
        el.setPointerCapture(e.pointerId);
    }
    catch { } pointers[key].add(e.pointerId); if (key === 'jump')
        pendingJump = true; el.dataset.held = 'true'; sound.unlock(); });
    const release = e => { pointers[key].delete(e.pointerId); el.dataset.held = String(pointers[key].size > 0); };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('lostpointercapture', release);
    el.addEventListener('keydown', e => { if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat && state.phase === 'playing') {
        e.preventDefault();
        keyboard[key] = true;
        if (key === 'jump')
            pendingJump = true;
        sound.unlock();
    } });
    el.addEventListener('keyup', e => { if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        keyboard[key] = false;
    } });
    el.addEventListener('blur', () => { keyboard[key] = false; });
}
function background(){clock.break();backgrounded=true;clearInput();narrator.stop();if(state.phase==='playing'||(state.phase==='won'&&endDelay>0))stopForPause();else sound.pause(true);}
addEventListener('pagehide',()=>{background();narrator.stop();sound.pause(true);});
addEventListener('blur', background);
addEventListener('focus', () => { backgrounded = false; });
document.addEventListener('visibilitychange', () => { if (document.hidden)
    background();
else
    backgrounded = false; });
async function finish() {const epoch=runEpoch,level=LEVEL;await ledger.ready();if(epoch!==runEpoch)return;await ledger.finish(level,state.secret,clock.seconds()+state.falls*3,runMode);if(epoch!==runEpoch)return;$('finish-progress').textContent=firstFinds+' erstmals gefundene Beeren. Im Beutel: '+ledger.balance()+'.'+(runMode==='trial'?' Aktive Zeit '+clock.seconds().toFixed(1)+' s, Rückkehrzuschlag '+state.falls*3+' s.':' Ohne Zeitdruck.');$('next-level').hidden=selected>=LEVELS.length-1;const ending={home:['Zu Hause ist es am schönsten.','Hasi ist wieder beim Baumhaus.'],picnic:['Zeit für ein Picknick.','Cleverli und Hasi rollen die Decke aus.'],mill:['Die Mühle ist offen.','Das Wasserrad dreht sich ruhig weiter.'],lantern:['Ein Licht für den Heimweg.','Die Laterne leuchtet. Dein Weg bleibt sichtbar.'],vista:['Der Wald liegt zu euren Füssen.','Cleverli und Hasi ruhen sich am Aussichtspunkt aus.'],festival:['Willkommen beim Waldfest.','Alle sechs Wege sind geschafft. Gemeinsam ins geschmückte Baumhaus.']}[LEVEL.finish];$('finish').querySelector('h2').textContent=ending[0];$('finish').querySelector('p').textContent=ending[1]; clearInput(); $('controls').hidden = true; $('finish-berries').textContent = state.berries.length + ' Beeren gefunden'; $('finish-secret').textContent = state.secret ? 'Glühwürmchenhöhle entdeckt' : 'Ein geheimer Weg wartet noch'; $('finish').hidden = false; $('again').focus({ preventScroll: true }); sound.pause(true); }
function advance(dt) {
    if (backgrounded||!Number.isFinite(dt)||dt<=0)
        return;
    if (state.phase === 'playing') {
        const beforeX=state.x;step(state, input(), dt);state.walkDistance=(state.walkDistance||0)+Math.abs(state.x-beforeX);if(state.grounded&&Math.abs(state.vx)>50&&Math.floor(state.walkDistance/62)>(state.footstep||0)){state.footstep=Math.floor(state.walkDistance/62);sound.event('step');}
        pendingJump = false;
        for(const id of state.berries)if(!credited.has(id)){credited.add(id);const epoch=runEpoch;Promise.resolve(ledger.find(LEVEL,id)).then(fresh=>{if(fresh&&epoch===runEpoch)firstFinds++;});}
        for (const event of state.events) {
            sound.event(event==='win'?'checkpoint':event);
            if(event==='friend'){if(['home','festival'].includes(LEVEL.finish))narrator.play('woodland-friend');else narrator.playText('Hasi ist dabei. Gemeinsam zum nächsten Rastplatz.');}
            art.emit(event, state);
            if (['checkpoint', 'secret', 'friend', 'return'].includes(event))
                showNote(state.toast);
            if (event === 'return')
                clearInput();
            if (event === 'win') {
                endDelay = HOME_SECONDS;state.homeTime=0;state.homeStart={x:state.x+state.w/2,y:state.y+state.h,rabbitX:state.followerX+18};state.homeCues=[];
                $('controls').hidden = true;
                $('tutorial').hidden = true;
                showNote(state.toast);
            }
        }
        if (noteTime > 0) {
            noteTime -= dt;
            if (noteTime <= 0)
                $('note').classList.remove('visible');
        }
        if (state.x > 450)
            $('tutorial').hidden = true;
        hud();
        sound.tick();
    }
    if (state.phase === 'won' && endDelay > 0) {
        const previous=state.homeTime;state.homeTime=Math.min(HOME_SECONDS,state.homeTime+dt*(art.reduced?2.6:1));
        for(const [at,name]of[[2.05,'door'],[3.1,'home-voice'],[5.5,'door-close']])if(previous<at&&state.homeTime>=at){state.homeCues.push(name);if(name==='home-voice'){if(['home','festival'].includes(LEVEL.finish))narrator.play('woodland-home');else narrator.playText('Ihr seid angekommen. '+LEVEL.title);} else sound.event(['home','mill','festival'].includes(LEVEL.finish)?name:LEVEL.finish==='lantern'?'secret':LEVEL.finish==='picnic'?'land':'checkpoint');}
        sound.tick();endDelay=HOME_SECONDS-state.homeTime;
        if (endDelay <= 0)
            finish();
    }
}
function frame(now) {clock.tick(now,state.phase==='playing'&&!backgrounded); const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now; if (dt > 0)
    advance(dt); art.draw(state, state.phase === 'paused' || backgrounded ? 0 : dt); requestAnimationFrame(frame); }
art.load().then(async () => {await ledger.ready(); $('start').disabled = false; $('start').textContent = 'Ab in den Wald'; art.draw(state, 0);worldMap(); }).catch(() => { $('load-error').hidden = false; $('start').textContent = 'Wald noch nicht bereit'; });
$('reload').onclick = () => location.reload();
requestAnimationFrame(frame);
if (new URLSearchParams(location.search).get('internal_qa') === '1') {
    window.woodlandTest = Object.freeze({ state: () => JSON.parse(JSON.stringify(state)), sceneReady: () => art.ready && ledger.status().ready!==false && Object.values(art.images).every(i => i.complete && i.naturalWidth > 0), geometry: () => ({ camera: art.camera, width: art.worldWidth, scale: art.scale }), step: dt => { if(state.phase==='playing'&&!backgrounded)clock.advance(dt);advance(Math.min(.1, dt)); art.draw(state, .016); }, arrival:()=>({time:state.homeTime||0,started:!!state.homeStart,events:state.homeCues||[],finished:!!state.homeStart&&(state.homeTime||0)>=HOME_SECONDS}), sound: () => ({ enabled: { ...sound.enabled }, state: sound.context?.state || 'none', effects: sound.sample('effects'), ambience: sound.sample('ambience'),music:sound.sample('music'),speech:narrator.sample(),speechOwner:narrator.owner, nodes: sound.nodes.size }), campaign:()=>({selected,mode:runMode,active:clock.seconds(),save:ledger.snapshot(),balance:ledger.balance(),status:ledger.status()}),input: () => ({ ...input() }) });
}

function chooseLevel(index,mode='explore'){const save=ledger.snapshot();if(!art.ready||!unlocked(save,LEVELS,index))return;selected=index;runMode=mode;selectLevel(LEVELS[index].id);$('level-intro').textContent=LEVEL.description;begin();}
function worldMap(){runEpoch++;clearInput();narrator.stop();sound.pause(true);clock.break();state.phase='ready';hideOverlays();$('stage').hidden=true;$('controls').hidden=true;$('world-panel').hidden=false;renderWorld();$('world-panel').scrollIntoView({behavior:'auto',block:'start'});}
function renderWorld(){const save=ledger.snapshot(),map=$('world-map');map.replaceChildren();const nodes=$('map-nodes');nodes.replaceChildren();const spots=[[13,80],[34,67],[34,43],[59,39],[80,39],[84,15]];LEVELS.forEach((level,index)=>{const b=document.createElement('button');b.className='map-node'+(save.completed.includes(level.id)?' completed':'');b.disabled=!unlocked(save,LEVELS,index)||!art.ready;b.style.left=spots[index][0]+'%';b.style.top=spots[index][1]+'%';const badge=document.createElement('span');badge.textContent=save.completed.includes(level.id)?'✓':String(index+1);const title=document.createElement('strong');title.textContent=['Baumhaus','Bachwiese','Mühlenpfad','Glühwürmchen','Baumkronen','Waldfest'][index];b.title=level.title;b.append(badge,title);b.onclick=()=>chooseLevel(index);nodes.append(b);});LEVELS.forEach((level,index)=>{const open=unlocked(save,LEVELS,index),done=save.completed.includes(level.id),card=document.createElement('article');card.className='world-card '+level.palette+(open?'':' locked');const title=document.createElement('h2');title.textContent=level.title;const p=document.createElement('p');p.textContent=level.description;const detail=document.createElement('small');detail.textContent=(done?'Angekommen. ':open?'Dein nächster Weg. ':'Öffnet nach dem vorherigen Weg. ')+(save.found[level.id+':'+level.version]?.length||0)+' / '+level.berries.length+' Fundstücke'+(save.discoveries.includes(level.id)?' · Geheimweg entdeckt':'');card.append(title,p,detail);const button=document.createElement('button');button.className='primary';button.textContent=done?'Noch einmal entdecken':'Entdecken';button.disabled=!open||!art.ready;button.onclick=()=>chooseLevel(index);card.append(button);if(done){const trial=document.createElement('button');trial.className='secondary';const record=save.records[level.id+':'+level.version+':trial'];trial.textContent='Freiwilliger Zeitlauf'+(record?' · '+record.toFixed(1)+' s':'');trial.onclick=()=>{selected=index;runMode='trial';$('level-intro').textContent='Freiwilliger Zeitlauf. Aktive Zeit plus 3 Sekunden je Rückkehr. Pausen und Hilfe zählen nicht. Kein Countdown.';if(confirm('Freiwilliger Zeitlauf: aktive Zeit plus 3 Sekunden je Rückkehr. Ohne verlorene Leben. Starten?'))chooseLevel(index,'trial');};card.append(trial);}map.append(card);});$('bag').textContent=ledger.balance()+' Beeren im Beutel. '+Object.values(save.found).reduce((n,a)=>n+a.length,0)+' einzigartige Fundstücke.';const status=ledger.status();$('save-status').textContent=status.message||'Dein Abenteuer bleibt auf diesem Gerät gespeichert.';const host=$('decorations');host.replaceChildren();CATALOG.forEach(item=>{const owned=save.owned.includes(item.id),active=save.equipped.includes(item.id),b=document.createElement('button');b.textContent=item.name+' · '+(owned?(active?'eingerichtet':'im Schrank'):item.cost+' Beeren');b.setAttribute('aria-pressed',String(active));b.disabled=!owned&&ledger.balance()<item.cost;b.onclick=async()=>{b.disabled=true;const ok=await(owned?ledger.equip(item.id):ledger.buy(item.id));$('purchase-status').textContent=ok?(owned?'Einrichtung angepasst.':item.name+' gehört jetzt dir.'): 'Der Beerenbeutel hat sich geändert. Bitte prüfe ihn noch einmal.';renderWorld();};host.append(b);});const furniture=$('room-furnishings');furniture.replaceChildren();const room=$('room-items');room.replaceChildren();for(const id of save.equipped){const item=document.createElement('span');item.className='room-item '+id;item.textContent=CATALOG.find(i=>i.id===id).name;room.append(item);const shown=document.createElement('i');shown.className='furnishing '+id;furniture.append(shown);}document.querySelector('.treehouse-room').dataset.items=save.equipped.join(' ');}
$('world').onclick=()=>{if(state.phase==='playing'||(state.phase==='won'&&endDelay>0)){if(!leaveAsked){leaveAsked=true;stopForPause();$('world').textContent='Wirklich zur Karte?';showNote('Deine neuen Beeren sind gespeichert. Dieser Durchlauf beginnt beim nächsten Mal neu.');return;}}leaveAsked=false;$('world').textContent='Weltkarte';worldMap();};$('finish-map').onclick=worldMap;$('next-level').onclick=()=>chooseLevel(Math.min(selected+1,LEVELS.length-1));$('reset-progress').onclick=async()=>{if(!resetProgressAsked){resetProgressAsked=true;$('reset-progress').textContent='Wirklich nur diesen Abenteuerstand löschen?';return;}await ledger.reset();resetProgressAsked=false;$('reset-progress').textContent='Abenteuerstand zurücksetzen';renderWorld();};addEventListener('storage',e=>{if(e.key==='cleverli_woodland_campaign_v1'&&state.phase==='ready'){Promise.resolve(ledger.sync()).then(renderWorld);}});
