import type { ConfiguratorState, LayoutItem, LayoutItemType, LayoutSummary, PriceResult } from '../types';

export const REFERENCE_LENGTH = 6;
export const REFERENCE_WIDTH = 2.4;
export const REFERENCE_BASE_PRICE = 4750;
export const REFERENCE_SQUARE_METERS = REFERENCE_LENGTH * REFERENCE_WIDTH;
export const REFERENCE_PRICE_PER_M2 = REFERENCE_BASE_PRICE / REFERENCE_SQUARE_METERS;
export const VAT_RATE = 0.21;
export const SHOWER_TRAY_DISCOUNT = 100;

export const SHORT_MODULE_SURCHARGE_BY_LENGTH: Record<number, number> = {
  3: 0.2,
  4: 0.1,
  5: 0.1,
};

export const ITEM_PRICES: Record<LayoutItemType, number> = {
  base_door: 0,
  base_window_80x80: 0,
  base_socket: 0,
  base_light_point: 0,
  base_electrical_panel: 0,
  additional_socket: 50,
  additional_door: 120,
  window_80x80: 200,
  large_window: 250,
  wall_partition: 300,
  interior_room: 700,
  full_bathroom: 1500,
  air_conditioning: 600,
};

export const ITEM_LABELS: Record<LayoutItemType, string> = {
  base_door: 'Puerta incluida',
  base_window_80x80: 'Ventana 80x80 incluida',
  base_socket: 'Enchufe incluido',
  base_light_point: 'Punto de luz incluido',
  base_electrical_panel: 'Cuadro eléctrico incluido',
  additional_socket: 'Enchufe adicional',
  additional_door: 'Puerta adicional',
  window_80x80: 'Ventana 80x80 extra',
  large_window: 'Ventana grande',
  wall_partition: 'Tabique simple',
  interior_room: 'Habitación interior',
  full_bathroom: 'Baño completo',
  air_conditioning: 'Aire acondicionado',
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);

export const createBaseLayoutItems = (): LayoutItem[] => [
  {
    id: 'base-door',
    type: 'base_door',
    label: ITEM_LABELS.base_door,
    x: 2.6,
    y: 0,
    width: 0.8,
    height: 0.1,
    rotation: 0,
    zone: 'edge',
    side: 'top',
    price: 0,
    included: true,
  },
  {
    id: 'base-window',
    type: 'base_window_80x80',
    label: ITEM_LABELS.base_window_80x80,
    x: 4.2,
    y: 0,
    width: 0.8,
    height: 0.1,
    rotation: 0,
    zone: 'edge',
    side: 'top',
    price: 0,
    included: true,
  },
  {
    id: 'base-socket',
    type: 'base_socket',
    label: ITEM_LABELS.base_socket,
    x: 1.1,
    y: 1.15,
    width: 0.28,
    height: 0.28,
    rotation: 0,
    zone: 'inside',
    price: 0,
    included: true,
  },
  {
    id: 'base-light',
    type: 'base_light_point',
    label: ITEM_LABELS.base_light_point,
    x: 2.95,
    y: 1.15,
    width: 0.28,
    height: 0.28,
    rotation: 0,
    zone: 'inside',
    price: 0,
    included: true,
  },
  {
    id: 'base-panel',
    type: 'base_electrical_panel',
    label: ITEM_LABELS.base_electrical_panel,
    x: 0.45,
    y: 0.35,
    width: 0.42,
    height: 0.3,
    rotation: 0,
    zone: 'inside',
    price: 0,
    included: true,
  },
];

export const getDefaultItemSize = (type: LayoutItemType) => {
  switch (type) {
    case 'additional_door':
    case 'base_door':
      return { width: 0.8, height: 0.1 };
    case 'window_80x80':
    case 'base_window_80x80':
      return { width: 0.8, height: 0.1 };
    case 'large_window':
      return { width: 1.2, height: 0.1 };
    case 'wall_partition':
      return { width: 6, height: 0.08 };
    case 'interior_room':
      return { width: 6, height: 1.5 };
    case 'full_bathroom':
      return { width: 2.0, height: 1.2 };
    case 'air_conditioning':
      return { width: 0.55, height: 0.28 };
    default:
      return { width: 0.28, height: 0.28 };
  }
};

