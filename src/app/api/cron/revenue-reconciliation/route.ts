import {NextRequest,NextResponse} from 'next/server';
import * as Sentry from '@sentry/nextjs';
import {reconcileRevenue} from '@/lib/revenueLedgerServer';
export const maxDuration=300;
export async function GET(req:NextRequest){
 if(!process.env.CRON_SECRET||req.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)return NextResponse.json({error:'unauthorized'},{status:401});
 try{const result=await reconcileRevenue();if(result.cohorts.capture_unavailable)Sentry.captureMessage('Revenue attribution capture gap requires review','error');return NextResponse.json({ok:true,...result},{headers:{'Cache-Control':'no-store'}});}catch(error){Sentry.captureException(error);return NextResponse.json({error:'revenue_reconciliation_failed'},{status:503});}
}
