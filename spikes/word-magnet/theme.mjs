// Original generated scenery is served through the same private gate as the game.
const scenery=new Image();scenery.src=new URL('./world.webp',import.meta.url).href;
const cache=new WeakMap();
export function drawAlpine(ctx,w,h){
 const d=ctx.getTransform().a||1,ready=scenery.complete&&scenery.naturalWidth>0;let c=cache.get(ctx);
 if(!c||c.w!==w||c.h!==h||c.d!==d||c.ready!==ready){
 const layer=document.createElement('canvas');layer.width=Math.round(w*d);layer.height=Math.round(h*d);const p=layer.getContext('2d');p.scale(d,d);p.imageSmoothingEnabled=true;p.imageSmoothingQuality='high';
 const sky=p.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#cceeff');sky.addColorStop(1,'#e9f4cc');p.fillStyle=sky;p.fillRect(0,0,w,h);
 if(ready){const iw=scenery.naturalWidth,ih=scenery.naturalHeight,ratio=Math.max(w/iw,h/ih),sw=w/ratio,sh=h/ratio;p.drawImage(scenery,(iw-sw)*.5,(ih-sh)*.5,sw,sh,0,0,w,h);}
 // Gentle scrim only where controls and status sit; no global blur or stretching.
 const shade=p.createLinearGradient(0,0,0,h);shade.addColorStop(0,'#f8fff650');shade.addColorStop(.23,'#ffffff00');shade.addColorStop(.76,'#ffffff00');shade.addColorStop(1,'#153c2520');p.fillStyle=shade;p.fillRect(0,0,w,h);
 c={layer,w,h,d,ready};cache.set(ctx,c);
 }ctx.drawImage(c.layer,0,0,w,h);
}
export function sceneReady(ctx){return scenery.complete&&scenery.naturalWidth>0&&(!ctx||cache.get(ctx)?.ready===true);}
export function drawToken(ctx,x,y,bw,bh,kind='number'){
 ctx.save();ctx.shadowColor='#12382430';ctx.shadowBlur=9;ctx.shadowOffsetY=5;ctx.beginPath();ctx.roundRect(x-bw/2,y-bh/2,bw,bh,kind==='number'?bh/2:12);const fill=ctx.createLinearGradient(0,y-bh/2,0,y+bh/2);fill.addColorStop(0,kind==='number'?'#ffffff':'#fffdf3');fill.addColorStop(1,kind==='number'?'#edf9e7':'#ffe7a4');ctx.fillStyle=fill;ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.strokeStyle=kind==='number'?'#689f6280':'#bd8b3980';ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.roundRect(x-bw/2+3,y-bh/2+3,bw-6,bh-6,kind==='number'?bh/2:9);ctx.strokeStyle='#ffffffbd';ctx.lineWidth=1.3;ctx.stroke();ctx.restore();
}
export function drawCelebration(ctx,w,h,text){const font=Math.min(w<600?21:31,w/(text.length*.59));ctx.save();ctx.font='850 '+font+'px system-ui';const bw=ctx.measureText(text).width+32,x=w/2,y=h*.44;drawToken(ctx,x,y,bw,42,'word');ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#22502e';ctx.fillText(text,x,y);ctx.restore();}

export function drawCompanion(ctx,image,x,y,size,type){ctx.save();
 ctx.shadowColor='#173d2930';ctx.shadowBlur=8;ctx.shadowOffsetY=5;
 const base=ctx.createLinearGradient(0,y,0,y+size*.45);base.addColorStop(0,'#ffffff');base.addColorStop(1,type==='flight'?'#e8f4f9':'#dbecb7');ctx.fillStyle=base;ctx.beginPath();ctx.ellipse(x,y+size*.26,size*.57,size*.15,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 if(type==='flight'){ctx.fillStyle='#fff';for(const[dx,dy,r]of[[-.3,.19,.15],[.03,.13,.18],[.29,.21,.13]]){ctx.beginPath();ctx.arc(x+size*dx,y+size*dy,size*r,0,Math.PI*2);ctx.fill();}}
 if(image.complete&&image.naturalWidth){ctx.imageSmoothingQuality='high';ctx.drawImage(image,x-size/2,y-size*.6,size,size);}
 if(type==='magnet'){const mx=x+size*.35,my=y+size*.05,r=size*.17;ctx.save();ctx.translate(mx,my);ctx.rotate(-.35);ctx.lineCap='butt';ctx.lineWidth=size*.12;const metal=ctx.createLinearGradient(-r,0,r,0);metal.addColorStop(0,'#ee7356');metal.addColorStop(.5,'#c44438');metal.addColorStop(1,'#ee856c');ctx.strokeStyle=metal;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI);ctx.stroke();ctx.strokeStyle='#eff5fb';for(const dir of[-1,1]){ctx.beginPath();ctx.moveTo(dir*r,0);ctx.lineTo(dir*r,-size*.09);ctx.stroke();}ctx.restore();}
 ctx.restore();}
