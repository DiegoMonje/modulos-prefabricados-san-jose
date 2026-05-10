import type { ConfiguratorState, ContactFormState, LeadRow, LeadStatus, PriceResult } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const assertSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase no está configurado. Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
};

export const createLead = async ({ contact, config, price }: { contact: ContactFormState; config: ConfiguratorState; price: PriceResult }) => {
  const leadId = crypto.randomUUID();
  const downloadedAt = new Date().toISOString();

  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase no está configurado. El lead no se guardará, pero PDF y WhatsApp seguirán funcionando.');
    return leadId;
  }

  const client = supabase;
  const { data: leadData, error: leadError } = await client
    .from('leads')
    .insert({
      id: leadId,
      full_name: contact.fullName,
      phone: contact.phone,
      email: contact.email || null,
      province: config.province,
      city: config.city,
      postal_code: config.postalCode || null,
      intended_use: contact.intendedUse || config.useType,
      comments: contact.comments || null,
      status: 'Nuevo',
      estimated_price_without_vat: price.estimatedPriceWithoutVat,
      estimated_vat_amount: price.vatAmount,
      estimated_price_with_vat: price.estimatedPriceWithVat,
      newsletter_subscribed: contact.newsletterSubscribed,
      privacy_accepted: contact.accepted,
      download_requested: true,
      downloaded_at: downloadedAt,
      lead_source: 'configurador_cad_2d',
    })
    .select('id')
    .single();

  if (leadError) throw leadError;

  const summary = price.summary;
  const { error: configError } = await client.from('configurations').insert({
    lead_id: leadData?.id ?? leadId,
    length: config.length,
    width: config.width,
    square_meters: price.squareMeters,
    is_special_measure: config.isSpecialMeasure,
    panel_type: config.panelType,
    panel_thickness: config.panelThickness,
    panel_color: config.panelColor,
    is_special_panel: config.isSpecialPanel,
    use_type: config.useType,
    extras: summary.extrasList,
    delivery_timeline: config.deliveryTimeline,
    base_included_door: true,
    base_included_window_80x80: true,
    base_included_electrical_installation: true,
    base_included_socket_quantity: 1,
    base_included_light_point_quantity: 1,
    has_air_conditioning: summary.hasAirConditioning,
    has_full_bathroom: summary.hasFullBathroom,
    interior_rooms_quantity: summary.interiorRooms,
    extra_windows_80x80_quantity: summary.windows80x80,
    extra_large_windows_quantity: summary.largeWindows,
    additional_doors_quantity: summary.additionalDoors,
    additional_socket_quantity: summary.additionalSockets,
    layout_json: config.layoutItems,
  });

  if (configError) throw configError;

  if (contact.newsletterSubscribed && contact.email) {
    await client.from('newsletter_subscribers').insert({
      full_name: contact.fullName,
      email: contact.email,
      phone: contact.phone,
      province: config.province,
      city: config.city,
      source: 'configurador_cad_2d',
      active: true,
    });
  }

  return leadData?.id ?? leadId;
};

export const getLeads = async (): Promise<LeadRow[]> => {
  const client = assertSupabase();
  const { data, error } = await client
    .from('leads')
    .select('*, configurations(*), notes(*), quotes(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as LeadRow[];
};

export const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
  const client = assertSupabase();
  const { error } = await client.from('leads').update({ status }).eq('id', leadId);
  if (error) throw error;
};

export const deleteLead = async (leadId: string) => {
  const client = assertSupabase();
  const { error } = await client.from('leads').delete().eq('id', leadId);
  if (error) throw error;
};

export const addLeadNote = async (leadId: string, note: string) => {
  const client = assertSupabase();
  const { error } = await client.from('notes').insert({ lead_id: leadId, note });
  if (error) throw error;
};

export const exportNewsletterCsv = async () => {
  const client = assertSupabase();
  const { data, error } = await client.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false });
  if (error) throw error;
  const headers = ['Nombre', 'Email', 'Telefono', 'Provincia', 'Localidad', 'Fecha', 'Origen', 'Activo'];
  const rows = (data || []).map((row: any) => [row.full_name, row.email, row.phone || '', row.province || '', row.city || '', row.subscribed_at, row.source, row.active ? 'Sí' : 'No']);
  return [headers, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
};
