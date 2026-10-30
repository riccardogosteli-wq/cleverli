export function action(e,state,target){
 const actions=[{right:true,jump:false},{right:true,jump:true},{jump:false},{jump:true},{left:true,jump:true},{left:true,jump:false}];
 const score=s=>{if(s.phase==='won')return 1e7;const dist=target?Math.abs(s.x+s.w/2-target.x)+Math.abs(s.y+s.h-target.y)*1.3:0;return (target?-dist:s.x)-Math.max(0,s.y-440)*2+(s.grounded?14:0)-(s.jumps-state.jumps)*1.5;};
 let beam=[{s:structuredClone(state),first:null,score:score(state)}];
 for(let depth=0;depth<9;depth++){const next=[],seen=new Set();for(const node of beam)for(const a of actions){const s=structuredClone(node.s);for(let j=0;j<10;j++){e.step(s,a,1/60);if(s.falls>state.falls||s.y>550)break;}if(s.falls>state.falls||s.y>550)continue;const key=[Math.round(s.x/24),Math.round(s.y/24),Math.round(s.vx/120),Math.round(s.vy/140),s.prevJump, s.standing].join(',');if(seen.has(key))continue;seen.add(key);next.push({s,first:node.first||a,score:score(s)});}next.sort((a,b)=>b.score-a.score);beam=next.slice(0,20);if(!beam.length)return {jump:false};if(beam[0].s.phase==='won')break;}
 return beam[0].first;
}
