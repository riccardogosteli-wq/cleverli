"use client";
/**
 * Family Leaderboard — up to 3 child profiles, ranked by XP this week.
 * Also allows adding/switching profiles (no server auth — local only for now).
 */
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import {
  loadFamily, addMember, removeMember, loadMemberProfile,
  AVATARS, GRADE_OPTIONS, MAX_PROFILES, FamilyMember,
} from "@/lib/family";
import { getLevelForXp } from "@/lib/xp";

interface MemberStat extends FamilyMember {
  xp: number;
  weeklyXp: number;
  streak: number;
  achievements: number;
  level: string;
  levelEmoji: string;
}

const RANK_COLORS = [
  "from-yellow-50 to-amber-100 border-amber-400",   // 🥇
  "from-gray-50 to-gray-100 border-gray-300",        // 🥈
  "from-orange-50 to-orange-100 border-orange-300",  // 🥉
];
const RANK_MEDALS = ["🥇", "🥈", "🥉"];

export default function FamilyPage() {
  const { lang } = useLang();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [stats, setStats] = useState<MemberStat[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState(AVATARS[0]);
  const [newGrade, setNewGrade] = useState(1);
  const [addError, setAddError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState<string | null>(null);
  const [resetInput, setResetInput] = useState("");

  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  const refresh = useCallback(() => {
    const { members: m } = loadFamily();
    setMembers(m);

    const s: MemberStat[] = m.map(member => {
      const profile = loadMemberProfile(member.id);
      const level = getLevelForXp(profile?.xp ?? 0);
      return {
        ...member,
        xp: profile?.xp ?? 0,
        weeklyXp: profile?.weeklyXp ?? 0,
        streak: profile?.dailyStreak ?? 0,
        achievements: profile?.achievements?.length ?? 0,
        level: lang === "fr" ? level.titleFr : lang === "it" ? level.titleIt : lang === "en" ? level.titleEn : level.title,
        levelEmoji: level.emoji,
      };
    }).sort((a, b) => b.weeklyXp - a.weeklyXp || b.xp - a.xp);

    setStats(s);
  }, [lang]);

  useEffect(() => { refresh(); }, [refresh]);

  function handleAdd() {
    if (!newName.trim()) { setAddError(t("Bitte einen Namen eingeben.", "Entre un prénom.", "Inserisci un nome.", "Please enter a name.")); return; }
    if (members.length >= MAX_PROFILES) { setAddError(t("Maximal 3 Profile.", "Maximum 3 profils.", "Massimo 3 profili.", "Max 3 profiles.")); return; }
    addMember(newName.trim(), newAvatar, newGrade);
    setNewName(""); setNewAvatar(AVATARS[0]); setNewGrade(1); setAddError(""); setShowAdd(false);
    refresh();
  }

  function handleDelete(id: string) {
    removeMember(id);
    setConfirmDelete(null);
    refresh();
  }

  function handleReset(id: string) {
    // Clear profile stats (XP, streak, achievements) — keeps family member entry intact
    localStorage.removeItem(`cleverli_profile_${id}`);
    setConfirmReset(null);
    setResetInput("");
    refresh();
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-6 pb-24 sm:pb-12 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Image src="/cleverli-jump-star.png" alt="Cleverli" width={60} height={60} className="drop-shadow-md" />
        <div>
          <h1 className="text-xl font-black text-gray-800">
            {t("Familien-Rangliste 🏆", "Classement familial 🏆", "Classifica famiglia 🏆", "Family Leaderboard 🏆")}
          </h1>
          <p className="text-xs text-gray-400">{t("Diese Woche","Cette semaine","Questa settimana","This week")} · {t("Bis zu 3 Kinder","Jusqu'à 3 enfants","Fino a 3 bambini","Up to 3 children")}</p>
        </div>
      </div>

      {/* Leaderboard */}
      {stats.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm space-y-3">
          <div className="text-5xl">👨‍👩‍👧‍👦</div>
          <p className="text-gray-500 text-sm">
            {t("Noch keine Profile. Füge bis zu 3 Kinder hinzu!", "Pas encore de profils. Ajoute jusqu'à 3 enfants !", "Nessun profilo. Aggiungi fino a 3 bambini!", "No profiles yet. Add up to 3 children!")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {stats.map((s, i) => (
            <div key={s.id}
              className={`bg-gradient-to-r ${RANK_COLORS[i] ?? "from-white to-gray-50 border-gray-200"} border-2 rounded-2xl px-4 py-3 flex items-center gap-3`}>
              <div className="text-3xl shrink-0">{RANK_MEDALS[i] ?? "🎖️"}</div>
              <div className="text-3xl shrink-0">{s.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-gray-800">{s.name}</div>
                <div className="text-xs text-gray-500">
                  {s.levelEmoji} {s.level} · {s.grade}. {t("Klasse","Année","Classe","Grade")}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="text-xs font-bold text-green-600">⚡ {s.weeklyXp} {t("XP diese Woche","XP cette semaine","XP questa settimana","XP this week")}</div>
                  {s.streak >= 2 && <div className="text-xs text-orange-500 font-bold">🔥{s.streak}</div>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-black text-gray-700">{s.xp} XP</div>
                <div className="text-[10px] text-gray-400">{s.achievements} 🏆</div>
                <button
                  onClick={() => { setConfirmReset(s.id); setResetInput(""); }}
                  className="text-[10px] text-orange-300 hover:text-orange-500 mt-1 block"
                >
                  {t("Zurücksetzen","Réinitialiser","Reimposta","Reset")}
                </button>
                <button
                  onClick={() => setConfirmDelete(s.id)}
                  className="text-[10px] text-red-300 hover:text-red-500 mt-0.5 block"
                >
                  {t("Entfernen","Supprimer","Rimuovi","Remove")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add profile */}
      {members.length < MAX_PROFILES && !showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full border-2 border-dashed border-green-300 text-green-600 rounded-2xl py-4 font-bold text-sm hover:bg-green-50 active:scale-95 transition-all"
        >
          + {t("Kind hinzufügen","Ajouter un enfant","Aggiungi un bambino","Add a child")} ({members.length}/{MAX_PROFILES})
        </button>
      )}

      {/* Add form */}
      {showAdd && (
        <div className="bg-white border-2 border-green-200 rounded-2xl p-4 space-y-4 shadow-sm">
          <h2 className="font-bold text-gray-700">{t("Neues Profil","Nouveau profil","Nuovo profilo","New profile")}</h2>

          {/* Name */}
          <div>
            <label className="text-xs text-gray-500 font-semibold">{t("Name","Prénom","Nome","Name")}</label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder={t("z.B. Emma","ex. Emma","es. Emma","e.g. Emma")}
              className="w-full mt-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-base outline-none focus:border-green-400"
              style={{ fontSize: 16 }}
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="text-xs text-gray-500 font-semibold">{t("Avatar","Avatar","Avatar","Avatar")}</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {AVATARS.map(a => (
                <button
                  key={a}
                  onClick={() => setNewAvatar(a)}
                  className={`text-2xl w-10 h-10 rounded-xl transition-all ${newAvatar === a ? "bg-green-100 ring-2 ring-green-500 scale-110" : "bg-gray-50 hover:bg-gray-100"}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Grade */}
          <div>
            <label className="text-xs text-gray-500 font-semibold">{t("Klasse","Année","Classe","Grade")}</label>
            <div className="flex gap-2 mt-1">
              {GRADE_OPTIONS.map(g => (
                <button
                  key={g}
                  onClick={() => setNewGrade(g)}
                  className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${newGrade === g ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  {g}. {t("Kl.","Année","Cl.","Gr.")}
                </button>
              ))}
            </div>
          </div>

          {addError && <p className="text-xs text-red-500">{addError}</p>}

          <div className="flex gap-2">
            <button onClick={() => { setShowAdd(false); setAddError(""); }}
              className="flex-1 border-2 border-gray-200 text-gray-600 py-2 rounded-xl font-semibold text-sm active:scale-95">
              {t("Abbrechen","Annuler","Annulla","Cancel")}
            </button>
            <button onClick={handleAdd}
              className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold text-sm hover:bg-green-700 active:scale-95">
              {t("Hinzufügen","Ajouter","Aggiungi","Add")}
            </button>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 p-4"
          onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
            <p className="font-bold text-gray-800">
              {t("Profil wirklich löschen?","Supprimer ce profil ?","Eliminare questo profilo?","Delete this profile?")}
            </p>
            <p className="text-xs text-gray-400">
              {t("Alle Fortschritte dieses Profils gehen verloren.",
                "Tous les progrès seront perdus.",
                "Tutti i progressi andranno persi.",
                "All progress for this profile will be lost.")}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 border-2 border-gray-200 text-gray-600 py-2 rounded-xl font-semibold text-sm">
                {t("Abbrechen","Annuler","Annulla","Cancel")}
              </button>
              <button onClick={() => handleDelete(confirmDelete)}
                className="flex-1 bg-red-500 text-white py-2 rounded-xl font-bold text-sm">
                {t("Löschen","Supprimer","Elimina","Delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm reset */}
      {confirmReset && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 p-4"
          onClick={() => { setConfirmReset(null); setResetInput(""); }}>
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
            <div className="text-center text-3xl">⚠️</div>
            <p className="font-bold text-gray-800 text-center">
              {t("Lernfortschritt wirklich zurücksetzen?",
                "Réinitialiser la progression ?",
                "Reimpostare i progressi?",
                "Really reset progress?")}
            </p>
            <p className="text-xs text-gray-500 text-center">
              {t(
                "XP, Streak und Auszeichnungen dieses Profils werden gelöscht. Das Profil selbst bleibt erhalten.",
                "Les XP, la série et les trophées seront effacés. Le profil reste.",
                "XP, serie e trofei verranno eliminati. Il profilo rimane.",
                "XP, streak and achievements will be cleared. The profile stays."
              )}
            </p>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                {t('Tippe "reset" zum Bestätigen', 'Tape "reset" pour confirmer', 'Scrivi "reset" per confermare', 'Type "reset" to confirm')}
              </label>
              <input
                type="text"
                value={resetInput}
                onChange={e => setResetInput(e.target.value)}
                placeholder="reset"
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-base outline-none focus:border-orange-400"
                style={{ fontSize: 16 }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setConfirmReset(null); setResetInput(""); }}
                className="flex-1 border-2 border-gray-200 text-gray-600 py-2 rounded-xl font-semibold text-sm"
              >
                {t("Abbrechen","Annuler","Annulla","Cancel")}
              </button>
              <button
                onClick={() => confirmReset && handleReset(confirmReset)}
                disabled={resetInput.toLowerCase() !== "reset"}
                className="flex-1 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
              >
                {t("Zurücksetzen","Réinitialiser","Reimposta","Reset")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-xs text-blue-600">
        💡 {t(
          "Mit einem Premium-Abo kannst du bis zu 3 Kinder-Profile verwalten und ihren Lernfortschritt verfolgen.",
          "Avec un abonnement Premium, tu peux gérer jusqu'à 3 profils enfants.",
          "Con un abbonamento Premium puoi gestire fino a 3 profili bambini.",
          "With a Premium subscription you can manage up to 3 child profiles."
        )}
      </div>

      <div className="flex gap-2">
        <Link href="/parents" className="flex-1 text-center border-2 border-gray-200 text-gray-600 py-3 rounded-full font-semibold text-sm active:scale-95">
          📊 {t("Eltern-Übersicht","Vue parents","Vista genitori","Parent view")}
        </Link>
        <Link href="/dashboard" className="flex-1 text-center bg-green-600 text-white py-3 rounded-full font-bold text-sm hover:bg-green-700 active:scale-95">
          🎒 {t("Üben","Pratiquer","Esercitati","Practice")}
        </Link>
      </div>
    </main>
  );
}
