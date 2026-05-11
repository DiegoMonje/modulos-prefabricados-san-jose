-- Esquema Supabase para Módulos Prefabricados San José
-- Ejecutar en Supabase SQL Editor del proyecto correcto.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  province text not null default '',
  city text not null default '',
  postal_code text,
  intended_use text,
  comments text,
  status text not null default 'Nuevo' check (status in ('Nuevo','Contactado','Presupuesto enviado','Negociando','Vendido','Perdido')),
  estimated_price_without_vat numeric not null default 0,
  estimated_vat_amount numeric not null default 0,
  estimated_price_with_vat numeric not null default 0,
  newsletter_subscribed boolean not null default false,
  privacy_accepted boolean not null default false,
  download_requested boolean not null default false,
  downloaded_at timestamptz,
  lead_source text default 'configurador_cad_2d',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.configurations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  length numeric not null,
  width numeric not null,
  square_meters numeric not null,
  is_special_measure boolean not null default false,
  panel_type text,
  panel_thickness text,
  panel_color text,
  is_special_panel boolean not null default false,
  use_type text,
  extras text[] not null default '{}',
  delivery_timeline text,
  base_included_door boolean not null default true,
  base_included_window_80x80 boolean not null default true,
  base_included_electrical_installation boolean not null default true,
  base_included_socket_quantity integer not null default 1,
  base_included_light_point_quantity integer not null default 1,
  has_air_conditioning boolean not null default false,
  has_full_bathroom boolean not null default false,
  interior_rooms_quantity integer not null default 0,
  extra_windows_80x80_quantity integer not null default 0,
  extra_large_windows_quantity integer not null default 0,
  additional_doors_quantity integer not null default 0,
  additional_socket_quantity integer not null default 0,
  layout_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  province text,
  city text,
  source text not null default 'configurador_cad_2d',
  active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unique(email)
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  quote_number text not null,
  quote_date date not null default current_date,
  base_price numeric not null default 0,
  iva_percentage numeric not null default 21,
  iva_amount numeric not null default 0,
  total_price numeric not null default 0,
  pdf_url text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

alter table public.leads enable row level security;
alter table public.configurations enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.notes enable row level security;
alter table public.quotes enable row level security;

-- Web pública: crear solicitudes, configuración, proforma y newsletter.
drop policy if exists "public_insert_leads" on public.leads;
create policy "public_insert_leads" on public.leads for insert to anon with check (true);

drop policy if exists "public_insert_configurations" on public.configurations;
create policy "public_insert_configurations" on public.configurations for insert to anon with check (true);

drop policy if exists "public_insert_newsletter" on public.newsletter_subscribers;
create policy "public_insert_newsletter" on public.newsletter_subscribers for insert to anon with check (true);

drop policy if exists "public_insert_quotes" on public.quotes;
create policy "public_insert_quotes" on public.quotes for insert to anon with check (true);

-- Panel privado: usuarios autenticados pueden leer y gestionar.
drop policy if exists "auth_select_leads" on public.leads;
create policy "auth_select_leads" on public.leads for select to authenticated using (true);

drop policy if exists "auth_update_leads" on public.leads;
create policy "auth_update_leads" on public.leads for update to authenticated using (true) with check (true);

drop policy if exists "auth_delete_leads" on public.leads;
create policy "auth_delete_leads" on public.leads for delete to authenticated using (true);

drop policy if exists "auth_select_configurations" on public.configurations;
create policy "auth_select_configurations" on public.configurations for select to authenticated using (true);

drop policy if exists "auth_select_newsletter" on public.newsletter_subscribers;
create policy "auth_select_newsletter" on public.newsletter_subscribers for select to authenticated using (true);

drop policy if exists "auth_manage_notes" on public.notes;
create policy "auth_manage_notes" on public.notes for all to authenticated using (true) with check (true);

drop policy if exists "auth_manage_quotes" on public.quotes;
create policy "auth_manage_quotes" on public.quotes for all to authenticated using (true) with check (true);

-- Storage para PDFs de proformas.
insert into storage.buckets (id, name, public)
values ('quotes', 'quotes', true)
on conflict (id) do update set public = true;

drop policy if exists "public_upload_quote_pdfs" on storage.objects;
create policy "public_upload_quote_pdfs" on storage.objects
for insert to anon
with check (bucket_id = 'quotes');

drop policy if exists "public_update_quote_pdfs" on storage.objects;
create policy "public_update_quote_pdfs" on storage.objects
for update to anon
using (bucket_id = 'quotes')
with check (bucket_id = 'quotes');

drop policy if exists "public_read_quote_pdfs" on storage.objects;
create policy "public_read_quote_pdfs" on storage.objects
for select to anon, authenticated
using (bucket_id = 'quotes');

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists configurations_lead_id_idx on public.configurations(lead_id);
create index if not exists quotes_lead_id_idx on public.quotes(lead_id);
create index if not exists notes_lead_id_idx on public.notes(lead_id);
