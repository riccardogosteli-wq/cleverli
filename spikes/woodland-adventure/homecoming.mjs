// A finite, pauseable arrival. Coordinates follow the original treehouse's actual stairs and sill.
export const HOME_SECONDS=6.5;
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{const t=clamp(x);return t*t*(3-2*t);};
export const HOME=Object.freeze({doorX:5476,doorY:238,doorW:57,doorH:84,baseX:5502,baseY:430,sillX:5504,sillY:322});
export function homePose(time,fromX=5500,fromY=430,delay=0,rabbit=false){
 const t=Math.max(0,time-delay),approach=ease(t/.55),climb=ease((t-.55)/1.55),enter=ease((t-2.75)/1.05);
 const footX=fromX+(HOME.baseX-fromX)*approach+(HOME.sillX-HOME.baseX)*climb+10*enter;
 const footY=fromY+(HOME.baseY-fromY)*approach+(HOME.sillY-HOME.baseY)*climb-6*enter;
 const height=(rabbit?45:72)-(rabbit?8:12)*climb-8*enter;
 const opacity=1-enter;
 return {footX,footY,height,opacity,inside:enter>=1,moving:t>0&&t<3.8,distance:Math.max(0,t*80),stage:t<.55?'approach':t<2.1?'stairs':t<2.75?'door':t<3.8?'enter':'inside'};
}
export function homeDoor(time){return ease((time-2.05)/.65)*(1-ease((time-5.5)/.65));}
