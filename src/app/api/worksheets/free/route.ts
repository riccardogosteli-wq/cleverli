import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import resources from '@/lib/worksheets/free-manifest.json';
import { recordWorksheetDownload } from '@/lib/worksheets/downloadLedger';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'private, no-store, max-age=0', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow' };
async function serve(request: Request) {
 const url = new URL(request.url);
 const params = url.searchParams;
 // Next may preserve the original browser URL in a rewritten Route Handler.
 // Prefer the exact public pathname; accept a single whitelist key on direct API requests.
 const resource = resources.find(r => url.pathname === '/worksheets/' + r.file + '.pdf') ||
  (params.getAll('file').length === 1 ? resources.find(r => r.file === params.get('file')) : undefined);
 // Exact reviewed list; user input can never select arbitrary disk/storage paths.
 if (!resource) return new Response('Not found', { status: 404, headers });
 try {
  const bytes = await readFile(path.join(process.cwd(), 'public', 'worksheets', resource.file + '.pdf'));
  if (bytes.length !== resource.file_bytes || createHash('sha256').update(bytes).digest('hex') !== resource.file_sha256) throw Error('File integrity mismatch');
  const { file: ignored, ...event } = resource;
  void ignored;
  await recordWorksheetDownload(request, { ...event, file_type: resource.file_type as 'worksheet' | 'solution' }, 'free');
  return new Response(request.method === 'HEAD' ? null : bytes, { headers: { ...headers, 'Content-Type': 'application/pdf',
   'Content-Length': String(bytes.length), 'Content-Disposition': 'inline; filename="' + resource.file + '.pdf"' } });
 } catch {
  return new Response('PDF momentan nicht verfügbar', { status: 503, headers });
 }
}
export const GET = serve;
export const HEAD = serve;
