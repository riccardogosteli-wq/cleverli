import Stripe from 'stripe';
import {revenueDb} from './revenueAttributionServer';
import {snapshotFromMetadata} from './revenueAttribution';
export const stripeId=(v:unknown):string|null=>typeof v==='string'?v:v&&typeof v==='object'&&'id' in v?String(v.id):null;
export function invoiceSub(i:Stripe.Invoice){return stripeId((i as unknown as {subscription?:unknown}).subscription)||stripeId(i.parent?.subscription_details?.subscription);}
export function collectedCharge(c:Stripe.Charge){return c.paid&&c.captured&&c.status==='succeeded'&&(c.amount_captured??c.amount)>0;}
export type LedgerRow={charge_id:string;payment_intent_id:string|null;invoice_id:string|null;subscription_id:string|null;session_id:string|null;customer_id:string|null;user_id:string|null;paid_at:string;currency:string;amount:number;refunded:number;livemode:boolean;snapshot:ReturnType<typeof snapshotFromMetadata>};
export async function resolveRevenueCharge(stripe:Stripe,c:Stripe.Charge):Promise<{kind:'ignored'|'other_product'|'unresolved'}|{kind:'cleverli';row:LedgerRow}>{
 if(!collectedCharge(c))return {kind:'ignored'};
 const pi=stripeId(c.payment_intent);let invoice:Stripe.Invoice|null=null,session:Stripe.Checkout.Session|null=null,sub:Stripe.Subscription|null=null;
 let metadata:Stripe.Metadata|null=c.metadata;
 const oldInvoice=stripeId((c as unknown as {invoice?:unknown}).invoice);
 if(oldInvoice)invoice=await stripe.invoices.retrieve(oldInvoice);
 else if(pi){const found=await stripe.invoicePayments.list({payment:{type:'payment_intent',payment_intent:pi},status:'paid',limit:100});if(found.has_more||new Set(found.data.map(x=>stripeId(x.invoice))).size>1)throw Error('ambiguous_invoice_payment');if(found.data[0])invoice=await stripe.invoices.retrieve(stripeId(found.data[0].invoice)!);}
 if(invoice){const sid=invoiceSub(invoice);if(sid)sub=await stripe.subscriptions.retrieve(sid);
  metadata=invoice.parent?.subscription_details?.metadata||sub?.metadata||invoice.metadata;
 }else if(pi){const found=await stripe.checkout.sessions.list({payment_intent:pi,limit:100});if(found.has_more||found.data.length>1)throw Error('ambiguous_payment_session');session=found.data[0]||null;
  if(session)metadata=session.metadata;else{const intent=await stripe.paymentIntents.retrieve(pi);metadata=intent.metadata;}
 }
 // Shared Stripe account: product identity is checked, including archived products.
 const names:string[]=[];
 if(invoice){for await(const line of stripe.invoices.listLineItems(invoice.id,{limit:100})){const product=stripeId(line.pricing?.price_details?.product);if(!product)return {kind:'unresolved'};const p=await stripe.products.retrieve(product);if(p.deleted)return {kind:'unresolved'};names.push(p.name.toLowerCase());}}
 else if(session){for await(const line of stripe.checkout.sessions.listLineItems(session.id,{limit:100})){const product=stripeId(line.price?.product);if(!product)return {kind:'unresolved'};const p=await stripe.products.retrieve(product);if(p.deleted)return {kind:'unresolved'};names.push(p.name.toLowerCase());}}
 if(names.length&&names.every(n=>!n.includes('cleverli')))return {kind:'other_product'};
 if(names.length?!names.every(n=>n.includes('cleverli')):metadata?.site!=='cleverli.ch')return {kind:'unresolved'};
 const user=metadata?.userId||metadata?.user_id||null;
 return {kind:'cleverli',row:{charge_id:c.id,payment_intent_id:pi,invoice_id:invoice?.id||null,subscription_id:sub?.id||null,session_id:session?.id||null,customer_id:stripeId(c.customer),user_id:user&&/^[0-9a-f-]{36}$/i.test(user)?user:null,paid_at:new Date(c.created*1000).toISOString(),currency:c.currency,amount:c.amount_captured??c.amount,refunded:c.amount_refunded,livemode:c.livemode,snapshot:snapshotFromMetadata(metadata)}};
}
export async function recordRevenueCharge(stripe:Stripe,c:Stripe.Charge){
 if(!collectedCharge(c))return {kind:'ignored' as const};
 const db=revenueDb();
 const prior=await db.from('revenue_payment_ledger').select('*').eq('charge_id',c.id).maybeSingle();if(prior.error)throw Error('revenue_ledger_read_failed');
 if(prior.data){const row=prior.data as LedgerRow;if(row.amount!==(c.amount_captured??c.amount)||row.currency!==c.currency)throw Error('ledger_capture_amount_changed');
  if(c.amount_refunded>row.refunded){const updated=await db.rpc('refresh_revenue_charge',{p_charge:c.id,p_refunded:c.amount_refunded});if(updated.error)throw Error('revenue_ledger_refund_failed');}
  return {kind:'cleverli' as const,row:{...row,refunded:Math.max(row.refunded,c.amount_refunded)}};
 }
 const resolved=await resolveRevenueCharge(stripe,c);if(resolved.kind!=='cleverli')return resolved;
 const {error}=await db.from('revenue_payment_ledger').upsert(resolved.row,{onConflict:'charge_id',ignoreDuplicates:true});if(error)throw Error('revenue_ledger_insert_failed');
 // Never rewrite attribution from later account visits. Monetary state alone is refreshed.
 const updated=await db.rpc('refresh_revenue_charge',{p_charge:c.id,p_refunded:c.amount_refunded});if(updated.error)throw Error('revenue_ledger_refund_failed');
 return resolved;
}
export async function processRevenueEvent(stripe:Stripe,event:Stripe.Event){
 if(['charge.succeeded','charge.captured','charge.refunded'].includes(event.type)){await recordRevenueCharge(stripe,await stripe.charges.retrieve((event.data.object as Stripe.Charge).id));return;}
 if(event.type==='invoice.paid'||event.type==='invoice.payment_succeeded'){
  const invoice=event.data.object as Stripe.Invoice;
  for await(const p of stripe.invoicePayments.list({invoice:invoice.id,status:'paid',limit:100})){const pi=stripeId(p.payment.payment_intent);if(pi)for await(const c of stripe.charges.list({payment_intent:pi,limit:100}))await recordRevenueCharge(stripe,c);}
 }
 if(event.type==='checkout.session.completed'||event.type==='checkout.session.async_payment_succeeded'){
  const s=event.data.object as Stripe.Checkout.Session;const pi=stripeId(s.payment_intent);
  if(s.payment_status==='paid'&&pi)for await(const c of stripe.charges.list({payment_intent:pi,limit:100}))await recordRevenueCharge(stripe,c);
 }
}
export async function reconcileRevenue(stripe=new Stripe(process.env.STRIPE_SECRET_KEY!)){
 const db=revenueDb();const run=await db.from('revenue_reconciliation_runs').insert({}).select('id').single();if(run.error)throw Error('reconciliation_run_unavailable');
 const result={scanned:0,payments:0,other:0,unresolved:0,gross:0,refunded:0,cohorts:{} as Record<string,number>,byCurrency:{} as Record<string,{gross:number;refunded:number}>,cutoff:Math.floor(Date.now()/1000)};
 try{
  for await(const c of stripe.charges.list({limit:100,created:{lt:result.cutoff}})){
   if(++result.scanned>2000)throw Error('reconciliation_scan_limit_incomplete');
   const r=await recordRevenueCharge(stripe,c);
   if(r.kind==='cleverli'){result.payments++;result.gross+=r.row.amount;result.refunded+=r.row.refunded;const t=result.byCurrency[r.row.currency]??={gross:0,refunded:0};t.gross+=r.row.amount;t.refunded+=r.row.refunded;}
   if(r.kind==='other_product')result.other++;if(r.kind==='unresolved')result.unresolved++;
  }
  // Read back the exact pre-cutoff ledger: mismatches must not be reported as success.
  const rows:LedgerRow[]=[];for(let start=0;;start+=500){const q=await db.from('revenue_payment_ledger').select('*').lt('paid_at',new Date(result.cutoff*1000).toISOString()).order('charge_id').range(start,start+499);if(q.error)throw Error('ledger_readback_failed');rows.push(...q.data);if(q.data.length<500)break;}
  if(rows.length!==result.payments||rows.reduce((s,x)=>s+x.amount,0)!==result.gross||rows.reduce((s,x)=>s+x.refunded,0)!==result.refunded)throw Error('stripe_ledger_mismatch');
  for(const row of rows)result.cohorts[row.snapshot.cohort]=(result.cohorts[row.snapshot.cohort]||0)+1;
  if(result.unresolved)throw Error('unresolved_payment_ownership');
  const saved=await db.from('revenue_reconciliation_runs').update({completed_at:new Date().toISOString(),result}).eq('id',run.data.id);if(saved.error)throw Error('reconciliation_receipt_failed');return result;
 }catch(e){await db.from('revenue_reconciliation_runs').update({completed_at:new Date().toISOString(),result,error:e instanceof Error?e.message:'reconciliation_failed'}).eq('id',run.data.id);throw e;}
}
