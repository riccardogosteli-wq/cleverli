import { FROM, SUBJECT, TEMPLATE } from './offer219Campaign';
import { digest219, type Receipt } from './offer219Transport';
import { TRIAL_CAMPAIGN, TRIAL_UPGRADE } from './trialUpgrade';
export interface TrialMailIO {
  status(): Promise<Receipt | null>;
  eligible(hash: string): Promise<boolean>;
  reserve(hash: string, bodyHash: string): Promise<Receipt>;
  deadline(): Promise<number>;
  send(payload: { from: string; to: string; replyTo: string; subject: string; html: string }, key: string): Promise<string>;
  save(id: string): Promise<void>;
}
export function trialMaterial(raw: string) {
  if (raw.length > 2000) throw Error('invalid_material');
  const row = JSON.parse(raw);
  if (!row || Object.keys(row).sort().join(',') !== 'customerId,email,offerId,subscriptionId,token,userId'
    || !Object.entries(TRIAL_UPGRADE).filter(([k]) => k !== 'trialEnd').every(([k,v]) => row[k] === v)
    || typeof row.token !== 'string' || !/^[a-f0-9]{64}$/.test(row.token)) throw Error('invalid_material');
  const html = TEMPLATE.replace('__CHECKOUT__', 'https://www.cleverli.ch/offer/trial-upgrade#' + row.token);
  return { hash: digest219(row.token), html, bodyHash: digest219(html) };
}
export async function executeTrialMail(raw: string, send: boolean, production: boolean, io: TrialMailIO) {
  if (send && !production) throw Error('production_only');
  const m = trialMaterial(raw);
  const existing = await io.status();
  if (existing) return { receipt: existing, reused: true, reconciliationRequired: !existing.provider_id };
  if (!await io.eligible(m.hash)) return { skipped: true };
  if (!send) return { dryRun: true, eligible: true, bodyHash: m.bodyHash, from: FROM, subject: SUBJECT, recipient: TRIAL_UPGRADE.email };
  const reserved = await io.reserve(m.hash, m.bodyHash);
  if (await io.deadline() !== Number(reserved.deadline) || !await io.eligible(m.hash)
    || Date.now() - Date.parse(reserved.claimed_at) > 15000) throw Error('reconciliation_required');
  const id = await io.send({ from: FROM, to: TRIAL_UPGRADE.email, replyTo: 'hello@cleverli.ch', subject: SUBJECT, html: m.html }, `${TRIAL_CAMPAIGN}:${TRIAL_UPGRADE.offerId}`);
  if (!id) throw Error('reconciliation_required');
  await io.save(id);
  const receipt = await io.status();
  if (receipt?.provider_id !== id) throw Error('reconciliation_required');
  return { accepted: true, delivered: false, receipt };
}
