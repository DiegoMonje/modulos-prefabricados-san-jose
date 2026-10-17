import { z } from 'zod';

export const factTopics = [
  'structure',
  'panels',
  'openings',
  'electricity',
  'uses',
  'delivery',
  'access',
  'payment',
  'changes',
  'permits',
] as const;

export const extraPriceKeys = [
  'additionalExteriorDoor',
  'interiorDoor',
  'window80x80',
  'largeWindow',
  'bathroomWindow',
  'additionalSocket',
  'additionalLightPoint',
  'airConditioning',
  'partition',
  'toilet',
  'sink',
  'showerTray',
  'completeBathroom',
] as const;

const factSchema = z.object({
  title: z.string().min(1).max(120),
  facts: z.array(z.string().min(1).max(700)).min(1).max(20),
});

const priceValueSchema = z.number().nonnegative().max(1_000_000);
const labelValueSchema = z.string().min(1).max(120);

const extraPricesSchema = z.object({
  additionalExteriorDoor: priceValueSchema,
  interiorDoor: priceValueSchema,
  window80x80: priceValueSchema,
  largeWindow: priceValueSchema,
  bathroomWindow: priceValueSchema,
  additionalSocket: priceValueSchema,
  additionalLightPoint: priceValueSchema,
  airConditioning: priceValueSchema,
  partition: priceValueSchema,
  toilet: priceValueSchema,
  sink: priceValueSchema,
  showerTray: priceValueSchema,
  completeBathroom: priceValueSchema,
});

const extraLabelsSchema = z.object({
  additionalExteriorDoor: labelValueSchema,
  interiorDoor: labelValueSchema,
  window80x80: labelValueSchema,
  largeWindow: labelValueSchema,
  bathroomWindow: labelValueSchema,
  additionalSocket: labelValueSchema,
  additionalLightPoint: labelValueSchema,
  airConditioning: labelValueSchema,
  partition: labelValueSchema,
  toilet: labelValueSchema,
  sink: labelValueSchema,
  showerTray: labelValueSchema,
  completeBathroom: labelValueSchema,
});

const factsSchema = z.object({
  structure: factSchema,
  panels: factSchema,
  openings: factSchema,
  electricity: factSchema,
  uses: factSchema,
  delivery: factSchema,
  access: factSchema,
  payment: factSchema,
  changes: factSchema,
  permits: factSchema,
});

export const commercialConfigSchema = z.object({
  version: z.string().min(1).max(40),
  company: z.object({
    name: z.string().min(1).max(160),
    personalPhone: z.string().min(5).max(30),
    whatsapp: z.string().min(5).max(30),
  }),
  vatRate: z.number().min(0).max(1),
  quoteValidityDays: z.number().int().min(1).max(365),
  quoteNotes: z.array(z.string().min(1).max(700)).max(20),
  customMeasureNote: z.string().min(1).max(700),
  bathroomNotePrefix: z.string().min(1).max(200),
  basePrices: z.array(z.object({
    length: z.number().positive().max(30),
    width: z.number().positive().max(10),
    price: z.number().nonnegative().max(1_000_000),
  })).min(1).max(200),
  extraPrices: extraPricesSchema,
  extraLabels: extraLabelsSchema,
  completeBathroomIncludes: z.array(z.string().min(1).max(200)).max(30),
  standardModuleIncludes: z.array(z.string().min(1).max(300)).max(30),
  facts: factsSchema,
  transport: z.object({
    references: z.array(z.object({
      aliases: z.array(z.string().min(1).max(120)).min(1).max(10),
      label: z.string().min(1).max(120),
      minimum: z.number().nonnegative().max(100_000),
      maximum: z.number().nonnegative().max(100_000),
      confidence: z.enum(['carrier-reference', 'local-estimate']),
    })).max(300),
    defaultMinimum: z.number().nonnegative().max(100_000),
    defaultMaximum: z.number().nonnegative().max(100_000),
    disclaimer: z.string().min(1).max(700),
    accessNotice: z.string().min(1).max(1200),
  }),
  production: z.object({
    updatedAt: z.string().min(1).max(40),
    confirmedJobsAhead: z.number().int().nonnegative().max(1000),
    unconfirmedPotentialJobs: z.number().int().nonnegative().max(1000),
    standardLeadTimeBusinessDays: z.string().min(1).max(60),
    completeBathroomLeadTimeBusinessDays: z.number().int().positive().max(365),
    currentJob: z.object({
      expectedWorkshopCompletion: z.string().max(40).nullable(),
      expectedDelivery: z.string().max(40).nullable(),
      fallbackDelivery: z.string().max(40).nullable(),
      deliveryCondition: z.string().max(700),
    }).nullable(),
    reservationRule: z.string().min(1).max(700),
  }),
  guidedResponses: z.object({
    customMeasure: z.string().min(1).max(700),
    calculatedPrice: z.string().min(1).max(700),
    transportQuestion: z.string().min(1).max(700),
    transportEstimate: z.string().min(1).max(900),
    production: z.string().min(1).max(900),
    default: z.string().min(1).max(700),
  }),
  agentInstructions: z.string().max(6000).optional(),
});

