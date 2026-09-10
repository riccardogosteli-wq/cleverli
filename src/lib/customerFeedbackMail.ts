import { createClient } from '@supabase/supabase-js';
import { approvedFeedbackEmail, FEEDBACK_FORM } from './customerFeedbackCampaign';

export function feedbackDb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function feedbackStatus(value?: unknown) {
  const db = feedbackDb();
  let query = db.from('customer_feedback_mail').select('*').eq('form_key', FEEDBACK_FORM).order('email');
  if (value !== undefined) query = query.eq('email', approvedFeedbackEmail(value));
  const { data, error } = await query;
  if (error || !data?.length) throw Error('feedback_store_unavailable');
  return data;
}

// Used by the email transport itself, so the legacy bearer endpoint cannot bypass it.
export async function reserveFeedback(value: unknown) {
  const email = approvedFeedbackEmail(value);
  if (process.env.VERCEL_ENV !== 'production' || !process.env.RESEND_API_KEY) throw Error('production_send_disabled');
  const db = feedbackDb();
  const { data, error } = await db.rpc('claim_customer_feedback_mail', { recipient: email });
  if (error || !data || data.length !== 1) throw Error('not_eligible_or_already_reserved');
  return { db, email };
}

export async function persistFeedbackReceipt(db: ReturnType<typeof feedbackDb>, email: string, id: string) {
  const { data, error } = await db.from('customer_feedback_mail')
    .update({ state: 'sent', provider_id: id, sent_at: new Date().toISOString(), delivery_status: 'sent' })
    .eq('form_key', FEEDBACK_FORM).eq('email', email).eq('state', 'sending').select('provider_id').single();
  if (error || data?.provider_id !== id) throw Error('receipt_reconciliation_required');
}
