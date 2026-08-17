-- Run this once in Supabase SQL Editor for an existing project.
create table if not exists public.project_gallery (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_path text not null,
  alt_text text not null default '',
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

alter table public.project_gallery enable row level security;

drop policy if exists "public can read gallery images for published projects" on public.project_gallery;
create policy "public can read gallery images for published projects" on public.project_gallery for select using (exists (select 1 from public.projects where projects.id = project_gallery.project_id and projects.is_published = true));

grant select on public.project_gallery to anon, authenticated;
