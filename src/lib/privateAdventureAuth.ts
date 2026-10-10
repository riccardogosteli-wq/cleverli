import{createHash,createHmac,randomBytes,scryptSync,timingSafeEqual}from'node:crypto';
export const ADVENTURE_SECONDS=12*60*60;
export function adventureAuth(slug:'bridge-builder'|'sentence-detective'){
 const cookie='cleverli_'+slug.replaceAll('-','_')+'_test',path='/labs/'+slug,purpose=slug+'-private-v1',attempts=new Map<string,{count:number;until:number}>(),pattern=/^scrypt1:[a-f0-9]{32}:[a-f0-9]{128}$/;
 const configured=()=>pattern.test(process.env.NUMBER_FLIGHT_TEST_PASSWORD_HASH||'')&&(process.env.NUMBER_FLIGHT_TEST_SESSION_SECRET||'').length>=32;
 const password=(value:string)=>{const hash=process.env.NUMBER_FLIGHT_TEST_PASSWORD_HASH||'';if(!pattern.test(hash)||value.length<16||value.length>200)return false;const[,salt,expected]=hash.split(':');return timingSafeEqual(scryptSync(value,Buffer.from(salt,'hex'),64),Buffer.from(expected,'hex'));};
 const signature=(payload:string)=>createHmac('sha256',process.env.NUMBER_FLIGHT_TEST_SESSION_SECRET||'').update(purpose+'|'+payload).digest('hex');
 const sign=(now=Date.now())=>{if(!configured())return '';const payload=['v1',now,now+ADVENTURE_SECONDS*1000,randomBytes(16).toString('hex')].join('.');return payload+'.'+signature(payload);};
 const verify=(token:string|undefined,now=Date.now())=>{if(!configured()||!token||token.length>200)return false;const p=token.split('.');if(p.length!==5)return false;const[v,i,e,n,mac]=p;if(v!=='v1')return false;if(!/^[0-9]{13}$/.test(i)||!/^[0-9]{13}$/.test(e)||!/^[a-f0-9]{32}$/.test(n)||!/^[a-f0-9]{64}$/.test(mac))return false;const issued=Number(i),expires=Number(e);if(issued>now+30000||expires<=issued||expires-issued!==ADVENTURE_SECONDS*1000||now>=expires)return false;return timingSafeEqual(Buffer.from(mac,'hex'),Buffer.from(signature(p.slice(0,4).join('.')),'hex'));};
 const from=(r:Request)=>(r.headers.get('cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(cookie+'='))?.slice(cookie.length+1);
 const limited=(r:Request,now=Date.now())=>{for(const[k,v]of attempts)if(v.until<=now)attempts.delete(k);const ip=(r.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim(),key=createHash('sha256').update(ip).digest('hex'),v=attempts.get(key)||{count:0,until:now+600000};v.count++;if(attempts.size>=1000&&!attempts.has(key))attempts.delete(attempts.keys().next().value!);attempts.set(key,v);return v.count>10;};
 return{cookie,path,configured,password,sign,verify,from,limited};
}