export type CommercialConfig = z.infer<typeof commercialConfigSchema>;
export type CommercialFactTopic = typeof factTopics[number];
export type PriceExtraKey = typeof extraPriceKeys[number];

export type CommercialQuoteInput = {
  length: number;
  width: number;
  extras?: Partial<Record<PriceExtraKey, number>>;
};

export type CommercialQuote = {
  status: 'exact-standard' | 'review-required';
  length: number;
  width: number;
  basePriceWithoutVat: number | null;
  extras: Array<{ key: PriceExtraKey; label: string; quantity: number; unitPrice: number; total: number }>;
  subtotalWithoutVat: number | null;
  vatAmount: number | null;
  totalWithVat: number | null;
  quoteValidityDays: number;
  notes: string[];
};

const roundedMoney = (value: number) => Math.round(value * 100) / 100;

export const getStandardBasePrice = (config: CommercialConfig, length: number, width: number) =>
  config.basePrices.find((entry) =>
    Math.abs(entry.length - length) < 0.01
    && Math.abs(entry.width - width) < 0.01,
  )?.price ?? null;

export const calculateCommercialQuote = (
  config: CommercialConfig,
  { length, width, extras = {} }: CommercialQuoteInput,
): CommercialQuote => {
  const basePrice = getStandardBasePrice(config, length, width);
  const quoteExtras = (Object.entries(extras) as Array<[PriceExtraKey, number | undefined]>)
    .map(([key, rawQuantity]) => ({ key, quantity: Math.max(0, Math.floor(rawQuantity ?? 0)) }))
    .filter(({ quantity }) => quantity > 0)
    .map(({ key, quantity }) => ({
      key,
      label: config.extraLabels[key],
      quantity,
      unitPrice: config.extraPrices[key],
      total: config.extraPrices[key] * quantity,
    }));

  if (basePrice === null) {
    return {
      status: 'review-required',
      length,
      width,
      basePriceWithoutVat: null,
      extras: quoteExtras,
      subtotalWithoutVat: null,
      vatAmount: null,
      totalWithVat: null,
      quoteValidityDays: config.quoteValidityDays,
      notes: [config.customMeasureNote],
    };
  }

  const extrasTotal = quoteExtras.reduce((sum, item) => sum + item.total, 0);
  const subtotal = basePrice + extrasTotal;
  const vat = roundedMoney(subtotal * config.vatRate);
  const notes = [...config.quoteNotes];

  if ((extras.completeBathroom ?? 0) > 0 && config.completeBathroomIncludes.length) {
    notes.push(`${config.bathroomNotePrefix} ${config.completeBathroomIncludes.join(', ')}.`);
  }

  return {
    status: 'exact-standard',
    length,
    width,
    basePriceWithoutVat: basePrice,
    extras: quoteExtras,
    subtotalWithoutVat: subtotal,
    vatAmount: vat,
    totalWithVat: roundedMoney(subtotal + vat),
    quoteValidityDays: config.quoteValidityDays,
    notes,
  };
};

