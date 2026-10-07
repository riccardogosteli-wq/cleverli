import 'server-only';
import * as Sentry from '@sentry/nextjs';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { downloadContext, shouldRecordDownload, type DownloadResource, type DownloadAccess } from './downloadPolicy';

export async function recordWorksheetDownload(request: Request, resource: DownloadResource, access: DownloadAccess, user?: { id: string; email?: string | null }) {
 if (!shouldRecordDownload(request)) return;
 // Bounded best-effort telemetry must never prevent a child/parent obtaining a PDF.
 try {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw Error('Missing ledger service configuration');
  if (access !== 'free' && !user?.id) throw Error('Missing verified account');
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false },
   global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(3000) }) } });
  const { error } = await db.from('worksheet_download_events').insert({
   id: randomUUID(), ...resource, user_id: access === 'free' ? null : user?.id ?? null,
   access_type: access, ...downloadContext(request, process.env.VERCEL_ENV, user?.email),
  });
  if (error) throw Error('Download ledger insert failed');
 } catch {
  // Deliberately do not attach auth headers, account details or database error bodies.
  Sentry.captureMessage('Worksheet download ledger unavailable', 'error');
  console.error('[worksheet-download-ledger] Recording failed; PDF delivery preserved');
 }
}
