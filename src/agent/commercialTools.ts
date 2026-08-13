import { tool } from 'ai';
import { z } from 'zod';
import {
  type CommercialConfig,
  calculateCommercialQuote,
  estimateTransport,
} from './commercialKnowledge';

const quantity = z.number().int().min(0).max(10).default(0);

export const createCommercialTools = (config: CommercialConfig) => ({
  calculateModulePrice: tool({
    description: 'Returns configured quote data for the requested dimensions and items.',
    inputSchema: z.object({
      length: z.number().min(1).max(20).describe('Largo del módulo en metros.'),
      width: z.number().min(1).max(5).describe('Ancho del módulo en metros.'),
      completeBathroom: quantity.describe('Número de baños completos.'),
      additionalExteriorDoor: quantity,
      interiorDoor: quantity,
      window80x80: quantity,
      largeWindow: quantity,
      bathroomWindow: quantity,
      additionalSocket: quantity,
      additionalLightPoint: quantity,
      airConditioning: quantity,
      partition: quantity,
      toilet: quantity,
      sink: quantity,
      showerTray: quantity,
    }),
    execute: async ({ length, width, ...extras }) => calculateCommercialQuote(config, { length, width, extras }),
  }),

  estimateTransport: tool({
    description: 'Returns configured delivery guidance for a location.',
    inputSchema: z.object({
      location: z.string().min(2).max(120).describe('Localidad y, si está disponible, código postal.'),
    }),
    execute: async ({ location }) => estimateTransport(config, location),
  }),

  getProductionQueue: tool({
    description: 'Returns the configured availability information.',
    inputSchema: z.object({}),
    execute: async () => config.production,
  }),

  getCommercialInformation: tool({
    description: 'Returns the configured company information for a topic.',
    inputSchema: z.object({
      topic: z.enum(['structure', 'panels', 'openings', 'electricity', 'uses', 'delivery', 'access', 'payment', 'changes', 'permits']),
    }),
    execute: async ({ topic }) => config.facts[topic],
  }),
});
