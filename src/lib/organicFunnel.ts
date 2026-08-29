export type OrganicFunnelEvent = {
  id: string;
  user_id: string | null;
  email: string | null;
  activity_type: string;
  metadata: Record<string, unknown> | null;
};

export type OrganicFunnelRow = {
  landingPage: string;
  signups: number;
  checkouts: number;
  trials: number;
  paid: number;
};

type AttributionTouch = {
  channel?: unknown;
  landingPage?: unknown;
};

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function cleanString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function firstTouch(event: OrganicFunnelEvent): AttributionTouch | null {
  const attribution = record(event.metadata?.attribution);
  return record(attribution?.first) as AttributionTouch | null;
}

function identity(event: OrganicFunnelEvent) {
  return event.user_id || event.email?.toLowerCase() || event.id;
}

function conversionId(event: OrganicFunnelEvent) {
  if (event.activity_type === "checkout_started") {
    return cleanString(event.metadata?.stripeSessionId) || identity(event);
  }
  return cleanString(event.metadata?.stripeSubscriptionId) || identity(event);
}

export function buildOrganicFunnel(events: OrganicFunnelEvent[]) {
  const rows = new Map<string, {
    landingPage: string;
    signups: Set<string>;
    checkouts: Set<string>;
    trials: Set<string>;
    paid: Set<string>;
  }>();

  for (const event of events) {
    const first = firstTouch(event);
    if (cleanString(first?.channel) !== "organic_search") continue;

    const landingPage = cleanString(first?.landingPage) || "(unbekannte Landingpage)";
    const row = rows.get(landingPage) ?? {
      landingPage,
      signups: new Set<string>(),
      checkouts: new Set<string>(),
      trials: new Set<string>(),
      paid: new Set<string>(),
    };

    if (event.activity_type === "signup") row.signups.add(identity(event));
    if (event.activity_type === "checkout_started") row.checkouts.add(conversionId(event));
    if (event.activity_type === "subscription_trial_started") row.trials.add(conversionId(event));
    if (
      event.activity_type === "subscription_started"
      || (event.activity_type === "subscription_updated" && Number(event.metadata?.amountPaid ?? 0) > 0)
    ) {
      row.paid.add(conversionId(event));
    }

    rows.set(landingPage, row);
  }

  const byLandingPage: OrganicFunnelRow[] = [...rows.values()]
    .map(row => ({
      landingPage: row.landingPage,
      signups: row.signups.size,
      checkouts: row.checkouts.size,
      trials: row.trials.size,
      paid: row.paid.size,
    }))
    .sort((a, b) => (b.signups + b.checkouts + b.trials + b.paid) - (a.signups + a.checkouts + a.trials + a.paid));

  return {
    byLandingPage,
    totals: byLandingPage.reduce(
      (totals, row) => ({
        signups: totals.signups + row.signups,
        checkouts: totals.checkouts + row.checkouts,
        trials: totals.trials + row.trials,
        paid: totals.paid + row.paid,
      }),
      { signups: 0, checkouts: 0, trials: 0, paid: 0 },
    ),
  };
}
