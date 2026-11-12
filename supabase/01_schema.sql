-- CFL Control V5: execute once in Supabase SQL Editor (fresh project)
create extension if not exists pgcrypto;

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_cfl_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.app_admins a where a.user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_cfl_admin() from public;
grant execute on function public.is_cfl_admin() to authenticated;

create table if not exists public.events (
 id text primary key,
 title text not null check(length(trim(title))>0),
 short_title text not null default '',
 category text not null default 'Community Events',
 start_date date not null,
 end_date date not null,
 description text not null default '',
 box_closed boolean not null default false,
 summary text not null default '',
 audience text not null default '',
 price_label text not null default '',
 link_url text not null default '',
 image_url text,
 legacy_visual_key text not null default '',
 status text not null default 'draft' check(status in ('draft','published','archived')),
 display_order int not null default 0,
 updated_at timestamptz not null default now(),
 constraint correct_dates check(end_date>=start_date)
);
create index if not exists events_start_idx on public.events(start_date);

create table if not exists public.tv_slides (
 id uuid primary key default gen_random_uuid(),
 slide_type text not null default 'event' check(slide_type in ('event','month','btwb','custom')),
 event_id text references public.events(id) on delete set null,
 position int not null default 0,
 duration_seconds int not null default 15 check(duration_seconds between 5 and 300),
 settings jsonb not null default '{}'::jsonb,
 enabled boolean not null default true,
 updated_at timestamptz not null default now()
);
create index if not exists tv_slides_position_idx on public.tv_slides(position);

-- Public read-only snapshot; unsaved/draft slides are NOT publicly readable
create table if not exists public.tv_publication (
 channel text primary key default 'main',
 version bigint not null default 0,
 slides jsonb not null default '[]'::jsonb,
 published_at timestamptz,
 updated_by uuid references auth.users(id)
);
insert into public.tv_publication (channel) values ('main') on conflict do nothing;

create or replace function public.touch_cfl_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger touch_events before update on public.events for each row execute function public.touch_cfl_updated_at();
create trigger touch_tv_slides before update on public.tv_slides for each row execute function public.touch_cfl_updated_at();

alter table public.app_admins enable row level security;
alter table public.events enable row level security;
alter table public.tv_slides enable row level security;
alter table public.tv_publication enable row level security;

create policy "admin can see own membership" on public.app_admins for select to authenticated using (user_id=(select auth.uid()));
create policy "events public can read published" on public.events for select to anon,authenticated using (status='published');
create policy "events admin can read all" on public.events for select to authenticated using ((select public.is_cfl_admin()));
create policy "events admin can insert" on public.events for insert to authenticated with check ((select public.is_cfl_admin()));
create policy "events admin can update" on public.events for update to authenticated using ((select public.is_cfl_admin())) with check ((select public.is_cfl_admin()));
create policy "events admin can delete" on public.events for delete to authenticated using ((select public.is_cfl_admin()));
create policy "tv slides admin read" on public.tv_slides for select to authenticated using ((select public.is_cfl_admin()));
create policy "tv slides admin insert" on public.tv_slides for insert to authenticated with check ((select public.is_cfl_admin()));
create policy "tv slides admin update" on public.tv_slides for update to authenticated using ((select public.is_cfl_admin())) with check ((select public.is_cfl_admin()));
create policy "tv slides admin delete" on public.tv_slides for delete to authenticated using ((select public.is_cfl_admin()));
create policy "tv publication public read" on public.tv_publication for select to anon,authenticated using (true);
-- Snapshot publish: RPC below, no direct update from client

create or replace function public.publish_cfl_tv(p_slides jsonb)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare next_version bigint;
begin
 if not public.is_cfl_admin() then raise exception 'Not authorized'; end if;
 if jsonb_typeof(p_slides) <> 'array' then raise exception 'Expected slides array'; end if;
 if jsonb_array_length(p_slides)>100 then raise exception 'Too many slides'; end if;
 update public.tv_publication
 set slides = p_slides, version=version+1, published_at=now(), updated_by=(select auth.uid())
 where channel='main' returning version into next_version;
 return next_version;
end;
$$;
revoke all on function public.publish_cfl_tv(jsonb) from public;
grant execute on function public.publish_cfl_tv(jsonb) to authenticated;

-- Public assets; upload/update/delete restricted to admins; only upload image MIME in client
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('cfl-events','cfl-events',true,10485760,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public=true,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;
create policy "cfl admin uploads images" on storage.objects for insert to authenticated with check (bucket_id='cfl-events' and (select public.is_cfl_admin()));
create policy "cfl admin updates images" on storage.objects for update to authenticated using (bucket_id='cfl-events' and (select public.is_cfl_admin())) with check (bucket_id='cfl-events' and (select public.is_cfl_admin()));
create policy "cfl admin deletes images" on storage.objects for delete to authenticated using (bucket_id='cfl-events' and (select public.is_cfl_admin()));
create policy "cfl admin lists images" on storage.objects for select to authenticated using (bucket_id='cfl-events' and (select public.is_cfl_admin()));

-- After creating a user manually via Authentication > Users, run separately:
-- insert into public.app_admins (user_id) values ('YOUR_AUTH_USER_UUID');