export const getItemPrice = (item: LayoutItem) => {
  if (item.included) return 0;
  if (item.type === 'full_bathroom' && item.hasShowerTray === false) {
    return Math.max(0, ITEM_PRICES.full_bathroom - SHOWER_TRAY_DISCOUNT);
  }
  return item.price;
};

const isReferenceModule = (length: number, width: number) =>
  Math.abs(length - REFERENCE_LENGTH) < 0.01 && Math.abs(width - REFERENCE_WIDTH) < 0.01;

const surchargeRate = (length: number) => {
  const rounded = Math.round(length);
  return Math.abs(length - rounded) < 0.01 ? SHORT_MODULE_SURCHARGE_BY_LENGTH[rounded] ?? 0 : 0;
};

export const calculateBasePrice = (length: number, width: number) => {
  if (isReferenceModule(length, width)) return REFERENCE_BASE_PRICE;
  const squareMeters = Number((length * width).toFixed(2));
  return Math.round(squareMeters * REFERENCE_PRICE_PER_M2 * (1 + surchargeRate(length)));
};

export const summarizeLayoutItems = (items: LayoutItem[]): LayoutSummary => {
  const billable = items.filter((item) => !item.included);
  const count = (type: LayoutItemType) => billable.filter((item) => item.type === type).length;
  const fullBathrooms = count('full_bathroom');
  const interiorRooms = count('interior_room');
  const wallPartitions = count('wall_partition');
  const additionalDoors = count('additional_door');
  const additionalSockets = count('additional_socket');
  const windows80x80 = count('window_80x80');
  const largeWindows = count('large_window');
  const hasAirConditioning = count('air_conditioning') > 0;

  const includedList = [
    '1 puerta incluida',
    '1 ventana 80x80 incluida',
    'instalación eléctrica básica',
    '1 enchufe incluido',
    '1 interruptor incluido',
    '1 punto de luz incluido',
    'cuadro eléctrico incluido',
  ];

  const extrasList: string[] = [];
  if (additionalSockets) extrasList.push(`${additionalSockets} enchufe(s) adicional(es)`);
  if (additionalDoors) extrasList.push(`${additionalDoors} puerta(s) adicional(es)`);
  if (windows80x80) extrasList.push(`${windows80x80} ventana(s) 80x80 extra`);
  if (largeWindows) extrasList.push(`${largeWindows} ventana(s) grande(s)`);
  if (wallPartitions) extrasList.push(`${wallPartitions} tabique(s) simple(s)`);
  if (interiorRooms) extrasList.push(`${interiorRooms} habitación(es) interior(es) · incluye puerta, ventana 80x80, punto de luz y enchufe`);
  if (fullBathrooms) extrasList.push(`${fullBathrooms} baño(s) completo(s) · incluye puerta, ventana 40x40, punto de luz, enchufe, lavabo, váter y ducha opcional`);
  if (hasAirConditioning) extrasList.push('aire acondicionado');

  return {
    includedList,
    extrasList,
    additionalSockets,
    additionalDoors,
    windows80x80,
    largeWindows,
    wallPartitions,
    interiorRooms,
    fullBathrooms,
    hasAirConditioning,
    hasFullBathroom: fullBathrooms > 0,
  };
};

export const calculatePrice = (config: ConfiguratorState): PriceResult => {
  const squareMeters = Number((config.length * config.width).toFixed(2));
  const basePrice = calculateBasePrice(config.length, config.width);
  const extrasPrice = Math.round(config.layoutItems.reduce((sum, item) => sum + getItemPrice(item), 0));
  const estimatedPriceWithoutVat = basePrice + extrasPrice;
  const vatAmount = Math.round(estimatedPriceWithoutVat * VAT_RATE);
  const estimatedPriceWithVat = estimatedPriceWithoutVat + vatAmount;
  return {
    squareMeters,
    basePrice,
    extrasPrice,
    estimatedPriceWithoutVat,
    vatAmount,
    estimatedPriceWithVat,
    summary: summarizeLayoutItems(config.layoutItems),
  };
};
