import { calculateBasePrice, ITEM_PRICES, VAT_RATE } from '../utils/pricing';

export const CATALOG_WIDTHS = [2.4, 2.5] as const;

export type CatalogWidth = (typeof CATALOG_WIDTHS)[number];

export type CatalogProduct = {
  slug: string;
  length: number;
  name: string;
  shortName: string;
  description: string;
  recommendedUse: string;
  image: string;
  imageAlt: string;
  badge?: string;
};

export type CatalogExtraId =
  | 'additional_socket'
  | 'additional_light_point'
  | 'additional_door'
  | 'window_80x80'
  | 'large_window'
  | 'wall_partition'
  | 'interior_room'
  | 'full_bathroom'
  | 'air_conditioning';

export type CatalogExtra = {
  id: CatalogExtraId;
  label: string;
  description: string;
  unitPrice: number;
  maxQuantity: number;
};

export const CATALOG_INCLUDED_ITEMS = [
  'Estructura metálica y cerramiento de panel sándwich blanco de 30 mm',
  'Una puerta exterior de 80 cm',
  'Una ventana de 80 × 80 cm',
  'Instalación eléctrica básica',
  'Un enchufe, un interruptor y un punto de luz',
  'Cuadro eléctrico básico',
] as const;

export const CATALOG_EXTRAS: CatalogExtra[] = [
  {
    id: 'additional_socket',
    label: 'Enchufe adicional',
    description: 'Punto de enchufe añadido a la instalación eléctrica.',
    unitPrice: ITEM_PRICES.additional_socket,
    maxQuantity: 10,
  },
  {
    id: 'additional_light_point',
    label: 'Punto de luz adicional',
    description: 'Punto de iluminación adicional preparado en el módulo.',
    unitPrice: ITEM_PRICES.additional_light_point,
    maxQuantity: 8,
  },
  {
    id: 'additional_door',
    label: 'Puerta exterior adicional',
    description: 'Puerta exterior adicional de acceso al módulo.',
    unitPrice: ITEM_PRICES.additional_door,
    maxQuantity: 4,
  },
  {
    id: 'window_80x80',
    label: 'Ventana 80 × 80 cm extra',
    description: 'Ventana adicional del mismo formato que la incluida.',
    unitPrice: ITEM_PRICES.window_80x80,
    maxQuantity: 8,
  },
  {
    id: 'large_window',
    label: 'Ventana grande',
    description: 'Ventana exterior grande para aumentar iluminación y ventilación.',
    unitPrice: ITEM_PRICES.large_window,
    maxQuantity: 6,
  },
  {
    id: 'wall_partition',
    label: 'Tabique interior simple',
    description: 'División interior sencilla, sin puerta ni equipamiento adicional.',
    unitPrice: ITEM_PRICES.wall_partition,
    maxQuantity: 3,
  },
  {
    id: 'interior_room',
    label: 'Habitación interior',
    description: 'Incluye división, puerta interior, ventana, enchufe y punto de luz.',
    unitPrice: ITEM_PRICES.interior_room,
    maxQuantity: 2,
  },
  {
    id: 'full_bathroom',
    label: 'Baño completo prediseñado',
    description: 'Baño completo con sanitarios, fontanería y montaje incluidos.',
    unitPrice: ITEM_PRICES.full_bathroom,
    maxQuantity: 1,
  },
  {
    id: 'air_conditioning',
    label: 'Aire acondicionado',
    description: 'Equipo de aire acondicionado instalado.',
    unitPrice: ITEM_PRICES.air_conditioning,
    maxQuantity: 1,
  },
];

export const catalogProducts: CatalogProduct[] = [
  {
    slug: 'modulo-3x240',
    length: 3,
    name: 'Módulo prefabricado de 3 metros',
    shortName: 'Módulo compacto',
    description: 'Una solución compacta para herramientas, fincas, pequeños almacenes y espacios auxiliares.',
    recommendedUse: 'Herramientas, finca o pequeño almacén',
    image: '/images/caseta-prefabricada-compacta-olivar.webp',
    imageAlt: 'Módulo prefabricado compacto instalado en una finca',
  },
  {
    slug: 'modulo-4x240',
    length: 4,
    name: 'Módulo prefabricado de 4 metros',
    shortName: 'Módulo auxiliar',
    description: 'Espacio auxiliar versátil para almacenamiento, fincas y pequeñas zonas de trabajo.',
    recommendedUse: 'Fincas, uso auxiliar y almacenamiento',
    image: '/images/caseta-prefabricada-frontal-finca.webp',
    imageAlt: 'Módulo prefabricado auxiliar con puerta y ventana',
  },
  {
    slug: 'modulo-5x240',
    length: 5,
    name: 'Módulo prefabricado de 5 metros',
    shortName: 'Módulo medio',
    description: 'Un formato equilibrado para almacén, obra, oficina pequeña o espacio auxiliar.',
    recommendedUse: 'Almacén, obra u oficina auxiliar',
    image: '/images/modulo-prefabricado-perspectiva-jardin.webp',
    imageAlt: 'Módulo prefabricado de tamaño medio visto en perspectiva',
  },
  {
    slug: 'modulo-6x240',
    length: 6,
    name: 'Módulo prefabricado de 6 metros',
    shortName: 'Módulo más vendido',
    description: 'Nuestro modelo de referencia para oficinas, fincas, almacenes y casetas de obra.',
    recommendedUse: 'Oficina, finca, almacén o caseta de obra',
    image: '/images/hero-modulo-prefabricado-jardin.webp',
    imageAlt: 'Módulo prefabricado de seis metros instalado en jardín',
    badge: 'Más vendido',
  },
  {
    slug: 'modulo-7x240',
    length: 7,
    name: 'Módulo prefabricado de 7 metros',
    shortName: 'Módulo grande',
    description: 'Un módulo amplio para vestuarios, oficinas, almacenes y proyectos profesionales.',
    recommendedUse: 'Vestuario, oficina o módulo amplio',
    image: '/images/modulo-prefabricado-finca-dos-ventanas.webp',
    imageAlt: 'Módulo prefabricado grande con dos ventanas',
  },
];

export const getCatalogProduct = (slug?: string | null) =>
  catalogProducts.find((product) => product.slug === slug);

export const getCatalogBasePrice = (product: CatalogProduct, width: CatalogWidth) =>
  calculateBasePrice(product.length, width);

export const getCatalogSku = (product: CatalogProduct, width: CatalogWidth) =>
  `MSJ-${product.length}X${Math.round(width * 100)}`;

export const getPriceWithVat = (priceWithoutVat: number) =>
  priceWithoutVat + Math.round(priceWithoutVat * VAT_RATE);