export type TransportEstimate = {
  requestedLocation: string;
  referenceLocation: string | null;
  minimum: number;
  maximum: number;
  confidence: 'carrier-reference' | 'local-estimate' | 'broad-estimate';
  requiresCarrierConfirmation: true;
  notes: string[];
};

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const findTransportReference = (config: CommercialConfig, location: string) => {
  const normalized = normalizeText(location);
  return config.transport.references.find(({ aliases }) =>
    aliases.some((alias) => normalized.includes(normalizeText(alias))),
  );
};

export const estimateTransport = (config: CommercialConfig, location: string): TransportEstimate => {
  const match = findTransportReference(config, location);
  return {
    requestedLocation: location,
    referenceLocation: match?.label ?? null,
    minimum: match?.minimum ?? config.transport.defaultMinimum,
    maximum: match?.maximum ?? config.transport.defaultMaximum,
    confidence: match?.confidence ?? 'broad-estimate',
    requiresCarrierConfirmation: true,
    notes: [config.transport.disclaimer, config.transport.accessNotice],
  };
};

export const formatEuro = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    useGrouping: true,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

const extractDimensions = (message: string) => {
  const match = message.match(/(\d+(?:[,.]\d+)?)\s*(?:x|por)\s*(\d+(?:[,.]\d+)?)/i);
  if (!match) return null;
  const first = Number(match[1].replace(',', '.'));
  const second = Number(match[2].replace(',', '.'));
  if (first <= 2.6 && second >= 3) return { length: second, width: first };
  return { length: first, width: second };
};

const renderTemplate = (template: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce(
    (rendered, [key, value]) => rendered.split(`{${key}}`).join(String(value)),
    template,
  );

const formatDimension = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 2,
  }).format(value);

const renderQuoteResponse = (config: CommercialConfig, quote: CommercialQuote) => {
  const dimensions = `${formatDimension(quote.length)} x ${formatDimension(quote.width)} m`;
  const hasExtras = quote.extras.length > 0;
  const lines = [
    hasExtras
      ? `El precio calculado para el módulo de ${dimensions} es ${formatEuro(quote.subtotalWithoutVat!)} + IVA (${formatEuro(quote.totalWithVat!)} con IVA).`
      : `El módulo diáfano de ${dimensions} cuesta ${formatEuro(quote.subtotalWithoutVat!)} + IVA (${formatEuro(quote.totalWithVat!)} con IVA).`,
  ];

  if (hasExtras) {
    lines.push('', 'Desglose:');
    lines.push(`- Módulo diáfano: ${formatEuro(quote.basePriceWithoutVat!)} + IVA.`);
    quote.extras.forEach((item) => {
      const quantity = item.quantity > 1 ? ` (${item.quantity} unidades)` : '';
      lines.push(`- ${item.label}${quantity}: ${formatEuro(item.total)} + IVA.`);
    });
  }

  if (quote.extras.some(({ key }) => key === 'completeBathroom')) {
    lines.push('', `${config.bathroomNotePrefix} ${config.completeBathroomIncludes.join(', ')}.`);
  }

  lines.push('', `El transporte va aparte y el presupuesto tiene una validez habitual de ${quote.quoteValidityDays} días.`);
  return lines.join('\n');
};

const requestsBathroom = (normalized: string) => {
  const mentionsBathroom = /\b(bano|cuarto de bano)\b/.test(normalized);
  const rejectsBathroom = /\b(sin|no quiero|no llevara|no lleva)\s+(?:un\s+|el\s+)?(?:bano|cuarto de bano)\b/.test(normalized);
  return mentionsBathroom && !rejectsBathroom;
};

const extractTransportLocation = (message: string) => {
  const match = message.match(/\b(?:hasta|hacia|para|a)\s+([a-záéíóúüñ][a-záéíóúüñ\s-]{1,80}?)(?:\s*[?.!,]|$)/i);
  return match?.[1].trim() || null;
};

