import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { INTERNAL_LOG_COOKIE, verifyInternalSession } from "@/lib/internalDashboardAuth";
import { buildOrganicFunnel } from "@/lib/organicFunnel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Internal Logs - Cleverli",
  robots: { index: false, follow: false },
};

type ExerciseEventRow = {
  event_name: string;
  exercise_id: string | null;
  grade: number | null;
  subject: string | null;
  topic_id: string | null;
  exercise_type: string | null;
  wrong_count_session: number | null;
  hints_used: number | null;
  duration_ms: number | null;
  path: string | null;
  anonymous_session_id: string | null;
  created_at: string;
};

type ActivityEventRow = {
  id: string;
  user_id: string | null;
  email: string | null;
  activity_type: string;
  path: string | null;
  source: string | null;
  exercise_id: string | null;
  grade: number | null;
  subject: string | null;
  topic_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  synthetic?: boolean;
};

type AuthUserRow = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  premium: boolean;
  premium_until: string | null;
  premium_plan: string | null;
  cancelled: boolean;
  userMetadata: Record<string, unknown>;
};

type ExerciseStats = {
  key: string;
  exerciseId: string;
  grade: number | null;
  subject: string;
  topicId: string;
  type: string;
  started: number;
  completed: number;
  wrong: number;
  hints: number;
  avgDurationMs: number;
  lastSeen: string;
};

type ActivityFilters = {
  user?: string;
  activity?: string;
  from?: string;
  to?: string;
};

type UserActivitySummary = {
  key: string;
  label: string;
  accessLabel: string;
  accessTone: "premium" | "free" | "expired" | "cancelled" | "unknown";
  lastActivity: string;
  lastActivityType: string;
  exercises7d: number;
  authEvents: number;
  subscriptionEvents: number;
};

type AdsVariant = "control" | "trial";

type AdsAbStats = {
  variant: AdsVariant;
  label: string;
  assignments: number;
  ctaClicks: number;
  ctaVisitors: number;
  freeClicks: number;
  paidClicks: number;
  checkouts: number;
  trialStarts: number;
  subscriptions: number;
  pages: Map<string, AdsAbPageStats>;
};

type AdsAbPageStats = {
  pageKey: string;
  label: string;
  assignments: number;
  ctaClicks: number;
  ctaVisitors: number;
  freeClicks: number;
  paidClicks: number;
  checkouts: number;
};

type CancellationFeedbackStats = {
  total: number;
  withComment: number;
  retentionAccepted: number;
  retentionDeclined: number;
  byReason: Array<{
    reason: string;
    label: string;
    count: number;
    comments: number;
  }>;
  recent: ActivityEventRow[];
};

const ACTIVITY_TYPES = [
  "login",
  "signup_started",
  "signup",
  "password_reset_requested",
  "password_updated",
  "ads_lp_ab_assignment",
  "ads_lp_cta_click",
  "checkout_started",
  "subscription_trial_started",
  "subscription_started",
  "subscription_updated",
  "subscription_cancel_requested",
  "subscription_cancelled",
  "exercise_started",
  "exercise_completed",
  "exercise_wrong_answer",
  "hint_used",
  "paywall_shown",
];

function subjectLabel(subject: string | null) {
  if (!subject) return "-";
  if (subject === "math") return "Mathe";
  if (subject === "german") return "Deutsch";
  if (subject === "nmg") return "NMG";
  return subject;
}

function activityLabel(activityType: string) {
  const labels: Record<string, string> = {
    login: "Login",
    signup_started: "Signup gestartet",
    signup: "Signup",
    password_reset_requested: "PW Reset angefordert",
    password_updated: "PW geändert",
    ads_lp_ab_assignment: "Ads A/B Zuweisung",
    ads_lp_cta_click: "Ads LP CTA Klick",
    checkout_started: "Checkout gestartet",
    subscription_trial_started: "Trial gestartet",
    subscription_started: "Abo gestartet",
    subscription_updated: "Abo aktualisiert",
    subscription_cancel_requested: "Kündigung angefordert",
    subscription_cancelled: "Abo gekündigt",
    exercise_started: "Übung gestartet",
    exercise_completed: "Übung gelöst",
    exercise_wrong_answer: "Falschantwort",
    hint_used: "Hint genutzt",
    paywall_shown: "Paywall gezeigt",
  };
  return labels[activityType] ?? activityType;
}

function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function timeLabel(date: string) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function dateTimeLabel(date: string) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function metadataLabel(metadata: Record<string, unknown> | null) {
  if (!metadata) return "-";
  const entries = Object.entries(metadata)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .slice(0, 4)
    .map(([key, value]) => `${key}: ${String(value)}`);
  return entries.length ? entries.join(" · ") : "-";
}

function accessInfo(user?: Pick<AuthUserRow, "premium" | "premium_until" | "premium_plan" | "cancelled"> | null) {
  if (!user) return { label: "Unbekannt", tone: "unknown" as const };

  const active = user.premium && (!user.premium_until || new Date(user.premium_until) > new Date());
  if (!active && user.premium_until) return { label: "Free · abgelaufen", tone: "expired" as const };
  if (!active) return { label: "Free", tone: "free" as const };

  const plan = user.premium_plan ? ` · ${user.premium_plan}` : "";
  if (user.cancelled) return { label: `Premium gekündigt${plan}`, tone: "cancelled" as const };
  return { label: `Premium${plan}`, tone: "premium" as const };
}

