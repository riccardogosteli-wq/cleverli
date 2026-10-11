import { LEVEL, surfaces } from './engine.js';
import { HOME,homePose,homeDoor } from './homecoming.js';
const names = ['forest', 'idle', 'run-a', 'run-b', 'run-c', 'run-d', 'jump', 'treehouse', 'platform', 'tree', 'spring', 'berry', 'lantern', 'cave', 'fern', 'rabbit', 'bank', 'stream', 'home-door','leaf-glider'];
export class WoodlandArt {
    constructor(canvas) { this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.images = {}; this.ready = false; this.camera = 0; this.yCamera = 0; this.width = 0; this.height = 0; this.scale = 1; this.worldWidth = 850; this.particles = []; this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(canvas); this.resize(); }
    async load() { await Promise.all(names.map(name => new Promise((resolve, reject) => { const img = new Image(); img.onload = async () => { try {
        await img.decode();
        if (!img.naturalWidth)
            throw Error('empty');
        this.images[name] = img;
        resolve();
    }
    catch {
        reject(Error(name));
    } }; img.onerror = () => reject(Error(name)); img.src = new URL(name + '.webp', import.meta.url).href; }))); this.ready = true; }
    resize() { const r = this.canvas.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0)
        return; this.width = r.width; this.height = r.height; this.worldWidth = Math.max(430, Math.min(1100, r.width / r.height * 520)); this.scale = r.width / this.worldWidth; const ratio = Math.min(2, devicePixelRatio || 1); this.canvas.width = Math.max(1, Math.round(r.width * ratio)); this.canvas.height = Math.max(1, Math.round(r.height * ratio)); this.ratio = ratio; }
    image(name, x, y, w, h, flip = false) { const i = this.images[name]; if (!i || !i.complete || !i.naturalWidth)
        return; const c = this.ctx; if (flip) {
        c.save();
        c.translate(x + w, y);
        c.scale(-1, 1);
        c.drawImage(i, 0, 0, w, h);
        c.restore();
    }
    else
        c.drawImage(i, x, y, w, h); }
    destination(s,t){const c=this.ctx,x=LEVEL.home; if(LEVEL.finish==='picnic'){c.fillStyle='#f6c48a';c.fillRect(x-110,415,175*Math.min(1,t/2.6),10);c.strokeStyle='#bd795b';for(let i=0;i<7;i++){c.beginPath();c.moveTo(x-110+i*26,415);c.lineTo(x-110+i*26,425);c.stroke();}}
 if(LEVEL.finish==='mill'){c.save();c.translate(x-185,360);c.rotate(s.time*.2);c.strokeStyle='#b88c50';c.lineWidth=12;c.beginPath();c.arc(0,0,60,0,7);c.stroke();c.lineWidth=5;for(let i=0;i<8;i++){c.rotate(Math.PI/4);c.beginPath();c.moveTo(0,0);c.lineTo(55,0);c.stroke();}c.restore();}
 if(LEVEL.finish==='lantern'){this.image('lantern',x+90,305,80,125);if(t>2){const g=c.createRadialGradient(x+115,340,0,x+115,340,90);g.addColorStop(0,'#ffe797bb');g.addColorStop(1,'#fff0a000');c.fillStyle=g;c.fillRect(x+25,250,180,180);}}
 if(LEVEL.finish==='vista'){c.strokeStyle='#66573a';c.lineWidth=8;c.beginPath();c.moveTo(x-180,390);c.lineTo(x-20,390);for(let i=0;i<5;i++){c.moveTo(x-180+i*40,390);c.lineTo(x-180+i*40,430);}c.stroke();}
 if(LEVEL.finish==='festival'){c.strokeStyle='#f0d6a2';c.lineWidth=2;c.beginPath();c.moveTo(x-180,180);c.quadraticCurveTo(x,230,x+170,180);c.stroke();for(let i=0;i<9;i++){const xx=x-160+i*38;c.fillStyle=['#e7ae7e','#c7dfa1','#f1d78c'][i%3];c.beginPath();c.moveTo(xx,195);c.lineTo(xx+20,200);c.lineTo(xx+10,220);c.fill();}}
 if(s.decorations?.includes('blanket')){c.fillStyle='#dda881';c.fillRect(x-155,420,120,8);}if(s.decorations?.includes('map')){c.fillStyle='#e5dcb8';c.fillRect(x+110,380,35,24);c.strokeStyle='#658856';c.strokeRect(x+114,384,27,16);}if(s.decorations?.includes('lamp'))this.image('lantern',x+100,330,55,92);if(s.decorations?.includes('vase'))this.image('fern',x-65,393,50,40);if(s.decorations?.includes('rug')){c.fillStyle='#aec582';c.fillRect(x-90,425,115,7);}}
    emit(name, s) { if (this.reduced)
        return; const colors = name === 'berry' ? ['#efc478', '#db816a'] : name === 'secret' ? ['#f7e991', '#c2e6a5'] : ['#f2e4bd', '#aecc91']; const n = ['win', 'friend', 'secret'].includes(name) ? 24 : name === 'berry' ? 8 : name === 'land' ? 4 : 0; for (let i = 0; i < n; i++)
        this.particles.push({ x: s.x + s.w / 2, y: s.y + s.h * .5, vx: Math.sin(i * 2.4) * 65, vy: -30 - i % 6 * 18, life: .65 + i % 5 * .12, color: colors[i % colors.length] }); if (this.particles.length > 100)
        this.particles.splice(0, this.particles.length - 100); }
    draw(s, delta = 0) {
        if (!this.width || !this.height || !this.canvas.width || !this.canvas.height)
            return;
        const c = this.ctx, W = this.width, H = this.height;
        const shift=LEVEL.home-5480, arriving=!!s.homeStart, timeline=arriving?(this.reduced?(s.homeTime<2.2?0:s.homeTime<4.5?2.8:6.5):s.homeTime):0, hero=arriving?homePose(timeline,s.homeStart.x-shift,s.homeStart.y):null;
        if(hero){hero.footX+=shift;if(!['home','mill','festival'].includes(LEVEL.finish)){const t=Math.min(1,timeline/2.6);hero.footX=s.homeStart.x+(LEVEL.home+70-s.homeStart.x)*t;hero.footY=430;hero.height=72;hero.opacity=1;hero.inside=false;hero.moving=t<1;hero.stage='arrive';}}
        const focusY=hero?Math.min(s.y,hero.footY-hero.height):s.y;
        const target = Math.max(0, Math.min(LEVEL.width - this.worldWidth, s.x - this.worldWidth * .32 + (s.face > 0 ? 50 : -40)));
        this.camera += (target - this.camera) * (this.reduced ? 1 : 1 - Math.exp(-delta * 6));
        if (s.phase === 'ready')
            this.camera = 0;
        const vh = H / this.scale, base = vh * .79 - 430;
        const verticalTarget = Math.min(0, focusY - 315);
        this.yCamera += (verticalTarget - this.yCamera) * (1 - Math.exp(-delta * 3));
        const offsetY = Math.max(base - this.yCamera * .55, 80 / this.scale - focusY + 16);
        c.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
        c.clearRect(0, 0, W, H);
        const bg = this.images.forest;
        if (bg?.complete && bg.naturalWidth) {
            const aspect = bg.naturalWidth / bg.naturalHeight, bW = Math.max(W * 1.35, H * aspect), bH = bW / aspect, progress = Math.max(0, Math.min(1, this.camera / (LEVEL.width - this.worldWidth))), x = -progress * (bW - W), y = -(bH - H) * .22;
            c.drawImage(bg, x, y, bW, bH);
        }
        else {
            const g = c.createLinearGradient(0, 0, 0, H);
            g.addColorStop(0, '#c9e1c4');
            g.addColorStop(1, '#49755e');
            c.fillStyle = g;
            c.fillRect(0, 0, W, H);
        }
        const tint = c.createLinearGradient(0, 0, 0, H);
        tint.addColorStop(0, '#fff2ca10');
        tint.addColorStop(.5, '#d0ecbc00');
        tint.addColorStop(1, '#123e4255');
        c.fillStyle = tint;
        c.fillRect(0, 0, W, H);
        if(LEVEL.palette==='night'){c.fillStyle='#172d5548';c.fillRect(0,0,W,H);}else if(LEVEL.palette==='canopy'){c.fillStyle='#eed79415';c.fillRect(0,0,W,H);}
        c.save();
        c.scale(this.scale, this.scale);
        c.translate(-this.camera, offsetY);
        // Foliage belongs to the world, never to a HUD or collision plane.
        for (const anchor of [350, 1340, 1900, 2600, 3470, 4200, 5180]) {
            const bank = LEVEL.grounds.find(p => anchor >= p.x && anchor < p.x + p.w);
            if (!bank)
                continue;
            const x = Math.max(bank.x + 180, Math.min(bank.x + bank.w - 160, anchor));
            if (x < this.camera - 300 || x > this.camera + this.worldWidth + 300)
                continue;
            c.save();
            c.beginPath();
            c.rect(bank.x, -500, bank.w, 1230);
            c.clip();
            c.globalAlpha = .86;
            this.image('tree', x - 180, 70, 340, 385);
            c.restore();
        }
        // A painted shallow stream occupies fall gaps, never an opaque vertical shaft.
        for (let i = 0; i < LEVEL.grounds.length - 1; i++) {
            const g = LEVEL.grounds[i], n = LEVEL.grounds[i + 1], x = g.x + g.w, w = n.x - x;
            if (x + w < this.camera - 100 || x > this.camera + this.worldWidth + 100)
                continue;
            c.save();
            c.beginPath();
            c.rect(x, 433, w, 297);
            c.clip();
            const img = this.images.stream, iw = w + 36, ih = Math.min(165, iw * (img?.naturalHeight || 1) / (img?.naturalWidth || 2));
            this.image('stream', x - 18, 447, iw, ih);
            if (!this.reduced) {
                c.globalAlpha = .18;
                const drift = Math.sin(s.time * .65) * 4;
                this.image('stream', x - 18 + drift, 449, iw, ih);
            }
            c.restore();
        }
        c.save();c.translate(LEVEL.secret.x-3060,LEVEL.secret.y-220);
        // The entrance belongs to a continuous rock face rooted in the main bank.
        c.save();
        c.beginPath();
        c.moveTo(2820, -300);
        c.lineTo(3330, -300);
        c.lineTo(3330, 430);
        c.lineTo(3160, 430);
        c.lineTo(3160, 730);
        c.lineTo(2820, 730);
        c.closePath();
        c.clip();
        this.image('cave', 2906.25, 37.5625, 410, 615);
        c.restore();
        // Only the waterfall channel continues below the bank into the adjacent stream.
        c.save();
        c.beginPath();
        c.rect(3224, 430, 76, 52);
        c.clip();
        this.image('cave', 2906.25, 37.5625, 410, 615);
        c.restore();
        c.restore();
        // Grounded illustrated earth walls reach the bottom, with exact bank edges.
        for (const p of LEVEL.grounds) {
            if (p.x + p.w < this.camera - 100 || p.x > this.camera + this.worldWidth + 100)
                continue;
            c.save();
            c.beginPath();
            c.rect(p.x, p.y - 12, p.w, 312);
            c.clip();
            const img = this.images.bank, tile = 312 * (img?.naturalWidth || 1) / (img?.naturalHeight || 2);
            for (let x = p.x; x < p.x + p.w; x += tile - 2)
                this.image('bank', x, p.y - 12, tile, 312);
            for (let x = p.x; x < p.x + p.w; x += 215)
                this.image('platform', x, p.y - 12, 230, 82);
            c.restore();
        }
        for (const p of surfaces(s.time).filter(p => !p.solid)) {
            if (p.x + p.w < this.camera - 100 || p.x > this.camera + this.worldWidth + 100)
                continue;
            this.image(p.id.includes('leaf')?'leaf-glider':'platform', p.x, p.y - 4, p.w, p.id.startsWith('s') ? 30 : 42);
            if(!p.id.startsWith('s')&&!p.move&&!p.moveY){c.strokeStyle='#564a32';c.lineWidth=6;c.beginPath();c.moveTo(p.x+18,p.y+20);c.lineTo(p.x+18,430);c.moveTo(p.x+p.w-18,p.y+20);c.lineTo(p.x+p.w-18,430);c.stroke();}
            if (p.move||p.moveY) {
                c.strokeStyle = '#e4d09b70';
                c.lineWidth = 2;
                c.beginPath();
                c.moveTo(p.x + 20, p.y + 8);
                c.lineTo(p.x + 20, p.y - 125);
                c.moveTo(p.x + p.w - 20, p.y + 8);
                c.lineTo(p.x + p.w - 20, p.y - 125);
                c.stroke();
            }
        }
        // Secret opening is tucked above the main trail, with light rather than text.
        if (!this.reduced) {
            for (let i = 0; i < 10; i++) {
                c.globalAlpha = .35 + Math.sin(s.time * 2 + i) * .2;
                c.fillStyle = '#fcf2b0';
                c.beginPath();
                c.arc(LEVEL.secret.x-40 + Math.sin(s.time * .4 + i) * 55, LEVEL.secret.y-65 + Math.cos(s.time * .6 + i * 2) * 38, 2.4, 0, 7);
                c.fill();
            }
            c.globalAlpha = 1;
        }
        const springY = 430 + (s.springLock > 0 ? Math.sin(s.springLock * 10) * 6 : 0);
        this.image('spring', LEVEL.spring - 45, springY - 53, 90, 66);
        for (let i = 0; i < LEVEL.checkpoints.length; i++) {
            const p = LEVEL.checkpoints[i];
            this.image('lantern', p.x - 60, p.y-85, 55, 92);
            if (i <= s.checkpoint) {
                const glow = c.createRadialGradient(p.x - 34, 362, 1, p.x - 34, 362, 34);
                glow.addColorStop(0, '#ffe4a877');
                glow.addColorStop(1, '#ffe4a800');
                c.fillStyle = glow;
                c.fillRect(p.x - 68, 328, 68, 68);
            }
        }
        c.save();c.translate(shift,0);
        if(['home','mill','festival'].includes(LEVEL.finish))this.image('treehouse', 5315, 105, 365, 348);
        const opening=arriving&&['home','mill','festival'].includes(LEVEL.finish)?homeDoor(timeline):0;
        if(opening>0){c.save();c.beginPath();c.moveTo(HOME.doorX,HOME.doorY+HOME.doorH);c.lineTo(HOME.doorX,HOME.doorY+23);c.bezierCurveTo(HOME.doorX,HOME.doorY,HOME.doorX+HOME.doorW,HOME.doorY,HOME.doorX+HOME.doorW,HOME.doorY+23);c.lineTo(HOME.doorX+HOME.doorW,HOME.doorY+HOME.doorH);c.closePath();c.clip();const room=c.createLinearGradient(0,HOME.doorY,0,HOME.doorY+HOME.doorH);room.addColorStop(0,'#493424');room.addColorStop(.7,'#624527');room.addColorStop(1,'#bd8b46');c.globalAlpha=1;c.fillStyle=room;c.fillRect(HOME.doorX,HOME.doorY,HOME.doorW,HOME.doorH);c.fillStyle='#ecc27344';c.fillRect(HOME.doorX+10,HOME.doorY+44,HOME.doorW-18,3);c.restore();}
        if(arriving){const bunny=homePose(timeline,s.homeStart.rabbitX-shift,430,.85,true);if(!['home','mill','festival'].includes(LEVEL.finish)){bunny.footX=s.homeStart.rabbitX-shift+(LEVEL.home+15-s.homeStart.rabbitX)*Math.min(1,timeline/3.3);bunny.footY=430;bunny.height=45;bunny.opacity=1;bunny.inside=false;}if(!bunny.inside){c.save();c.globalAlpha=bunny.opacity;this.image('rabbit',bunny.footX-bunny.height*.34,bunny.footY-bunny.height,bunny.height*.68,bunny.height);c.restore();}}
        else if(s.rescued)this.image('rabbit',s.followerX-shift,371+(this.reduced?0:Math.sin(s.time*9)*2),37,55,s.face<0);
        else this.image('rabbit',LEVEL.rabbit-shift,368+(this.reduced?0:Math.sin(s.time*2)*2),40,60);
        c.restore();
        for (const b of LEVEL.berries) {
            if (s.berries.includes(b.id) || b.x < this.camera - 40 || b.x > this.camera + this.worldWidth + 40)
                continue;
            const bob = this.reduced ? 0 : Math.sin(s.time * 2 + b.id) * 2;
            this.image('berry', b.x - 14, b.y - 15 + bob, 28, 32);
        }
        if(LEVEL.wind){c.save();c.strokeStyle='#f0ebce55';c.lineWidth=2;for(let i=0;i<7;i++){const x=LEVEL.wind.from+i*(LEVEL.wind.to-LEVEL.wind.from)/7,y=345+(this.reduced?0:Math.sin(s.time+i)*8);c.beginPath();c.moveTo(x,y+35);c.quadraticCurveTo(x+10,y+10,x,y);c.stroke();}c.restore();}
        if(LEVEL.glider&&s.x>=LEVEL.glider.from-100&&s.x<=LEVEL.glider.to+100){c.fillStyle='#f7ebbd';c.font='bold 15px system-ui';c.fillText('Springen halten: Blattgleiter',LEVEL.glider.from-100,325);}
        if(s.gliding)this.image('leaf-glider',s.x-32,s.y+s.h-6,110,36);
        this.destination(s,timeline);
        const support = !arriving && s.grounded ? surfaces(s.time).find(p => p.id === s.standing) : null;
        if (support) {
            c.save();
            c.beginPath();
            c.rect(support.x, support.y - 6, support.w, 20);
            c.clip();
            const shadow = c.createRadialGradient(s.x + s.w / 2, support.y, 1, s.x + s.w / 2, support.y, 28);
            shadow.addColorStop(0, '#132d3538');
            shadow.addColorStop(1, '#132d3500');
            c.fillStyle = shadow;
            c.fillRect(s.x - 18, support.y - 6, 74, 20);
            c.restore();
        }
        const running=s.grounded&&Math.abs(s.vx)>15;
        const distance=s.walkDistance??s.time*320;
        const frame=arriving?(hero.moving&&!this.reduced?['run-a','run-b','run-c','run-d'][Math.floor(hero.distance/26)%4]:'idle'):!s.grounded?'jump':running?['run-a','run-b','run-c','run-d'][Math.floor(distance/27)%4]:'idle';
        const playerH=arriving?hero.height/.89:80*(this.reduced?1:1-s.landPulse*.35),playerW=playerH*.8;
        const footX=arriving?hero.footX:s.x+s.w/2,footY=arriving?hero.footY:s.y+s.h;
        if(!arriving||!hero.inside){c.save();if(arriving){c.globalAlpha=hero.opacity;if(hero.stage==='enter'){c.beginPath();c.rect(HOME.doorX+shift,HOME.doorY,HOME.doorW,HOME.doorH);c.clip();}}this.image(frame,footX-playerW/2,footY-playerH*.945,playerW,playerH,!arriving&&s.face<0);c.restore();}
        if(s.decorations?.includes('hat')&&(!arriving||!hero.inside)){c.strokeStyle='#6bb6e1';c.lineWidth=3;c.beginPath();c.moveTo(footX-8,footY-playerH*.55);c.lineTo(footX+7,footY-playerH*.48);c.stroke();}
        if(arriving&&opening>0){c.save();c.translate(HOME.doorX+shift,HOME.doorY);c.transform(1-opening*.88,0,opening*.08,1,0,0);this.image('home-door',0,0,HOME.doorW,HOME.doorH);c.restore();}
        for (const p of this.particles) {
            if (delta > 0 && (s.phase==='playing'||(arriving&&s.phase==='won'&&s.homeTime<6.5))) {
                p.life -= delta;
                p.x += p.vx * delta;
                p.y += p.vy * delta;
                p.vy += 100 * delta;
            }
            c.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
            c.fillStyle = p.color;
            c.beginPath();
            c.arc(p.x, p.y, 2.8, 0, 7);
            c.fill();
        }
        c.globalAlpha = 1;
        this.particles = this.particles.filter(p => p.life > 0);
        for (const x of [20, 645, 1320, 1970, 2880, 3500, 4280, 5190, 5610]) {
            const bank = LEVEL.grounds.find(p => x >= p.x && x < p.x + p.w);
            if (!bank)
                continue;
            c.save();
            c.beginPath();
            c.rect(bank.x, 410, bank.w, 320);
            c.clip();
            this.image('fern', x, 417, 100, 90);
            c.restore();
        }
        c.restore();
        if (s.resetFade > 0) {
            c.fillStyle = '#f6f0d9' + Math.round(Math.min(.28, s.resetFade) * 255).toString(16).padStart(2, '0');
            c.fillRect(0, 0, W, H);
        }
    }
}
