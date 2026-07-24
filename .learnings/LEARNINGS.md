# Learnings

## 2026-07-24 — Cleverli Google Ads uses a different Maton key
- Ricci corrected that Cleverli Ads access does exist; the wrong old Maton key was used.
- Do not use the old shared-memory/Drive Maton key for Cleverli Ads. It only sees Shirtstar `4402426445`, Casa Poli `5295595101`, and disabled old Cleverli `3435589468`.
- Use the key from the successful 2026-07-23 Cleverli Ads Codex session, identifiable by local session log prefix `OPnf...`.
- Verify before any mutation: `customers:listAccessibleCustomers` must include active Cleverli `customers/5143806397`, plus `customers/9025185785` and `customers/7037229493`.
- If active Cleverli `5143806397` is missing, stop and find the right key before touching Google Ads.