function AccessBadge({ label, tone }: { label: string; tone: UserActivitySummary["accessTone"] }) {
  const classes: Record<UserActivitySummary["accessTone"], string> = {
    premium: "border-green-200 bg-green-50 text-green-800",
    cancelled: "border-amber-200 bg-amber-50 text-amber-800",
    expired: "border-gray-200 bg-gray-100 text-gray-600",
    free: "border-gray-200 bg-white text-gray-700",
    unknown: "border-gray-200 bg-gray-50 text-gray-500",
  };

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-2 py-1 text-xs font-bold ${classes[tone]}`}>
      {label}
    </span>
  );
}

async function loadEvents() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return [] as ExerciseEventRow[];

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("exercise_events")
    .select("event_name, exercise_id, grade, subject, topic_id, exercise_type, wrong_count_session, hints_used, duration_ms, path, anonymous_session_id, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) {
    console.error("[internal-log-dashboard]", error);
    return [];
  }

  return (data ?? []) as ExerciseEventRow[];
}

async function loadActivity(filters: ActivityFilters) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return [] as ActivityEventRow[];

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const from = filters.from
    ? new Date(`${filters.from}T00:00:00`).toISOString()
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const to = filters.to
    ? new Date(`${filters.to}T23:59:59`).toISOString()
    : undefined;

  let query = supabase
    .from("user_activity_events")
    .select("id, user_id, email, activity_type, path, source, exercise_id, grade, subject, topic_id, metadata, created_at")
    .gte("created_at", from)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (to) query = query.lte("created_at", to);
  if (filters.activity && filters.activity !== "all") {
    query = query.eq("activity_type", filters.activity);
  }
  if (filters.user) {
    const value = filters.user.trim();
    const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
    query = uuidLike ? query.eq("user_id", value) : query.ilike("email", `%${value}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[internal-log-dashboard/activity]", error);
    return [];
  }

  return (data ?? []) as ActivityEventRow[];
}

async function loadAdsAbActivity(filters: Pick<ActivityFilters, "from" | "to">) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return [] as ActivityEventRow[];

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
  const from = filters.from
    ? new Date(`${filters.from}T00:00:00`).toISOString()
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const to = filters.to ? new Date(`${filters.to}T23:59:59`).toISOString() : undefined;
  const rows: ActivityEventRow[] = [];
  const pageSize = 1000;

  for (let offset = 0; offset < 10_000; offset += pageSize) {
    let query = supabase
      .from("user_activity_events")
      .select("id, user_id, email, activity_type, path, source, exercise_id, grade, subject, topic_id, metadata, created_at")
      .in("activity_type", [
        "ads_lp_ab_assignment",
        "ads_lp_cta_click",
        "checkout_started",
        "subscription_trial_started",
        "subscription_started",
        "subscription_updated",
      ])
      .gte("created_at", from)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);
    if (to) query = query.lte("created_at", to);

    const { data, error } = await query;
    if (error) {
      console.error("[internal-log-dashboard/ads-ab]", error);
      break;
    }
    rows.push(...((data ?? []) as ActivityEventRow[]));
    if ((data?.length ?? 0) < pageSize) break;
  }

  return rows;
}

async function loadOrganicFunnelActivity(filters: Pick<ActivityFilters, "from" | "to">) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return [] as ActivityEventRow[];

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
  const from = filters.from
    ? new Date(`${filters.from}T00:00:00`).toISOString()
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const to = filters.to ? new Date(`${filters.to}T23:59:59`).toISOString() : undefined;
  const rows: ActivityEventRow[] = [];
  const pageSize = 1000;

  for (let offset = 0; offset < 10_000; offset += pageSize) {
    let query = supabase
      .from("user_activity_events")
      .select("id, user_id, email, activity_type, path, source, exercise_id, grade, subject, topic_id, metadata, created_at")
      .in("activity_type", [
        "signup",
        "checkout_started",
        "subscription_trial_started",
        "subscription_started",
        "subscription_updated",
      ])
      .gte("created_at", from)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);
    if (to) query = query.lte("created_at", to);

    const { data, error } = await query;
    if (error) {
      console.error("[internal-log-dashboard/organic-funnel]", error);
      break;
    }
    rows.push(...((data ?? []) as ActivityEventRow[]));
    if ((data?.length ?? 0) < pageSize) break;
  }

  return rows;
}

async function loadAuthUsers(filters: ActivityFilters) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return [] as AuthUserRow[];

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const users: AuthUserRow[] = [];
  const perPage = 1000;
  let page = 1;

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error("[internal-log-dashboard/auth-users]", error);
      return users;
    }

    users.push(...data.users.map(user => ({
      id: user.id,
      email: user.email ?? null,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at ?? null,
      premium: false,
      premium_until: null,
      premium_plan: null,
      cancelled: false,
      userMetadata: user.user_metadata ?? {},
    })));

    if (data.users.length < perPage) break;
    page += 1;
  }

  const profileMap = new Map<string, Pick<AuthUserRow, "premium" | "premium_until" | "premium_plan" | "cancelled">>();
  for (let i = 0; i < users.length; i += 1000) {
    const ids = users.slice(i, i + 1000).map(user => user.id);
    if (ids.length === 0) continue;

    const { data, error } = await supabase
      .from("parent_profiles")
      .select("id, premium, premium_until, premium_plan, cancelled")
      .in("id", ids);

    if (error) {
      console.error("[internal-log-dashboard/account-status]", error);
    } else {
      for (const profile of data ?? []) {
        profileMap.set(profile.id, {
          premium: profile.premium ?? false,
          premium_until: profile.premium_until ?? null,
          premium_plan: profile.premium_plan ?? null,
          cancelled: profile.cancelled ?? false,
        });
      }
    }
  }

  const enrichedUsers = users.map(user => ({
    ...user,
    ...(profileMap.get(user.id) ?? {}),
  }));

  const userFilter = filters.user?.trim().toLowerCase();
  if (!userFilter) return enrichedUsers;

  return enrichedUsers.filter(user => {
    return user.id.toLowerCase() === userFilter || user.email?.toLowerCase().includes(userFilter);
  });
}

function minuteKey(date: string) {
  return date.slice(0, 16);
}

function matchesActivityFilter(activityType: string, filters: ActivityFilters) {
  return !filters.activity || filters.activity === "all" || filters.activity === activityType;
}

function matchesDateFilter(date: string, filters: ActivityFilters) {
  const timestamp = new Date(date).getTime();
  if (!Number.isFinite(timestamp)) return false;

  if (filters.from) {
    const from = new Date(`${filters.from}T00:00:00`).getTime();
    if (timestamp < from) return false;
  } else {
    const defaultFrom = Date.now() - 30 * 24 * 60 * 60 * 1000;
    if (timestamp < defaultFrom) return false;
  }

  if (filters.to) {
    const to = new Date(`${filters.to}T23:59:59`).getTime();
    if (timestamp > to) return false;
  }

  return true;
}

