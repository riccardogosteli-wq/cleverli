-- Additive curriculum metadata for canton-aware child profiles.
-- Existing rows remain NULL and therefore keep today's Cleverli behaviour.

alter table public.child_profiles
  add column if not exists canton text,
  add column if not exists school_language text,
  add column if not exists curriculum_system text,
  add column if not exists regional_profile text,
  add column if not exists curriculum_profile_version smallint;

do $$
begin
  alter table public.child_profiles drop constraint if exists child_profiles_canton_check;
  alter table public.child_profiles
    add constraint child_profiles_canton_check
    check (canton is null or canton in (
      'AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE',
      'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'
    ));

  if not exists (
    select 1 from pg_constraint where conname = 'child_profiles_school_language_check'
  ) then
    alter table public.child_profiles
      add constraint child_profiles_school_language_check
      check (school_language is null or school_language in ('de', 'fr', 'it', 'rm'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'child_profiles_curriculum_system_check'
  ) then
    alter table public.child_profiles
      add constraint child_profiles_curriculum_system_check
      check (curriculum_system is null or curriculum_system in ('lp21', 'per', 'piano_di_studio'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'child_profiles_curriculum_profile_version_check'
  ) then
    alter table public.child_profiles
      add constraint child_profiles_curriculum_profile_version_check
      check (curriculum_profile_version is null or curriculum_profile_version >= 1);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'child_profiles_regional_profile_check'
  ) then
    alter table public.child_profiles
      add constraint child_profiles_regional_profile_check
      check (regional_profile is null or regional_profile in (
        'de_italian', 'de_romansh', 'de_romansh_grade1', 'romansh_german', 'italian_german'
      ));
  end if;
end $$;

comment on column public.child_profiles.canton is
  'Swiss canton code selected for this child; NULL preserves the legacy curriculum.';
comment on column public.child_profiles.school_language is
  'School language, required for multilingual cantons and Graubünden profiles.';
comment on column public.child_profiles.curriculum_system is
  'Curriculum family such as lp21, per or piano_di_studio.';
comment on column public.child_profiles.regional_profile is
  'Optional region/language variant, primarily for Graubünden.';
comment on column public.child_profiles.curriculum_profile_version is
  'Version of the selection data contract; does not version exercise progress.';
