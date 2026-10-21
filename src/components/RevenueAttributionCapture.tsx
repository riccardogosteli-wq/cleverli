'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {getSupabase} from '@/lib/supabase';
import {readAdsExperimentAttribution} from '@/lib/adsAbVariant';
export default function RevenueAttributionCapture(){
 const pathname=usePathname();
 useEffect(()=>{
  let alive=true,timer:ReturnType<typeof setTimeout>|undefined,busy=false,again=false,retries=0;
  const capture=async()=>{
   if(!alive)return;if(busy){again=true;return;}busy=true;
   try{
    const sb=getSupabase();const session=sb?(await sb.auth.getSession()).data.session:null;
    const attribution=readAdsExperimentAttribution();
    const response=await fetch('/api/attribution/experiment',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json',...(session?.access_token?{Authorization:'Bearer '+session.access_token}:{})},body:JSON.stringify({attribution}),signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw new Error('capture_failed');retries=0;
   }catch{if(alive&&retries++<3)timer=setTimeout(capture,2000*retries);}
   finally{busy=false;if(again&&alive){again=false;timer=setTimeout(capture,100);}}
  };
  const schedule=()=>{if(timer)clearTimeout(timer);timer=setTimeout(capture,50);};
  schedule();window.addEventListener('cleverli:experiment',schedule);window.addEventListener('focus',schedule);
  const sub=getSupabase()?.auth.onAuthStateChange(()=>schedule()).data.subscription;
  return()=>{alive=false;if(timer)clearTimeout(timer);sub?.unsubscribe();window.removeEventListener('cleverli:experiment',schedule);window.removeEventListener('focus',schedule);};
 },[pathname]);return null;
}
