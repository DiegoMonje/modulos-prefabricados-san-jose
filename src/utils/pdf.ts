import jsPDF from 'jspdf';
import { company } from '../config/company';
import type { ConfiguratorState, ContactFormState, PriceResult } from '../types';
import { formatCurrency } from './pricing';

const quoteNumber = () => {
  const now = new Date();
  return `PO-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(Date.now()).slice(-6)}`;
};

export const downloadConfiguratorPdf = ({ contact, config, price, cadImage }: { contact: ContactFormState; config: ConfiguratorState; price: PriceResult; cadImage?: string | null }) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const number = quoteNumber();
  const date = new Date().toLocaleDateString('es-ES');

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Presupuesto orientativo · Módulo prefabricado', 14, 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${company.name} · CIF ${company.cif}`, 14, 22);
  doc.text(`Nº ${number} · ${date}`, 148, 22);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Datos de empresa', 14, 44);
  doc.text('Datos del cliente', 112, 44);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text([company.name, `CIF: ${company.cif}`, `Tel: ${company.phone}`, company.email, company.address], 14, 51);
  doc.text([contact.fullName, `Tel: ${contact.phone}`, `Email: ${contact.email || '-'}`, `${config.city}, ${config.province}`, `CP: ${config.postalCode || '-'}`], 112, 51);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 82, 196, 82);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Configuración', 14, 93);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const details = [
    `Medidas: ${config.length} x ${config.width} m (${price.squareMeters} m²)`,
    `Panel: ${config.panelType}, ${config.panelThickness}, color ${config.panelColor}`,
    `Uso previsto: ${config.useType}`,
    `Plazo indicado: ${config.deliveryTimeline}`,
    `Incluido: ${price.summary.includedList.join(', ')}`,
    `Extras: ${price.summary.extrasList.length ? price.summary.extrasList.join(', ') : 'Sin extras añadidos'}`,
  ];
  const split = doc.splitTextToSize(details.join('\n'), 178);
  doc.text(split, 14, 101);

  let y = 139;
  if (cadImage) {
    doc.setFont('helvetica', 'bold');
    doc.text('Plano CAD 2D orientativo', 14, y);
    y += 5;
    try {
      doc.addImage(cadImage, 'PNG', 14, y, 182, 78, undefined, 'FAST');
      y += 86;
    } catch {
      doc.setFont('helvetica', 'normal');
      doc.text('No se pudo insertar la imagen del CAD en este navegador.', 14, y + 6);
      y += 14;
    }
  }

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 39, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Resumen económico', 20, y + 9);
  doc.setFontSize(10);
  doc.text(`Precio base: ${formatCurrency(price.basePrice)}`, 20, y + 18);
  doc.text(`Extras: ${formatCurrency(price.extrasPrice)}`, 20, y + 26);
  doc.text(`Precio estimado sin IVA: ${formatCurrency(price.estimatedPriceWithoutVat)}`, 112, y + 18);
  doc.text(`IVA 21%: ${formatCurrency(price.vatAmount)}`, 112, y + 26);
  doc.setTextColor(249, 115, 22);
  doc.setFontSize(13);
  doc.text(`Total con IVA: ${formatCurrency(price.estimatedPriceWithVat)}`, 112, y + 35);
  doc.setTextColor(15, 23, 42);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const legal = 'Documento orientativo sujeto a revisión técnica antes de fabricación. El precio puede variar según transporte, montaje, accesos, materiales y condiciones finales del pedido.';
  doc.text(doc.splitTextToSize(legal, 180), 14, 284);

  const safeName = contact.fullName.trim().toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'cliente';
  doc.save(`presupuesto-${safeName}-${number}.pdf`);
};