function authActivityRows(authUsers: AuthUserRow[], events: ActivityEventRow[], filters: ActivityFilters) {
  const existing = new Set(
    events
      .filter(event => event.user_id && ["login", "signup"].includes(event.activity_type))
      .map(event => `${event.user_id}:${event.activity_type}:${minuteKey(event.created_at)}`),
  );

  const rows: ActivityEventRow[] = [];

  for (const user of authUsers) {
    const candidates: Array<{ activityType: "login" | "signup"; createdAt: string }> = [
      { activityType: "signup", createdAt: user.created_at },
    ];

    if (user.last_sign_in_at) {
      candidates.push({ activityType: "login", createdAt: user.last_sign_in_at });
    }

    for (const candidate of candidates) {
      if (!matchesActivityFilter(candidate.activityType, filters)) continue;
      if (!matchesDateFilter(candidate.createdAt, filters)) continue;

      const key = `${user.id}:${candidate.activityType}:${minuteKey(candidate.createdAt)}`;
      if (existing.has(key)) continue;

      rows.push({
        id: `synthetic:${key}`,
        user_id: user.id,
        email: user.email,
        activity_type: candidate.activityType,
        path: null,
        source: "supabase_auth",
        exercise_id: null,
        grade: null,
        subject: null,
        topic_id: null,
        metadata: {
          source: "Supabase Auth",
          attribution: user.userMetadata.attribution ?? null,
        },
        created_at: candidate.createdAt,
        synthetic: true,
      });
    }
  }

  return rows;
}

function buildStats(events: ExerciseEventRow[]) {
  const last24 = events.filter(e => Date.now() - new Date(e.created_at).getTime() <= 24 * 60 * 60 * 1000);
  const byEvent = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.event_name] = (acc[event.event_name] ?? 0) + 1;
    return acc;
  }, {});

  const exerciseMap = new Map<string, ExerciseStats & { durationTotal: number; durationCount: number }>();
  for (const event of events) {
    const exerciseId = event.exercise_id ?? "unknown";
    const key = `${event.grade ?? "-"}:${event.subject ?? "-"}:${event.topic_id ?? "-"}:${exerciseId}`;
    const item = exerciseMap.get(key) ?? {
      key,
      exerciseId,
      grade: event.grade,
      subject: subjectLabel(event.subject),
      topicId: event.topic_id ?? "-",
      type: event.exercise_type ?? "-",
      started: 0,
      completed: 0,
      wrong: 0,
      hints: 0,
      avgDurationMs: 0,
      durationTotal: 0,
      durationCount: 0,
      lastSeen: event.created_at,
    };

    if (event.event_name === "exercise_started") item.started += 1;
    if (event.event_name === "exercise_completed") item.completed += 1;
    if (event.event_name === "exercise_wrong_answer") item.wrong += 1;
    if (event.event_name === "hint_used") item.hints += 1;
    if (event.duration_ms) {
      item.durationTotal += event.duration_ms;
      item.durationCount += 1;
    }
    if (new Date(event.created_at) > new Date(item.lastSeen)) item.lastSeen = event.created_at;

    exerciseMap.set(key, item);
  }

  const exercises = [...exerciseMap.values()].map(item => ({
    ...item,
    avgDurationMs: item.durationCount ? Math.round(item.durationTotal / item.durationCount) : 0,
  }));

  const flagged = exercises
    .filter(item => item.wrong >= 5 || (item.started >= 5 && pct(item.completed, item.started) < 50) || item.hints >= 5)
    .sort((a, b) => (b.wrong + b.hints) - (a.wrong + a.hints))
    .slice(0, 12);

  const topWrong = exercises
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, 8);

  return {
    total7d: events.length,
    total24h: last24.length,
    uniqueSessions: new Set(events.map(e => e.anonymous_session_id).filter(Boolean)).size,
    byEvent,
    flagged,
    topWrong,
    recent: events.slice(0, 40),
  };
}

function buildActivitySummaries(events: ActivityEventRow[], authUsers: AuthUserRow[] = []) {
  const since7d = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const summaries = new Map<string, UserActivitySummary>();
  const authById = new Map(authUsers.map(user => [user.id, user]));
  const authByEmail = new Map(authUsers.filter(user => user.email).map(user => [user.email!.toLowerCase(), user]));

  for (const user of authUsers) {
    const lastActivity = user.last_sign_in_at ?? user.created_at;
    const access = accessInfo(user);
    summaries.set(user.id, {
      key: user.id,
      label: user.email ?? user.id,
      accessLabel: access.label,
      accessTone: access.tone,
      lastActivity,
      lastActivityType: user.last_sign_in_at ? "login" : "signup",
      exercises7d: 0,
      authEvents: 0,
      subscriptionEvents: 0,
    });
  }

  for (const event of events) {
    const key = event.user_id ?? event.email ?? "unknown";
    const current = summaries.get(key);
    const authUser = event.user_id ? authById.get(event.user_id) : event.email ? authByEmail.get(event.email.toLowerCase()) : null;
    const access = accessInfo(authUser);
    const summary = current ?? {
      key,
      label: event.email ?? event.user_id ?? "Unbekannt",
      accessLabel: access.label,
      accessTone: access.tone,
      lastActivity: event.created_at,
      lastActivityType: event.activity_type,
      exercises7d: 0,
      authEvents: 0,
      subscriptionEvents: 0,
    };

    if (new Date(event.created_at) > new Date(summary.lastActivity)) {
      summary.lastActivity = event.created_at;
      summary.lastActivityType = event.activity_type;
    }
    if (event.activity_type.startsWith("exercise_") && new Date(event.created_at).getTime() >= since7d) {
      summary.exercises7d += 1;
    }
    if (["login", "signup", "password_reset_requested", "password_updated"].includes(event.activity_type)) {
      summary.authEvents += 1;
    }
    if (event.activity_type.startsWith("subscription_") || event.activity_type === "checkout_started") {
      summary.subscriptionEvents += 1;
    }

    summaries.set(key, summary);
  }

  return [...summaries.values()]
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
    .slice(0, 40);
}

