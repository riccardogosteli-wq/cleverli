"use client";

import {
  CANTON_NAMES,
  SWISS_CANTONS,
  createCurriculumSelection,
  requiresSchoolLanguage,
  resolveCurriculumProfile,
  type CurriculumSelection,
  type GraubuendenRegionalProfile,
  type SchoolLanguage,
  type SwissCanton,
} from "@/lib/curriculumProfiles";
import { useLang } from "@/lib/LangContext";

const SCHOOL_LANGUAGE_LABELS: Record<SchoolLanguage, string> = {
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  rm: "Rumantsch",
};

function defaultSchoolLanguage(canton: SwissCanton): SchoolLanguage {
  if (canton === "TI") return "it";
  if (["GE", "JU", "NE", "VD"].includes(canton)) return "fr";
  return "de";
}

function languageOptions(canton: SwissCanton): SchoolLanguage[] {
  if (["BE", "FR", "VS"].includes(canton)) return ["de", "fr"];
  if (canton === "GR") return ["de", "rm", "it"];
  return [defaultSchoolLanguage(canton)];
}

function defaultRegionalProfile(
  canton: SwissCanton,
  schoolLanguage: SchoolLanguage,
): GraubuendenRegionalProfile | undefined {
  if (canton !== "GR") return undefined;
  if (schoolLanguage === "rm") return "romansh_german";
  if (schoolLanguage === "it") return "italian_german";
  return "de_italian";
}

export default function CurriculumSelector({
  value,
  onChange,
}: {
  value?: CurriculumSelection;
  onChange: (selection: CurriculumSelection | undefined) => void;
}) {
  const { lang } = useLang();
  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  const changeCanton = (raw: string) => {
    if (!raw) {
      onChange(undefined);
      return;
    }
    const canton = raw as SwissCanton;
    const schoolLanguage = defaultSchoolLanguage(canton);
    onChange(createCurriculumSelection(canton, schoolLanguage, defaultRegionalProfile(canton, schoolLanguage)));
  };

  const changeSchoolLanguage = (schoolLanguage: SchoolLanguage) => {
    if (!value) return;
    onChange(createCurriculumSelection(
      value.canton,
      schoolLanguage,
      defaultRegionalProfile(value.canton, schoolLanguage),
    ));
  };

  const profile = value ? resolveCurriculumProfile(value) : null;

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="child-canton" className="block text-xs font-medium text-gray-600 mb-1">
          {t("Schulkanton", "Canton scolaire", "Cantone scolastico", "School canton")}
        </label>
        <select
          id="child-canton"
          data-testid="curriculum-canton"
          value={value?.canton ?? ""}
          onChange={event => changeCanton(event.target.value)}
          className="w-full min-h-11 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-green-400"
        >
          <option value="">{t("Bitte wählen", "Choisir", "Seleziona", "Choose")}</option>
          {SWISS_CANTONS.map(canton => (
            <option key={canton} value={canton}>{CANTON_NAMES[canton]} ({canton})</option>
          ))}
        </select>
      </div>

      {value && requiresSchoolLanguage(value.canton) && (
        <div>
          <label htmlFor="child-school-language" className="block text-xs font-medium text-gray-600 mb-1">
            {t("Schulsprache", "Langue scolaire", "Lingua scolastica", "School language")}
          </label>
          <select
            id="child-school-language"
            data-testid="curriculum-school-language"
            value={value.schoolLanguage}
            onChange={event => changeSchoolLanguage(event.target.value as SchoolLanguage)}
            className="w-full min-h-11 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-green-400"
          >
            {languageOptions(value.canton).map(language => (
              <option key={language} value={language}>{SCHOOL_LANGUAGE_LABELS[language]}</option>
            ))}
          </select>
        </div>
      )}

      {value?.canton === "GR" && value.schoolLanguage === "de" && (
        <div>
          <label htmlFor="child-gr-region" className="block text-xs font-medium text-gray-600 mb-1">
            {t("Erste Fremdsprache", "Première langue étrangère", "Prima lingua straniera", "First foreign language")}
          </label>
          <select
            id="child-gr-region"
            data-testid="curriculum-gr-region"
            value={value.regionalProfile ?? "de_italian"}
            onChange={event => onChange(createCurriculumSelection(
              "GR",
              "de",
              event.target.value as GraubuendenRegionalProfile,
            ))}
            className="w-full min-h-11 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-green-400"
          >
            <option value="de_italian">Italiano ab 3. Klasse</option>
            <option value="de_romansh">Rumantsch ab 3. Klasse</option>
            <option value="de_romansh_grade1">Rumantsch ab 1. Klasse</option>
          </select>
        </div>
      )}

      {profile && (
        <div data-testid="curriculum-profile-status" className={`rounded-xl border px-3 py-2 text-xs leading-relaxed ${
          profile.supported
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-amber-50 border-amber-200 text-amber-800"
        }`}>
          {profile.supported
            ? t(
                "✓ Das passende Kantonsprofil ist verfügbar.",
                "✓ Le profil cantonal correspondant est disponible.",
                "✓ Il profilo cantonale corrispondente è disponibile.",
                "✓ The matching canton profile is available.",
              )
            : t(
                "Dieses genaue Kantonsprofil ist noch in Vorbereitung. Bis dahin bleibt das allgemeine Schweizer Profil aktiv und der Lernfortschritt vollständig erhalten.",
                "Ce profil cantonal précis est encore en préparation. Le profil suisse général reste actif et tous les progrès sont conservés.",
                "Questo profilo cantonale preciso è ancora in preparazione. Il profilo svizzero generale resta attivo e tutti i progressi vengono conservati.",
                "This exact canton profile is still being prepared. The general Swiss profile remains active and all progress is preserved.",
              )}
        </div>
      )}
    </div>
  );
}
