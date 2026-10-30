import assert from 'node:assert/strict';import{LEVEL,LEVELS,selectLevel,createState,start,step,surfaces,pause,resume,respawn}from'./engine.mjs';import{createProgress,validate,balance,CATALOG,activeClock,SAVE_KEY}from'./progress.mjs';let checks=0;const ok=(v,m)=>{assert(v,m);checks++;};
export function travel(level,dt=1/60){
 selectLevel(level.id);const s=createState();start(s);let releaseAt=0,wasGrounded=true;
 for(let f=0;f<30000&&s.phase!=='won';f++){
  let right=true,jump=!s.grounded&&s.time<releaseAt;
  const floor=surfaces(s.time).find(p=>p.id===s.standing);
  if(s.grounded&&wasGrounded&&floor&&floor.x+floor.w-s.x-s.w<32&&s.x<LEVEL.home-70){
   const next=surfaces(s.time).filter(p=>p.x>=floor.x+floor.w-4&&p.y>=floor.y-42&&p.y<=floor.y+80).sort((a,b)=>a.x-b.x)[0];
   const reach=next?next.x+Math.min(next.w*.5,65)-s.x:250;
   releaseAt=s.time+(reach<205?.1:.8);jump=true;
  }
  if(level.glider&&s.x>level.glider.from-65&&s.x<level.glider.to&&!s.grounded)jump=true;
  wasGrounded=s.grounded;step(s,{right,jump},dt);ok(Number.isFinite(s.x+s.y),'finite');if(s.falls>8)throw Error('dead end '+level.id+' x'+s.x);
 }
 ok(s.phase==='won','earned '+level.id+' '+JSON.stringify({x:s.x,y:s.y,rescued:s.rescued,falls:s.falls,standing:s.standing}));ok(s.rescued,'friend '+level.id);return{level:level.id,seconds:s.time,falls:s.falls,berries:s.berries.length,jumps:s.jumps};
}
const runs=[];for(const level of LEVELS)for(const dt of[1/30,1/60,1/120])runs.push(travel(level,dt));
let data=new Map;const store={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},p=createProgress(LEVELS,store);for(const l of LEVELS){for(const b of l.berries){ok(p.find(l,b.id),'first');ok(!p.find(l,b.id),'duplicate');}ok(p.finish(l,true,30,'explore'),'finish');}const total=LEVELS.reduce((n,l)=>n+l.berries.length,0);ok(p.balance()===total,'unique wallet');for(const item of CATALOG){ok(p.buy(item.id),'purchase');const n=p.balance();ok(!p.buy(item.id)&&p.balance()===n,'no double spend');}ok(p.balance()===total-100,'budget');const reloaded=createProgress(LEVELS,store);ok(JSON.stringify(reloaded.snapshot())===JSON.stringify(p.snapshot()),'reload');const q=createProgress(LEVELS,store);p.equip('lamp');q.equip('vase');ok(q.snapshot().equipped.includes('lamp')===p.snapshot().equipped.includes('lamp'),'other tab merge');const unavailable=createProgress(LEVELS,{getItem(){throw Error();},setItem(){throw Error();}});ok(unavailable.find(LEVELS[0],0),'memory fallback');ok(unavailable.balance()===1&&!unavailable.status().durable,'storage denial');data.set(SAVE_KEY,'broken');const recovered=createProgress(LEVELS,store);ok(recovered.snapshot().owned.length===6,'backup recovered');recovered.find(LEVELS[0],1);ok(createProgress(LEVELS,store).snapshot().owned.length===6,'recovery write');const clock=activeClock();clock.tick(1000,true);clock.tick(6000,true);ok(clock.seconds()===5,'raw uncapped active time');clock.break();clock.tick(12000,true);clock.tick(14000,false);clock.tick(15000,true);ok(clock.seconds()===6,'paused ignored');p.finish(LEVELS[0],true,22,'trial');p.finish(LEVELS[0],true,25,'trial');ok(p.snapshot().records['home-trail:2:trial']===22,'personal best');assert.throws(()=>validate({...p.snapshot(),owned:CATALOG.map(i=>i.id),found:{}},LEVELS));checks++;selectLevel(LEVELS[0].id);console.log(JSON.stringify({checks,wholeTraversals:runs.length,runs,totalUniqueBerries:total},null,2));
