import type { ConfiguratorState, ContactFormState, LeadRow, PriceResult, QuoteRow } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { createConfiguratorPdf } from '../utils/pdf';
import { calculatePrice } from '../utils/pricing';

const QUOTES_BUCKET = 'quotes';

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

export const createQuoteNumber = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const suffix = String(Date.now()).slice(-6);
  return `PF-${y}${m}-${suffix}`;
};

const quoteObjectPath = (storedValue: string | null) => {
  if (!storedValue) return null;
  const value = storedValue.trim();

  try {
    const pathname = new URL(value).pathname;
    const markers = [
      `/storage/v1/object/public/${QUOTES_BUCKET}/`,
      `/storage/v1/object/authenticated/${QUOTES_BUCKET}/`,
      `/storage/v1/object/sign/${QUOTES_BUCKET}/`,
    ];
    const marker = markers.find((candidate) => pathname.includes(candidate));
    if (marker) return decodeURIComponent(pathname.slice(pathname.indexOf(marker) + marker.length));
  } catch {
    // Los registros nuevos guardan la ruta del objeto en lugar de una URL pública.
  }

  return value.replace(/^\/+/, '').replace(new RegExp(`^${QUOTES_BUCKET}/`), '');
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
};

const fileNameFromPath = (path: string, quote: QuoteRow) => {
  const lastSegment = path.split('/').pop();
  return lastSegment && lastSegment.toLowerCase().endsWith('.pdf')
    ? lastSegment
    : `factura-proforma-${quote.quote_number}.pdf`;
};

const downloadStoredQuote = async (quote: QuoteRow) => {
  const path = quoteObjectPath(quote.pdf_url);
  if (!path) throw new Error('La proforma no tiene un PDF guardado.');

  const client = assertSupabase();
  const { data, error } = await client.storage.from(QUOTES_BUCKET).download(path);
  if (error || !data) throw new Error(readableError(error));
  const signature = new TextDecoder().decode(await data.slice(0, 5).arrayBuffer());
  if (signature !== '%PDF-') {
    throw new Error('El archivo guardado no es un PDF válido.');
  }

  downloadBlob(data, fileNameFromPath(path, quote));
};

const configFromLead = (lead: LeadRow): ConfiguratorState => {
  const stored = lead.configurations?.[0];
  if (!stored) throw new Error('Esta solicitud no tiene configuración técnica guardada y no se puede regenerar.');

  const widthOption: ConfiguratorState['widthOption'] = Math.abs(Number(stored.width) - 2.4) < 0.01
    ? '2.40 m'
    : Math.abs(Number(stored.width) - 2.5) < 0.01
      ? '2.50 m'
      : 'Otro ancho';
  const panelChoice: ConfiguratorState['panelChoice'] = stored.is_special_panel
    ? 'Otro grosor y otro color'
    : 'Panel sándwich blanco 30 mm';

  return {
    length: Number(stored.length),
    width: Number(stored.width),
    widthOption,
    customWidth: widthOption === 'Otro ancho' ? String(stored.width) : '',
    isSpecialMeasure: stored.is_special_measure,
    panelChoice,
    panelType: stored.panel_type || 'Panel sándwich',
    panelThickness: stored.panel_thickness || '30 mm',
    panelColor: stored.panel_color || 'Blanco',
    specialThickness: stored.is_special_panel ? stored.panel_thickness || '' : '',
    specialColor: stored.is_special_panel ? stored.panel_color || '' : '',
    isSpecialPanel: stored.is_special_panel,
    useType: (stored.use_type || 'Otro') as ConfiguratorState['useType'],
    province: lead.province || '',
    city: lead.city || '',
    postalCode: lead.postal_code || '',
    deliveryTimeline: (stored.delivery_timeline || 'Lo antes posible') as ConfiguratorState['deliveryTimeline'],
    layoutItems: Array.isArray(stored.layout_json) ? stored.layout_json : [],
  };
};

const contactFromLead = (lead: LeadRow): ContactFormState => ({
  fullName: lead.full_name,
  phone: lead.phone,
  email: lead.email || '',
  intendedUse: lead.intended_use || lead.configurations?.[0]?.use_type || '',
  comments: lead.comments || '',
  accepted: lead.privacy_accepted,
  newsletterSubscribed: lead.newsletter_subscribed,
});

