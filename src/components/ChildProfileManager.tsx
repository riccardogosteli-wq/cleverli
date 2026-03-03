"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/lib/LangContext";
import {
  FamilyMember, loadFamily, addMember, removeMember,
  getActiveProfileId, setActiveProfileId, AVATARS, MAX_PROFILES,
} from "@/lib/family";

const GRADE_LABELS = ["1. Klasse", "2. Klasse", "3. Klasse"];

function AvatarPicker({ value, onChange }: { value: string; onChange: (a: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {AVATARS.map(a => (
        <button key={a} type="button" onClick={() => onChange(a)}
          className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            value === a ? "bg-green-100 ring-2 ring-green-500 scale-110" : "bg-gray-50 hover:bg-green-50"
          }`}>
          {a}
        </button>
      ))}
    </div>
  );
}

function AddChildForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [grade, setGrade] = useState<number>(1);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name.trim()) { setError("Bitte gib einen Namen ein."); return; }
    try {
      const member = addMember(name.trim(), avatar, grade);
      setActiveProfileId(member.id);
      onSave();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Fehler");
    }
  };

  return (
    <div className="bg-white border-2 border-green-300 rounded-2xl p-5 space-y-4">
      <h3 className="font-bold text-gray-800 text-base">👶 Kind hinzufügen</h3>

      {/* Avatar */}
      <div>
        <div className="text-xs font-medium text-gray-500 mb-2">Avatar wählen</div>
        <AvatarPicker value={avatar} onChange={setAvatar} />
      </div>

      {/* Name */}
      <div>
        <div className="text-xs font-medium text-gray-500 mb-1">Name</div>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="z.B. Lena"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-green-400"
          maxLength={30}
        />
      </div>

      {/* Grade */}
      <div>
        <div className="text-xs font-medium text-gray-500 mb-2">Klasse</div>
        <div className="flex gap-2">
          {[1, 2, 3].map(g => (
            <button key={g} type="button" onClick={() => setGrade(g)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                grade === g
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
              }`}>
              {g}. Klasse
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-2">
        <button onClick={handleSave}
          className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 active:scale-95 transition-all text-sm">
          ✅ Speichern
        </button>
        <button onClick={onCancel}
          className="flex-1 border-2 border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:border-gray-300 active:scale-95 transition-all text-sm">
          Abbrechen
        </button>
      </div>
    </div>
  );
}

function ChildCard({ member, isActive, onSwitch, onDelete }: {
  member: FamilyMember;
  isActive: boolean;
  onSwitch: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className={`rounded-2xl border-2 p-4 transition-all ${
      isActive ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
    }`}>
      <div className="flex items-center gap-3">
        <div className="text-3xl w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
          {member.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-800 text-sm leading-tight truncate">{member.name}</div>
          <div className="text-xs text-gray-400">{GRADE_LABELS[member.grade - 1]}</div>
          {isActive && <div className="text-xs text-green-600 font-semibold mt-0.5">✓ Aktiv</div>}
        </div>
        <div className="flex gap-2 shrink-0">
          {!isActive && (
            <button onClick={onSwitch}
              className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700 active:scale-95 transition-all">
              Wechseln
            </button>
          )}
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="text-xs text-gray-400 hover:text-red-500 px-2 py-1.5 rounded-lg transition-colors">
              🗑️
            </button>
          ) : (
            <div className="flex gap-1">
              <button onClick={onDelete}
                className="text-xs bg-red-500 text-white px-2 py-1.5 rounded-lg hover:bg-red-600">
                Ja, löschen
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="text-xs border border-gray-200 px-2 py-1.5 rounded-lg hover:bg-gray-50">
                Nein
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChildProfileManager() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const reload = () => {
    setMembers(loadFamily().members);
    setActiveId(getActiveProfileId());
  };

  useEffect(() => { reload(); }, []);

  const handleSwitch = (id: string) => {
    setActiveProfileId(id);
    setActiveId(id);
  };

  const handleDelete = (id: string) => {
    removeMember(id);
    if (activeId === id) {
      const remaining = loadFamily().members;
      if (remaining.length > 0) setActiveProfileId(remaining[0].id);
      else localStorage.removeItem("cleverli_active_profile");
    }
    reload();
  };

  const canAdd = members.length < MAX_PROFILES;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">👶 Kinder-Profile</h2>
          <p className="text-xs text-gray-400 mt-0.5">Bis zu {MAX_PROFILES} Profile pro Familie</p>
        </div>
        {canAdd && !showAdd && (
          <button onClick={() => setShowAdd(true)}
            className="text-sm bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all">
            + Kind hinzufügen
          </button>
        )}
      </div>

      {/* Existing children */}
      <div className="space-y-2">
        {members.length === 0 && !showAdd && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">👶</div>
            <div className="text-sm">Noch keine Kinder-Profile angelegt.</div>
            <button onClick={() => setShowAdd(true)}
              className="mt-3 text-sm text-green-600 underline hover:text-green-700">
              Jetzt erstes Kind hinzufügen →
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
          />
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <AddChildForm
          onSave={() => { setShowAdd(false); reload(); }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {!canAdd && !showAdd && (
        <p className="text-xs text-center text-gray-400">Maximale Anzahl ({MAX_PROFILES}) Kinder-Profile erreicht.</p>
      )}
    </div>
  );
}