const ADS_AB_PAGES: Record<string, string> = {
  primarschule_uebungen: "Primarschule Übungen",
  einmaleins_ueben: "Einmaleins üben",
  eins_mal_eins_spiele: "1x1 Spiele",
  mathe_uebungen_kinder: "Mathe Übungen Kinder",
  deutsch_uebungen_kinder: "Deutsch Übungen Kinder",
  lesen_lernen: "Lesen lernen",
};
const INTERNAL_TEST_EMAILS = new Set(["test@cleverli.ch"]);

function cleanString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normaliseAdsPage(value: unknown, source?: string | null, path?: string | null) {
  const direct = cleanString(value);
  if (direct && ADS_AB_PAGES[direct]) return direct;

  const haystack = [source ?? "", path ?? ""].join(" ");
  if (haystack.includes("einmaleins_ueben") || haystack.includes("/einmaleins-ueben")) return "einmaleins_ueben";
  if (haystack.includes("eins_mal_eins_spiele") || haystack.includes("/1x1-spiele")) return "eins_mal_eins_spiele";
  if (haystack.includes("mathe_uebungen_kinder") || haystack.includes("/mathe-uebungen-kinder")) return "mathe_uebungen_kinder";
  if (haystack.includes("deutsch_uebungen_kinder") || haystack.includes("/deutsch-uebungen-kinder")) return "deutsch_uebungen_kinder";
  if (haystack.includes("lesen_lernen") || haystack.includes("/lesen-lernen")) return "lesen_lernen";
  if (haystack.includes("primarschule_uebungen") || haystack.includes("/primarschule-uebungen")) return "primarschule_uebungen";

  return "unknown";
}

function inferAdsVariant(event: ActivityEventRow): AdsVariant | null {
  const variant = cleanString(event.metadata?.variant);
  if (variant === "trial" || variant === "control") return variant;

  // Before variant metadata was added to every CTA, Trial CTAs carried an
  // explicit variant and Control CTAs did not. Keep only that narrow legacy
  // fallback; never infer checkout/trial/payment attribution from trial days.
  if (event.activity_type === "ads_lp_cta_click") return "control";
  return null;
}

function isInternalAdsAbEvent(event: ActivityEventRow) {
  const email = event.email?.toLowerCase() ?? "";
  return INTERNAL_TEST_EMAILS.has(email)
    || event.metadata?.internal_qa === true
    || event.metadata?.forced_variant === true;
}

function createAdsVariantStats(variant: AdsVariant): AdsAbStats {
  return {
    variant,
    label: variant === "trial" ? "Trial" : "Control",
    assignments: 0,
    ctaClicks: 0,
    ctaVisitors: 0,
    freeClicks: 0,
    paidClicks: 0,
    checkouts: 0,
    trialStarts: 0,
    subscriptions: 0,
    pages: new Map(),
  };
}

function adsPageStats(stats: AdsAbStats, pageKey: string) {
  const key = pageKey || "unknown";
  const current = stats.pages.get(key);
  if (current) return current;

  const item: AdsAbPageStats = {
    pageKey: key,
    label: ADS_AB_PAGES[key] ?? key,
    assignments: 0,
    ctaClicks: 0,
    ctaVisitors: 0,
    freeClicks: 0,
    paidClicks: 0,
    checkouts: 0,
  };
  stats.pages.set(key, item);
  return item;
}

function buildAdsAbStats(events: ActivityEventRow[]) {
  const variants: Record<AdsVariant, AdsAbStats> = {
    control: createAdsVariantStats("control"),
    trial: createAdsVariantStats("trial"),
  };

  const relevantRaw = events.filter(event => (
    [
      "ads_lp_ab_assignment",
      "ads_lp_cta_click",
      "checkout_started",
      "subscription_trial_started",
      "subscription_started",
    ].includes(event.activity_type)
      || (event.activity_type === "subscription_updated" && Number(event.metadata?.amountPaid ?? 0) > 0)
  ) && !isInternalAdsAbEvent(event));

  const seenCtaEventIds = new Set<string>();
  const lastCtaBySession = new Map<string, number>();
  const relevant = relevantRaw.filter(event => {
    if (event.activity_type !== "ads_lp_cta_click") return true;

    const eventId = cleanString(event.metadata?.cta_event_id);
    if (eventId) {
      if (seenCtaEventIds.has(eventId)) return false;
      seenCtaEventIds.add(eventId);
    }

    const sessionId = cleanString(event.metadata?.cta_session_id);
    if (!sessionId) return true;

    const key = [
      sessionId,
      normaliseAdsPage(event.metadata?.page ?? event.metadata?.experiment_page, event.source, event.path),
      cleanString(event.metadata?.cta_type),
      cleanString(event.metadata?.destination),
    ].join(":");
    const timestamp = new Date(event.created_at).getTime();
    const previous = lastCtaBySession.get(key);
    lastCtaBySession.set(key, Math.max(previous ?? 0, timestamp));
    return previous === undefined || Math.abs(previous - timestamp) >= 3_000;
  });

  const assignedVisitors: Record<AdsVariant, Set<string>> = { control: new Set(), trial: new Set() };
  const ctaVisitors: Record<AdsVariant, Set<string>> = { control: new Set(), trial: new Set() };
  const checkoutIds: Record<AdsVariant, Set<string>> = { control: new Set(), trial: new Set() };
  const trialIds: Record<AdsVariant, Set<string>> = { control: new Set(), trial: new Set() };
  const subscriptionIds: Record<AdsVariant, Set<string>> = { control: new Set(), trial: new Set() };
  const pageAssignments = new Set<string>();
  const pageCtaVisitors = new Set<string>();
  const pageCheckouts = new Set<string>();

  for (const event of relevant) {
    const variant = inferAdsVariant(event);
    if (!variant) continue;

    const pageKey = normaliseAdsPage(event.metadata?.page ?? event.metadata?.experiment_page, event.source, event.path);
    const stats = variants[variant];
    const page = adsPageStats(stats, pageKey);
    const ctaType = cleanString(event.metadata?.cta_type);
    const visitorId = cleanString(event.metadata?.experiment_visitor_id)
      || cleanString(event.metadata?.cta_session_id)
      || cleanString(event.metadata?.cta_event_id)
      || event.id;

    if (event.activity_type === "ads_lp_ab_assignment") {
      if (!assignedVisitors[variant].has(visitorId)) {
        assignedVisitors[variant].add(visitorId);
        stats.assignments += 1;
      }
      const pageKeyForVisitor = `${variant}:${pageKey}:${visitorId}`;
      if (!pageAssignments.has(pageKeyForVisitor)) {
        pageAssignments.add(pageKeyForVisitor);
        page.assignments += 1;
      }
    }
    if (event.activity_type === "ads_lp_cta_click") {
      stats.ctaClicks += 1;
      page.ctaClicks += 1;
      if (!ctaVisitors[variant].has(visitorId)) {
        ctaVisitors[variant].add(visitorId);
        stats.ctaVisitors += 1;
      }
      const pageKeyForVisitor = `${variant}:${pageKey}:${visitorId}`;
      if (!pageCtaVisitors.has(pageKeyForVisitor)) {
        pageCtaVisitors.add(pageKeyForVisitor);
        page.ctaVisitors += 1;
      }
      if (ctaType === "free") {
        stats.freeClicks += 1;
        page.freeClicks += 1;
      }
      if (ctaType === "paid") {
        stats.paidClicks += 1;
        page.paidClicks += 1;
      }
    }
    if (event.activity_type === "checkout_started") {
      const checkoutId = cleanString(event.metadata?.stripeSessionId) || event.id;
      if (!checkoutIds[variant].has(checkoutId)) {
        checkoutIds[variant].add(checkoutId);
        stats.checkouts += 1;
      }
      const pageCheckoutKey = `${variant}:${pageKey}:${checkoutId}`;
      if (!pageCheckouts.has(pageCheckoutKey)) {
        pageCheckouts.add(pageCheckoutKey);
        page.checkouts += 1;
      }
    }
    if (event.activity_type === "subscription_trial_started") {
      const subscriptionId = cleanString(event.metadata?.stripeSubscriptionId) || visitorId;
      if (!trialIds[variant].has(subscriptionId)) {
        trialIds[variant].add(subscriptionId);
        stats.trialStarts += 1;
      }
    }
    const isPaidStart = event.activity_type === "subscription_started"
      || (event.activity_type === "subscription_updated" && Number(event.metadata?.amountPaid ?? 0) > 0);
    if (isPaidStart) {
      const subscriptionId = cleanString(event.metadata?.stripeSubscriptionId) || visitorId;
      if (!subscriptionIds[variant].has(subscriptionId)) {
        subscriptionIds[variant].add(subscriptionId);
        stats.subscriptions += 1;
      }
    }
  }

  return {
    variants,
    recent: relevant.slice(0, 25),
    unattributedConversions: relevantRaw.filter(event => [
      "checkout_started",
      "subscription_trial_started",
      "subscription_started",
      "subscription_updated",
    ].includes(event.activity_type) && !inferAdsVariant(event)).length,
  };
}

