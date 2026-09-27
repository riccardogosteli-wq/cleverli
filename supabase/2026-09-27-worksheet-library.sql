begin;
-- A new dedicated private bucket only. Existing buckets/policies are untouched.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cleverli-worksheets-20260927', 'cleverli-worksheets-20260927', false, 4800000, array['application/pdf'])
on conflict (id) do nothing;
do $$ begin
  if not exists (select 1 from storage.buckets where id='cleverli-worksheets-20260927' and public=false) then
    raise exception 'Worksheet bucket must be private; refusing to change an existing bucket';
  end if;
  -- Restrictive guards defeat unrelated broad permissive policies for these roles.
  -- Service-role backend only; never browser SDK access to the PDF objects.
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='worksheet_library_server_only') then
    create policy worksheet_library_server_only on storage.objects as restrictive for all to anon, authenticated
      using (bucket_id <> 'cleverli-worksheets-20260927')
      with check (bucket_id <> 'cleverli-worksheets-20260927');
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects'
    and policyname='worksheet_library_server_only' and permissive='RESTRICTIVE' and cmd='ALL'
    and roles @> array['anon','authenticated']::name[]
    and qual = '(bucket_id <> ''cleverli-worksheets-20260927''::text)'
    and with_check = '(bucket_id <> ''cleverli-worksheets-20260927''::text)') then
    raise exception 'Existing worksheet policy differs; refusing to replace it';
  end if;
end $$;
commit;
-- Read back before upload: public must be false and policy restrictive with both guards.
select id, public, file_size_limit, allowed_mime_types from storage.buckets where id='cleverli-worksheets-20260927';
select policyname, permissive, roles, cmd, qual, with_check from pg_policies where schemaname='storage' and tablename='objects' and policyname='worksheet_library_server_only';
