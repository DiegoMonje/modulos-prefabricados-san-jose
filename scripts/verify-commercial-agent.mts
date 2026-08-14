import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  calculateCommercialQuote,
  commercialConfigSchema,
  estimateTransport,
  extraPriceKeys,
  factTopics,
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
  extraLabels: Object.fromEntries(extraPriceKeys.map((key) => [key, `Test ${key}`])),
  completeBathroomIncludes: ['test fixture'],
  standardModuleIncludes: ['test fixture'],
  facts: Object.fromEntries(factTopics.map((topic) => [topic, { title: topic, facts: ['test fixture'] }])),
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

console.log('Commercial agent engine verified with non-production fixtures.');

if (process.env.COMMERCIAL_KNOWLEDGE_PATH) {
  const privateConfig = JSON.parse(await readFile(process.env.COMMERCIAL_KNOWLEDGE_PATH, 'utf8'));
  commercialConfigSchema.parse(privateConfig);
  console.log('Private commercial configuration schema verified without printing its contents.');
}
