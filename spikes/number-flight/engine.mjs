export const GRADE_LABELS = ['','Plus bis 20','Plus bis 100','Mal und geteilt','Grosse Zahlen','Brüche und Dezimalzahlen','Prozente und Brüche'];
export function rng(seed=1){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
const int=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const gcd=(a,b)=>b?gcd(b,a%b):a;
export function display(units,grade){if(grade===6)return units+'%';if(grade===5)return (units/100).toLocaleString('de-CH',{maximumFractionDigits:2}).replace('.',',');return String(units);}
export function labelFor(units,grade,r){
 if(grade===3){const factors=[];for(let a=2;a<=10;a++)if(units%a===0&&units/a<=10)factors.push(a);if(factors.length&&r()<.65){const a=factors[int(r,0,factors.length-1)];return{label:a+' × '+units/a,kind:'multiply',a,b:units/a};}return{label:(units*2)+' ÷ 2',kind:'divide',a:units*2,b:2};}
 if(grade===4){const d=int(r,1,5)*100;return{label:(units+d)+' − '+d,kind:'subtract',a:units+d,b:d};}
 if(grade>=5){const type=int(r,0,grade===6?2:1);if(type===0){const d=gcd(units,100);return{label:(units/d)+'/'+(100/d),kind:'fraction',a:units/d,b:100/d};}if(type===1)return{label:(units/100).toFixed(2).replace('.',','),kind:'decimal',a:units,b:100};return{label:units+'%',kind:'percent',a:units,b:100};}
 return{label:String(units),kind:'integer',a:units,b:1};
}
export function createMission(grade,r=Math.random){if(!Number.isInteger(grade)||grade<1||grade>6)throw Error('Invalid grade');let a,b;
 if(grade===1){const target=int(r,6,20);a=int(r,1,target-1);b=target-a;}
 if(grade===2){const target=int(r,20,100);a=int(r,3,target-3);b=target-a;}
 if(grade===3){a=int(r,2,6)*int(r,2,6);b=int(r,2,6)*int(r,2,6);}
 if(grade===4){a=int(r,2,12)*100;b=int(r,2,12)*100;}
 if(grade===5){const target=int(r,4,12)*25;a=int(r,1,target/25-1)*25;b=target-a;}
 if(grade===6){const target=int(r,10,30)*5;a=int(r,1,target/5-1)*5;b=target-a;}
 return{grade,target:a+b,first:a,scale:grade>=5?100:1};
}
export function makeWave(mission,energy,r=Math.random){const step=mission.grade>=5?(mission.grade===5?25:5):mission.grade===4?100:1;const remaining=mission.target-energy;const safe=energy===0?mission.first:remaining;const rawExtra=mission.target+step*int(r,1,3);const extra=mission.grade===1?Math.min(20,rawExtra):mission.grade===2?Math.min(100,rawExtra):rawExtra;const alternative=Math.max(step,safe-step);const values=[safe,extra,alternative];const shift=int(r,0,2);return values.map((_,i)=>{const units=values[(i+shift)%3];return{units,...labelFor(units,mission.grade,r)};});}
export function applyEnergy(energy,units,target){if(![energy,units,target].every(Number.isSafeInteger)||units<=0||energy<0||target<=0)throw Error('Invalid energy');const next=energy+units;if(next===target)return{energy:0,outcome:'boost'};if(next>target)return{energy:0,outcome:'overshoot'};return{energy:next,outcome:'collect'};}
export function evaluateChoice(c,scale=1){if(c.kind==='multiply')return c.a*c.b;if(c.kind==='divide')return c.a/c.b;if(c.kind==='subtract')return c.a-c.b;return c.a/c.b*scale;}
