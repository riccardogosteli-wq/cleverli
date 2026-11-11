import { getSupabase } from "@/lib/supabase";
import { getProfileStorageKey, hasAuthenticatedStorageScope } from "@/lib/accountScopedStorage";
import { getEquippedShopItem, getOwnedShopItems } from "@/lib/shop";
import type { Profile } from "@/hooks/useProfile";

type Credit = { id: string; amount: 1 | 6 };
type Legacy = { coins: number; ownedItems: string[]; equippedItem: string | null };
type Outbox = { version: 1; legacy: Legacy | null; credits: Credit[]; confirmed?: CloudShop };
export type CloudShop = { coins: number; ownedItems: string[]; equippedItem: string | null; revision: number; result: string };
export type ShopAction = "buy" | "wear" | "reset";
const queues = new Map<string, Promise<unknown>>();
async function storageLock<T>(scope: string, operation: () => T): Promise<T> {
  if (typeof navigator !== "undefined" && navigator.locks) return navigator.locks.request("cleverli-profile:" + scope, operation);
  return operation();
}
const outboxKey = (scope: string) => scope + ":shop-outbox-v1";

export function readShopOutbox(scope: string, profile: Profile): Outbox {
  const raw = localStorage.getItem(outboxKey(scope));
  if (raw) {
    const parsed = JSON.parse(raw) as Outbox;
    if (parsed.version !== 1 || !Array.isArray(parsed.credits) || parsed.credits.some(c => !c.id || ![1, 6].includes(c.amount))) throw Error("Invalid shop outbox");
    return parsed;
  }
  const box: Outbox = {
    version: 1,
    legacy: profile.shopCloudRevision === undefined ? {
      coins: Number.isFinite(profile.coins) ? Math.max(0, Math.floor(profile.coins)) : 0,
      ownedItems: [...new Set(getOwnedShopItems(profile))],
      equippedItem: getEquippedShopItem(profile)?.id ?? null,
    } : null,
    credits: [],
  };
  localStorage.setItem(outboxKey(scope), JSON.stringify(box));
  return box;
}

/** Called under the profile's Web Lock, BEFORE incrementing its local wallet. */
export function enqueueShopCredit(childId: string | null, profile: Profile, amount: number) {
  if (!childId || !hasAuthenticatedStorageScope() || amount === 0) return;
  if (amount !== 1 && amount !== 6) throw Error("Invalid coin reward");
  const scope = getProfileStorageKey(childId);
  const box = readShopOutbox(scope, profile);
  box.credits.push({ id: crypto.randomUUID(), amount });
  localStorage.setItem(outboxKey(scope), JSON.stringify(box));
}

export function pendingShopCoins(scope: string, profile: Profile): number {
  return readShopOutbox(scope, profile).credits.reduce((sum, c) => sum + c.amount, 0);
}

/** Highest authoritative snapshot and current pending set share one locked record. */
export function latestCloudShop(scope: string, profile: Profile, incoming?: CloudShop): CloudShop | undefined {
  const confirmed = readShopOutbox(scope, profile).confirmed;
  return confirmed && (!incoming || confirmed.revision >= incoming.revision) ? confirmed : incoming;
}

/** Server serializes wallets across devices; this queue also orders this tab's requests. */
export async function synchronizeCloudShop(childId: string, scope: string, profile: Profile, action?: ShopAction, item?: string): Promise<CloudShop> {
  const previous = queues.get(scope) ?? Promise.resolve();
  const request = previous.catch(() => {}).then(async () => {
    if (getProfileStorageKey(childId) !== scope || !hasAuthenticatedStorageScope()) throw Error("Shop account changed");
    const supabase = getSupabase();
    if (!supabase) throw Error("Shop connection unavailable");
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || getProfileStorageKey(childId) !== scope) throw Error("Shop session unavailable");
    const box = await storageLock(scope, () => readShopOutbox(scope, profile));
    // One bounded batch. Remaining events stay durable for the next refresh.
    const credits = box.credits.slice(0, 500);
    // Do not spend while this device still has unsent credits beyond the batch.
    if (action && box.credits.length > credits.length) throw Error("Shop rewards still synchronizing");
    const { data, error } = await supabase.rpc("sync_child_shop", {
      p_child: childId, p_legacy: box.legacy, p_credits: credits,
      p_action: action ?? null, p_item: item ?? null,
    });
    if (error) throw Error("Shop synchronization unavailable");
    if (!data || !Number.isSafeInteger(data.coins) || data.coins < 0 || !Array.isArray(data.ownedItems) || !Number.isSafeInteger(data.revision)) throw Error("Invalid cloud shop response");
    // A different tab/answer may have appended events during the network round-trip.
    if (getProfileStorageKey(childId) !== scope || !hasAuthenticatedStorageScope()) return data as CloudShop;
    return await storageLock(scope, () => {
      const latest = readShopOutbox(scope, profile);
      const accepted = new Set(credits.map(c => c.id));
      latest.credits = latest.credits.filter(c => !accepted.has(c.id));
      latest.legacy = null;
      if (!latest.confirmed || latest.confirmed.revision <= data.revision) latest.confirmed = { ...data, result: "synced" };
      localStorage.setItem(outboxKey(scope), JSON.stringify(latest));
      return { ...latest.confirmed, result: data.result } as CloudShop;
    });
  });
  queues.set(scope, request);
  try { return await request; }
  finally { if (queues.get(scope) === request) queues.delete(scope); }
}
