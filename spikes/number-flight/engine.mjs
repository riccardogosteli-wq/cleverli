export const GRADE_LABELS=['','Zahlen und Mengen bis 5','Plus bis 20','2er, 5er und 10er-Reihe','Rechnen mit Zehnerzahlen','Hälften und Viertel','Brüche und Kommazahlen'];
export const PROFILES={1:{static:true,choices:2,seconds:0,goals:2,speed:.08,dots:true,max:5},2:{static:true,choices:3,seconds:0,goals:3,speed:.1,max:20},3:{static:true,choices:3,seconds:0,goals:4,speed:.1,max:100},4:{static:true,choices:3,seconds:0,goals:4,speed:.1,max:200},5:{static:true,choices:3,seconds:0,goals:4,speed:.1,max:200},6:{static:true,choices:3,seconds:0,goals:4,speed:.1,max:300}};
export function rng(seed=1){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
const int=(r,a,b)=>a+Math.floor(r()*(b-a+1)),gcd=(a,b)=>b?gcd(b,a%b):a,pick=(r,a)=>a[int(r,0,a.length-1)];
export function display(units,grade){return grade>=5?(units/100).toLocaleString('de-CH',{maximumFractionDigits:2}).replace('.',','):String(units);}
export function labelFor(units,grade,r){
 if(grade===3){const factors=[2,5,10].filter(a=>units%a===0&&units/a<=10);if(factors.length){const a=pick(r,factors);return{label:a+' × '+units/a,kind:'multiply',a,b:units/a};}}
 if(grade===4){const d=10;return r()<.5?{label:units-d+' + '+d,kind:'add',a:units-d,b:d}:{label:units+d+' − '+d,kind:'subtract',a:units+d,b:d};}
 if(grade>=5){if(grade===6&&units>=50&&r()<.33){const a=units-25,b=25;return{label:display(a,grade)+' + '+display(b,grade),kind:'decimalAdd',a,b};}if(units<=100&&r()<.5){const d=gcd(units,100);return{label:units/d+'/'+100/d,kind:'fraction',a:units/d,b:100/d};}return{label:display(units,grade),kind:'decimal',a:units,b:100};}
 return{label:String(units),kind:'integer',a:units,b:1};
}
export function createMission(grade,r=Math.random){if(!PROFILES[grade]||!Number.isInteger(grade))throw Error('Invalid grade');let a,b=0;
 if(grade===1)a=int(r,1,5);
 if(grade===2){const target=int(r,4,20);a=int(r,1,Math.min(9,target-1));b=target-a;}
 if(grade===3){a=pick(r,[2,5,10])*int(r,1,5);b=pick(r,[2,5,10])*int(r,1,5);}
 if(grade===4){a=int(r,2,8)*10;b=int(r,2,8)*10;}
 if(grade===5){a=pick(r,[25,50,75]);b=pick(r,[25,50,75]);}
 if(grade===6){a=pick(r,[25,50,75,100,125]);b=pick(r,[25,50,75,100]);}
 return{grade,target:a+b,first:a,scale:grade>=5?100:1};
}
export function makeWave(m,energy,r=Math.random){const remaining=m.target-energy,step=m.grade>=5?25:m.grade===4?10:1,good=energy===0?m.first:remaining;
 if(m.grade===1){const other=good===5?4:good+1,values=r()<.5?[good,other]:[other,good];return[{units:values[0],...labelFor(values[0],1,r)},null,{units:values[1],...labelFor(values[1],1,r)}];}
 const values=[good];for(const candidate of[good-step,good+step,good+step*2,step,step*2,step*3])if(candidate>0&&candidate<=PROFILES[m.grade].max&&!values.includes(candidate)&&values.length<3)values.push(candidate);
 if(values.length!==3)throw Error('Invalid choice range');const shift=int(r,0,2);return values.map((_,i)=>{const units=values[(i+shift)%3];return{units,...labelFor(units,m.grade,r)}});
}
export function applyEnergy(energy,units,target){if(![energy,units,target].every(Number.isSafeInteger)||units<=0||energy<0||target<=0)throw Error('Invalid energy');const next=energy+units;return next===target?{energy:0,outcome:'boost'}:next>target?{energy,outcome:'overshoot'}:{energy:next,outcome:'collect'};}
export function evaluateChoice(c,scale=1){if(c.kind==='multiply')return c.a*c.b;if(c.kind==='divide')return c.a/c.b;if(c.kind==='add')return c.a+c.b;if(c.kind==='subtract')return c.a-c.b;if(c.kind==='decimalAdd')return c.a+c.b;return c.a/c.b*scale;}
