# Private gameplay revision, 30 October 2026

Founder feedback7030 rejects the fun/variety of the previous eight-route release. Technical QA approval did not establish enjoyable play. Keep this recreational experiment private, with no account XP, billing, analytics or other-game changes.

## Authored progression
1. Baumhaus: learn a required log hop, short/held jump and a simple stream crossing.
2. Bachwiese: board two moving leaf ferries and clear a higher log.
3. Pilzgarten: use a bounce mushroom, high root and uneven stepping platforms.
4. Mühlenpfad: moving ferries, rolling pinecone and a three-jump sequence.
5. Glühwürmchenschlucht: chain jumps over timed crumbling bridges. Safe islands let the player stop.
6. Quellbach: ride a lift onto a raised bank, cross-ferry, changing heights and rolling pinecone.
7. Baumkronen: narrow moving branches, crumble platforms and a longer leaf glide.
8. Waldfest: combine logs, ferry, lift, crumble, bounce and glide with a late rolling obstacle.

Movement speed/acceleration/gravity remain unchanged. No lives, enemies, forced countdown or berry quota. A collision returns to the last safe checkpoint and keeps earned progress. All eight optional upper paths have separately authored positions and widths rather than the same opening staircase.

## Safety and persistence
- Start and checkpoint bodies have no overlapping collectibles. Every route retains24 stable collectible IDs and berryVersion1.
- Keep every checkpoint outside a hazard's **full patrol envelope**, not just its position at t=0. Keep bounce mushrooms outside the idle checkpoint body. Check30 seconds without input at every checkpoint at30/60/120Hz: no movement, jumps, returns or free berries.
- Crumble warning starts on landing, real support disappears, reforms after2.4seconds, and can rearm. Pause freezes the route clock and platform/hazard state.
- Recovery clears jump buffer; held input must not rearm a jump during remaining physics substeps. Release/fresh press must work.
- Geometry/time records version3. Archive prior v1/v2 personal records. Retain original six-route migration and eight-route v2 wallet, furnishings, equipment, completions and unique credits. Do not compare times across changed routes.

## Evidence boundaries
Test-controller predicts ordinary inputs from physics and read-only state. Browser acceptance dispatches actual keyboard/pointer handlers and earns contacts/landings/finish; it does not inject wins. Deterministic traversal is not human pacing, child playtesting or proof of fun. Keep fixture-based recovery/migration checks separate from earned journeys. Final screenshots and receipts must bind to the released source, after corrections.
