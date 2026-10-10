import { MessageCircle } from 'lucide-react';
import { Button } from '../ui/Ui';

type SequraFinancingSlotProps = {
  amountWithVat: number;
  sku: string;
  consultationUrl: string;
};

export const SequraFinancingSlot = ({
  amountWithVat,
  sku,
  consultationUrl,
}: SequraFinancingSlotProps) => (
  <section
    id="sequra-financing-slot"
    data-amount-cents={Math.round(amountWithVat * 100)}
    data-currency="EUR"
    data-product-reference={sku}
    className="rounded-3xl border border-blue-200 bg-blue-50 p-5"
    aria-labelledby="financing-title"
  >
    <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-blue">Compra financiada</p>
    <h2 id="financing-title" className="mt-2 text-xl font-black text-slate-900">
      Financiación online en proceso de activación
    </h2>
    <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
      Esta ficha está preparada para incorporar el simulador y el pago de SeQura cuando el comercio sea validado.
    </p>
    <a href={consultationUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex">
      <Button variant="secondary"><MessageCircle size={18} /> Consultar esta configuración</Button>
    </a>
  </section>
);