const priceFromLead = (lead: LeadRow, config: ConfiguratorState, quote?: QuoteRow): PriceResult => {
  const calculated = calculatePrice(config);
  const estimatedPriceWithoutVat = Number(quote?.base_price ?? lead.estimated_price_without_vat ?? calculated.estimatedPriceWithoutVat);
  const vatAmount = Number(quote?.iva_amount ?? lead.estimated_vat_amount ?? Math.round(estimatedPriceWithoutVat * 0.21));
  const estimatedPriceWithVat = Number(quote?.total_price ?? lead.estimated_price_with_vat ?? estimatedPriceWithoutVat + vatAmount);
  const extrasPrice = calculated.extrasPrice;

  return {
    ...calculated,
    basePrice: Math.max(0, estimatedPriceWithoutVat - extrasPrice),
    extrasPrice,
    estimatedPriceWithoutVat,
    vatAmount,
    estimatedPriceWithVat,
  };
};

const latestQuote = (lead: LeadRow) => [...(lead.quotes || [])]
  .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))[0];

export interface QuoteDownloadResult {
  regenerated: boolean;
  repaired: boolean;
  warning?: string;
}

const regenerateAndDownloadQuote = async (lead: LeadRow, existingQuote?: QuoteRow): Promise<QuoteDownloadResult> => {
  const client = assertSupabase();
  const config = configFromLead(lead);
  const contact = contactFromLead(lead);
  const price = priceFromLead(lead, config, existingQuote);
  const generated = createConfiguratorPdf({
    contact,
    config,
    price,
    number: existingQuote?.quote_number || createQuoteNumber(),
    quoteDate: existingQuote?.quote_date,
  });

  // La descarga local no debe depender de que Supabase Storage esté disponible.
  downloadBlob(generated.blob, generated.fileName);

  const path = `${lead.id}/${generated.fileName}`;
  try {
    const { error: uploadError } = await client.storage.from(QUOTES_BUCKET).upload(path, generated.blob, {
      contentType: 'application/pdf',
      upsert: true,
    });
    if (uploadError) throw uploadError;

    if (existingQuote) {
      const { error: updateError } = await client.from('quotes').update({ pdf_url: path }).eq('id', existingQuote.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await client.from('quotes').insert({
        lead_id: lead.id,
        quote_number: generated.number,
        quote_date: new Date().toISOString().slice(0, 10),
        base_price: price.estimatedPriceWithoutVat,
        iva_percentage: 21,
        iva_amount: price.vatAmount,
        total_price: price.estimatedPriceWithVat,
        pdf_url: path,
      });
      if (insertError) throw insertError;
    }

    return { regenerated: true, repaired: true };
  } catch (error) {
    return {
      regenerated: true,
      repaired: false,
      warning: `El PDF se ha descargado, pero no se pudo volver a guardar en Supabase: ${readableError(error)}`,
    };
  }
};

export const downloadQuoteForLead = async (lead: LeadRow): Promise<QuoteDownloadResult> => {
  const quote = latestQuote(lead);

  if (quote?.pdf_url) {
    try {
      await downloadStoredQuote(quote);
      return { regenerated: false, repaired: false };
    } catch {
      return regenerateAndDownloadQuote(lead, quote);
    }
  }

  return regenerateAndDownloadQuote(lead, quote);
};

export const createQuoteForLead = async (lead: LeadRow): Promise<QuoteRow> => {
  const client = assertSupabase();
  const basePrice = Number(lead.estimated_price_without_vat || 0);
  const ivaAmount = Math.round(basePrice * 0.21);
  const totalPrice = basePrice + ivaAmount;
  const payload = {
    lead_id: lead.id,
    quote_number: createQuoteNumber(),
    quote_date: new Date().toISOString().slice(0, 10),
    base_price: basePrice,
    iva_percentage: 21,
    iva_amount: ivaAmount,
    total_price: totalPrice,
    pdf_url: null,
  };
  const { data, error } = await client.from('quotes').insert(payload).select('*').single();
  if (error) throw error;
  return data as QuoteRow;
};
