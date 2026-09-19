-- Reparación del almacenamiento de proformas.
-- Ejecutar una vez en el SQL Editor del proyecto de producción.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('quotes', 'quotes', false, 10485760, array['application/pdf'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public_upload_quote_pdfs" on storage.objects;
create policy "public_upload_quote_pdfs" on storage.objects
for insert to anon
with check (bucket_id = 'quotes');

drop policy if exists "public_update_quote_pdfs" on storage.objects;
drop policy if exists "public_read_quote_pdfs" on storage.objects;

drop policy if exists "auth_manage_quote_pdfs" on storage.objects;
create policy "auth_manage_quote_pdfs" on storage.objects
for all to authenticated
using (bucket_id = 'quotes')
with check (bucket_id = 'quotes');
