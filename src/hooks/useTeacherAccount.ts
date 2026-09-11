"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { teacherAccountActive, type TeacherAccount } from "@/lib/teacherAccount";

// Never hydrate elevated access from editable localStorage or signup metadata.
export function useTeacherAccount() {
  const [account, setAccount] = useState<TeacherAccount | null>(null);
  const [checked, setChecked] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const db = getSupabase();
    let disposed = false, generation = 0;
    const refresh = async () => {
      const attempt = ++generation;
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        if (!db) throw Error('unavailable');
        const timeout = new Promise<never>((_, reject) => { timer = setTimeout(() => reject(Error('timeout')), 5000); });
        const { data: { session } } = await Promise.race([db.auth.getSession(), timeout]);
        if (!session) throw Error('signed_out');
        const { data, error } = await Promise.race([db.from('teacher_accounts').select('user_id,school_name,active,valid_until').eq('user_id', session.user.id).maybeSingle(), timeout]);
        if (error) throw error;
        if (!disposed && attempt === generation) { setAccount(data); setNow(Date.now()); setChecked(true); }
      } catch {
        if (!disposed && attempt === generation) { setAccount(null); setChecked(true); }
      } finally { clearTimeout(timer); }
    };
    void refresh();
    const subscription = db?.auth.onAuthStateChange(() => {
      ++generation; setAccount(null); setChecked(false);
      // Supabase auth callbacks must not await another auth operation.
      queueMicrotask(() => { if (!disposed) void refresh(); });
    }).data.subscription;
    const visible = () => { if (document.visibilityState === 'visible') void refresh(); };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', visible);
    const timer = window.setInterval(() => { setNow(Date.now()); if (document.visibilityState === 'visible') void refresh(); }, 60_000);
    return () => { disposed = true; ++generation; subscription?.unsubscribe(); window.clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', visible); };
  }, []);
  return { isTeacher: teacherAccountActive(account, now), teacherAccount: account, teacherChecked: checked };
}
