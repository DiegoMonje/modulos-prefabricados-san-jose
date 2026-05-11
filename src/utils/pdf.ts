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
  const name = safeFileName(contact.fullName);
  const fileName = `factura-proforma-${name}-${number}.pdf`;
  const blob = doc.output('blob');
  doc.save(fileName);
  return { number, fileName, blob };
};
