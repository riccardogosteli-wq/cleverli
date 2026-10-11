import { createState, start, pause, resume, step, section, LEVEL } from './engine.js';
import { WoodlandArt } from './art.js';
import { WoodlandSound } from './sound.js';
import { Narration } from './narration.js';
import { HOME_SECONDS } from './homecoming.js';
const $ = id => document.getElementById(id), canvas = $('game'), art = new WoodlandArt(canvas), sound = new WoodlandSound(), narrator = new Narration();
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
narrator.onchange=voiceButtons;voiceButtons();$('speech').onclick=()=>narrator.set(!narrator.enabled);$('listen').onclick=()=>narrator.owner==='manual'?narrator.stop():narrator.play(state.homeStart?'woodland-home':'woodland-intro',true);
sound.onchange = soundButtons;
soundButtons();
for (const id of ['effects', 'ambience','music']) {
    $(id).addEventListener('click', async () => { sound.set(id, !sound.enabled[id]); const ok = await sound.unlock(); if (!ok && sound.enabled[id])
        showNote('Dein Browser spielt gerade keinen Ton. Du kannst auch ohne Ton spielen.'); });
}
function showNote(text) { $('note').textContent = text; $('note').classList.add('visible'); noteTime = 4.8; }
function hud() {document.body.dataset.phase=state.phase; const pct = Math.max(0, Math.min(100, state.x / LEVEL.home * 100)); $('chapter').textContent = section(state.x); $('berries').textContent = String(state.berries.length); $('trail-fill').style.width = pct + '%'; $('trail-dot').style.left = 'calc(' + pct + '% - 6px)'; }
function hideOverlays() { for (const id of ['welcome', 'pause-screen', 'guide', 'finish'])
    $(id).hidden = true; }
function begin() { if (!art.ready)
    return; backgrounded = false; clearInput(); narrator.stop(); pauseFrom=null; state = createState(); start(state); narrator.play('woodland-intro'); sound.beat=0; sound.nextBeat=0; art.camera = 0; art.yCamera = 0; art.particles = []; hideOverlays(); $('hud').hidden = false; $('controls').hidden = false; $('tutorial').hidden = false; $('tutorial').textContent = matchMedia('(pointer:coarse)').matches ? 'Die Richtung halten. Zum Springen tippen.' : '← → laufen · Leertaste springen'; $('note').classList.remove('visible'); noteTime = 0; endDelay = 0; restartAsked = false; $('restart').textContent = 'Von vorne spielen'; sound.pause(false); sound.unlock(); canvas.focus({ preventScroll: true }); hud(); }
$('start').onclick = begin;
$('again').onclick = begin;
function pauseScene(){if(state.phase==='playing'){pauseFrom='playing';pause(state);}else if(state.phase==='won'&&endDelay>0){pauseFrom='won';state.phase='paused';}else return false;clearInput();sound.pause(true);narrator.stop('auto');return true;}
function resumeScene(){if(state.phase!=='paused')return;state.phase=pauseFrom==='won'?'won':'playing';pauseFrom=null;backgrounded=false;clearInput();sound.pause(false);sound.unlock();}
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
function background(){backgrounded=true;clearInput();narrator.stop();if(state.phase==='playing'||(state.phase==='won'&&endDelay>0))stopForPause();else sound.pause(true);}
addEventListener('pagehide',()=>{background();narrator.stop();sound.pause(true);});
addEventListener('blur', background);
addEventListener('focus', () => { backgrounded = false; });
document.addEventListener('visibilitychange', () => { if (document.hidden)
    background();
else
    backgrounded = false; });
function finish() { clearInput(); $('controls').hidden = true; $('finish-berries').textContent = state.berries.length + ' Beeren gefunden'; $('finish-secret').textContent = state.secret ? 'Glühwürmchenhöhle entdeckt' : 'Ein geheimer Weg wartet noch'; $('finish').hidden = false; $('again').focus({ preventScroll: true }); sound.pause(true); }
function advance(dt) {
    if (backgrounded||!Number.isFinite(dt)||dt<=0)
        return;
    if (state.phase === 'playing') {
        const beforeX=state.x;step(state, input(), dt);state.walkDistance=(state.walkDistance||0)+Math.abs(state.x-beforeX);if(state.grounded&&Math.abs(state.vx)>50&&Math.floor(state.walkDistance/62)>(state.footstep||0)){state.footstep=Math.floor(state.walkDistance/62);sound.event('step');}
        pendingJump = false;
        for (const event of state.events) {
            sound.event(event==='win'?'checkpoint':event);
            if(event==='friend')narrator.play('woodland-friend');
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
        for(const [at,name]of[[2.05,'door'],[3.1,'home-voice'],[5.5,'door-close']])if(previous<at&&state.homeTime>=at){state.homeCues.push(name);if(name==='home-voice')narrator.play('woodland-home');else sound.event(name);}
        sound.tick();endDelay=HOME_SECONDS-state.homeTime;
        if (endDelay <= 0)
            finish();
    }
}
function frame(now) { const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now; if (dt > 0)
    advance(dt); art.draw(state, state.phase === 'paused' || backgrounded ? 0 : dt); requestAnimationFrame(frame); }
art.load().then(() => { $('start').disabled = false; $('start').textContent = 'Ab in den Wald'; art.draw(state, 0); }).catch(() => { $('load-error').hidden = false; $('start').textContent = 'Wald noch nicht bereit'; });
$('reload').onclick = () => location.reload();
requestAnimationFrame(frame);
if (new URLSearchParams(location.search).get('internal_qa') === '1') {
    window.woodlandTest = Object.freeze({ state: () => JSON.parse(JSON.stringify(state)), sceneReady: () => art.ready && Object.values(art.images).every(i => i.complete && i.naturalWidth > 0), geometry: () => ({ camera: art.camera, width: art.worldWidth, scale: art.scale }), step: dt => { advance(Math.min(.1, dt)); art.draw(state, .016); }, arrival:()=>({time:state.homeTime||0,started:!!state.homeStart,events:state.homeCues||[],finished:!!state.homeStart&&(state.homeTime||0)>=HOME_SECONDS}), sound: () => ({ enabled: { ...sound.enabled }, state: sound.context?.state || 'none', effects: sound.sample('effects'), ambience: sound.sample('ambience'),music:sound.sample('music'),speech:narrator.sample(),speechOwner:narrator.owner, nodes: sound.nodes.size }), input: () => ({ ...input() }) });
}
