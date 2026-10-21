import Stripe from 'stripe';
import * as Sentry from '@sentry/nextjs';
import type {NextRequest} from 'next/server';
import type {AdsExperimentAttribution} from './adsAbVariant';
import {resolveCheckoutRevenue,freezeCheckoutRevenue} from './revenueAttributionServer';
import {revenueMetadata} from './revenueAttribution';
export async function checkoutRevenue(key:string,userId:string,context:string,req?:NextRequest,explicit?:AdsExperimentAttribution|null){
 let timer:ReturnType<typeof setTimeout>|undefined;
 try{return await Promise.race([
  (async()=>revenueMetadata(await freezeCheckoutRevenue(key,userId,await resolveCheckoutRevenue(userId,context,req,explicit))))(),
  new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(Error('attribution_capture_deadline')),4000);}),
 ]);}
 catch(error){
  // Never stop a purchase because accounting storage is unavailable. Stripe itself
  // durably retains the explicit gap, and reconciliation raises it for review.
  Sentry.captureException(error);
  return revenueMetadata({version:'1',cohort:'capture_unavailable',evidence:'attribution_store_unavailable',captured_at:'',checkout_context:context.slice(0,80),checkout_cohort:'capture_unavailable'});
 }finally{if(timer)clearTimeout(timer);}
}
export async function createRevenueCheckout(stripe:Stripe,params:Stripe.Checkout.SessionCreateParams,key:string){
 const tagged={...params,metadata:{...params.metadata,revenue_checkout_key:key}};
 try{return await stripe.checkout.sessions.create(tagged,{idempotencyKey:key});}
 catch(error){
  if(!(error instanceof Stripe.errors.StripeIdempotencyError))throw error;
  // A retry may arrive after accounting recovered. Recover the first immutable
  // Stripe payload rather than create a second session or change its attribution.
  const matches:Stripe.Checkout.Session[]=[];let scanned=0;
  for await(const s of stripe.checkout.sessions.list({limit:100,created:{gte:Math.floor(Date.now()/1000)-86400}})){
   if(++scanned>1000)throw Error('checkout_retry_scan_incomplete');
   if(s.metadata?.revenue_checkout_key===key&&s.metadata?.userId===params.metadata?.userId)matches.push(s);
  }
  if(matches.length!==1)throw Error('checkout_retry_requires_review');return matches[0];
 }
}
