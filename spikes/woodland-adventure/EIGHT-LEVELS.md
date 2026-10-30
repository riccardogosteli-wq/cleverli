# Private Waldabenteuer revision

Ricci7024: eight visibly different routes, gently increasing challenge, coherent painted endings. Same private /labs/woodland-adventure gate. No public navigation, account XP, medals, learning progress, analytics or billing changes.

| Order | Stable ID | Destination | Width | Crossings | Focus |
|---|---|---|---:|---:|---|
|1|home-trail|Tree cottage|2400|1|Small first jump, broad banks|
|2|brook-meadow|Picnic|2800|2|Two streams, leaf ferry|
|3|mushroom-grove|Mushroom garden|3200|3|Root terraces, stepping stones|
|4|mill-path|Attached-wheel watermill|3600|3|Wider streams, slow ferry|
|5|firefly-gorge|Lantern arch|3900|4|Twilight, lit staggered stones|
|6|crystal-creek|Spring pool|4200|4|Height changes, slow lift|
|7|treetop-flight|Painted lookout|4600|5|Gentle updraft and leaf glider|
|8|forest-festival|Festival cottage|5000|5|Friendly ferry/lift/glider remix|

Movement unchanged: speed320,jump610,gravity1650,coyote0.12s,inputbuffer0.14s. No exploration timer, enemies, lives or mandatory berry quota. Continuous rests/checkpoints. Companion pickup on solid bank before final glide. Bots establish technical reachability, not child pace or enjoyment.

## Artwork
Eight alpha WebP destinations from one owner-requested OpenAI GPT Image1.5 atlas,30October2026. Original retained in owner media archive, crop provenance in release evidence. Returned size1024x1536, not requested size. Final crops use measured opaque component bounds, not assumed grid cells: initial fixed cells introduced neighbour fragments. Preserve alpha/aspect ratio. Each destination fits wholly on its final solid bank. No canvas wheel/primitive railing/flat door cover. Friends rest in front of illustrations during finite pauseable arrival, not through mismatched door geometry.

## Save compatibility
Key/schema remains cleverli_woodland_campaign_v1, campaign:2. Six old stable IDs retained, two inserted. Route/timeversion2 is separate from berryVersion1: old berry credit/wallet/furnishings/equipment survive. Use berryKey for persistence AND map counters. Migrated completed routes remain accessible; inserted routes open after already-completed predecessor. New players unlock sequentially. Validate legacy prefix before migration; legacyCompleted records migrated completion gaps. Incomparable old times archived, new trials use version2. Import/reload idempotent across localStorage/IndexedDB. No fabricated account auth sessions.

## Regression commands
node spikes/woodland-adventure/test.mjs
node spikes/woodland-adventure/test-campaign.mjs
node spikes/woodland-adventure/test-progress.mjs
node spikes/woodland-adventure/test-reset.mjs
node spikes/woodland-adventure/test-eight-levels.mjs
npx eslint src/lib/woodlandTestRoute.ts
npm run build -- --webpack

Webpack flag supports local out-of-root dependency symlink rejected by Turbopack. Provider builds frozen source with its own dependencies. Separate gates: complete controller-driven main/optional routes on Chromium/WebKit at desktop/mobile/tablet/landscape; trials/pause/help/restart; all8 map nodes/trail proximity; old-save import, counters, quota denial/reset/cross-tab locks; independent measured audio buses; protected resource hashes and20cross-game cookie denials; actual rendered start/middle/all8endings. Native browser localhost navigation was refused; do not tunnel around it. Local Playwright evidence separate from managed-browser live platform check.

Independent first review found map berry-version mismatch, atlas fragments,601-700px map breakpoint mismatch and stale discovery/festival labels. Retain original changes_requested, close exact cases, get separate correction recheck. No public launch or physical-device/child-playtest claim.
