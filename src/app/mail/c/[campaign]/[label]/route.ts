import { createClient } from '@supabase/supabase-js';
import { resolveMailClick, type MailLookup } from '@/lib/emailCampaignTracking';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
const lookup: MailLookup = async (campaign, label, count) => {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {persistSession: false, autoRefreshToken: false},
  });
  const {data, error} = await db.rpc('resolve_email_campaign_link', {p_campaign: campaign, p_label: label, p_count: count}).abortSignal(AbortSignal.timeout(5000));
  if (error) throw Error('tracking_store_unavailable');
  return data?.[0] || null;
};
type Context = {params: Promise<{campaign: string; label: string}>};
export async function GET(_request: Request, {params}: Context) {
  const {campaign, label} = await params;
  return resolveMailClick(campaign, label, true, lookup);
}
export async function HEAD(_request: Request, {params}: Context) {
  const {campaign, label} = await params;
  const response = await resolveMailClick(campaign, label, false, lookup);
  return new Response(null, {status: response.status, headers: response.headers});
}
