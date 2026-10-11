// Shared painted mascot motion. Pivots measured from the approved 320 × 400 frames.
export const clamp01 = value => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
export const ease = value => { const t = clamp01(value); return t * t * t * (t * (t * 6 - 15) + 10); };
export const SCENE_SECONDS = 2.5;
export function crossingPose(seconds, span, height, reduced = false) {
 const p = reduced ? (seconds >= .35 ? 1 : 0) : ease((seconds - .18) / 2.12);
 const distance = Math.max(0, span) * p;
 return {progress:p, distance, moving:!reduced && seconds > .18 && seconds < 2.3, frame:Math.floor(distance / Math.max(8, height * .24)) % 4};
}
const names = ['idle','run-a','run-b','run-c','run-d','jump'];
const images = {}, decoded = new Set();
if (typeof Image !== 'undefined') for (const name of names) {
 const im = new Image(); images[name] = im;
 im.onload = async () => { try { await im.decode(); if(im.complete && im.naturalWidth > 0) decoded.add(name); } catch {} };
 im.src = new URL('./walker-' + name + '.webp', import.meta.url).href;
}
if(typeof Image!=='undefined'){const im=new Image();images.glider=im;im.onload=async()=>{try{await im.decode();if(im.complete&&im.naturalWidth>0)decoded.add('glider');}catch{}};im.src=new URL('./leaf-glider.webp',import.meta.url).href;}
export const floatingReady=()=>walkerReady()&&decoded.has('glider');
export const walkerReady = () => names.every(name => decoded.has(name));
export function drawWalker(ctx, footX, footY, height, {distance = 0, moving = false, face = 1, opacity = 1, reduced = false} = {}) {
 if(!walkerReady() || ![footX,footY,height,opacity].every(Number.isFinite) || height <= 0) return false;
 const name = moving && !reduced ? names[1 + (Math.floor(Math.abs(distance) / Math.max(8, height * .24)) % 4)] : 'idle';
 const fullH = height / .89, fullW = fullH * .8;
 ctx.save(); ctx.globalAlpha *= clamp01(opacity); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
 ctx.translate(footX,footY); if(face < 0) ctx.scale(-1,1);
 ctx.drawImage(images[name],-fullW / 2,-fullH * .945,fullW,fullH); ctx.restore(); return true;
}

export function drawFloatingHero(ctx,x,y,size,type,{clock=0,tilt=0,reduced=false}={}){
 if(!floatingReady()||![x,y,size].every(Number.isFinite)||size<=0)return false;
 const bob=reduced?0:Math.sin(clock*2.5)*size*.018;
 ctx.save();ctx.translate(x,y+bob);if(!reduced)ctx.rotate(Math.max(-.18,Math.min(.18,tilt)));
 const glider=images.glider,gliderW=size*1.55,gliderH=gliderW*glider.naturalHeight/glider.naturalWidth;ctx.imageSmoothingQuality='high';ctx.drawImage(glider,-gliderW/2,size*.29-gliderH*.38,gliderW,gliderH);
 const image=images[type==='flight'?'jump':'idle'],fullH=size*1.2/.89,fullW=fullH*.8;ctx.imageSmoothingQuality='high';ctx.drawImage(image,-fullW/2,size*.29-fullH*.945,fullW,fullH);
 if(type==='magnet'){ctx.save();ctx.translate(size*.39,size*.02);ctx.rotate(-.3);ctx.lineWidth=size*.1;ctx.strokeStyle='#cd5544';ctx.beginPath();ctx.arc(0,0,size*.17,0,Math.PI);ctx.stroke();ctx.strokeStyle='#e9eef2';for(const sign of[-1,1]){ctx.beginPath();ctx.moveTo(sign*size*.17,0);ctx.lineTo(sign*size*.17,-size*.08);ctx.stroke();}ctx.restore();}
 ctx.restore();return true;
}
