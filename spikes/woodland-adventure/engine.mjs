import {makeCampaign} from "./campaign.mjs";
// Authored private campaign, without account rewards.
const BASE_LEVEL = Object.freeze({width:5720,height:720,home:5480,rabbit:4860,
 grounds:Object.freeze([[0,850],[990,640],[1760,360],[2500,660],[3300,700],[4140,1580]].map(([x,w],i)=>Object.freeze({id:'g'+i,x,y:430,w,h:300,solid:true}))),
 ledges:Object.freeze([{id:'l0',x:480,y:350,w:160},{id:'l1',x:710,y:295,w:130},{id:'l2',x:1210,y:350,w:150},{id:'l3',x:1450,y:290,w:150},{id:'ferry',x:2310,y:395,w:160,move:190},{id:'l4',x:2270,y:290,w:135},{id:'l5',x:2780,y:325,w:150},{id:'cave',x:3000,y:240,w:150},{id:'l6',x:3570,y:345,w:170},{id:'l7',x:3830,y:280,w:135},{id:'l8',x:4410,y:350,w:160},{id:'l9',x:4650,y:290,w:150}].map(o=>Object.freeze({...o,h:22}))),
 stones:Object.freeze([{id:'s0',x:882,y:424,w:72,h:26},{id:'s1',x:1664,y:424,w:62,h:26},{id:'s2',x:2408,y:424,w:66,h:26},{id:'s3',x:3194,y:424,w:72,h:26},{id:'s4',x:4040,y:424,w:64,h:26}].map(Object.freeze)),
 berries:Object.freeze([[260,389],[520,310],[746,253],[1130,390],[1250,310],[1490,250],[1810,390],[1930,390],[2090,285],[2300,250],[2570,390],[2750,390],[2820,285],[3050,200],[3380,390],[3600,305],[3870,240],[4210,390],[4320,390],[4460,310],[4700,250],[5010,390],[5150,390],[5310,390]].map(([x,y],i)=>Object.freeze({id:i,x,y}))),
 checkpoints:Object.freeze([{x:120,y:430},{x:1830,y:430},{x:3380,y:430},{x:4560,y:430}].map(Object.freeze)),spring:2700,secret:{x:3060,y:220}});
