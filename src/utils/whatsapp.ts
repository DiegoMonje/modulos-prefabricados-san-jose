import { company } from '../config/company';
import type { ConfiguratorState, ContactFormState, PriceResult } from '../types';
import { formatCurrency } from './pricing';

export const buildWhatsAppMessage = (contact: ContactFormState, config: ConfiguratorState, price: PriceResult) => {
  const extras = price.summary.extrasList.length ? price.summary.extrasList.join(', ') : 'sin extras añadidos';
  const name = contact.fullName || 'un cliente';
  return `Hola, soy ${name}. Estoy interesado en un módulo prefabricado de ${config.length} x ${config.width} m (${price.squareMeters} m²), con ${config.panelType.toLowerCase()} ${config.panelColor.toLowerCase()} de ${config.panelThickness}. Elementos incluidos: ${price.summary.includedList.join(', ')}. Extras añadidos: ${extras}. Ubicación: ${config.city}, ${config.province}. Precio estimado sin IVA: ${formatCurrency(price.estimatedPriceWithoutVat)}. Total estimado con IVA: ${formatCurrency(price.estimatedPriceWithVat)}. Me gustaría recibir presupuesto personalizado.`;
};

export const buildWhatsAppUrl = (contact: ContactFormState, config: ConfiguratorState, price: PriceResult) =>
  `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage(contact, config, price))}`;
