# Cleverli private adventures

Brückenbauer and Satzdetektiv, authorised by Ricci6691, expanded by Ricci6696.
Paths: /labs/bridge-builder and /labs/sentence-detective. Both reuse the existing dedicated private-test password, with separate purpose-bound tokens, Secure/HttpOnly/SameSite cookies and paths. All HTML, JS and custom art remain gated, noindex and no-store. Existing other games, public navigation, sitemap, XP, customer progress, ads and consent remain unchanged. No paid runtime AI or audio calls.

## Six maths profiles
G1: concrete quantities 2–5, dots/model, 1–4 blocks, 8 distinct palettes/targets.
G2: sums 10–20, varied denominations, 39 variants.
G3: small 2/5 products, targets <=40, 33 variants.
G4: centimetres/decimetres, targets <=120 cm, 21 variants.
G5: quarters/halves, targets <=2, 10 variants.
G6: scaled decimal or fractional sums <=2.5, 33 variants.
Integer-scaled scoring. Reusable blocks, alternative plans, visible stock budget. Older optimal plans take 2–4 pieces and permit two extra pieces, up to six. Every accepted partial bridge remains solvable within the displayed budget; overshoot/dead-end rejection preserves prior work. Undo and a state-aware hint support recovery. No immediate repeat within a round. G1 ends after two goals; older profiles after three, with earned crossing and explicit advancement.

## Six German profiles
72 reviewed canonical tasks, 12 per grade. G1: short three-word sentences with a visible model, guided reading rather than independent picture matching. G2: short sentence order and explicit first-phrase cues. G3: statement/question endings and contextually explicit exclamations. G4: enumeration commas, and/or connections and guided full-list order. G5: common Präteritum forms and time-first sentence construction. G6: recognisable clause commas, direct speech with a visible schema, endings inside guillemets and guided full-sentence order. Prompts constrain otherwise valid alternate orders; guided examples are not independent punctuation assessments. Shuffle all authored tasks, exclude previous round prefix on restart. Incorrect answers preserve accepted words. Grade1 earns gate then chest; older grades gate, rabbit, chest.

## Curriculum and limitations
Selected LP21-informed entry subsets, not full annual/curriculum certification. Official Zurich competency printouts checked: MA.1.A.3, MA.3.A.1, D.4.F.1 and D.5.D.1. Cycle progression is not six rigid annual ceilings. Example official source: https://zh.lehrplan.ch/lehrplan_printout.php?k=1&fb_id=1&f_id=11&kb_id=4&ha_id=6&k_id=1

## Assets and input
Nine bespoke transparent Cleverli storybook object sprites from an actual 1254×1254 generated atlas, a new 1944×809 painted river world and an existing authorised transparent standing Cleverli mascot. No native-4K claim. Source/runtime share an art module, private MIME/hash verification and existing route tracing wildcards. Caption strip remains separate from the canvas to avoid obscuring characters. Finger: tap choice, then bridge/gap. Vertical swipes scroll naturally. Desktop: native drag/drop, mouse or Tab/Enter and number keys. Sticky enabled 16px class picker resets the private round. Help pauses state and visual animation. Reduced motion and blocked local storage are handled. No injected wins: QA uses read-only state and deterministic time only.

## Acceptance
Run node spikes/adventure-shared/test.mjs and node scripts/test-private-adventures.cjs. Verified 6072 content cases, 600 full ordinary-controller rounds, all 72 sentences earned, all 144 observed bridge variants, each with at least two different block multisets and state-preserving recovery. Private-resource suite covers 64 authenticated/anonymous responses plus baseline auth cases and all four games' purpose isolation. Late image loading, aspect ratio and zero-size guards have focused regressions. Release still requires a fresh protected HTTPS desktop/phone Chromium/WebKit matrix, trusted pans, rendered guide/play/goal images, console/critical-response checks, build, independent bounded review, production readback, tracker and settled requester delivery. Real handset and child/classroom validation must be reported separately.
