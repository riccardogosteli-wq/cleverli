export type DownloadAccess = 'free' | 'premium' | 'teacher';
export type DownloadResource = {
 topic_id: string; title: string; grade: number; subject: string;
 file_type: 'worksheet' | 'solution'; file_sha256: string; file_bytes: number;
};

// Store only a same-site path, never referrer queries, tokens or external URLs.
export function downloadContext(request: Request, environment: string | undefined, email?: string | null) {
 const url = new URL(request.url);
 let source_path: string | null = null;
 let explicitQa = url.searchParams.get('internal_qa') === '1' || request.headers.get('x-cleverli-internal-qa') === '1';
 try {
  const ref = new URL(request.headers.get('referer') || '');
  if (ref.origin === url.origin) {
   if (/^\/arbeitsblaetter(?:\/[a-z0-9-]+)?$/.test(ref.pathname)) source_path = ref.pathname;
   explicitQa ||= ref.searchParams.get('internal_qa') === '1';
  }
 } catch { /* No referrer is fine for direct PDF links. */ }
 const reasons: string[] = [];
 if (environment !== 'production') reasons.push('non_production');
 if (email?.toLowerCase() === 'test@cleverli.ch') reasons.push('test_account');
 if (explicitQa) reasons.push('explicit_qa');
 return { source_path, is_qa: reasons.length > 0, qa_reason: reasons.length ? reasons.join(',') : null, is_automated: /bot|crawler|spider|headless/i.test(request.headers.get('user-agent') || '') };
}

export function shouldRecordDownload(request: Request) {
 return request.method === 'GET' && !request.headers.get('purpose')?.includes('prefetch') &&
  !request.headers.get('sec-purpose')?.includes('prefetch') && !request.headers.has('x-middleware-prefetch');
}