const CANCELLATION_REASON_LABELS: Record<string, string> = {
  too_expensive: "Zu teuer",
  child_not_using: "Kind nutzt es zu wenig",
  missing_content: "Passende Aufgaben fehlen",
  level_mismatch: "Niveau passt nicht",
  technical_issue: "Technisches Problem",
  pause_or_alternative: "Pause oder andere Lösung",
  found_alternative: "Nutzt Alternative",
  temporary_break: "Pause",
  other: "Anderer Grund",
  not_provided: "Kein Grund angegeben",
};

function cancellationReasonFromEvent(event: ActivityEventRow) {
  const reason = cleanString(event.metadata?.cancellationReason) || "not_provided";
  return CANCELLATION_REASON_LABELS[reason] ? reason : "other";
}

function cancellationCommentFromEvent(event: ActivityEventRow) {
  return cleanString(event.metadata?.cancellationComment);
}

function buildCancellationFeedbackStats(events: ActivityEventRow[]): CancellationFeedbackStats {
  const cancellations = events.filter(event => event.activity_type === "subscription_cancel_requested");
  const retentionAccepted = events.filter(event =>
    event.activity_type === "subscription_updated"
    && event.metadata?.retentionOffer === "yearly_66"
    && event.metadata?.retentionOutcome === "accepted"
  ).length;
  const retentionDeclined = cancellations.filter(event =>
    event.metadata?.retentionOffer === "yearly_66"
    && event.metadata?.retentionOutcome === "declined"
  ).length;
  const byReasonMap = new Map<string, { reason: string; label: string; count: number; comments: number }>();

  for (const event of cancellations) {
    const reason = cancellationReasonFromEvent(event);
    const comment = cancellationCommentFromEvent(event);
    const current = byReasonMap.get(reason) ?? {
      reason,
      label: CANCELLATION_REASON_LABELS[reason],
      count: 0,
      comments: 0,
    };
    current.count += 1;
    if (comment) current.comments += 1;
    byReasonMap.set(reason, current);
  }

  return {
    total: cancellations.length,
    withComment: cancellations.filter(event => Boolean(cancellationCommentFromEvent(event))).length,
    retentionAccepted,
    retentionDeclined,
    byReason: [...byReasonMap.values()].sort((a, b) => b.count - a.count),
    recent: cancellations.slice(0, 20),
  };
}

function LoginForm({ hasError }: { hasError: boolean }) {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <form action="/api/internal/log-dashboard/login" method="post" className="w-full max-w-sm rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h1 className="text-xl font-black">Internal Logs</h1>
        <p className="mt-2 text-sm text-gray-400">Private Cleverli Diagnoseansicht.</p>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Passwort"
          className="mt-5 w-full rounded-md border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
        />
        {hasError && <p className="mt-3 text-sm text-red-300">Passwort stimmt nicht.</p>}
        <button className="mt-5 w-full rounded-md bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-500">
          Öffnen
        </button>
      </form>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-gray-950">{value}</div>
    </div>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-green-600" style={{ width: `${max ? Math.max(4, pct(value, max)) : 0}%` }} />
      </div>
    </div>
  );
}

