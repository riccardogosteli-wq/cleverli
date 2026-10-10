// Values are integer-scaled; no floating-point comparisons in scoring.
export const LABELS=['','Mengen bis 5','Zahlen zerlegen bis 20','Einmaleins mit 2 und 5','Zentimeter und Dezimeter','Hälften und Viertel','Brüche und Kommazahlen'];
export const PROFILES={1:{goals:2,max:5,step:1},2:{goals:3,max:20,step:1},3:{goals:3,max:40,step:1},4:{goals:3,max:120,step:10},5:{goals:3,max:200,step:25},6:{goals:3,max:250,step:5}};
export function rng(seed=1){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
export function shuffle(a,r=Math.random){const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
export function format(v,g){return g>=5?(v/100).toLocaleString('de-CH',{maximumFractionDigits:2}).replace('.',','):String(v)+(g===4?' cm':'');}
const SETS={1:[[1,2,3],[1,2,4]],2:[[1,5,10],[2,3,5],[1,4,6],[2,4,7]],3:[[2,4,6,10],[5,10,15,20],[2,6,8,10]],4:[[10,20,30,40],[10,30,40,50],[20,30,40,60]],5:[[25,50,75,100],[25,50,100,150],[25,75,100,125]],6:[[25,50,75,100],[10,20,50,100],[20,40,60,100],[25,50,100,125]]};
const product=v=>({2:'2 × 1',4:'2 × 2',5:'5 × 1',6:'2 × 3',8:'2 × 4',10:'5 × 2',15:'5 × 3',20:'5 × 4'})[v];
const fraction=v=>({25:'1/4',50:'1/2',75:'3/4',100:'1',125:'1 + 1/4',150:'1 + 1/2'})[v];
export function solution(m,remaining=m.target,budget=m.maxBlocks??Infinity){
 if(!Number.isInteger(remaining)||remaining<0)throw Error('Invalid remainder');
 const plans=Array(remaining+1).fill(null);plans[0]=[];
 for(let n=1;n<=remaining;n++)for(const c of m.choices){const prev=plans[n-c.value];if(prev&&(!plans[n]||prev.length+1<plans[n].length))plans[n]=[...prev,c.id];}
 if(!plans[remaining]||plans[remaining].length>budget)throw Error('Unreachable bridge');return plans[remaining];
}
export function alternativePlans(m){
 let found=0;
 const search=(i,left,budget)=>{if(found>=2)return;if(left===0){found++;return;}if(i>=m.choices.length||budget<=0)return;const value=m.choices[i].value;for(let count=0;count<=budget&&count*value<=left;count++)search(i+1,left-count*value,budget-count);};
 search(0,m.target,m.maxBlocks);return found>=2;
}
const catalogue=new Map();
export function mission(grade,r=Math.random,previous=[]){
 if(!Number.isInteger(grade)||!PROFILES[grade])throw Error('Invalid grade');
 const options=catalogue.get(grade)||[];
 if(!catalogue.has(grade)){
 for(const [set,values] of SETS[grade].entries()){
  const low={1:2,2:10,3:12,4:40,5:100,6:100}[grade];
  for(let target=low;target<=PROFILES[grade].max;target+=PROFILES[grade].step){
   const m={grade,target,unit:grade===4?'cm':'',signature:grade+':'+set+':'+target,choices:values.map((value,i)=>({id:i,value,label:grade===3?product(value):grade===4?(i%2===0?String(value/10)+' dm':String(value)+' cm'):grade===5?fraction(value):grade===6?(i%2===1&&fraction(value)?fraction(value):format(value,grade)):String(value),kind:grade===3?'product':grade===4?'length':grade>=5?'fraction':'integer'}))};
   try{const plan=solution(m);if(plan.length>=(grade===1?1:2)&&plan.length<=4){m.maxBlocks=grade===1?5:Math.min(6,plan.length+2);if(alternativePlans(m))options.push(m);}}catch{ /* Not every target is reachable with every set. */ }
  }
 }
 catalogue.set(grade,options);
 }
 const fresh=options.filter(m=>!previous.includes(m.signature));const pool=fresh.length?fresh:options;return structuredClone(pool[Math.floor(r()*pool.length)]);
}
export function add(m,placed,id){
 const c=m.choices.find(c=>c.id===id);if(!c)throw Error('Unknown block');
 const total=placed.reduce((n,p)=>n+p.value,0),remaining=m.target-total-c.value;
 if(remaining<0)return{placed:[...placed],outcome:'too-long'};
 if(placed.length+1>m.maxBlocks)return{placed:[...placed],outcome:'too-many'};
 // Reject a dead end before it is committed, retaining the child's existing bridge.
 try{solution(m,remaining,m.maxBlocks-placed.length-1);}catch{return{placed:[...placed],outcome:'no-room'};}
 const next=[...placed,{...c}];return{placed:next,outcome:remaining===0?'bridge':'build'};
}
