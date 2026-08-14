import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  calculateCommercialQuote,
  buildGuidedResponse,
  commercialConfigSchema,
  estimateTransport,
  extraPriceKeys,
  factTopics,
  formatEuro,
  getStandardBasePrice,
} from '../src/agent/commercialKnowledge.ts';

const fakeConfig = commercialConfigSchema.parse({
  version: 'test-only',
  company: { name: 'Test Company', personalPhone: '000000000', whatsapp: '000000001' },
  vatRate: 0.1,
  quoteValidityDays: 1,
  quoteNotes: ['test fixture'],
  customMeasureNote: 'test fixture',
  bathroomNotePrefix: 'test fixture',
  basePrices: [{ length: 3, width: 2, price: 1000 }],
  extraPrices: Object.fromEntries(extraPriceKeys.map((key) => [key, 100])),
  extraLabels: Object.fromEntries(extraPriceKeys.map((key) => [
    key,
    key === 'completeBathroom' ? 'Baño completo' : `Test ${key}`,
  ])),
  completeBathroomIncludes: ['test fixture'],
  standardModuleIncludes: ['test fixture'],
  facts: Object.fromEntries(factTopics.map((topic) => [topic, { title: topic, facts: [`${topic} information`] }])),
  transport: {
    references: [{
      aliases: ['Testville'],
      label: 'Testville',
      minimum: 25,
      maximum: 35,
      confidence: 'local-estimate',
    }],
    defaultMinimum: 10,
    defaultMaximum: 50,
    disclaimer: 'Test disclaimer',
    accessNotice: 'Test access notice',
  },
  production: {
    updatedAt: 'test-only',
    confirmedJobsAhead: 0,
    unconfirmedPotentialJobs: 0,
    standardLeadTimeBusinessDays: '1-2',
    completeBathroomLeadTimeBusinessDays: 3,
    currentJob: null,
    reservationRule: 'Test reservation rule',
  },
  guidedResponses: {
    customMeasure: 'Test {length} {width}',
    calculatedPrice: 'Test {subtotal} {total}',
    transportQuestion: 'Test question',
    transportEstimate: 'Test {location} {amount} {disclaimer}',
    production: 'Test {standardLeadTime} {bathroomLeadTime} {reservationRule}',
    default: 'Test default',
  },
});

assert.equal(getStandardBasePrice(fakeConfig, 3, 2), 1000);
assert.equal(getStandardBasePrice(fakeConfig, 4, 2), null);

const quote = calculateCommercialQuote(fakeConfig, {
  length: 3,
  width: 2,
  extras: { completeBathroom: 1 },
});

assert.equal(quote.status, 'exact-standard');
assert.equal(quote.subtotalWithoutVat, 1100);
assert.equal(quote.vatAmount, 110);
assert.equal(quote.totalWithVat, 1210);

const customQuote = calculateCommercialQuote(fakeConfig, { length: 4, width: 2 });
assert.equal(customQuote.status, 'review-required');
assert.equal(customQuote.totalWithVat, null);

const transport = estimateTransport(fakeConfig, 'Testville');
assert.equal(transport.minimum, 25);
assert.equal(transport.maximum, 35);
assert.equal(transport.requiresCarrierConfirmation, true);

const bathroomQuestion = '¿Cuánto cuesta un módulo de 3 x 2 con baño?';
const completeBathroomQuestion = '¿Qué precio tiene un módulo de 3 x 2 con baño completo?';
const bathroomReply = buildGuidedResponse(fakeConfig, bathroomQuestion);
const completeBathroomReply = buildGuidedResponse(fakeConfig, completeBathroomQuestion);
assert.match(bathroomReply, /1\.100/);
assert.match(bathroomReply, /Baño completo/i);
assert.equal(bathroomReply, completeBathroomReply);

const openPlanReply = buildGuidedResponse(fakeConfig, '¿Cuánto cuesta un módulo diáfano de 3 x 2 sin baño?');
assert.match(openPlanReply, /1\.000/);
assert.doesNotMatch(openPlanReply, /Baño completo/i);

assert.match(buildGuidedResponse(fakeConfig, '¿De qué grosor es el panel?'), /panels information/);
assert.match(buildGuidedResponse(fakeConfig, '¿Cómo se paga el pedido?'), /payment information/);
assert.match(buildGuidedResponse(fakeConfig, '¿Puede entrar el camión por mi finca?'), /access information/);
const knownTransportReply = buildGuidedResponse(fakeConfig, '¿Cuánto cuesta el transporte hasta Testville?');
assert.match(knownTransportReply, /Test access notice/);
assert.doesNotMatch(knownTransportReply, /en entre/);
const broadTransportReply = buildGuidedResponse(fakeConfig, '¿Cuánto cuesta el transporte hasta New Town?');
assert.match(broadTransportReply, /New Town/);
assert.doesNotMatch(broadTransportReply, /a el transporte/);
assert.match(buildGuidedResponse(fakeConfig, '¿Cuánto tarda un módulo con baño?'), /Test 1-2 3/);

console.log('Commercial agent engine verified with non-production fixtures.');

if (process.env.COMMERCIAL_KNOWLEDGE_PATH) {
  const privateConfig = JSON.parse(await readFile(process.env.COMMERCIAL_KNOWLEDGE_PATH, 'utf8'));
  const verifiedPrivateConfig = commercialConfigSchema.parse(privateConfig);
  const privateBasePrice = getStandardBasePrice(verifiedPrivateConfig, 6, 2.4);
  assert.notEqual(privateBasePrice, null);
  const privateBathroomSubtotal = privateBasePrice! + verifiedPrivateConfig.extraPrices.completeBathroom;
  const shortBathroomReply = buildGuidedResponse(
    verifiedPrivateConfig,
    '¿Qué precio tiene un módulo de 6 x 2,4 con baño?',
  );
  const explicitBathroomReply = buildGuidedResponse(
    verifiedPrivateConfig,
    '¿Qué precio tiene un módulo de 6 x 2,4 con baño completo?',
  );
  assert.match(shortBathroomReply, new RegExp(formatEuro(privateBathroomSubtotal).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.equal(shortBathroomReply, explicitBathroomReply);
  assert.match(shortBathroomReply, /punto de luz adicional/i);
  assert.match(shortBathroomReply, /toma de corriente adicional/i);
  console.log('Private commercial configuration and bathroom pricing behavior verified without printing prices.');
}
