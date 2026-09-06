type Item = { id: string; label: string; image?: string; emoji?: string };

/** Opt-in equivalence for visually identical counters; other tasks keep exact IDs. */
export function scoreDropZones(
  items: Item[], zones: { id: string }[], answers: Record<string, string>,
  placed: Record<string, string[]>, interchangeable = false,
): Record<string, boolean> {
  const byId = new Map(items.map(item => [item.id, item]));
  const allPlaced = Object.values(placed).flat();
  const valid = new Set(allPlaced).size === allPlaced.length
    && allPlaced.every(id => byId.has(id))
    && Object.keys(placed).every(id => zones.some(zone => zone.id === id));
  const signature = (id: string) => {
    const item = byId.get(id)!;
    return interchangeable ? JSON.stringify([item.label, item.emoji ?? null, item.image ?? null]) : id;
  };
  return Object.fromEntries(zones.map(zone => {
    const expected = items.filter(item => answers[item.id] === zone.id).map(item => signature(item.id)).sort();
    const actual = valid ? (placed[zone.id] ?? []).map(signature).sort() : [];
    return [zone.id, valid && actual.length === expected.length && expected.every((value, i) => value === actual[i])];
  }));
}
