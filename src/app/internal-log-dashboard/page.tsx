import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { INTERNAL_LOG_COOKIE, verifyInternalSession } from "@/lib/internalDashboardAuth";

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

function subjectLabel(subject: string | null) {
  if (!subject) return "-";
  if (subject === "math") return "Mathe";
  if (subject === "german") return "Deutsch";
  if (subject === "nmg") return "NMG";
  return subject;
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
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const authed = verifyInternalSession(cookieStore.get(INTERNAL_LOG_COOKIE)?.value);
  const params = await searchParams;

  if (!authed) {
    return <LoginForm hasError={params.error === "1"} />;
  }

  const events = await loadEvents();
  const stats = buildStats(events);
  const maxEvent = Math.max(1, ...Object.values(stats.byEvent));

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 text-gray-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-700">Cleverli intern</p>
            <h1 className="text-3xl font-black">Log Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Private Übungs- und Fehlerindikatoren der letzten 7 Tage.</p>
          </div>
          <form action="/api/internal/log-dashboard/logout" method="post">
            <button className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">
              Logout
            </button>
          </form>
        </header>

        <section className="grid gap-3 sm:grid-cols-4">
          <Stat label="Events 24h" value={stats.total24h} />
          <Stat label="Events 7 Tage" value={stats.total7d} />
          <Stat label="Sessions 7 Tage" value={stats.uniqueSessions} />
          <Stat label="Flags" value={stats.flagged.length} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-black uppercase tracking-wide">Event Mix</h2>
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
            <h2 className="text-sm font-black uppercase tracking-wide">Letzte Events</h2>
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
