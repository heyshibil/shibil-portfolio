-- Portfolio content schema. Run this in the Supabase SQL Editor once.
create extension if not exists pgcrypto;

create type public.content_status as enum ('draft', 'published');

create table public.site_settings (
  id boolean primary key default true check (id),
  full_name text not null default 'Shibil Mohammed',
  headline text,
  bio text,
  email text not null default 'shibzzmohd@gmail.com',
  linkedin_url text,
  github_url text,
  resume_path text,
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  project_type text not null,
  year smallint not null,
  summary text not null,
  scope text[] not null default '{}',
  stack text[] not null default '{}',
  challenge text,
  lessons text,
  cover_image_path text,
  live_url text,
  github_url text,
  is_published boolean not null default false,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  organization text not null,
  role text not null,
  location text,
  started_on date not null,
  ended_on date,
  description text not null,
  is_published boolean not null default true,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ended_on is null or ended_on >= started_on)
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body_markdown text not null,
  cover_image_path text,
  tags text[] not null default '{}',
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'draft' and published_at is null) or (status = 'published' and published_at is not null))
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
create trigger projects_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger experiences_updated_at before update on public.experiences for each row execute function public.set_updated_at();
create trigger blog_posts_updated_at before update on public.blog_posts for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.blog_posts enable row level security;

create policy "public can read site settings" on public.site_settings for select using (true);
create policy "public can read published projects" on public.projects for select using (is_published = true);
create policy "public can read published experiences" on public.experiences for select using (is_published = true);
create policy "public can read published posts" on public.blog_posts for select using (status = 'published' and published_at <= now());

grant usage on schema public to anon, authenticated;
grant select on public.site_settings, public.projects, public.experiences, public.blog_posts to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;