export const LEVELS=makeCampaign(BASE_LEVEL);
export let LEVEL=LEVELS[0];
export function selectLevel(id){const next=LEVELS.find(l=>l.id===id);if(!next)throw Error('Invalid level');LEVEL=next;return LEVEL;}
export const PHYSICS=Object.freeze({speed:320,acceleration:1900,friction:2300,gravity:1650,jump:610,coyote:.12,buffer:.14});
const approach=(v,target,by)=>v<target?Math.min(v+by,target):Math.max(v-by,target);
export function surfaces(t=0){return [...LEVEL.grounds,...LEVEL.stones,...LEVEL.ledges.map(p=>({...p,x:p.x+(p.move?Math.sin(t*.85)*p.move:0),y:p.y+(p.moveY?Math.sin(t*.7)*p.moveY:0)}))];}
export function createState(){return {phase:'ready',levelId:LEVEL.id,levelVersion:LEVEL.version,time:0,x:120,y:366,w:38,h:64,vx:0,vy:0,face:1,grounded:true,standing:'g0',coyote:.12,buffer:0,prevJump:false,jumps:0,falls:0,checkpoint:0,berries:[],secret:false,rescued:false,followerX:0,events:[],landPulse:0,resetFade:0,winTime:0,springLock:0,toast:LEVEL.description};}
export function start(s){if(s.phase==='ready'){s.phase='playing';s.events=['start'];}}
export function pause(s){if(s.phase==='playing'){s.phase='paused';s.prevJump=false;s.buffer=0;s.vx=0;}}
export function resume(s){if(s.phase==='paused'){s.phase='playing';s.prevJump=false;s.buffer=0;}}
export function respawn(s){const p=LEVEL.checkpoints[s.checkpoint];s.x=p.x;s.y=p.y-s.h;s.vx=0;s.vy=0;s.grounded=true;s.standing=LEVEL.grounds.find(g=>s.x>=g.x&&s.x<g.x+g.w)?.id||null;s.buffer=0;s.coyote=.12;s.resetFade=.45;s.falls++;s.events.push('return');s.toast='Alles gut. Weiter geht’s vom Rastplatz.';}
function update(s,input,dt){
 const oldTime=s.time;s.time+=dt;s.landPulse=Math.max(0,s.landPulse-dt);s.resetFade=Math.max(0,s.resetFade-dt);s.springLock=Math.max(0,s.springLock-dt);
 const old=surfaces(oldTime),all=surfaces(s.time),carrier=all.find(p=>p.id===s.standing&&(p.move||p.moveY));if(carrier&&s.grounded){const before=old.find(p=>p.id===carrier.id);s.x+=carrier.x-before.x;s.y+=carrier.y-before.y;}
 const dir=Math.sign(Number(!!input.right)-Number(!!input.left));s.vx=approach(s.vx,dir*PHYSICS.speed,(dir?PHYSICS.acceleration:PHYSICS.friction)*dt);if(dir)s.face=dir;
 if(input.jump&&!s.prevJump)s.buffer=PHYSICS.buffer;s.prevJump=!!input.jump;
 if(s.grounded)s.coyote=PHYSICS.coyote;else s.coyote=Math.max(0,s.coyote-dt);
 s.buffer=Math.max(0,s.buffer-dt);
 if(s.buffer>0&&s.coyote>0){s.vy=-PHYSICS.jump;s.grounded=false;s.standing=null;s.coyote=0;s.buffer=0;s.jumps++;s.events.push('jump');}
 if(!input.jump&&s.vy<-260&&s.springLock<=0)s.vy=-260;
 const previousX=s.x;s.x=Math.max(0,Math.min(LEVEL.width-s.w,s.x+s.vx*dt));
 for(const p of LEVEL.grounds){if(s.y+s.h>p.y+8&&s.y<p.y+p.h&&s.x+s.w>p.x&&s.x<p.x+p.w){if(previousX+s.w<=p.x+.1)s.x=p.x-s.w;else if(previousX>=p.x+p.w-.1)s.x=p.x+p.w;s.vx=0;}}
 const inGlider=LEVEL.glider&&s.x>=LEVEL.glider.from&&s.x<=LEVEL.glider.to&&!s.grounded&&input.jump; s.gliding=!!inGlider; const wind=LEVEL.wind&&s.x>=LEVEL.wind.from&&s.x<=LEVEL.wind.to&&!s.grounded?LEVEL.wind.force:0;
 const previousBottom=s.y+s.h;s.vy=Math.min(inGlider?95:920,s.vy+(PHYSICS.gravity*(inGlider?.22:1)-wind)*dt);s.y+=s.vy*dt;s.grounded=false;s.standing=null;
 if(s.vy>=0){for(const p of all){if(s.x+s.w>p.x+3&&s.x<p.x+p.w-3&&previousBottom<=p.y+.5&&s.y+s.h>=p.y){const impact=s.vy;s.y=p.y-s.h;s.vy=0;s.grounded=true;s.standing=p.id;s.coyote=PHYSICS.coyote;if(impact>100){s.landPulse=.15;s.events.push('land');}break;}}}
 if(s.grounded&&Math.abs(s.x+s.w/2-LEVEL.spring)<38&&s.springLock<=0){s.vy=-820;s.grounded=false;s.standing=null;s.springLock=.5;s.events.push('spring');}
 for(const b of LEVEL.berries){if(!s.berries.includes(b.id)&&Math.hypot(s.x+s.w/2-b.x,s.y+s.h*.45-b.y)<44){s.berries.push(b.id);s.events.push('berry');}}
 for(let i=s.checkpoint+1;i<LEVEL.checkpoints.length;i++){const p=LEVEL.checkpoints[i];if(Math.abs(s.x-p.x)<70&&s.grounded){s.checkpoint=i;s.events.push('checkpoint');s.toast='Rastplatz gefunden. Dein Weg bleibt erhalten.';}}
 if(!s.secret&&Math.hypot(s.x+s.w/2-LEVEL.secret.x,s.y+s.h/2-LEVEL.secret.y)<72){s.secret=true;s.events.push('secret');s.toast='Psst … du hast die Glühwürmchenhöhle entdeckt!';}
 if(!s.rescued&&Math.abs(s.x-LEVEL.rabbit)<72&&s.y>300){s.rescued=true;s.followerX=s.x-60;s.events.push('friend');s.toast=['home','festival'].includes(LEVEL.finish)?'Hasi ist dabei! Gemeinsam zum Baumhaus.':'Hasi ist dabei! Gemeinsam zum nächsten Rastplatz.';}
 if(s.rescued)s.followerX=approach(s.followerX,s.x-70,220*dt);
 if(s.x>LEVEL.home&&s.grounded){if(s.rescued){s.phase='won';s.winTime=s.time;s.vx=0;s.events.push('win');s.toast=['home','festival'].includes(LEVEL.finish)?'Zu Hause! Hasi und Cleverli sind angekommen.':'Ihr habt den Weg geschafft. Zeit für eine gemütliche Ankunft.';}else s.toast='Hasi wartet noch auf der Waldlichtung links.';}
 if(s.y>LEVEL.height+40)respawn(s);
}
export function step(s,input,delta){if(s.phase!=='playing'||!Number.isFinite(delta)||delta<=0)return s;s.events=[];let left=Math.min(delta,.1);while(left>1e-8&&s.phase==='playing'){const dt=Math.min(left,1/120);update(s,input,dt);left-=dt;if(s.events.includes('return'))break;}return s;}
export function section(x){if(LEVEL.id!=='home-trail')return LEVEL.title;return x<1760?'Am Waldrand':x<3300?'Über den Bach':x<4500?'Bei den Glühwürmchen':'Die Waldlichtung';}
