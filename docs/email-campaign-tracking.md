# Aggregate campaign click tracking

Independent of Resend domainwide tracking, Google/Meta events, consent settings, cookies and user accounts. No new paid service. Uses existing Vercel route and Supabase. Normal usage/build charges still apply.

## Data and limitations
Three service-role-only tables: campaign metadata, predefined link destinations and minute-bucket GET request counts. No emails, recipient IDs, IPs, user agents, raw URLs, capability/payment tokens or per-person tracking IDs. UUIDs identify a whole campaign, not recipients. Counts include scanners and repeats: never label them unique people, confirmed readers or conversions. HEAD resolves without counting. Use separate test and customer campaign IDs; exclude test mode from business reports. Paused mode preserves links but stops recording; draft mode returns 404. Unknown identifiers fail closed. DB failures return an honest temporary error, never a false recorded-click claim.

Only a fixed allowlist of same-site destinations is permitted. UTMs are generated from validated nonpersonal campaign/source/link labels, never request parameters. Campaign admins must never put personal data or secrets in these metadata fields. Personal offer tokens remain solely in URL fragments and are inherited across the 302 redirect to the existing isolated offer landing page. They never reach this route or counters. All ordinary destinations receive an explicit empty fragment to prevent accidental capability propagation into their page analytics. Existing personal-offer handling and payment semantics are unchanged. This cannot retroactively measure old emails.

## Setup and dispatch gate
1. Apply reviewed additive migration once; inspect table/function existence first. Do not replace historical tables or reset sent campaigns.
2. Use service-role administration to create a draft campaign with a nonpersonal slug/source and an explicit label-to-target allowlist. Freeze this manifest. No public create/edit API exists.
3. Create a separate test campaign in test mode, with identical labels/targets. Construct links using trackedMailLink. Personal links require an account-bound capability; never use an owner token for customer mail. Link helpers validate inputs but administrator must compare all labels/targets against DB readback.
4. Retain native provider unsubscribe controls and reply opt-out. Do not wrap mailto or unsubscribe links. Keep native domain click/open tracking OFF so sensitive fragments are not rewritten into provider analytics. Verify actual delivered HTML, not only editor previews.
5. Send an owner-only QA email through the intended native provider, inspect all destinations/attribution and record test clicks. Read back the test campaign counters. Test desktop/mobile including capability preservation with a fictional token or authorised owner offer only. Never exercise a customer checkout or submit payment.
6. Recheck billing eligibility, prior-send ledger and suppressions immediately before authorised dispatch. Activate only the approved customer campaign; confirm exact audience and native envelope. Reserve and send once, reconcile uncertain outcomes before any retry.
7. Record actual send/delivery receipts and link mappings privately. Report campaign counters separately from provider delivery, conversions and test traffic. No automatic sender or background cron is introduced.

## Report
The admin report uses a fixed exclusive cutoff at the start of the current minute (current incomplete bucket omitted). Aggregate email_campaign_clicks.requests by campaign and label, joining email_campaigns for mode/source/slug. Report test separately; include observed time cutoff and scanner/repeat caveat. Historical counts remain when paused. Retention cleanup requires a separately reviewed explicit operation; do not delete active campaign/link records or break sent links.