const getMatchingFactTopics = (normalized: string): CommercialFactTopic[] => {
  const matchers: Array<[CommercialFactTopic, RegExp]> = [
    ['access', /\b(acceso|camion|grua|cable|arbol|camino|finca|maniobra|descargar)\b/],
    ['payment', /\b(pago|paga|pagar|abono|abonar|adelanto|adelantado|senal|reserva|factura|transferencia|presupuesto|validez)\b/],
    ['changes', /\b(cambio|cambiar|modificar|cancelacion|cancelar|devolucion|materiales)\b/],
    ['permits', /\b(permiso|licencia|ayuntamiento|municipal|via publica|cortar la calle)\b/],
    ['panels', /\b(grosor|panel|techo|altura|canalon|evacuacion|milimetros|mm)\b/],
    ['structure', /\b(estructura|tubo|galvanizado|pilar|travesano|suelo|osb|carga|pavimento|vinilo)\b/],
    ['openings', /\b(puerta|ventana|reja|cristal|persiana|bisagra)\b/],
    ['electricity', /\b(electricidad|electrica|enchufe|toma de corriente|punto de luz|luminaria|cuadro electrico|termo)\b/],
    ['uses', /\b(vivienda|oficina|almacen|vestuario|sala|comedor|caseta de obra|uso)\b/],
    ['delivery', /\b(colocacion|nivelacion|nivelar|solera|apoyo|saneamiento|conexion|conectar|montaje|terreno)\b/],
  ];
  return matchers.filter(([, matcher]) => matcher.test(normalized)).map(([topic]) => topic);
};

export const buildGuidedResponse = (config: CommercialConfig, message: string) => {
  const normalized = normalizeText(message);
  const dimensions = extractDimensions(message);
  const bathroomRequested = requestsBathroom(normalized);
  const requestsPrice = /\b(precio|cuesta|costar|presupuesto|importe|sale|valdria|valor)\b/.test(normalized);

  if (dimensions && requestsPrice) {
    const quote = calculateCommercialQuote(config, {
      ...dimensions,
      extras: bathroomRequested ? { completeBathroom: 1 } : {},
    });
    if (quote.status === 'review-required') {
      return renderTemplate(config.guidedResponses.customMeasure, dimensions);
    }
    return renderQuoteResponse(config, quote);
  }

  if (bathroomRequested && requestsPrice) {
    return 'Para calcular correctamente un módulo con baño completo necesito saber la medida exterior, por ejemplo 6 x 2,40 m.';
  }

  if (/transporte|porte|llevar|envio/.test(normalized)) {
    const match = findTransportReference(config, message);
    const requestedLocation = match?.label || extractTransportLocation(message);
    if (!requestedLocation) return config.guidedResponses.transportQuestion;
    const estimate = estimateTransport(config, requestedLocation);
    const amount = estimate.minimum === estimate.maximum
      ? formatEuro(estimate.minimum)
      : `una horquilla de ${formatEuro(estimate.minimum)} a ${formatEuro(estimate.maximum)}`;
    const response = renderTemplate(config.guidedResponses.transportEstimate, {
      location: requestedLocation,
      amount,
      disclaimer: config.transport.disclaimer,
    });
    return `${response} ${config.transport.accessNotice}`;
  }

  if (/plazo|tarda|fabricacion|cola|cuando.*entrega|fecha.*entrega/.test(normalized)) {
    return renderTemplate(config.guidedResponses.production, {
      standardLeadTime: config.production.standardLeadTimeBusinessDays,
      bathroomLeadTime: config.production.completeBathroomLeadTimeBusinessDays,
      reservationRule: config.production.reservationRule,
    });
  }

  const topics = getMatchingFactTopics(normalized);
  if (topics.length) {
    return topics
      .slice(0, 2)
      .map((topic) => `${config.facts[topic].title}: ${config.facts[topic].facts.join(' ')}`)
      .join('\n\n');
  }

  return config.guidedResponses.default;
};
