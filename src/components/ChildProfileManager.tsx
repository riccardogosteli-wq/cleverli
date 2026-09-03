"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/lib/LangContext";
import {
  FamilyMember, loadFamily, saveFamily, addMember, removeMember,
  getActiveProfileId, setActiveProfileId, updateMemberCurriculum, AVATARS, MAX_PROFILES,
} from "@/lib/family";
import {
  createChildInSupabase,
  deleteChildFromSupabase,
  restoreCurrentChildProgressFromSupabase,
  updateChildInSupabase,
} from "@/lib/progressSync";
import CurriculumSelector from "@/components/CurriculumSelector";
import { CANTON_NAMES, type CurriculumSelection } from "@/lib/curriculumProfiles";
import { getCurriculumRolloutContext, isCurriculumProfilesRolloutEnabled } from "@/lib/curriculumRollout";
import { getAnonymousSessionId } from "@/lib/attribution";
import { captureProductEvent } from "@/lib/monitoring";
import { trackUserActivity } from "@/lib/userActivityClient";
import { getActiveProfileStorageKey, getLastGradeStorageKey } from "@/lib/accountScopedStorage";

function AvatarPicker({ value, onChange, labelId }: { value: string; onChange: (a: string) => void; labelId: string }) {
  return (
    <div className="grid grid-cols-6 gap-2" role="group" aria-labelledby={labelId}>
      {AVATARS.map(a => (
        <button key={a} type="button" onClick={() => onChange(a)}
          aria-label={`Avatar ${a}`}
          aria-pressed={value === a}
          className={`text-2xl w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
            value === a ? "bg-green-100 ring-2 ring-green-500 scale-110" : "bg-gray-50 hover:bg-green-50"
          }`}>
          {a}
        </button>
      ))}
    </div>
  );
}

