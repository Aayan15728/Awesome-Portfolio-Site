-- Storage for the visitor counter and the /goal page.
-- Run this once in the Supabase SQL editor (or via the CLI) for your project.
--
-- Row Level Security is ON and there are intentionally NO policies: the anon/public key
-- can't read or write these tables. Only the server, using SUPABASE_SERVICE_ROLE_KEY, can.

create table if not exists public.site_kv (
  key        text primary key,
  value      jsonb       not null default 'null'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_set_members (
  set_key    text        not null,
  member     text        not null,
  created_at timestamptz not null default now(),
  primary key (set_key, member)
);

alter table public.site_kv          enable row level security;
alter table public.site_set_members enable row level security;
