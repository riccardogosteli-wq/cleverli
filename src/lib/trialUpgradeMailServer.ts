import { Resend } from 'resend';
import { trialUpgradeServices } from './trialUpgradeServer';
import { TRIAL_UPGRADE, threeDayTrialWindow } from './trialUpgrade';
import { pages219, type Receipt } from './offer219Transport';
import { FROM, SUBJECT } from './offer219Campaign';
import type { TrialMailIO } from './trialUpgradeMail';
export function trialMailServices() {
  const { db, store, gateway } = trialUpgradeServices();
  if (!process.env.RESEND_API_KEY) throw Error('provider_unavailable');
  const provider = new Resend(process.env.RESEND_API_KEY);
  const pace = () => new Promise(resolve => setTimeout(resolve,600));
  const io: TrialMailIO = {
    async status() {
      const r=await db.from('trial_upgrade_mail').select('recipient,state,provider_id,deadline,claimed_at,body_hash').eq('recipient',TRIAL_UPGRADE.email).maybeSingle();
      if(r.error) throw Error('ledger_unavailable'); return r.data as Receipt | null;
    },
    async eligible(hash) {
      const o=await store.byId(TRIAL_UPGRADE.offerId);
      if(!o || o.token_hash!==hash || o.revoked || o.redeemed_session || !await gateway.eligible(o)) return false;
      const suppressions=await pages219(async after=>{await pace();const r=await provider.suppressions.list({limit:100,after});if(r.error||!r.data)throw Error('provider_check_failed');return r.data;});
      const contacts=await pages219(async after=>{await pace();const r=await provider.contacts.list({limit:100,after});if(r.error||!r.data)throw Error('provider_check_failed');return r.data;});
      const same=(email:string)=>email.trim().toLowerCase()===TRIAL_UPGRADE.email;
      return !suppressions.some(s=>same(s.email)) && !contacts.some(c=>same(c.email)&&c.unsubscribed);
    },
    async reserve(hash,bodyHash) {
      const a=TRIAL_UPGRADE;
      const r=await db.rpc('reserve_trial_upgrade_mail',{p_recipient:a.email,p_offer:a.offerId,p_user:a.userId,p_customer:a.customerId,p_hash:hash,p_body:bodyHash});
      if(r.error||!r.data)throw Error('reconciliation_required');return (Array.isArray(r.data)?r.data[0]:r.data) as Receipt;
    },
    async deadline(){const o=await store.byId(TRIAL_UPGRADE.offerId);if(!o)throw Error('offer_unavailable');return Number(o.deadline);},
    async send(payload,key){if(!threeDayTrialWindow(Math.floor(Date.now()/1000)))throw Error('three_day_trial_window_requires_review');await pace();const r=await provider.emails.send(payload,{idempotencyKey:key});if(r.error||!r.data?.id)throw Error('reconciliation_required');return r.data.id;},
    async save(id){const r=await db.from('trial_upgrade_mail').update({provider_id:id,state:'accepted',accepted_at:new Date().toISOString()}).eq('recipient',TRIAL_UPGRADE.email).eq('state','reserved').is('provider_id',null).select('provider_id').single();if(r.error||r.data?.provider_id!==id)throw Error('reconciliation_required');},
  };
  async function verify() {
    const receipt=await io.status();
    const matches=(e:{to:string[];subject:string;from:string})=>e.to.length===1&&e.to[0].toLowerCase()===TRIAL_UPGRADE.email&&e.subject===SUBJECT&&e.from===FROM;
    const summary=(e:{id:string;last_event:string;created_at:string})=>({id:e.id,event:e.last_event,createdAt:e.created_at,delivered:e.last_event==='delivered'});
    if(receipt?.provider_id){await pace();const r=await provider.emails.get(receipt.provider_id);if(r.error||!r.data||!matches(r.data))throw Error('verification_failed');return {receipt,matches:[summary(r.data)],readOnly:true};}
    const emails=await pages219(async after=>{await pace();const r=await provider.emails.list({limit:100,after});if(r.error||!r.data)throw Error('verification_failed');return r.data;});
    return {receipt,matches:emails.filter(matches).map(summary),readOnly:true,absenceDoesNotAuthorizeRetry:true};
  }
  return {io,verify};
}
