import { NextRequest,NextResponse } from 'next/server';
import { parseAdsExperimentAttribution } from '@/lib/adsAbVariant';
import { exposureSnapshot,REVENUE_COOKIE,snapshotToAds } from '@/lib/revenueAttribution';
import { bindRevenueAccount,persistRevenueExposure,readRevenueCookie,revenueDb,signRevenueCookie } from '@/lib/revenueAttributionServer';
export async function POST(req:NextRequest){
 if(req.headers.get('origin')!==req.nextUrl.origin)return NextResponse.json({error:'origin'},{status:403});
 if(Number(req.headers.get('content-length')||0)>4096)return NextResponse.json({error:'size'},{status:413});
 try{
  const text=await req.text();if(text.length>4096)return NextResponse.json({error:'size'},{status:413});
  const body=JSON.parse(text);const a=body.attribution;
  const p=new URLSearchParams();if(a&&typeof a==='object'){p.set('ab_experiment',String(a.experiment||''));p.set('ab_variant',String(a.variant||''));p.set('ab_visitor',String(a.visitorId||''));p.set('ab_page',String(a.page||''));if(a.internalQa===true)p.set('ab_internal_qa','1');if(a.forcedVariant===true)p.set('ab_forced','1');}
  const observed=exposureSnapshot(parseAdsExperimentAttribution(p),'browser_observed');
  if(a&&!observed)return NextResponse.json({error:'invalid_exposure'},{status:400});
  const prior=readRevenueCookie(req.cookies.get(REVENUE_COOKIE)?.value);let current=observed||prior;
  // Account restoration is never minted as anonymous browser exposure evidence.
  const browserEvidence=prior&&prior.cohort!=='qa'?prior:observed||prior;
  await persistRevenueExposure(current);
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');let persisted=false;
  if(token){const {data,error}=await revenueDb().auth.getUser(token);if(error||!data.user)return NextResponse.json({error:'unauthorized'},{status:401});if(prior&&prior.cohort!=='qa')await bindRevenueAccount(data.user.id,prior);const r=await bindRevenueAccount(data.user.id,current);current=current||r.first_exposure;persisted=true;}
  const res=NextResponse.json({ok:true,persisted,attribution:snapshotToAds(current)},{headers:{'Cache-Control':'no-store'}});
  if(browserEvidence)res.cookies.set(REVENUE_COOKIE,signRevenueCookie(browserEvidence),{secure:req.nextUrl.protocol==='https:',httpOnly:true,sameSite:'lax',path:'/',maxAge:180*86400});
  return res;
 }catch{return NextResponse.json({error:'attribution_unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
