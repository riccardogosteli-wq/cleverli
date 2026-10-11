// IndexedDB read/write transactions are authoritative across renderer processes.
// localStorage is only a legacy import and best-effort display/recovery mirror.
export function durableProgress(levels,legacy,locks,idb,localFactory){
 const KEY='cleverli_woodland_campaign_v1',scope=legacy.scope||KEY,primary=scope+':primary',backup=scope+':backup';
 const cache=new Map();for(const key of[KEY,KEY+':backup'])try{const v=legacy.getItem(key);if(v!==null)cache.set(key,v);}catch{}
 const adapter={deferred:true,getItem:key=>cache.get(key)??null,setItem:(key,value)=>cache.set(key,value)};
 let model=localFactory(levels,adapter,null),db=null,loaded=false,reason='';
 function unavailable(){reason='Dein Browser kann den Abenteuerstand gerade nicht dauerhaft speichern. Du kannst hier weiter spielen.';model.unstored();}
 function mirror(){for(const key of[KEY,KEY+':backup'])if(cache.has(key))try{legacy.setItem(key,cache.get(key));}catch{}}
 function open(){return new Promise((resolve,reject)=>{if(!idb?.open)return reject(Error('unavailable'));let request;try{request=idb.open('cleverli_private_adventure_v1',1);}catch(error){return reject(error);}request.onupgradeneeded=()=>{const database=request.result;if(!database.objectStoreNames.contains('snapshots'))database.createObjectStore('snapshots');};request.onsuccess=()=>{db=request.result;db.onversionchange=()=>{db.close();db=null;unavailable();};resolve();};request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('blocked'));});}
 function transaction(action,args=[],initial=false,attempt={applied:false}){return new Promise((resolve,reject)=>{
  let tx;try{tx=db.transaction('snapshots',action?'readwrite':'readonly');}catch(error){return reject(error);}const store=tx.objectStore('snapshots'),a=store.get(primary),b=store.get(backup);let got=0,result=true;
  const ready=()=>{if(++got!==2)return;try{
   // A cache is filled from this transaction, never another renderer's localStorage view.
   if(a.result!==undefined||b.result!==undefined){cache.set(KEY,a.result!==undefined?a.result:b.result);if(b.result!==undefined)cache.set(KEY+':backup',b.result);else cache.delete(KEY+':backup');}
   if(initial)model=localFactory(levels,adapter,null);else model.sync();
   if(action){if(action!=='initial'){result=model[action](...args);attempt.applied=true;attempt.result=result;}const serialized=JSON.stringify(model.snapshot());cache.set(KEY,serialized);if(action==='reset')cache.set(KEY+':backup',serialized);else if(!cache.has(KEY+':backup'))cache.set(KEY+':backup',serialized);store.put(serialized,primary);store.put(cache.get(KEY+':backup'),backup);}
  }catch(error){try{tx.abort();}catch{}reject(error);}};
  a.onsuccess=ready;b.onsuccess=ready;a.onerror=b.onerror=()=>reject(a.error||b.error);
  tx.oncomplete=()=>{if(action){model.stored();reason='';mirror();}resolve(result);};tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('aborted'));
 });}
 let pending=open().then(()=>transaction('initial',[],true)).catch(()=>unavailable()).then(()=>{loaded=true;});
 function enqueue(fn){const next=pending.then(fn);pending=next.catch(()=>{});return next;}
 function mutate(action,args){return enqueue(async()=>{if(!db){const result=model[action](...args);unavailable();return result;}const attempt={applied:false};try{return await transaction(action,args,false,attempt);}catch{const result=attempt.applied?attempt.result:model[action](...args);unavailable();return result;}});}
 return {ready:()=>pending,snapshot:()=>model.snapshot(),balance:()=>model.balance(),status:()=>({...model.status(),ready:loaded,backend:db&&model.status().durable?'indexeddb':'memory',message:reason||model.status().message}),
  sync:()=>enqueue(async()=>{if(db)try{await transaction(null);}catch{unavailable();}return model.snapshot();}),
  find:(...args)=>mutate('find',args),finish:(...args)=>mutate('finish',args),buy:(...args)=>mutate('buy',args),equip:(...args)=>mutate('equip',args),reset:()=>mutate('reset',[])};
}
