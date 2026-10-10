// Bespoke generated Cleverli atlas objects, individually cropped without upscaling.
const names=['anchor-left','anchor-right','plank','gate-closed','gate-open','rabbit','chest-closed','chest-open','map','companion'];
const images=Object.fromEntries(names.map(name=>{const im=new Image();im.src=new URL('./'+name+'.webp',import.meta.url).href;return[name,im];}));
export const artReady=()=>Object.values(images).every(im=>im.complete&&im.naturalWidth>0);
export function drawArt(ctx,name,x,y,width,height){const im=images[name];if(!im?.complete||!im.naturalWidth||width<=0||height<=0)return false;const scale=Math.min(width/im.naturalWidth,height/im.naturalHeight),w=im.naturalWidth*scale,h=im.naturalHeight*scale;ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(im,x-w/2,y-h/2,w,h);ctx.restore();return true;}
