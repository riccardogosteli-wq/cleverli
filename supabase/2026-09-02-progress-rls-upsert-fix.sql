-- Allow authenticated parents to insert/update progress rows through Supabase
-- upserts while keeping ownership tied to auth.uid().

alter table public.topic_progress
  add column if not exists correct_ids jsonb not null default '[]'::jsonb;

drop policy if exists "Parents can manage child progress" on public.child_progress;
create policy "Parents can manage child progress"
  on public.child_progress for all
  using (
    auth.uid() = parent_id
    and exists (
      select 1 from public.child_profiles
      where child_profiles.id = child_progress.child_id
        and child_profiles.parent_id = auth.uid()
    )
  )
  with check (
    auth.uid() = parent_id
    and exists (
      select 1 from public.child_profiles
      where child_profiles.id = child_progress.child_id
        and child_profiles.parent_id = auth.uid()
    )
  );

drop policy if exists "Parents can manage topic progress" on public.topic_progress;
create policy "Parents can manage topic progress"
  on public.topic_progress for all
  using (
    auth.uid() = parent_id
    and exists (
      select 1 from public.child_profiles
      where child_profiles.id = topic_progress.child_id
        and child_profiles.parent_id = auth.uid()
    )
  )
  with check (
    auth.uid() = parent_id
    and exists (
      select 1 from public.child_profiles
      where child_profiles.id = topic_progress.child_id
        and child_profiles.parent_id = auth.uid()
    )
  );
