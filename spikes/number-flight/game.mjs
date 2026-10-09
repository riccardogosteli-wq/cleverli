import {rng,createMission,makeWave,applyEnergy,display,GRADE_LABELS} from '/labs/number-flight/engine.js';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d'),Y=[.28,.51,.74];
const mascot=new Image();mascot.src='/murmeli-icon-v3-192.png';
let w=960,h=530,last=0,random=rng(Date.now()),s,cols=[],clouds=[],sparks=[],spawn=0,flash=0,toast=0,raf=0;
let slow=true,grade=1;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const starRandom=rng(83),sky=Array.from({length:65},()=>({x:starRandom(),y:starRandom(),r:starRandom()*1.5+.4,depth:starRandom()+.2}));
function key(){return 'cleverli_number_flight_prototype_v1:'+grade+':'+(slow?'slow':'normal');}
function best(){try{return Math.max(0,Number(localStorage.getItem(key()))||0);}catch{return 0;}}
function reset(){s={phase:'ready',grade,energy:0,stars:0,boosts:0,combo:0,lane:1,y:Y[1],elapsed:0,travel:0,cooldown:0,mission:createMission(grade,random)};cols=[];clouds=[];sparks=[];spawn=.25;flash=0;toast=0;hud();lanes();}
function hud(){const target=s.mission.target;$('energy').textContent=display(s.energy,grade)+' / '+display(target,grade);$('remaining').textContent='Noch '+display(target-s.energy,grade);$('fill').style.width=(s.energy/target*100)+'%';$('stars').textContent=s.stars+' ★';$('combo').textContent=s.boosts+' Boost'+(s.boosts===1?'':'s');const left=Math.max(0,Math.ceil(90-s.elapsed));$('time').textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');$('distance').textContent=Math.floor(s.travel)+' m';$('mode').textContent=GRADE_LABELS[grade];$('grade').disabled=['playing','paused'].includes(s.phase);$('slow').disabled=['playing','paused'].includes(s.phase);$('pause').disabled=s.phase!=='playing';}
function say(text){$('status').textContent=text;toast=3.5;}
function lanes(){for(const b of document.querySelectorAll('[data-lane]'))b.setAttribute('aria-pressed',String(Number(b.dataset.lane)===s.lane));}
function steer(lane){s.lane=Math.max(0,Math.min(2,lane));lanes();}
function particles(x,y,color,n=15){if(reduced)return;for(let i=0;i<n;i++)sparks.push({x,y,vx:(random()-.5)*.3,vy:(random()-.5)*.5,t:1+random(),color});}
function pickup(units){if(s.phase!=='playing')return;const before=s.energy,result=applyEnergy(s.energy,units,s.mission.target);s.energy=result.energy;
 if(result.outcome==='boost'){s.boosts++;s.combo++;s.stars+=10+Math.min(s.combo,5);s.travel+=200;s.cooldown=1.15;flash=1;particles(.18,s.y,'#ffe18b',32);say('Tank voll! Turbo gezündet. +'+(10+Math.min(s.combo,5))+' Sterne');s.mission=createMission(grade,random);cols=[];clouds=[];spawn=1.1;}
 else if(result.outcome==='overshoot'){s.combo=0;flash=-.6;particles(.18,s.y,'#f5a6ac',10);say(display(before,grade)+' + '+display(units,grade)+' ist zu viel. Neuer Versuch mit leerem Tank.');cols=[];spawn=.5;}
 else{particles(.18,s.y,'#8fffd3',10);say('Energie gesammelt! Noch '+display(s.mission.target-s.energy,grade)+' bis zum Turbo.');}
 hud();
}
function column(){const choices=makeWave(s.mission,s.energy,random);cols.push({x:1.13,choices,crossed:false});if(s.boosts>0&&random()<.5)clouds.push({x:1.53,lane:Math.floor(random()*3),hit:false});}
function update(dt){if(s.phase!=='playing')return;s.elapsed=Math.min(90,s.elapsed+dt);if(s.elapsed>=90){finish();return;}s.y+=(Y[s.lane]-s.y)*Math.min(1,dt*13);s.cooldown=Math.max(0,s.cooldown-dt);const speed=(slow?.15:.23)*(s.cooldown>0?1.55:1);s.travel+=dt*(slow?17:25);spawn-=dt;
 if(spawn<=0&&s.cooldown===0){column();spawn=slow?3.5:2.9;}
 for(const c of [...cols]){c.x-=speed*dt;if(!c.crossed&&c.x<=.19){c.crossed=true;const lane=Y.findIndex(y=>Math.abs(s.y-y)<.085);if(lane>=0)pickup(c.choices[lane].units);}}
 cols=cols.filter(c=>c.x>-.13);
 for(const c of clouds){c.x-=speed*dt;if(!c.hit&&c.x<=.2&&c.x>.08&&Math.abs(s.y-Y[c.lane])<.08){c.hit=true;s.combo=0;particles(.18,s.y,'#b4cadd',8);say('Eine kleine Wolke! Deine Energie bleibt im Tank.');}}clouds=clouds.filter(c=>c.x>-.1);
 for(const p of sparks){p.x+=p.vx*dt;p.y+=p.vy*dt;p.t-=dt;}sparks=sparks.filter(p=>p.t>0);flash=Math.sign(flash)*Math.max(0,Math.abs(flash)-dt);toast=Math.max(0,toast-dt);if(toast===0)$('status').textContent='Wähle deine Flugbahn. Fülle den Tank genau bis zum Ziel.';hud();
}
function rounded(x,y,width,height,r=12){ctx.beginPath();ctx.roundRect(x,y,width,height,r);}
function draw(){ctx.clearRect(0,0,w,h);const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#0d304a');bg.addColorStop(.6,'#153558');bg.addColorStop(1,'#203e60');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 for(const a of sky){let x=(a.x*w-s.travel*.4*a.depth)%w;if(x<0)x+=w;ctx.globalAlpha=.25+a.depth*.4;ctx.fillStyle='#c5edff';ctx.beginPath();ctx.arc(x,a.y*h,a.r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 ctx.fillStyle='#f5ba6144';ctx.beginPath();ctx.arc(w*.85,h*.15,Math.max(35,w*.054),0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f9d48555';ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(w*.85,h*.15,w*.082,h*.031,-.3,0,Math.PI*2);ctx.stroke();
 for(let i=0;i<3;i++){ctx.strokeStyle=i===s.lane?'#80e7c62e':'#abcdef13';ctx.lineWidth=i===s.lane?2:1;ctx.setLineDash([5,10]);ctx.beginPath();ctx.moveTo(0,Y[i]*h);ctx.lineTo(w,Y[i]*h);ctx.stroke();}ctx.setLineDash([]);
 // Distant mountains and floating islands move more slowly than the rocket.
 ctx.fillStyle='#254c6255';ctx.beginPath();ctx.moveTo(0,h);for(let x=0;x<=w+100;x+=80)ctx.lineTo(x,h*.86-Math.sin(x*.016+s.travel*.0008)*h*.075);ctx.lineTo(w,h);ctx.fill();
 const visible=s.phase==='ready'?[{x:.68,choices:makeWave(s.mission,0,rng(21))}]:cols;
 for(const c of visible)for(let lane=0;lane<3;lane++){const choice=c.choices[lane],x=c.x*w,y=Y[lane]*h,bw=Math.max(w<600?60:76,choice.label.length*(w<600?9:12)+18),bh=w<600?48:58;ctx.shadowColor='#65d9eb66';ctx.shadowBlur=16;rounded(x-bw/2,y-bh/2,bw,bh,24);ctx.fillStyle='#d7f7ff';ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#67d9e0';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#0b344b';ctx.font='800 '+(w<600?16:21)+'px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(choice.label,x,y);}
 for(const c of clouds){const x=c.x*w,y=Y[c.lane]*h;ctx.fillStyle=c.hit?'#60758c55':'#a9bfd0';ctx.beginPath();ctx.ellipse(x,y,32,15,0,0,Math.PI*2);ctx.arc(x-10,y-10,17,0,Math.PI*2);ctx.arc(x+12,y-8,20,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3b5267';ctx.font='bold 17px system-ui';ctx.textAlign='center';ctx.fillText('≈',x,y+2);}
 const rx=w*.17,ry=s.y*h,scale=w<600?.78:1;
 ctx.save();ctx.translate(rx,ry);ctx.scale(scale,scale);ctx.fillStyle=s.cooldown>0?'#ffe7a4':'#87edcd';ctx.beginPath();ctx.moveTo(-34,-13);ctx.lineTo(-58-(s.phase==='playing'&&!reduced?Math.sin(s.elapsed*30)*9:0),0);ctx.lineTo(-34,13);ctx.fill();ctx.fillStyle='#50bcb5';ctx.beginPath();ctx.moveTo(-14,-20);ctx.lineTo(-26,-35);ctx.lineTo(16,-19);ctx.fill();ctx.beginPath();ctx.moveTo(-14,20);ctx.lineTo(-26,35);ctx.lineTo(16,19);ctx.fill();ctx.fillStyle='#e3f6ff';ctx.beginPath();ctx.ellipse(0,0,38,23,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f4c468';ctx.beginPath();ctx.moveTo(28,-18);ctx.lineTo(46,0);ctx.lineTo(28,18);ctx.fill();ctx.fillStyle='#143b51';ctx.beginPath();ctx.arc(-2,0,18,0,Math.PI*2);ctx.fill();if(mascot.complete&&mascot.naturalWidth){ctx.save();ctx.beginPath();ctx.arc(-2,0,17,0,Math.PI*2);ctx.clip();ctx.drawImage(mascot,-20,-18,36,36);ctx.restore();}ctx.restore();
 for(const p of sparks){ctx.globalAlpha=Math.min(1,p.t);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x*w,p.y*h,3,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 if(flash!==0){ctx.fillStyle=flash>0?'#ffe8a30f':'#f7a5ad10';ctx.fillRect(0,0,w,h);if(flash>0){ctx.fillStyle='#ffe092';ctx.font='900 '+(w<600?28:48)+'px system-ui';ctx.textAlign='center';ctx.fillText('TURBO!',w*.5,h*.16);}}
}
function show(title,text,button,badge){$('overlay-title').textContent=title;$('overlay-text').textContent=text;$('start').textContent=button;$('badge').textContent=badge;$('overlay').hidden=false;$('best').textContent='Persönlicher Testrekord: '+best()+' Sterne · Nur auf diesem Gerät';}
function start(){random=rng(crypto.getRandomValues(new Uint32Array(1))[0]);reset();s.phase='playing';$('overlay').hidden=true;$('again').hidden=true;say('Los geht’s! Ziel: '+display(s.mission.target,grade)+' Energie.');hud();canvas.focus({preventScroll:true});}
function pause(){if(s.phase!=='playing')return;s.phase='paused';show('Kurze Flugpause','Der Tank und die Flugzeit bleiben genau so stehen.','Weiterfliegen','☁️');$('again').hidden=false;hud();}
function resume(){if(s.phase!=='paused')return;s.phase='playing';$('overlay').hidden=true;$('again').hidden=true;hud();canvas.focus({preventScroll:true});}
function finish(){s.phase='ended';let old=best();if(s.stars>old)try{localStorage.setItem(key(),String(s.stars));}catch{}show('Dein Testflug ist geschafft!',s.boosts+' Turbo'+(s.boosts===1?'':'s')+', '+s.stars+' Sterne und '+Math.floor(s.travel)+' Meter. '+(s.stars>old?'Ein neuer persönlicher Testrekord!':'Jeder Flug ist ein neues Abenteuer.'),'Noch einen Testflug starten','🌟');$('again').hidden=false;hud();}
$('start').onclick=()=>s.phase==='paused'?resume():start();$('pause').onclick=pause;$('again').onclick=()=>{reset();show('Bereit zum Abheben?','Wähle Klasse und Tempo. Sammle Energie genau bis zum Ziel und weiche Wolken aus.','Testflug starten','🚀');$('again').hidden=true;};
$('grade').onchange=()=>{grade=Number($('grade').value);reset();show('Neue Klasse, neues Abenteuer!','Jetzt übst du: '+GRADE_LABELS[grade]+'. Wähle deinen Flug und starte, wenn du bereit bist.','Testflug starten','🚀');};$('slow').onclick=()=>{slow=!slow;$('slow').setAttribute('aria-pressed',String(slow));$('slow').textContent=slow?'Gemütlich ✓':'Normal ⚡';$('best').textContent='Persönlicher Testrekord: '+best()+' Sterne · Nur auf diesem Gerät';};
for(const b of document.querySelectorAll('[data-lane]'))b.onclick=()=>steer(Number(b.dataset.lane));
function point(e){const rect=canvas.getBoundingClientRect(),y=(e.clientY-rect.top)/rect.height;steer(Y.reduce((a,v,i)=>Math.abs(v-y)<Math.abs(Y[a]-y)?i:a,0));}
canvas.addEventListener('pointerdown',e=>{if(s.phase!=='playing')return;point(e);canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(e.buttons&&s.phase==='playing')point(e);});
window.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(s.phase==='playing'&&['ArrowUp','ArrowDown','w','s','W','S'].includes(e.key)){e.preventDefault();steer(s.lane+(['ArrowUp','w','W'].includes(e.key)?-1:1));}if(e.key==='Escape'&&s.phase==='playing'){e.preventDefault();pause();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('blur',pause);
function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);}
new ResizeObserver(resize).observe(canvas);window.addEventListener('pagehide',()=>cancelAnimationFrame(raf));
function frame(now){const dt=last?Math.min(.05,(now-last)/1000):0;last=now;update(dt);draw();raf=requestAnimationFrame(frame);}
reset();resize();raf=requestAnimationFrame(frame);
if(new URLSearchParams(location.search).get('internal_qa')==='1')window.numberFlightTest={state:()=>structuredClone(s),pickup,step:seconds=>{for(let t=0;t<seconds;t+=.02)update(Math.min(.02,seconds-t));},wave:()=>structuredClone(cols),steer};