function AddChildForm({
  onSave,
  onCancel,
  curriculumEnabled,
}: {
  onSave: () => void;
  onCancel: () => void;
  curriculumEnabled: boolean;
}) {
  const { tr } = useLang();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [grade, setGrade] = useState<number>(1);
  const [curriculum, setCurriculum] = useState<CurriculumSelection | undefined>();
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name.trim()) { setError(tr("errorEmailPw") ?? "Bitte gib einen Namen ein."); return; }
    try {
      const member = addMember(name.trim(), avatar, grade, curriculum);
      setActiveProfileId(member.id);
      createChildInSupabase(member.id, member.name, member.grade, member.avatar, member.curriculum);
      if (curriculum) {
        const source = "child_created";
        captureProductEvent("curriculum_profile_selected", {
          canton: curriculum.canton,
          school_language: curriculum.schoolLanguage,
          curriculum_system: curriculum.curriculumSystem,
          source,
        });
        void trackUserActivity("curriculum_profile_selected", {
          source,
          grade,
          metadata: {
            child_id: member.id,
            canton: curriculum.canton,
            school_language: curriculum.schoolLanguage,
            curriculum_system: curriculum.curriculumSystem,
            regional_profile: curriculum.regionalProfile ?? null,
            curriculum_profile_version: curriculum.version,
          },
        });
      }
      onSave();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Fehler");
    }
  };

  return (
    <div className="bg-white border-2 border-green-300 rounded-2xl p-5 space-y-4">
      <h3 className="font-bold text-gray-800 text-base">👶 {tr("addChildTitle")}</h3>

      {/* Avatar */}
      <div>
        <div id="parents-add-child-avatar-label" className="text-xs font-medium text-gray-500 mb-2">{tr("chooseAvatar")}</div>
        <AvatarPicker value={avatar} onChange={setAvatar} labelId="parents-add-child-avatar-label" />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="parents-add-child-name" className="text-xs font-medium text-gray-500 mb-1">Name</label>
        <input
          id="parents-add-child-name"
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder={tr("childNamePlaceholder") ?? "z.B. Lena"}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-green-400"
          maxLength={30}
        />
      </div>

      {/* Grade */}
      <div>
        <div id="parents-add-child-grade-label" className="text-xs font-medium text-gray-500 mb-2">{tr("classLabel")}</div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" role="group" aria-labelledby="parents-add-child-grade-label">
          {[1,2,3,4,5,6].map(g => (
            <button key={g} type="button" onClick={() => setGrade(g)}
              aria-label={`${g}. ${tr("classLabel")}`}
              aria-pressed={grade === g}
              className={`min-h-11 min-w-11 px-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                grade === g
                  ? "border-green-700 bg-green-700 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
              }`}>
              {g}. {tr("gradeLabel")}
            </button>
          ))}
        </div>
      </div>

      {curriculumEnabled && (
        <CurriculumSelector value={curriculum} onChange={setCurriculum} />
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-2">
        <button onClick={handleSave}
          className="flex-1 bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-700 active:scale-95 transition-all text-sm">
          {tr("saveBtn")}
        </button>
        <button onClick={onCancel}
          className="flex-1 border-2 border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:border-gray-300 active:scale-95 transition-all text-sm">
          {tr("cancelBtn")}
        </button>
      </div>
    </div>
  );
}

function ChildCard({ member, isActive, onSwitch, onDelete, onGradeChange, onCurriculumChange, curriculumEnabled }: {
  member: FamilyMember;
  isActive: boolean;
  onSwitch: () => void;
  onDelete: () => void;
  onGradeChange: (newGrade: number) => void;
  onCurriculumChange: (selection: CurriculumSelection) => void;
  curriculumEnabled: boolean;
}) {
  const { tr, lang } = useLang();
  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingGrade, setEditingGrade] = useState(false);
  const [editingCurriculum, setEditingCurriculum] = useState(false);
  const [curriculumDraft, setCurriculumDraft] = useState<CurriculumSelection | undefined>(member.curriculum);

  return (
    <div className={`rounded-2xl border-2 p-4 transition-all ${
      isActive ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
    }`}>
      <div className="flex items-center gap-3">
        <div className="text-3xl w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
          {member.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-800 text-sm leading-tight truncate" title={member.name}>{member.name}</div>
          <div className="text-xs text-gray-400">{member.grade}. {tr("gradeLabel")}</div>
          {member.curriculum && (
            <div className="text-xs text-gray-500 mt-0.5">
              🏫 {CANTON_NAMES[member.curriculum.canton]} · {member.curriculum.schoolLanguage.toUpperCase()}
            </div>
          )}
          {isActive && <div className="text-xs text-green-700 font-semibold mt-0.5">✓ Aktiv</div>}
        </div>
        <div className="flex gap-2 shrink-0">
          {!isActive && (
            <button onClick={onSwitch}
              className="text-xs bg-green-700 text-white px-3 py-2 rounded-lg font-semibold hover:bg-green-700 active:scale-95 transition-all min-h-[44px]">
              Wechseln
            </button>
          )}
          {/* ✅ Edit grade button */}
          {!editingGrade && !confirmDelete && (
            <button onClick={() => setEditingGrade(true)}
              aria-label={t(`${member.name}: Klasse ändern`, `${member.name}: changer de classe`, `${member.name}: cambia classe`, `${member.name}: change grade`)}
              title={t("Klasse ändern", "Changer de classe", "Cambia classe", "Change grade")}
              className="text-xs text-blue-500 hover:text-blue-700 min-h-11 min-w-11 rounded-lg transition-colors border border-blue-200 hover:border-blue-400 bg-blue-50">
              ✏️
            </button>
          )}
          {!confirmDelete && !editingGrade ? (
            <button onClick={() => setConfirmDelete(true)}
              aria-label={t(`${member.name}: Profil löschen`, `${member.name}: supprimer le profil`, `${member.name}: elimina profilo`, `${member.name}: delete profile`)}
              title={t("Profil löschen", "Supprimer le profil", "Elimina profilo", "Delete profile")}
              className="text-xs text-gray-400 hover:text-red-500 min-h-11 min-w-11 rounded-lg transition-colors">
              🗑️
            </button>
          ) : !editingGrade ? (
            <div className="flex gap-1">
              <button onClick={onDelete}
                className="min-h-11 text-xs bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600">
                {tr("saveBtn") ?? "Ja"}
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="min-h-11 text-xs border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
                {tr("cancelBtn") ?? "Nein"}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* ✅ Inline grade editor */}
      {editingGrade && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 font-medium mb-2">{tr("editGradeBtn")}</div>
          <div className="flex gap-1.5 flex-wrap">
            {[1,2,3,4,5,6].map(g => (
              <button key={g} type="button"
                onClick={() => { onGradeChange(g); setEditingGrade(false); }}
                className={`px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition-all ${
                  member.grade === g
                    ? "border-green-700 bg-green-700 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
                }`}>
                {g}. {tr("gradeLabel")}
              </button>
            ))}
          </div>
          <button onClick={() => setEditingGrade(false)}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline">
            {tr("cancelBtn")}
          </button>
        </div>
      )}

      {curriculumEnabled && !editingGrade && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          {!editingCurriculum ? (
            <button
              type="button"
              onClick={() => {
                setCurriculumDraft(member.curriculum);
                setEditingCurriculum(true);
              }}
              className="inline-flex min-h-11 items-center text-xs font-semibold text-green-700 hover:text-green-800"
            >
              🏫 {member.curriculum
                ? t("Schulkanton ändern", "Changer de canton scolaire", "Cambia cantone scolastico", "Change school canton")
                : t("Schulkanton festlegen", "Définir le canton scolaire", "Imposta cantone scolastico", "Set school canton")}
            </button>
          ) : (
            <div className="space-y-2">
              <CurriculumSelector
                value={curriculumDraft}
                onChange={setCurriculumDraft}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!curriculumDraft}
                  onClick={() => {
                    if (!curriculumDraft) return;
                    onCurriculumChange(curriculumDraft);
                    setEditingCurriculum(false);
                  }}
                  className="min-h-11 flex-1 rounded-xl bg-green-700 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {tr("saveBtn")}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCurriculum(false)}
                  className="min-h-11 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600"
                >
                  {tr("cancelBtn")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ChildProfileManager() {
  const { tr } = useLang();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [curriculumEnabled, setCurriculumEnabled] = useState(false);

  const reload = () => {
    setMembers(loadFamily().members);
    setActiveId(getActiveProfileId());
  };

  useEffect(() => {
    reload();
    setCurriculumEnabled(isCurriculumProfilesRolloutEnabled(getCurriculumRolloutContext(getAnonymousSessionId())));
  }, []);

  const handleSwitch = (id: string) => {
    setActiveProfileId(id);
    reload();
    restoreCurrentChildProgressFromSupabase().catch(() => {});
  };

  const handleDelete = (id: string) => {
    removeMember(id);
    deleteChildFromSupabase(id);
    const remaining = loadFamily().members;
    if (activeId === id) {
      if (remaining.length > 0) setActiveProfileId(remaining[0].id);
      else localStorage.removeItem(getActiveProfileStorageKey());
      window.location.reload();
      return;
    }
    reload();
  };

  const handleGradeChange = (id: string, newGrade: number) => {
    const family = loadFamily();
    const member = family.members.find(m => m.id === id);
    if (!member) return;
    member.grade = newGrade;
    saveFamily(family);
    // Also update last grade if this is the active profile.
    if (id === activeId) {
      localStorage.setItem(getLastGradeStorageKey(), String(newGrade));
    }
    // Fire-and-forget sync to Supabase
    updateChildInSupabase(id, { grade: newGrade });
    reload();
  };

  const handleCurriculumChange = (id: string, curriculum: CurriculumSelection) => {
    const updated = updateMemberCurriculum(id, curriculum);
    if (!updated) return;
    updateChildInSupabase(id, { curriculum });
    captureProductEvent("curriculum_profile_changed", {
      canton: curriculum.canton,
      school_language: curriculum.schoolLanguage,
      curriculum_system: curriculum.curriculumSystem,
    });
    void trackUserActivity("curriculum_profile_changed", {
      source: "child_profile_manager",
      grade: updated.grade,
      metadata: {
        child_id: updated.id,
        canton: curriculum.canton,
        school_language: curriculum.schoolLanguage,
        curriculum_system: curriculum.curriculumSystem,
        regional_profile: curriculum.regionalProfile ?? null,
        curriculum_profile_version: curriculum.version,
      },
    });
    reload();
  };

  const canAdd = members.length < MAX_PROFILES;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">👶 {tr("childProfilesTitle")}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{(tr("maxProfilesMsg") ?? "").replace("{n}", String(MAX_PROFILES))}</p>
        </div>
        {canAdd && !showAdd && (
          <button onClick={() => setShowAdd(true)}
            className="text-sm bg-green-700 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all">
            {tr("addChildBtn")}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {members.length === 0 && !showAdd && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">👶</div>
            <div className="text-sm">{tr("noProfilesMsg")}</div>
            <button onClick={() => setShowAdd(true)}
              className="mt-3 text-sm text-green-700 underline hover:text-green-700">
              {tr("firstChildLink")}
            </button>
          </div>
        )}
        {members.map(m => (
          <ChildCard
            key={m.id}
            member={m}
            isActive={m.id === activeId}
            onSwitch={() => handleSwitch(m.id)}
            onDelete={() => handleDelete(m.id)}
            onGradeChange={(g) => handleGradeChange(m.id, g)}
            onCurriculumChange={(selection) => handleCurriculumChange(m.id, selection)}
            curriculumEnabled={curriculumEnabled}
          />
        ))}
      </div>

      {showAdd && (
        <AddChildForm
          onSave={() => { setShowAdd(false); reload(); }}
          onCancel={() => setShowAdd(false)}
          curriculumEnabled={curriculumEnabled}
        />
      )}

      {!canAdd && !showAdd && (
        <p className="text-xs text-center text-gray-400">{(tr("maxReachedMsg") ?? "").replace("{n}", String(MAX_PROFILES))}</p>
      )}
    </div>
  );
}
