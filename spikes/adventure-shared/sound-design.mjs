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
