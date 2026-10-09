import { readFile } from 'node:fs/promises';
import path from 'node:path';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(_request: Request, { params }: { params: Promise<{ asset?: string[] }> }) {
 if (process.env.VERCEL_ENV === 'production' || process.env.VERCEL_TARGET_ENV === 'production') return new Response('Not found', {status:404});
 const { asset = [] } = await params;
 const file = asset.length === 0 ? 'index.html' : asset.length === 1 && asset[0] === 'engine.js' ? 'engine.mjs' : asset.length === 1 && asset[0] === 'game.js' ? 'game.mjs' : null;
 if (!file) return new Response('Not found', {status:404});
 const body = await readFile(path.join(process.cwd(),'spikes','number-flight',file),'utf8');
 return new Response(body, {headers:{'Content-Type':file==='index.html'?'text/html; charset=utf-8':'text/javascript; charset=utf-8','Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'}});
}
