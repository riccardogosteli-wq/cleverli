import type { AdsExperimentAttribution } from './adsAbVariant';
export const REVENUE_COOKIE = 'cleverli_revenue_attribution_v1';
export type RevenueCohort = 'randomized_control'|'randomized_trial'|'fixed_meta_control'|'outside_experiment'|'legacy_unattributed'|'capture_unavailable'|'qa'|'conflicting_exposures';
export type RevenueSnapshot = { version: '1'; cohort: RevenueCohort; experiment?: string; variant?: 'control'|'trial'; visitor_id?: string; page?: string; evidence: string; captured_at: string; checkout_context?: string; checkout_cohort?: RevenueCohort };
export function exposureSnapshot(a: AdsExperimentAttribution | null, evidence: string, now=new Date().toISOString()): RevenueSnapshot | null {
 if(!a) return null;
 if(!['ads_lp_7_day_trial','meta_v5_deterministic_control'].includes(a.experiment)||!['control','trial'].includes(a.variant)||!/^[a-zA-Z0-9-]{8,100}$/.test(a.visitorId)||!/^[a-z0-9_]{1,80}$/.test(a.page)) return null;
 if(a.experiment==='meta_v5_deterministic_control'&&a.variant!=='control') return null;
 return {version:'1',cohort:a.internalQa||a.forcedVariant?'qa':a.experiment==='meta_v5_deterministic_control'?'fixed_meta_control':a.variant==='control'?'randomized_control':'randomized_trial',experiment:a.experiment,variant:a.variant,visitor_id:a.visitorId,page:a.page,evidence,captured_at:now};
}
export function snapshotToAds(s: RevenueSnapshot|null): AdsExperimentAttribution|null {
 if(!s?.experiment||!s.variant||!s.visitor_id||!s.page)return null;
 const a={experiment:s.experiment as AdsExperimentAttribution['experiment'],variant:s.variant,visitorId:s.visitor_id,page:s.page,internalQa:s.cohort==='qa',forcedVariant:s.cohort==='qa'};
 return exposureSnapshot(a,'validate')?a:null;
}
export function revenueMetadata(s: RevenueSnapshot): Record<string,string> {
 return { revenue_attribution_v:'1', revenue_cohort:s.cohort, revenue_evidence:s.evidence, revenue_captured_at:s.captured_at,
  revenue_experiment:s.experiment||'',revenue_variant:s.variant||'',revenue_visitor:s.visitor_id||'',revenue_page:s.page||'',revenue_checkout_context:s.checkout_context||'',revenue_checkout_cohort:s.checkout_cohort||s.cohort };
}
export function snapshotFromMetadata(m: Record<string,string>|null|undefined): RevenueSnapshot {
 const legacy:RevenueSnapshot={version:'1',cohort:'legacy_unattributed',evidence:'no_versioned_checkout_snapshot',captured_at:''};
 if(m?.revenue_attribution_v!=='1')return legacy;
 const allowed:RevenueCohort[]=['randomized_control','randomized_trial','fixed_meta_control','outside_experiment','legacy_unattributed','capture_unavailable','qa','conflicting_exposures'];
 if(!allowed.includes(m.revenue_cohort as RevenueCohort))return legacy;
 const s:RevenueSnapshot={version:'1',cohort:m.revenue_cohort as RevenueCohort,evidence:m.revenue_evidence||'checkout_snapshot',captured_at:m.revenue_captured_at||'',checkout_context:m.revenue_checkout_context,checkout_cohort:allowed.includes(m.revenue_checkout_cohort as RevenueCohort)?m.revenue_checkout_cohort as RevenueCohort:undefined};
 if(m.revenue_experiment)s.experiment=m.revenue_experiment;
 if(m.revenue_variant==='control'||m.revenue_variant==='trial')s.variant=m.revenue_variant;
 if(m.revenue_visitor)s.visitor_id=m.revenue_visitor;
 if(m.revenue_page)s.page=m.revenue_page;
 if(['randomized_control','randomized_trial','fixed_meta_control'].includes(s.cohort)) { const a=snapshotToAds(s);if(!a||exposureSnapshot(a,'validate')?.cohort!==s.cohort)return legacy; }
 return s;
}
