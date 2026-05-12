import type { ConfiguratorState, ContactFormState, LeadRow, LeadStatus, PriceResult } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const QUOTES_BUCKET = 'quotes';

export interface CreateLeadResult {
  leadId: string;
  saved: boolean;
  warnings: string[];
}

const assertSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase no está configurado. Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
};

const readableError = (error: unknown) => {
  if (!error) return 'Error desconocido';
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && 'message' in error) return String((error as { message?: unknown }).message);
  return String(error);
};

const uploadQuotePdf = async ({ leadId, fileName, pdfBlob }: { leadId: string; fileName: string; pdfBlob: Blob }) => {
  const client = assertSupabase();
  const path = `${leadId}/${fileName}`;
  const { error: uploadError } = await client.storage
    .from(QUOTES_BUCKET)
    .upload(path, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = client.storage.from(QUOTES_BUCKET).getPublicUrl(path);
  return data.publicUrl || path;
};

export const createLead = async ({
  contact,
  config,
  price,
  pdf,
}: {
  contact: ContactFormState;
  config: ConfiguratorState;
  price: PriceResult;
  pdf?: { number: string; fileName: string; blob: Blob } | null;
}): Promise<CreateLeadResult> => {
  const leadId = crypto.randomUUID();
  const downloadedAt = new Date().toISOString();
  const warnings: string[] = [];

  if (!isSupabaseConfigured || !supabase) {
    return {
      leadId,
      saved: false,
      warnings: ['Supabase no está configurado. El PDF se descargó, pero la consulta no se guardó.'],
    };
  }

  const client = supabase;
  const { error: leadError } = await client
    .from('leads')
    .insert({
      id: leadId,
      full_name: contact.fullName,
      phone: contact.phone,
      email: contact.email || null,
      province: config.province || '',
      city: config.city || '',
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
    });

  if (leadError) {
    throw new Error(`No se pudo guardar la consulta principal en Supabase: ${readableError(leadError)}`);
  }

  const savedLeadId = leadId;
  const summary = price.summary;

  try {
    const { error: configError } = await client.from('configurations').insert({
      lead_id: savedLeadId,
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
  } catch (error) {
    warnings.push(`La consulta se guardó, pero falló la configuración técnica: ${readableError(error)}`);
  }

  if (pdf?.blob) {
    let pdfUrl: string | null = null;
    try {
      pdfUrl = await uploadQuotePdf({
        leadId: savedLeadId,
        fileName: pdf.fileName,
        pdfBlob: pdf.blob,
      });
    } catch (error) {
      warnings.push(`La consulta se guardó, pero no se pudo subir el PDF. Revisa el bucket Storage '${QUOTES_BUCKET}': ${readableError(error)}`);
    }

    try {
      const { error: quoteError } = await client.from('quotes').insert({
        lead_id: savedLeadId,
        quote_number: pdf.number,
        quote_date: new Date().toISOString().slice(0, 10),
        base_price: price.estimatedPriceWithoutVat,
        iva_percentage: 21,
        iva_amount: price.vatAmount,
        total_price: price.estimatedPriceWithVat,
        pdf_url: pdfUrl,
      });
      if (quoteError) throw quoteError;
    } catch (error) {
      warnings.push(`La consulta se guardó, pero no se pudo registrar la proforma en la tabla quotes: ${readableError(error)}`);
    }
  }

  if (contact.newsletterSubscribed && contact.email) {
    try {
      const { error: newsletterError } = await client.from('newsletter_subscribers').insert({
        full_name: contact.fullName,
        email: contact.email,
        phone: contact.phone,
        province: config.province || '',
        city: config.city || '',
        source: 'configurador_cad_2d',
        active: true,
      });
      if (newsletterError) throw newsletterError;
    } catch (error) {
      warnings.push(`La consulta se guardó, pero no se pudo guardar la suscripción newsletter: ${readableError(error)}`);
    }
  }

  return { leadId: savedLeadId, saved: true, warnings };
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
