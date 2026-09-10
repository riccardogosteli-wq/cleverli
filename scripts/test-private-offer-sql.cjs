const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PGlite } = require(process.env.PRIVATE_OFFER_TEST_PGLITE_MODULE || '@electric-sql/pglite');
(async () => {
  const db = new PGlite(); let checks = 0;
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role;
      create table public.parent_profiles(id uuid primary key, premium boolean default false,
      premium_plan text, premium_until timestamptz, cancelled boolean, stripe_customer_id text, stripe_subscription_id text);`);
    await db.exec(fs.readFileSync('supabase/2026-09-10-private-offers.sql', 'utf8'));
    const user = '00000000-0000-4000-8000-000000000001', id = '00000000-0000-4000-8000-000000000002';
    const now = Math.floor(Date.now() / 1000), deadline = now + 100000;
    await db.query('insert into parent_profiles(id) values($1)', [user]);
    await db.query('insert into private_checkout_offers(id,token_hash,user_id,customer_id,amount,deadline) values($1,$2,$3,$4,$5,$6)', [id,'a'.repeat(64),user,'cus_fake',19900,deadline]);
    // Unissued offers must not be redeemable with NULL session/expiry arguments.
    await assert.rejects(db.query('select public.redeem_private_offer($1,null,$2,$3,19900,\'chf\',true,null)', [id,user,'cus_fake'])); checks++;
    const advance = () => db.query('select (public.advance_private_offer($1,0,$2)).*', [id, now + 80000]);
    const results = await Promise.all([advance(), advance()]);
    assert.equal(results[0].rows[0].generation, 1); assert.equal(results[1].rows[0].generation, 1); checks += 2;
    await db.query('select public.attach_private_offer($1,1,$2)', [id,'fake-session']);
    await assert.rejects(db.query('select public.attach_private_offer($1,0,$2)', [id,'different-session'])); checks++;
    const redeem = (overrides = {}) => {
      const p = { id, session:'fake-session', user, customer:'cus_fake', amount:19900, currency:'chf', paid:true, expires:now+80000, ...overrides };
      return db.query('select public.redeem_private_offer($1,$2,$3,$4,$5,$6,$7,$8) as applied', Object.values(p));
    };
    for (const patch of [{paid:false},{paid:null},{amount:9900},{currency:'eur'},{customer:'cus_wrong'},{session:'other'},{expires:deadline+1},{user:null}]) {
      await assert.rejects(redeem(patch)); checks++;
    }
    let parent = (await db.query('select * from parent_profiles')).rows[0]; assert.equal(parent.premium,false); checks++;
    const outcomes = await Promise.all([redeem(),redeem()]); assert.deepEqual(outcomes.map(x=>x.rows[0].applied),[true,false]); checks++;
    parent = (await db.query('select * from parent_profiles')).rows[0];
    assert.equal(parent.premium,true); assert.equal(parent.premium_plan,'schooltime'); assert.equal(parent.premium_until,null); assert.equal(parent.stripe_customer_id,'cus_fake'); checks += 4;
    await assert.rejects(advance()); checks++;
    // Reset only this ephemeral fixture to test late webhook arrival after the offer deadline.
    await db.query('update private_checkout_offers set redeemed_session=null, redeemed_at=null, deadline=$1, session_expires=$2', [now-1,now-2]);
    assert.equal((await redeem({expires:now-2})).rows[0].applied,true); checks++;
    // Browser roles have neither table access nor RPC execute privileges.
    for (const role of ['anon','authenticated']) {
      await db.exec('set role '+role);
      await assert.rejects(db.query('select * from public.private_checkout_offers')); checks++;
      await assert.rejects(advance()); checks++;
      await assert.rejects(redeem()); checks++;
      await db.exec('reset role');
    }
    console.log(`Private offer PostgreSQL: ${checks} checks passed in ephemeral PGlite, no production database access.`);
  } finally { await db.close(); }
})().catch(e => { console.error('Private offer SQL test failed:', e.message); process.exitCode=1; });
