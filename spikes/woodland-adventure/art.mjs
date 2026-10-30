import { LEVEL, surfaces, hazards } from './engine.js';
import { arrivalPose } from './homecoming.js';
const names = ['forest', 'idle', 'run-a', 'run-b', 'run-c', 'run-d', 'jump', 'treehouse', 'platform', 'tree', 'spring', 'berry', 'lantern', 'cave', 'fern', 'rabbit', 'bank', 'stream', 'home-door','leaf-glider', ...['home','picnic','garden','mill','lantern','spring','vista','festival'].map(n=>'destination-'+n)];
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
    painted(name,x,foot,width){const image=this.images[name];if(image)this.image(name,x,foot-width*image.naturalHeight/image.naturalWidth,width,width*image.naturalHeight/image.naturalWidth);}
    destination(s,t){
        const x=LEVEL.home,c=this.ctx;
        const bank=LEVEL.grounds.at(-1),width=Math.min(400,bank.w-20),left=Math.max(bank.x+10,Math.min(x-180,bank.x+bank.w-width-10));
        this.painted('destination-'+LEVEL.finish,left,435,width);
        // Decorations remain recognisable illustrated items, never opaque door covers.
        if(s.decorations?.includes('lamp'))this.image('lantern',x-185,343,45,90);
        if(s.decorations?.includes('vase'))this.image('fern',x+160,400,45,40);
        if(t>1&&!this.reduced&&['lantern','festival'].includes(LEVEL.finish)){
            const glow=c.createRadialGradient(x,300,2,x,300,125);glow.addColorStop(0,'#fff3b51c');glow.addColorStop(1,'#fff3b500');c.fillStyle=glow;c.fillRect(x-125,175,250,250);
        }
    }
    emit(name, s) { if (this.reduced)
        return; const colors = name === 'berry' ? ['#efc478', '#db816a'] : name === 'secret' ? ['#f7e991', '#c2e6a5'] : ['#f2e4bd', '#aecc91']; const n = ['win', 'friend', 'secret'].includes(name) ? 24 : name === 'berry' ? 8 : name === 'land' ? 4 : 0; for (let i = 0; i < n; i++)
        this.particles.push({ x: s.x + s.w / 2, y: s.y + s.h * .5, vx: Math.sin(i * 2.4) * 65, vy: -30 - i % 6 * 18, life: .65 + i % 5 * .12, color: colors[i % colors.length] }); if (this.particles.length > 100)
        this.particles.splice(0, this.particles.length - 100); }
    draw(s, delta = 0) {
        if (!this.width || !this.height || !this.canvas.width || !this.canvas.height)
            return;
        const c = this.ctx, W = this.width, H = this.height;
        const arriving=!!s.homeStart,timeline=arriving?(this.reduced?Math.min(6.5,s.homeTime):s.homeTime):0;
        const hero=arriving?arrivalPose(timeline,s.homeStart.x,s.homeStart.y,LEVEL.home+25):null;
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
            const theme={home:[1.35,.22],picnic:[1.08,.12],garden:[1.65,.45],mill:[1.25,.28],lantern:[1.55,.48],spring:[1.4,.36],vista:[1.2,.05],festival:[1.3,.18]}[LEVEL.finish];
            const aspect=bg.naturalWidth/bg.naturalHeight,bW=Math.max(W*theme[0],H*aspect),bH=bW/aspect,progress=Math.max(0,Math.min(1,this.camera/(LEVEL.width-this.worldWidth))),x=-progress*(bW-W),y=-(bH-H)*theme[1];
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
        const themeTint={home:'#fff2b509',picnic:'#fff8b215',garden:'#1d544128',mill:'#335f781a',lantern:'#15213f9c',spring:'#26767920',vista:'#eaf7ff22',festival:'#f7bb651e'};c.fillStyle=themeTint[LEVEL.finish];c.fillRect(0,0,W,H);
        c.save();
        c.scale(this.scale, this.scale);
        c.translate(-this.camera, offsetY);
        // Foliage belongs to the world, never to a HUD or collision plane.
        for (const anchor of (['picnic','vista'].includes(LEVEL.finish)?[1260,2850,4200]:[350,1340,1900,2600,3470,4200,5180])) {
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
        // Route-specific painted landmarks are anchored to actual banks behind play.
        for(const bank of LEVEL.grounds.slice(1,-1)){
            const x=bank.x+bank.w*.5;
            if(x<this.camera-300||x>this.camera+this.worldWidth+300)continue;
            if(['garden','spring'].includes(LEVEL.finish)){c.save();c.globalAlpha=.70;this.painted('destination-'+LEVEL.finish,x-110,428,220);c.restore();}
            if(['lantern','festival'].includes(LEVEL.finish))this.image('lantern',x,322,46,95);
        }
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
        for (const p of surfaces(s.time,s).filter(p => !p.solid)) {
            if (p.x + p.w < this.camera - 100 || p.x > this.camera + this.worldWidth + 100)
                continue;
            c.save();if(p.crumble){const q=s.crumble[p.id];c.globalAlpha=q?(.65+.35*Math.sin(s.time*28)):1;c.shadowColor='#ffda79';c.shadowBlur=8;}
            this.image(p.id.includes('leaf')?'leaf-glider':'platform', p.x, p.y - 4, p.w, p.id.startsWith('s') ? 30 : 42);
            if(p.crumble){c.strokeStyle='#fcdfa3';c.lineWidth=3;for(let k=1;k<4;k++){c.beginPath();c.moveTo(p.x+p.w*k/4,p.y+2);c.lineTo(p.x+p.w*k/4-5,p.y+13);c.lineTo(p.x+p.w*k/4+4,p.y+24);c.stroke();}}c.restore();
            if(!p.crumble&&!p.id.startsWith('s')&&!p.move&&!p.moveY){c.strokeStyle='#564a32';c.lineWidth=6;c.beginPath();c.moveTo(p.x+18,p.y+20);c.lineTo(p.x+18,430);c.moveTo(p.x+p.w-18,p.y+20);c.lineTo(p.x+p.w-18,430);c.stroke();}
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
        // Grounded wooden stumps: visible silhouette matches the collision body.
        for(const p of LEVEL.blocks){if(p.x>this.camera+this.worldWidth+100||p.x+p.w<this.camera-100)continue;c.save();c.beginPath();c.roundRect(p.x,p.y,p.w,p.h,8);c.clip();const bark=c.createLinearGradient(p.x,p.y,p.x+p.w,p.y);bark.addColorStop(0,'#65472d');bark.addColorStop(.25,'#b58850');bark.addColorStop(.6,'#916135');bark.addColorStop(1,'#503d2a');c.fillStyle=bark;c.fillRect(p.x,p.y,p.w,p.h);for(let k=0;k<13;k++){const x=p.x+k*p.w/12;c.strokeStyle=k%2?'#402f2280':'#d8b07860';c.lineWidth=k%3+1;c.beginPath();c.moveTo(x,p.y+13);c.bezierCurveTo(x+5,p.y+p.h*.35,x-5,p.y+p.h*.7,x+2,p.y+p.h);c.stroke();}c.fillStyle='#d9b779';c.beginPath();c.ellipse(p.x+p.w/2,p.y+9,p.w*.49,10,0,0,7);c.fill();c.strokeStyle='#9e7444';c.lineWidth=1.6;for(let k=1;k<4;k++){c.beginPath();c.ellipse(p.x+p.w/2-2,p.y+9,p.w*.12*k,2.2*k,0,0,7);c.stroke();}c.fillStyle='#62843c';for(let k=0;k<7;k++){c.beginPath();c.ellipse(p.x+5+k*p.w/7,p.y+p.h-4,8,5,k*.5,0,7);c.fill();}c.restore();}
        // Warm pinecone silhouettes with shaded scales, never invisible collision circles.
        for(const p of hazards(s.time)){if(p.x<this.camera-50||p.x>this.camera+this.worldWidth+50)continue;c.save();c.translate(p.x,p.y);c.rotate(this.reduced?0:s.time*p.speed*2);const g=c.createRadialGradient(-6,-7,2,0,0,p.r);g.addColorStop(0,'#d2a167');g.addColorStop(.65,'#8d603c');g.addColorStop(1,'#513a2a');c.fillStyle=g;c.beginPath();c.ellipse(0,0,p.r,p.r,0,0,7);c.fill();for(let row=-2;row<=2;row++)for(let col=-1;col<=1;col++){c.fillStyle=(row+col)%2?'#be8c55':'#795033';c.beginPath();c.ellipse(col*9+(row%2)*3,row*7,7,4,.4,0,7);c.fill();}c.restore();}
        for(const p of LEVEL.springs){this.image('spring',p.x-38,p.y-45,76,57);}
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
        this.destination(s,timeline);
        if(arriving){const bunny=arrivalPose(timeline,s.homeStart.rabbitX,430,LEVEL.home-45,.55,true);this.image('rabbit',bunny.footX-15,bunny.footY-45,31,45);}
        else if(s.rescued)this.image('rabbit',s.followerX,371+(this.reduced?0:Math.sin(s.time*9)*2),37,55,s.face<0);
        else this.image('rabbit',LEVEL.rabbit,368+(this.reduced?0:Math.sin(s.time*2)*2),40,60);
        for (const b of LEVEL.berries) {
            if (s.berries.includes(b.id) || b.x < this.camera - 40 || b.x > this.camera + this.worldWidth + 40)
                continue;
            const bob = this.reduced ? 0 : Math.sin(s.time * 2 + b.id) * 2;
            this.image('berry', b.x - 14, b.y - 15 + bob, 28, 32);
        }
        if(LEVEL.wind){c.save();c.strokeStyle='#f0ebce55';c.lineWidth=2;for(let i=0;i<7;i++){const x=LEVEL.wind.from+i*(LEVEL.wind.to-LEVEL.wind.from)/7,y=345+(this.reduced?0:Math.sin(s.time+i)*8);c.beginPath();c.moveTo(x,y+35);c.quadraticCurveTo(x+10,y+10,x,y);c.stroke();}c.restore();}
        if(LEVEL.glider&&s.x>=LEVEL.glider.from-100&&s.x<=LEVEL.glider.to+100){c.fillStyle='#f7ebbd';c.font='bold 15px system-ui';c.fillText('Springen halten: Blattgleiter',LEVEL.glider.from-100,325);}
        if(s.gliding)this.image('leaf-glider',s.x-32,s.y+s.h-6,110,36);
        const support = !arriving && s.grounded ? surfaces(s.time,s).find(p => p.id === s.standing) : null;
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
        this.image(frame,footX-playerW/2,footY-playerH*.945,playerW,playerH,!arriving&&s.face<0);
        if(s.decorations?.includes('hat')&&(!arriving||!hero.inside)){c.strokeStyle='#6bb6e1';c.lineWidth=3;c.beginPath();c.moveTo(footX-8,footY-playerH*.55);c.lineTo(footX+7,footY-playerH*.48);c.stroke();}
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
