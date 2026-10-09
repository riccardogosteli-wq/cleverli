import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
export const FLIGHT_COOKIE='cleverli_number_flight_test';
export const FLIGHT_PATH='/labs/number-flight';
export const SESSION_SECONDS=12*60*60;
const hashPattern=/^scrypt1:[a-f0-9]{32}:[a-f0-9]{128}$/;
export function flightAuthConfigured(){return hashPattern.test(process.env.NUMBER_FLIGHT_TEST_PASSWORD_HASH||'')&&(process.env.NUMBER_FLIGHT_TEST_SESSION_SECRET||'').length>=32;}
export function verifyFlightPassword(value:string){const hash=process.env.NUMBER_FLIGHT_TEST_PASSWORD_HASH||'';if(!hashPattern.test(hash)||value.length<16||value.length>200)return false;const [,salt,expected]=hash.split(':');const actual=scryptSync(value,Buffer.from(salt,'hex'),64);return timingSafeEqual(actual,Buffer.from(expected,'hex'));}
function signature(payload:string){return createHmac('sha256',process.env.NUMBER_FLIGHT_TEST_SESSION_SECRET||'').update('number-flight-private-v1|'+payload).digest('hex');}
export function signFlightSession(now=Date.now()){if(!flightAuthConfigured())return '';const payload=['v1',String(now),String(now+SESSION_SECONDS*1000),randomBytes(16).toString('hex')].join('.');return payload+'.'+signature(payload);}
export function verifyFlightSession(token:string|undefined,now=Date.now()){if(!flightAuthConfigured()||!token||token.length>200)return false;const parts=token.split('.');if(parts.length!==5)return false;const[v,issued,expires,nonce,mac]=parts;if(v!=='v1'||!/^\d{13}$/.test(issued)||!/^\d{13}$/.test(expires)||! /^[a-f0-9]{32}$/.test(nonce)||! /^[a-f0-9]{64}$/.test(mac))return false;const i=Number(issued),e=Number(expires);if(i>now+30_000||e<=i||e-i!==SESSION_SECONDS*1000||now>=e)return false;const payload=parts.slice(0,4).join('.');return timingSafeEqual(Buffer.from(mac,'hex'),Buffer.from(signature(payload),'hex'));}
export function flightCookieFrom(request:Request){return(request.headers.get('cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(FLIGHT_COOKIE+'='))?.slice(FLIGHT_COOKIE.length+1);}
const attempts=new Map<string,{count:number;until:number}>();
export function flightLoginLimited(request:Request,now=Date.now()){for(const[k,v]of attempts)if(v.until<=now)attempts.delete(k);const ip=(request.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim();const key=createHash('sha256').update(ip).digest('hex');const value=attempts.get(key)||{count:0,until:now+600_000};value.count++;if(attempts.size>=1000&&!attempts.has(key))attempts.delete(attempts.keys().next().value!);attempts.set(key,value);return value.count>10;}
