/** Aggregate email link requests, never recipient identity or checkout capabilities. */
export const MAIL_DESTINATIONS = {
  home: '/', teachers: '/lehrpersonen', worksheets: '/arbeitsblaetter',
  sample: '/worksheets/beispiel-klasse-3.pdf', personal: '/offer/personal',
  privacy: '/datenschutz', terms: '/agb', signup: '/signup', pricing: '/upgrade',
} as const;
export type MailTarget = keyof typeof MAIL_DESTINATIONS;
export const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
export const LABEL = /^[a-z][a-z0-9_]{0,47}$/;
export const CAMPAIGN = /^[a-z][a-z0-9_]{0,79}$/;
export function isMailTarget(value: unknown): value is MailTarget {
  return typeof value === 'string' && Object.hasOwn(MAIL_DESTINATIONS, value);
}
export function trackedMailLink(input: { campaignId: string; label: string; target: MailTarget; token?: string }): string {
  if (!UUID.test(input.campaignId) || !LABEL.test(input.label) || !isMailTarget(input.target)) throw Error('invalid_tracking_definition');
  if (input.target === 'personal' ? !/^[a-f0-9]{64}$/.test(input.token || '') : input.token !== undefined) throw Error('invalid_capability_placement');
  return 'https://www.cleverli.ch/mail/c/' + input.campaignId + '/' + input.label + (input.token ? '#' + input.token : '');
}
export function mailDestination(row: unknown): string | null {
  if (!row || typeof row !== 'object') return null;
  const r = row as Record<string, unknown>;
  if (!isMailTarget(r.target) || typeof r.campaign !== 'string' || !CAMPAIGN.test(r.campaign) ||
      typeof r.source !== 'string' || !LABEL.test(r.source) || typeof r.content !== 'string' || !LABEL.test(r.content)) return null;
  const url = new URL(MAIL_DESTINATIONS[r.target], 'https://www.cleverli.ch');
  url.searchParams.set('utm_source', r.source);
  url.searchParams.set('utm_medium', 'email');
  url.searchParams.set('utm_campaign', r.campaign);
  url.searchParams.set('utm_content', r.content);
  // Only the personal landing page may inherit the incoming capability fragment.
  // Explicit empty fragments stop inheritance for ordinary public pages (RFC 9110).
  return url.href + (r.target === 'personal' ? '' : '#');
}
export const MAIL_HEADERS = {
  'Cache-Control': 'no-store, private, max-age=0',
  'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
};
export type MailLookup = (campaign: string, label: string, count: boolean) => Promise<unknown>;
export async function resolveMailClick(campaign: string, label: string, count: boolean, lookup: MailLookup): Promise<Response> {
  if (!UUID.test(campaign) || !LABEL.test(label)) return new Response('Nicht verfügbar', {status: 404, headers: MAIL_HEADERS});
  try {
    const row = await lookup(campaign, label, count);
    if (!row) return new Response('Nicht verfügbar', {status: 404, headers: MAIL_HEADERS});
    const location = mailDestination(row);
    if (!location) throw Error('invalid_saved_destination');
    return new Response(null, {status: 302, headers: {...MAIL_HEADERS, Location: location}});
  } catch {
    // Do not log errors, request URLs, headers, IPs or capability material.
    return new Response('Vorübergehend nicht verfügbar', {status: 503, headers: {...MAIL_HEADERS, 'Retry-After': '60'}});
  }
}
