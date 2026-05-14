import jsPDF from 'jspdf';
import { company } from '../config/company';
import type { ConfiguratorState, ContactFormState, PriceResult } from '../types';
import { formatCurrency } from './pricing';

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 14;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const quoteNumber = () => {
  const now = new Date();
  return `PF-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(Date.now()).slice(-6)}`;
};

const cleanText = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim();
const safeFileName = (value: string) => cleanText(value).toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'cliente';

const addHeader = (doc: jsPDF, number: string, date: string) => {
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, PAGE_WIDTH, 34, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('Factura proforma · Módulo prefabricado a medida', MARGIN, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`${company.name} · CIF ${company.cif}`, MARGIN, 23);
  doc.text(`Nº ${number} · Fecha ${date}`, PAGE_WIDTH - MARGIN, 23, { align: 'right' });
  doc.setTextColor(15, 23, 42);
};

const addFooter = (doc: jsPDF, pageNumber: number) => {
  doc.setDrawColor(226, 232, 240);
  doc.line(MARGIN, PAGE_HEIGHT - 15, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Documento orientativo sujeto a revisión técnica, transporte, montaje, accesos y disponibilidad de materiales.', MARGIN, PAGE_HEIGHT - 9);
  doc.text(`Página ${pageNumber}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 9, { align: 'right' });
  doc.setTextColor(15, 23, 42);
};

const ensureSpace = (doc: jsPDF, y: number, needed: number, number: string, date: string) => {
  if (y + needed <= PAGE_HEIGHT - 22) return y;
  doc.addPage();
  addHeader(doc, number, date);
  addFooter(doc, doc.getNumberOfPages());
  return 45;
};

const sectionTitle = (doc: jsPDF, title: string, x: number, y: number) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(249, 115, 22);
  doc.text(title.toUpperCase(), x, y);
  doc.setTextColor(15, 23, 42);
};

const drawInfoBox = (doc: jsPDF, title: string, lines: string[], x: number, y: number, w: number) => {
  const lineHeight = 4.8;
  const splitLines = lines.flatMap((line) => doc.splitTextToSize(cleanText(line), w - 10));
  const h = 12 + splitLines.length * lineHeight;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(x, y, w, h, 3, 3, 'FD');
  sectionTitle(doc, title, x + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  let cursor = y + 15;
  splitLines.forEach((line) => {
    doc.text(line, x + 5, cursor);
    cursor += lineHeight;
  });
  doc.setTextColor(15, 23, 42);
  return h;
};

const drawWrappedText = (doc: jsPDF, text: string, x: number, y: number, width: number, lineHeight = 4.6) => {
  const lines = doc.splitTextToSize(cleanText(text), width);
  lines.forEach((line: string, index: number) => doc.text(line, x, y + index * lineHeight));
  return lines.length * lineHeight;
};

const drawPriceTable = (doc: jsPDF, price: PriceResult, y: number) => {
  const rows = [
    ['Precio base módulo', formatCurrency(price.basePrice)],
    ['Extras y complementos', formatCurrency(price.extrasPrice)],
    ['Subtotal sin IVA', formatCurrency(price.estimatedPriceWithoutVat)],
    ['IVA 21%', formatCurrency(price.vatAmount)],
  ];
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 48, 3, 3, 'FD');
  sectionTitle(doc, 'Resumen económico', MARGIN + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  let cursor = y + 17;
  rows.forEach(([label, value]) => {
    doc.setTextColor(51, 65, 85);
    doc.text(label, MARGIN + 5, cursor);
    doc.setFont('helvetica', 'bold');
    doc.text(value, PAGE_WIDTH - MARGIN - 5, cursor, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    cursor += 6;
  });
  doc.setTextColor(249, 115, 22);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Total con IVA', MARGIN + 5, y + 42);
  doc.text(formatCurrency(price.estimatedPriceWithVat), PAGE_WIDTH - MARGIN - 5, y + 42, { align: 'right' });
  doc.setTextColor(15, 23, 42);
};

const addPlanPage = (doc: jsPDF, number: string, date: string, cadImage?: string | null) => {
  doc.addPage();
  addHeader(doc, number, date);
  addFooter(doc, doc.getNumberOfPages());
  sectionTitle(doc, 'Plano CAD 2D orientativo', MARGIN, 48);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Plano visual generado desde el configurador. Las medidas y posiciones son orientativas y deben revisarse antes de fabricación.', MARGIN, 55);
  doc.setFillColor(2, 6, 23);
  doc.setDrawColor(51, 65, 85);
  doc.roundedRect(MARGIN, 63, CONTENT_WIDTH, 118, 3, 3, 'FD');
  if (cadImage) {
    try {
      doc.addImage(cadImage, 'PNG', MARGIN + 4, 67, CONTENT_WIDTH - 8, 110, undefined, 'FAST');
    } catch {
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('No se pudo insertar la imagen del plano en este navegador.', PAGE_WIDTH / 2, 123, { align: 'center' });
      doc.setTextColor(15, 23, 42);
    }
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Plano no capturado. Vuelve al paso CAD y continúa de nuevo para incluirlo.', PAGE_WIDTH / 2, 123, { align: 'center' });
    doc.setTextColor(15, 23, 42);
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Notas técnicas', MARGIN, 198);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const notes = [
    'El plano es una representación 2D orientativa para solicitud de presupuesto.',
    'La posición final de puertas, ventanas, sanitarios, enchufes, puntos de luz y aire acondicionado queda sujeta a revisión técnica.',
    'La fabricación puede requerir ajustes por estructura, transporte, montaje y disponibilidad de materiales.',
  ];
  let cursor = 205;
  notes.forEach((note) => {
    cursor += drawWrappedText(doc, `• ${note}`, MARGIN, cursor, CONTENT_WIDTH, 4.6) + 1;
  });
};

type WarrantySection = { title: string; lines?: string[]; bullets?: string[] };

const warrantySections: WarrantySection[] = [
  {
    title: '1. Objeto y alcance del documento',
    lines: [
      `El presente documento regula las condiciones generales de garantía, uso, mantenimiento, entrega, instalación y responsabilidad aplicables a los módulos, casetas, construcciones prefabricadas y elementos accesorios suministrados por ${company.name}.`,
      'Estas condiciones forman parte de la documentación comercial asociada al presupuesto, factura proforma, factura definitiva, plano orientativo, pedido o entrega del módulo.',
      'La aceptación del presupuesto, el pago de cualquier cantidad a cuenta, la confirmación del pedido o la recepción del módulo implican el conocimiento de estas condiciones, sin perjuicio de los derechos legalmente reconocidos al cliente cuando actúe como consumidor o usuario.',
    ],
  },
  {
    title: '2. Naturaleza del presupuesto y del plano CAD',
    lines: [
      'Los presupuestos, facturas proforma, simulaciones de precio, imágenes, renders, configuraciones y planos CAD generados desde la web o entregados por la empresa tienen carácter orientativo, salvo confirmación técnica y comercial expresa por escrito.',
      'El plano CAD incluido en el PDF representa una distribución visual aproximada. La posición final de puertas, ventanas, puntos eléctricos, sanitarios, divisiones interiores, equipos de climatización o cualquier otro elemento podrá requerir ajustes por motivos técnicos, estructurales, de fabricación, transporte, montaje o disponibilidad de materiales.',
      'La empresa se reserva el derecho de realizar ajustes técnicos razonables siempre que no alteren de forma sustancial el objeto principal contratado.',
    ],
  },
  {
    title: '3. Alcance de la garantía',
    lines: [
      `${company.name} responderá por los defectos de fabricación, defectos de materiales suministrados por la empresa o defectos de montaje directamente imputables a la empresa, siempre que dichos defectos existan en el momento de la entrega o sean consecuencia directa de una ejecución incorrecta realizada por la empresa.`,
      'La garantía podrá cubrir, cuando proceda: defectos estructurales imputables a fabricación, defectos de ensamblaje o montaje realizados directamente por la empresa, defectos de paneles, perfilería, cerramientos, puertas, ventanas o elementos instalados por la empresa, e incidencias derivadas de una falta de conformidad existente en el momento de la entrega.',
      'La presente garantía no supone una garantía comercial adicional ilimitada, sino una regulación de las condiciones de cobertura, revisión y exclusiones aplicables, respetando en todo caso la normativa vigente que resulte aplicable.',
    ],
  },
  {
    title: '4. Duración de la garantía',
    lines: [
      'La duración de la garantía será la que corresponda legalmente según la naturaleza del cliente, el tipo de operación, el producto suministrado y la normativa vigente aplicable.',
      'Cuando el cliente actúe como consumidor o usuario, se respetarán en todo caso los derechos legales que le correspondan conforme a la normativa de consumo aplicable.',
      'Cuando el cliente actúe como empresa, autónomo, profesional, entidad pública, comunidad, asociación, explotación agrícola, negocio o actividad económica, la garantía se limitará a las condiciones pactadas por escrito y a la normativa civil o mercantil que resulte aplicable.',
    ],
  },
  {
    title: '5. Condiciones necesarias para la validez de la garantía',
    bullets: [
      'Que el defecto sea comunicado por escrito a la empresa tan pronto como sea detectado.',
      'Que el cliente aporte factura, presupuesto aceptado o documento identificativo del pedido.',
      'Que el módulo haya sido utilizado conforme al uso previsto.',
      'Que no se hayan realizado modificaciones, perforaciones, traslados, desmontajes o reparaciones por parte del cliente o terceros sin autorización escrita de la empresa.',
      'Que el módulo haya sido colocado sobre una base adecuada, firme, estable, nivelada y con drenaje suficiente.',
      'Que se haya realizado un mantenimiento razonable del módulo.',
      'Que la empresa pueda inspeccionar el módulo antes de cualquier reparación realizada por terceros.',
    ],
    lines: [
      'La empresa podrá rechazar la aplicación de garantía cuando no pueda comprobar el origen del daño o cuando el defecto haya sido agravado por el uso continuado, manipulación, reparación no autorizada o falta de comunicación en plazo razonable.',
    ],
  },
  {
    title: '6. Exclusiones de garantía',
    lines: [
      'Quedan excluidos de la garantía los daños, defectos, deterioros, deformaciones, filtraciones, roturas, descuadres, oxidaciones, humedades o averías causados total o parcialmente por mal uso, modificaciones no autorizadas, terreno inadecuado, falta de ventilación, falta de mantenimiento, fuerza mayor o intervención de terceros.',
    ],
    bullets: [
      'Uso distinto al indicado en el presupuesto o pedido, sobrecargas, golpes, impactos, vandalismo, negligencia o manipulación indebida.',
      'Uso del módulo como vivienda permanente cuando no haya sido contratado, diseñado o autorizado expresamente para tal fin.',
      'Perforaciones, instalaciones posteriores, anclajes, equipos, placas solares, antenas, rótulos, toldos, depósitos, estanterías pesadas o modificaciones realizadas por el cliente o terceros.',
      'Terreno sin nivelar, blando, inestable, con rellenos, hundimientos, asentamientos, ausencia de solera o apoyos adecuados, mala evacuación de agua o acumulación de humedad bajo el módulo.',
      'Condensación interior por falta de ventilación, uso intensivo, almacenamiento de productos húmedos, habitabilidad no prevista o falta de aireación.',
      'Filtraciones causadas por falta de mantenimiento, obstrucción de canalones, acumulación de suciedad o manipulación de juntas.',
      'Lluvias torrenciales, inundaciones, granizo, nevadas, temporales, vientos fuertes, incendios, accidentes, robos, actos vandálicos, plagas, ambientes corrosivos o fuerza mayor.',
      'Desgaste propio del uso, pequeños ajustes derivados del asentamiento del módulo, mantenimiento de cerraduras, bisagras, juntas, siliconas, canalones o repasos estéticos por uso normal.',
    ],
  },
  {
    title: '7. Responsabilidad del cliente sobre terreno, permisos y accesos',
    lines: [
      'El cliente será responsable de preparar el lugar de entrega o instalación antes de la llegada del módulo. El terreno deberá estar firme, nivelado, compactado, drenado, libre de obstáculos y accesible para camión, remolque, grúa o medios de descarga.',
      'El cliente será responsable de obtener, cuando proceda, licencias, permisos municipales, autorizaciones de comunidad, permisos de obra, ocupación de vía pública, cortes de calle, autorizaciones urbanísticas o cualquier otro trámite administrativo necesario.',
      `Salvo que conste expresamente por escrito, ${company.name} no será responsable de la legalización urbanística, permisos, licencias o autorizaciones necesarias para instalar o utilizar el módulo en la ubicación indicada por el cliente.`,
    ],
  },
  {
    title: '8. Transporte, descarga, grúa y medios auxiliares',
    lines: [
      'Salvo indicación expresa por escrito, el precio no incluye grúa, camión especial, permisos de transporte, cortes de calle, señalización, ocupación de vía pública, maniobras especiales, trabajos de preparación del terreno, solera, cimentación, dados de hormigón, nivelación, retirada de obstáculos o trabajos adicionales por accesos difíciles.',
      'Si en el momento de la entrega no fuera posible descargar, acceder o instalar el módulo por causas ajenas a la empresa, los costes adicionales de transporte, espera, segunda entrega, grúa, personal, desplazamiento o almacenamiento serán asumidos por el cliente.',
      `La empresa no responderá por daños causados por medios de descarga, grúas o transportistas contratados directamente por el cliente o por terceros ajenos a ${company.name}.`,
    ],
  },
  {
    title: '9. Instalaciones eléctricas, fontanería y climatización',
    lines: [
      `Las instalaciones eléctricas, fontanería, saneamiento, climatización u otros servicios solo estarán cubiertos cuando hayan sido realizados directamente por ${company.name} o por personal autorizado por la empresa y consten expresamente en el presupuesto o factura.`,
      'Quedan excluidos de garantía los enganches eléctricos externos, conexiones a red, cuadros, acometidas o protecciones no instaladas por la empresa, boletines o certificados no incluidos, conexiones de agua o saneamiento externas, fugas externas, presión de agua, heladas, equipos de climatización instalados por terceros, sobrecargas eléctricas, picos de tensión o uso de generadores inadecuados.',
      'El cliente deberá contratar, cuando sea necesario, a profesionales autorizados para conexiones definitivas, legalizaciones o instalaciones externas.',
    ],
  },
  {
    title: '10. Mantenimiento obligatorio del módulo',
    bullets: [
      'Ventilar periódicamente el interior y evitar acumulación de humedad.',
      'Limpiar canalones, juntas y zonas de evacuación de agua.',
      'Revisar periódicamente sellados exteriores.',
      'No perforar paneles, cubierta o suelo sin sellado técnico adecuado.',
      'No apoyar cargas no previstas sobre paredes, cubierta o estructura.',
      'Revisar el correcto cierre de puertas y ventanas.',
      'Mantener libre de agua la parte inferior del módulo y evitar contacto permanente con tierra, vegetación, charcos o humedad.',
      'Comunicar cualquier incidencia antes de que el daño se agrave.',
    ],
    lines: [
      'La falta de mantenimiento podrá excluir de garantía los daños derivados directa o indirectamente de dicha falta de conservación.',
    ],
  },
  {
    title: '11. Procedimiento de comunicación de incidencias',
    lines: [
      `Cualquier incidencia deberá comunicarse por escrito a ${company.name} a través del email o medio indicado por la empresa. La comunicación deberá incluir nombre completo, número de factura o presupuesto, fecha de entrega o instalación, ubicación del módulo, descripción clara del problema, fotografías generales y de detalle, vídeos si fueran necesarios e indicación de si se han realizado modificaciones o intervenciones posteriores.`,
      'La empresa podrá solicitar información adicional, fotografías, vídeos o visita técnica para valorar la incidencia.',
      'El cliente no deberá manipular, desmontar, reparar, sellar o modificar la zona afectada antes de que la empresa pueda revisarla, salvo en casos urgentes para evitar daños mayores, debiendo documentar previamente el estado con fotografías y comunicarlo de inmediato.',
    ],
  },
  {
    title: '12. Forma de resolución de incidencias cubiertas',
    lines: [
      'Cuando la empresa determine que la incidencia está cubierta por garantía, podrá optar, según la naturaleza del defecto, por reparar el defecto, sustituir el elemento afectado, reajustar el componente, realizar una intervención técnica correctiva o proponer una solución equivalente razonable.',
      'La elección de la solución corresponderá a la empresa, siempre respetando la normativa aplicable y procurando una solución proporcionada al defecto detectado.',
      'No procederá sustitución completa del módulo cuando el defecto pueda solucionarse mediante reparación, ajuste o sustitución parcial razonable.',
    ],
  },
  {
    title: '13. Limitación de responsabilidad',
    lines: [
      `La responsabilidad de ${company.name} quedará limitada a los defectos directamente imputables a la empresa y cubiertos por estas condiciones o por la normativa aplicable.`,
      'La empresa no responderá por daños indirectos, pérdida de uso, lucro cesante, paralización de actividad, pérdida de mercancía almacenada, daños a bienes introducidos en el módulo, daños derivados de una ubicación, uso o instalación no adecuada, costes de terceros contratados sin autorización previa o daños agravados por falta de comunicación o mantenimiento.',
      'Esta limitación no será aplicable en aquellos supuestos en los que la normativa vigente establezca responsabilidad imperativa no excluible.',
    ],
  },
  {
    title: '14. Clientes consumidores y clientes profesionales',
    lines: [
      'Cuando el cliente tenga la condición de consumidor o usuario, se respetarán en todo caso los derechos reconocidos por la normativa vigente de consumidores y usuarios.',
      'Cuando el cliente actúe como empresa, autónomo, profesional, sociedad, entidad, administración, explotación económica o adquiera el módulo para incorporarlo a una actividad empresarial o profesional, la operación tendrá carácter mercantil o profesional, aplicándose las condiciones pactadas y la normativa correspondiente.',
      'El cliente declara que los datos y finalidad de uso indicados en el presupuesto o pedido son veraces y que comunicará cualquier uso especial o distinto al previsto antes de la fabricación.',
    ],
  },
  {
    title: '15. Condiciones de pago, fabricación, cambios y cancelación',
    lines: [
      'Salvo pacto escrito distinto, la fabricación o reserva de materiales podrá quedar condicionada al pago de una señal, anticipo o cantidad a cuenta.',
      'Una vez iniciado el proceso de fabricación, pedido de materiales, personalización del módulo o trabajos específicos solicitados por el cliente, la cancelación del pedido podrá generar gastos a cargo del cliente.',
      'En módulos fabricados a medida, personalizados o configurados según indicaciones del cliente, la empresa podrá retener los costes ya incurridos en materiales, fabricación, transporte, gestión o trabajos realizados.',
      'Cualquier cambio solicitado por el cliente después de la aceptación del presupuesto deberá ser confirmado por escrito y podrá afectar al precio final, plazo de entrega, diseño, disponibilidad de materiales, transporte, montaje o viabilidad técnica.',
    ],
  },
  {
    title: '16. Entrega y revisión del módulo',
    lines: [
      'En el momento de la entrega, el cliente deberá revisar visualmente el módulo y comunicar cualquier daño aparente, golpe, defecto visible o incidencia de transporte.',
      'Cuando sea posible, las incidencias visibles deberán reflejarse en el documento de entrega, albarán, mensaje escrito o comunicación inmediata a la empresa.',
      'La recepción del módulo sin comunicación de daños visibles no impedirá el ejercicio de derechos legalmente reconocidos, pero podrá dificultar la valoración de daños derivados del transporte, descarga, manipulación posterior o intervención de terceros.',
    ],
  },
  {
    title: '17. Nota final',
    lines: [
      'Este documento deberá interpretarse conforme a la normativa española vigente y, en su caso, a la normativa de consumidores y usuarios que resulte aplicable. Si alguna cláusula fuera considerada no válida, ello no afectará al resto del documento, que continuará siendo aplicable en lo permitido por la ley.',
    ],
  },
];

const addWarrantyPage = (doc: jsPDF, number: string, date: string) => {
  doc.addPage();
  addHeader(doc, number, date);
  addFooter(doc, doc.getNumberOfPages());
  let y = 45;

  sectionTitle(doc, 'Garantía y condiciones de venta', MARGIN, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  y += drawWrappedText(doc, `${company.name} · CIF ${company.cif} · ${company.address} · Tel. ${company.phone} · ${company.email}`, MARGIN, y, CONTENT_WIDTH, 4) + 5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 20, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Resumen de aplicación', MARGIN + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.4);
  drawWrappedText(doc, 'Estas condiciones protegen la correcta ejecución del pedido y delimitan responsabilidades por terreno, accesos, mantenimiento, modificaciones, instalaciones de terceros, humedad, transporte y uso del módulo. No limitan los derechos legales que correspondan al cliente cuando actúe como consumidor o usuario.', MARGIN + 5, y + 12, CONTENT_WIDTH - 10, 3.6);
  y += 27;

  warrantySections.forEach((section) => {
    y = ensureSpace(doc, y, 15, number, date);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.4);
    doc.setTextColor(249, 115, 22);
    doc.text(section.title, MARGIN, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.3);
    doc.setTextColor(51, 65, 85);

    section.lines?.forEach((line) => {
      y = ensureSpace(doc, y, 10, number, date);
      y += drawWrappedText(doc, line, MARGIN, y, CONTENT_WIDTH, 3.75) + 1.2;
    });

    section.bullets?.forEach((bullet) => {
      y = ensureSpace(doc, y, 8, number, date);
      y += drawWrappedText(doc, `• ${bullet}`, MARGIN + 2, y, CONTENT_WIDTH - 2, 3.65) + 0.8;
    });

    y += 2.4;
  });

  doc.setTextColor(15, 23, 42);
};

export interface GeneratedConfiguratorPdf {
  number: string;
  fileName: string;
  blob: Blob;
}

export const downloadConfiguratorPdf = ({ contact, config, price, cadImage }: { contact: ContactFormState; config: ConfiguratorState; price: PriceResult; cadImage?: string | null }): GeneratedConfiguratorPdf => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const number = quoteNumber();
  const date = new Date().toLocaleDateString('es-ES');
  addHeader(doc, number, date);
  addFooter(doc, 1);
  let y = 45;
  const leftHeight = drawInfoBox(doc, 'Datos de empresa', [company.name, `CIF: ${company.cif}`, `Tel: ${company.phone}`, `Email: ${company.email}`, company.address], MARGIN, y, 86);
  const rightHeight = drawInfoBox(doc, 'Datos del cliente', [contact.fullName, `Tel: ${contact.phone}`, `Email: ${contact.email || '-'}`, `${config.city || '-'}, ${config.province || '-'}`, `CP: ${config.postalCode || '-'}`], 110, y, 86);
  y += Math.max(leftHeight, rightHeight) + 10;
  y = ensureSpace(doc, y, 55, number, date);
  sectionTitle(doc, 'Configuración técnica', MARGIN, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  [`Medidas: ${config.length} x ${config.width} m · ${price.squareMeters} m²`, `Panel: ${config.panelType}, ${config.panelThickness}, color ${config.panelColor}`, `Uso previsto: ${config.useType}`, `Plazo indicado: ${config.deliveryTimeline}`, `Ubicación: ${config.city || '-'}, ${config.province || '-'} ${config.postalCode ? `(${config.postalCode})` : ''}`].forEach((line) => {
    doc.text(cleanText(line), MARGIN, y);
    y += 5.4;
  });
  y += 3;
  y = ensureSpace(doc, y, 45, number, date);
  sectionTitle(doc, 'Incluido de serie', MARGIN, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  y += drawWrappedText(doc, price.summary.includedList.join(', '), MARGIN, y, CONTENT_WIDTH, 4.6) + 5;
  y = ensureSpace(doc, y, 45, number, date);
  sectionTitle(doc, 'Extras añadidos', MARGIN, y);
  y += 7;
  const extras = price.summary.extrasList.length ? price.summary.extrasList : ['Sin extras añadidos'];
  extras.forEach((extra) => {
    y = ensureSpace(doc, y, 7, number, date);
    y += drawWrappedText(doc, `• ${extra}`, MARGIN, y, CONTENT_WIDTH, 4.6) + 1.2;
  });
  y = ensureSpace(doc, y + 5, 56, number, date);
  drawPriceTable(doc, price, y);
  y += 58;
  y = ensureSpace(doc, y, 35, number, date);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(120, 53, 15);
  doc.setFillColor(255, 247, 237);
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 24, 3, 3, 'F');
  doc.text('Condiciones', MARGIN + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  drawWrappedText(doc, 'Esta factura proforma no constituye factura definitiva. Precio orientativo pendiente de revisión técnica, transporte, montaje, accesos, forma de pago y disponibilidad de materiales.', MARGIN + 5, y + 14, CONTENT_WIDTH - 10, 4);
  doc.setTextColor(15, 23, 42);
  addPlanPage(doc, number, date, cadImage);
  addWarrantyPage(doc, number, date);
  const name = safeFileName(contact.fullName);
  const fileName = `factura-proforma-${name}-${number}.pdf`;
  const blob = doc.output('blob');
  doc.save(fileName);
  return { number, fileName, blob };
};
