export type ChatbotTopicId = 'start' | 'uses' | 'models' | 'extras' | 'bathroom' | 'transport' | 'access' | 'price' | 'quote';

export type ChatbotTopic = {
  id: ChatbotTopicId;
  label: string;
  title: string;
  answer: string;
  bullets?: string[];
};

export const chatbotTopics: ChatbotTopic[] = [
  {
    id: 'uses',
    label: 'Tipos de módulos',
    title: 'Tipos de casetas y módulos',
    answer: 'Fabricamos módulos y casetas prefabricadas con panel sándwich para diferentes usos.',
    bullets: [
      'Casetas para fincas, herramientas, maquinaria y aperos.',
      'Módulos oficina para empresas, talleres, obras o negocios.',
      'Casetas de obra para almacenes temporales y zonas de trabajo.',
      'Vestuarios prefabricados para trabajadores o instalaciones deportivas.',
      'Almacenes prefabricados para guardar material, mercancía o herramientas.',
    ],
  },
  {
    id: 'models',
    label: 'Medidas habituales',
    title: 'Medidas habituales',
    answer: 'Trabajamos con medidas habituales para orientar el presupuesto, aunque también podemos estudiar configuraciones especiales bajo consulta.',
    bullets: [
      '3 x 2,40 m: módulo compacto.',
      '4 x 2,40 m: módulo auxiliar.',
      '5 x 2,40 m: módulo medio.',
      '6 x 2,40 m: modelo más solicitado.',
      '7 x 2,40 m: módulo grande.',
      '8 x 2,40 m: proyecto especial bajo consulta técnica y transporte.',
    ],
  },
  {
    id: 'extras',
    label: 'Extras disponibles',
    title: 'Extras y acabados',
    answer: 'El módulo puede configurarse con distintos extras según el uso previsto y las necesidades del cliente.',
    bullets: [
      'Puertas, ventanas, enchufes e instalación eléctrica.',
      'Baño, distribución interior y otros elementos bajo revisión.',
      'Panel sándwich blanco de 30 mm como referencia habitual.',
      'Otros grosores y colores bajo consulta.',
    ],
  },
  {
    id: 'bathroom',
    label: 'Baño completo',
    title: 'Baño completo',
    answer: 'El baño completo suele sumar aproximadamente 1.500 € más al presupuesto, aunque puede variar según la configuración.',
    bullets: [
      'El precio puede cambiar si lleva placa de ducha o no.',
      'También depende de la distribución interior y detalles finales.',
      'La confirmación exacta se realiza al revisar el proyecto.',
    ],
  },
  {
    id: 'transport',
    label: 'Transporte',
    title: 'Transporte y entrega',
    answer: 'El transporte no está incluido en el precio del módulo y no depende directamente de nosotros.',
    bullets: [
      'El cliente puede buscar su propio transportista.',
      'También puede solicitar transportistas de nuestra confianza.',
      'El coste dependerá de distancia, accesos, medidas, grúa, maniobras y condiciones del lugar.',
    ],
  },
  {
    id: 'access',
    label: 'Acceso a parcela',
    title: 'Acceso, permisos y maniobras',
    answer: 'Antes de pedir el módulo es muy importante comprobar que se puede entregar e instalar correctamente.',
    bullets: [
      'Verificar si el módulo entra en la parcela.',
      'Comprobar si se puede acceder a la calle con camión o grúa.',
      'Revisar permisos necesarios, espacio para maniobras y posibles obstáculos.',
      'Comprobar que no haya cables, árboles, fachadas estrechas u otros impedimentos.',
      'Lo ideal es enviar imágenes o vídeo del lugar de instalación para valorar mejor la entrega.',
    ],
  },
  {
    id: 'price',
    label: 'Precio orientativo',
    title: 'Precio orientativo',
    answer: 'Los precios son orientativos y deben confirmarse tras revisar medidas, extras, transporte, montaje y detalles técnicos.',
    bullets: [
      'El modelo 6 x 2,40 m aparece como referencia desde 4.750 € sin IVA.',
      'El baño completo puede sumar aproximadamente 1.500 € más, según configuración.',
      'El transporte no está incluido.',
      'El presupuesto final se confirma después de revisar todos los detalles.',
    ],
  },
  {
    id: 'quote',
    label: 'Pedir presupuesto',
    title: 'Preparar presupuesto',
    answer: 'Para preparar un presupuesto necesitamos algunos datos básicos del módulo y del lugar donde se instalará.',
    bullets: [
      'Uso del módulo: finca, oficina, obra, vestuario, almacén u otro.',
      'Medidas aproximadas y distribución deseada.',
      'Extras: baño, ducha, ventanas, puertas, electricidad, aire acondicionado, etc.',
      'Localidad donde se instalará.',
      'Fotos o vídeo del acceso, calle, entrada a parcela y zona de instalación.',
      'Confirmar si hay permisos, cables, obstáculos o maniobras complicadas.',
    ],
  },
];

export const defaultChatbotTopic = chatbotTopics[0];

export const chatbotIntro = 'Hola, soy el asistente de Módulos Prefabricados San José. Puedo ayudarte a elegir módulo, medidas, extras y preparar una solicitud de presupuesto.';

export const quoteWhatsappText = [
  'Hola, quiero presupuesto para una caseta o módulo prefabricado.',
  '',
  'Uso del módulo:',
  'Medidas aproximadas:',
  'Extras necesarios: baño / ducha / ventanas / puertas / electricidad / aire acondicionado:',
  'Localidad de instalación:',
  'Acceso a parcela y calle: confirmar si entra camión o grúa, permisos, cables, obstáculos y maniobras:',
  'Puedo enviar fotos o vídeo del lugar:',
].join('\n');
