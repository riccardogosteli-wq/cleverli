// Original layered foley and musical cues, composed for Cleverli. No third-party samples.
const noiseBuffers = new WeakMap();
function noise(context) {
 if(noiseBuffers.has(context)) return noiseBuffers.get(context);
 const buffer = context.createBuffer(1, Math.round(context.sampleRate * .8), context.sampleRate), data=buffer.getChannelData(0);
 let n = 74371; for(let i=0;i<data.length;i++){ n=(n * 16807)%2147483647;data[i]=(n/2147483647*2-1); }
 noiseBuffers.set(context,buffer); return buffer;
}
export function playCue(context, bus, kind, {strength = 1, offset = 0, track = () => {}} = {}) {
 if(!context || context.state !== 'running' || !bus) return;
 const now=context.currentTime+offset, level=Math.max(0,Math.min(1,strength));
 const tone=(frequency,duration,volume=.06,delay=0,type='sine',end=frequency)=>{
  const o=context.createOscillator(),g=context.createGain(),t=now+delay;o.type=type;
  o.frequency.setValueAtTime(frequency,t);o.frequency.exponentialRampToValueAtTime(Math.max(25,end),t+duration*.75);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(volume*level,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
  o.connect(g);g.connect(bus);o.onended=()=>{o.disconnect();g.disconnect();};track(o);o.start(t);o.stop(t+duration+.02);
 };
 const rustle=(duration,volume,frequency,delay=0)=>{
  const s=context.createBufferSource(),f=context.createBiquadFilter(),g=context.createGain(),t=now+delay;s.buffer=noise(context);f.type='lowpass';f.frequency.value=frequency;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(volume*level,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
  s.connect(f);f.connect(g);g.connect(bus);s.onended=()=>{s.disconnect();f.disconnect();g.disconnect();};track(s);s.start(t);s.stop(t+duration+.02);
 };
 if(kind==='step'){rustle(.065,.045,680);tone(95,.06,.035,0,'triangle',65);}
 else if(kind==='place'){rustle(.11,.08,1050);tone(190,.12,.055,0,'triangle',130);tone(510,.16,.025,.018);}
 else if(kind==='page'){rustle(.28,.08,1900);rustle(.15,.04,900,.12);}
 else if(kind==='magnet'){tone(620,.12,.06,0,'sine',780);tone(1240,.18,.035,.045);}
 else if(kind==='jump'){rustle(.13,.028,2600);tone(210,.18,.05,0,'triangle',510);}
 else if(kind==='land'){rustle(.1,.065,570);tone(110,.1,.045,0,'triangle',58);}
 else if(kind==='spring'){tone(170,.35,.045,0,'triangle',800);tone(440,.22,.035,.06,'sine',650);rustle(.12,.03,1500);}
 else if(kind==='door'){rustle(.35,.075,480);tone(160,.32,.025,0,'triangle',90);}
 else if(kind==='door-close'){rustle(.13,.075,450);tone(85,.14,.04,0,'triangle',50);}
 else if(kind==='try'){tone(270,.18,.035,0,'triangle',225);rustle(.075,.025,640);}
 else if(kind==='berry'||kind==='success'){[659.25,987.77].forEach((f,i)=>tone(f,.28,.05,i*.075));}
 else if(kind==='checkpoint'){[392,523.25].forEach((f,i)=>tone(f,.5,.055,i*.13));}
 else if(kind==='friend'){[440,554.37,659.25].forEach((f,i)=>tone(f,.45,.05,i*.15));}
 else if(kind==='secret'){[523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,.65,.045,i*.13));}
 else if(kind==='return'){tone(330,.25,.035);tone(392,.35,.04,.18);}
 else if(kind==='complete'||kind==='win'){[392,523.25,659.25,783.99,659.25,1046.5].forEach((f,i)=>tone(f,.6,.048,i*.16));}
 else tone(523.25,.22,.04);
}

// Four original, low-volume scores. No samples, runtime service or paid calls.
export const SCORES = Object.freeze({
 'number-flight': {step:.62, tone:'sine', notes:[72,76,79,null,76,74,72,null,69,72,76,null,74,null,71,null], roots:[48,45,53,43]},
 'word-magnet': {step:.72, tone:'sine', notes:[64,null,67,72,null,67,64,null,65,69,null,72,69,null,67,null], roots:[48,53,45,43]},
 'bridge-builder': {step:.8, tone:'triangle', notes:[60,null,64,67,null,64,62,null,57,null,60,64,null,62,59,null], roots:[48,45,53,43]},
 'sentence-detective': {step:.86, tone:'sine', notes:[69,null,72,null,76,72,null,69,67,null,71,74,null,71,67,null], roots:[45,53,48,43]}
});
export class LearningScore {
 constructor(game){this.score=SCORES[game]||SCORES['word-magnet'];this.context=null;this.master=null;this.enabled=false;this.paused=true;this.ducked=false;this.nodes=new Set();this.timer=null;this.next=0;this.beat=0;}
 unlock(){try{if(!this.context){this.context=new(window.AudioContext||window.webkitAudioContext)();this.master=this.context.createGain();this.master.connect(this.context.destination);}this.context.resume().catch(()=>{});this.apply();}catch{}}
 stopNodes(){for(const n of this.nodes){try{n.stop();}catch{}}this.nodes.clear();this.next=0;}
 set(value){this.enabled=value===true;this.apply();}
 pause(value){this.paused=value===true;this.apply();}
 duck(value){this.ducked=value===true;this.apply();}
 apply(){if(!this.context)return;const active=this.enabled&&!this.paused,t=this.context.currentTime;this.master.gain.cancelScheduledValues(t);this.master.gain.setTargetAtTime(active?(this.ducked?.2:1):0,t,.04);if(!active){clearInterval(this.timer);this.timer=null;this.stopNodes();}else if(!this.timer){this.timer=setInterval(()=>this.tick(),80);this.tick();}}
 note(midi,t,duration,volume,type){const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=440*2**((midi-69)/12);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(volume,t+.025);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(this.master);this.nodes.add(o);o.onended=()=>{this.nodes.delete(o);o.disconnect();g.disconnect();};o.start(t);o.stop(t+duration+.03);}
 tick(){const c=this.context;if(!c||c.state!=='running'||this.paused||!this.enabled)return;const t=c.currentTime;if(!this.next||this.next<t-.3)this.next=t+.02;while(this.next<t+.14){const i=this.beat%32,n=this.score.notes[i%16],root=this.score.roots[Math.floor(i/8)];if(n!==null){this.note(n+(i>=16?-12:0),this.next,.95,.012,this.score.tone);this.note(n+12,this.next,.3,.0018,'sine');}if(i%4===0)this.note(root,this.next,2.4,.008,'sine');this.next+=this.score.step;this.beat++;}}
}
