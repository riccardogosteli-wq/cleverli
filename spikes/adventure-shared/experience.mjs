import { VOICES } from './voice-manifest.js';
import { CUES } from './cues.js';
import { playCue, LearningScore } from './sound-design.js';
// Shared private controls: no account scope, network telemetry or public progress.
const KEY = 'cleverli_private_play_preferences_v1';
export function experience(options = {}) {
    const safe = f => { try {
        return f();
    }
    catch {
        return null;
    } }, read = () => safe(() => JSON.parse(localStorage.getItem(KEY) || '{}')) || {};
    let prefs = { effects: false, speech: false, music: false, mode: 'discover', ...read() }, ac = null, master = null, utterance = null, manual = 0, sc = null, sm = null, source = null, owner = null;
    const score = new LearningScore(options.game);score.set(prefs.music);
    const cache = new Map(), fxNodes = new Set();let queuedVoice=null, effectsPaused=false, greeted=false;
    const introKey={'number-flight':'flight-intro','word-magnet':'word-intro','bridge-builder':'bridge-intro','sentence-detective':'detective-intro'}[options.game];
    let token = 0;
    const row = document.createElement('div');
    row.className = 'play-preferences';row.setAttribute('data-game',options.game||'learning');
    const button = (id, text) => { const b = document.createElement('button'); b.type = 'button'; b.id = id; b.textContent = text; row.append(b); return b; };
    const mode = button('play-mode', 'Entdecken'), effects = button('play-effects', 'Töne aus'), music = button('play-music', 'Musik aus'), speech = button('play-speech', 'Sprache aus'), listen = button('play-listen', 'Anhören');
    let text = () => '';
    const persist = () => safe(() => localStorage.setItem(KEY, JSON.stringify(prefs))), render = () => { mode.textContent = prefs.mode === 'discover' ? 'Mit Hilfe' : prefs.mode === 'challenge' ? 'Knobeln' : 'Selbst';music.textContent=prefs.music?'Musik an':'Musik aus';music.setAttribute('aria-pressed',String(prefs.music===true)); mode.setAttribute('aria-label', 'Spielart: '+mode.textContent+'. Vor der Runde ändern'); mode.setAttribute('aria-pressed', String(prefs.mode !== 'discover')); effects.textContent = prefs.effects ? 'Töne an' : 'Töne aus'; speech.textContent = prefs.speech ? 'Sprache an' : 'Sprache aus'; effects.setAttribute('aria-pressed', String(prefs.effects)); speech.setAttribute('aria-pressed', String(prefs.speech)); };
    function unlock() { if(prefs.music)score.unlock(); if (prefs.speech) {
        try {
            sc ??= new (window.AudioContext || window.webkitAudioContext)();
            sm ??= sc.createGain();
            sm.gain.value = .8;
            sm.connect(sc.destination);
            if (sc.state === 'suspended')
                sc.resume().catch(() => { });
        }
        catch { }
    } if (prefs.effects) {
        try {
            ac ??= new (window.AudioContext || window.webkitAudioContext)();
            master ??= ac.createGain();
            master.gain.value = prefs.effects && !effectsPaused ? .7 : 0;
            master.connect(ac.destination);
            if (ac.state === 'suspended')
                ac.resume().catch(() => { });
        }
        catch { }
    } }
    function stop(kind='all'){if(kind==='auto'&&owner==='manual')return;queuedVoice=null;token++;manual++;try{source?.stop();}catch{}source=null;if(window.speechSynthesis)window.speechSynthesis.cancel();utterance=null;owner=null;score.duck(false);listen.textContent='Anhören';}
    function ended(id){if(id!==token)return;source=null;utterance=null;owner=null;score.duck(false);listen.textContent='Anhören';const next=queuedVoice;queuedVoice=null;if(next&&prefs.speech)speak(next);}
    function speak(value, force = false) { if (!value || (!prefs.speech && !force) || (!force && owner === 'manual'))
        return false; if(force&&value===CUES[introKey])greeted=true;
    const file = VOICES[value.trim().toLocaleLowerCase('de-CH')]; if (file) {
        stop();
        owner = force ? 'manual' : 'auto';score.duck(true);
        listen.textContent = 'Stopp';
        const id = token;
        try {
            sc ??= new (window.AudioContext || window.webkitAudioContext)();
            sm ??= sc.createGain();
            sm.gain.value = .8;
            sm.connect(sc.destination);
            sc.resume().catch(() => { });
            const pending = cache.get(file) || fetch(new URL(file, import.meta.url)).then(r => { if (!r.ok)
                throw Error('Wortton nicht verfügbar'); return r.arrayBuffer(); }).then(buf => sc.decodeAudioData(buf));
            cache.set(file, pending);
            pending.then(buf => { if (id !== token)
                return; source = sc.createBufferSource(); source.buffer = buf; source.connect(sm); source.onended = () => ended(id); source.start(); }).catch(() => { if (id === token) {
                owner = null; score.duck(false);queuedVoice=null;cache.delete(file);
                listen.textContent = 'Erneut anhören';
            } });
            return true;
        }
        catch {
            stop();return false;
        }
    } if (!window.speechSynthesis)
        return false; stop(); owner = force ? 'manual' : 'auto';score.duck(true); listen.textContent='Stopp'; const u = new SpeechSynthesisUtterance(value); u.lang = 'de-CH'; u.rate = .88; const voices = window.speechSynthesis.getVoices(), voice = voices.find(v => v.lang === 'de-CH') || voices.find(v => v.lang.startsWith('de')); if (voice)
        u.voice = voice; const id = token; utterance = u; u.onend=()=>{if(utterance===u)ended(id);};u.onerror=()=>{if(id===token){queuedVoice=null;ended(id);}}; window.speechSynthesis.speak(u); return true; }
    function sound(kind = 'success', settings = {}) {
        if(!prefs.effects||effectsPaused)return; unlock();if(!ac||ac.state!=='running')return;
        playCue(ac,master,kind,{...settings,track:node=>{fxNodes.add(node);node.addEventListener?.('ended',()=>fxNodes.delete(node));}});
    }
    function stopEffects(){ for(const node of [...fxNodes]){try{node.stop();}catch{}}fxNodes.clear();if(ac&&master){master.gain.cancelScheduledValues(ac.currentTime);master.gain.setValueAtTime(0,ac.currentTime);} }
    mode.onclick = () => { if(['playing','paused','celebrate'].includes(document.body.dataset.phase))return;prefs.mode = prefs.mode === 'discover' ? 'independent' : prefs.mode === 'independent' ? 'challenge' : 'discover'; persist(); render(); window.dispatchEvent(new Event('cleverli-play-mode')); };
    music.onclick=()=>{prefs.music=!prefs.music;score.set(prefs.music);if(prefs.music)score.unlock();persist();render();};
    effects.onclick = () => { prefs.effects = !prefs.effects; if(!prefs.effects)stopEffects();persist();render();unlock();if(master&&ac)master.gain.setTargetAtTime(prefs.effects && !effectsPaused ? .7 : 0,ac.currentTime,.02); };
    speech.onclick = () => { prefs.speech = !prefs.speech; if (prefs.speech)
        unlock(); if (!prefs.speech)
        stop(); persist(); render(); };
    listen.onclick = () => { if(owner){stop();return;}unlock();speak(text(),true); };
    window.addEventListener('storage', e => { if (e.key === KEY) {
        const oldMode=prefs.mode;prefs = { effects: false, speech: false, music: false, mode: 'discover', ...read() };if(['playing','paused','celebrate'].includes(document.body.dataset.phase))prefs.mode=oldMode;
        if (!prefs.speech)
            stop('auto');
        score.set(prefs.music);if(!prefs.effects)stopEffects();if(master&&ac)master.gain.setTargetAtTime(prefs.effects && !effectsPaused ? .7 : 0,ac.currentTime,.02);render();
    } });
    document.addEventListener('pointerdown', unlock, { passive: true });
    document.addEventListener('keydown', unlock);
    document.addEventListener('visibilitychange', () => { if (document.hidden)
        {stop();score.pause(true);} });
    window.addEventListener('pagehide',()=>{stop();stopEffects();score.pause(true);});
    window.addEventListener('blur',()=>{stopEffects();score.pause(true);});
    const parent = document.querySelector('.settings') || document.querySelector('main');
    parent.append(row);
    render();
    const style = document.createElement('style');
    style.textContent =
        'body[data-phase=playing] section.intro,body[data-phase=celebrate] section.intro{display:none}.settings{flex-wrap:wrap}.settings select{font-size:16px;min-height:44px}.play-preferences{flex-basis:100%}body[data-phase=playing]>header,body[data-phase=celebrate]>header{display:none}body[data-phase=playing] .intro>div:first-child,body[data-phase=celebrate] .intro>div:first-child{display:none}body[data-phase=playing] .hud .tile:nth-child(2),body[data-phase=playing] .hud>.stat:last-child{display:none}body[data-phase=playing] .hud{grid-template-columns:1fr 1fr;margin:6px 0}body[data-phase=playing] main,body[data-phase=celebrate] main{padding-top:6px}.play-preferences{display:flex;flex-wrap:wrap;gap:5px;grid-column:1/-1}.play-preferences button{min-height:44px;border:1px solid #cbdabf;border-radius:11px;padding:7px 10px;background:#fffdf5;color:#315938;font:600 12px system-ui;touch-action:manipulation}.play-preferences [aria-pressed=true]{background:#e3efd7}body[data-phase=playing] .settings,body[data-phase=celebrate] .settings{margin-bottom:4px}body[data-phase=playing] .profile-note{display:none}body[data-phase=playing] .journey{padding:3px 0}body[data-phase=playing] .question-row .picture{display:none}body[data-phase=playing] #work{padding:12px}body[data-phase=playing] #work h2{font-size:20px;margin-top:0}body[data-phase=playing] .word-goal{margin:6px 0;padding:8px 10px}body[data-phase=playing] .topline>span{max-width:58%}@media(max-width:740px){body[data-phase=playing] .scene-frame canvas{height:145px}body[data-phase=playing] .hud{font-size:12px}body[data-phase=playing] .settings{position:sticky;top:0;z-index:30;background:#f6f8eff5}body[data-phase=playing] .play-preferences button{font-size:11px;padding:6px 8px}.play-preferences{width:100%}body[data-phase=playing] .status{font-size:11px}}';
    style.textContent += '@media(max-width:740px){body[data-phase=playing] .play-preferences{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}body[data-phase=playing] .play-preferences button{font-size:10px;min-width:0;padding:5px 1px;line-height:1.1}body[data-phase=playing] .switch-note{display:none!important}body[data-phase=playing] .settings label{font-size:10px;line-height:12px}body[data-phase=playing] .settings{padding:4px 0;gap:4px;margin-bottom:4px}}';
    style.textContent += '@media(max-width:740px){body[data-phase=playing] .scene-frame canvas{min-height:0!important;height:105px!important}body[data-phase=playing] #work #question{font-size:16px;line-height:1.2;padding-top:0}body[data-phase=playing] #chapter{display:none}body[data-phase=playing] #work .question-row{margin-bottom:4px}body[data-phase=playing] #work #rule{font-size:12px;line-height:1.2;padding:5px}}';
    style.textContent += '@media(max-width:740px),(max-height:500px){body[data-phase=playing] .board .status{position:static;width:100%;border-radius:0;margin:0;padding:5px 8px;opacity:1}body[data-phase=playing] .board:not(#board) .topline{position:static;order:-1;padding:5px 7px;background:#edf6e4}body[data-phase=playing] .board:not(#board){display:flex;flex-direction:column}body[data-phase=playing] .board:not(#board) canvas{order:0}body[data-phase=playing] .board:not(#board) .status{order:1}}';
    style.textContent += '@media(max-width:740px) and (min-height:550px){body[data-phase=playing] .scene-frame canvas{height:165px!important}}@media(max-height:500px){body[data-phase=playing] .scene-frame canvas{height:120px!important}}';
    document.head.append(style);
    const exit = document.createElement('a');
    exit.className = 'play-exit';
    exit.href = '/';
    exit.textContent = 'Für heute fertig';
    (document.querySelector('.card') || document.getElementById('work') || document.querySelector('main')).append(exit);
    const exitStyle = document.createElement('style');
    exitStyle.textContent = '.play-exit{display:none}body[data-phase=ended] .play-exit{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 14px;margin-top:8px;color:#355f37;border:1px solid #cadabb;border-radius:12px;background:#fffdf4;text-decoration:none}';
    document.head.append(exitStyle);
    // Keep settings available without letting setup chrome displace the task.
    queueMicrotask(()=>{
        const settings=document.querySelector('.settings');if(!settings)return;
        const panel=document.createElement('div');panel.id='play-options-panel';panel.className='play-options-panel';
        while(settings.firstChild)panel.append(settings.firstChild);
        const tools=document.createElement('div');tools.className='play-toolbar';
        const toggle=document.createElement('button');toggle.type='button';toggle.id='play-options';toggle.textContent='Spieloptionen';toggle.setAttribute('aria-controls',panel.id);toggle.setAttribute('aria-expanded','false');
        tools.append(toggle,listen);const pause=panel.querySelector('#pause');if(pause)tools.append(pause);
        settings.append(tools,panel);toggle.onclick=()=>{const open=document.body.dataset.optionsOpen!=='true';document.body.dataset.optionsOpen=String(open);toggle.setAttribute('aria-expanded',String(open));};
        let previous='';const sync=()=>{const phase=document.body.dataset.phase||'ready';mode.disabled=['playing','paused','celebrate'].includes(phase);mode.title=mode.disabled?'Wähle die Spielart vor der nächsten Runde.':'';if(phase!==previous){document.body.dataset.optionsOpen='false';toggle.setAttribute('aria-expanded','false');previous=phase;if(phase==='ended')score.pause(true);} };
        new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-phase']});sync();
    });
    const compact=document.createElement('style');compact.textContent=
    '.settings{display:flex!important;flex-wrap:wrap;min-width:0}.play-options-panel{display:flex;flex-wrap:wrap;gap:8px;width:100%;min-width:0}.play-options-panel label{flex:1;min-width:160px}.play-toolbar{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.play-toolbar button{min-height:44px;min-width:44px;padding:8px 12px;border:1px solid #cadabb;border-radius:12px;background:#fffdf5;color:#315938;font:600 13px system-ui}.play-toolbar #play-options{display:none}body[data-phase=playing] #journey-note,body[data-phase=celebrate] #journey-note{display:none}body[data-phase=playing] .settings,body[data-phase=celebrate] .settings{position:static!important}body[data-phase=playing] .play-toolbar,body[data-phase=celebrate] .play-toolbar{width:100%}body[data-phase=playing] #play-options,body[data-phase=celebrate] #play-options{display:inline-block}body[data-phase=playing]:not([data-options-open=true]) .play-options-panel,body[data-phase=celebrate]:not([data-options-open=true]) .play-options-panel{display:none}body[data-options-open=true] .play-options-panel{display:flex;flex-wrap:wrap;width:100%;gap:8px;padding:8px 0}.play-options-panel select{max-width:100%;width:auto;flex:1;min-width:160px}body[data-phase=playing] .word-goal #picture{display:none}body[data-phase=playing] .word-goal{grid-template-columns:1fr!important}body[data-phase=playing] .word-goal #target{font-size:16px;line-height:1.3}@media(max-width:740px){body[data-phase=playing] .scene-frame canvas{height:90px!important}body[data-phase=playing] .journey{display:none}body[data-phase=playing] #message-context{font-size:12px;line-height:1.3;margin:0 0 6px}body[data-phase=playing] #work{padding:10px}body[data-phase=playing] #choices{gap:6px}body[data-phase=playing] .choice{min-height:48px;padding:10px;font-size:16px}}@media(max-height:500px){body[data-phase=playing] .word-goal{position:sticky;top:0;z-index:35;background:#fffdf1}body[data-phase=playing] .hud{display:none!important}}';document.head.append(compact);
    const begin = () => { if(!greeted&&prefs.speech&&CUES[introKey]){greeted=true;speak(CUES[introKey]);}else speak(text()); return requestAnimationFrame(() => requestAnimationFrame(() => { if (document.body.dataset.phase === 'playing')
        window.scrollTo({ top: 0, behavior: 'instant' }); })); };
    return { sound, speak, stop, begin, pauseEffects:value=>{effectsPaused=value===true;score.pause(effectsPaused);if(effectsPaused)stopEffects();else if(master&&ac)master.gain.setTargetAtTime(prefs.effects?.7:0,ac.currentTime,.02);}, cue: key => {if(!prefs.speech||!CUES[key]||owner==='manual')return false;if(owner==='auto'){queuedVoice=CUES[key];return true;}return speak(CUES[key]);}, mode: () => prefs.mode, configure: f => { text = f; }, preferences: () => ({ ...prefs }), audio: () => ({ state: ac?.state || 'none', master, context: ac, speechPending: !!utterance || !!source || !!owner, speechContext: sc, speechMaster: sm, owner, manual, queuedSpeech:!!queuedVoice, speechSource:source, musicContext:score.context, musicMaster:score.master, musicPaused:score.paused, musicDucked:score.ducked }) };
}
