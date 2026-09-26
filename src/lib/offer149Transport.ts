import { createHash } from 'node:crypto';
import { CAMPAIGN, FROM, RECIPIENTS, SUBJECT, TEMPLATE } from './offer149Campaign';
export type Recipient = typeof RECIPIENTS[number];
export const digest149 = (s: string) => createHash('sha256').update(s).digest('hex');
export type Receipt = { recipient: string; state: string; provider_id: string | null; deadline: number; claimed_at: string; body_hash: string };
export interface Transport149 {
  eligible(r: Recipient, hash: string): Promise<boolean>;
  status(email: string): Promise<Receipt | null>;
  reserve(r: Recipient, hash: string, bodyHash: string): Promise<Receipt>;
  readDeadline(r: Recipient): Promise<number>;
  send(payload: { from: string; to: string; replyTo: string; subject: string; html: string }, key: string): Promise<string>;
  save(email: string, id: string): Promise<void>;
}
export function material149(raw: string, email: string) {
  const r = RECIPIENTS.find(r => r.email === email);
  if (!r || raw.length > 24000) throw Error('invalid_material');
  const rows: unknown = JSON.parse(raw);
  if (!Array.isArray(rows) || rows.length !== 9) throw Error('invalid_material');
  const seen = new Set<string>();
  for (const row of rows) {
    if (!row || typeof row !== 'object' || Object.keys(row).sort().join(',') !== 'customerId,deadline,email,offerId,sessionId,token,userId') throw Error('invalid_material');
    const approved = RECIPIENTS.find(r => r.email === row.email);
    if (!approved || seen.has(row.email) || row.userId !== approved.userId || row.customerId !== approved.customerId || row.offerId !== approved.offerId || typeof row.token !== 'string' || !/^[a-f0-9]{64}$/.test(row.token)) throw Error('invalid_material');
    seen.add(row.email);
  }
  const token = rows.find(row => row.email === email).token as string;
  const html = TEMPLATE.replace('__CHECKOUT__', 'https://www.cleverli.ch/offer/personal#' + token);
  return { r, hash: digest149(token), html, bodyHash: digest149(html) };
}
export async function execute149(raw: string, email: string, send: boolean, production: boolean, io: Transport149) {
  if (send && !production) throw Error('production_only');
  const m = material149(raw, email);
  const existing = await io.status(email);
  if (existing) return { dryRun: !send, receipt: existing, reused: true, reconciliationRequired: !existing.provider_id };
  if (!await io.eligible(m.r, m.hash)) return { dryRun: !send, skipped: true, reason: 'recipient_changed_or_suppressed' };
  if (!send) return { dryRun: true, eligible: true, subject: SUBJECT, from: FROM, recipient: email, approvedBody: true, bodyHash: m.bodyHash };
  // This reservation cannot be reset. Even a definite provider rejection requires review, never resend.
  const reserved = await io.reserve(m.r, m.hash, m.bodyHash);
  if (await io.readDeadline(m.r) !== Number(reserved.deadline)) throw Error('reconciliation_required');
  if (!await io.eligible(m.r, m.hash)) throw Error('reserved_but_recipient_changed');
  // A stalled reservation must never send with a materially shortened validity period.
  if (Date.now() - Date.parse(reserved.claimed_at) > 15000) throw Error('reconciliation_required');
  const id = await io.send({ from: FROM, to: email, replyTo: 'hello@cleverli.ch', subject: SUBJECT, html: m.html }, `${CAMPAIGN}:${m.r.offerId}`);
  if (!id) throw Error('reconciliation_required');
  await io.save(email, id);
  const receipt = await io.status(email);
  if (receipt?.provider_id !== id) throw Error('reconciliation_required');
  return { dryRun: false, receipt, accepted: true, delivered: false };
}

// Both provider pagination and payment pagination fail closed if incomplete.
export async function pages149<T extends { id: string }>(load: (after?: string) => Promise<{ data: T[]; has_more: boolean }>): Promise<T[]> {
  const out: T[] = []; let after: string | undefined;
  for (let page = 0; page < 100; page++) {
    const result = await load(after);
    if (!Array.isArray(result.data) || typeof result.has_more !== 'boolean') throw Error('incomplete_provider_check');
    out.push(...result.data);
    if (!result.has_more) return out;
    const next = result.data.at(-1)?.id;
    if (!next || next === after) throw Error('incomplete_provider_check');
    after = next;
  }
  throw Error('incomplete_provider_check');
}
