-- AIDA - Esquema base Supabase (Fase 1)
-- Ejecutar en SQL Editor de Supabase

create extension if not exists "pgcrypto";

-- =========================
-- templates
-- =========================
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- compatibilidad flujo actual
  name text not null,
  description text,
  html_url text,
  json_structure jsonb, -- compatibilidad temporal con páginas existentes
  created_at timestamptz not null default now()
);

-- =========================
-- documents
-- =========================
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid references public.templates(id) on delete set null,
  original_filename text not null default 'documento_sin_nombre',
  json_data jsonb not null default '{}'::jsonb,
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- document_versions
-- =========================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'document_status_enum') then
    create type document_status_enum as enum ('draft', 'published');
  end if;

  if not exists (select 1 from pg_type where typname = 'document_source_enum') then
    create type document_source_enum as enum ('ocr', 'manual');
  end if;

  if not exists (select 1 from pg_type where typname = 'document_engine_enum') then
    create type document_engine_enum as enum ('tesseract', 'google_vision', 'openai', 'manual');
  end if;
end$$;

create table if not exists public.document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  version_number int not null check (version_number > 0),
  json_data jsonb not null default '{}'::jsonb,
  pdf_url text not null,
  status document_status_enum not null default 'draft',
  source document_source_enum not null default 'ocr',
  engine document_engine_enum not null default 'tesseract',
  fallback_reason text,
  created_at timestamptz not null default now(),
  unique (document_id, version_number)
);

create index if not exists idx_templates_user_id on public.templates(user_id);
create index if not exists idx_documents_user_id on public.documents(user_id);
create index if not exists idx_documents_template_id on public.documents(template_id);
create index if not exists idx_documents_updated_at on public.documents(updated_at desc);
create index if not exists idx_doc_versions_document_id on public.document_versions(document_id);
create index if not exists idx_doc_versions_created_at on public.document_versions(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_documents_set_updated_at on public.documents;
create trigger trg_documents_set_updated_at
before update on public.documents
for each row
execute function public.set_updated_at();