export default async function InternalLogDashboard({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; user?: string; activity?: string; from?: string; to?: string }>;
}) {
  const cookieStore = await cookies();
  const authed = verifyInternalSession(cookieStore.get(INTERNAL_LOG_COOKIE)?.value);
  const params = await searchParams;

  if (!authed) {
    return <LoginForm hasError={params.error === "1"} />;
  }

  const activityFilters = {
    user: params.user?.trim() || "",
    activity: params.activity || "all",
    from: params.from || "",
    to: params.to || "",
  };
  const events = await loadEvents();
  const [activityEventsRaw, adsAbEventsRaw, organicEventsRaw, authUsersAll] = await Promise.all([
    loadActivity(activityFilters),
    loadAdsAbActivity({ from: activityFilters.from, to: activityFilters.to }),
    loadOrganicFunnelActivity({ from: activityFilters.from, to: activityFilters.to }),
    loadAuthUsers({ ...activityFilters, user: "" }),
  ]);
  const authUserFilter = activityFilters.user.toLowerCase();
  const authUsers = authUserFilter
    ? authUsersAll.filter(user => user.id.toLowerCase() === authUserFilter || user.email?.toLowerCase().includes(authUserFilter))
    : authUsersAll;
  const syntheticSignupEvents = authActivityRows(authUsersAll, organicEventsRaw, {
    ...activityFilters,
    user: "",
    activity: "signup",
  });
  const activityEvents = [
    ...activityEventsRaw,
    ...authActivityRows(authUsers, activityEventsRaw, activityFilters),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 1000);
  const stats = buildStats(events);
  const adsAbStats = buildAdsAbStats(adsAbEventsRaw);
  const organicFunnel = buildOrganicFunnel([...organicEventsRaw, ...syntheticSignupEvents]);
  const cancellationStats = buildCancellationFeedbackStats(adsAbEventsRaw);
  const seedAuthSummaries = activityFilters.activity === "all" && !activityFilters.from && !activityFilters.to;
  const activitySummaries = buildActivitySummaries(activityEvents, seedAuthSummaries ? authUsers : []);
  const authById = new Map(authUsers.map(user => [user.id, user]));
  const authByEmail = new Map(authUsers.filter(user => user.email).map(user => [user.email!.toLowerCase(), user]));
  const eventAccess = (event: ActivityEventRow) => accessInfo(
    event.user_id ? authById.get(event.user_id) : event.email ? authByEmail.get(event.email.toLowerCase()) : null,
  );
  const maxEvent = Math.max(1, ...Object.values(stats.byEvent));

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50 px-4 py-6 text-gray-950 sm:px-6">
      <div className="mx-auto min-w-0 max-w-7xl space-y-6">
        <header className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-700">Cleverli intern</p>
            <h1 className="text-3xl font-black">Log Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Private Übungs-, User- und Zahlungsaktivitäten.</p>
          </div>
          <form action="/api/internal/log-dashboard/logout" method="post">
            <button className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">
              Logout
            </button>
          </form>
        </header>

        <section className="grid gap-3 sm:grid-cols-4">
          <Stat label="Übungs-Events 24h" value={stats.total24h} />
          <Stat label="Übungs-Events 7 Tage" value={stats.total7d} />
          <Stat label="Anonyme Sessions 7 Tage" value={stats.uniqueSessions} />
          <Stat label="Flags" value={stats.flagged.length} />
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-black uppercase tracking-wide">Kündigungsfeedback</h2>
            <p className="text-sm text-gray-500">
              Gründe und Kommentare aus dem Kündigungsdialog. Nutzt den Datumsfilter, aber ignoriert User-/Aktivitätsfilter.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            <Stat label="Kündigungen" value={cancellationStats.total} />
            <Stat label="Mit Kommentar" value={cancellationStats.withComment} />
            <Stat label="Kommentarquote" value={`${pct(cancellationStats.withComment, cancellationStats.total)}%`} />
            <Stat label="CHF 66 angenommen" value={cancellationStats.retentionAccepted} />
            <Stat label="Angebot abgelehnt" value={cancellationStats.retentionDeclined} />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wide text-gray-500">Gründe</h3>
              {cancellationStats.byReason.map(reason => (
                <div key={reason.reason} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-bold text-gray-800">{reason.label}</span>
                    <span className="text-xs font-bold text-gray-500">{reason.count} · {pct(reason.count, cancellationStats.total)}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct(reason.count, cancellationStats.total)}%` }} />
                  </div>
                  {reason.comments > 0 && (
                    <p className="mt-2 text-xs text-gray-500">{reason.comments} mit Kommentar</p>
                  )}
                </div>
              ))}
              {cancellationStats.byReason.length === 0 && (
                <p className="text-sm text-gray-500">Noch kein Kündigungsfeedback im Zeitraum.</p>
              )}
            </div>

            <div className="max-h-[360px] overflow-auto">
              <h3 className="sticky top-0 mb-2 bg-white pb-2 text-xs font-black uppercase tracking-wide text-gray-500">Aktuelle Kündigungen</h3>
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="sticky top-7 bg-white text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-2">Zeit</th>
                    <th>User</th>
                    <th>Grund</th>
                    <th>Kommentar</th>
                  </tr>
                </thead>
                <tbody>
                  {cancellationStats.recent.map((event, index) => (
                    <tr key={`${event.created_at}-${index}`} className="border-t border-gray-100">
                      <td className="whitespace-nowrap py-2">{dateTimeLabel(event.created_at)}</td>
                      <td className="max-w-[190px] truncate font-semibold">{event.email ?? event.user_id ?? "-"}</td>
                      <td>{CANCELLATION_REASON_LABELS[cancellationReasonFromEvent(event)]}</td>
                      <td className="max-w-[300px] truncate text-gray-500">{cancellationCommentFromEvent(event) || "-"}</td>
                    </tr>
                  ))}
                  {cancellationStats.recent.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-gray-500">Keine Kündigungen im Zeitraum.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-black uppercase tracking-wide">Ads A/B Test</h2>
            <p className="text-sm text-gray-500">
              Control gegen 7-Tage-Trial auf den Ads-LPs. Neue Events werden pro Experiment-Besucher gezählt und bis zur Stripe-Zahlung verbunden.
            </p>
            {adsAbStats.unattributedConversions > 0 && (
              <p className="text-xs font-semibold text-amber-700">
                {adsAbStats.unattributedConversions} ältere Checkout-/Stripe-Events ohne belastbare Variante sind aus dem Variantenvergleich ausgeschlossen.
              </p>
            )}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {(["control", "trial"] as AdsVariant[]).map(variant => {
              const item = adsAbStats.variants[variant];
              return (
                <div key={variant} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-black text-gray-950">{item.label}</h3>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-600">
                      {variant === "trial" ? "7 Tage Premium" : "20 Aufgaben gratis"}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <Stat label="Besucher" value={item.assignments} />
                    <Stat label="CTA Nutzer" value={item.ctaVisitors} />
                    <Stat label="CTA-Rate" value={`${pct(item.ctaVisitors, item.assignments)}%`} />
                    <Stat label="Checkout" value={item.checkouts} />
                    <Stat label="Trials" value={item.trialStarts} />
                    <Stat label="Bezahlt" value={item.subscriptions} />
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-3">
                    <div><span className="font-bold text-gray-950">{item.freeClicks}</span> Free-Klicks</div>
                    <div><span className="font-bold text-gray-950">{item.paidClicks}</span> Paid-Klicks</div>
                    <div><span className="font-bold text-gray-950">{item.ctaClicks}</span> CTA-Klicks total</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 overflow-x-auto">
            <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-gray-500">Nach Landingpage</h3>
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-2">Variante</th>
                  <th>Landingpage</th>
                  <th>Zuweisungen</th>
                  <th>CTA Nutzer</th>
                  <th>CTA Klicks</th>
                  <th>Free</th>
                  <th>Paid</th>
                  <th>Checkout</th>
                  <th>CTA-Rate</th>
                </tr>
              </thead>
              <tbody>
                {(["control", "trial"] as AdsVariant[]).flatMap(variant => {
                  const item = adsAbStats.variants[variant];
                  return [...item.pages.values()]
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map(page => (
                      <tr key={`${variant}-${page.pageKey}`} className="border-t border-gray-100">
                        <td className="py-2 font-bold">{item.label}</td>
                        <td>{page.label}</td>
                        <td>{page.assignments}</td>
                        <td>{page.ctaVisitors}</td>
                        <td>{page.ctaClicks}</td>
                        <td>{page.freeClicks}</td>
                        <td>{page.paidClicks}</td>
                        <td>{page.checkouts}</td>
                        <td>{pct(page.ctaVisitors, page.assignments)}%</td>
                      </tr>
                    ));
                })}
                {adsAbStats.variants.control.pages.size + adsAbStats.variants.trial.pages.size === 0 && (
                  <tr>
                    <td colSpan={9} className="py-4 text-gray-500">Noch keine A/B-Test-Events im Zeitraum.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 max-h-[360px] overflow-auto">
            <h3 className="sticky top-0 mb-2 bg-white pb-2 text-xs font-black uppercase tracking-wide text-gray-500">Aktuelle A/B Events</h3>
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="sticky top-7 bg-white text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-2">Zeit</th>
                  <th>Variante</th>
                  <th>Event</th>
                  <th>Landingpage</th>
                  <th>User</th>
                  <th>Kontext</th>
                </tr>
              </thead>
              <tbody>
                {adsAbStats.recent.map((event, index) => {
                  const variant = inferAdsVariant(event);
                  const pageKey = normaliseAdsPage(event.metadata?.page, event.source, event.path);
                  return (
                    <tr key={`${event.created_at}-${index}`} className="border-t border-gray-100">
                      <td className="whitespace-nowrap py-2">{dateTimeLabel(event.created_at)}</td>
                      <td className="font-bold">{variant ? (variant === "trial" ? "Trial" : "Control") : "-"}</td>
                      <td>{activityLabel(event.activity_type)}</td>
                      <td>{ADS_AB_PAGES[pageKey] ?? pageKey}</td>
                      <td className="max-w-[190px] truncate">{event.email ?? event.user_id ?? "-"}</td>
                      <td className="max-w-[280px] truncate text-gray-500">{[event.source, metadataLabel(event.metadata)].filter(Boolean).join(" · ")}</td>
                    </tr>
                  );
                })}
                {adsAbStats.recent.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-4 text-gray-500">Noch keine A/B-Test-Events im Zeitraum.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-black uppercase tracking-wide">Organic Funnel</h2>
            <p className="text-sm text-gray-500">
              First-Touch Organic Search nach ursprünglicher Landingpage. Gezählt werden nur eindeutig attribuierte Events im Zeitraum.
            </p>
            <p className="text-xs font-semibold text-gray-500">
              Besucher und Sessions bleiben in GA4; diese Ansicht beginnt bewusst bei attribuierten Signups. Standard: letzte 30 Tage.
            </p>
          </div>

          <form className="mt-4 grid gap-3 sm:max-w-xl sm:grid-cols-[1fr_1fr_auto]" action="/internal-log-dashboard">
            <input
              type="date"
              name="from"
              defaultValue={activityFilters.from}
              aria-label="Organic Funnel von"
              className="min-h-11 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-600"
            />
            <input
              type="date"
              name="to"
              defaultValue={activityFilters.to}
              aria-label="Organic Funnel bis"
              className="min-h-11 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-600"
            />
            <button className="min-h-11 rounded-md bg-gray-950 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800">
              Zeitraum
            </button>
          </form>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <Stat label="Signups" value={organicFunnel.totals.signups} />
            <Stat label="Checkouts" value={organicFunnel.totals.checkouts} />
            <Stat label="Trials" value={organicFunnel.totals.trials} />
            <Stat label="Bezahlt" value={organicFunnel.totals.paid} />
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-2">Erste Landingpage</th>
                  <th>Signups</th>
                  <th>Checkouts</th>
                  <th>Trials</th>
                  <th>Bezahlt</th>
                </tr>
              </thead>
              <tbody>
                {organicFunnel.byLandingPage.map(row => (
                  <tr key={row.landingPage} className="border-t border-gray-100">
                    <td className="max-w-[420px] truncate py-2 font-semibold" title={row.landingPage}>{row.landingPage}</td>
                    <td>{row.signups}</td>
                    <td>{row.checkouts}</td>
                    <td>{row.trials}</td>
                    <td>{row.paid}</td>
                  </tr>
                ))}
                {organicFunnel.byLandingPage.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-gray-500">Noch keine eindeutig attribuierten Organic-Conversions im Zeitraum.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-black uppercase tracking-wide">User Activity</h2>
            <p className="text-sm text-gray-500">Login, Passwort, Abo und eingeloggte Übungsaktivität. Standard: letzte 30 Tage.</p>
          </div>

          <form className="mt-4 grid gap-3 md:grid-cols-[1fr_220px_170px_170px_auto]" action="/internal-log-dashboard">
            <input
              name="user"
              defaultValue={activityFilters.user}
              placeholder="User / E-Mail"
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-600"
            />
            <select
              name="activity"
              defaultValue={activityFilters.activity}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-600"
            >
              <option value="all">Alle Aktivitäten</option>
              {ACTIVITY_TYPES.map(type => (
                <option key={type} value={type}>{activityLabel(type)}</option>
              ))}
            </select>
            <input
              name="from"
              type="date"
              defaultValue={activityFilters.from}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-600"
            />
            <input
              name="to"
              type="date"
              defaultValue={activityFilters.to}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-600"
            />
            <button className="rounded-md bg-gray-950 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800">
              Filtern
            </button>
          </form>

          <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-x-auto">
              <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-gray-500">Letzte Aktivität pro User</h3>
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-2">User</th>
                    <th>Status</th>
                    <th>Letzte Aktivität</th>
                    <th>Zeit</th>
                    <th>Übungen</th>
                    <th>Auth</th>
                    <th>Abo</th>
                  </tr>
                </thead>
                <tbody>
                  {activitySummaries.map(user => (
                    <tr key={user.key} className="border-t border-gray-100">
                      <td className="max-w-[220px] truncate py-2 font-semibold">{user.label}</td>
                      <td><AccessBadge label={user.accessLabel} tone={user.accessTone} /></td>
                      <td>{activityLabel(user.lastActivityType)}</td>
                      <td className="whitespace-nowrap">{dateTimeLabel(user.lastActivity)}</td>
                      <td>{user.exercises7d}</td>
                      <td>{user.authEvents}</td>
                      <td>{user.subscriptionEvents}</td>
                    </tr>
                  ))}
                  {activitySummaries.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-4 text-gray-500">Keine User-Aktivität für diese Filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="max-h-[520px] overflow-auto">
              <h3 className="sticky top-0 mb-2 bg-white pb-2 text-xs font-black uppercase tracking-wide text-gray-500">Timeline</h3>
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="sticky top-7 bg-white text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-2">Zeit</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Aktivität</th>
                    <th>Übung</th>
                    <th>Kontext</th>
                  </tr>
                </thead>
                <tbody>
                  {activityEvents.map((event, index) => {
                    const access = eventAccess(event);
                    return (
                      <tr key={`${event.created_at}-${index}`} className="border-t border-gray-100">
                        <td className="whitespace-nowrap py-2">{dateTimeLabel(event.created_at)}</td>
                        <td className="max-w-[190px] truncate font-semibold">{event.email ?? event.user_id ?? "-"}</td>
                        <td><AccessBadge label={access.label} tone={access.tone} /></td>
                        <td>{activityLabel(event.activity_type)}</td>
                        <td className="max-w-[150px] truncate">{event.exercise_id ?? "-"}</td>
                        <td className="max-w-[260px] truncate text-gray-500">
                          {[event.path, event.topic_id, metadataLabel(event.metadata)].filter(value => value && value !== "-").join(" · ") || "-"}
                        </td>
                      </tr>
                    );
                  })}
                  {activityEvents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-gray-500">Keine Timeline-Events.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-black uppercase tracking-wide">Anonymer Übungs-Mix</h2>
            <div className="mt-4 space-y-3">
              {Object.entries(stats.byEvent).sort((a, b) => b[1] - a[1]).map(([event, count]) => (
                <Bar key={event} label={event} value={count} max={maxEvent} />
              ))}
              {Object.keys(stats.byEvent).length === 0 && <p className="text-sm text-gray-500">Noch keine Events.</p>}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-black uppercase tracking-wide">Geflaggte Übungen</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-2">Übung</th>
                    <th>Fach</th>
                    <th>Kl.</th>
                    <th>Topic</th>
                    <th>Falsch</th>
                    <th>Fertig</th>
                    <th>Hints</th>
                    <th>Zuletzt</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.flagged.map(item => (
                    <tr key={item.key} className="border-t border-gray-100">
                      <td className="max-w-[220px] truncate py-2 font-semibold">{item.exerciseId}</td>
                      <td>{item.subject}</td>
                      <td>{item.grade ?? "-"}</td>
                      <td className="max-w-[160px] truncate">{item.topicId}</td>
                      <td className="font-bold text-red-600">{item.wrong}</td>
                      <td>{item.completed}/{item.started}</td>
                      <td>{item.hints}</td>
                      <td>{timeLabel(item.lastSeen)}</td>
                    </tr>
                  ))}
                  {stats.flagged.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-4 text-gray-500">Keine auffälligen Übungen.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-black uppercase tracking-wide">Top Falschantworten</h2>
            <div className="mt-4 space-y-3">
              {stats.topWrong.map(item => (
                <Bar key={item.key} label={`${item.subject} · ${item.exerciseId}`} value={item.wrong} max={Math.max(1, stats.topWrong[0]?.wrong ?? 1)} />
              ))}
              {stats.topWrong.length === 0 && <p className="text-sm text-gray-500">Noch keine Falschantworten.</p>}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-black uppercase tracking-wide">Anonyme Übungs-Events</h2>
            <p className="mt-1 text-xs text-gray-500">Diese Rohdaten kommen aus Browser-Telemetrie und sind nicht zwingend einem Account zugeordnet.</p>
            <div className="mt-4 max-h-[420px] overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-white text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-2">Zeit</th>
                    <th>Event</th>
                    <th>Übung</th>
                    <th>Pfad</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((event, index) => (
                    <tr key={`${event.created_at}-${index}`} className="border-t border-gray-100">
                      <td className="whitespace-nowrap py-2">{timeLabel(event.created_at)}</td>
                      <td className="font-semibold">{event.event_name}</td>
                      <td className="max-w-[180px] truncate">{event.exercise_id ?? "-"}</td>
                      <td className="max-w-[220px] truncate text-gray-500">{event.path ?? "-"}</td>
                    </tr>
                  ))}
                  {stats.recent.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-gray-500">Noch keine Events.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
